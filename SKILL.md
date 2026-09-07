---
name: blender-5-hard-surface-spacecraft
description: Build organized, high-detail hard-surface spacecraft in Blender 5.1/5.2 with bpy, procedural EEVEE materials, greebles, and repeatable animation. Use for scripted vehicles such as an X-wing; do not use this as a substitute for character sculpting or a production texture-painting pipeline.
metadata:
  short-description: Script detailed animated spacecraft for Blender 5.x
---

# Blender 5.x Hard-Surface Spacecraft Master Skill

Create a clean, editable spacecraft scene—not one monolithic mesh. This skill is for Blender **5.1 and 5.2** and assumes a conventional local coordinate system: `+Y` is forward, `+X` is starboard, and `+Z` is up. The deliverable must remain understandable in the Outliner, movable through one controller, renderable in EEVEE, and animatable without manual repair.

## Non-negotiable scene contract

- Make a dedicated root collection, then functional child collections: `Fuselage`, `Cockpit`, `Wings`, `Engines`, `Weapons`, `Greebles`, `Markings`, `Lights`, and `Rig`.
- Create exactly one top-level empty named `CTRL_Ship`. Parent all geometry and wing controls to it with `matrix_parent_inverse` set. Move the ship only through this empty.
- For articulated assemblies, create a pivot empty at the physical hinge (`CTRL_Wing_*`) and parent the assembly to that pivot. Animate the pivot, never the individual panels.
- Use stable, descriptive names and semantic custom properties (`role`, `side`, `part`). These make a generated file inspectable and make later scripts safe to target.
- Keep functional geometry as separate objects until silhouette and animation are approved. Apply destructive boolean joins or mesh joins only when explicitly requested.
- Favor data API assignments and object-mode primitive operators. Operators are context-sensitive, so force Object Mode and do not rely on whatever object happens to be selected.

## Build order

1. Validate the Blender release and clear only the collection/object namespace owned by this build.
2. Create collections and `CTRL_Ship`.
3. Block the primary silhouette: fuselage, cockpit, wing panels, engine pods, weapons.
4. Add repeated hard-surface greebles from formulas; preserve symmetry through loops and sign variables.
5. Add non-destructive bevels and smooth shading where appropriate.
6. Build materials and markings. Use material separation or thin offset decal geometry before image decals.
7. Create wing controls and keyframes, then animate only `CTRL_Ship` for flight.
8. Set camera/lights/render settings and run validation before saving.

## Copy-ready foundation script

Paste this in Blender's Text Editor and run it. It creates a stylized, editable X-wing-like fighter as a complete working scaffold. Change dimensions/counts in the constants rather than scattering magic numbers.

