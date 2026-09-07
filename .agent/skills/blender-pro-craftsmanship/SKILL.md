---
name: blender-pro-craftsmanship
description: Master craftsmanship guide for photorealistic and advanced procedural 3D modeling in Blender 5.2 LTS. Covers hollow glassware and containers, fluid interfaces, the Bevel+WeightedNormal modifier stack, 3-point studio lighting, and organic physical shaders.
---

# 🏆 Blender 5.2 LTS Pro Craftsmanship & Photorealism Skill
## أسرار مجتمع المحترفين للارتقاء بالتصاميم من (6/10) إلى (10/10)

هذا الدليل الهندسي هو المرجع المتقدم لفنون النمذجة الإجرائية والواقعية البصرية الفائقة. يركز على سد الفجوة بين الأشكال الأولية البدائية (رص المكعبات) وبين التصاميم الصناعية والفنية متناهية الدقة والجمال.

---

## 1. الفارق الجوهري بين التصميم البدائي (6/10) والتصميم الاحترافي (10/10)

| المعيار | ❌ التصميم البدائي (6/10) | 🌟 التصميم الاحترافي (10/10) |
| :--- | :--- | :--- |
| **الأواني والكؤوس** | كتلة أسطوانية أو مخروطية مصمتة مغلقة من الأعلى. | مجسم مفرغ (`end_fill_type='NOTHING'`) مع سمك جدار حقيقي بـ `Solidify` وحافة مشطوفة ناعمة. |
| **السوائل والعصائر** | كتلة طافية فوق الكأس أو فراغات هوائية عشوائية. | سائل متداخل فيزيائياً داخل الكأس بأبعاد محكمة (`inner_radius` وارتفاع 75% من الكوب) وقاعدة تبدأ فوق قاع الزجاج مباشرة. |
| **الحواف والزوايا** | حواف حادة 90 درجة حاسوبية قبيحة (Razor CGI Edges). | حواف ناعمة مشطوفة (`Bevel Modifier`) بـ Angle Limit تعكس بريق الإضاءة الطبيعي. |
| **الإضاءة** | شمس واحدة مسطحة أو إضاءة باهتة بلا عمق. | إضاءة استوديو سينمائية ثلاثية النقاط (Key, Fill, Rim Light) تبرز ملامح المجسم. |
| **الخامات والشفافية** | لون مسطح عادي بدون تشتت أو انكسار. | خامات فيزيائية دقيقة بمعاملات انكسار حقيقية (IOR) وتشتت باطني للضوء (`Subsurface Weight`). |

---

## 2. هندسة الأواني والكؤوس والقوارير المجوفة (Hollow Glassware & Vessels)

لإنشاء كأس، فنجان، زجاجة، أو وعاء مفتوح في نمط الكائنات (Object Mode):
1. استخدم دائماً `end_fill_type='NOTHING'` لجعل الشكل أنبوباً مفتوح الرأس والقاع.
2. أضف معدل `Solidify` لمنح جدران الكأس سمكاً واقعياً (سمك 3 إلى 5 ملم).
3. أضف قاعدة زجاجية ثقيلة وفاخرة بالأسفل (`primitive_cylinder_add` رفيعة بـ Bevel).
4. شذب فوهة الكأس بمعدل `Bevel` ناعم جداً.

```python
# كود قياسي لكأس عصير فاخر مفتوح الفوهة
cup_h = 0.19
cup_r_base = 0.042
cup_r_rim = 0.065

bpy.ops.mesh.primitive_cone_add(
    radius1=cup_r_base, 
    radius2=cup_r_rim, 
    depth=cup_h, 
    end_fill_type='NOTHING', 
    location=(0, 0, cup_h / 2)
)
cup = bpy.context.active_object
cup.name = "Glass_Cup_Body"

# سمك الزجاج
sol = cup.modifiers.new("Glass_Wall", 'SOLIDIFY')
sol.thickness = 0.004
sol.offset = 1.0

# تنعيم الحافة العلوية للفوهة
bev = cup.modifiers.new("Rim_Bevel", 'BEVEL')
bev.width = 0.0015
bev.segments = 3
bev.limit_method = 'ANGLE'
bpy.ops.object.shade_smooth()
```

---

## 3. فيزياء تداخل السوائل والمشروبات (Physics-Accurate Fluid Interface)

❌ **الخطأ الشائع:** وضع السائل على ارتفاع عشوائي يجعله يطفو فوق الكأس كغطاء منفصل!  
✅ **القاعدة الذهبية:**
- قاعدة السائل تبدأ بالضبط فوق سمك قاع الكأس الزجاجي (`Z = base_thickness + (juice_h / 2)`).
- نصف قطر السائل يكون أصغر بـ 1.5 ملم من نصف القطر الداخلي للكأس حتى لا يخرج من الجدار.
- ارتفاع السائل يكون حوالي 70% إلى 80% من عمق الكأس.

```python
# السائل الداخلي المتداخل بدقة
juice_h = cup_h * 0.75
juice_z = 0.016 + (juice_h / 2)
bpy.ops.mesh.primitive_cone_add(
    radius1=cup_r_base - 0.0015, 
    radius2=cup_r_rim * 0.88, 
    depth=juice_h, 
    location=(0, 0, juice_z)
)
juice = bpy.context.active_object
juice.name = "Fresh_Juice"
juice.parent = cup
bpy.ops.object.shade_smooth()
```

