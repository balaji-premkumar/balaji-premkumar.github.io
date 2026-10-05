"""
Builds the stylised clay figurine in the open Blender (idempotent — rebuilds collection "Avatar").
Run:  python3 art/blender/bl.py art/blender/build_avatar.py

Tweak P below; likeness traits (skin, hair, glasses, beard, outfit) are matched from the user's photo.
"""
import math
import os

import bpy
from mathutils import Vector

P = {
    # Likeness — sampled from art/me/me-crop.jpg (skin toned down from warm indoor light).
    "skin": "#c98d72",
    "hair": "#1b1b1b",
    "shirt": "#f2f0ea",   # his white shirt, warm-white so it still reads as clay
    "pants": "#2a2e38",
    "shoes": "#eeeef2",
    "watch": "#141418",
    "beard": True,
    # Scene (dark clay).
    "bg": "#0a0a0f",
    "base": "#16161f",
    "rim_a": "#c8f060",
    "rim_b": "#60c8f0",
    "out_dir": os.path.expanduser("~/PersonalProjects/Portfolio_3d/art/blender/renders"),
}


def hex_rgba(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


# ---------------------------------------------------------------- reset
col = bpy.data.collections.get("Avatar")
if col:
    for o in list(col.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)
else:
    col = bpy.data.collections.new("Avatar")
    bpy.context.scene.collection.children.link(col)
for name in ("Cube",):
    if name in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects[name], do_unlink=True)
for m in [m for m in bpy.data.meshes if m.users == 0]:
    bpy.data.meshes.remove(m)

root = bpy.data.objects.new("Avatar", None)
col.objects.link(root)


# ---------------------------------------------------------------- materials
def clay(name, color, rough=0.82, sss=0.08):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = hex_rgba(color)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Subsurface Weight"].default_value = sss
    bsdf.inputs["Subsurface Radius"].default_value = (0.2, 0.1, 0.06)
    # Fine "thumbprint" bump so it reads as hand-made clay.
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 38.0
    noise.inputs["Detail"].default_value = 6.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.18
    bump.inputs["Distance"].default_value = 0.02
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


M = {k: clay(f"Clay_{k}", P[k]) for k in ("skin", "hair", "shirt", "pants", "shoes", "base")}
M["eye"] = clay("Clay_eye", "#0b0b0e", rough=0.35, sss=0.0)
M["watch"] = clay("Clay_watch", P["watch"], rough=0.4, sss=0.0)
M["mouth"] = clay("Clay_mouth", "#5a2a24", rough=0.7, sss=0.0)


# ---------------------------------------------------------------- helpers
def finish(obj, mat, subdiv=2, wobble=0.004):
    """Assign material, smooth, and add a tiny surface wobble for a hand-sculpted feel."""
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    if subdiv:
        sd = obj.modifiers.new("Subdiv", "SUBSURF")
        sd.levels = sd.render_levels = subdiv
    if wobble:
        tex = bpy.data.textures.get("ClayWobble") or bpy.data.textures.new("ClayWobble", "CLOUDS")
        tex.noise_scale = 0.12
        d = obj.modifiers.new("Wobble", "DISPLACE")
        d.texture = tex
        d.strength = wobble
        d.mid_level = 0.5
    obj.parent = root
    return obj


def sphere(name, loc, radius, scale=(1, 1, 1), mat=None, segs=48, **kw):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    col.objects.link(obj)
    import bmesh
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=segs // 2, radius=radius)
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.scale = scale
    return finish(obj, mat, **kw)


def blob(name, parts, mat, voxel=0.012):
    """
    Union of ellipsoids fused into one seamless clay-like surface (voxel remesh).
    parts: (center, semi_axes, rot_deg_xyz | None, cut | None); cut = (point, normal) keeps the side the normal points to.
    """
    import bmesh
    from mathutils import Euler, Matrix
    bm = bmesh.new()
    for center, semi, rot, cut in parts:
        piece = bmesh.new()
        bmesh.ops.create_uvsphere(piece, u_segments=40, v_segments=20, radius=1.0)
        m = Matrix.Translation(center) @ Euler([math.radians(v) for v in (rot or (0, 0, 0))]).to_matrix().to_4x4() \
            @ Matrix.Diagonal((*semi, 1.0))
        bmesh.ops.transform(piece, matrix=m, verts=piece.verts)
        if cut:
            co, no = cut
            res = bmesh.ops.bisect_plane(piece, geom=piece.verts[:] + piece.edges[:] + piece.faces[:],
                                         plane_co=co, plane_no=[-v for v in no], clear_outer=True)
            edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
            bmesh.ops.edgeloop_fill(piece, edges=edges)
        tmp = bpy.data.meshes.new("tmp")
        piece.to_mesh(tmp)
        piece.free()
        bm.from_mesh(tmp)
        bpy.data.meshes.remove(tmp)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    col.objects.link(obj)
    rm = obj.modifiers.new("Fuse", "REMESH")
    rm.mode = "VOXEL"
    rm.voxel_size = voxel
    rm.use_smooth_shade = True
    sm = obj.modifiers.new("Soften", "CORRECTIVE_SMOOTH")
    sm.iterations = 6
    sm.smooth_type = "LENGTH_WEIGHTED"
    return finish(obj, mat, subdiv=0)