```python
import bpy
from math import radians
from mathutils import Vector

# ---------- configuration ----------
ROOT = "XWing_Generated"
COLLECTIONS = (
    "Fuselage", "Cockpit", "Wings", "Engines", "Weapons",
    "Greebles", "Markings", "Lights", "Rig",
)
FRAME_CLOSED, FRAME_OPEN, FRAME_LAUNCH = 1, 60, 120


def assert_blender_5():
    if bpy.app.version < (5, 1, 0):
        raise RuntimeError("This generator targets Blender 5.1 or newer.")


def object_mode():
    # Avoid an operator failure if the script was launched from Edit/Sculpt mode.
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')


def ensure_collection(name, parent=None):
    col = bpy.data.collections.get(name)
    if col is None:
        col = bpy.data.collections.new(name)
    owner = parent or bpy.context.scene.collection
    if col.name not in owner.children:
        owner.children.link(col)
    return col


def move_to_collection(obj, col):
    for old_col in tuple(obj.users_collection):
        old_col.objects.unlink(obj)
    col.objects.link(obj)


def set_parent(obj, parent):
    # Preserve world transform when a pre-positioned object is parented.
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()


def add_bevel(obj, width=0.06, segments=2):
    mod = obj.modifiers.new("Edge_Bevel", 'BEVEL')
    mod.width = width
    mod.segments = segments
    mod.limit_method = 'ANGLE'


def add_cube(name, col, location, scale, material=None, parent=None, bevel=0.0):
    object_mode()
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale                         # cube dimensions = scale * 2
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(obj, col)
    if material:
        obj.data.materials.append(material)
    if parent:
        set_parent(obj, parent)
    if bevel:
        add_bevel(obj, bevel)
    return obj


def add_cylinder(name, col, location, radius, depth, rotation=(0, 0, 0),
                 material=None, parent=None, bevel=0.0, vertices=32):
    object_mode()
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=depth,
        location=location, rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    move_to_collection(obj, col)
    if material:
        obj.data.materials.append(material)
    if parent:
        set_parent(obj, parent)
    if bevel:
        add_bevel(obj, bevel)
    return obj


def add_empty(name, col, location=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = 'PLAIN_AXES'
    obj.empty_display_size = 0.55
    obj.location = location
    col.objects.link(obj)
    if parent:
        set_parent(obj, parent)
    return obj


def principled_material(name, base_color, metallic=0.0, roughness=0.5,
                        emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is None:
        raise RuntimeError("Principled BSDF node was not created")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    # Socket names are stable in Blender 5.x.  Guarding permits a clear failure
    # instead of a mysterious KeyError if a custom node tree is substituted.
    if emission_color is not None:
        bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


assert_blender_5()
object_mode()

# Build under a single, predictable namespace.  Do not wipe the whole file.
root = ensure_collection(ROOT)
cols = {name: ensure_collection(name, root) for name in COLLECTIONS}
ship = bpy.data.objects.get("CTRL_Ship")
if ship is None:
    ship = add_empty("CTRL_Ship", cols["Rig"])
ship["role"] = "master_motion_controller"

# Materials: linear RGBA values; tune after viewing under the intended lighting.
hull = principled_material("MAT_Hull", (0.42, 0.45, 0.48), metallic=0.78, roughness=0.34)
dark = principled_material("MAT_DarkMetal", (0.035, 0.045, 0.055), metallic=0.9, roughness=0.24)
glass = principled_material("MAT_Canopy", (0.025, 0.09, 0.13), metallic=0.25, roughness=0.12)
accent = principled_material("MAT_Accent_Red", (0.55, 0.012, 0.008), metallic=0.35, roughness=0.3)
glow = principled_material("MAT_Engine_Glow", (0.02, 0.2, 1.0), metallic=0.0, roughness=0.25,
                           emission_color=(0.02, 0.2, 1.0), emission_strength=18.0)

# Fuselage and cockpit: simple primitives are a reliable blockout, not a final excuse.
body = add_cube("Fuselage_Main", cols["Fuselage"], (0, 0, 0), (1.35, 4.8, 0.72), hull, ship, 0.14)
body["role"] = "fuselage"
nose = add_cube("Fuselage_Nose", cols["Fuselage"], (0, 5.25, -0.05), (0.82, 1.25, 0.40), hull, ship, 0.10)
canopy = add_cube("Cockpit_Canopy", cols["Cockpit"], (0, 1.25, 0.78), (0.76, 1.75, 0.38), glass, ship, 0.10)

# Wings.  Four hinge controls are children of the master controller.
# sign_x = port/starboard; sign_z = upper/lower.  The panel's long local X axis
# rotates around local Y so its outer end rises/falls into an X configuration.
wing_controls = []
for sign_x in (-1, 1):
    for sign_z in (-1, 1):
        side = "Port" if sign_x < 0 else "Starboard"
        height = "Lower" if sign_z < 0 else "Upper"
        hinge = add_empty(f"CTRL_Wing_{side}_{height}", cols["Rig"],
                          (sign_x * 0.95, -0.25, sign_z * 0.18), ship)
        hinge["role"], hinge["side"], hinge["part"] = "wing_hinge", side, height
        panel = add_cube(f"Wing_{side}_{height}", cols["Wings"],
                         (sign_x * 3.25, -0.25, sign_z * 0.18),
                         (2.35, 3.05, 0.105), hull, hinge, 0.055)
        panel["role"] = "wing_panel"
        # Contrasting stripe is thin, offset along local Z to prevent z-fighting.
        stripe = add_cube(f"Marking_{side}_{height}_Stripe", cols["Markings"],
                          (sign_x * 3.25, 1.15, sign_z * (0.18 + 0.12)),
                          (2.05, 0.22, 0.018), accent, hinge, 0.01)
        stripe["role"] = "accent_marking"
        wing_controls.append((hinge, sign_x, sign_z))

# Engines/lasers: cylinder default axis is Z. Rotate +90 degrees around X to align along Y.
for sign_x in (-1, 1):
    for sign_z in (-1, 1):
        pos = (sign_x * 4.55, -1.4, sign_z * 0.95)
        engine = add_cylinder(f"Engine_{sign_x:+d}_{sign_z:+d}", cols["Engines"], pos,
                              radius=0.52, depth=3.6, rotation=(radians(90), 0, 0),
                              material=dark, parent=ship, bevel=0.04)
        engine["role"] = "engine_pod"
        exhaust = add_cylinder(f"EngineGlow_{sign_x:+d}_{sign_z:+d}", cols["Lights"],
                               (pos[0], pos[1] - 1.83, pos[2]), radius=0.38, depth=0.06,
                               rotation=(radians(90), 0, 0), material=glow, parent=ship)
        laser = add_cylinder(f"Laser_{sign_x:+d}_{sign_z:+d}", cols["Weapons"],
                             (sign_x * 5.1, 2.25, sign_z * 1.1), radius=0.10, depth=2.0,
                             rotation=(radians(90), 0, 0), material=dark, parent=ship, vertices=16)
        laser["role"] = "laser_cannon"

# Greeble formula: p(i, s) = (s*x0, y0 + i*dy, z0).  Sign loops guarantee symmetry.
# Small surface blocks add hierarchy; use a modest count, then instance/Geometry Nodes for dense fields.
for sign_x in (-1, 1):
    for i in range(7):
        y = -3.4 + i * 0.82
        z = 0.78 + (0.10 if i % 2 else 0.0)
        g = add_cube(f"Greeble_{sign_x:+d}_{i:02d}", cols["Greebles"],
                     (sign_x * 1.43, y, z), (0.16, 0.24, 0.10), dark, ship, 0.025)
        g["role"] = "surface_greeble"

# ---------- animation ----------
for hinge, sign_x, sign_z in wing_controls:
    hinge.rotation_mode = 'XYZ'
    hinge.rotation_euler = (0, 0, 0)
    hinge.keyframe_insert(data_path="rotation_euler", index=1, frame=FRAME_CLOSED)
    # Alternating signs make all outer tips move away from the central fuselage.
    hinge.rotation_euler.y = radians(28) * sign_x * sign_z
    hinge.keyframe_insert(data_path="rotation_euler", index=1, frame=FRAME_OPEN)

ship.location = (0, 0, 0)
ship.keyframe_insert(data_path="location", frame=FRAME_CLOSED)
ship.location = (0, 42, 0.5)  # +Y is forward by this skill's coordinate convention
ship.keyframe_insert(data_path="location", frame=FRAME_LAUNCH)

scene = bpy.context.scene
scene.frame_start, scene.frame_end = FRAME_CLOSED, FRAME_LAUNCH
scene.render.engine = 'BLENDER_EEVEE'  # Blender 5.x identifier; NOT BLENDER_EEVEE_NEXT
scene.render.fps = 24
scene.frame_set(FRAME_CLOSED)
print("Generated X-wing scaffold successfully.")
```

