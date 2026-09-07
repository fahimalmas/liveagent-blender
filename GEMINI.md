# LiveAgent-Blender: Persistent Agent Guidelines & Project Memory

This project is an AI-powered 3D modeling assistant pairing a web interface (Three.js) with **Blender 5.2 LTS** in real time via a local bridge server (`blender_addon/live_bridge.py` on port 8123).

For the complete project history, architectural details, and troubleshooting archive, read:
👉 [`PROJECT_MEMORY.md`](file:///c:/Users/do-mo/Desktop/Agnt%20Soprr/PROJECT_MEMORY.md)
👉 [`SKILL.md`](file:///c:/Users/do-mo/Desktop/Agnt%20Soprr/.agent/skills/blender-5-2-expert/SKILL.md)

---

## Non-Negotiable Core Rules for this Codebase:

1. **Target Blender Version: Blender 5.2.x LTS with EEVEE Next**:
   - Never set `material.shadow_method` (removed in Blender 4.2+ / 5.2+).
   - Never use obsolete EEVEE settings like `scene.eevee.use_bloom` or `scene.eevee.use_ssr`.
   - Principled BSDF socket names MUST use Blender 5.2 standards:
     - `inputs['Transmission Weight']` (NOT `Transmission`)
     - `inputs['Specular IOR Level']` (NOT `Specular`)
     - `inputs['Emission Color']` and `inputs['Emission Strength']` (NOT `Emission`)
     - `inputs['Coat Weight']` (NOT `Coat` or `Clearcoat`)
     - `inputs['Subsurface Weight']` (NOT `Subsurface`)
     - `inputs['Sheen Weight']` (NOT `Sheen`)

2. **Primitive Modeling in Object Mode**:
   - Always construct models in Object Mode (`bpy.ops.mesh.primitive_*_add`).
   - Never invoke Edit Mode toggle or edit mode extrusions.
   - Always supply explicit `radius`, `depth`, `location`, `rotation` arguments.

3. **Multi-Provider AI Architecture**:
   - Groq Cloud: active models `qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `openai/gpt-oss-20b`.
   - Google Gemini: `gemini-1.5-flash` (1,500 req/day), `gemini-2.0-flash`.
   - OpenRouter: free models router.

4. **Live Bridge**:
   - Runs on `http://127.0.0.1:8123`.
   - Uses `clean_bpy_code` to sanitize inputs and upgrade legacy properties.
   - Uses `safe_exec` to recover automatically from syntax or runtime errors by auto-skipping faulty lines.
