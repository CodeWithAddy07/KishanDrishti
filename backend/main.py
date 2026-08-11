# KisanDrishti - Master Integration Backend
import os
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Import Team Modules
import data_service
import model_inference
import spray_calc

app = FastAPI(title="KisanDrishti API", version="1.0.0")

# Enable CORS for Frontend React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        # 🛡️ GUARD 1: File Extension Verification
        allowed_exts = [".jpg", ".jpeg", ".png", ".webp"]
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_exts:
            return {
                "success": False,
                "error": f"Invalid file type '{ext}'. Please upload an image file (.jpg, .png, .jpeg)."
            }

        # 🛡️ GUARD 2: Negative/Invalid Numbers Guard
        acres = max(0.1, acres)       # Auto-correct negative or zero acres to 0.1
        wind_speed = max(0.0, wind_speed) # Wind speed can't be negative

        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        prediction = model_inference.predict_disease(temp_path)

        if os.path.exists(temp_path):
            os.remove(temp_path)

        spray_details = spray_calc.calculate_spray_parameters(
            disease_name=prediction.get("disease", "Tomato Early Blight"),
            land_area_acres=acres,
            current_wind_speed_kmh=wind_speed,
        )

        return {
            "success": True,
            "prediction": prediction,
            "spray_calculation": spray_details,
        }

    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return {"success": False, "error": str(e)}


# =========================================================
# WEATHER ENDPOINTS (Dynamic location & dual-mapping)
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
# MANDI ENDPOINTS (Location-Linked & Crop Filters)
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