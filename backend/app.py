from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
import math
import io
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=False)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "garbage_model.h5")
model = tf.keras.models.load_model(MODEL_PATH)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
hotspots = pd.read_csv(os.path.join(DATA_DIR, "hotspots.csv"))
authorities = pd.read_excel(os.path.join(DATA_DIR, "authority_master.xlsx"))
authorities = authorities.dropna(subset=["Latitude", "Longitude"])

REPORTS_FILE = os.path.join(os.path.dirname(__file__), "data", "reports.json")

def load_reports():
    if os.path.exists(REPORTS_FILE):
        with open(REPORTS_FILE, "r") as f:
            return json.load(f)
    return []

def save_reports(reports):
    with open(REPORTS_FILE, "w") as f:
        json.dump(reports, f, indent=2)

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)) * 1000

def match_authority(lat, lon, name=""):
    authorities["_dist"] = authorities.apply(
        lambda row: calculate_distance(lat, lon, row["Latitude"], row["Longitude"]), axis=1
    )
    nearest = authorities.loc[authorities["_dist"].idxmin()]
    zone_data = authorities[authorities["Zone Name"] == nearest["Zone Name"]]
    matched = None
    name_lower = name.lower()
    for _, row in zone_data.iterrows():
        ward = str(row["Ward Name"]).lower()
        if ward in name_lower or name_lower in ward:
            matched = row
            break
    if matched is None:
        matched = nearest
    return {
        "Zone Name": matched["Zone Name"],
        "Ward Name": matched["Ward Name"],
        "Phone": str(matched["Phone"]),
        "Address": matched["Address"]
    }

def corsify(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, ngrok-skip-browser-warning"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/")
def home():
    return "Smart Waste Backend Running!"

@app.route("/hotspots", methods=["GET", "OPTIONS"])
def get_hotspots():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    return corsify(make_response(jsonify(hotspots.to_dict(orient="records"))))

@app.route("/authorities", methods=["GET", "OPTIONS"])
def get_authorities():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    return corsify(make_response(jsonify(authorities.to_dict(orient="records"))))

@app.route("/match", methods=["GET", "OPTIONS"])
def match_hotspot():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))
    name = request.args.get("name", "")
    return corsify(make_response(jsonify(match_authority(lat, lon, name))))

@app.route("/detect", methods=["POST", "OPTIONS"])
def detect():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    try:
        file = request.files["photo"]
        lat = float(request.form.get("lat", 0))
        lon = float(request.form.get("lon", 0))

        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
        confidence = float(model.predict(img_array)[0][0]) * 100

        if confidence >= 80:
            status = "GARBAGE DUMP DETECTED!"
            level = "danger"
        elif confidence >= 60:
            status = "SMALL GARBAGE WARNING!"
            level = "warning"
        else:
            status = "NO GARBAGE FOUND!"
            level = "success"

        result = {
            "status": status,
            "confidence": round(confidence, 2),
            "level": level,
            "latitude": lat,
            "longitude": lon
        }

        if level != "success" and lat != 0 and lon != 0:
            result["authority"] = match_authority(lat, lon)

        return corsify(make_response(jsonify(result)))

    except Exception as e:
        return corsify(make_response(jsonify({"error": str(e)}), 500))

@app.route("/save_report", methods=["POST", "OPTIONS"])
def save_report():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    try:
        data = request.json
        lat = float(data.get("lat"))
        lon = float(data.get("lon"))
        reports = load_reports()
        for r in reports:
            dist = calculate_distance(lat, lon, r["lat"], r["lon"])
            if dist < 100:
                return corsify(make_response(jsonify({"saved": False, "reason": "Duplicate location!"})))
        report = {
            "id": len(reports) + 1,
            "lat": lat, "lon": lon,
            "confidence": data.get("confidence"),
            "status": data.get("status"),
            "level": data.get("level"),
            "authority": data.get("authority", {}),
            "photo": data.get("photo"),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        reports.append(report)
        save_reports(reports)
        return corsify(make_response(jsonify({"saved": True})))
    except Exception as e:
        return corsify(make_response(jsonify({"error": str(e)}), 500))

@app.route("/reports", methods=["GET", "OPTIONS"])
def get_reports():
    if request.method == "OPTIONS":
        return corsify(make_response("", 200))
    return corsify(make_response(jsonify(load_reports())))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
