const API_BASE_URL = 'http://localhost:8000';

// 1. Weather Advisory API (MandiWeather.jsx)
export const getWeather = async (location) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?location=${encodeURIComponent(location || '')}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// 2. Mandi Rates API (MandiWeather.jsx)
export const getMandiRates = async (location, crop) => {
  try {
    const queryParams = new URLSearchParams({
      location: location || '',
      crop: crop || ''
    }).toString();

    const response = await fetch(`${API_BASE_URL}/mandi?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mandi rates:', error);
    return [];
  }
};

// 3. Leaf Disease Diagnosis API (Diagnosis.jsx)
export const predictDisease = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

// 4. Spray Calculation API (Spraying.jsx)
export const calculateSpray = async (acres, windSpeed, diseaseName) => {
  try {
    const queryParams = new URLSearchParams({
      acres: acres || 2.5,
      wind_speed: windSpeed || 10,
      disease_name: diseaseName || ''
    }).toString();

    const response = await fetch(`${API_BASE_URL}/api/spray_calc?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calculating spray:', error);
    return null;
  }
};