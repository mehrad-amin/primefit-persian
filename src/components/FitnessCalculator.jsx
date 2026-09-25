"use client";

import { useState } from "react";
import { clubData } from "../config/clubData.js";
import { Calculator, Flame, Scale, Dumbbell } from "lucide-react";

export default function FitnessCalculator() {
  const showCalculator = Boolean(clubData.features?.showCalculator);
  const calculator = clubData.calculator || {};

  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(80);
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("cut");
  const [result, setResult] = useState(null);

  if (!showCalculator) return null;

  const calculateFitness = (e) => {
    e.preventDefault();

    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    const tdee = Math.round(bmr * parseFloat(activity));

    let targetCalories = tdee;
    if (goal === "cut") targetCalories = Math.max(1200, tdee - 500);
    if (goal === "bulk") targetCalories = tdee + 400;

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    const suggestedProtein = Math.round(weight * 2.0);

    setResult({
      targetCalories,
      tdee,
      bmi,
      suggestedProtein,
    });
  };

  const generateWaMessage = () => {
    if (!result) return "";
    return `سلام وقت بخیر، نتایج محاسبه هدف فیتنس من در سایت مجموعه:
- جنسیت: ${gender === "male" ? "آقا" : "خانم"}
- مشخصات: وزن ${weight} کیلوگرم | قد ${height} سانتی‌متر | سن ${age} سال
- کالری هدف روزانه: ${Number(result.targetCalories).toLocaleString("fa-IR")} کالری
- شاخص توده بدنی (BMI): ${Number(result.bmi).toLocaleString("fa-IR")}
- پروتئین پیشنهادی: ${Number(result.suggestedProtein).toLocaleString("fa-IR")} گرم
جهت رزرو جلسه ارزیابی تخصصی و شروع برنامه تمرینی پیام می‌دهم.`;
  };

  const waLink = result
    ? `https://wa.me/${clubData.brand?.whatsappNumber || ""}?text=${encodeURIComponent(
        generateWaMessage(),
      )}`
    : "#";

  return (
    <section
      id="calculator"
      dir="rtl"
      className="py-24 bg-dark-900 border-t border-neutral-800/80 relative overflow-hidden font-vazir"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{calculator.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {calculator.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {calculator.subtitle}
          </p>
        </div>

        <div className="bg-dark-850/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={calculateFitness} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 text-right">
                {calculator.genderLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    gender === "male"
                      ? "bg-gold-500 text-dark-950 border-gold-500 font-black shadow-lg shadow-gold-500/20"
                      : "bg-dark-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  {calculator.male}
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    gender === "female"
                      ? "bg-gold-500 text-dark-950 border-gold-500 font-black shadow-lg shadow-gold-500/20"
                      : "bg-dark-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  {calculator.female}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calculator.ageLabel}
                </label>
                <input
                  type="number"
                  min="14"
                  max="85"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calculator.heightLabel}
                </label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calculator.weightLabel}
                </label>
                <input
                  type="number"
                  min="35"
                  max="220"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 text-right"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calculator.activityLabel}
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right"
                >
                  {calculator.activityLevels?.map((act, i) => (
                    <option
                      key={i}
                      value={act.value}
                      className="bg-dark-900 text-white"
                    >
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calculator.goalLabel}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right"
                >
                  {calculator.goals?.map((g) => (
                    <option
                      key={g.id}
                      value={g.id}
                      className="bg-dark-900 text-white"
                    >
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:brightness-110 active:scale-98 transition-all duration-200 shadow-xl shadow-gold-500/20 cursor-pointer"
            >
              {calculator.calculateBtn}
            </button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-neutral-800 space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1 rounded-full">
                  {calculator.resultsBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-dark-900 p-5 rounded-2xl border border-neutral-800/90 shadow-inner">
                  <Flame className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <span className="block text-xs text-neutral-400 mb-1">
                    {calculator.caloriesLabel}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {Number(result.targetCalories).toLocaleString("fa-IR")}{" "}
                    <span className="text-xs text-neutral-400 font-normal">
                      کالری در روز
                    </span>
                  </span>
                </div>

                <div className="bg-dark-900 p-5 rounded-2xl border border-neutral-800/90 shadow-inner">
                  <Scale className="w-6 h-6 text-accent-emerald mx-auto mb-2" />
                  <span className="block text-xs text-neutral-400 mb-1">
                    {calculator.bmiLabel}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-accent-emerald">
                    {Number(result.bmi).toLocaleString("fa-IR")}
                  </span>
                </div>

                <div className="bg-dark-900 p-5 rounded-2xl border border-neutral-800/90 shadow-inner">
                  <Dumbbell className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <span className="block text-xs text-neutral-400 mb-1">
                    {calculator.proteinLabel}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ~{Number(result.suggestedProtein).toLocaleString("fa-IR")}{" "}
                    <span className="text-xs text-neutral-400 font-normal">
                      گرم در روز
                    </span>
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group transform-gpu"
                >
                  <svg
                    className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle cx="24" cy="24" r="24" fill="#25D366" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M34.6 13.4C31.8 10.6 28.1 9 24.1 9C15.8 9 9.1 15.7 9.1 24C9.1 26.6 9.8 29.2 11.1 31.5L9 39L16.8 36.9C19 38.1 21.5 38.8 24.1 38.8H24.1C32.4 38.8 39.1 32.1 39.1 23.8C39.1 19.8 37.5 16.2 34.6 13.4ZM24.1 36.3C21.9 36.3 19.7 35.7 17.8 34.6L17.3 34.3L12.7 35.5L13.9 31L13.6 30.5C12.4 28.6 11.7 26.3 11.7 24C11.7 17.2 17.3 11.6 24.1 11.6C27.4 11.6 30.5 12.9 32.8 15.2C35.1 17.5 36.4 20.6 36.4 23.9C36.4 30.7 30.9 36.3 24.1 36.3ZM30.9 27.2C30.5 27 28.7 26.1 28.4 26C28.1 25.9 27.8 25.8 27.6 26.2C27.3 26.6 26.6 27.4 26.4 27.7C26.2 27.9 26 28 25.6 27.8C25.2 27.6 24.1 27.2 22.7 26C21.6 25 20.9 23.8 20.7 23.4C20.5 23 20.7 22.8 20.9 22.6C21.1 22.4 21.3 22.1 21.5 21.9C21.7 21.7 21.8 21.5 21.9 21.3C22 21.1 22 20.9 21.9 20.7C21.8 20.5 21.1 18.9 20.9 18.2C20.6 17.5 20.3 17.6 20.1 17.6H19.5C19.3 17.6 18.9 17.7 18.6 18C18.3 18.3 17.4 19.1 17.4 20.8C17.4 22.5 18.6 24.1 18.8 24.3C19 24.5 21.3 28.1 24.8 29.6C25.6 30 26.3 30.2 26.8 30.4C27.7 30.7 28.5 30.6 29.1 30.5C29.8 30.4 31.2 29.6 31.5 28.8C31.8 28 31.8 27.3 31.7 27.2C31.6 27.3 31.3 27.4 30.9 27.2Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                  <span>{calculator.sendWhatsappBtn}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
