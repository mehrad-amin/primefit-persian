"use client";

import Image from "next/image";
import { clubData } from "../config/clubData.js";
import {
  Award,
  CheckCircle,
  MessageSquare,
  Check,
  AlertCircle,
} from "lucide-react";

export default function Trainers({
  onSelectTrainer,
  selectedTrainerName,
  selectedClassTitle,
}) {
  const showTrainers = Boolean(clubData.features?.showTrainers);
  const trainers = clubData.trainers || {};
  const items = trainers.items || [];

  if (!showTrainers) return null;

  const handleTrainerClick = (trainer) => {
    if (onSelectTrainer) {
      onSelectTrainer({
        id: trainer.id,
        title: trainer.name,
        role: trainer.role,
      });
    }
  };

  return (
    <section
      id="trainers"
      dir="rtl"
      className="py-24 bg-dark-950 relative border-t border-neutral-800/80 font-vazir"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* تیتر بخش */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>{trainers.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {trainers.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {trainers.subtitle}
          </p>
        </div>

        {/* گرید کارت‌های مربیان */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((trainer) => {
            const isSelected = selectedTrainerName === trainer.name;
            const hasConflict = Boolean(
              selectedClassTitle && !isSelected && selectedTrainerName,
            );

            return (
              <div
                key={trainer.id}
                className={`bg-dark-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl text-right ${
                  isSelected
                    ? "border-gold-500 ring-2 ring-gold-500/30"
                    : "border-neutral-800/90 hover:border-gold-500/40"
                }`}
              >
                <div>
                  <div className="relative h-80 w-full overflow-hidden bg-dark-800">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      unoptimized // سازگاری صددرصدی و سریع با Cloudflare Pages
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent pointer-events-none" />

                    <span className="absolute bottom-4 start-4 px-3 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md text-gold-400 text-xs font-bold border border-gold-500/30">
                      {trainer.experience}
                    </span>

                    {/* برچسب اختصاصی اگر این مربی مربوط به کلاس انتخاب‌شده باشد */}
                    {isSelected && selectedClassTitle && (
                      <span className="absolute top-4 end-4 px-3 py-1.5 rounded-lg bg-gold-500 text-dark-950 text-xs font-black shadow-lg">
                        مربی کلاس انتخابی شما
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-gold-400 transition-colors">
                        {trainer.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {trainer.role}
                      </p>
                      <p className="text-xs font-semibold text-emerald-400 mt-1.5">
                        {trainers.specialtyLabel}:{" "}
                        <span className="text-neutral-200">
                          {trainer.specialty}
                        </span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                      <span className="block text-[11px] font-semibold text-neutral-400 tracking-wider">
                        {trainers.credentialsLabel}
                      </span>
                      <div className="space-y-1.5">
                        {trainer.credentials?.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span className="text-xs text-neutral-300 font-medium">
                              {cert}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleTrainerClick(trainer)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gold-500 text-dark-950 font-black shadow-lg shadow-gold-500/20"
                        : hasConflict
                          ? "bg-dark-850 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border border-neutral-700 hover:border-amber-500/40"
                          : "bg-dark-850 hover:bg-gold-500 text-neutral-200 hover:text-dark-950 border border-neutral-700 hover:border-gold-500"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>مربی انتخاب شد</span>
                      </>
                    ) : hasConflict ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>انتخاب این مربی (لغو کلاس قبلی)</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>{trainers.bookConsultBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
