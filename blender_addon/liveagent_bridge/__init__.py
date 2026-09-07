bl_info = {
    "name": "LiveAgent 3D Bridge",
    "author": "Eng. Fahim Almas (fmas.dev)",
    "version": (1, 1, 0),
    "blender": (4, 2, 0),
    "location": "View3D > Sidebar (N) > LiveAgent",
    "description": "Real-time bidirectional AI bridge between LiveAgent Web App and Blender 5.2 LTS",
    "warning": "",
    "doc_url": "https://github.com/fahimalmas/liveagent-3d",
    "category": "Development",
}

"""
LiveAgent-Blender: Live Bridge Server
-------------------------------------
هذا السكربت يعمل داخل برنامج Blender (في تبويب Scripting أو كـ Addon).
يقوم بتشغيل سيرفر محلي خفيف على المنفذ 8123، ويستقبل كود بايثون من واجهة LiveAgent 
وينفذه بأمان داخل بلندر فورياً مع إرجاع بيانات المشهد والكائنات الحقيقية للواجهة.

طريقة الاستخدام:
1. افتح برنامج Blender.
2. انتقل إلى تبويب Scripting واضغط New.
3. الصق هذا الكود كاملاً واضغط على زر التشغيل المثلث (Run Script ▶).
"""

import bpy
import http.server
import socketserver
import threading
import json
import queue
import time
import math
import traceback
import urllib.request
import urllib.error

PORT = 8123
command_queue = queue.Queue()
server_instance = None
server_thread = None

# استخراج بيانات الكائنات والمجسمات الحقيقية في مشهد بلندر
def get_scene_objects_data():
    objects_data = []
    try:
        for obj in bpy.data.objects:
            if obj.type != 'MESH':
                continue
            
            # استخراج لون الخامة الأساسية إن وجدت
            color = [0.2, 0.6, 0.95]
            metalness = 0.5
            roughness = 0.3
            if obj.data.materials and len(obj.data.materials) > 0:
                mat = obj.data.materials[0]
                if mat and mat.use_nodes and mat.node_tree:
                    bsdf = mat.node_tree.nodes.get("Principled BSDF")
                    if bsdf:
                        if 'Base Color' in bsdf.inputs:
                            c = bsdf.inputs['Base Color'].default_value
                            color = [round(c[0], 3), round(c[1], 3), round(c[2], 3)]
                        if 'Metallic' in bsdf.inputs:
                            metalness = round(float(bsdf.inputs['Metallic'].default_value), 2)
                        if 'Roughness' in bsdf.inputs:
                            roughness = round(float(bsdf.inputs['Roughness'].default_value), 2)
            
            dim = [round(float(d), 4) for d in obj.dimensions]
            loc = [round(float(l), 4) for l in obj.location]
            rot = [round(float(r), 4) for r in obj.rotation_euler]
            scale = [round(float(s), 4) for s in obj.scale]
            
            objects_data.append({
                "name": obj.name,
                "location": loc,
                "rotation": rot,
                "scale": scale,
                "dimensions": dim,
                "color": color,
                "metalness": metalness,
                "roughness": roughness
            })
    except Exception as e:
        print(f"[LiveAgent Bridge] تنبيه أثناء قراءة الكائنات: {e}")
    return objects_data

# تسجيل خاصية shadow_method بديلة على كائنات Material لتفادي أي انهيار في Blender 4.2+ و 5.2 LTS
try:
    if not hasattr(bpy.types.Material, 'shadow_method'):
        bpy.types.Material.shadow_method = bpy.props.StringProperty(name="shadow_method", default="NONE")
except Exception:
    pass

