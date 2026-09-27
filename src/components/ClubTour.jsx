"use client";

import { useState } from "react";
import { clubData } from "../config/clubData.js";
import {
  Sparkles,
  Dumbbell,
  KeyRound,
  Waves,
  Coffee,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CalendarCheck,
  Maximize2,
  X,
} from "lucide-react";

export default function ClubTour({ onSelectCategory }) {
  const tourData = clubData.tour;
  const categories = tourData?.categories || [];
  const spaces = tourData?.spaces || [];

  const [activeCategory, setActiveCategory] = useState("all");
  // مدیریت اندیس اسلاید فعال برای هر فضا به تفکیک
  const [photoIndices, setPhotoIndices] = useState({});
  // مودال فول‌اسکرین در صورت لمس عکس
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

  if (!tourData || !spaces.length) return null;

  // فیلتر فضاها بر اساس دسته‌بندی انتخابی
  const filteredSpaces =
    activeCategory === "all"
      ? spaces
      : spaces.filter((s) => s.categoryId === activeCategory);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Dumbbell":
        return <Dumbbell className="w-4 h-4" />;
      case "KeyRound":
        return <KeyRound className="w-4 h-4" />;
      case "Waves":
        return <Waves className="w-4 h-4" />;
      case "Coffee":
        return <Coffee className="w-4 h-4" />;
      case "HeartPulse":
        return <HeartPulse className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleNextPhoto = (spaceId, totalPhotos) => {
    setPhotoIndices((prev) => {
      const current = prev[spaceId] || 0;
      return {
        ...prev,
        [spaceId]: (current + 1) % totalPhotos,
      };
    });
  };

  const handlePrevPhoto = (spaceId, totalPhotos) => {
    setPhotoIndices((prev) => {
      const current = prev[spaceId] || 0;
      return {
        ...prev,
        [spaceId]: (current - 1 + totalPhotos) % totalPhotos,
      };
    });
  };

  return (
    <section
      id="tour"
      dir="rtl"
      className="py-20 bg-dark-950 border-t border-neutral-800/80 relative overflow-hidden font-vazir"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* هدر بخش */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tourData.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {tourData.title}
          </h2>
          <p className="mt-2 text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {tourData.subtitle}
          </p>
        </div>

        {/* نوار اسکرول افقی کتگوری‌ها (دقیقاً مثل استوری‌های اینستاگرام) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 ${
                  isSelected
                    ? "bg-gold-500 text-dark-950 border-gold-500 shadow-lg shadow-gold-500/20 font-black scale-102"
                    : "bg-dark-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* لیست فضاهای باشگاه با گالری چندعکسی لمسی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredSpaces.map((space) => {
            const currentIdx = photoIndices[space.id] || 0;
            const total = space.photos?.length || 1;
            const currentPhoto =
              space.photos?.[currentIdx] || space.photos?.[0];

            return (
              <div
                key={space.id}
                className="bg-dark-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                {/* اسلایدر چند عکسی */}
                <div className="relative aspect-[16/10] bg-dark-950 overflow-hidden group select-none">
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.caption || space.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent pointer-events-none" />

                  {/* برچسب شاخص فضا (Badge) */}
                  {space.badge && (
                    <span className="absolute top-3.5 right-3.5 bg-dark-950/80 backdrop-blur-md border border-gold-500/40 text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                      {space.badge}
                    </span>
                  )}

                  {/* دکمه تمام صفحه کردن عکس */}
                  <button
                    onClick={() => setFullscreenPhoto(currentPhoto)}
                    className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-dark-950/70 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center hover:bg-gold-500 hover:text-dark-950 transition-colors cursor-pointer"
                    title="مشاهده بزرگ‌تر"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* دکمه‌های ورق زدن عکس‌ها (در صورت وجود بیش از یک عکس) */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevPhoto(space.id, total);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-dark-950/80 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center hover:border-gold-500 active:scale-95 transition-all cursor-pointer"
                        aria-label="عکس قبلی"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextPhoto(space.id, total);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-dark-950/80 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center hover:border-gold-500 active:scale-95 transition-all cursor-pointer"
                        aria-label="عکس بعدی"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* شمارنده ورق‌زدنی (مثل پست‌های اینستاگرام) */}
                      <div className="absolute bottom-3 left-3 bg-dark-950/85 backdrop-blur-md border border-neutral-700 px-2.5 py-0.5 rounded-full text-[10px] font-english text-neutral-200">
                        {currentIdx + 1} / {total}
                      </div>

                      {/* نقطه‌های اسلایدر */}
                      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {space.photos.map((_, pIdx) => (
                          <span
                            key={pIdx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              pIdx === currentIdx
                                ? "w-4 bg-gold-400"
                                : "w-1.5 bg-neutral-600/70"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* کپشن عکس فعال */}
                  {currentPhoto.caption && (
                    <div className="absolute bottom-3 right-3 max-w-[70%]">
                      <span className="text-[11px] text-neutral-300 bg-dark-950/80 backdrop-blur-md px-2 py-1 rounded-lg block truncate border border-neutral-800">
                        {currentPhoto.caption}
                      </span>
                    </div>
                  )}
                </div>

                {/* توضیحات و امکانات اختصاصی فضا */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white mb-1">
                      {space.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      {space.subtitle}
                    </p>

                    {/* لیست امکانات با تیک تایید */}
                    <div className="space-y-2 mb-6">
                      {space.features?.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-xs text-neutral-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* دکمه رزرو / مشاهده سانس‌ها */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      دسترسی آزاد برای تمامی اعضا
                    </span>
                    <a
                      href="#schedule"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>رزرو سانس اختصاصی</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* مودال فول‌اسکرین در صورت لمس عکس در موبایل */}
        {fullscreenPhoto && (
          <div
            onClick={() => setFullscreenPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn"
          >
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-dark-800 text-white flex items-center justify-center border border-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={fullscreenPhoto.url}
              alt={fullscreenPhoto.caption}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-neutral-800"
            />
            {fullscreenPhoto.caption && (
              <p className="mt-4 text-sm text-neutral-300 text-center font-medium">
                {fullscreenPhoto.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
