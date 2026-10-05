"""Export the finished figure as OBJ + MTL + textures, zipped for Mixamo → art/models/me-for-mixamo-obj.zip
Headless:  art/blender/blbg.sh art/blender/export_mixamo_obj.py"""
import os
import shutil
import zipfile

import bpy

ROOT = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art")
OUT_DIR = f"{ROOT}/models/me-obj"
ZIP = f"{ROOT}/models/me-for-mixamo-obj.zip"

bpy.ops.wm.open_mainfile(filepath=f"{ROOT}/blender/me_tripo_web.blend")
obj = bpy.data.objects["Me"]

shutil.rmtree(OUT_DIR, ignore_errors=True)
os.makedirs(OUT_DIR)

# Packed (edited) textures → real files next to the OBJ, with simple names the .mtl can reference.
for img in bpy.data.images:
    if not img.users or img.source != "FILE":
        continue
    kind = "basecolor" if "basecolor" in img.name else "normal" if "normal" in img.name else None
    if not kind:
        continue
    path = f"{OUT_DIR}/me_{kind}.png"
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()
    if img.packed_file:
        img.unpack(method="REMOVE")
    img.filepath = path

for o in bpy.data.objects:
    o.select_set(o == obj)
bpy.context.view_layer.objects.active = obj
bpy.ops.wm.obj_export(
    filepath=f"{OUT_DIR}/me.obj", export_selected_objects=True, apply_modifiers=True,
    forward_axis="NEGATIVE_Z", up_axis="Y", export_materials=True, path_mode="STRIP",
    export_normals=True, export_uv=True, export_triangulated_mesh=False,
)

with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
    for name in sorted(os.listdir(OUT_DIR)):
        z.write(f"{OUT_DIR}/{name}", name)

mtl = open(f"{OUT_DIR}/me.mtl").read()
result = {"zip": ZIP, "zip_mb": round(os.path.getsize(ZIP) / 1e6, 2), "files": sorted(os.listdir(OUT_DIR)),
          "mtl_maps": [l.strip() for l in mtl.splitlines() if l.strip().startswith(("map_", "norm", "bump"))]}
