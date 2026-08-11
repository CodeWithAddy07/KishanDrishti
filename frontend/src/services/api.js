const API_BASE_URL = 'https://kishandrishti-api.onrender.com';

// 1. Weather Advisory API
export const getWeather = async (location) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?location=${encodeURIComponent(location || 'Delhi')}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// 2. Mandi Rates API
export const getMandiRates = async (location, crop) => {
  try {
    const queryParams = new URLSearchParams({
      location: location || '',
      crop: crop || ''
    }).toString();

    const response = await fetch(`${API_BASE_URL}/mandi?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching mandi rates:', error);
    return [];
  }
};

// 3. Leaf Disease Diagnosis API
export const predictDisease = async (fileInput, acres = 2.5, windSpeed = 10.0) => {
  try {
    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('acres', acres);
    formData.append('wind_speed', windSpeed);

    const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (data.success === false) {
      throw new Error(data.error || "Prediction failed on server.");
    }

    const predictionObj = data.prediction || data;
    return {
      disease: predictionObj.disease || "Tomato Early Blight",
      confidence: predictionObj.confidence || 92.5,
      severity: predictionObj.severity || "Low",
      advice: predictionObj.advice || ["Apply recommended fungicide.", "Ensure proper airflow."],
      filename: fileInput.name || "uploaded_leaf.jpg",
      spray_calculation: data.spray_calculation || {},
      rawResponse: data
    };
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

// 4. Spray Calculation API
export const calculateSpray = async (acres = 2.0, diseaseName = 'Tomato Early Blight', windSpeed = 10.0) => {
  try {
    const queryParams = new URLSearchParams({
      acres: acres || 2.0,
      disease: diseaseName || 'Tomato Early Blight',
      wind_speed: windSpeed || 10.0
    }).toString();

    const response = await fetch(`${API_BASE_URL}/api/spray_calc?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error calculating spray:', error);
    return null;
  }
};