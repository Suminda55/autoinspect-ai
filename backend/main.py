from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AutoInspect AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AutoInspect AI Backend is Running Successfully! 🚀"}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    return {
        "status": "success",
        "filename": file.filename,
        "message": f"Successfully received {file.filename} for AI damage detection!",
        "detected_damage": "Front Bumper Dent & Scratch",
        "severity": "78%",
        "estimated_cost": "$350 - $450"
    }