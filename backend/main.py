import os

# Enable Legacy Keras engine BEFORE TensorFlow import to bypass Keras 3 deserialization error
os.environ["TF_USE_LEGACY_KERAS"] = "1"

import json
import io
import requests
from pathlib import Path
import numpy as np
from PIL import Image
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KisanDrishti AI Backend")

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# GOVT API KEY (data.gov.in)
# ---------------------------------------------------------
GOV_API_KEY = "579b464db66ec23bdd000001953846ab2bc44fa65f550064462fe03d"


# Resolve paths dynamically relative to project root
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "best_plant_disease_model_20class.keras"
CLASS_NAMES_PATH = BASE_DIR / "models" / "class_names.json"

# Load 20-Class Keras Model & Class Mappings
print("Loading KisanDrishti 20-Class AI Model...")

# compile=False bypasses optimizer/initializer deserialization crashes
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)
print("Model Loaded Successfully!")

# 20 Classes Actionable Advisory Mappings
ADVISORY_MAP = {
    "Apple___Apple_scab": {"severity": "Moderate", "advice": ["Apply Captan 50% WP fungicide.", "Prune infected branches and dispose of fallen debris.", "Avoid overhead irrigation to keep leaves dry."]},
    "Apple___Black_rot": {"severity": "Severe", "advice": ["Spray Copper Oxychloride 50% WP at early bud stage.", "Remove mummified fruits and dead wood.", "Ensure proper canopy air circulation."]},
    "Apple___Cedar_apple_rust": {"severity": "Moderate", "advice": ["Apply Myclobutanil fungicide at pink bud stage.", "Remove nearby cedar galls if present.", "Use rust-resistant apple cultivars."]},
    "Apple___healthy": {"severity": "Healthy", "advice": ["No disease detected. Maintain optimal irrigation and balanced NPK fertilizer.", "Inspect leaf underside weekly for pests."]},
    "Cherry_(including_sour)___Powdery_mildew": {"severity": "Moderate", "advice": ["Apply Wettable Sulfur or Hexaconazole 5% EC.", "Ensure sunlight penetration by light pruning.", "Apply organic neem oil spray during early morning."]},
    "Corn_(maize)___Common_rust_": {"severity": "Moderate", "advice": ["Apply Mancozeb 75% WP @ 2.5g/L.", "Practice crop rotation with non-cereal crops.", "Avoid excessive nitrogenous fertilizing."]},
    "Corn_(maize)___Northern_Leaf_Blight": {"severity": "Severe", "advice": ["Spray Azoxystrobin 23% SC @ 1ml/L at first sign of lesions.", "Destroy post-harvest crop residues.", "Use certified disease-resistant seeds."]},
    "Grape___Black_rot": {"severity": "Severe", "advice": ["Spray Myclobutanil or Mancozeb before and after bloom.", "Prune canopy for sunlight exposure.", "Remove infected berries and canes."]},
    "Grape___Esca_(Black_Measles)": {"severity": "Severe", "advice": ["Apply wound sealant after winter pruning.", "Remove severely affected vines from vineyard.", "Avoid heavy irrigation in high humidity."]},
    "Peach___Bacterial_spot": {"severity": "High", "advice": ["Apply Copper Hydroxide spray before spring bud break.", "Avoid high nitrogen fertilizing.", "Maintain proper soil drainage."]},
    "Pepper,_bell___Bacterial_spot": {"severity": "High", "advice": ["Spray Fixed Copper fungicide mixed with Mancozeb.", "Practice 2-3 year crop rotation.", "Use drip irrigation instead of overhead sprinklers."]},
    "Potato___Early_blight": {"severity": "Moderate", "advice": ["Spray Chlorothalonil or Mancozeb @ 2g/L.", "Maintain balanced nitrogen and potassium.", "Remove lower infected leaves early."]},
    "Potato___Late_blight": {"severity": "Severe", "advice": ["Apply Cymoxanil + Mancozeb @ 2g/L immediately.", "Destroy infected foliage 2 weeks prior to harvest.", "High hilling to prevent tuber infection."]},
    "Potato___healthy": {"severity": "Healthy", "advice": ["Plant is healthy. Keep soil moist but well-drained.", "Monitor regularly for flea beetles and aphids."]},
    "Squash___Powdery_mildew": {"severity": "Moderate", "advice": ["Spray Potassium Bicarbonate or Wettable Sulfur.", "Increase plant spacing for better airflow.", "Water at soil level without wetting foliage."]},
    "Strawberry___Leaf_scorch": {"severity": "Moderate", "advice": ["Apply Copper-based fungicides post-harvest.", "Mow old leaves during post-harvest renovation.", "Keep beds weed-free to reduce humidity."]},
    "Tomato___Bacterial_spot": {"severity": "High", "advice": ["Spray Copper Hydroxide + Mancozeb mixture.", "Avoid handling plants when wet.", "Mulch base to prevent soil splash onto leaves."]},
    "Tomato___Early_blight": {"severity": "Moderate", "advice": ["Apply Copper Fungicide or Chlorothalonil @ 2g/L.", "Stake plants and remove lower 12 inches of foliage.", "Rotate crops annually."]},
    "Tomato___Late_blight": {"severity": "Severe", "advice": ["Spray Metalaxyl + Mancozeb immediately at first sign.", "Remove and burn heavily infected plants.", "Keep greenhouse/field humidity low."]},
    "Tomato___healthy": {"severity": "Healthy", "advice": ["Crop is healthy. Continue organic compost mulching.", "Provide consistent watering to prevent blossom end rot."]}
}

