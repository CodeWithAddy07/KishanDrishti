import React from 'react';

const CLASS_NAMES_20 = [
  "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
  "Cherry_(including_sour)___Powdery_mildew", "Corn_(maize)___Common_rust_", 
  "Corn_(maize)___Northern_Leaf_Blight", "Grape___Black_rot", 
  "Grape___Esca_(Black_Measles)", "Peach___Bacterial_spot", 
  "Pepper,_bell___Bacterial_spot", "Potato___Early_blight", 
  "Potato___Late_blight", "Potato___healthy", 
  "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", 
  "Tomato___Bacterial_spot", "Tomato___Early_blight", 
  "Tomato___Late_blight", "Tomato___healthy"
];

const ClassList = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Supported Crop & Disease Categories ({CLASS_NAMES_20.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {CLASS_NAMES_20.map((className, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 hover:bg-green-50 rounded border text-sm">
            <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 font-bold rounded-full text-xs">
              {index}
            </span>
            <span className="font-medium text-gray-700">{className.replaceAll('___', ' - ').replaceAll('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;