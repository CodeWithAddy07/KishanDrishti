import React from "react";

const SectionTitle = ({ title, subtitle, align = "center", light = false }) => {
  const alignClass = align === "left" ? "text-left" : "text-center";
  
  return (
    <div className={`mb-10 max-w-3xl ${alignClass} ${align === "center" ? "mx-auto" : ""}`}>
      {/* Title */}
      <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
        light ? "text-white" : "text-slate-800 dark:text-white"
      }`}>
        {title}
      </h2>
      
      {/* Visual Accent Bar */}
      <div className={`h-1.5 w-16 rounded-full bg-emerald-500 mt-4 mb-3 ${
        align === "center" ? "mx-auto" : ""
      }`} />
      
      {/* Subtitle */}
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${
          light ? "text-emerald-100/80" : "text-slate-600 dark:text-slate-400"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
