"use client";

import { useState, useEffect } from "react";
import { clubData } from "../config/clubData.js";
import {
  Calculator,
  Flame,
  Scale,
  Dumbbell,
  Sparkles,
  Utensils,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

export default function FitnessCalculator({ onSelectClassFromCalc }) {
  const showCalculator = Boolean(clubData.features?.showCalculator);
  const calcData = clubData.calculator || {};

  const initialClasses = clubData.schedule?.classes || [];
  const [classesList, setClassesList] = useState(initialClasses);

  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(23);
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(60);
  const [activity, setActivity] = useState(
    calcData.activityLevels?.[2]?.value || "1.55",
  );
  const [goal, setGoal] = useState("bulk");
  const [dietCommitment, setDietCommitment] = useState(
    calcData.dietOptions?.[0]?.id || "pro",
  );
  const [selectedClassId, setSelectedClassId] = useState(
    initialClasses[0]?.id ? String(initialClasses[0].id) : "",
  );
  const [result, setResult] = useState(null);

  // واکشی داده‌های زنده کلاس‌ها بدون رندرهای آبشاری
  useEffect(() => {
    let isMounted = true;
    async function loadLiveClasses() {
      try {
        const res = await fetch("/api/schedule");
        if (res.ok) {
          const data = await res.json();
          if (
            Array.isArray(data.classes) &&
            data.classes.length > 0 &&
            isMounted
          ) {
            setClassesList(data.classes);
            setSelectedClassId(
              (prev) => prev || String(data.classes[0].id || "1"),
            );
          }
        }
      } catch (err) {
        console.error("خطا در بارگذاری کلاس‌های زنده:", err);
      }
    }

    loadLiveClasses();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!showCalculator) return null;

  // ضرایب ماهیت کلاس ورزشی
  const getClassMultipliers = (classItem) => {
    if (!classItem)
      return { muscle: 1.0, burn: 1.0, typeLabel: "تمرینات عمومی" };
    const title = (classItem.title || "").toLowerCase();

    if (
      title.includes("بدنسازی") ||
      title.includes("وزنه") ||
      title.includes("قدرت") ||
      title.includes("فیتنس")
    ) {
      return {
        muscle: 1.35,
        burn: 1.05,
        typeLabel: "تمرکز بر هایپرتروفی و افزایش فیبر عضلانی",
      };
    }

    if (
      title.includes("کراس") ||
      title.includes("hiit") ||
      title.includes("سرعت") ||
      title.includes("هوازی")
    ) {
      return {
        muscle: 0.95,
        burn: 1.45,
        typeLabel: "تمرکز بر توان هوازی و ماکزیمم چربی‌سوزی",
      };
    }

    if (
      title.includes("پیلاتس") ||
      title.includes("یوگا") ||
      title.includes("اصلاح") ||
      title.includes("فرم‌دهی")
    ) {
      return {
        muscle: 0.72,
        burn: 0.88,
        typeLabel: "تمرکز بر تقویت عضلات مرکزی (Core) و انعطاف",
      };
    }

    return {
      muscle: 1.0,
      burn: 1.0,
      typeLabel: "تمرینات ترکیبی آمادگی جسمانی",
    };
  };

  const calculateFitness = (e) => {
    e.preventDefault();

    // ۱. پارس عددی امن اینپوت‌ها برای جلوگیری از بروز NaN
    const numWeight = Number(weight) || 70;
    const numHeight = Number(height) || 175;
    const numAge = Number(age) || 25;
    const actVal = parseFloat(activity) || 1.55;

    // ۲. BMR و TDEE پایه
    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * actVal);

    const heightInMeters = numHeight / 100;
    const initialBmi = (numWeight / (heightInMeters * heightInMeters)).toFixed(
      1,
    );

    // ۳. کلاس فعال و ضرایب تمرینی
    const activeClass =
      classesList.find((c) => String(c.id) === String(selectedClassId)) ||
      classesList[0];
    const classMetrics = getClassMultipliers(activeClass);

    // ۴. ضریب بسامد تمرین (تعداد روزهای حضور در باشگاه)
    // 1.2: پشت میز نشین | 1.375: ۱-۳ روز | 1.55: ۳-۵ روز | 1.725: ۶-۷ روز
    let activityMultiplier = 1.0;
    if (actVal <= 1.25) {
      activityMultiplier = 0.65; // حضور نداشتن در باشگاه یا حداقل فعالیت
    } else if (actVal <= 1.45) {
      activityMultiplier = 0.85; // ۱ تا ۳ روز در هفته
    } else if (actVal <= 1.65) {
      activityMultiplier = 1.12; // ۳ تا ۵ روز منظم
    } else {
      activityMultiplier = 1.38; // ۶ تا ۷ روز فشرده
    }

    // ۵. ضریب پایبندی به رژیم غذایی
    const dietMultiplier =
      dietCommitment === "pro"
        ? 1.35
        : dietCommitment === "standard"
          ? 0.95
          : 0.45;

    let baseMinGainOrLoss = 0;
    let baseMaxGainOrLoss = 0;
    let targetCalories = tdee;

    if (goal === "bulk") {
      const isSkinny = parseFloat(initialBmi) < 20;
      targetCalories = dietCommitment === "pro" ? tdee + 650 : tdee + 400;

      const bulkBase = isSkinny ? 3.4 : 2.5;
      baseMinGainOrLoss =
        bulkBase * dietMultiplier * classMetrics.muscle * activityMultiplier;
      baseMaxGainOrLoss =
        (bulkBase + 2.2) *
        dietMultiplier *
        classMetrics.muscle *
        activityMultiplier;
    } else if (goal === "cut") {
      targetCalories =
        dietCommitment === "pro"
          ? Math.max(1250, tdee - 650)
          : Math.max(1350, tdee - 450);
      const isOverweight = parseFloat(initialBmi) > 26;

      const cutBase = isOverweight ? 3.8 : 2.6;
      baseMinGainOrLoss =
        cutBase * dietMultiplier * classMetrics.burn * activityMultiplier;
      baseMaxGainOrLoss =
        (cutBase + 2.4) *
        dietMultiplier *
        classMetrics.burn *
        activityMultiplier;
    } else {
      targetCalories = tdee;
      baseMinGainOrLoss =
        1.0 * dietMultiplier * classMetrics.muscle * activityMultiplier;
      baseMaxGainOrLoss =
        2.0 * dietMultiplier * classMetrics.muscle * activityMultiplier;
    }

    const minDelta = Math.max(0.5, baseMinGainOrLoss).toFixed(1);
    const maxDelta = Math.max(1.1, baseMaxGainOrLoss).toFixed(1);
    const avgDelta = (parseFloat(minDelta) + parseFloat(maxDelta)) / 2;

    const projectedWeight =
      goal === "cut"
        ? (numWeight - avgDelta).toFixed(1)
        : (numWeight + avgDelta).toFixed(1);

    const projectedBmi = (
      projectedWeight /
      (heightInMeters * heightInMeters)
    ).toFixed(1);

    const suggestedProtein =
      goal === "bulk"
        ? Math.round(numWeight * 2.2 * (classMetrics.muscle > 1 ? 1.05 : 0.95))
        : Math.round(numWeight * 1.9);

    const isStrength = classMetrics.muscle > 1.1;
    const isCardio = classMetrics.burn > 1.2;

    const milestones = [
      {
        week: 2,
        title: "هفته دوم: فاز سازگاری اولیه",
        projectedW:
          goal === "cut"
            ? (numWeight - avgDelta * 0.22).toFixed(1)
            : (numWeight + avgDelta * 0.22).toFixed(1),
        note: isStrength
          ? "افزایش اشتها، پمپاژ خون به عضلات و جذب گلیکوژن"
          : isCardio
            ? "دفع سریع احتباس آب زیرپوستی و ارتقای ظرفیت تنفسی"
            : "بهبود فرم ستون فقرات و انعطاف مفاصل",
      },
      {
        week: 4,
        title: "هفته چهارم: فاز تثبیت متابولیک",
        projectedW:
          goal === "cut"
            ? (numWeight - avgDelta * 0.48).toFixed(1)
            : (numWeight + avgDelta * 0.48).toFixed(1),
        note: isStrength
          ? "افزایش رکورد وزنه‌ها و شروع پر شدن بافت عضلات"
          : isCardio
            ? "کاهش مشهود سایز دور شکم و افزایش توان بی‌هوازی"
            : "سفت شدن عضلات عمقی شکم و فرم‌گیری بالاتنه",
      },
      {
        week: 6,
        title: "هفته ششم: فاز نمایان شدن تغییرات",
        projectedW:
          goal === "cut"
            ? (numWeight - avgDelta * 0.74).toFixed(1)
            : (numWeight + avgDelta * 0.74).toFixed(1),
        note: isStrength
          ? "تفکیک خطوط سرشانه، بازو و سینه با تراکم بالای عضلانی"
          : isCardio
            ? "کاهش چشمگیر چربی احشایی و باریک شدن دور کمر"
            : "کاهش انحرافات پاسچر بدنی و بالا آمدن استقامت ایزومتریک",
      },
      {
        week: 8,
        title: "هفته هشتم: اوج نتیجه و تثبیت نهایی",
        projectedW: projectedWeight,
        note: isStrength
          ? "تثبیت وزن عضلانی ماندگار و ارتقای چشمگیر قدرت فیزیکی"
          : isCardio
            ? "رسیدن به درصد چربی تک‌رقمی/ایده‌آل و بیشترین تفکیک عضلانی"
            : "فرم‌دهی کامل بدن با کنترل عالی تعادل و کشیدگی عضلات",
      },
    ];

    setResult({
      targetCalories,
      tdee,
      bmi: initialBmi,
      suggestedProtein,
      activeClass,
      classMetrics,
      minDelta,
      maxDelta,
      projectedWeight,
      projectedBmi,
      milestones,
    });
  };

  const generateWaMessage = () => {
    if (!result) return "";
    const classNameStr = result.activeClass?.title || "کلاس تخصصی باشگاه";
    const trainerNameStr = result.activeClass?.trainer || "مربی مجموعه";

    const currentGoalLabel =
      calcData.goals?.find((g) => g.id === goal)?.label || goal;
    const currentDietLabel =
      calcData.dietOptions?.find((d) => d.id === dietCommitment)?.label ||
      dietCommitment;

    return `سلام و وقت بخیر، مایل به ثبت‌نام و دریافت برنامه دوره ۸ هفته‌ای هستم:
- کلاس انتخابی: ${classNameStr} (مربی: ${trainerNameStr})
- مشخصات من: وزن ${weight} kg | قد ${height} cm | سن ${age} سال
- هدف ورزشی: ${currentGoalLabel}
- سطح تغذیه: ${currentDietLabel}
- پیش‌بینی تحول ۸ هفته‌ای: ${result.minDelta} تا ${result.maxDelta} کیلوگرم تغییر وزن
- کالری روزانه پیشنهادی: ${Number(result.targetCalories).toLocaleString("fa-IR")} کالری
جهت رزرو صندلی و تنظیم زمان ارزیابی حضوری پیام می‌دهم.`;
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
            <span>{calcData.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {calcData.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {calcData.subtitle}
          </p>
        </div>

        <div className="bg-dark-850/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={calculateFitness} className="space-y-6">
            {/* انتخاب جنسیت */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 text-right">
                {calcData.genderLabel}
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
                  {calcData.male}
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
                  {calcData.female}
                </button>
              </div>
            </div>

            {/* ورودی سن، قد و وزن با پشتیبانی کامل تایپ و حذف استپرهای موبایل */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.ageLabel || "سن (سال)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={age ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setAge(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۲۴"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    سال
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.heightLabel || "قد (سانتی‌متر)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={height ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setHeight(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۱۸۰"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.weightLabel || "وزن فعلی (کیلوگرم)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={weight ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setWeight(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۷۵"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* فعالیت، هدف و برنامه غذایی */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.activityLabel}
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right"
                >
                  {calcData.activityLevels?.map((act, i) => (
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
                  {calcData.goalLabel}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right"
                >
                  {calcData.goals?.map((g) => (
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

              <div>
                <label className="text-xs font-bold text-gold-400 mb-1.5 text-right flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    {calcData.dietLabel || "برنامه و رژیم غذایی"}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {calcData.dietSubtext || "عامل کلیدی"}
                  </span>
                </label>
                <select
                  value={dietCommitment}
                  onChange={(e) => setDietCommitment(e.target.value)}
                  className="w-full bg-dark-800 border border-gold-500/40 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right font-medium"
                >
                  {calcData.dietOptions?.map((d) => (
                    <option
                      key={d.id}
                      value={d.id}
                      className="bg-dark-900 text-white"
                    >
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* کلاس انتخابی باشگاه */}
            <div>
              <label className="text-xs font-bold text-neutral-300 mb-1.5 text-right flex items-center justify-between">
                <span>{calcData.classLabel || "کلاس مدنظر شما در باشگاه"}</span>
                <span className="text-[10px] text-gold-400 font-normal">
                  تأثیر مستقیم بر نوع و میزان بافت عضله یا چربی
                </span>
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-500 cursor-pointer text-right"
              >
                {classesList.length > 0 ? (
                  classesList.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-dark-900 text-white"
                    >
                      {c.title} — (مربی: {c.trainer})
                    </option>
                  ))
                ) : (
                  <option value="default" className="bg-dark-900 text-white">
                    {calcData.defaultClassOption || "کلاس‌های تخصصی باشگاه"}
                  </option>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-sm font-black text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:brightness-110 active:scale-98 transition-all duration-200 shadow-xl shadow-gold-500/20 cursor-pointer"
            >
              {calcData.calculateBtn}
            </button>
          </form>

          {/* کارت نمایش نتایج شبیه‌سازی و نقشه راه تفکیک شده */}
          {result && (
            <div className="mt-10 pt-10 border-t border-neutral-800 space-y-8 animate-fadeIn">
              <div className="bg-gradient-to-br from-gold-500/10 via-dark-900 to-dark-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800/80">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-400 text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      {calcData.resultsBadge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      کلاس:{" "}
                      <span className="text-gold-400">
                        {result.activeClass?.title || "کلاس انتخابی"}
                      </span>{" "}
                      <span className="text-neutral-400 text-sm font-normal">
                        ({result.activeClass?.trainer || "مربی تخصصی"})
                      </span>
                    </h3>
                    <p className="text-xs text-accent-emerald mt-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>{result.classMetrics?.typeLabel}</span>
                    </p>
                  </div>

                  <div className="text-start sm:text-end">
                    <span className="text-xs text-neutral-400 block mb-1">
                      {calcData.projectedWeightLabel}:
                    </span>
                    <div className="flex items-center sm:justify-end gap-2">
                      {goal === "bulk" ? (
                        <TrendingUp className="w-6 h-6 text-accent-emerald" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-gold-400" />
                      )}
                      <span className="text-2xl sm:text-3xl font-black text-white font-english">
                        ~
                        {Number(result.projectedWeight).toLocaleString("fa-IR")}{" "}
                        <span className="text-xs text-neutral-400 font-vazir">
                          {calcData.weightUnit}
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-gold-400 font-semibold block mt-1">
                      (
                      {calcData.weightChangeRangeText
                        ?.replace("{min}", result.minDelta)
                        .replace("{max}", result.maxDelta) ||
                        `تغییر بین ${result.minDelta} تا ${result.maxDelta} کیلوگرم`}
                      )
                    </span>
                  </div>
                </div>

                {/* نقشه راه ۴ فازه */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                    {calcData.roadmapTitle}:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {result.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          idx === 3
                            ? "bg-gold-500/10 border-gold-500/40 ring-1 ring-gold-500/20"
                            : "bg-dark-950/60 border-neutral-800"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[11px] font-black text-gold-400">
                              {ms.title}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          </div>

                          <div className="text-xl font-black text-white font-english mb-2">
                            {Number(ms.projectedW).toLocaleString("fa-IR")}{" "}
                            <span className="text-xs text-neutral-400 font-vazir">
                              {calcData.weightUnit}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-300 leading-relaxed">
                            {ms.note}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-english">
                          {calcData.milestonePhasePrefix?.replace(
                            "{week}",
                            ms.week,
                          ) || `هفته ${ms.week} از 8`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* شاخص‌های بیومتریک و تغذیه */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-dark-850 p-3.5 rounded-xl border border-neutral-800">
                    <span className="block text-[11px] text-neutral-400 mb-1">
                      {calcData.bmiLabel}
                    </span>
                    <span className="text-base font-black text-neutral-200">
                      {result.bmi}
                    </span>
                  </div>
                  <div className="bg-dark-850 p-3.5 rounded-xl border border-gold-500/30">
                    <span className="block text-[11px] text-gold-400 mb-1">
                      {calcData.targetBmiLabel}
                    </span>
                    <span className="text-base font-black text-gold-400">
                      {result.projectedBmi}
                    </span>
                  </div>
                  <div className="bg-dark-850 p-3.5 rounded-xl border border-neutral-800">
                    <span className="block text-[11px] text-neutral-400 mb-1">
                      {calcData.caloriesLabel}
                    </span>
                    <span className="text-base font-black text-accent-emerald font-english">
                      {Number(result.targetCalories).toLocaleString("fa-IR")}{" "}
                      <span className="text-[10px] text-neutral-400 font-vazir">
                        kcal
                      </span>
                    </span>
                  </div>
                  <div className="bg-dark-850 p-3.5 rounded-xl border border-neutral-800">
                    <span className="block text-[11px] text-neutral-400 mb-1">
                      {calcData.proteinLabel}
                    </span>
                    <span className="text-base font-black text-white">
                      ~{Number(result.suggestedProtein).toLocaleString("fa-IR")}{" "}
                      <span className="text-[10px] text-neutral-400 font-vazir">
                        گرم
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* اکشن‌های رزرو صندلی و واتس‌اپ */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#schedule"
                  onClick={() => {
                    if (onSelectClassFromCalc && result.activeClass) {
                      onSelectClassFromCalc(result.activeClass);
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-black text-xs sm:text-sm shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>
                    {calcData.bookClassBtnText?.replace(
                      "{title}",
                      result.activeClass?.title || "",
                    ) ||
                      `رزرو صندلی در کلاس ${result.activeClass?.title || ""}`}
                  </span>
                </a>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/25 transition-all cursor-pointer"
                >
                  <span>{calcData.sendWhatsappBtn}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