# ---------------------------------------------------------------- figure (faces -Y)
HEAD_Z = 1.42

blob("Pants", [
    ((0, 0, 0.58), (0.195, 0.145, 0.10), None, None),               # hips (tucked under the shirt hem)
    ((-0.11, 0, 0.38), (0.095, 0.095, 0.21), (0, 4, 0), None),       # legs
    ((0.11, 0, 0.38), (0.095, 0.095, 0.21), (0, -4, 0), None),
], M["pants"])

blob("Shirt", [
    ((0, 0, 0.84), (0.25, 0.17, 0.26), None, None),                 # torso
    ((0, 0, 0.98), (0.27, 0.16, 0.12), None, None),                 # soft shoulder line
    ((-0.30, 0, 0.88), (0.08, 0.08, 0.16), (0, -12, 0), None),     # sleeves to the elbow
    ((0.30, 0, 0.88), (0.08, 0.08, 0.16), (0, 12, 0), None),
    ((-0.325, 0, 0.75), (0.09, 0.09, 0.035), (0, -10, 0), None),    # rolled cuffs
    ((0.325, 0, 0.75), (0.09, 0.09, 0.035), (0, 10, 0), None),
    ((-0.07, -0.11, 1.07), (0.085, 0.04, 0.05), (20, 0, -35), None), # open collar
    ((0.07, -0.11, 1.07), (0.085, 0.04, 0.05), (20, 0, 35), None),
], M["shirt"])

for x, mat in ((-0.352, M["watch"]), (0.352, M["shoes"])):            # watch (left) + silver-ish band (right)
    sphere(f"Wrist_{'L' if x < 0 else 'R'}", (x, -0.005, 0.635), 0.06, (1.15, 1.15, 0.38), mat, subdiv=1, wobble=0)

blob("Arms", [
    ((-0.345, 0, 0.69), (0.062, 0.062, 0.09), (0, -8, 0), None),    # forearms (below rolled cuffs)
    ((0.345, 0, 0.69), (0.062, 0.062, 0.09), (0, 8, 0), None),
    ((-0.36, -0.01, 0.585), (0.072, 0.065, 0.078), None, None),     # hands
    ((0.36, -0.01, 0.585), (0.072, 0.065, 0.078), None, None),
], M["skin"])

for x in (-0.12, 0.12):
    sphere(f"Shoe_{'L' if x < 0 else 'R'}", (x, -0.04, 0.13), 0.1, (1.0, 1.5, 0.66), M["shoes"])

sphere("Neck", (0, 0, 1.10), 0.09, (1, 1, 1.2), M["skin"], subdiv=1)
head = sphere("Head", (0, 0, HEAD_Z), 0.36, (1.0, 0.94, 0.98), M["skin"])

# Face
for x in (-0.12, 0.12):
    sphere(f"Eye_{'L' if x < 0 else 'R'}", (x, -0.315, HEAD_Z + 0.03), 0.045, (1, 0.6, 1.25), M["eye"], subdiv=1, wobble=0)
    sphere(f"Ear_{'L' if x < 0 else 'R'}", (x * 2.95, 0.0, HEAD_Z), 0.075, (0.55, 0.9, 1.15), M["skin"])
    sphere(f"Brow_{'L' if x < 0 else 'R'}", (x * 1.05, -0.318, HEAD_Z + 0.115), 0.05, (1.45, 0.42, 0.42), M["hair"], subdiv=1, wobble=0)
sphere("Nose", (0, -0.345, HEAD_Z - 0.04), 0.045, (0.9, 0.8, 0.9), M["skin"])

# Smile: a short bevelled arc.
curve = bpy.data.curves.new("Smile", "CURVE")
curve.dimensions = "3D"
curve.bevel_depth = 0.012
curve.bevel_resolution = 4
spl = curve.splines.new("BEZIER")
spl.bezier_points.add(2)
for bp, (x, z) in zip(spl.bezier_points, [(-0.055, -0.128), (0, -0.15), (0.055, -0.128)]):
    y = -0.335 + abs(x) * 0.3
    bp.co = (x, y, HEAD_Z + z)
    bp.handle_left_type = bp.handle_right_type = "AUTO"