## Hard-surface greebling rules

Build detail in visual frequency bands. Large masses establish silhouette, medium parts explain construction, and tiny greebles sell scale. A useful proportional guide, where `L` is the craft length:

| Band | Typical size | Examples |
|---|---:|---|
| Primary | `0.10L–0.50L` | fuselage, wing panels, pods |
| Secondary | `0.02L–0.10L` | hatches, intakes, braces, weapons |
| Tertiary | `0.002L–0.02L` | bolts, vent slats, cable collars, seams |

For a symmetric feature, use `s ∈ {-1, +1}` and generate positions from a single prototype:

```python
# Mirror-safe engine locations:
# p(sx, sz) = (sx * engine_x, engine_y, sz * engine_z)
for sx in (-1, 1):
    for sz in (-1, 1):
        position = (sx * engine_x, engine_y, sz * engine_z)
```

For evenly spaced pipes/vents, use `p(i) = p0 + i * d`, where `i=0..n-1`; do not eyeball each placement. A cylindrical pipe along a normalized direction `d` has midpoint `m=(a+b)/2`, depth `|b-a|`, and orientation that maps local cylinder axis `Z` to `d`. For arbitrary paths, use a Curve object with bevel depth; for straight, repeated mechanical elements, cylinders are simpler and more robust.

Use bevel modifiers on mechanical edges to catch highlights. Keep bevel width smaller than the smallest intentional panel gap. If repeated objects become numerous, create one prototype object and duplicate with linked mesh data (`copy.data = prototype.data`) or use Geometry Nodes—duplicating unique mesh data thousands of times needlessly increases file size.

Avoid fake detail that reads as noise: leave clean rest areas around markings, intakes, cockpit glazing, and wing roots. Offset all decal geometry by a small normal-distance to avoid z-fighting.

## Materials, exhaust, and markings

The script uses the Principled BSDF. In Blender 5.1/5.2 its important inputs include `Base Color`, `Metallic`, `Roughness`, `Emission Color`, and `Emission Strength`. Use actual material separation for painted panels and thin offset meshes for simple stripes. That is more robust than texture coordinates for a procedural generator.

For an image decal only when an image asset is explicitly supplied:

