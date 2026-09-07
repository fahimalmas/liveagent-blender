---
name: blender-universal-master
description: Authoritative universal skill for procedural 3D modeling, hard-surface greebling, modular collections, pivot-based rigging, and automated keyframed animation in Blender 5.1/5.2 LTS and EEVEE Next.
metadata:
  short-description: Universal master craftsmanship and automated animation for Blender 5.x
---

# Blender 5.2 LTS Universal Master Modeler & Animator Skill

This skill defines the universal procedural architecture for generating production-grade, inspectable, and animated 3D assets of **ANY** category (Vehicles, Spacecraft, Robotics, Electronics, Architecture, Functional Furniture, Organic Botany, or Industrial Gadgets) in **Blender 5.2 LTS** using pure Python (`bpy`).

---

## 1. The 5 Immutable Universal Laws (The Core Contract)

Every generated scene must obey these 5 core engineering laws:

### Law 1: The Master Controller (`CTRL_Master`)
- Never leave geometry unparented in world space.
- Every asset must be anchored to a single top-level Empty named `CTRL_Master` (or `CTRL_Ship`, `CTRL_Vehicle`, `CTRL_Robot`).
- Whole-object translation, rotation, and scaling must happen **ONLY** via `CTRL_Master`.
- Always set `matrix_parent_inverse = parent.matrix_world.inverted()` when parenting pre-positioned elements.

### Law 2: Modular Collections Architecture
Organize objects cleanly into semantic collections rather than dumping objects into the root:
```python
COLLECTIONS = ("Primary_Body", "Articulated_Mechanisms", "Details_Greebles", "Lights_Fx", "Rig_Controllers")
```

### Law 3: The 3-Band Visual Detail Hierarchy (Greebling Law)
Detail must never be random noise; it must follow natural proportional bands relative to total length $L$:
1. **Primary Silhouette ($0.15L - 0.50L$):** Main chassis, hull, body, wings, major shells.
2. **Secondary Functional Elements ($0.02L - 0.15L$):** Hinges, cockpits, intakes, exhausts, joints, wheels, weapons, dials.
3. **Tertiary Surface Greebles ($0.002L - 0.02L$):** Bolts, vent slats, seams, conduit collars, bevelled edge trims.

### Law 4: Symmetrical Mirror-Safe Loops
Never eyeball bilateral symmetry. Always iterate with signs:
```python
for sx in (-1, 1):
    position = (sx * base_x, base_y, base_z)
    # create mirrored element...
```

### Law 5: Pivot-Based Articulation & Smooth Animation
- For any moving part (wheels, wings, doors, clock hands, solar panels, robotic limbs):
  Create a dedicated Empty at the physical hinge/pivot point (`CTRL_Pivot_*`).
  Parent the panel/part to that hinge empty.
  Animate the hinge empty via `keyframe_insert(data_path="rotation_euler", frame=...)`.
  Smooth interpolation using `point.interpolation = 'BEZIER'`.

---

## 2. Standard Universal Template (Object Mode Pure Python)

```python
import bpy
import math
from math import radians

# 1. Verification and Safe Setup
if bpy.context.object and bpy.context.object.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# 2. Namespace & Collections
ROOT_NAME = "Asset_Generated"
root_col = bpy.data.collections.new(ROOT_NAME)
bpy.context.scene.collection.children.link(root_col)

def get_subcol(name):
    col = bpy.data.collections.new(name)
    root_col.children.link(col)
    return col

col_body = get_subcol("01_Primary_Body")
col_mov = get_subcol("02_Articulations")
col_greebles = get_subcol("03_Greebles")
col_lights = get_subcol("04_Lights_Fx")
col_rig = get_subcol("05_Rig")

# 3. Master Controller
master_ctrl = bpy.data.objects.new("CTRL_Master", None)
master_ctrl.empty_display_type = 'PLAIN_AXES'
master_ctrl.empty_display_size = 0.8
col_rig.objects.link(master_ctrl)

def parent_to(obj, parent):
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()

# 4. Universal Principled BSDF Materials (Blender 5.2 Standard)
def create_mat(name, color, metallic=0.0, roughness=0.3, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission:
        bsdf.inputs['Emission Color'].default_value = (*emission, 1.0)
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    return mat

mat_hull = create_mat("MAT_Hull", (0.35, 0.38, 0.42), metallic=0.8, roughness=0.25)
mat_dark = create_mat("MAT_DarkTrim", (0.04, 0.04, 0.05), metallic=0.9, roughness=0.2)
mat_accent = create_mat("MAT_Accent_Red", (0.75, 0.02, 0.03), metallic=0.2, roughness=0.3)
mat_glow = create_mat("MAT_PlasmaGlow", (0.1, 0.5, 1.0), metallic=0.0, roughness=0.1, emission=(0.1, 0.5, 1.0), emission_strength=15.0)

# 5. Non-destructive Bevel Utility
def apply_bevel(obj, width=0.015):
    bev = obj.modifiers.new("Edge_Bevel", 'BEVEL')
    bev.width = width
    bev.segments = 2
    bev.limit_method = 'ANGLE'
    bpy.ops.object.shade_smooth()
```

---

## 3. Automated Procedural Keyframe Animation Pattern

To deliver dynamic models that come to life in Blender upon hitting the **Spacebar** (Play):

```python
FRAME_START = 1
FRAME_TRANSITION = 60
FRAME_END = 120

# Setting frame bounds
scene = bpy.context.scene
scene.frame_start = FRAME_START
scene.frame_end = FRAME_END
scene.render.engine = 'BLENDER_EEVEE'
scene.render.fps = 24

# Keyframing an articulated pivot:
hinge.rotation_mode = 'XYZ'
hinge.rotation_euler = (0, 0, 0)
hinge.keyframe_insert(data_path="rotation_euler", frame=FRAME_START)

hinge.rotation_euler.y = math.radians(30)
hinge.keyframe_insert(data_path="rotation_euler", frame=FRAME_TRANSITION)

# Keyframing the Master Controller (Movement forward along +Y):
master_ctrl.location = (0, 0, 0)
master_ctrl.keyframe_insert(data_path="location", frame=FRAME_START)
master_ctrl.location = (0, 25.0, 0)
master_ctrl.keyframe_insert(data_path="location", frame=FRAME_END)

# Smooth Bezier interpolation curves
if master_ctrl.animation_data and master_ctrl.animation_data.action:
    for fcurve in master_ctrl.animation_data.action.fcurves:
        for kp in fcurve.keyframe_points:
            kp.interpolation = 'BEZIER'
```

---

## 4. Strict Blender 5.x Breaking Change Checklist

| Forbidden Legacy Syntax | Mandatory Modern Blender 5.2 LTS Syntax |
| :--- | :--- |
| `scene.render.engine = 'BLENDER_EEVEE_NEXT'` | `scene.render.engine = 'BLENDER_EEVEE'` |
| `material.shadow_method = 'NONE'` | Property removed; DO NOT set. |
| `scene.eevee.use_bloom` | Removed; use Compositor Glare or emission brightness. |
| `scene.eevee.use_ssr` / `use_gtao` | Removed; native to EEVEE Next raytracing. |
| `inputs['Transmission']` | `inputs['Transmission Weight']` |
| `inputs['Specular']` | `inputs['Specular IOR Level']` |
| `inputs['Emission']` | `inputs['Emission Color']` & `inputs['Emission Strength']` |
