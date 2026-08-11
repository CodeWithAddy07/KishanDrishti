import React, { createContext, useContext, useState } from "react";

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState("Amritsar");
  const [selectedCrop, setSelectedCrop] = useState("Wheat (Kanak)");
  const [predictedDisease, setPredictedDisease] = useState("Tomato Early Blight");
  const [windSpeed, setWindSpeed] = useState(12.4);

  return (
    <SharedStateContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        selectedCrop,
        setSelectedCrop,
        predictedDisease,
        setPredictedDisease,
        windSpeed,
        setWindSpeed,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};