smile = bpy.data.objects.new("Smile", curve)
col.objects.link(smile)
curve.materials.append(M["mouth"])
smile.parent = root

# Hair: a cap over the top/back of the head plus a few chunky clay tufts in front.
blob("Hair", [
    # Swept-back wavy hair (turnaround ref): cap + raised volume on top/front, ears left visible.
    ((0, 0.04, HEAD_Z + 0.0), (0.385, 0.385, 0.385), None, ((0, -0.2, HEAD_Z + 0.12), (0, 2.0, 1))),
    ((0, -0.05, HEAD_Z + 0.25), (0.33, 0.3, 0.15), (-12, 0, 0), None),      # top volume, swept back
    ((-0.12, -0.24, HEAD_Z + 0.26), (0.17, 0.11, 0.1), (0, 0, 18), None),   # side-parted front wave
    ((0.12, -0.23, HEAD_Z + 0.28), (0.18, 0.11, 0.1), (0, 0, -10), None),
    ((0, 0.24, HEAD_Z + 0.05), (0.32, 0.14, 0.26), None, None),             # full back
], M["hair"], voxel=0.01)

if P["beard"]:
    blob("Beard", [
        # Jawline beard: a shell hugging the lower face, trimmed above the jaw so cheeks stay clear.
        ((0, -0.1, HEAD_Z - 0.15), (0.3, 0.215, 0.17), None, ((0, -0.3, HEAD_Z - 0.12), (0, 0.3, -1))),
        ((0, -0.24, HEAD_Z - 0.29), (0.11, 0.085, 0.085), None, None),        # slightly pointed chin
    ], M["hair"], voxel=0.008)
    blob("Moustache", [
        ((-0.055, -0.338, HEAD_Z - 0.085), (0.065, 0.03, 0.026), (0, 0, 14), None),
        ((0.055, -0.338, HEAD_Z - 0.085), (0.065, 0.03, 0.026), (0, 0, -14), None),
        ((-0.105, -0.312, HEAD_Z - 0.13), (0.022, 0.025, 0.055), None, None),   # corners down into the beard
        ((0.105, -0.312, HEAD_Z - 0.13), (0.022, 0.025, 0.055), None, None),
        ((0, -0.333, HEAD_Z - 0.185), (0.026, 0.016, 0.03), None, None),        # tuft under the lip
    ], M["hair"], voxel=0.006)

# Base disc.
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.62, depth=0.12, location=(0, 0, 0.0))
base = bpy.context.active_object
for c in base.users_collection:
    c.objects.unlink(base)
col.objects.link(base)
base.name = "Base"
bev = base.modifiers.new("Bevel", "BEVEL")
bev.width = 0.04
bev.segments = 6
finish(base, M["base"], subdiv=0, wobble=0)

# ---------------------------------------------------------------- stage: world, lights, camera
scene = bpy.context.scene
world = scene.world or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = hex_rgba(P["bg"])
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0

for name in ("Light", "Key", "RimA", "RimB", "Fill"):
    if name in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects[name], do_unlink=True)


def area(name, loc, energy, color, size):
    data = bpy.data.lights.get(name) or bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = hex_rgba(color)[:3]
    data.size = size
    obj = bpy.data.objects.new(name, data)
    col.objects.link(obj)
    obj.location = loc
    track = obj.constraints.new("TRACK_TO")
    track.target = head
    return obj


area("Key", (-2.2, -2.6, 2.8), 260, "#fff4e8", 2.0)     # soft warm key
area("Fill", (2.6, -2.2, 1.4), 60, "#dfe8ff", 2.5)      # cool fill
area("RimA", (-1.8, 2.0, 2.2), 220, P["rim_a"], 1.0)    # brand lime rim
area("RimB", (2.0, 1.8, 1.8), 160, P["rim_b"], 1.0)     # cyan rim

cam = bpy.data.objects.get("Camera")
cam.data.lens = 70
target = Vector((0, 0, 0.92))
cam.constraints.clear()


def shoot(label, angle_deg, dist=5.2, height=1.55):
    a = math.radians(angle_deg)
    cam.location = (math.sin(a) * dist, -math.cos(a) * dist, height)
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(P["out_dir"], f"{label}.png")
    bpy.ops.render.render(write_still=True)


r = scene.render
r.engine = "BLENDER_EEVEE"
r.resolution_x = r.resolution_y = 900
r.film_transparent = False
scene.eevee.taa_render_samples = 48
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

os.makedirs(P["out_dir"], exist_ok=True)
for label, ang in (("front", 0), ("three_quarter", -35), ("side", -90)):
    shoot(label, ang)

result = {"objects": len(col.all_objects), "renders": sorted(os.listdir(P["out_dir"]))}
