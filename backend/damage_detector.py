import json
import os
import cv2
from PIL import Image, ImageFile, ImageOps

from utils.cv_fallback import fallback_cv_analysis
from utils.image_utils import normalize_box, pil_to_data_uri, to_data_uri

try:
    from groq import Groq
except Exception:
    Groq = None

try:
    import pillow_heif

    pillow_heif.register_heif_opener()
except Exception:
    pass

ImageFile.LOAD_TRUNCATED_IMAGES = True


def _extract_json_payload(text):
    text = (text or "").strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return json.loads(text)


def _try_groq_analysis(image_path, car_box=None):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or Groq is None:
        return None

    try:
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

        pil_image = Image.open(image_path)
        pil_image = ImageOps.exif_transpose(pil_image)
        full_width, full_height = pil_image.size

        if car_box:
            x1, y1, x2, y2 = car_box
            crop_box = (max(0, x1), max(0, y1), max(0, x2), max(0, y2))
            pil_image = pil_image.crop(crop_box)

        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        image_data_uri = pil_to_data_uri(pil_image)

        prompt = """
You are an expert vehicle damage assessment system.
Analyze this vehicle image and identify the most likely damaged components.

Return RAW JSON ONLY:
{
  "is_damaged": true,
  "detected_damage": "Front Bumper & Headlight Assembly Structural Damage",
  "severity_pct": 90,
  "estimated_cost": "$1500 - $2500",
  "analysis_notes": "AI Vision inspection successfully completed.",
  "bounding_boxes": [
      {
          "label": "Severe Bumper Damage",
          "top": 20,
          "left": 20,
          "width": 60,
          "height": 60
      }
  ]
}
No markdown, no code fences, no backticks. Pure JSON string only.
Only include bounding boxes when you are confident about the exact visible damaged area.
Use percentage coordinates from 0 to 100 relative to the analyzed image.
"""

        response = client.chat.completions.create(
            model=os.getenv("GROQ_VISION_MODEL", "llama-3.2-90b-vision-preview"),
            messages=[
                {"role": "system", "content": "Return only valid JSON for vehicle damage inspection."},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": image_data_uri}},
                    ],
                },
            ],
            temperature=0.2,
            max_completion_tokens=600,
            response_format={"type": "json_object"},
        )

        response_text = (response.choices[0].message.content or "").strip()
        data = _extract_json_payload(response_text)
        
        score = float(data.get("severity_pct", 0) or 0)
        damage_type = data.get("detected_damage") or "Vehicle damage assessment complete"

        boxes = []
        for box in data.get("bounding_boxes", []) or []:
            try:
                left, top, width, height = normalize_box(box, full_width, full_height)
                boxes.append({
                    "label": box.get("label", "damage"),
                    "left": int(left),
                    "top": int(top),
                    "width": int(width),
                    "height": int(height),
                })
            except Exception:
                continue

        annotated = cv2.imread(image_path)
        if annotated is not None:
            for box in boxes:
                bx, by, bw, bh = box["left"], box["top"], box["width"], box["height"]
                cv2.rectangle(annotated, (bx, by), (bx + bw, by + bh), (0, 0, 255), 3)
                label = str(box.get("label", "damage"))
                cv2.rectangle(annotated, (bx, max(0, by - 25)), (bx + len(label) * 11, by), (0, 0, 255), -1)
                cv2.putText(annotated, label, (bx + 5, max(18, by - 7)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        annotated_image_url = to_data_uri(annotated) if annotated is not None else image_data_uri
        notes = data.get("analysis_notes", "AI Inspection Complete.")

        return round(score, 1), damage_type, annotated_image_url, notes, boxes

    except Exception:
        return None


def analyze_and_annotate_damage(image_path, car_box=None):
    try:
        groq_result = _try_groq_analysis(image_path, car_box=car_box)
        if groq_result:
            return groq_result

        return fallback_cv_analysis(image_path, car_box=car_box)

    except Exception as e:
        print(f"Error in damage detector: {e}")
        return 0.0, "Unable to analyze image", None, "The image could not be analyzed safely."