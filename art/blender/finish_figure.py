"""
Turn the extracted Tripo figure (me_tripo.blend) into art/models/me.raw.glb (uncompressed);
`bun run models` then optimises it into src/assets/models/me.glb (meshopt + WebP) for the site.
Matte clay material, colour tweaks baked into the texture, polygon budget, site-lit renders.
Headless:  art/blender/blbg.sh art/blender/finish_figure.py
"""
import math
import os

import bpy
import numpy as np
from mathutils import Vector

ROOT = os.path.expanduser("~/PersonalProjects/Portfolio_3d")
F = {
    "blend": f"{ROOT}/art/blender/me_tripo.blend",
    "glb": f"{ROOT}/art/models/me.raw.glb",
    "renders": f"{ROOT}/art/blender/renders",
    "faces": 60000,          # web polygon budget
    "tex": 2048,             # texture size (from 4096)
    "roughness": 0.78,       # matte clay instead of Tripo's glossy map
    "skin_lift": 1.0,        # brighten skin-tone pixels only (photo-measured target ≈ #c98d72)
    "dark_gain": 0.45,       # deepen hair/beard (matte surfaces wash blacks out)
}

bpy.ops.wm.open_mainfile(filepath=F["blend"])
obj = bpy.data.objects["Me"]
mat = obj.active_material
nt = mat.node_tree
bsdf = nt.nodes["Principled BSDF"]

# ---- matte clay: drop the roughness/metal map, use constants
for link in list(nt.links):
    if link.to_node == bsdf and link.to_socket.name in ("Roughness", "Metallic"):
        nt.links.remove(link)
bsdf.inputs["Roughness"].default_value = F["roughness"]
bsdf.inputs["Metallic"].default_value = 0.0
for n in [n for n in nt.nodes if n.type in ("SEPARATE_COLOR",) or (n.type == "TEX_IMAGE" and "_rm" in n.image.name)]:
    nt.nodes.remove(n)

# ---- textures: downscale; lift skin tone in the base colour
base_img = next(n.image for n in nt.nodes if n.type == "TEX_IMAGE" and "basecolor" in n.image.name)
normal_img = next(n.image for n in nt.nodes if n.type == "TEX_IMAGE" and "normal" in n.image.name)
for img in (base_img, normal_img):
    img.scale(F["tex"], F["tex"])

# Measure the real hair colour: texture pixels under the crown of the head.
crown_uvs = []
uv_layer = obj.data.uv_layers.active.data
for poly in obj.data.polygons:
    if poly.center.z > 1.86 and poly.normal.z > 0.6:
        crown_uvs.extend(uv_layer[i].uv[:] for i in poly.loop_indices)
F["crown_samples"] = len(crown_uvs)

# Where darkening is allowed: texels belonging to the head (hair/beard/brows) or trousers — never the shirt.
MASK = 512
mask = np.zeros((MASK, MASK), dtype=bool)
for poly in obj.data.polygons:
    z = poly.center.z
    if z > 1.42 or 0.14 < z < 0.84:
        for i in poly.loop_indices:
            u, v = uv_layer[i].uv
            mask[min(MASK - 1, int(v * MASK)), min(MASK - 1, int(u * MASK))] = True
for _ in range(3):                                   # dilate to close gaps between sampled points
    mask = mask | np.roll(mask, 1, 0) | np.roll(mask, -1, 0) | np.roll(mask, 1, 1) | np.roll(mask, -1, 1)
F["mask_pct"] = round(float(mask.mean()) * 100, 1)

