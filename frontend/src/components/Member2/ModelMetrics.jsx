import React from 'react';

const ModelMetrics = () => {
  const metricsData = [
    { label: 'Overall Accuracy', value: '96.85%', color: 'border-blue-500' },
    { label: 'Validation Loss', value: '0.112', color: 'border-red-500' },
    { label: 'Precision', value: '96.70%', color: 'border-green-500' },
    { label: 'Recall', value: '96.65%', color: 'border-yellow-500' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Member 2 - Model Performance Evaluation (20-Class)
      </h2>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricsData.map((item, index) => (
          <div key={index} className={`p-4 bg-gray-50 border-l-4 ${item.color} rounded-r-md shadow-sm`}>
            <p className="text-xs uppercase text-gray-500 font-semibold">{item.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Evaluation Plots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2 text-center">Confusion Matrix (20-Class)</h3>
          <div className="flex justify-center items-center h-48 bg-gray-200 rounded text-gray-500 text-sm">
            [ Confusion Matrix Asset ]
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2 text-center">Training vs Validation Accuracy</h3>
          <div className="flex justify-center items-center h-48 bg-gray-200 rounded text-gray-500 text-sm">
            [ Accuracy Curve Asset ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;