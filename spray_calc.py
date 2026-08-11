# KisanDrishti - Smart India Hackathon 2026
# Member 4: Spray Mechanics & Chemical Math Lead (Aditya)
# File: spray_calc.py

import math

# CONSTANTS (Verified Agricultural & Engineering Standards)
ACRE_TO_HA = 0.404686  # 1 Acre = 0.404686 Hectares
DEFAULT_APP_RATE_L_PER_HA = (
    400.0  # Standard Medium-Volume Knapsack rate in India (L/ha)
)
DEFAULT_TANK_CAPACITY_L = 15.0  # Standard Indian Knapsack Sprayer Tank (Liters)
DEFAULT_NOZZLE_FLOW_LPM = 0.9  # Standard Hollow-Cone Nozzle Discharge (L/min at 2.5 bar pressure)
RECOMMENDED_PRESSURE_BAR = "2.0 - 2.5 bar"

# VERIFIED DISEASE DOSAGE DATABASE (ICAR Standards)
DISEASE_DOSAGE_DATABASE = {
    "Tomato Early Blight": {
        "chemical_name": "Mancozeb 75% WP / Copper Oxychloride",
        "dosage_ml_per_l": 2.0,
    },
    "Tomato Late Blight": {
        "chemical_name": "Cymoxanil + Mancozeb",
        "dosage_ml_per_l": 2.5,
    },
    "Potato Early Blight": {
        "chemical_name": "Chlorothalonil 75% WP",
        "dosage_ml_per_l": 2.0,
    },
    "Corn Common Rust": {
        "chemical_name": "Azoxystrobin + Difenoconazole",
        "dosage_ml_per_l": 1.0,
    },
    "Apple Scab": {
        "chemical_name": "Captan 50% WP",
        "dosage_ml_per_l": 2.0,
    },
    "Default Disease": {
        "chemical_name": "Broad Spectrum Fungicide",
        "dosage_ml_per_l": 2.0,
    },
}


def convert_acres_to_hectares(area_acres):
    """Converts land area from Acres to Hectares with input validation."""
    if area_acres <= 0:
        raise ValueError("Land area must be greater than zero.")
    return area_acres * ACRE_TO_HA


def evaluate_wind_safety(wind_speed_kmh):
    """Evaluates wind speed safety thresholds according to agricultural standards."""
    if wind_speed_kmh < 0:
        wind_speed_kmh = 0.0

    if wind_speed_kmh < 3.0:
        return {
            "wind_status": "CAUTION",
            "safety_warning": "Low wind speed / Possible inversion layer. Spray with care using larger droplet size.",
            "can_spray": True,
        }
    elif 3.0 <= wind_speed_kmh <= 15.0:
        return {
            "wind_status": "OPTIMAL",
            "safety_warning": "Ideal wind conditions. Good canopy coverage with minimal drift risk.",
            "can_spray": True,
        }
    elif 15.0 < wind_speed_kmh <= 25.0:
        return {
            "wind_status": "CAUTION",
            "safety_warning": "Moderate wind detected. Lower nozzle height and use drift-reduction nozzles.",
            "can_spray": True,
        }
    else:  # > 25.0 km/h
        return {
            "wind_status": "UNSAFE",
            "safety_warning": "HIGH WIND DRIFT RISK! Postpone spraying immediately to avoid chemical drift and crop damage.",
            "can_spray": False,
        }


def calculate_spray_parameters(
    disease,
    land_area,
    wind_speed,
    app_rate_l_per_ha=DEFAULT_APP_RATE_L_PER_HA,
    tank_capacity_l=DEFAULT_TANK_CAPACITY_L,
    nozzle_flow_lpm=DEFAULT_NOZZLE_FLOW_LPM,
):
    """Master Spray Calculation Engine for KisanDrishti.

    Accepts disease name, land area (Acres), and wind speed (km/h) to
    return a complete engineering spray advisory.
    """
    # Step 1: Unit Conversion
    land_area_ha = convert_acres_to_hectares(land_area)

    # Step 2: Total Spray Volume (Liters)
    total_spray_volume_l = land_area_ha * app_rate_l_per_ha

    # Step 3: Disease Lookup & Chemical Dosage
    disease_info = DISEASE_DOSAGE_DATABASE.get(
        disease, DISEASE_DOSAGE_DATABASE["Default Disease"]
    )
    chemical_name = disease_info["chemical_name"]
    dosage_rate_ml_l = disease_info["dosage_ml_per_l"]

    chemical_quantity_ml = total_spray_volume_l * dosage_rate_ml_l
    chemical_quantity_l = chemical_quantity_ml / 1000.0
    water_quantity_l = total_spray_volume_l - chemical_quantity_l

    # Step 4: Tank Capacity & Refills
    total_tank_fills = math.ceil(total_spray_volume_l / tank_capacity_l)
    full_tanks = int(total_spray_volume_l // tank_capacity_l)
    remaining_volume_l = total_spray_volume_l % tank_capacity_l
    chem_per_full_tank_ml = tank_capacity_l * dosage_rate_ml_l

    # Step 5: Nozzle Kinematics & Time
    total_spray_time_min = total_spray_volume_l / nozzle_flow_lpm
    total_spray_time_hrs = total_spray_time_min / 60.0

    # Step 6: Wind Safety Assessment
    wind_assessment = evaluate_wind_safety(wind_speed)

    # Step 7: Structured Output Dictionary
    result = {
        "disease": disease,
        "recommended_chemical": chemical_name,
        "land_area_acres": round(land_area, 2),
        "land_area_ha": round(land_area_ha, 4),
        "app_rate_l_per_ha": app_rate_l_per_ha,
        "total_spray_volume_l": round(total_spray_volume_l, 2),
        "chemical_quantity_ml": round(chemical_quantity_ml, 2),
        "chemical_quantity_l": round(chemical_quantity_l, 2),
        "water_quantity_l": round(water_quantity_l, 2),
        "tank_capacity_l": tank_capacity_l,
        "total_tank_refills": total_tank_fills,
        "full_tanks": full_tanks,
        "last_tank_volume_l": round(
            remaining_volume_l if remaining_volume_l > 0 else tank_capacity_l,
            2,
        ),
        "chem_per_full_tank_ml": round(chem_per_full_tank_ml, 2),
        "nozzle_discharge_lpm": nozzle_flow_lpm,
        "recommended_pressure_bar": RECOMMENDED_PRESSURE_BAR,
        "est_spray_time_min": round(total_spray_time_min, 1),
        "est_spray_time_hrs": round(total_spray_time_hrs, 2),
        "wind_speed_kmh": wind_speed,
        "wind_status": wind_assessment["wind_status"],
        "safety_warning": wind_assessment["safety_warning"],
        "can_spray": wind_assessment["can_spray"],
        "status": "Engine Fully Operational",
    }

    return result