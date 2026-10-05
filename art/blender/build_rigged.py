"""
Combine the Mixamo downloads into one animated figure → art/models/me.raw.glb
(then `bun run models` optimises it into src/assets/models/me.glb).

  idle.fbx       skinned mesh + skeleton + "idle" clip
  throw.fbx      "throw" clip         wave.fbx  "wave" clip         thumbs-up.fbx  "thumbs-up" clip

Fixes on the way: Mixamo read the OBJ's metres as centimetres (figure came back 2 cm tall) → rig scaled ×100;
Mixamo's glossy/metallic material → our matte clay material with the corrected textures from me_tripo_web.blend.
Headless:  art/blender/blbg.sh art/blender/build_rigged.py
"""
import os

import bpy

ROOT = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art")
MIX = f"{ROOT}/models/mixamo"
OUT = f"{ROOT}/models/me.raw.glb"
CLIPS = ["throw", "wave", "thumbs-up"]       # + "idle" from the skinned file
ROUGHNESS = 0.78

bpy.ops.wm.read_factory_settings(use_empty=True)


def import_action(path, name):
    before = set(bpy.data.actions)
    bpy.ops.import_scene.fbx(filepath=path)
    action = next(a for a in bpy.data.actions if a not in before)
    action.name = name
    action.use_fake_user = True                  # keep it after its source armature is deleted
    return action


# ---- skinned figure + idle
idle = import_action(f"{MIX}/idle.fbx", "idle")
arm = next(o for o in bpy.data.objects if o.type == "ARMATURE")
arm.name = "Rig"
mesh = next(o for o in bpy.data.objects if o.type == "MESH")
mesh.name = "Me"

# ---- the other clips (motion-only files bring their own armature; keep the action, drop the armature)
for clip in CLIPS:
    import_action(f"{MIX}/{clip}.fbx", clip)
    for o in [o for o in bpy.data.objects if o.type == "ARMATURE" and o != arm]:
        bpy.data.objects.remove(o, do_unlink=True)

# ---- scale fix (2 cm → 2 m)
arm.scale = [v * 100 for v in arm.scale]

# ---- matte clay material with our corrected textures
with bpy.data.libraries.load(f"{ROOT}/blender/me_tripo_web.blend", link=False) as (src, dst):
    dst.images = [n for n in src.images if "basecolor" in n or "normal" in n]
base_img = next(i for i in dst.images if "basecolor" in i.name)
normal_img = next(i for i in dst.images if "normal" in i.name)
normal_img.colorspace_settings.name = "Non-Color"

mat = bpy.data.materials.new("Clay_Me")
mat.use_nodes = True
nt = mat.node_tree
bsdf = nt.nodes["Principled BSDF"]
bsdf.inputs["Roughness"].default_value = ROUGHNESS
bsdf.inputs["Metallic"].default_value = 0.0
tex = nt.nodes.new("ShaderNodeTexImage")
tex.image = base_img
nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
ntex = nt.nodes.new("ShaderNodeTexImage")
ntex.image = normal_img
nmap = nt.nodes.new("ShaderNodeNormalMap")
nt.links.new(ntex.outputs["Color"], nmap.inputs["Color"])
nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
mesh.data.materials.clear()
mesh.data.materials.append(mat)

# ---- start in the idle pose
arm.animation_data_create()
arm.animation_data.action = idle
if hasattr(arm.animation_data, "action_slot") and idle.slots:
    arm.animation_data.action_slot = idle.slots[0]

# ---- export every action as its own named glTF animation
os.makedirs(os.path.dirname(OUT), exist_ok=True)
for o in bpy.data.objects:
    o.select_set(o in (arm, mesh))
bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=True,
    export_animations=True, export_animation_mode="ACTIONS", export_anim_single_armature=True,
    export_force_sampling=True, export_optimize_animation_size=True,
    export_image_format="AUTO", export_skins=True, export_def_bones=True,
)

result = {
    "actions": {a.name: [int(v) for v in a.frame_range] for a in bpy.data.actions},
    "bones": len(arm.data.bones),
    "raw_mb": round(os.path.getsize(OUT) / 1e6, 2),
}
