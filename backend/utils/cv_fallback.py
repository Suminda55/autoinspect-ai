import cv2
import numpy as np
from utils.image_utils import to_data_uri


def fallback_cv_analysis(image_path, car_box=None):
    img_color = cv2.imread(image_path)
    if img_color is None:
        return 0.0, "Unable to analyze image", None, "The image could not be decoded by OpenCV."

    h, w, _ = img_color.shape
    img_gray = cv2.cvtColor(img_color, cv2.COLOR_BGR2GRAY)
    img_resized = cv2.resize(img_gray, (500, 500))

    edges_std = cv2.Canny(img_resized, 50, 150)
    edge_percent = (np.sum(edges_std > 0) / (500 * 500)) * 100
    laplacian_var = cv2.Laplacian(img_resized, cv2.CV_64F).var()
    _, std_dev = cv2.meanStdDev(img_resized)

    raw_score = (edge_percent * 2.5) + (laplacian_var / 40.0) + (std_dev[0][0] / 2.0)
    score = max(0.0, min(95.0, raw_score))

    annotated_img = img_color.copy()

    if car_box:
        x1, y1, x2, y2 = car_box
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
    else:
        x1, y1, x2, y2 = 0, 0, w, h

    car_w = max(1, x2 - x1)
    car_h = max(1, y2 - y1)
    car_roi = img_gray[y1:y2, x1:x2]

    wheel_mask = np.ones((car_h, car_w), dtype=np.uint8) * 255
    cutoff_y = int(car_h * 0.80)
    wheel_mask[cutoff_y:, :] = 0

    blur = cv2.GaussianBlur(car_roi, (5, 5), 0)
    edges = cv2.Canny(blur, 40, 120)
    edges = cv2.bitwise_and(edges, edges, mask=wheel_mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    dilated = cv2.dilate(edges, kernel, iterations=2)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    valid_damage_boxes = []
    for cnt in contours:
        bx, by, bw, bh = cv2.boundingRect(cnt)
        b_area = bw * bh

        if (b_area > (car_w * car_h * 0.02)) and (bw < car_w * 0.8) and (bh < car_h * 0.8):
            roi_edge_part = edges[by : by + bh, bx : bx + bw]
            density = np.sum(roi_edge_part > 0) / max(1, b_area)
            valid_damage_boxes.append((x1 + bx, y1 + by, bw, bh, density))

    valid_damage_boxes = sorted(valid_damage_boxes, key=lambda b: b[4], reverse=True)

    if len(valid_damage_boxes) > 0:
        top_x, top_y, top_w, top_h, _ = valid_damage_boxes[0]
        label = "possible damage"
    else:
        top_x = x1 + int(car_w * 0.3)
        top_y = y1 + int(car_h * 0.25)
        top_w = int(car_w * 0.4)
        top_h = int(car_h * 0.4)
        label = "uncertain area"

    cv2.rectangle(annotated_img, (top_x, top_y), (top_x + top_w, top_y + top_h), (0, 0, 255), 3)
    overlay = annotated_img.copy()
    cv2.rectangle(overlay, (top_x, top_y), (top_x + top_w, top_y + top_h), (0, 0, 255), -1)
    cv2.addWeighted(overlay, 0.25, annotated_img, 0.75, 0, annotated_img)
    cv2.putText(
        annotated_img,
        f"{label.upper()} ({int(score)}%)",
        (top_x, max(25, top_y - 10)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 0, 255),
        2,
    )

    if score >= 60.0:
        damage_type = "Possible severe vehicle damage detected - manual review recommended"
    elif score >= 35.0:
        damage_type = "Possible moderate vehicle damage detected - manual review recommended"
    else:
        damage_type = "No obvious structural damage detected"

    annotated_image_url = to_data_uri(annotated_img)
    notes = "Heuristic estimate only. Groq API fallback was used."
    return round(float(score), 1), damage_type, annotated_image_url, notes, [{"label": label, "left": top_x, "top": top_y, "width": top_w, "height": top_h}]