import React from "react";
import { User } from "lucide-react";

const TeamCard = ({ name, role, responsibilities, initials }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Avatar Container */}
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-500/20 shadow-inner group-hover:border-emerald-500 transition-colors duration-300">
        {initials ? (
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 select-none">
            {initials}
          </span>
        ) : (
          <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>

      {/* Member Details */}
      <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {name}
      </h3>
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">
        {role}
      </p>

      <hr className="my-4 border-slate-100 dark:border-slate-800" />

      {/* Responsibilities list */}
      <ul className="text-left text-xs space-y-2 text-slate-600 dark:text-slate-400">
        {responsibilities.map((resp, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-emerald-500 font-bold">•</span>
            <span>{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamCard;
