# Re-skin the Tripo rig with Blender's automatic (bone heat) weights. Tripo's export leaves most vertices
# unweighted, which glTF turns into 100% Hips, so arms tear as soon as a bone moves.
# Run after fix_skeleton.ts:  art/blender/blbg.sh art/blender/reskin.py 'SRC="in.glb"; OUT="out.glb"'
import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
mesh = max((o for o in bpy.data.objects if o.type == 'MESH'), key=lambda o: len(o.data.vertices))  # skip importer bone shapes

# Leaf "_End" bones carry no skin; keep them out of the heat solve.
for b in arm.data.bones:
    b.use_deform = not b.name.endswith('_End')

# The export splits vertices at UV seams; bone heat needs a connected surface.
bpy.context.view_layer.objects.active = mesh
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=1e-4)
bpy.ops.object.mode_set(mode='OBJECT')

mesh.vertex_groups.clear()
mesh.modifiers.clear()
mesh.parent = None
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_AUTO')

# Bone heat fails silently on bad topology; count vertices that ended up with no weights.
empty = sum(1 for v in mesh.data.vertices if not any(g.weight > 0 for g in v.groups))
bpy.ops.export_scene.gltf(filepath=OUT, export_animations=False, export_yup=True)
result = {'groups': len(mesh.vertex_groups), 'verts': len(mesh.data.vertices), 'unweighted': empty}
