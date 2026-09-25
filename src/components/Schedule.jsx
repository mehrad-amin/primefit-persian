"use client";

import { useState, useEffect, useMemo } from "react";
import { clubData } from "../config/clubData.js";
import {
  Calendar,
  Clock,
  User,
  Users,
  AlertCircle,
  Flame,
  CheckCircle,
  RotateCw,
} from "lucide-react";

const DAYS = [
  { id: "all", name: "تمام روزهای هفته" },
  { id: "sat", name: "شنبه" },
  { id: "sun", name: "یک‌شنبه" },
  { id: "mon", name: "دوشنبه" },
  { id: "tue", name: "سه‌شنبه" },
  { id: "wed", name: "چهارشنبه" },
  { id: "thu", name: "پنج‌شنبه" },
];

export default function Schedule({ onSelectClass, selectedClassId }) {
  const showSchedule = Boolean(clubData.features?.showSchedule);
  const scheduleConfig = clubData.schedule || {};

  const [activeDay, setActiveDay] = useState("all");
  const [classes, setClasses] = useState(scheduleConfig.classes || []);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const syncWithSheet = async () => {
      try {
        setIsSyncing(true);
        const res = await fetch("/api/schedule", {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (
          isMounted &&
          data.classes &&
          Array.isArray(data.classes) &&
          data.classes.length > 0
        ) {
          setClasses(data.classes);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("خطا در همگام‌سازی:", err);
        }
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    syncWithSheet();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const currentClasses = useMemo(() => {
    if (activeDay === "all") return classes;
    return classes.filter(
      (c) =>
        String(c.dayId || "")
          .toLowerCase()
          .trim() === activeDay.toLowerCase(),
    );
  }, [classes, activeDay]);

  if (!showSchedule) return null;

  const handleBooking = (item) => {
    if (onSelectClass) {
      onSelectClass({
        id: item.id,
        title: item.title,
        time: item.time,
        trainer: item.trainer,
        seatsLeft: Number(item.seatsLeft || 0),
        isLadiesOnly: Boolean(item.isLadiesOnly),
      });
    }
  };

  return (
    <section
      id="schedule"
      dir="rtl"
      className="py-24 bg-dark-900 border-t border-neutral-800/80 relative font-vazir"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* تیتر بخش */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{scheduleConfig.badge || "برنامه هفتگی کلاس‌های گروهی"}</span>
            {isSyncing && (
              <RotateCw className="w-3 h-3 text-gold-400/80 animate-spin ms-1" />
            )}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {scheduleConfig.title || "جدول سانس‌های تمرینی و کلاس‌های فعال"}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {scheduleConfig.subtitle}
          </p>
        </div>

        {/* تب روزهای هفته */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setActiveDay(day.id)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                activeDay === day.id
                  ? "bg-gold-500 text-dark-950 font-black shadow-lg shadow-gold-500/20"
                  : "bg-dark-850 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {/* لیست کارت‌های کلاس‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentClasses.map((item) => {
            const seatsCount = Number(item.seatsLeft ?? 0);
            const isFull = seatsCount <= 0;
            const isSelected = selectedClassId === item.id;

            return (
              <div
                key={item.id || item.title}
                className={`bg-dark-850 border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl text-right transform-gpu ${
                  isSelected
                    ? "border-gold-500 ring-2 ring-gold-500/30"
                    : "border-neutral-800/90 hover:border-gold-500/40"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-dark-800 text-gold-400 border border-gold-500/20 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                    {item.isLadiesOnly && (
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-950/70 border border-purple-800/60 text-purple-300 font-bold">
                        ویژه بانوان
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                      <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>مربی: {item.trainer}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>فشار: {item.intensity}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {isFull ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          تکمیل ظرفیت
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">
                          {seatsCount.toLocaleString("fa-IR")} جایگاه خالی
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => handleBooking(item)}
                    className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform-gpu ${
                      isSelected
                        ? "bg-gold-500 text-dark-950 font-black shadow-lg shadow-gold-500/30"
                        : isFull
                          ? "bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-dark-950 border border-amber-500/30"
                          : "bg-dark-800 hover:bg-gold-500 text-neutral-200 hover:text-dark-950 border border-neutral-700 hover:border-gold-500 shadow-md"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>سانس انتخاب شد</span>
                      </>
                    ) : isFull ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>ثبت‌نام در لیست انتظار</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>رزرو جایگاه در این سانس</span>
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