px = np.empty(F["tex"] * F["tex"] * 4, dtype=np.float32)
base_img.pixels.foreach_get(px)
px = px.reshape(-1, 4)
rgb = px[:, :3]
mx = rgb.max(1)
mn = rgb.min(1)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]
# Warm brown/orange hues with real saturation = skin (hair is near-black, shirt near-white, so untouched).
skin = (r >= g) & (g >= b) & (sat > 0.22) & (mx > 0.04) & (mx < 0.85)
cu = np.clip((np.array(crown_uvs) * F["tex"]).astype(int), 0, F["tex"] - 1)
hair_v = px[cu[:, 1] * F["tex"] + cu[:, 0], :3].max(1)
dark_cut = float(np.percentile(hair_v, 95)) + 0.03     # everything at least as dark as the hair
up = F["tex"] // MASK
region = np.repeat(np.repeat(mask, up, 0), up, 1).ravel()
dark = (mx <= dark_cut) & (sat < 0.45) & ~skin & region
gain = np.where(skin, F["skin_lift"], np.where(dark, F["dark_gain"], 1.0))[:, None]
rgb[:] = np.clip(rgb * gain, 0, 1)
base_img.pixels.foreach_set(px.ravel())
base_img.update()
for img in (base_img, normal_img):          # make the exporter use the edited pixels
    img.pack()

# ---- polygon budget
dec = obj.modifiers.new("Budget", "DECIMATE")
dec.ratio = min(1.0, F["faces"] / len(obj.data.polygons))
bpy.context.view_layer.objects.active = obj
bpy.ops.object.modifier_apply(modifier=dec.name)
for p in obj.data.polygons:
    p.use_smooth = True

# ---- export
os.makedirs(os.path.dirname(F["glb"]), exist_ok=True)
for o in bpy.context.view_layer.objects:
    o.select_set(o == obj)
bpy.ops.export_scene.gltf(
    filepath=F["glb"], export_format="GLB", use_selection=True, export_apply=True,
    export_image_format="AUTO",   # lossless here; gltf-transform does the WebP compression
)

# ---- renders under the site's lighting (dark bg, warm key, lime + cyan rims)
scene = bpy.context.scene
for o in [o for o in bpy.data.objects if o.type == "LIGHT"]:
    bpy.data.objects.remove(o, do_unlink=True)


def lamp(name, loc, energy, color, size=1.5):
    lt = bpy.data.objects.new(name, bpy.data.lights.new(name, "AREA"))
    lt.data.energy, lt.data.color, lt.data.size = energy, color, size
    lt.location = loc
    lt.rotation_euler = (Vector((0, 0, 1.2)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(lt)


lamp("Key", (-2.4, -3.0, 3.0), 380, (1.0, 0.95, 0.9), 2.5)
lamp("Fill", (2.8, -2.4, 1.6), 90, (0.88, 0.92, 1.0), 2.5)
lamp("RimLime", (-2.0, 2.4, 2.4), 300, (0.78, 0.94, 0.38))
lamp("RimCyan", (2.2, 2.0, 2.0), 220, (0.38, 0.78, 0.94))
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.003, 0.003, 0.005, 1)
cam = scene.camera
for label, ang, target, dist in (("final_front", 0, (0, 0, 1.0), 6.0), ("final_three_quarter", -35, (0, 0, 1.0), 6.0),
                                 ("final_face", -20, (0, 0, 1.62), 1.9)):
    a = math.radians(ang)
    t = Vector(target)
    cam.location = t + Vector((math.sin(a) * dist, -math.cos(a) * dist, 0.25))
    cam.rotation_euler = (t - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = f"{F['renders']}/{label}.png"
    bpy.ops.render.render(write_still=True)

# Transparent poster for no-WebGL / reduced-motion visitors (same three-quarter angle as the hero).
scene.render.film_transparent = True
scene.render.resolution_x, scene.render.resolution_y = 800, 1100
a = math.radians(-18)
t = Vector((0, 0, 1.0))
cam.location = t + Vector((math.sin(a) * 6.4, -math.cos(a) * 6.4, 0.35))
cam.rotation_euler = (t - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.render.filepath = F["glb"].replace(".raw.glb", "-poster.png")
bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=F["blend"].replace(".blend", "_web.blend"))
result = {"mask_pct": F["mask_pct"], "crown_samples": F["crown_samples"], "hair_value_p50": round(float(np.median(hair_v)), 3), "dark_cut": round(dark_cut, 3),
          "faces": len(obj.data.polygons), "skin_pixels_pct": round(float(skin.mean()) * 100, 1), "dark_pixels_pct": round(float(dark.mean()) * 100, 1),
          "raw_glb_mb": round(os.path.getsize(F["glb"]) / 1e6, 2)}
