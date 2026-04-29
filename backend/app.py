from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import math

app = Flask(__name__)
CORS(app)

# Load data
hotspots = pd.read_csv("../data/hotspots.csv")
authorities = pd.read_excel("../data/authority_master.xlsx")

@app.route("/")
def home():
    return "Smart Waste Backend Running"

# ---------------- HOTSPOTS ----------------
@app.route("/hotspots")
def get_hotspots():
    return jsonify(hotspots.to_dict(orient="records"))

# ---------------- AUTHORITIES ----------------
@app.route("/authorities")
def get_authorities():
    return jsonify(authorities.to_dict(orient="records"))

# ---------------- DISTANCE (REAL WORLD) ----------------
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat/2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2) ** 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

# ---------------- AUTO MATCH ENGINE ----------------
@app.route("/match")
def match_hotspot():
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))
    name = request.args.get("name", "").lower()

    # Step 1: nearest authority by real distance
    authorities["distance"] = authorities.apply(
        lambda row: calculate_distance(
            lat, lon,
            row["Latitude"],
            row["Longitude"]
        ),
        axis=1
    )

    nearest = authorities.loc[authorities["distance"].idxmin()]

    # Step 2: filter zone
    zone_data = authorities[
        authorities["Zone Name"] == nearest["Zone Name"]
    ]

    # Step 3: ward refinement (optional match)
    matched = None
    for _, row in zone_data.iterrows():
        if str(row["Ward Name"]).lower() in name or name in str(row["Ward Name"]).lower():
            matched = row
            break

    if matched is None:
        matched = nearest

    return jsonify({
        "Zone Name": matched["Zone Name"],
        "Ward Name": matched["Ward Name"],
        "Phone": str(matched["Phone"]),
        "Address": matched["Address"]
    })

if __name__ == "__main__":
    app.run(debug=True)