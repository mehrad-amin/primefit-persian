"use client";

import { useState } from "react";
import { clubData } from "../config/clubData.js";
import { CheckCircle2, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default function Facilities() {
  const { facilities } = clubData;
  const [activeTab, setActiveTab] = useState(facilities.categories[0].id);

  const currentCategory =
    facilities.categories.find((c) => c.id === activeTab) ||
    facilities.categories[0];

  return (
    <section
      id="facilities"
      dir="rtl"
      className="py-24 bg-dark-900 border-t border-neutral-800/80 relative overflow-hidden font-vazir"
    >
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* تیتر بخش */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4 shadow-lg shadow-gold-500/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{facilities.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {facilities.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {facilities.subtitle}
          </p>
        </div>

        {/* دکمه‌های تب‌ها */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {facilities.categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950 font-black shadow-lg shadow-gold-500/20"
                    : "bg-dark-850 text-neutral-300 border border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* کارت نمایش محتوا */}
        <div className="bg-dark-850/80 border border-neutral-800 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* اطلاعات متنی */}
            <div className="lg:col-span-5 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gold-500/10 text-gold-400 text-xs font-semibold border border-gold-500/20">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{currentCategory.badge}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentCategory.label}
              </h3>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {currentCategory.description}
              </p>

              <div className="space-y-3 pt-2">
                {currentCategory.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-neutral-200 font-medium">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href="#lead-capture"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-dark-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  <span>{facilities.cta}</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* گالری تصاویر */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentCategory.images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative h-48 sm:h-72 rounded-xl overflow-hidden border border-neutral-800/80 bg-dark-800 shadow-md"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 start-3 end-3 text-xs font-bold text-white tracking-wide text-right">
                    {img.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
