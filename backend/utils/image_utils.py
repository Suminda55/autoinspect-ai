import base64
import io
import cv2


def to_data_uri(image_bgr):
    ok, buffer = cv2.imencode(".jpg", image_bgr)
    if not ok:
        return None
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")


def pil_to_data_uri(pil_image):
    buffer = io.BytesIO()
    pil_image.save(buffer, format="JPEG", quality=95)
    return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")


def clamp_box(left, top, width, height, image_width, image_height):
    left = max(0, min(int(round(left)), image_width - 1))
    top = max(0, min(int(round(top)), image_height - 1))
    width = max(1, min(int(round(width)), image_width - left))
    height = max(1, min(int(round(height)), image_height - top))
    return left, top, width, height


def percentage_to_pixels(value, total):
    try:
        if isinstance(value, str) and value.strip().endswith("%"):
            return float(value.strip().rstrip("%")) * float(total) / 100.0
        return int(round(float(value)))
    except Exception:
        return 0.0


def normalize_box(box, image_width, image_height):
    left = percentage_to_pixels(box.get("left", 0), image_width)
    top = percentage_to_pixels(box.get("top", 0), image_height)
    width = percentage_to_pixels(box.get("width", image_width * 0.3), image_width)
    height = percentage_to_pixels(box.get("height", image_height * 0.3), image_height)
    return clamp_box(left, top, width, height, image_width, image_height)