# KisanDrishti - Member 4 Engineering Notes & Formulas

## Overview
This document contains the core mathematical equations, agricultural standards, and fluid mechanics logic implemented in `spray_calc.py`.

---

## 1. Unit Conversion
- **Conversion Factor:** 1 Acre = 0.404686 Hectares
- **Formula:** 
  $$\text{Land Area (ha)} = \text{Land Area (Acres)} \times 0.404686$$

---

## 2. Spray Volume & ICAR Chemical Dosage
- **Standard Application Rate:** 400 L/ha (Medium-volume knapsack spraying)
- **Total Spray Volume (L):** 
  $$\text{Volume (L)} = \text{Land Area (ha)} \times 400 \text{ L/ha}$$
- **Chemical Dosage Standard:** ICAR Guidelines (2.0 mL/L default for Mancozeb / Fungicides)
- **Chemical Quantity (mL):** 
  $$\text{Chemical (mL)} = \text{Total Volume (L)} \times \text{Dosage Rate (mL/L)}$$
- **Carrier Water Quantity (L):** 
  $$\text{Water (L)} = \text{Total Volume (L)} - \left(\frac{\text{Chemical (mL)}}{1000}\right)$$

---

## 3. Tank Refill Kinematics
- **Standard Knapsack Tank Capacity:** 15.0 Liters
- **Chemical per Full Tank:** 30.0 mL / tank
- **Full Tanks:** $\lfloor \text{Total Volume} / 15 \rfloor$
- **Partial Tank Volume:** $\text{Total Volume} \pmod{15}$

---

## 4. Nozzle Kinematics & Pressure
- **Standard Nozzle:** Hollow Cone / Flat Fan
- **Discharge Rate ($Q$):** 0.9 L/min
- **Recommended Operating Pressure:** 2.0 – 2.5 bar
- **Total Spray Time (Hours):** 
  $$\text{Spray Time (hrs)} = \frac{\text{Total Volume (L)}}{0.9 \text{ L/min} \times 60}$$

---

## 5. Environmental Wind Drift Logic
- **< 3 km/h:** Low wind / inversion risk (Caution)
- **3 – 15 km/h:** Optimal spraying window
- **15 – 25 km/h:** High drift risk (Lower nozzle height)
- **> 25 km/h:** UNSAFE (Postpone spraying immediately)