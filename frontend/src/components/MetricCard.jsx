import React from "react";

const MetricCard = ({ title, value, unit, icon: Icon, colorClass, statusBadge }) => {
  // Determine gradient wrapper based on colorClass
  let themeStyles = "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300";
  if (colorClass === "red") {
    themeStyles = "from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300";
  } else if (colorClass === "yellow") {
    themeStyles = "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300";
  } else if (colorClass === "blue") {
    themeStyles = "from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300";
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${themeStyles} border p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
      {/* Background shape */}
      <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
        {Icon && <Icon className="h-28 w-28" />}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              {value}
            </span>
            {unit && (
              <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
          {statusBadge && (
            <span className={`inline-block mt-3 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge.style}`}>
              {statusBadge.text}
            </span>
          )}
        </div>
        
        {Icon && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
            <Icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
