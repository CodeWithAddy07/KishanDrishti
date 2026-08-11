import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ title, description, icon: Icon, to, btnText, imageUrl, themeClass }) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full bg-white dark:bg-slate-900">
      
      {/* Decorative Top Accent Image or Gradient */}
      <div className="relative h-48 w-full overflow-hidden bg-emerald-800 dark:bg-emerald-950">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/45 to-transparent z-10" />
        <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply z-10" />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-900 dark:to-teal-950" />
        )}
        
        {/* Overlaid Floating Icon Badge */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            {description}
          </p>
        </div>
        
        {/* Navigation Link Button */}
        <Link
          to={to}
          className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
        >
          <span>{btnText}</span>
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
