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
  const [selectedClassId, setSelectedClassId] = useState("");
  const [result, setResult] = useState(null);

  // واکشی لایو کلاس‌ها
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
            if (!selectedClassId) {
              setSelectedClassId(data.classes[0].id || "1");
            }
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

  useEffect(() => {
    if (!selectedClassId && classesList.length > 0) {
      setSelectedClassId(classesList[0].id || "1");
    }
  }, [classesList, selectedClassId]);

  if (!showCalculator) return null;

  // محاسبه ضرایب تأثیر فیزیولوژیک کلاس ورزشی
  const getClassMultipliers = (classItem) => {
    if (!classItem)
      return { muscle: 1.0, burn: 1.0, typeLabel: "تمرینات عمومی" };
    const title = (classItem.title || "").toLowerCase();

    // ۱. تمرینات هایپرتروفی و مقاومتی (بدنسازی با وزنه، فیتنس قدرتی)
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

    // ۲. تمرینات سرعتی، چربی‌سوزی بالا و کراس‌فیت (HIIT)
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

    // ۳. پیلاتس، یوگا، حرکات اصلاحی و انعطاف‌پذیری
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

    // پارس امن مقادیر ورودی به عدد همراه با فال‌بک پیش‌فرض
    const numWeight = Number(weight) || 70;
    const numHeight = Number(height) || 175;
    const numAge = Number(age) || 25;

    // ۱. BMR و TDEE پایه بر اساس اعداد تمیز
    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * parseFloat(activity));

    const heightInMeters = numHeight / 100;
    const initialBmi = (numWeight / (heightInMeters * heightInMeters)).toFixed(
      1,
    );

    // ۲. دریافت کلاس فعال و ضرایب اختصاصی آن
    const activeClass =
      classesList.find((c) => String(c.id) === String(selectedClassId)) ||
      classesList[0];
    const classMetrics = getClassMultipliers(activeClass);

    // ۳. ضریب پایبندی به رژیم غذایی
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

      // کلاس بدنسازی ماکزیمم حجم را ایجاد می‌کند، پیلاتس حجم کمتر و متمرکز بر فرم‌دهی
      const bulkBase = isSkinny ? 3.6 : 2.6;
      baseMinGainOrLoss = bulkBase * dietMultiplier * classMetrics.muscle;
      baseMaxGainOrLoss =
        (bulkBase + 2.4) * dietMultiplier * classMetrics.muscle;
    } else if (goal === "cut") {
      targetCalories =
        dietCommitment === "pro"
          ? Math.max(1250, tdee - 650)
          : Math.max(1350, tdee - 450);
      const isOverweight = parseFloat(initialBmi) > 26;

      // کراس‌فیت و تمرینات سرعتی چربی‌سوزی را شتاب می‌دهند
      const cutBase = isOverweight ? 4.2 : 2.8;
      baseMinGainOrLoss = cutBase * dietMultiplier * classMetrics.burn;
      baseMaxGainOrLoss = (cutBase + 2.5) * dietMultiplier * classMetrics.burn;
    } else {
      targetCalories = tdee;
      baseMinGainOrLoss = 1.0 * dietMultiplier * classMetrics.muscle;
      baseMaxGainOrLoss = 2.0 * dietMultiplier * classMetrics.muscle;
    }

    const minDelta = Math.max(0.6, baseMinGainOrLoss).toFixed(1);
    const maxDelta = Math.max(1.2, baseMaxGainOrLoss).toFixed(1);
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

    // توضیحات هوشمند بر اساس نوع کلاس
    const isStrength = classMetrics.muscle > 1.1;
    const isCardio = classMetrics.burn > 1.2;

    const milestones = [
      {
        week: 2,
        title: "هفته دوم: فاز سازگاری عضلانی",
        projectedW:
          goal === "cut"
            ? (numWeight - avgDelta * 0.22).toFixed(1)
            : (numWeight + avgDelta * 0.22).toFixed(1),
        note: isStrength
          ? "افزایش اشتها، پمپاژ بیشتر خون به عضلات و جذب گلیکوژن"
          : isCardio
            ? "دفع سریع احتباس آب زیرپوستی و افزایش ظرفیت ریوی"
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
          ? "افزایش رکورد وزنه‌ها و شروع پر شدن و هایپرتروفی عضلات"
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
          ? "تفکیک خطوط سرشانه، بازو و سینه با تراکم بالای بافت عضلانی"
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

            {/* ورودی سن، قد و وزن */}
            {/* ورودی سن، قد و وزن — بهینه‌شده برای موبایل بدون حالت شمارنده */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* سن */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.ageLabel || "سن (سال)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={age || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setAge(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۲۴"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    سال
                  </span>
                </div>
              </div>

              {/* قد */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.heightLabel || "قد (سانتی‌متر)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={height || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setHeight(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۱۸۰"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    cm
                  </span>
                </div>
              </div>

              {/* وزن */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right">
                  {calcData.weightLabel || "وزن فعلی (کیلوگرم)"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={weight || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setWeight(val === "" ? "" : Number(val));
                    }}
                    placeholder="مثلاً ۷۵"
                    className="w-full bg-dark-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-gold-500 text-center font-english [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none font-vazir">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* سه عامل کلیدی: فعالیت، هدف و تغذیه */}
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
                <label className="block text-xs font-bold text-gold-400 mb-1.5 text-right flex items-center justify-between">
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
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 text-right flex items-center justify-between">
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
                          ) || `هفته ${ms.week} از ۸`}
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

              {/* اکشن‌های رزرو صندلی و مشاوره واتس‌اپ */}
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
