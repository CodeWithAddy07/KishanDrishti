import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navDiagnosis: "Disease Diagnosis",
    navSpraying: "Spraying Calculator",
    navMandiWeather: "Mandi & Weather",
    navAbout: "About Us",
    logoSubtitle: "AI-Powered Crop Advisory",
    
    // Theme & Language
    toggleLanguage: "हिन्दी",
    
    // Home Page
    heroTitle: "Empowering Farmers with AI-Driven Insights",
    heroSubtitle: "Instant crop disease diagnosis, local weather warnings, real-time Mandi market rates, and smart spraying calculations to optimize your yield.",
    getStarted: "Get Started",
    coreFeatures: "Core Ecosystem Features",
    
    featDiagTitle: "Crop Disease Diagnosis",
    featDiagDesc: "Upload leaf photos to identify infections instantly. Access tailored treatment advice from our neural networks.",
    featSprayTitle: "Spraying Calculator",
    featSprayDesc: "Calculate chemical doses, knapsack water volumes, and safety parameters adjusted for current local wind conditions.",
    featMandiTitle: "Mandi & Weather",
    featMandiDesc: "Explore crop prices across regional agricultural markets and receive weather alerts to schedule farm operations.",
    
    tryNow: "Try Now",
    whyUsTitle: "Why Choose KisanDrishti?",
    whyUsDesc1: "Instant diagnostics based on advanced deep learning image models.",
    whyUsDesc2: "Real-time mandi price updates keeping you ahead of price fluctuations.",
    whyUsDesc3: "Localized weather advisory warning you against bad spraying windows.",
    
    statsTitle: "Project Impact Summary",
    statFarmers: "10,000+ Farmers Envisioned",
    statAccuracy: "94% Diagnostics Accuracy",
    statSavings: "20% Chemical Spray Savings",
    statMandis: "50+ Mandis Tracked",

    // Diagnosis Page
    diagTitle: "AI Crop Disease Diagnostics",
    diagSubtitle: "Upload a clear photo of an infected leaf to diagnose crop issues.",
    dragDropText: "Drag & drop an image here, or click to select",
    uploadBtn: "Upload Leaf Image",
    resultsTitle: "Diagnostic Report",
    metricDisease: "Disease Detected",
    metricConfidence: "Confidence Score",
    metricSeverity: "Severity Level",
    advisoryTitle: "Immediate Treatment & Advisory",
    noDiagnosisYet: "Please upload an image to view the diagnostic analysis report.",
    loadingDiag: "Analyzing leaf image details using AI model...",
    errorDiag: "Failed to run diagnosis. Please ensure the file is a valid image format.",

    // Weather & Mandi Page
    mandiWeatherTitle: "Weather Forecast & Mandi Prices",
    searchLocationPlaceholder: "Search location (e.g., Amritsar, Bhopal, Delhi)...",
    selectCropPlaceholder: "Select Crop",
    allCrops: "All Crops",
    weatherTitle: "Local Weather Report",
    weatherTemp: "Temperature",
    weatherCond: "Condition",
    weatherWind: "Wind Speed",
    weatherHumidity: "Humidity",
    rainWarning: "RAIN ALERT: Rainfall is expected. Postpone chemical spraying to avoid chemical runoff.",
    mandiTitle: "Mandi Prices Table",
    tableCrop: "Crop",
    tableMandi: "Mandi Market",
    tablePrice: "Price per Quintal",
    tableState: "State",
    noMandiData: "No price records found matching filters.",

    // Spraying Page
    sprayTitle: "Smart Chemical & Spray Calculator",
    spraySubtitle: "Formulate water volumes, tank counts, and chemical mixes to protect your crops safely.",
    fieldAreaLabel: "Field Size (Acres)",
    windSharedLabel: "Current Wind Speed (from Weather/State)",
    diseaseSharedLabel: "Active Disease Profile",
    calcVolume: "Total Spray Volume",
    calcRefills: "Knapsack Tank Refills (16L)",
    calcChemical: "Chemical Dose Per Tank",
    calcTime: "Total Spraying Duration",
    calcTotalChem: "Total Chemical Needed",
    safetyOptimal: "Safe: Wind speeds are within optimal ranges (< 15 km/h) for spraying.",
    safetyWarning: "WARNING: High wind speeds! High risk of chemical drift. Postpone spraying.",
    noActiveDisease: "No active disease predicted. Defaulting to general preventative dose.",
    liters: "Liters",
    tanks: "Refills",
    hours: "Hours",
    grams: "g / ml",

    // About Page
    aboutTitle: "About KisanDrishti & Team Zenovate",
    aboutIntro: "KisanDrishti is a comprehensive digital agri-tech platform designed for Smart India Hackathon (SIH) 2026. Our mission is to bridge the technology gap for smallholder farmers by bringing AI diagnostic and calculator tools directly to the field.",
    problemStatement: "The Problem",
    problemDesc: "Farmers lose up to 37% of crop yields annually to diseases. Furthermore, unscientific chemical spraying leads to environmental poisoning, financial waste due to rain runoffs, and health hazards due to wind drifts. Combined with lack of direct market price visibility, farmers face severe losses.",
    solutionTitle: "Our Solution",
    solutionDesc: "KisanDrishti provides a unified system combining mobile-friendly leaf disease classification, meteorological alerts, local mandi rate indexes, and a context-aware spraying advisor that computes the exact tank mixtures and warns against spraying in windy or rainy windows.",
    techStackTitle: "Technology Stack",
    teamTitle: "Meet Team Zenovate (SIH 2026)",
  },
  hi: {
    // Navigation
    navHome: "मुख्य पृष्ठ",
    navDiagnosis: "रोग निदान",
    navSpraying: "छिड़काव कैलकुलेटर",
    navMandiWeather: "मंडी और मौसम",
    navAbout: "हमारे बारे में",
    logoSubtitle: "एआई-संचालित फसल सलाहकार",
    
    // Theme & Language
    toggleLanguage: "English",
    
    // Home Page
    heroTitle: "एआई-संचालित अंतर्दृष्टि से किसानों को सशक्त बनाना",
    heroSubtitle: "फसल के रोगों का तुरंत निदान, स्थानीय मौसम की चेतावनी, वास्तविक समय में मंडी बाजार दरें और छिड़काव की गणना से अपनी उपज को बेहतर बनाएं।",
    getStarted: "शुरू करें",
    coreFeatures: "मुख्य विशेषताएं",
    
    featDiagTitle: "फसल रोग निदान",
    featDiagDesc: "संक्रमणों की तुरंत पहचान करने के लिए पत्तियों की तस्वीरें अपलोड करें। हमारे तंत्रिका नेटवर्क से अनुकूलित उपचार सलाह प्राप्त करें।",
    featSprayTitle: "छिड़काव कैलकुलेटर",
    featSprayDesc: "स्थानीय हवा की स्थिति के आधार पर सटीक रसायन खुराक, पानी की मात्रा और सुरक्षा मापदंडों की गणना करें।",
    featMandiTitle: "मंडी और मौसम",
    featMandiDesc: "क्षेत्रीय कृषि बाजारों में फसलों की कीमतों का पता लगाएं और कृषि कार्यों को निर्धारित करने के लिए मौसम अलर्ट प्राप्त करें।",
    
    tryNow: "अभी जांचें",
    whyUsTitle: "किसानदृष्टि क्यों चुनें?",
    whyUsDesc1: "उन्नत डीप लर्निंग इमेज मॉडल पर आधारित तुरंत रोग निदान।",
    whyUsDesc2: "कीमतों के उतार-चढ़ाव से आपको आगे रखने के लिए वास्तविक समय में मंडी दरों के अपडेट।",
    whyUsDesc3: "छिड़काव के प्रतिकूल समय के प्रति चेतावनी देने वाली स्थानीय मौसम सलाह।",
    
    statsTitle: "परियोजना प्रभाव सारांश",
    statFarmers: "10,000+ लक्षित किसान",
    statAccuracy: "94% निदान सटीकता",
    statSavings: "20% रासायनिक छिड़काव की बचत",
    statMandis: "50+ मंडियों की ट्रैकिंग",

    // Diagnosis Page
    diagTitle: "एआई फसल रोग निदान",
    diagSubtitle: "फसल की समस्याओं का निदान करने के लिए संक्रमित पत्ती की एक स्पष्ट तस्वीर अपलोड करें।",
    dragDropText: "छवि को यहां खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
    uploadBtn: "पत्ती की छवि अपलोड करें",
    resultsTitle: "निदान रिपोर्ट",
    metricDisease: "पहचाना गया रोग",
    metricConfidence: "सटीकता दर (कॉन्फिडेंस)",
    metricSeverity: "गंभीरता का स्तर",
    advisoryTitle: "त्वरित उपचार और सलाह",
    noDiagnosisYet: "निदान विश्लेषण रिपोर्ट देखने के लिए कृपया एक छवि अपलोड करें।",
    loadingDiag: "एआई मॉडल का उपयोग करके पत्ती की छवि का विश्लेषण किया जा रहा है...",
    errorDiag: "निदान करने में विफल। कृपया सुनिश्चित करें कि फ़ाइल एक वैध छवि प्रारूप है।",

    // Weather & Mandi Page
    mandiWeatherTitle: "मौसम पूर्वानुमान और मंडी की कीमतें",
    searchLocationPlaceholder: "स्थान खोजें (जैसे, Amritsar, Bhopal, Delhi)...",
    selectCropPlaceholder: "फसल चुनें",
    allCrops: "सभी फसलें",
    weatherTitle: "स्थानीय मौसम रिपोर्ट",
    weatherTemp: "तापमान",
    weatherCond: "स्थिति",
    weatherWind: "हवा की गति",
    weatherHumidity: "आर्द्रता (नमी)",
    rainWarning: "बारिश का अलर्ट: बारिश होने की संभावना है। रसायनों के बहाव से बचने के लिए छिड़काव स्थगित करें।",
    mandiTitle: "मंडी मूल्य सूची",
    tableCrop: "फसल",
    tableMandi: "मंडी बाजार",
    tablePrice: "मूल्य प्रति क्विंटल",
    tableState: "राज्य",
    noMandiData: "फिल्टर से मेल खाने वाले कोई मूल्य रिकॉर्ड नहीं मिले।",

    // Spraying Page
    sprayTitle: "स्मार्ट रासायनिक और छिड़काव कैलकुलेटर",
    spraySubtitle: "अपनी फसलों को सुरक्षित रूप से बचाने के लिए पानी की मात्रा, टैंक की संख्या और रसायनों की गणना करें।",
    fieldAreaLabel: "खेत का आकार (एकड़)",
    windSharedLabel: "वर्तमान हवा की गति (मौसम/स्टेट से)",
    diseaseSharedLabel: "सक्रिय रोग प्रोफाइल",
    calcVolume: "कुल छिड़काव मात्रा",
    calcRefills: "नेपसैक टैंक रिफिल (16L)",
    calcChemical: "प्रति टैंक रसायन खुराक",
    calcTime: "छिड़काव की कुल अवधि",
    calcTotalChem: "कुल आवश्यक रसायन",
    safetyOptimal: "सुरक्षित: छिड़काव के लिए हवा की गति अनुकूल सीमा (< 15 किमी/घंटा) के भीतर है।",
    safetyWarning: "चेतावनी: हवा की गति तेज है! रासायनिक रिसाव का उच्च जोखिम। छिड़काव स्थगित करें।",
    noActiveDisease: "कोई सक्रिय बीमारी नहीं पहचानी गई। सामान्य निवारक खुराक का उपयोग किया जा रहा है।",
    liters: "लीटर",
    tanks: "रिफिल",
    hours: "घंटे",
    grams: "ग्राम / मिली",

    // About Page
    aboutTitle: "किसानदृष्टि और टीम जेनोवेट के बारे में",
    aboutIntro: "किसानदृष्टि स्मार्ट इंडिया हैकाथॉन (SIH) 2026 के लिए डिज़ाइन किया गया एक व्यापक डिजिटल एग्री-टेक प्लेटफ़ॉर्म है। हमारा मिशन छोटे किसानों के लिए एआई निदान और कैलकुलेटर उपकरणों को सीधे खेत तक लाकर तकनीकी अंतर को पाटना है।",
    problemStatement: "समस्या",
    problemDesc: "फसलों के रोगों के कारण किसानों को सालाना 37% तक की उपज का नुकसान होता है। इसके अलावा, अवैज्ञानिक छिड़काव से पर्यावरण प्रदूषण, बारिश के कारण रसायनों का बहना और तेज हवा के कारण स्वास्थ्य संबंधी खतरे होते हैं। मंडियों की दरों की जानकारी न होने से किसानों को भारी नुकसान होता है।",
    solutionTitle: "हमारा समाधान",
    solutionDesc: "किसानदृष्टि एक एकीकृत प्रणाली प्रदान करता है जो मोबाइल-अनुकूल पत्ती रोग वर्गीकरण, मौसम संबंधी अलर्ट, स्थानीय मंडी दर सूचकांक और एक छिड़काव सलाहकार को जोड़ती है जो सटीक टैंक मिश्रणों की गणना करती है और तेज हवा या बारिश होने पर छिड़काव न करने की चेतावनी देती है।",
    techStackTitle: "तकनीकी स्टैक",
    teamTitle: "टीम जेनोवेट (SIH 2026) से मिलें",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const t = (key) => {
    if (!translations[language][key]) {
      console.warn(`Translation key missing: ${key}`);
      return translations.en[key] || key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
