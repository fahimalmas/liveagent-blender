---
name: blender-5-2-expert
description: Complete authoritative guide and reference for 3D modeling and Python scripting in Blender 5.2 LTS and EEVEE Next. Covers mesh primitives, Principled BSDF materials, lighting, cameras, transforms, and error-free programmatic 3D generation.
---

# 🎨 Blender 5.2 LTS & EEVEE Next 3D Modeling Skill

هذا الدليل هو المرجع الهندسي الشامل والموثوق لإنشاء مجسمات ثلاثية الأبعاد احترافية وبرمجة سكربتات بايثون `bpy` تعمل بسلاسة بنسبة 100% وبدون أي أخطاء داخل **Blender 5.2 LTS** ومحرك الرندر الحديث **EEVEE Next**.

---

## 1. التغييرات الجوهرية في Blender 5.2 LTS و EEVEE Next (ممنوعات وقواعد إلزامية)

### ❌ الممنوعات الصارمة (تسبب انهيار السكربت فوراً):
1. **خاصية `shadow_method`**:
   - ⛔ **خطأ قاتل**: `mat.shadow_method = 'NONE'` أو `'HASHED'` أو `'CLIP'`.
   - 💡 **السبب**: تمت إزالتها كلياً من كائن `Material` في Blender 4.2+ و 5.2 LTS.
   - ✅ **البديل**: تتبع الظلال يتم تلقائياً في EEVEE Next، أو عبر خصائص الكائن: `obj.visible_shadow = True/False`.
2. **إعدادات EEVEE القديمة على المشهد**:
   - ⛔ **خطأ**: `scene.eevee.use_bloom = True` أو `scene.eevee.use_ssr = True` أو `use_gtao = True`.
   - 💡 **السبب**: تم استبدالها بنظام Raytracing والـ Viewport Compositor الجديد كلياً.
3. **أخطاء إغلاق الأقواس في السكربتات**:
   - ⛔ **خطأ**: استدعاء التنعيم بأقواس مكررة مثل `bpy.ops.object.shade_smooth())`.
   - ✅ **الصحيح**: `bpy.ops.object.shade_smooth()`.
4. **التبديل إلى نمط التعديل (Edit Mode)**:
   - كافة المجسمات المبرمجة بالذكاء الاصطناعي يجب بناؤها بالكامل في نمط الكائنات (Object Mode) فقط لتجنب تعارض الـ Context.

---

## 2. جدول ترقية مقابس خامة Principled BSDF الحديثة في Blender 5.2 LTS

| الخاصية المراد تعديلها | ❌ المسمى القديم (ملغي في 5.2) | ✅ المسمى الرسمي الإلزامي في Blender 5.2 LTS |
| :--- | :--- | :--- |
| **الزجاج والشفافية (Transmission)** | `inputs['Transmission']` | `inputs['Transmission Weight']` |
| **اللمعان والانعكاس (Specular)** | `inputs['Specular']` | `inputs['Specular IOR Level']` |
| **الإشعاع والتوهج النيوني (Emission)** | `inputs['Emission']` | `inputs['Emission Color']` + `inputs['Emission Strength']` |
| **طبقة الطلاء اللامعة (Coat/Clearcoat)** | `inputs['Coat']` / `Clearcoat` | `inputs['Coat Weight']` + `inputs['Coat Roughness']` |
| **الجلد والشمع (Subsurface)** | `inputs['Subsurface']` | `inputs['Subsurface Weight']` |
| **ملمس المخمل والقماش (Sheen)** | `inputs['Sheen']` | `inputs['Sheen Weight']` |

---

## 3. وصفات الخامات الجاهزة المعتمدة (Blender 5.2 Material Recipes)

### أ) خامة الزجاج والبلور الفاخر (Crystal Glass):
```python
def create_glass_material(name="Glass_Material", color=(0.95, 0.95, 0.98, 1.0), ior=1.45):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = 0.05
    bsdf.inputs['IOR'].default_value = ior
    bsdf.inputs['Transmission Weight'].default_value = 1.0
    bsdf.inputs['Specular IOR Level'].default_value = 0.5
    return mat
```

### ب) خامة الكروم والمعدن المصقول (Polished Chrome / Gold):
```python
def create_metal_material(name="Gold_Metal", color=(1.0, 0.76, 0.33, 1.0), roughness=0.15):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = roughness
    return mat
```

### ج) خامة النيون المتوهج (Cyberpunk Glowing Neon):
```python
def create_neon_material(name="Neon_Cyan", color=(0.0, 0.8, 1.0, 1.0), strength=8.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Emission Color'].default_value = color
    bsdf.inputs['Emission Strength'].default_value = strength
    return mat
```

---

## 4. مكتبة الأشكال الهندسية الأساسية (Primitives Library)

عند استدعاء أي شكل أولي، حدد أبعاده بدقة لتفادي الأحجام الافتراضية الضخمة (مثل الأسطوانة بارتفاع 2 متر):

1. **الأسطوانة والقرص (Cylinder / Disc)**:
   - قرص رفيع لقاعدة أو غطاء:
     `bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=0.06, location=(0, 0, 0.03))`
   - عمود أو رجل رفيعة:
     `bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.8, location=(x, y, z))`
2. **الكرة (UV Sphere)**:
   - `bpy.ops.mesh.primitive_uv_sphere_add(radius=0.4, location=(x, y, z))`
3. **المخروط (Cone)**:
   - `bpy.ops.mesh.primitive_cone_add(radius1=0.3, radius2=0.0, depth=0.6, location=(x, y, z))`
4. **الحلقة المفرغة (Torus)**:
   - `bpy.ops.mesh.primitive_torus_add(major_radius=0.6, minor_radius=0.08, location=(x, y, z))`

---

## 5. هيكلية الكود القياسية والمثالية لأي تصميم جديد

```python
import bpy
import math

# 1. تنظيف المشهد بالكامل
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# 2. إنشاء الخامات المعتمدة
mat_gold = bpy.data.materials.new(name="Gold")
mat_gold.use_nodes = True
bsdf_gold = mat_gold.node_tree.nodes.get("Principled BSDF")
bsdf_gold.inputs['Base Color'].default_value = (1.0, 0.78, 0.35, 1.0)
bsdf_gold.inputs['Metallic'].default_value = 0.9
bsdf_gold.inputs['Roughness'].default_value = 0.2

# 3. بناء الكائنات وتطبيق الخامات والتنعيم
bpy.ops.mesh.primitive_cylinder_add(radius=0.6, depth=0.06, location=(0, 0, 0.03))
base_obj = bpy.context.active_object
base_obj.name = "Model_Base"
base_obj.data.materials.append(mat_gold)
bpy.ops.object.shade_smooth()

# 4. إعداد الإضاءة والكاميرا للعرض المثالي
bpy.ops.object.light_add(type='SUN', location=(4, -4, 6))
bpy.context.active_object.data.energy = 3.5

bpy.ops.object.camera_add(location=(2.5, -3.2, 2.0), rotation=(math.radians(65), 0, math.radians(38)))
bpy.context.scene.camera = bpy.context.active_object
```