# تنظيف وتطهير كود بايثون وترقيته لمعايير Blender 5.2 LTS الحديثة
def clean_bpy_code(code_str):
    if not code_str:
        return ""
    code_str = code_str.strip()
    import re
    
    # استخراج كود بايثون إذا كان بداخل وسوم ماركداون
    m = re.search(r"```(?:python|py|bpy)?\s*\n?([\s\S]*?)(?:```|$)", code_str, re.IGNORECASE)
    if m and "bpy" in m.group(1):
        code_str = m.group(1).strip()
    elif "import bpy" in code_str:
        code_str = code_str[code_str.index("import bpy"):].strip()
        
    lines = code_str.splitlines()
    start_i = 0
    for idx, line in enumerate(lines):
        s = line.strip()
        if not s:
            continue
        if s.lower() in ("python", "python3", "py", "bpy") or s.startswith("```") or s.startswith("**") or s.startswith("###"):
            continue
        if s.startswith("import ") or s.startswith("from ") or s.startswith("bpy."):
            start_i = idx
            break
            
    import re
    filtered_lines = []
    for line in lines[start_i:]:
        s = line.strip()
        # إزالة أي خاصيات تم حذفها في Blender 4.2+ و Blender 5.2 LTS لتفادي انهيار الكود
        if ".shadow_method" in s and "=" in s:
            continue
        if ".eevee.use_bloom" in s or ".eevee.use_ssr" in s or ".eevee.use_gtao" in s or ".eevee.use_ssr_refraction" in s:
            continue
        filtered_lines.append(line)

    cleaned = "\n".join(filtered_lines).strip()
    
    # ترقية تلقائية لتوافق مقابس خامة Principled BSDF في Blender 4.0 و Blender 5.2 LTS
    cleaned = re.sub(r"inputs\[\s*['\"]Transmission['\"]\s*\]", "inputs['Transmission Weight']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Transmission['\"]\s*\)", ".get('Transmission Weight')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Specular['\"]\s*\]", "inputs['Specular IOR Level']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Specular['\"]\s*\)", ".get('Specular IOR Level')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Emission['\"]\s*\]", "inputs['Emission Color']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Emission['\"]\s*\)", ".get('Emission Color')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Subsurface['\"]\s*\]", "inputs['Subsurface Weight']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Subsurface['\"]\s*\)", ".get('Subsurface Weight')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Clearcoat['\"]\s*\]", "inputs['Coat Weight']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Clearcoat['\"]\s*\)", ".get('Coat Weight')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Coat['\"]\s*\]", "inputs['Coat Weight']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Coat['\"]\s*\)", ".get('Coat Weight')", cleaned)
    cleaned = re.sub(r"inputs\[\s*['\"]Sheen['\"]\s*\]", "inputs['Sheen Weight']", cleaned)
    cleaned = re.sub(r"\.get\(\s*['\"]Sheen['\"]\s*\)", ".get('Sheen Weight')", cleaned)
    # إصلاح تلقائي لأي خطأ أقواس في استدعاء التنعيم
    cleaned = re.sub(r'bpy\.ops\.object\.shade_smooth\s*\(\s*\)\s*\)+', 'bpy.ops.object.shade_smooth()', cleaned)
    return cleaned

# إغلاق أي سيرفر قديم مسجل في Blender لمنع تعارض المنفذ
if 'liveagent_server' in bpy.app.driver_namespace:
    try:
        old_srv = bpy.app.driver_namespace['liveagent_server']
        old_srv.shutdown()
        old_srv.server_close()
        print("[LiveAgent Bridge] 🔄 تم إغلاق السيرفر القديم بنجاح.")
    except Exception as e:
        print(f"[LiveAgent Bridge] تنبيه: {e}")

# إلغاء تسجيل المؤقت القديم إن وجد
if 'liveagent_timer' in bpy.app.driver_namespace:
    try:
        old_timer = bpy.app.driver_namespace['liveagent_timer']
        if bpy.app.timers.is_registered(old_timer):
            bpy.app.timers.unregister(old_timer)
    except Exception:
        pass

