"""
Fallback colouring for the untextured scan ("ScanClean"): project the clay concept image from the
front, fill back/hidden areas by rules, snap every vertex to a flat clay palette → vertex colours.
Run after clean_scan.py:  python3 art/blender/bl.py art/blender/color_scan.py
"""
import os

import bpy
from mathutils import Vector

IMG = os.path.expanduser("~/PersonalProjects/Portfolio_3d/art/me/02-clay-concept.jpg")
PALETTE = {               # sRGB
    "skin": (201, 141, 114),
    "hair": (27, 27, 27),
    "shirt": (238, 236, 230),
    "pants": (31, 34, 48),
    "shoes": (242, 242, 242),
    "laptop": (150, 175, 120),
    "glow": (200, 240, 96),
    "base": (26, 28, 34),
}

obj = bpy.data.objects["ScanClean"]
me = obj.data
W = obj.matrix_world
verts = [W @ v.co for v in me.vertices]
lo = Vector(map(min, *verts))
hi = Vector(map(max, *verts))
height = hi.z - lo.z

# ---- image: find the figure's bounding box (bright pixels vs the near-black background)
img = bpy.data.images.load(IMG, check_existing=True)
iw, ih = img.size
px = list(img.pixels)            # RGBA floats, bottom-up rows


def pix(u, v):
    x = min(iw - 1, max(0, int(u)))
    y = min(ih - 1, max(0, int(v)))
    i = (y * iw + x) * 4
    return px[i], px[i + 1], px[i + 2]


xs, ys = [], []
for y in range(0, ih, 4):
    for x in range(0, iw, 4):
        r, g, b = pix(x, y)
        if r + g + b > 0.45:
            xs.append(x)
            ys.append(y)
ux0, ux1 = min(xs), max(xs)
vy0, vy1 = min(ys), max(ys)


def project(p):
    """Mesh (x, z) → image (u, v); front view, image right = +X, image up = +Z."""
    u = ux0 + (p.x - lo.x) / (hi.x - lo.x) * (ux1 - ux0)
    v = vy0 + (p.z - lo.z) / (hi.z - lo.z) * (vy1 - vy0)
    return u, v


def nearest(rgb):
    r, g, b = (c * 255 for c in rgb)
    return min(PALETTE, key=lambda k: (PALETTE[k][0] - r) ** 2 * 0.3 + (PALETTE[k][1] - g) ** 2 * 0.59 + (PALETTE[k][2] - b) ** 2 * 0.11)


# Head centre for "back of head = hair".
head_z0 = lo.z + height * 0.70
head_pts = [p for p in verts if p.z > head_z0]
head_c = sum(head_pts, Vector()) / len(head_pts)

normals = [W.to_3x3() @ v.normal for v in me.vertices]
labels = []
for p, n in zip(verts, normals):
    t = (p.z - lo.z) / height
    if t < 0.055:
        labels.append("base")
        continue
    if t > 0.70 and (p.y > head_c.y + 0.02 or (t > 0.93 and n.z > 0.3)):
        labels.append("hair")                 # back / crown of head
        continue
    lab = nearest(pix(*project(p)))
    if n.y > 0.25:                            # back-facing: the front image doesn't see it
        lab = {"skin": "skin" if t < 0.70 else "hair", "glow": "laptop"}.get(lab, lab)
    if lab == "base" and t > 0.08:            # dark background bleeding through silhouette edges
        lab = "hair" if t > 0.70 else "pants" if t < 0.45 else "shirt"
    labels.append(lab)

# ---- write vertex colours (linear, as Blender stores them)
def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


attr = me.color_attributes.get("Col") or me.color_attributes.new("Col", "BYTE_COLOR", "POINT")
for i, lab in enumerate(labels):
    r, g, b = PALETTE[lab]
    attr.data[i].color = (lin(r), lin(g), lin(b), 1.0)
me.color_attributes.active_color = attr

# ---- clay material reading the vertex colours
mat = bpy.data.materials.get("Clay_Scan") or bpy.data.materials.new("Clay_Scan")
mat.use_nodes = True
nt = mat.node_tree
nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
bsdf.inputs["Roughness"].default_value = 0.8
bsdf.inputs["Subsurface Weight"].default_value = 0.06
vc = nt.nodes.new("ShaderNodeVertexColor")
vc.layer_name = "Col"
nt.links.new(vc.outputs["Color"], bsdf.inputs["Base Color"])
nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
me.materials.clear()
me.materials.append(mat)

from collections import Counter
result = {"image_bbox": [ux0, vy0, ux1, vy1], "counts": Counter(labels)}
