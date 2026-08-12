import React, { useState } from "react";
import { Search, Thermometer, Wind, CloudRain, BookOpen, MapPin, DollarSign } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSharedState } from "../context/SharedStateContext";
import { getWeather, getMandiRates } from "../services/api";
import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";

const MandiWeather = () => {
  const { t } = useLanguage();

  const {
    selectedLocation,
    setSelectedLocation,
    selectedCrop,
    setSelectedCrop,
    setWindSpeed
  } = useSharedState();

  const [locInput, setLocInput] = useState(selectedLocation || "delhi");
  const [cropInput, setCropInput] = useState(selectedCrop || "");

  const [weather, setWeather] = useState(null);
  const [mandiRates, setMandiRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const citiesList = [
    { key: "delhi", label: "Delhi" },
    { key: "ludhiana", label: "Ludhiana (Punjab)" },
    { key: "karnal", label: "Karnal (Haryana)" },
    { key: "agra", label: "Agra (Uttar Pradesh)" },
    { key: "lucknow", label: "Lucknow (Uttar Pradesh)" },
    { key: "nashik", label: "Nashik (Maharashtra)" },
    { key: "guntur", label: "Guntur (Andhra Pradesh)" },
    { key: "jaipur", label: "Jaipur (Rajasthan)" },
    { key: "indore", label: "Indore (Madhya Pradesh)" },
    { key: "shimla", label: "Shimla (Himachal Pradesh)" }
  ];

  const cropsList = [
    "All Crops", "Wheat", "Rice", "Basmati Rice", "Potato", 
    "Tomato", "Onion", "Mustard", "Chilli", "Apple", "Soybean", "Corn", "Mango", "Grapes", "Cotton", "Barley"
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!locInput) {
      alert("Kripya city select karein!");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Selected city lookup label
    const selectedCityObj = citiesList.find((c) => c.key === locInput);
    const cityLabel = selectedCityObj ? selectedCityObj.label.split(" ")[0] : locInput;

    setSelectedLocation(cityLabel);
    setSelectedCrop(cropInput);

    try {
      const wData = await getWeather(cityLabel);
      setWeather(wData);
      
      if (wData && (wData.wind_speed || wData.wind_speed_kmh)) {
        setWindSpeed(wData.wind_speed || wData.wind_speed_kmh);
      }

      const mData = await getMandiRates(cityLabel, cropInput);
      setMandiRates(mData || []);
    } catch (err) {
      console.error("Error fetching advisory data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6 text-white">
      {/* 🔍 SEARCH CONTROLS */}
      <form onSubmit={handleSearch} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-wrap gap-4 items-end">
        
        {/* Dropdown 1: City Selector */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> City / Location
          </label>
          <select 
            value={locInput} 
            onChange={(e) => setLocInput(e.target.value)}
            className={`w-full p-3.5 rounded-xl bg-slate-800 font-medium border border-slate-700 focus:outline-none focus:border-emerald-500 transition-all ${
              locInput === "" ? "text-gray-500" : "text-white"
            }`}
          >
            <option value="" className="text-gray-500 bg-slate-800">Select your city</option>
            {citiesList.map((c) => (
              <option key={c.key} value={c.key} className="text-white bg-slate-800">{c.label}</option>
            ))}
          </select>
        </div>

        {/* Dropdown 2: Filter by Crop */}
        <div className="w-64 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">
            Filter by Crop
          </label>
          <select 
            value={cropInput} 
            onChange={(e) => setCropInput(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-800 text-white font-medium border border-slate-700 focus:outline-none focus:border-emerald-500 transition-all"
          >
            {cropsList.map((c, i) => (
              <option key={i} value={c === "All Crops" ? "" : c}>{c}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* 🌤️ WEATHER ADVISORY CARD */}
      {hasSearched && weather && (
        <div className="space-y-4">
          <SectionTitle 
            icon={CloudRain} 
            title={`Local Weather Report (${weather.location || locInput})`} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              icon={Thermometer} 
              label="TEMPERATURE" 
              value={`${weather.temperature || weather.temp_c || "--"} °C`} 
            />
            <MetricCard 
              icon={CloudRain} 
              label="CONDITION" 
              value={weather.condition || "Sunny"} 
            />
            <MetricCard 
              icon={Wind} 
              label="WIND SPEED" 
              value={`${weather.wind_speed || weather.wind_speed_kmh || "--"} km/h`} 
            />
            <MetricCard 
              icon={CloudRain} 
              label="HUMIDITY" 
              value={`${weather.humidity || "--"} %`} 
            />
          </div>
        </div>
      )}

      {/* 📊 MANDI PRICES TABLE */}
      <div className="space-y-4">
        <SectionTitle icon={BookOpen} title="Mandi Prices Table" />

        {!hasSearched ? (
          <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-gray-400 space-y-2">
            <DollarSign className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-base font-medium">Select a city and crop above to view live weather & market rates.</p>
          </div>
        ) : mandiRates.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-gray-400">
            <p className="text-sm">No price records found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left bg-slate-900 border-collapse">
              <thead className="bg-slate-800/80 text-gray-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Crop</th>
                  <th className="p-4">Mandi Market</th>
                  <th className="p-4">State</th>
                  <th className="p-4 text-right">Modal Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {mandiRates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{item.crop}</td>
                    <td className="p-4 text-gray-300">{item.market || item.mandi}</td>
                    <td className="p-4 text-gray-400">{item.state}</td>
                    <td className="p-4 font-extrabold text-right text-emerald-400 text-base">
                      ₹ {item.modal_price || item.price_per_quintal || item.price} / Quintal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MandiWeather;