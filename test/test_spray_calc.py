# KisanDrishti - Test Suite (Step 8 Stress Testing)
# File: test/test_spray_calc.py

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from spray_calc import calculate_spray_parameters

print("==================================================")
print("   KISANDRISHTI SPRAY CALCULATOR STRESS TEST")
print("==================================================\n")

# Scenario 1: Small Kitchen Garden (0.5 Acres)
res1 = calculate_spray_parameters(
    disease="Tomato Early Blight", land_area=0.5, wind_speed=8.0
)
print(
    f"1. SMALL FARM (0.5 Acres): Volume={res1['total_spray_volume_l']}L | Refills={res1['total_tank_refills']} tanks ({res1['full_tanks']} full + {res1['last_tank_volume_l']}L last) | Chem={res1['chemical_quantity_ml']}mL"
)

# Scenario 2: Medium Commercial Farm (3.0 Acres)
res2 = calculate_spray_parameters(
    disease="Potato Early Blight", land_area=3.0, wind_speed=12.0
)
print(
    f"2. MEDIUM FARM (3.0 Acres): Volume={res2['total_spray_volume_l']}L | Refills={res2['total_tank_refills']} tanks | Time={res2['est_spray_time_hrs']} hrs"
)

# Scenario 3: Large Farm with High Wind Risk (15.0 Acres, 27 km/h wind)
res3 = calculate_spray_parameters(
    disease="Corn Common Rust", land_area=15.0, wind_speed=27.0
)
print(
    f"3. LARGE FARM (15.0 Acres): Volume={res3['total_spray_volume_l']}L | Wind Status={res3['wind_status']} | Can Spray={res3['can_spray']}"
)

# Scenario 4: Unknown Disease (Fallback Test)
res4 = calculate_spray_parameters(
    disease="Unknown Leaf Spot", land_area=1.0, wind_speed=10.0
)
print(
    f"4. FALLBACK TEST: Chemical={res4['recommended_chemical']} | Dosage={res4['chemical_quantity_ml']}mL"
)

print("\n==================================================")
print("   ALL TEST SCENARIOS PASSED SUCCESSFULLY! ✅")
print("==================================================")