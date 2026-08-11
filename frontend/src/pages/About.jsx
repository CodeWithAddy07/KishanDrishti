import React from "react";
import { BookOpen, HelpCircle, Activity, Award, CheckCircle, Code } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import TeamCard from "../components/TeamCard";
import SectionTitle from "../components/SectionTitle";

const About = () => {
  const { t } = useLanguage();

  const members = [
    {
      name: "Aditya Vikram Bal",
      role: "Team Lead & System Assembly Lead",
      initials: "AB",
      responsibilities: [
        "Led full end-to-end system assembly, code integration, and module wiring.",
        "Formulated spray volume and Knapsack refill calculation rules.",
        "Programmed chemical mixing threshold alerts & connected wind parameters."
      ]
    },
    {
      name: "Hamid Ahmad Khan",
      role: "Full-Stack Architect",
      initials: "HK",
      responsibilities: [
        "Architected complete React and FastAPI project structures.",
        "Created global contexts (Theme, Language, Shared States).",
        "Configured development dependencies and API gateways."
      ]
    },
    {
      name: "Ayush Patel",
      role: "AI Disease Detection Lead",
      initials: "AP",
      responsibilities: [
        "Built deep learning model wrapper to identify crop leaf spot infections.",
        "Calibrated severity level heuristics and confidence reporting logic.",
        "Integrated multi-stage drag-and-drop diagnostic uploader."
      ]
    },
    {
      name: "Ayush Sharma",
      role: "Weather & Mandi API Lead",
      initials: "AS",
      responsibilities: [
        "Integrated weather forecast forecasts and moisture indexes.",
        "Created searchable mandi price listings with crop filter dropdowns.",
        "Linked regional location parameters with meteorological APIs."
      ]
    },
    {
      name: "Bharat Rai",
      role: "Pitch Presentation & Strategy Lead",
      initials: "BR",
      responsibilities: [
        "Leads the official SIH 2026 jury pitch presentation and Q&A defense.",
        "Translates technical platform architecture into clear business and social impact value.",
        "Formulates product positioning strategies and field implementation roadmaps."
      ]
    },
    {
      name: "Bhawna Kumari",
      role: "Presentation Design & UI/UX Lead",
      initials: "BK",
      responsibilities: [
        "Designed the complete project presentation deck and visual assets.",
        "Structured slide layouts and storyboarding for clear technical representation.",
        "Refined platform UI/UX design workflows and farmer-friendly layouts."
      ]
    }
  ];

  const techStack = [
    { name: "React.js (Vite)", type: "Frontend Core", icon: "⚛️" },
    { name: "Tailwind CSS", type: "Styling System", icon: "🎨" },
    { name: "FastAPI", type: "Python Backend", icon: "⚡" },
    { name: "Lucide React", type: "Icon Suite", icon: "✨" },
    { name: "Uvicorn", type: "ASGI Server", icon: "🚀" },
    { name: "Pandas", type: "Data Analytics", icon: "🐼" }
  ];

  return (
    <div className="flex-grow">
      {/* Banner Title */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">{t("aboutTitle")}</h1>
          <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t("aboutIntro")}
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          
          {/* Problem Statement block */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-rose-500" />
              {t("problemStatement")}
            </h2>
            <div className="h-1.5 w-12 rounded bg-rose-500 mb-6" />
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t("problemDesc")}
            </p>
          </div>

          {/* Solution block */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              {t("solutionTitle")}
            </h2>
            <div className="h-1.5 w-12 rounded bg-emerald-500 mb-6" />
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t("solutionDesc")}
            </p>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="mb-20">
          <SectionTitle
            title={t("techStackTitle")}
            subtitle="Platform architecture stacks optimized for rapid execution and scalability."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech) => (
              <div 
                key={tech.name}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center transition-all hover:scale-105 duration-300"
              >
                <span className="text-3xl mb-3 select-none">{tech.icon}</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">{tech.name}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-semibold">{tech.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Grid */}
        <div>
          <SectionTitle
            title={t("teamTitle")}
            subtitle="Zenovate project contributors building the digital agronomy application."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {members.map((member) => (
              <TeamCard
                key={member.name}
                name={member.name}
                role={member.role}
                initials={member.initials}
                responsibilities={member.responsibilities}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;