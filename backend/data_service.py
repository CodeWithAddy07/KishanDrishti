"""
KisanDrishti - Member 3
Location-Linked Weather & Guaranteed Mandi Rates Service
"""

import requests
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Exact 10 Cities Geolocation Mapping
CITY_DATABASE = {
    "delhi": {"name": "Delhi", "lat": 28.6139, "lon": 77.2090, "state": "Delhi"},
    "ludhiana": {"name": "Ludhiana (Punjab)", "lat": 30.9010, "lon": 75.8573, "state": "Punjab"},
    "karnal": {"name": "Karnal (Haryana)", "lat": 29.0588, "lon": 76.0856, "state": "Haryana"},
    "agra": {"name": "Agra (Uttar Pradesh)", "lat": 27.1767, "lon": 78.0081, "state": "Uttar Pradesh"},
    "lucknow": {"name": "Lucknow (Uttar Pradesh)", "lat": 26.8467, "lon": 80.9462, "state": "Uttar Pradesh"},
    "nashik": {"name": "Nashik (Maharashtra)", "lat": 19.9975, "lon": 73.7898, "state": "Maharashtra"},
    "guntur": {"name": "Guntur (Andhra Pradesh)", "lat": 16.3067, "lon": 80.4365, "state": "Andhra Pradesh"},
    "jaipur": {"name": "Jaipur (Rajasthan)", "lat": 26.9124, "lon": 75.7873, "state": "Rajasthan"},
    "indore": {"name": "Indore (Madhya Pradesh)", "lat": 22.7196, "lon": 75.8577, "state": "Madhya Pradesh"},
    "shimla": {"name": "Shimla (Himachal Pradesh)", "lat": 31.1048, "lon": 77.1734, "state": "Himachal Pradesh"}
}

WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"

# Master Mandi Database List
ALL_MANDI_RECORDS = [
    # Delhi
    {"crop": "Tomato", "mandi": "Azadpur Mandi", "state": "Delhi", "price": 2650, "city": "delhi"},
    {"crop": "Potato", "mandi": "Azadpur Mandi", "state": "Delhi", "price": 1850, "city": "delhi"},
    {"crop": "Corn", "mandi": "Najafgarh Mandi", "state": "Delhi", "price": 2200, "city": "delhi"},
    {"crop": "Rice", "mandi": "Narela Mandi", "state": "Delhi", "price": 3300, "city": "delhi"},
    {"crop": "Apple", "mandi": "Azadpur Mandi", "state": "Delhi", "price": 6800, "city": "delhi"},

    # Ludhiana / Punjab
    {"crop": "Wheat", "mandi": "Khanna Grain Market", "state": "Punjab", "price": 2275, "city": "ludhiana"},
    {"crop": "Rice", "mandi": "Ludhiana Mandi", "state": "Punjab", "price": 3450, "city": "ludhiana"},
    {"crop": "Tomato", "mandi": "Kambali Mandi", "state": "Punjab", "price": 2400, "city": "ludhiana"},

    # Karnal / Haryana
    {"crop": "Basmati Rice", "mandi": "Karnal Grain Market", "state": "Haryana", "price": 4200, "city": "karnal"},
    {"crop": "Wheat", "mandi": "Ambala Mandi", "state": "Haryana", "price": 2250, "city": "karnal"},
    {"crop": "Mustard", "mandi": "Gharaunda Mandi", "state": "Haryana", "price": 5100, "city": "karnal"},

    # Agra / UP
    {"crop": "Potato", "mandi": "Agra Fruit & Veg Mandi", "state": "Uttar Pradesh", "price": 1720, "city": "agra"},
    {"crop": "Mustard", "mandi": "Mathura Mandi", "state": "Uttar Pradesh", "price": 5300, "city": "agra"},
    {"crop": "Wheat", "mandi": "Firozabad Mandi", "state": "Uttar Pradesh", "price": 2210, "city": "agra"},

    # Lucknow / UP
    {"crop": "Mango", "mandi": "Lucknow Mandi", "state": "Uttar Pradesh", "price": 4500, "city": "lucknow"},
    {"crop": "Potato", "mandi": "Lucknow Mandi", "state": "Uttar Pradesh", "price": 1800, "city": "lucknow"},
    {"crop": "Wheat", "mandi": "Lucknow Mandi", "state": "Uttar Pradesh", "price": 2240, "city": "lucknow"},

    # Nashik / Maharashtra
    {"crop": "Onion", "mandi": "Lasalgaon Onion Mandi", "state": "Maharashtra", "price": 2100, "city": "nashik"},
    {"crop": "Tomato", "mandi": "Pimplegaon Mandi", "state": "Maharashtra", "price": 2550, "city": "nashik"},
    {"crop": "Grapes", "mandi": "Nashik Main Market", "state": "Maharashtra", "price": 6500, "city": "nashik"},

    # Guntur / AP
    {"crop": "Chilli", "mandi": "Guntur Chilli Yard", "state": "Andhra Pradesh", "price": 18500, "city": "guntur"},
    {"crop": "Cotton", "mandi": "Tenali Agricultural Market", "state": "Andhra Pradesh", "price": 7100, "city": "guntur"},

    # Jaipur / Rajasthan
    {"crop": "Mustard", "mandi": "Jaipur Muhana Mandi", "state": "Rajasthan", "price": 5450, "city": "jaipur"},
    {"crop": "Wheat", "mandi": "Alwar Grain Yard", "state": "Rajasthan", "price": 2280, "city": "jaipur"},
    {"crop": "Barley", "mandi": "Chomu Mandi", "state": "Rajasthan", "price": 1950, "city": "jaipur"},

    # Indore / MP
    {"crop": "Soybean", "mandi": "Indore Devi Ahilya Mandi", "state": "Madhya Pradesh", "price": 4600, "city": "indore"},
    {"crop": "Wheat", "mandi": "Ujjain Grain Market", "state": "Madhya Pradesh", "price": 2320, "city": "indore"},

    # Shimla / HP
    {"crop": "Apple", "mandi": "Shimla Dhalli Apple Yard", "state": "Himachal Pradesh", "price": 7200, "city": "shimla"},
    {"crop": "Tomato", "mandi": "Solan Veg Market", "state": "Himachal Pradesh", "price": 2800, "city": "shimla"}
]


def get_weather_data(location=None):
    if not location or str(location).strip().lower() in ["none", "null", ""]:
        return {}

    raw_loc = str(location).strip().lower()
    clean_loc = raw_loc.split("(")[0].strip()

    city_info = CITY_DATABASE.get(clean_loc)
    if not city_info:
        for k, v in CITY_DATABASE.items():
            if k in clean_loc or clean_loc in k:
                city_info = v
                break

    if not city_info:
        city_info = CITY_DATABASE["delhi"]

    display_name = city_info["name"]

    try:
        params = {
            "latitude": city_info["lat"],
            "longitude": city_info["lon"],
            "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
            "hourly": "precipitation_probability",
            "wind_speed_unit": "kmh",
            "temperature_unit": "celsius",
            "timezone": "auto"
        }

        response = requests.get(WEATHER_API_URL, params=params, timeout=8)
        response.raise_for_status()
        data = response.json()

        current = data.get("current", {})
        temp = current.get("temperature_2m", 31.0)
        humidity = current.get("relative_humidity_2m", 58)
        wind = current.get("wind_speed_10m", 10.5)
        w_code = current.get("weather_code", 0)

        cond = "Sunny"
        if w_code in [1, 2, 3]: cond = "Cloudy"
        elif w_code in [61, 63, 65, 80, 81]: cond = "Rainy"
        elif w_code in [95, 96, 99]: cond = "Thunderstorm"

        return {
            "location": display_name,
            "temp": temp,
            "temp_c": temp,
            "temperature": temp,
            "temperature_c": temp,
            "humidity": humidity,
            "wind_speed": wind,
            "wind_speed_kmh": wind,
            "condition": cond,
            "status": "live"
        }

    except Exception as e:
        print(f"Weather Fetch Error: {e}")
        return {
            "location": display_name,
            "temp": 30.0,
            "temp_c": 30.0,
            "temperature": 30.0,
            "temperature_c": 30.0,
            "humidity": 55,
            "wind_speed": 8.0,
            "wind_speed_kmh": 8.0,
            "condition": "Sunny",
            "status": "fallback"
        }


def get_mandi_rates(location=None, crop_filter=None):
    if not location or str(location).strip().lower() in ["none", "null", "", "all"]:
        return []

    raw_loc = str(location).strip().lower()
    clean_loc = raw_loc.split("(")[0].strip()

    # Exact City Records Filter
    matched_data = [
        item for item in ALL_MANDI_RECORDS
        if item["city"] == clean_loc 
        or clean_loc in item["state"].lower()
        or clean_loc in item["mandi"].lower()
    ]

    # Crop Filter
    if crop_filter and str(crop_filter).strip().lower() not in ["all crops", "all", "none", "", "null"]:
        c_filter = str(crop_filter).strip().lower()
        crop_filtered = [item for item in matched_data if item["crop"].lower() == c_filter]
        if crop_filtered:
            matched_data = crop_filtered

    formatted = []
    for row in matched_data:
        val = int(row["price"])
        formatted.append({
            "crop": row["crop"],
            "mandi": row["mandi"],
            "state": row["state"],
            "price": val,
            "price_per_quintal": val,
            "modal_price": val
        })

    return formatted