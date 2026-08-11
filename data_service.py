"""
KisanDrishti - Member 3
Live Weather & Mandi Advisory Data Service

Handles:
1. Live weather data from Open-Meteo
2. Weather condition and rain probability
3. Mandi market data
4. Local CSV cache
5. Mandi price history
6. Safe fallback when APIs are unavailable
"""

import requests
import csv
from datetime import datetime
from pathlib import Path


# =========================================================
# FILE SETTINGS
# =========================================================

BASE_DIR = Path(__file__).parent

MANDI_FILE = BASE_DIR / "mandi_data.csv"

HISTORY_FILE = BASE_DIR / "mandi_history.csv"


# =========================================================
# WEATHER SETTINGS
# =========================================================

DELHI_LATITUDE = 28.6139
DELHI_LONGITUDE = 77.2090

WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"


# =========================================================
# WEATHER CONDITION
# =========================================================

def get_weather_condition(weather_code):
    """Convert Open-Meteo weather code into readable text."""

    if weather_code == 0:
        return "Sunny"

    elif weather_code in [1, 2, 3]:
        return "Cloudy"

    elif weather_code in [45, 48]:
        return "Foggy"

    elif weather_code in [51, 53, 55, 56, 57]:
        return "Drizzle"

    elif weather_code in [61, 63, 65, 66, 67]:
        return "Rainy"

    elif weather_code in [71, 73, 75, 77, 85, 86]:
        return "Snowy"

    elif weather_code in [80, 81, 82]:
        return "Rain Showers"

    elif weather_code in [95, 96, 99]:
        return "Thunderstorm"

    return "Unknown"


# =========================================================
# WEATHER FUNCTION
# =========================================================

def get_weather_data(location="Delhi"):
    """
    Fetch live weather information from Open-Meteo.

    Returns:
        Dictionary containing weather information.
    """

    try:

        params = {
            "latitude": DELHI_LATITUDE,
            "longitude": DELHI_LONGITUDE,
            "current": (
                "temperature_2m,"
                "wind_speed_10m,"
                "weather_code"
            ),
            "hourly": "precipitation_probability",
            "wind_speed_unit": "kmh",
            "temperature_unit": "celsius",
            "timezone": "auto"
        }

        response = requests.get(
            WEATHER_API_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        current = data.get("current", {})

        temperature = current.get("temperature_2m")

        wind_speed = current.get("wind_speed_10m")

        weather_code = current.get("weather_code")

        condition = get_weather_condition(weather_code)

        hourly = data.get("hourly", {})

        rain_probabilities = hourly.get(
            "precipitation_probability",
            []
        )

        if rain_probabilities:

            # Check the next 24 hours
            rain_probability = max(
                rain_probabilities[:24]
            )

        else:

            rain_probability = 0

        rain_expected = rain_probability >= 40

        return {
            "location": location,
            "temp_c": temperature,
            "wind_speed_kmh": wind_speed,
            "condition": condition,
            "rain_probability": rain_probability,
            "rain_expected": rain_expected,
            "status": "live"
        }

    except Exception as error:

        print(
            f"Weather API unavailable: {error}"
        )

        return {
            "location": location,
            "temp_c": 30.5,
            "wind_speed_kmh": 10.0,
            "condition": "Data unavailable",
            "rain_probability": 0,
            "rain_expected": False,
            "status": "fallback"
        }


# =========================================================
# DEMO MANDI DATA
# =========================================================

MANDI_DATA = [

    {
        "crop": "Tomato",
        "mandi": "Azadpur Mandi",
        "price_per_quintal": 2500,
        "trend": "Stable"
    },

    {
        "crop": "Potato",
        "mandi": "Azadpur Mandi",
        "price_per_quintal": 1800,
        "trend": "Up"
    },

    {
        "crop": "Corn",
        "mandi": "Najafgarh Mandi",
        "price_per_quintal": 2200,
        "trend": "Stable"
    },

    {
        "crop": "Apple",
        "mandi": "Azadpur Mandi",
        "price_per_quintal": 6500,
        "trend": "Down"
    },

    {
        "crop": "Rice",
        "mandi": "Narela Mandi",
        "price_per_quintal": 3200,
        "trend": "Up"
    }
]


# =========================================================
# LOAD MANDI DATA FROM CSV
# =========================================================

def load_mandi_data():
    """
    Load latest mandi prices from mandi_data.csv.

    If the CSV is missing or invalid,
    use the built-in demo data.
    """

    try:

        if not MANDI_FILE.exists():

            return MANDI_DATA.copy()

        data = []

        with open(
            MANDI_FILE,
            "r",
            newline="",
            encoding="utf-8"
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:

                data.append({
                    "crop": row["crop"],
                    "mandi": row["mandi"],
                    "price_per_quintal": int(
                        float(row["price_per_quintal"])
                    ),
                    "trend": row.get(
                        "trend",
                        "Stable"
                    )
                })

        if data:

            return data

        return MANDI_DATA.copy()

    except Exception as error:

        print(
            f"Mandi CSV unavailable: {error}"
        )

        return MANDI_DATA.copy()


# =========================================================
# SAVE MANDI DATA
# =========================================================

def save_mandi_data(data):
    """
    Save the latest mandi prices to mandi_data.csv.
    """

    try:

        with open(
            MANDI_FILE,
            "w",
            newline="",
            encoding="utf-8"
        ) as file:

            fieldnames = [
                "crop",
                "mandi",
                "price_per_quintal",
                "trend"
            ]

            writer = csv.DictWriter(
                file,
                fieldnames=fieldnames
            )

            writer.writeheader()

            writer.writerows(data)

        return True

    except Exception as error:

        print(
            f"Could not save mandi data: {error}"
        )

        return False


# =========================================================
# SAVE PRICE HISTORY
# =========================================================

def save_mandi_history(data):
    """
    Save today's mandi prices to mandi_history.csv.

    This allows the project to maintain
    a daily price history.
    """

    try:

        file_exists = HISTORY_FILE.exists()

        with open(
            HISTORY_FILE,
            "a",
            newline="",
            encoding="utf-8"
        ) as file:

            fieldnames = [
                "date",
                "crop",
                "mandi",
                "price_per_quintal"
            ]

            writer = csv.DictWriter(
                file,
                fieldnames=fieldnames
            )

            if not file_exists:

                writer.writeheader()

            today = datetime.now().strftime(
                "%Y-%m-%d"
            )

            for item in data:

                writer.writerow({
                    "date": today,
                    "crop": item["crop"],
                    "mandi": item["mandi"],
                    "price_per_quintal":
                        item["price_per_quintal"]
                })

        return True

    except Exception as error:

        print(
            f"Could not save mandi history: {error}"
        )

        return False


# =========================================================
# GET MANDI RATES
# =========================================================

def get_mandi_rates(crop_filter=None):
    """
    Return mandi market rates.

    Parameters:
        crop_filter:
            Optional crop name.

    Returns:
        List of mandi dictionaries.
    """

    data = load_mandi_data()

    if crop_filter is None:

        return data

    crop_filter = crop_filter.strip().lower()

    filtered_data = [

        item

        for item in data

        if item["crop"].lower() == crop_filter

    ]

    return filtered_data


# =========================================================
# UPDATE MANDI DATA
# =========================================================

def update_mandi_data(new_data):
    """
    Update local mandi data and save today's history.

    This function will later be connected to
    the government mandi API.
    """

    if not new_data:

        return False

    saved = save_mandi_data(new_data)

    if saved:

        save_mandi_history(new_data)

    return saved