# ---------------------------------------------------------
# 1. Disease Prediction Endpoint
# ---------------------------------------------------------
@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Resize to 224x224 (Rescaling layer is built-in inside model)
        image = image.resize((224, 224))
        image_array = np.array(image).astype("float32")
        image_array = np.expand_dims(image_array, axis=0)

        # Inference
        predictions = model.predict(image_array, verbose=0)
        probabilities = predictions[0]

        predicted_idx = int(np.argmax(probabilities))
        confidence = round(float(probabilities[predicted_idx] * 100), 2)
        raw_class = class_names[predicted_idx]

        parts = raw_class.split("___")
        crop_title = parts[0].replace("_", " ").replace(",", "").strip()
        disease_title = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Healthy"
        
        display_disease = f"{crop_title} - {disease_title}" if disease_title.lower() != "healthy" else f"{crop_title} (Healthy)"

        advisory_info = ADVISORY_MAP.get(raw_class, {
            "severity": "Moderate",
            "advice": ["Consult local agricultural extension office for targeted treatment."]
        })

        return {
            "disease": display_disease,
            "confidence": confidence,
            "severity": advisory_info["severity"],
            "advice": advisory_info["advice"],
            "filename": file.filename
        }
    except Exception as e:
        print("Prediction Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# 2. Spraying Calculator Endpoint
# ---------------------------------------------------------
@app.get("/api/spray_calc")
async def calculate_spray(acres: float = 1.0, disease: str = "General", wind_speed: float = 10.0):
    water_req = round(acres * 200, 1)  # 200 Liters per acre
    tanks = round(water_req / 15, 1)   # 15 Liter tank capacity
    
    chemical = "Mancozeb 75% WP"
    dose_per_tank = 30 # ml or grams per tank
    
    if "blight" in disease.lower():
        chemical = "Chlorothalonil 75% WP"
        dose_per_tank = 35
    elif "rot" in disease.lower() or "scab" in disease.lower():
        chemical = "Copper Oxychloride 50% WP"
        dose_per_tank = 40
    elif "healthy" in disease.lower():
        chemical = "Bio-Nutrient Spray"
        dose_per_tank = 20

    total_chem = round(tanks * dose_per_tank, 1)
    spray_time = round(acres * 1.5, 1)

    is_safe = wind_speed < 15.0
    status_msg = "Weather conditions are optimal for spraying." if is_safe else "High wind speed! Avoid spraying to prevent drift."

    return {
        "total_spray_volume_l": water_req,
        "tank_refills": tanks,
        "chemical_name": chemical,
        "chemical_dose_per_tank": dose_per_tank,
        "spraying_time_hours": spray_time,
        "total_chemical_needed": total_chem,
        "is_safe": is_safe,
        "status_message": status_msg
    }

# ---------------------------------------------------------
# 3. Live Weather Endpoint (Open-Meteo Live API - No Key Needed)
# ---------------------------------------------------------
@app.get("/weather")
@app.get("/api/weather")
async def get_weather(location: str = "Delhi"):
    loc_clean = location.strip().capitalize() if location else "Delhi"
    
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={loc_clean}&count=1&language=en&format=json"
        geo_res = requests.get(geo_url, timeout=5)
        
        if geo_res.status_code == 200 and geo_res.json().get("results"):
            city_data = geo_res.json()["results"][0]
            lat = city_data["latitude"]
            lon = city_data["longitude"]
            display_name = city_data.get("name", loc_clean)

            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            w_res = requests.get(weather_url, timeout=5)

            if w_res.status_code == 200:
                current = w_res.json().get("current", {})
                
                code = current.get("weather_code", 0)
                condition = "Clear Sky"
                if code in [1, 2, 3]:
                    condition = "Partly Cloudy"
                elif code in [45, 48]:
                    condition = "Foggy"
                elif code in [51, 53, 55, 61, 63, 65, 80, 81, 82]:
                    condition = "Rainy"
                elif code in [95, 96, 99]:
                    condition = "Thunderstorm"

                return {
                    "location": display_name,
                    "temp_c": round(current.get("temperature_2m", 28.5), 1),
                    "condition": condition,
                    "humidity": current.get("relative_humidity_2m", 60),
                    "wind_speed_kmh": round(current.get("wind_speed_10m", 12.0), 1),
                    "rain_probability": 15
                }

    except Exception as e:
        print("Live Weather API Fetch Error, using fallback:", e)

    return {
        "location": loc_clean,
        "temp_c": 28.5,
        "condition": "Partly Cloudy",
        "humidity": 62,
        "wind_speed_kmh": 12.4,
        "rain_probability": 15
    }

# ---------------------------------------------------------
# 4. Live Govt Mandi Rates Endpoint (Agmarknet via Data.gov.in)
# ---------------------------------------------------------
@app.get("/mandi")
@app.get("/api/mandi")
async def get_mandi_rates(location: str = "Delhi", crop: str = "Tomato"):
    loc_clean = location.strip().title() if location else "Delhi"
    crop_clean = crop.strip().title() if crop else "Tomato"

    gov_url = f"https://api.data.gov.in/resource/9ef7421f-111d-4c18-7e48-82a376d52371?api-key={GOV_API_KEY}&format=json&limit=10"
    
    if crop_clean and crop_clean.lower() != "all crops":
        gov_url += f"&filters[commodity]={crop_clean}"
    if loc_clean:
        gov_url += f"&filters[district]={loc_clean}"

    try:
        if GOV_API_KEY != "PASTE_YOUR_API_KEY_HERE":
            response = requests.get(gov_url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                records = data.get("records", [])

                if records:
                    mandi_list = []
                    for rec in records:
                        mandi_list.append({
                            "market": rec.get("market", f"{loc_clean} APMC Mandi"),
                            "state": rec.get("state", "Regional State"),
                            "crop": rec.get("commodity", crop_clean),
                            "min_price": int(float(rec.get("min_price", 0))),
                            "max_price": int(float(rec.get("max_price", 0))),
                            "modal_price": int(float(rec.get("modal_price", 0))),
                            "unit": "₹ / Quintal"
                        })
                    return mandi_list
    except Exception as e:
        print("Govt API fetch error, falling back to dynamic formula:", e)

    base_prices = {
        "Chilli": 15000, "Tomato": 2100, "Potato": 1450, 
        "Wheat": 2350, "Apple": 7200, "Onion": 1850, "Rice": 3200
    }
    
    loc_multipliers = {
        "Guntur": 0.85, "Nashik": 0.90, "Delhi": 1.10, 
        "Ludhiana": 1.05, "Shimla": 1.18, "Agra": 1.02
    }
    
    price = base_prices.get(crop_clean, 2200)
    multiplier = loc_multipliers.get(loc_clean, 1.0)
    final_price = round(price * multiplier)

    return [{
        "market": f"{loc_clean} APMC Market",
        "state": "Regional Market",
        "crop": crop_clean,
        "min_price": int(final_price * 0.9),
        "max_price": int(final_price * 1.1),
        "modal_price": final_price,
        "unit": "₹ / Quintal"
    }]