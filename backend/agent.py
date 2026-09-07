"""
LiveAgent-Blender: AI Agent Engine
----------------------------------
مسؤول عن تحليل أوامر المستخدم وتوليد كود Blender Python (bpy) دقيق وقابل للتنفيذ.
"""

import re
import os

SYSTEM_PROMPT = """أنت وكيل ذكاء اصطناعي خبير ومحترف في النمذجة ثلاثية الأبعاد وبرمجة Blender Python (bpy).
مهمتك هي استقبال طلبات المستخدم وتوليد كود بايثون نظيف، متقن، وقابل للتنفيذ الفوري داخل برنامج Blender.

معايير كتابة كود Blender (bpy):
1. قم دائماً بتنظيف المشهد من المجسمات السابقة إذا كان المستخدم يطلب تصميماً جديداً تماماً:
   bpy.ops.object.select_all(action='SELECT')
   bpy.ops.object.delete(use_global=False)
2. استخدم أسماء واضحة للمجسمات (obj.name = '...').
3. استخدم Principled BSDF لإعداد خامات واقعية (مع مراعاة Blender 4.0+ وتوافق الحقول).
4. استخدم التنعيم (Shade Smooth) وإضافة معدلات مناسبة مثل Bevel أو Subdivision Surface لإعطاء مظهر احترافي هندسي.
5. احرص على أن تكون الإحداثيات والنسب والأبعاد متناسقة ومنطقية للمجسم.
6. أرجع الكود داخل بلوك كود بايثون: ```python ... ```
"""

def extract_python_code(response_text: str) -> str:
    """استخراج كود بايثون من استجابة النموذج"""
    code_match = re.search(r'```(?:python)?\s*(.*?)\s*```', response_text, re.DOTALL)
    if code_match:
        return code_match.group(1).strip()
    return response_text.strip()