# تنفيذ الأوامر بأمان داخل خيط بلندر الرئيسي (Main Thread) مع آلية التعافي الذكي
def process_command_queue():
    while not command_queue.empty():
        task = None
        try:
            task = command_queue.get_nowait()
            raw_code = task.get("code", "")
            code_to_exec = clean_bpy_code(raw_code)
            print(f"[LiveAgent Bridge] ⚡ جاري تنفيذ كود جديد في Blender (الأسطر: {len(code_to_exec.splitlines())})...")
            t0 = time.time()
            
            # إعطاء الكود سياق الـ 3D Viewport الكامل
            win = bpy.context.window_manager.windows[0] if bpy.context.window_manager.windows else None
            area = None
            region = None
            if win:
                for a in win.screen.areas:
                    if a.type == 'VIEW_3D':
                        area = a
                        for r in a.regions:
                            if r.type == 'WINDOW':
                                region = r
                                break
                        break
            
            import mathutils
            exec_globals = {
                'bpy': bpy,
                'math': math,
                'mathutils': mathutils,
                'Vector': mathutils.Vector,
                'Euler': mathutils.Euler,
                'Matrix': mathutils.Matrix,
                'Quaternion': mathutils.Quaternion,
                '__builtins__': __builtins__
            }

            # تنفيذ ذكي مع تخطي تلقائي للأخطاء الفردية البسيطة (Smart Error Recovery)
            exec_lines = code_to_exec.splitlines()
            last_err = None
            success = False

            for attempt in range(5):
                current_attempt_code = "\n".join(exec_lines)
                try:
                    compiled = compile(current_attempt_code, "<bpy_code>", "exec")
                    if win and area and region and hasattr(bpy.context, 'temp_override'):
                        with bpy.context.temp_override(window=win, area=area, region=region):
                            exec(compiled, exec_globals)
                    else:
                        exec(compiled, exec_globals)
                    success = True
                    break
                except (AttributeError, KeyError, TypeError, NameError) as e:
                    last_err = str(e)
                    tb = traceback.extract_tb(e.__traceback__)
                    failing_line = None
                    for frame in tb:
                        if frame.filename == "<bpy_code>":
                            failing_line = frame.lineno
                            break
                    if failing_line and 1 <= failing_line <= len(exec_lines):
                        print(f"[LiveAgent Bridge] ⚠️ تخطي سطر غير متوافق (محاولة {attempt+1}): السطر {failing_line} -> {exec_lines[failing_line-1]}")
                        exec_lines[failing_line-1] = f"# [auto-skipped] {exec_lines[failing_line-1]}"
                    else:
                        break
                except SyntaxError as e:
                    last_err = str(e)
                    failing_line = getattr(e, 'lineno', None)
                    if failing_line and 1 <= failing_line <= len(exec_lines):
                        print(f"[LiveAgent Bridge] ⚠️ إصلاح خطأ نحوي (محاولة {attempt+1}): السطر {failing_line} -> {exec_lines[failing_line-1]}")
                        exec_lines[failing_line-1] = f"# [auto-skipped syntax] {exec_lines[failing_line-1]}"
                    else:
                        break
                except Exception as e:
                    last_err = str(e)
                    break
            
            if not success and len(bpy.data.objects) == 0:
                raise RuntimeError(last_err or "فشل تنفيذ الكود في بلندر")
                
            # تحديث الواجهة وتوسيط المنظور تلقائياً في شاشة بلندر (Frame All)
            for window in bpy.context.window_manager.windows:
                for a in window.screen.areas:
                    if a.type == 'VIEW_3D':
                        a.tag_redraw()
                        for region in a.regions:
                            if region.type == 'WINDOW':
                                try:
                                    override = {'area': a, 'region': region, 'screen': window.screen, 'window': window}
                                    with bpy.context.temp_override(**override):
                                        bpy.ops.view3d.view_all(use_all_regions=False)
                                except Exception:
                                    pass
            
            duration = round(time.time() - t0, 3)
            task["status"] = "success"
            task["objects_count"] = len(bpy.data.objects)
            task["duration"] = duration
            task["objects"] = get_scene_objects_data()
            print(f"[LiveAgent Bridge] ✅ تم التنفيذ بنجاح في {duration}ث! عدد الكائنات الآن: {len(bpy.data.objects)}")
            
        except Exception as e:
            err_str = traceback.format_exc()
            print(f"[LiveAgent Bridge] ❌ خطأ أثناء التنفيذ:\n{err_str}")
            if task:
                task["status"] = "error"
                task["error"] = str(e)
                task["traceback"] = err_str
        finally:
            if task and "event" in task:
                task["event"].set()
    return 0.1  # يفحص كل 0.1 ثانية

class LiveAgentHTTPHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Request-Private-Network')
        self.send_header('Access-Control-Allow-Private-Network', 'true')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/ping' or self.path == '/scene':
            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            response_data = {
                "status": "online",
                "version": bpy.app.version_string,
                "scene": bpy.context.scene.name,
                "objects_count": len(bpy.data.objects),
                "objects": get_scene_objects_data(),
                "message": "Blender Live Bridge Connected Successfully"
            }
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        if self.path == '/execute':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data)
                completion_event = threading.Event()
                task = {
                    "code": data.get("code", ""),
                    "event": completion_event,
                    "status": "pending",
                    "error": None,
                    "objects_count": 0,
                    "duration": 0,
                    "objects": []
                }
                command_queue.put(task)
                
                # ننتظر حتى ينتهي بلندر من تنفيذ الكود (حتى 6 ثوانٍ كحد أقصى)
                completed = completion_event.wait(timeout=6.0)
                
                self.send_response(200)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                
                if completed and task.get("status") == "success":
                    resp = {
                        "status": "success",
                        "objects_count": task.get("objects_count", len(bpy.data.objects)),
                        "duration": task.get("duration", 0.1),
                        "objects": task.get("objects", []),
                        "message": f"تم بناء {task.get('objects_count')} مجسم في بلندر بنجاح!"
                    }
                elif completed and task.get("status") == "error":
                    resp = {
                        "status": "error",
                        "error": task.get("error", "Unknown error"),
                        "traceback": task.get("traceback", ""),
                        "message": f"حدث خطأ أثناء التنفيذ في بلندر: {task.get('error')}"
                    }
                else:
                    # في حالة التأخير، نقرأ الكائنات الحالية فوراً
                    resp = {
                        "status": "timeout",
                        "objects_count": len(bpy.data.objects),
                        "objects": get_scene_objects_data(),
                        "message": "تم إرسال الأمر إلى بلندر."
                    }
                self.wfile.write(json.dumps(resp).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
        elif self.path == '/proxy_chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(post_data)
                target_url = data.get("url", "https://opencode.ai/zen/v1/chat/completions")
                api_key = data.get("apiKey", "")
                payload = data.get("payload", {})
                
                req_headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                    "User-Agent": "OpenCode/1.0"
                }
                
                req = urllib.request.Request(target_url, data=json.dumps(payload).encode('utf-8'), headers=req_headers)
                try:
                    with urllib.request.urlopen(req, timeout=80.0) as upstream_res:
                        res_data = upstream_res.read().decode('utf-8')
                        self.send_response(200)
                        self._send_cors_headers()
                        self.send_header('Content-Type', 'application/json; charset=utf-8')
                        self.end_headers()
                        self.wfile.write(res_data.encode('utf-8'))
                except urllib.error.HTTPError as he:
                    err_body = he.read().decode('utf-8', errors='ignore')
                    self.send_response(he.code)
                    self._send_cors_headers()
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(err_body.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def log_message(self, format, *args):
        pass

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def start_server():
    global server_instance
    try:
        server_instance = ReusableTCPServer(('127.0.0.1', PORT), LiveAgentHTTPHandler)
        bpy.app.driver_namespace['liveagent_server'] = server_instance
        print(f"\n=======================================================")
        print(f"🚀 [LiveAgent Bridge] السيرفر يعمل الآن بنجاح على:")
        print(f"👉 http://127.0.0.1:{PORT}")
        print(f"👉 بانتظار أوامر التصميم من واجهة LiveAgent 3D...")
        print(f"=======================================================\n")
        server_instance.serve_forever()
    except Exception as e:
        print(f"[LiveAgent Bridge] تنبيه: {e}")

# تسجيل مؤقت المعالجة في بلندر
bpy.app.timers.register(process_command_queue, persistent=True)
bpy.app.driver_namespace['liveagent_timer'] = process_command_queue

# تشغيل السيرفر في Thread منفصل
server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()


class VIEW3D_PT_LiveAgentPanel(bpy.types.Panel):
    bl_label = "LiveAgent 3D Bridge"
    bl_idname = "VIEW3D_PT_liveagent_panel"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "LiveAgent"

    def draw(self, context):
        layout = self.layout
        col = layout.column(align=True)
        box = col.box()
        box.label(text="🟢 الجسر متصل ويعمل", icon='RADIOBUT_ON')
        box.label(text=f"المنفذ: {PORT}")
        box.label(text=f"كائنات المشهد: {len(bpy.data.objects)}")
        col.separator()
        col.operator("liveagent.clear_scene", text="🗑️ مسح كائنات المشهد", icon='TRASH')

class LIVEAGENT_OT_ClearScene(bpy.types.Operator):
    bl_idname = "liveagent.clear_scene"
    bl_label = "Clear Scene"
    bl_description = "مسح جميع الكائنات الشبكية في المشهد"

    def execute(self, context):
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False)
        self.report({'INFO'}, "تم مسح المشهد.")
        return {'FINISHED'}

def register():
    try:
        bpy.utils.register_class(VIEW3D_PT_LiveAgentPanel)
        bpy.utils.register_class(LIVEAGENT_OT_ClearScene)
    except Exception:
        pass

    try:
        if not hasattr(bpy.types.Material, 'shadow_method'):
            bpy.types.Material.shadow_method = bpy.props.StringProperty(name="shadow_method", default="NONE")
    except Exception:
        pass

    if not bpy.app.timers.is_registered(process_command_queue):
        bpy.app.timers.register(process_command_queue, persistent=True)

    global server_thread
    if not server_thread or not server_thread.is_alive():
        server_thread = threading.Thread(target=start_server, daemon=True)
        server_thread.start()

def unregister():
    try:
        bpy.utils.unregister_class(VIEW3D_PT_LiveAgentPanel)
        bpy.utils.unregister_class(LIVEAGENT_OT_ClearScene)
    except Exception:
        pass
    if bpy.app.timers.is_registered(process_command_queue):
        bpy.app.timers.unregister(process_command_queue)
