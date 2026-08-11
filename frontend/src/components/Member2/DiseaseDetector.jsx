import React, { useState } from 'react';
import axios from 'axios';

const DiseaseDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Flask Backend Server URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/predict';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Inference failed. Check backend server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-green-800 border-b pb-2">
        KisanDrishti - 20 Class Plant Disease Detection
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Upload Box */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
          {preview ? (
            <img src={preview} alt="Leaf Preview" className="max-h-64 object-contain rounded-md mb-4" />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Upload a leaf image for disease diagnosis</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          />
        </div>

        {/* Action & Result */}
        <div className="w-full md:w-1/2 space-y-4">
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors ${
              !selectedFile || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Analyzing Plant Health...' : 'Detect Disease'}
          </button>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <h3 className="text-lg font-bold text-green-900">Diagnosis Summary</h3>
              <p className="text-md font-semibold text-gray-800">
                Disease: <span className="text-green-700">{result.disease}</span>
              </p>
              <p className="text-sm text-gray-600">
                Confidence Level: <span className="font-bold">{result.confidence}%</span>
              </p>
              <p className="text-sm text-gray-600">
                Class Index: <span className="font-bold">{result.class_index}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Predictions */}
      {result && result.top_5 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Probabilities</h3>
          <div className="space-y-2">
            {result.top_5.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-sm">
                <span className="w-1/3 font-medium text-gray-700 truncate">{item.class}</span>
                <div className="w-1/2 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-full transition-all duration-300"
                    style={{ width: `${item.probability}%` }}
                  ></div>
                </div>
                <span className="w-1/6 font-mono text-right">{item.probability}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetector;