"""
Clean the Hunyuan3D scan (collection "Scan") into a web-ready mesh "ScanClean":
smooth away voxel stair-steps → uniform voxel remesh → decimate. Original stays untouched.
Run after inspect_glb.py:  python3 art/blender/bl.py art/blender/clean_scan.py
"""
import bpy

C = {
    "smooth_factor": 0.6,     # Laplacian smoothing of stair-steps
    "smooth_repeat": 12,
    "voxel": 0.006,           # remesh resolution (model is ~2 units tall)
    "target_faces": 50000,    # web budget
}

src = next(o for o in bpy.data.collections["Scan"].objects if o.type == "MESH")
old = bpy.data.objects.get("ScanClean")
if old:
    bpy.data.objects.remove(old, do_unlink=True)

obj = src.copy()
obj.data = src.data.copy()
obj.name = obj.data.name = "ScanClean"
bpy.data.collections["Scan"].objects.link(obj)
src.hide_render = src.hide_viewport = True

lap = obj.modifiers.new("Destep", "LAPLACIANSMOOTH")
lap.lambda_factor = C["smooth_factor"]
lap.iterations = C["smooth_repeat"]
lap.use_volume_preserve = True
rm = obj.modifiers.new("Uniform", "REMESH")
rm.mode = "VOXEL"
rm.voxel_size = C["voxel"]
cs = obj.modifiers.new("Soften", "CORRECTIVE_SMOOTH")
cs.iterations = 4

# Bake the stack so decimation sees the real face count.
dg = bpy.context.evaluated_depsgraph_get()
baked = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
obj.modifiers.clear()
old_mesh = obj.data
obj.data = baked
bpy.data.meshes.remove(old_mesh)

dec = obj.modifiers.new("Budget", "DECIMATE")
dec.ratio = min(1.0, C["target_faces"] / max(1, len(obj.data.polygons)))
dg = bpy.context.evaluated_depsgraph_get()
final = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
obj.modifiers.clear()
before = len(obj.data.polygons)
old_mesh = obj.data
obj.data = final
bpy.data.meshes.remove(old_mesh)
for p in obj.data.polygons:
    p.use_smooth = True

result = {"remeshed_faces": before, "final_faces": len(obj.data.polygons), "verts": len(obj.data.vertices)}
