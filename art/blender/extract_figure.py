"""
The Tripo GLB was generated from the turnaround sheet → 4 figures side by side along X.
Keep only the front-facing one (lowest X), stand it at the origin, 2 units tall, save a .blend + renders.
Headless:  art/blender/blbg.sh art/blender/extract_figure.py
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector

ROOT = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art")
SRC = f"{ROOT}/me/stylized character 3d model.glb"
OUT_BLEND = f"{ROOT}/blender/me_tripo.blend"
RENDERS = f"{ROOT}/blender/renders"
PICK = globals().get("PICK", 0)          # 0 = leftmost (front-facing) figure

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=SRC)
obj = next(o for o in bpy.data.objects if o.type == "MESH")
obj.name = "Me"

# --- find the figures: gaps in the X distribution of vertices
xs = [v.co.x for v in obj.data.vertices]
lo, hi = min(xs), max(xs)
BINS = 400
hist = [0] * BINS
for x in xs:
    hist[min(BINS - 1, int((x - lo) / (hi - lo) * BINS))] += 1
clusters, start = [], None
for i, n in enumerate(hist + [0]):
    if n and start is None:
        start = i
    elif not n and start is not None:
        clusters.append((start, i))
        start = None
# merge tiny slivers into neighbours (stray hair bits etc.)
clusters = [c for c in clusters if sum(hist[c[0]:c[1]]) > len(xs) * 0.02]
x0 = lo + clusters[PICK][0] / BINS * (hi - lo)
x1 = lo + clusters[PICK][1] / BINS * (hi - lo)

bm = bmesh.new()
bm.from_mesh(obj.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not (x0 <= v.co.x <= x1)], context="VERTS")
bm.to_mesh(obj.data)
bm.free()

# --- normalise: feet on z=0, centred, 2 units tall (same scale as build_avatar.py)
bpy.context.view_layer.update()
cs = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
blo = Vector(map(min, *cs))
bhi = Vector(map(max, *cs))
s = 2.0 / (bhi.z - blo.z)
obj.scale = obj.scale * s
obj.location -= Vector(((blo.x + bhi.x) / 2, (blo.y + bhi.y) / 2, blo.z)) * s
bpy.context.view_layer.update()
bpy.ops.object.select_all(action="DESELECT")
obj.select_set(True)
bpy.context.view_layer.objects.active = obj
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# --- studio for judging the textured model
scene = bpy.context.scene
for name, rot, energy in (("Key", (math.radians(50), 0, math.radians(-35)), 3.5),
                          ("Fill", (math.radians(65), 0, math.radians(140)), 1.2)):
    lamp = bpy.data.objects.new(name, bpy.data.lights.new(name, "SUN"))
    lamp.data.energy = energy
    lamp.rotation_euler = rot
    scene.collection.objects.link(lamp)
cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 70
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = scene.render.resolution_y = 900
scene.view_settings.view_transform = "AgX"
world = scene.world or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.03, 0.03, 0.035, 1)


def shoot(label, ang, target, dist, h=0.0):
    a = math.radians(ang)
    cam.location = target + Vector((math.sin(a) * dist, -math.cos(a) * dist, h))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = f"{RENDERS}/{label}.png"
    bpy.ops.render.render(write_still=True)


body = Vector((0, 0, 1.0))
for label, ang in (("me_front", 0), ("me_three_quarter", -35), ("me_side", -90), ("me_back", 180)):
    shoot(label, ang, body, 6.0, 0.3)
face = Vector((0, 0, 1.62))
shoot("me_face", 0, face, 1.8)
shoot("me_face_34", -30, face, 1.8)

bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
result = {"figures_found": len(clusters), "kept_faces": len(obj.data.polygons), "kept_verts": len(obj.data.vertices),
          "dims": [round(v, 3) for v in obj.dimensions], "blend": OUT_BLEND}