---

## 4. الإضافات الواقعية (مكعبات الثلج، الشفاطة، الزينة)

1. **مكعبات الثلج (Ice Cubes):**
   - مكعبات صغيرة (`size=0.024`) مع زوايا دوران عشوائية متفرقة داخل السائل.
   - تطبيق `Bevel(width=0.004, segments=3)` لتدوير حواف الثلج المنصهر.
   - خامة الزجاج المائي: `Transmission Weight=1.0`، و `IOR=1.310` (معامل انكسار الثلج الطبيعي).
2. **الشفاطة المائلة (Straw):**
   - أسطوانة رفيعة ترتكز على قاع الكوب وتميل بزاوية 12 إلى 16 درجة لتخرج من فوهة الكوب.
3. **شرائح التزيين (Garnish Slice):**
   - قرص رقيق مائل بزاوية يستقر على الحافة العليا لفوهة الكأس.

---

## 5. ترسانة معدلات الأسطح الصلبة (Hard-Surface Holy Trinity Stack)

في عالم الـ 3D، أي جسم صلب في العالم الواقعي يمتلك شطفاً ميكروسكوبياً للحواف يعكس الضوء.  
لجعل أي مجسم يبدو فائق الجودة والنعومة بدون تشويه:
```python
def apply_pro_hard_surface(obj, bevel_width=0.005):
    # 1. شطف الحواف بزاوية محددة
    bev = obj.modifiers.new("Pro_Bevel", 'BEVEL')
    bev.width = bevel_width
    bev.segments = 2
    bev.limit_method = 'ANGLE'
    bev.angle_limit = math.radians(35)
    
    # 2. تسوية الانعكاسات السطحية (Weighted Normal)
    wn = obj.modifiers.new("Pro_Normal", 'WEIGHTED_NORMAL')
    wn.keep_sharp = True
    
    # 3. التنعيم البصري
    bpy.ops.object.shade_smooth()
```

---

## 6. إضاءة الاستوديو السينمائية ثلاثية النقاط (3-Point Studio Lighting)

لا تستخدم إضاءة واحدة مسطحة أبداً. التوزيع الاحترافي المعتمد:
1. **الضوء الرئيسي (Key Light):** نوع `AREA`، موقع أمامي جانبي مرتفع، إضاءة دافئة (قوة 40W - 60W).
2. **ضوء الملء (Fill Light):** نوع `AREA`، موقع جانبي معاكس، إضاءة باردة ناعمة بنصف القوة لملء الظلال الحادة.
3. **ضوء الحافة الخلفي (Rim Light):** نوع `POINT` أو `AREA`، خلف المجسم، يصنع هالة ضوئية لامعة على حواف الزجاج والمعادن لتفصلها عن الخلفية الداكنة.

---

## 7. جدول معاملات الانكسار الفيزيائية (Physical IOR Reference)

| المادة | معامل الانكسار (IOR) | Roughness | Transmission Weight | Subsurface Weight |
| :--- | :--- | :--- | :--- | :--- |
| **الزجاج والبلور (Crystal Glass)** | `1.517` | 0.02 | 1.0 | 0.0 |
| **الماء والسوائل المائية (Water)** | `1.333` | 0.05 | 1.0 | 0.0 |
| **مكعبات الثلج (Ice)** | `1.310` | 0.08 | 1.0 | 0.0 |
| **عصائر الفاكهة الطبيعية (Juice/Milk)**| `1.340` | 0.12 | 0.3 - 0.5 | **0.40** (لتشتت اللب الداخلي) |
| **الذهب والمجوهرات (Gemstones)** | `1.700 - 2.400` | 0.01 | 1.0 | 0.0 |
| **البلاستيك اللامع (Glossy Plastic)** | `1.460` | 0.20 | 0.0 | 0.0 |

---

## 8. النمذجة النباتية العضوية (Botanical Flora & Fibonacci Spiral Phyllotaxis)

تكوين الزهور والبتلات في الطبيعة يخضع لقوانين النسبة الذهبية والتناوب الحلزوني:
1. **الزاوية الذهبية (Golden Angle):** `137.5077` درجة بين كل بتلة والتالية تمنع التداخل الشاذ وتصنع تغطية عضوية متناسقة.
2. **شكل البتلة (Petal Geometry):** قشرة كروية بيضاوية رقيقة `primitive_uv_sphere_add` بتحجيم `scale=(sx, sy, sz)` حيث `sz` رقيق جداً (0.01) و `sx, sy` مسطحان ومقوّسان، مع تنعيم `shade_smooth()`.
3. **تدرج الانفتاح (Curvature Progression):**
   - في القلب (البرعم): البتلات عمودية ملتوية بزاوية ميلان ضيقة (12° - 15°).
   - في الأطراف: البتلات تنحدر وتتفتح للخارج بزوايا تصل إلى (70° - 80°) مع زيادة حجمها تدريجياً بنصف قطر متوسع.
4. **العناصر الحاملة:**
   - كأسية مخروطية سفلية مع سبلات مثلثة خماسية لحمل البتلات من الأسفل.
   - ساق أسطوانية ناعمة مع أشواك مخروطية متباعدة وأوراق جانبية مسطحة مائلة.
