"use client";

import { useState, useEffect } from "react";
import { CreditCard, UserCheck, Dumbbell, ArrowLeft, X } from "lucide-react";

export default function StickyBookingBar({
  selectedBookings = {},
  onClearBooking,
  onProceedToForm,
}) {
  const { plan, trainer, classItem } = selectedBookings;
  const hasSelection = Boolean(plan || trainer || classItem);

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const targetElement = document.getElementById("lead-capture");
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!hasSelection) return null;

  return (
    <aside
      dir="rtl"
      aria-label="نوار خلاصه و تکمیل رزرو"
      className={`fixed bottom-0 inset-x-0 z-40 bg-dark-900/90 backdrop-blur-md border-t border-gold-500/30 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] py-3 px-4 sm:px-6 transition-all duration-300 ease-in-out font-vazir transform-gpu will-change-[transform,opacity] ${
        isFormVisible
          ? "translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100 pointer-events-auto"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* نشانگرها و خلاصه انتخاب‌ها */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
          {plan && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs shrink-0">
              <CreditCard className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-bold max-w-[120px] truncate">
                {plan.title || plan.name}
              </span>
              {onClearBooking && (
                <button
                  type="button"
                  onClick={() => onClearBooking("plan")}
                  aria-label="حذف پلن اشتراک"
                  className="hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {trainer && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 border border-neutral-700 text-neutral-200 text-xs shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold max-w-[110px] truncate">
                {trainer.title || trainer.name}
              </span>
              {onClearBooking && (
                <button
                  type="button"
                  onClick={() => onClearBooking("trainer")}
                  aria-label="حذف مربی انتخابی"
                  className="hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {classItem && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs shrink-0">
              <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold max-w-[120px] truncate">
                {classItem.title}
              </span>
              {onClearBooking && (
                <button
                  type="button"
                  onClick={() => {
                    onClearBooking("classItem");
                    onClearBooking("class");
                  }}
                  aria-label="حذف سانس تمرینی"
                  className="hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* دکمه اسکرول به فرم ثبت‌نام */}
        <button
          type="button"
          onClick={onProceedToForm}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-dark-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-gold-500/20 shrink-0 cursor-pointer transform-gpu"
        >
          <span>تکمیل و نهایی‌سازی رزرو</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
