import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Droplets, Landmark, BarChart2, ShieldCheck, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import FeatureCard from "../components/FeatureCard";
import SectionTitle from "../components/SectionTitle";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 py-20 md:py-32 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <ShieldCheck className="h-4 w-4 mr-1" />
            SIH 2026 Innovation Project
          </span>
          
          {/* Main Tagline as Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight max-w-5xl text-white drop-shadow-lg">
            Grow More. Spend Less. Farm Smarter.
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-emerald-100/90 max-w-3xl leading-relaxed">
            Reduce crop losses and optimize every acre with real-time disease analysis, weather forecasts, mandi prices, and precision spray calculations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-md">
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-white text-emerald-900 hover:bg-emerald-50 dark:hover:bg-slate-100 shadow-xl transition-all duration-300 hover:scale-105"
            >
              {t("getStarted")}
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-emerald-700/50 hover:bg-emerald-700 text-white border border-emerald-500/40 backdrop-blur shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t("navAbout")}
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle
          title={t("coreFeatures")}
          subtitle="Explore the main diagnostic and calculations engines built to serve daily farming requirements."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Diagnosis feature card */}
          <FeatureCard
            title={t("featDiagTitle")}
            description={t("featDiagDesc")}
            icon={Stethoscope}
            to="/diagnosis"
            btnText={t("tryNow")}
            imageUrl="/disease.jpeg"
          />

          {/* Spraying calculator card */}
          <FeatureCard
            title={t("featSprayTitle")}
            description={t("featSprayDesc")}
            icon={Droplets}
            to="/spraying"
            btnText={t("tryNow")}
            imageUrl="/spray.jpeg"
          />

          {/* Mandi & Weather feature card */}
          <FeatureCard
            title={t("featMandiTitle")}
            description={t("featMandiDesc")}
            icon={Landmark}
            to="/mandi-weather"
            btnText={t("tryNow")}
            imageUrl="/mandi.jpeg"
          />
        </div>
      </section>

      {/* Why KisanDrishti Section */}
      <section className="bg-slate-100 dark:bg-slate-900 transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title={t("whyUsTitle")}
            subtitle="Bridging science and fields through accessible tools designed directly for farm operations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Reason 1 */}
            <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">AI-Classifier</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("whyUsDesc1")}</p>
              </div>
            </div>

            {/* Reason 2 */}
            <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Market Watch</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("whyUsDesc2")}</p>
              </div>
            </div>

            {/* Reason 3 */}
            <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Eco-Efficiency</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t("whyUsDesc3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-teal-950 rounded-3xl text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Sparkles backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                {t("statsTitle")}
              </h3>
              <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
                Projected outcome metrics derived from crop-protection field studies applying localized parameters.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 flex-grow">
              <div className="border-l-2 border-emerald-300/30 pl-4">
                <p className="text-3xl sm:text-4xl font-black text-white">10k+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mt-1">{t("statFarmers")}</p>
              </div>
              <div className="border-l-2 border-emerald-300/30 pl-4">
                <p className="text-3xl sm:text-4xl font-black text-white">94%</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mt-1">{t("statAccuracy")}</p>
              </div>
              <div className="border-l-2 border-emerald-300/30 pl-4">
                <p className="text-3xl sm:text-4xl font-black text-white">20%</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mt-1">{t("statSavings")}</p>
              </div>
              <div className="border-l-2 border-emerald-300/30 pl-4">
                <p className="text-3xl sm:text-4xl font-black text-white">50+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mt-1">{t("statMandis")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;