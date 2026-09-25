"use client";

import { useState, useEffect } from "react";
import { clubData } from "../config/clubData.js";
import { Check, Sparkles, ArrowLeft, Shield } from "lucide-react";

export default function Pricing({ onSelectPlan }) {
  const showPricing = Boolean(clubData.features?.showPricing);
  const pricing = clubData.pricing || {};

  const [plans, setPlans] = useState(pricing.plans || []);

  useEffect(() => {
    let isMounted = true;

    async function loadLivePlans() {
      try {
        const res = await fetch("/api/schedule");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        }
      } catch (err) {
        console.error("Failed to load live plans:", err);
      }
    }

    loadLivePlans();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!showPricing) return null;

  const handlePlanClick = (plan) => {
    if (onSelectPlan) {
      onSelectPlan({
        id: plan.id,
        title: plan.name,
        price: clubData.formatPrice(plan.price),
      });
    }
  };

  return (
    <section
      id="pricing"
      dir="rtl"
      className="py-24 bg-dark-950 border-t border-neutral-800/80 relative font-vazir"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* تیتر بخش */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{pricing.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {pricing.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {pricing.subtitle}
          </p>

          {pricing.promoBanner && (
            <div className="mt-6 inline-block px-5 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-bold animate-pulse">
              {pricing.promoBanner}
            </div>
          )}
        </div>

        {/* کارت‌های ۳ گانه اشتراک */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.isPopular;
            const badgeText = plan.badge;
            const featureList = plan.features || [];

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 text-right transform-gpu ${
                  isPopular
                    ? "bg-dark-900 border-2 border-gold-500 shadow-2xl shadow-gold-500/15 md:-translate-y-2"
                    : "bg-dark-900/70 border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {/* بج محبوب‌ترین یا پیشنهاد ویژه */}
                {badgeText && (
                  <span
                    className={`absolute -top-4 start-1/2 translate-x-1/2 px-4 py-1 rounded-full text-xs font-black shadow-lg ${
                      isPopular
                        ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-950"
                        : "bg-dark-850 text-gold-400 border border-gold-500/30"
                    }`}
                  >
                    {badgeText}
                  </span>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-white mb-2">
                      {plan.name}
                    </h3>
                    <span className="text-xs text-neutral-400 bg-dark-850 px-3 py-1 rounded-lg border border-neutral-800 inline-block font-medium">
                      مدت اعتبار اشتراک: {plan.period}
                    </span>
                  </div>

                  {/* قیمت هماهنگ با فرمت تومان */}
                  <div className="mb-8 pb-6 border-b border-neutral-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {clubData.formatPrice(plan.price)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      {pricing.vatIncluded}
                    </span>
                  </div>

                  {/* لیست ویژگی‌ها */}
                  <div className="space-y-3.5 mb-8">
                    {featureList.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPopular
                              ? "bg-gold-500 text-dark-950"
                              : "bg-dark-800 text-gold-400"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* دکمه انتخاب پلن */}
                <div>
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isPopular
                        ? "bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-dark-950 shadow-lg shadow-gold-500/20"
                        : "bg-dark-850 hover:bg-gold-500 text-white hover:text-dark-950 border border-neutral-700 hover:border-gold-500"
                    }`}
                  >
                    <span>{pricing.selectPlan}</span>
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ضمانت بازگشت */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-neutral-400">
          <Shield className="w-4 h-4 text-gold-500 shrink-0" />
          <span>{pricing.guarantee}</span>
        </div>
      </div>
    </section>
  );
}
