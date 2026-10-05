"""Export the finished figure (me_tripo_web.blend) as a textured FBX for Mixamo auto-rigging → art/models/me-for-mixamo.fbx
Headless:  art/blender/blbg.sh art/blender/export_mixamo.py"""
import os
import bpy

ROOT = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art")
bpy.ops.wm.open_mainfile(filepath=f"{ROOT}/blender/me_tripo_web.blend")
obj = bpy.data.objects["Me"]
for o in bpy.data.objects:
    o.select_set(o == obj)
bpy.context.view_layer.objects.active = obj
# Mixamo expects Y-up, metres, facing +Z; feet already at the origin from extract_figure.py.
out = f"{ROOT}/models/me-for-mixamo.fbx"
bpy.ops.export_scene.fbx(
    filepath=out, use_selection=True, object_types={"MESH"}, apply_unit_scale=True, apply_scale_options="FBX_SCALE_ALL",
    axis_forward="-Z", axis_up="Y", path_mode="COPY", embed_textures=True, mesh_smooth_type="FACE",
)
result = {"fbx": out, "mb": round(os.path.getsize(out) / 1e6, 2), "faces": len(obj.data.polygons)}
