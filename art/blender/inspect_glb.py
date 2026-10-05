"""Import a GLB into collection "Scan", report stats, render 3 views (Avatar collection hidden).
Set SRC / GREY / PREFIX by prepending assignments, e.g.  SRC = "...glb"; GREY = False"""
import math
import os

import bpy
from mathutils import Vector

SRC = globals().get("SRC") or os.path.expanduser("~/PersonalProjects/Portfolio_3d/art/me/white_mesh.glb")
GREY = globals().get("GREY", True)
PREFIX = globals().get("PREFIX", "scan")
OUT = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art/blender/renders")

col = bpy.data.collections.get("Scan")
if col:
    for o in list(col.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)
else:
    col = bpy.data.collections.new("Scan")
    bpy.context.scene.collection.children.link(col)

for junk in ("Cube",):
    if junk in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects[junk], do_unlink=True)

before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=SRC)
new = [o for o in bpy.data.objects if o not in before]
for o in new:
    for c in o.users_collection:
        c.objects.unlink(o)
    col.objects.link(o)

meshes = [o for o in new if o.type == "MESH"]
stats = []
for o in meshes:
    me = o.data
    stats.append({
        "name": o.name,
        "verts": len(me.vertices),
        "faces": len(me.polygons),
        "materials": [m.name if m else None for m in me.materials],
        "uv_layers": len(me.uv_layers),
        "color_attrs": [a.name for a in me.color_attributes],
        "dims": [round(v, 3) for v in o.dimensions],
    })
images = [(i.name, list(i.size)) for i in bpy.data.images if i.users]

# Frame: normalise so the scan stands on z=0, ~2 units tall, centred.
lo = Vector((1e9,) * 3)
hi = Vector((-1e9,) * 3)
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        lo = Vector(map(min, lo, w))
        hi = Vector(map(max, hi, w))
size = hi - lo

# Hide the scripted avatar while we look at the scan.
av = bpy.data.collections.get("Avatar")
lc = bpy.context.view_layer.layer_collection.children
if av and "Avatar" in lc:
    lc["Avatar"].exclude = True

# Neutral grey clay override so geometry is judged, not texture.
grey = bpy.data.materials.get("Inspect_Grey") or bpy.data.materials.new("Inspect_Grey")
grey.use_nodes = True
grey.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.7
bpy.context.view_layer.material_override = grey if GREY else None

# Studio lights for inspection (the avatar's lights are hidden with its collection).
for name, rot, energy in (("ScanKey", (math.radians(50), 0, math.radians(-35)), 4.0),
                          ("ScanFill", (math.radians(60), 0, math.radians(140)), 1.5)):
    data = bpy.data.lights.get(name) or bpy.data.lights.new(name, "SUN")
    data.energy = energy
    lamp = bpy.data.objects.new(name, data)
    col.objects.link(lamp)
    lamp.rotation_euler = rot

scene = bpy.context.scene
cam = bpy.data.objects["Camera"]
cam.constraints.clear()
center = (lo + hi) / 2
dist = max(size) * 2.6
for label, ang in ((f"{PREFIX}_front", 0), (f"{PREFIX}_three_quarter", -35), (f"{PREFIX}_side", -90), (f"{PREFIX}_back", 180)):
    a = math.radians(ang)
    cam.location = center + Vector((math.sin(a) * dist, -math.cos(a) * dist, size.z * 0.1))
    cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(OUT, label + ".png")
    bpy.ops.render.render(write_still=True)

bpy.context.view_layer.material_override = None
result = {"objects": [o.type for o in new], "meshes": stats, "images": images,
          "bbox_size": [round(v, 3) for v in size], "forward_axis_hint": "check renders"}
