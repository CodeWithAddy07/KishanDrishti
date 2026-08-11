import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SharedStateProvider } from "./context/SharedStateContext";

// Components & Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Diagnosis from "./pages/Diagnosis";
import Spraying from "./pages/Spraying";
import MandiWeather from "./pages/MandiWeather";
import About from "./pages/About";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SharedStateProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              
              {/* Sticky top navigation bar */}
              <Header />

              {/* Main content body */}
              <main className="flex-grow flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/diagnosis" element={<Diagnosis />} />
                  <Route path="/spraying" element={<Spraying />} />
                  <Route path="/mandi-weather" element={<MandiWeather />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>

              {/* Sticky bottom metadata footer */}
              <Footer />

            </div>
          </Router>
        </SharedStateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