```python
image = bpy.data.images.load("/absolute/path/to/insignia.png", check_existing=True)
tex = decal_mat.node_tree.nodes.new("ShaderNodeTexImage")
tex.image = image
# Set `image.colorspace_settings.name = 'sRGB'` for an ordinary color/alpha decal.
# Connect Color -> Principled Base Color and Alpha -> Principled Alpha, then configure
# the material's Blender-5-compatible surface render method as needed by the asset.
```

Emission makes an engine face visibly bright. It does **not** by itself provide convincing bloom/glow in every viewport or render configuration; add a point/area light or compositor glare if the exhaust must illuminate nearby geometry or bloom in the final frame. Scale emission strength to exposure and scene lighting rather than assuming a universal value.

## Animation discipline

Keyframe transforms with explicit data paths and frames. Insert all keyed component values or set `index` deliberately; otherwise a later edit can create inconsistent animation channels. For a polished transition, change interpolation after key insertion:

```python
action = bpy.data.objects["CTRL_Ship"].animation_data.action
for curve in action.fcurves:
    for point in curve.keyframe_points:
        point.interpolation = 'BEZIER'
```

Keep `CTRL_Ship` responsible for translation/whole-ship rotation, each `CTRL_Wing_*` responsible for wing deployment, and optional engine/gun controls responsible for their own mechanisms. Do not animate a child in world space while its parent also animates unless the layered motion is intentional.

## Blender 5.x compatibility and failure prevention

Check the running API, set only known attributes, and prefer modern identifiers:

```python
print("Blender:", bpy.app.version_string)
scene.render.engine = 'BLENDER_EEVEE'  # correct 5.x engine id

# Safe capability check for optional/version-specific properties:
view_layer = bpy.context.view_layer
if hasattr(view_layer, "eevee") and hasattr(view_layer.eevee, "ambient_occlusion_distance"):
    view_layer.eevee.ambient_occlusion_distance = 3.0
```

Do **not** use these legacy snippets in a Blender 5.x generator:

| Do not use | Reason / replacement |
|---|---|
| `scene.render.engine = 'BLENDER_EEVEE_NEXT'` | In Blender 5.0+, use `'BLENDER_EEVEE'`. |
| `scene.eevee.use_gtao`, `scene.eevee.gtao_quality` | Removed; those controls did nothing since 4.2. |
| `scene.eevee.gtao_distance` | Moved/renamed to `view_layer.eevee.ambient_occlusion_distance`. |
| `material.blend_method` | Use the Blender 4.2+ material surface-render API (`surface_render_method`) after capability checks. |
| `scene.use_bloom` / `scene.bloom_*` | Legacy EEVEE bloom properties were removed; use compositor glare or a deliberate post-processing path. |
| direct dictionary access to RNA properties, e.g. `scene['cycles']` | Blender 5.0 removed unsupported runtime-property storage access; use regular RNA attributes. |
| deprecated `bgl` drawing code | The BGL API was removed; use `gpu` APIs if custom viewport drawing is necessary. |

Do not blanket-catch `Exception` around critical modelling code: it conceals a partial scene. Catch a narrow, expected error only when a fallback is valid. When using `bpy.ops`, verify mode/context first; for bulk or headless generation, prefer mesh/data APIs where practical.

## Pre-save validation

Run this after generation. It checks the architectural promises without mutating the scene.

```python
def validate_ship():
    required = ("CTRL_Ship", "Fuselage", "Cockpit", "Engines", "Weapons", "Rig")
    missing = [name for name in required
               if bpy.data.objects.get(name) is None and bpy.data.collections.get(name) is None]
    if missing:
        raise RuntimeError(f"Missing required scene elements: {missing}")
    ship = bpy.data.objects["CTRL_Ship"]
    unparented = []
    for col_name in ("Fuselage", "Cockpit", "Wings", "Engines", "Weapons", "Greebles", "Markings", "Lights"):
        col = bpy.data.collections.get(col_name)
        if col:
            unparented += [o.name for o in col.objects if o.parent is None]
    if unparented:
        raise RuntimeError(f"Geometry lacks a controller parent: {unparented}")
    if bpy.context.scene.render.engine != 'BLENDER_EEVEE':
        print("Warning: scene is not configured for Blender 5.x EEVEE")
    print("Validation passed; controller:", ship.name)

validate_ship()
```

## Reference checks

Before relying on an unfamiliar property, inspect the Blender version actually running (`bpy.app.version_string`) and the current [Blender Python API](https://docs.blender.org/api/current/). For version migrations, consult Blender's official [5.0 Python API release notes](https://developer.blender.org/docs/release_notes/5.0/python_api/) and [EEVEE release notes](https://developer.blender.org/docs/release_notes/5.0/eevee/). The exact current Principled behavior is documented in the [Blender 5.2 manual](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html).
