import React, { useState, useEffect } from "react";
import { Droplets, Calculator, HelpCircle, ShieldAlert, ShieldCheck, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSharedState } from "../context/SharedStateContext";
import { calculateSpray } from "../services/api";
import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";

const Spraying = () => {
  const { t } = useLanguage();
  const { predictedDisease, windSpeed } = useSharedState();

  const [areaInput, setAreaInput] = useState(2.0);
  const [loading, setLoading] = useState(false);
  const [calcResults, setCalcResults] = useState(null);

  const runCalculations = async () => {
    if (areaInput <= 0) return;
    setLoading(true);
    
    try {
      const res = await calculateSpray(areaInput, predictedDisease, windSpeed);
      setCalcResults(res);
    } catch (err) {
      console.error("Failed to run spray calculation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculations();
  }, [areaInput, predictedDisease, windSpeed]);

  // Safe fallback getters for key structure compatibility
  const totalVolume = calcResults?.total_spray_volume_l ?? 0;
  const tankRefills = calcResults?.tank_refills ?? calcResults?.total_tank_refills ?? 0;
  const chemicalName = calcResults?.chemical_name ?? calcResults?.recommended_chemical ?? "Broad Spectrum Fungicide";
  const dosePerTank = calcResults?.chemical_dose_per_tank ?? calcResults?.chem_per_full_tank_ml ?? 0;
  const sprayHours = calcResults?.spraying_time_hours ?? calcResults?.est_spray_time_hrs ?? 0;
  const totalChemNeeded = calcResults?.total_chemical_needed ?? calcResults?.chemical_quantity_ml ?? 0;
  const isSafe = calcResults?.is_safe ?? calcResults?.can_spray ?? true;
  const statusMsg = calcResults?.status_message ?? calcResults?.safety_warning ?? "Normal conditions";

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionTitle
        title={t("sprayTitle")}
        subtitle={t("spraySubtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Spraying Parameters
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("fieldAreaLabel")}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={areaInput}
                onChange={(e) => setAreaInput(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("diseaseSharedLabel")}
                </label>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">
                  From Diagnosis
                </span>
              </div>
              <div className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-300 rounded-2xl text-sm font-semibold select-none flex items-center justify-between">
                <span>{predictedDisease || "None Detected"}</span>
              </div>
              {!predictedDisease && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-start gap-1">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{t("noActiveDisease")}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("windSharedLabel")}
                </label>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">
                  From Weather
                </span>
              </div>
              <div className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-300 rounded-2xl text-sm font-semibold select-none flex items-center justify-between">
                <span>{windSpeed} km/h</span>
                <span className={`h-2.5 w-2.5 rounded-full ${windSpeed >= 15 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Calculations Results panel */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Calculated Spraying Requirements
            </h3>

            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : calcResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetricCard
                    title={t("calcVolume")}
                    value={totalVolume}
                    unit={t("liters")}
                    colorClass="blue"
                  />
                  <MetricCard
                    title={t("calcRefills")}
                    value={tankRefills}
                    unit={t("tanks")}
                    colorClass="emerald"
                  />
                  <MetricCard
                    title={t("calcChemical")}
                    value={`${chemicalName} (${dosePerTank} ml/tank)`}
                    colorClass="yellow"
                  />
                  <MetricCard
                    title={t("calcTime")}
                    value={sprayHours}
                    unit={t("hours")}
                    colorClass="blue"
                  />
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🚜</span>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300">Equipment & Nozzle Settings</p>
                      <p className="text-slate-500 dark:text-slate-400">Nozzle: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Hollow Cone / Fan</span> | Pressure: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2.0 - 2.5 bar</span></p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">0.9 LPM</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{t("calcTotalChem")}</span>
                  <span className="font-extrabold text-slate-800 dark:text-white">
                    {totalChemNeeded} ml
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-slate-400">
                <HelpCircle className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm font-medium">Calculation outcomes will display here</p>
              </div>
            )}
          </div>

          {calcResults && (
            <div className={`mt-8 p-4 border rounded-2xl flex items-start gap-3 shadow-sm ${
              isSafe
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300"
            }`}>
              {isSafe ? (
                <ShieldCheck className="h-6 w-6 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="h-6 w-6 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {isSafe ? t("safetyOptimal") : t("safetyWarning")}
                </p>
                <p className="text-xs opacity-85 mt-1">{statusMsg}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spraying;