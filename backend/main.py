# KisanDrishti - Master Integration Backend
import os
from fastapi import FastAPI, File, Form, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware

# Import Team Modules
import data_service
import model_inference
import spray_calc

app = FastAPI(title="KisanDrishti API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADVISORY_DATABASE = {
    "Tomato Early Blight": [
        "Apply Mancozeb 75% WP or Copper Oxychloride at first sign of spots.",
        "Maintain proper plant spacing for sunlight and air movement.",
        "Remove and destroy infected lower leaves immediately."
    ],
    "Tomato Late Blight": [
        "Apply Cymoxanil + Mancozeb combination fungicide immediately.",
        "Avoid overhead irrigation to reduce humidity on leaves.",
        "Monitor crop daily; late blight spreads rapidly in moist conditions."
    ],
    "Potato Early Blight": [
        "Apply Chlorothalonil 75% WP as per spray calculation.",
        "Ensure balanced nitrogen fertilisation to reduce susceptibility.",
        "Destroy crop residues after harvest."
    ],
    "Corn Common Rust": [
        "Spray Azoxystrobin + Difenoconazole if rust pustules cover > 5% leaf area.",
        "Plant rust-resistant hybrids in future seasons.",
        "Avoid excessive nitrogen application."
    ],
    "Apple Scab": [
        "Apply Captan 50% WP during early green cluster stage.",
        "Prune canopy for rapid drying after rainfall.",
        "Clear fallen infected leaves during winter clean-up."
    ]
}

def format_spray_response(spray_data: dict) -> dict:
    """Normalizes keys so Spraying.jsx renders without undefined errors."""
    return {
        **spray_data,
        "tank_refills": spray_data.get("total_tank_refills", 1),
        "chemical_name": spray_data.get("recommended_chemical", "Broad Spectrum Fungicide"),
        "chemical_dose_per_tank": spray_data.get("chem_per_full_tank_ml", 30.0),
        "spraying_time_hours": spray_data.get("est_spray_time_hrs", 1.0),
        "total_chemical_needed": spray_data.get("chemical_quantity_ml", 0.0),
        "is_safe": spray_data.get("can_spray", True),
        "status_message": spray_data.get("safety_warning", "Normal spray conditions."),
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "KisanDrishti Backend Fully Operational"}

@app.post("/api/diagnose")
async def diagnose_leaf(
    file: UploadFile = File(...),
    acres: float = Form(2.5),
    wind_speed: float = Form(10.0),
):
    try:
        allowed_exts = [".jpg", ".jpeg", ".png", ".webp", ".jfif"]
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_exts:
            return {
                "success": False,
                "error": f"Invalid file type '{ext}'. Please upload an image file (.jpg, .png, .jpeg)."
            }

        acres = max(0.1, acres)
        wind_speed = max(0.0, wind_speed)

        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        prediction = model_inference.predict_disease(temp_path)

        if os.path.exists(temp_path):
            os.remove(temp_path)

        disease = prediction.get("disease", "Tomato Early Blight")
        prediction["advice"] = ADVISORY_DATABASE.get(
            disease,
            [
                "Apply broad-spectrum fungicide or bactericide as preventive measure.",
                "Ensure clean irrigation water and balanced crop nutrition.",
                "Consult local Krishi Vigyan Kendra (KVK) if symptoms worsen."
            ]
        )

        raw_spray = spray_calc.calculate_spray_parameters(disease, acres, wind_speed)
        formatted_spray = format_spray_response(raw_spray)

        return {
            "success": True,
            "prediction": prediction,
            "spray_calculation": formatted_spray,
        }

    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return {"success": False, "error": str(e)}

# =========================================================
# SPRAY CALCULATION ENDPOINT
# =========================================================
@app.get("/spray_calc")
@app.get("/api/spray_calc")
def calculate_spray_endpoint(
    acres: float = Query(2.0),
    disease: str = Query("Tomato Early Blight"),
    wind_speed: float = Query(10.0)
):
    try:
        acres = max(0.1, acres)
        wind_speed = max(0.0, wind_speed)
        disease_name = disease if disease and disease != "None Detected" else "Tomato Early Blight"
        
        raw_spray = spray_calc.calculate_spray_parameters(disease_name, acres, wind_speed)
        return format_spray_response(raw_spray)
    except Exception as e:
        return {
            "error": str(e),
            "total_spray_volume_l": 0,
            "tank_refills": 0,
            "chemical_name": "N/A",
            "chemical_dose_per_tank": 0,
            "spraying_time_hours": 0,
            "total_chemical_needed": 0,
            "is_safe": False,
            "status_message": f"Calculation error: {str(e)}"
        }

# =========================================================
# WEATHER ENDPOINTS
# =========================================================
@app.get("/weather")
@app.get("/api/weather")
def get_weather(location: str = "Delhi"):
    data = data_service.get_weather_data(location)
    if isinstance(data, dict):
        val = data.get("temp_c", data.get("temp", 30.0))
        data["temp"] = val
        data["temp_c"] = val
        data["temperature"] = val
        data["temperature_c"] = val
        data["wind_speed"] = data.get("wind_speed_kmh", 10.0)
    return data

# =========================================================
# MANDI ENDPOINTS
# =========================================================
@app.get("/mandi")
@app.get("/api/mandi")
def get_mandi(location: str = None, crop: str = None):
    if crop and crop.lower() == "all crops":
        crop = None
    if location and location.lower() == "india":
        location = None
    return data_service.get_mandi_rates(location=location, crop_filter=crop)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)