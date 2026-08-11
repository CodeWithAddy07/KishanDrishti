# KisanDrishti (किसानदृष्टि) 🌾
### AI-Powered Crop Disease Diagnostics & Advisory Suite (SIH 2026)

KisanDrishti is a responsive, feature-rich web application designed to support smallholder farmers with crop health advisory. Built for the **Smart India Hackathon (SIH) 2026**, the platform integrates deep learning diagnostics, local weather advisories, real-time regional mandi rate structures, and an automated spraying calculator.

---

## 🚀 Key Features

1. **AI Disease Diagnosis**
   - Drag-and-drop leaf photo uploader (JPG, JPEG, PNG).
   - Instant classification returning severity level, confidence score, and advisory guidelines.
   - Synchronizes diagnosed crop conditions with the spraying calculation dashboard.

2. **Weather & Mandi Advisory**
   - Real-time weather parameters (temp, wind speed, humidity, cloud conditions).
   - Direct alert indicators warning against spraying during incoming rain cycles.
   - Searchable, responsive Mandi Prices table that transforms into clean cards on mobile devices.

3. **Smart Spraying Calculator**
   - Automatically imports diagnosed disease and wind speeds from shared context.
   - Computes Knapsack tank refills, spray mix quantities, chemical formulations, and total application duration.
   - Safety status indicator (green/red) based on local wind speeds (warns against drift if $\ge 15\text{ km/h}$).

4. **Accessibility Systems**
   - Fully bilingual: Toggles seamlessly between **English** and **Hindi (हिन्दी)**.
   - Complete Light & Dark Theme modes (persists user choices in local storage).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Main application engine |
| **Styling** | Tailwind CSS | Utility-first responsive design framework |
| **Routing** | React Router DOM | Client-side routing management |
| **Icons** | Lucide React | Clean, scalable vector symbols |
| **Backend** | FastAPI (Python) | High-performance ASGI web services framework |
| **Server** | Uvicorn | High-performance ASGI server |
| **Data** | Pandas | Tabular data processing and matching |

---

## 📁 Project Structure

```text
KisanDrishti/
├── backend/
│   ├── main.py            # FastAPI main entrypoint with routes & mock services
│   ├── requirements.txt   # Python dependency file
│   └── venv/              # Python virtual environment
└── frontend/
    ├── index.html         # Document template with custom Google fonts
    ├── tailwind.config.js # Tailwind CSS configuration
    ├── postcss.config.js  # PostCSS configuration
    ├── src/
    │   ├── App.jsx        # Routing and context provider wrapping
    │   ├── main.jsx       # React mounting entrypoint
    │   ├── index.css      # Core styles & Tailwind directives
    │   ├── components/    # Reusable structural blocks
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── FeatureCard.jsx
    │   │   ├── MetricCard.jsx
    │   │   ├── TeamCard.jsx
    │   │   └── SectionTitle.jsx
    │   ├── pages/         # View layouts
    │   │   ├── Home.jsx
    │   │   ├── Diagnosis.jsx
    │   │   ├── MandiWeather.jsx
    │   │   ├── Spraying.jsx
    │   │   └── About.jsx
    │   ├── context/       # State management
    │   │   ├── ThemeContext.jsx
    │   │   ├── LanguageContext.jsx
    │   │   └── SharedStateContext.jsx
    │   └── services/      # Client services
    │       └── api.js     # API client layer with local offline fallbacks
```

---

## 🔧 Installation & Setup

### Prerequisite Checklist
- Node.js (v18 or higher)
- Python (v3.10 or higher)

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Activate Virtualenv:
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
Backend will begin hosting at `http://localhost:8000`. Test health status at `http://localhost:8000/health`.

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run locally at `http://localhost:5173`.

---

## 📝 Backend API Contracts

### 1. `/predict` (Crop Leaf Disease Diagnosis)
- **Method**: `POST`
- **Payload**: Form-Data (`image`: File)
- **Response**:
```json
{
  "filename": "tomato_leaf.jpg",
  "disease": "Tomato Early Blight",
  "confidence": 92.5,
  "severity": "Moderate",
  "advice": [
    "Remove and destroy infected lower leaves immediately.",
    "Apply copper-based fungicide or Chlorothalonil every 7-10 days."
  ]
}
```

### 2. `/weather` (Local Weather Forecast)
- **Method**: `GET`
- **Parameters**: `location` (string, e.g. `amritsar`)
- **Response**:
```json
{
  "location": "Amritsar",
  "temp": 27.5,
  "condition": "Cloudy",
  "wind_speed": 12.4,
  "rain_expected": true,
  "humidity": 78,
  "advice": "Rain expected soon. Do NOT spray chemicals to avoid runoff."
}
```

### 3. `/mandi` (Market Price Indices)
- **Method**: `GET`
- **Parameters**: `crop` (optional string), `location` (optional string)
- **Response**:
```json
[
  {
    "crop": "Wheat (Kanak)",
    "mandi": "Khanna Mandi",
    "price": 2275,
    "unit": "Quintal",
    "state": "Punjab"
  }
]
```

### 4. `/spray-calc` (Spray Formulation Engine)
- **Method**: `POST`
- **Payload**: JSON
```json
{
  "area": 2.5,
  "disease": "Tomato Early Blight",
  "wind_speed": 12.4
}
```
- **Response**:
```json
{
  "area": 2.5,
  "disease": "Tomato Early Blight",
  "wind_speed": 12.4,
  "total_spray_volume_l": 300.0,
  "tank_refills": 18.8,
  "chemical_name": "Copper Fungicide",
  "chemical_dose_per_tank": 40.0,
  "total_chemical_needed": 752.0,
  "spraying_time_hours": 3.0,
  "is_safe": true,
  "status_message": "Safe spraying conditions."
}
```

---

## 👥 Meet Team Zenovate (SIH 2026)
1. **Vishal Raj** - Team Lead & Full-Stack Architect
2. **Member 2** - AI Disease Detection Lead
3. **Member 3** - Weather & Mandi API Lead
4. **Member 4** - Spray Mechanics & Integration Lead
5. **Member 5** - Documentation & Presentation Lead
6. **Member 6** - UI/UX & Research Support
