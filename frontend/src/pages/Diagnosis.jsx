import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertOctagon, RefreshCw, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSharedState } from "../context/SharedStateContext";
import { predictDisease } from "../services/api";
import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";

const Diagnosis = () => {
  const { t } = useLanguage();
  const { setPredictedDisease } = useSharedState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [advisoryExpanded, setAdvisoryExpanded] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validExtensions = /\.(jpg|jpeg|png|webp|jfif)$/i;
    const isImageMime = file.type ? file.type.startsWith("image/") : true;

    if (!isImageMime && !validExtensions.test(file.name)) {
      setError("Please select a valid image file (.jpg, .jpeg, .png, .webp)");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setReport(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await predictDisease(selectedFile);
      setReport(response);
      if (response && response.disease) {
        setPredictedDisease(response.disease);
      }
    } catch (err) {
      setError(err.message || t("errorDiag") || "Failed to analyze leaf image.");
      console.error("Diagnosis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setReport(null);
    setError(null);
  };

  const getSeverityBadge = (severity) => {
    const s = severity ? severity.toLowerCase() : "";
    if (s.includes("severe") || s.includes("high")) {
      return { text: severity, style: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" };
    } else if (s.includes("moderate") || s.includes("medium")) {
      return { text: severity, style: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" };
    } else {
      return { text: severity || "Low", style: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" };
    }
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionTitle
        title={t("diagTitle")}
        subtitle={t("diagSubtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Upload Infected Leaf Image
          </h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={previewUrl ? null : triggerFileInput}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[250px] ${
              isDragActive
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {previewUrl ? (
              <div className="w-full relative group">
                <img
                  src={previewUrl}
                  alt="Leaf preview"
                  className="max-h-[260px] mx-auto rounded-xl object-contain shadow-inner"
                />
                <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    className="px-4 py-2 bg-white text-slate-800 font-semibold rounded-lg shadow text-xs hover:bg-slate-100 transition"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-full text-emerald-600 dark:text-emerald-400 mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("dragDropText")}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Supports JPG, JPEG, PNG, WEBP formats
                </p>
              </>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Reset
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>{t("uploadBtn")}</span>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-sm">
              <AlertOctagon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              {t("resultsTitle")}
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{t("loadingDiag")}</p>
              </div>
            ) : report ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title={t("metricDisease")}
                    value={report.disease}
                    colorClass={report.severity?.toLowerCase().includes("severe") ? "red" : (report.severity?.toLowerCase().includes("moderate") ? "yellow" : "emerald")}
                  />
                  <MetricCard
                    title={t("metricConfidence")}
                    value={report.confidence}
                    unit="%"
                    colorClass="blue"
                  />
                  <MetricCard
                    title={t("metricSeverity")}
                    value={report.severity}
                    statusBadge={getSeverityBadge(report.severity)}
                    colorClass={report.severity?.toLowerCase().includes("severe") ? "red" : (report.severity?.toLowerCase().includes("moderate") ? "yellow" : "emerald")}
                  />
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mt-6">
                  <button
                    onClick={() => setAdvisoryExpanded(!advisoryExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm md:text-base"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      {t("advisoryTitle")}
                    </span>
                    {advisoryExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {advisoryExpanded && (
                    <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      <ul className="space-y-3">
                        {report.advice && report.advice.map((adv, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-emerald-500 font-extrabold mr-2 select-none">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                <Activity className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">{t("noDiagnosisYet")}</p>
              </div>
            )}
          </div>

          {report && (
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Diagnosis completed: {report.filename}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;