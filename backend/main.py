from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
from ultralytics import YOLO
from damage_detector import analyze_and_annotate_damage

app = FastAPI(title="AutoInspect AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = YOLO("yolov8n.pt")
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

VEHICLE_CLASS_IDS = [2, 3, 5, 6, 7]
@app.get("/")
def read_root():
    return {"message": "AutoInspect AI Backend is Running!"}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        detected_objects = []
        is_vehicle_detected = False
        car_box_coords = None

        if model:
            results = model(temp_file_path)
            max_area = 0
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = model.names[cls_id]
                    detected_objects.append(label)

                    if cls_id in VEHICLE_CLASS_IDS:
                        is_vehicle_detected = True
                        coords = box.xyxy[0].tolist()
                        bx1, by1, bx2, by2 = int(coords[0]), int(coords[1]), int(coords[2]), int(coords[3])
                        area = (bx2 - bx1) * (by2 - by1)
                        if area > max_area:
                            max_area = area
                            car_box_coords = [bx1, by1, bx2, by2]
        if not is_vehicle_detected:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            raise HTTPException(
                status_code=400, 
                detail="Invalid Image! No vehicle detected. Please upload a clear vehicle photo."
            )

        analysis_result = analyze_and_annotate_damage(temp_file_path, car_box=car_box_coords)

        if len(analysis_result) == 5:
            score, damage_type, annotated_image, analysis_notes, bounding_boxes = analysis_result
        elif len(analysis_result) == 4:
            score, damage_type, annotated_image, analysis_notes = analysis_result
            bounding_boxes = []
        else:
            score, damage_type, annotated_image = analysis_result
            analysis_notes = "Assessment complete. Results are approximate and should be verified manually."
            bounding_boxes = []

        if score >= 70.0:
            severity = "High"
            severity_percent = int(round(score))
            estimated_cost = f"${int(score * 18)} - ${int(score * 30)}"
        elif score >= 35.0:
            severity = "Medium"
            severity_percent = int(round(score))
            estimated_cost = f"${int(score * 10)} - ${int(score * 18)}"
        else:
            severity = "Low"
            severity_percent = max(0, int(round(score)))
            estimated_cost = "$0 - $250"

        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        return {
            "status": "success",
            "filename": file.filename,
            "detected_damage": damage_type,
            "severity": severity,
            "severity_percent": severity_percent,
            "estimated_cost": estimated_cost,
            "detected_objects": detected_objects,
            "annotated_image": annotated_image,
            "bounding_boxes": bounding_boxes,
            "analysis_notes": f"{analysis_notes} Damage Index Score: {score}/100"
        }

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)