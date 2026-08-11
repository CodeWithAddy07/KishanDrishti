import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 text-center md:text-left">
          {/* Brand Credits */}
          <div className="text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">KisanDrishti</span>
            <span className="mx-2">|</span>
            <span>Team Zenovate</span>
            <span className="mx-2">|</span>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded text-xs">SIH 2026</span>
          </div>

          {/* Quick Links Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
              {t("navHome")}
            </Link>
            <Link to="/diagnosis" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
              {t("navDiagnosis")}
            </Link>
            <Link to="/spraying" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
              {t("navSpraying")}
            </Link>
            <Link to="/mandi-weather" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
              {t("navMandiWeather")}
            </Link>
            <Link to="/about" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
              {t("navAbout")}
            </Link>
          </nav>
        </div>

        {/* Top Divider and Copyright */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center justify-between md:flex-row text-xs text-slate-400 dark:text-slate-500">
          <p>© {currentYear} KisanDrishti. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Smart India Hackathon 2026 by Zenovate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
