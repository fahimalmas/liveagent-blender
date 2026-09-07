"""
LiveAgent-Blender: FastAPI Application Server
--------------------------------------------
يقوم بتشغيل سيرفر الويب وتوفير الـ API للواجهة الأمامية والربط مع Blender.
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from pathlib import Path
from agent import SYSTEM_PROMPT, extract_python_code

app = FastAPI(title="LiveAgent 3D - Blender AI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BLENDER_BRIDGE_URL = os.environ.get("BLENDER_BRIDGE_URL", "http://localhost:8123")

class ChatRequest(BaseModel):
    message: str
    model: str = "gemini-flash"

class ExecuteRequest(BaseModel):
    code: str

@app.get("/api/status")
def get_status():
    try:
        res = requests.get(f"{BLENDER_BRIDGE_URL}/ping", timeout=2)
        if res.status_code == 200:
            return {"blender": "connected", "details": res.json()}
    except Exception:
        pass
    return {"blender": "disconnected", "url": BLENDER_BRIDGE_URL}

@app.post("/api/execute")
def execute_code(req: ExecuteRequest):
    try:
        res = requests.post(f"{BLENDER_BRIDGE_URL}/execute", json={"code": req.code}, timeout=5)
        return res.json()
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"تعذر الاتصال بجسر بلندر: {str(e)}")

# تقديم الواجهة الأمامية الثابتة (Frontend static files)
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    print("🚀 جاري تشغيل سيرفر LiveAgent على http://localhost:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
