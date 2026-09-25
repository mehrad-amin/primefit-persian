"use client";

import { useState } from "react";
import { clubData } from "../config/clubData.js";
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
  Dumbbell,
  UserCheck,
  CreditCard,
  Building2,
  UserPlus,
} from "lucide-react";

export default function Footer({ selectedBookings = {}, onClearBooking }) {
  const defaultBranch = clubData.branches?.[0];

  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: clubData.countryPhoneCodes?.[0]?.dialCode || "+98",
    phone: "",
    goal: "چربی‌سوزی و کات عضلانی",
    selectedBranch: defaultBranch?.name || "شعبه مرکزی - الهیه",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    isWaitlist: false,
    error: null,
  });

  const [waitlistPrompt, setWaitlistPrompt] = useState(null);

  const currentPlan = selectedBookings?.plan || null;
  const currentTrainer = selectedBookings?.trainer || null;
  const currentClass =
    selectedBookings?.classItem || selectedBookings?.class || null;

  const hasAnyBadge = Boolean(currentPlan || currentTrainer || currentClass);

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, phone: rawValue }));
  };

  const executeSubmission = async (joinWaitlist = false) => {
    setStatus({
      loading: true,
      success: false,
      isWaitlist: false,
      error: null,
    });

    if (
      formData.phone.trim().length < 10 ||
      formData.phone.trim().length > 11
    ) {
      setStatus({
        loading: false,
        success: false,
        isWaitlist: false,
        error: "لطفاً یک شماره موبایل معتبر (۱۰ یا ۱۱ رقمی) وارد نمایید.",
      });
      return;
    }

    // تایم‌اوت محافظ برای جلوگیری از قفل شدن ورکر یا کلاینت
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const payload = {
        ...formData,
        fullPhoneNumber: `${formData.countryCode}${formData.phone}`,
        joinWaitlist,
        bookings: {
          plan: currentPlan ? currentPlan.title || currentPlan.name : null,
          planPrice: currentPlan?.price || null,
          trainer: currentTrainer
            ? currentTrainer.title || currentTrainer.name
            : null,
          classSession: currentClass ? currentClass.title : null,
          classId: currentClass?.id || null,
          classTime: currentClass?.time || null,
        },
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await res.json();

      if (result.status === "CLASS_FULL") {
        setWaitlistPrompt({
          message:
            "ظرفیت این سانس تکمیل شده است. آیا تمایل دارید در لیست انتظار ثبت‌نام کنید تا به محض خالی شدن جایگاه با شما هماهنگ شود؟",
        });
        setStatus({
          loading: false,
          success: false,
          isWaitlist: false,
          error: null,
        });
        return;
      }

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message ||
            "خطایی در ثبت اطلاعات رخ داد. لطفاً مجدداً تلاش کنید یا از طریق پیام‌رسان با ما در ارتباط باشید.",
        );
      }

      setStatus({
        loading: false,
        success: true,
        isWaitlist: result.status === "WAITLIST_CONFIRMED",
        error: null,
      });

      setWaitlistPrompt(null);
      setFormData({
        fullName: "",
        countryCode: clubData.countryPhoneCodes?.[0]?.dialCode || "+98",
        phone: "",
        goal: "چربی‌سوزی و کات عضلانی",
        selectedBranch: defaultBranch?.name || "شعبه مرکزی - الهیه",
      });

      if (onClearBooking) {
        onClearBooking("plan");
        onClearBooking("trainer");
        onClearBooking("classItem");
        onClearBooking("class");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus({
        loading: false,
        success: false,
        isWaitlist: false,
        error:
          err.name === "AbortError"
            ? "زمان اتصال به سرور به پایان رسید. لطفاً مجدداً تلاش نمایید."
            : err.message,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSubmission(false);
  };

  const currentYear = new Date().getFullYear();
  const waContactUrl = `https://wa.me/${clubData.brand?.whatsappNumber || ""}?text=${encodeURIComponent(
    clubData.brand?.defaultWaMessage || "",
  )}`;

  return (
    <footer
      dir="rtl"
      className="bg-dark-950 border-t border-neutral-800/80 relative overflow-hidden select-none pb-28 sm:pb-24 font-vazir"
    >
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* فرم ثبت درخواست لید */}
      <section id="lead-capture" className="py-20 relative z-10 scroll-mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-dark-900 to-dark-850 border border-neutral-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-right">
            {/* تیتر فرم */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ثبت‌نام و رزرو اولیه اشتراک</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                ثبت رزرو و آغاز تجربه تمرین در پرایم فیت
              </h2>
              <p className="mt-3 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                اطلاعات خود را وارد کنید؛ کارشناسان پذیرش مجموعه در کوتاه‌ترین
                زمان جهت هماهنگی جلسه حضوری و صدور کارت ورود با شما تماس
                می‌گیرند.
              </p>
            </div>

            {/* بج‌های انتخابی هوشمند */}
            {hasAnyBadge && (
              <div className="mb-8 p-4 rounded-2xl bg-dark-950/80 border border-gold-500/30 space-y-2.5">
                <div className="text-xs font-bold text-gold-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>جزئیات درخواست انتخاب‌شده شما:</span>
                </div>

                {currentPlan && (
                  <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-gold-400 shrink-0" />
                      <span className="px-2 py-0.5 rounded bg-gold-500 text-dark-950 text-[10px] font-black uppercase">
                        پلن عضویت
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {currentPlan.title || currentPlan.name}
                      </span>
                      {currentPlan.price && (
                        <span className="text-gold-400 text-xs">
                          ({currentPlan.price})
                        </span>
                      )}
                    </div>
                    {onClearBooking && (
                      <button
                        type="button"
                        onClick={() => onClearBooking("plan")}
                        className="p-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {currentTrainer && (
                  <div className="p-3 rounded-xl bg-dark-850 border border-neutral-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-neutral-300 shrink-0" />
                      <span className="px-2 py-0.5 rounded bg-neutral-200 text-dark-950 text-[10px] font-black uppercase">
                        مربی اختصاصی
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {currentTrainer.title || currentTrainer.name}
                      </span>
                    </div>
                    {onClearBooking && (
                      <button
                        type="button"
                        onClick={() => onClearBooking("trainer")}
                        className="p-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {currentClass && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Dumbbell className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="px-2 py-0.5 rounded bg-purple-500 text-white text-[10px] font-black uppercase">
                        سانس تمرینی
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {currentClass.title}
                      </span>
                      {currentClass.time && (
                        <span className="text-purple-300 text-xs">
                          ({currentClass.time})
                        </span>
                      )}
                    </div>
                    {onClearBooking && (
                      <button
                        type="button"
                        onClick={() => {
                          onClearBooking("classItem");
                          onClearBooking("class");
                        }}
                        className="p-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* نتیجه ثبت موفقیت‌آمیز یا فرم ورودی */}
            {status.success ? (
              <div
                className={`p-8 rounded-2xl border text-center space-y-3 ${
                  status.isWaitlist
                    ? "bg-amber-950/40 border-amber-800"
                    : "bg-emerald-950/40 border-emerald-800"
                }`}
              >
                <CheckCircle2
                  className={`w-12 h-12 mx-auto transform-gpu ${
                    status.isWaitlist ? "text-amber-400" : "text-emerald-400"
                  }`}
                />
                <h3 className="text-lg font-bold text-white">
                  {status.isWaitlist
                    ? "درخواست شما با موفقیت در لیست انتظار ثبت شد! ⏳"
                    : "درخواست رزرو شما با موفقیت دریافت گردید!"}
                </h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {status.isWaitlist
                    ? "اطلاعات شما برای این سانس در صف اولویت قرار گرفت. به محض ایجاد ظرفیت جدید، از طریق پیام‌رسان یا تماس به شما اطلاع داده خواهد شد."
                    : "از انتخاب پرایم فیت سپاسگزاریم. جزئیات درخواست برای کارشناسان ارسال شد و جهت نهایی‌سازی ثبت‌نام و مشاوره اولیه با شما ارتباط برقرار خواهد شد."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {status.error && (
                  <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{status.error}</span>
                  </div>
                )}

                {waitlistPrompt && (
                  <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 space-y-3">
                    <div className="flex items-start gap-2.5 text-amber-300 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{waitlistPrompt.message}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={status.loading}
                        onClick={() => executeSubmission(true)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>بله، در لیست انتظار ثبت‌نام کن</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaitlistPrompt(null)}
                        className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: علی محمدی"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-dark-800/90 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                      هدف ورزشی اصلی *
                    </label>
                    <select
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                      className="w-full bg-dark-800/90 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors cursor-pointer text-right"
                    >
                      <option value="چربی‌سوزی و کات عضلانی">
                        چربی‌سوزی، کات و تناسب فرم بدنی
                      </option>
                      <option value="عضله‌سازی و افزایش حجم">
                        عضله‌سازی، هایپرتروفی و افزایش قدرت
                      </option>
                      <option value="بهبود آمادگی جسمانی">
                        ارتقای استقامت، چابکی و سلامت عمومی
                      </option>
                      <option value="سالن اختصاصی بانوان">
                        عضویت اختصاصی سالن بانوان (۱۰۰٪ مستقل)
                      </option>
                      <option value="پیلاتس و ریکاوری">
                        پیلاتس ریفورمر، اصلاح وضعیت و ریکاوری
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                      شماره موبایل (دارای واتس‌اپ یا بله) *
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-neutral-700 focus-within:border-gold-500 transition-colors">
                      <select
                        value={formData.countryCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countryCode: e.target.value,
                          })
                        }
                        aria-label="پیش‌شماره کشور"
                        className="bg-dark-800 text-neutral-200 text-xs px-3 py-3.5 border-e border-neutral-700 focus:outline-none cursor-pointer shrink-0"
                      >
                        {clubData.countryPhoneCodes?.map((c) => (
                          <option
                            key={c.code}
                            value={c.dialCode}
                            className="bg-dark-900 text-white"
                          >
                            {c.flag} {c.dialCode}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        required
                        placeholder="09120000000"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={11}
                        className="w-full bg-dark-800/90 px-4 py-3.5 text-white text-sm focus:outline-none tracking-wider text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                      انتخاب شعبه مورد نظر *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.selectedBranch}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            selectedBranch: e.target.value,
                          })
                        }
                        className="w-full bg-dark-800/90 border border-neutral-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors cursor-pointer appearance-none pe-10 text-right"
                      >
                        {clubData.branches?.map((branch) => (
                          <option
                            key={branch.id}
                            value={branch.name}
                            className="bg-dark-900 text-white"
                          >
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute top-1/2 end-3.5 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <Building2 className="w-4 h-4 text-gold-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {!waitlistPrompt && (
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:brightness-110 active:scale-98 transition-all duration-200 shadow-xl shadow-gold-500/20 cursor-pointer disabled:opacity-50 transform-gpu"
                  >
                    {status.loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ثبت‌نام و رزرو اولیه اشتراک</span>
                        <Send className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                )}

                <p className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>
                    اطلاعات شما کاملاً محرمانه بوده و صرفاً جهت هماهنگی عضویت در
                    باشگاه پرایم فیت استفاده خواهد شد.
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* بخش پایینی فوتر */}
      <div className="border-t border-neutral-800/80 py-16 text-neutral-400 text-xs relative z-10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-950 font-black text-lg">
                  PF
                </div>
                <span className="font-extrabold text-base text-white">
                  {clubData.brand?.nameFa}
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-xs">
                {clubData.brand?.slogan} — اکوسیستم تمرینی ممتاز با برترین
                تجهیزات استانداردهای جهانی و بالاترین سطح آرامش و حریم خصوصی.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>ساعات فعالیت مجموعه</span>
              </h4>
              <p className="text-neutral-300 leading-relaxed text-xs">
                {clubData.brand?.workingHours}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>موقعیت و آدرس</span>
              </h4>
              <p className="text-neutral-300 leading-relaxed text-xs">
                {clubData.brand?.locationAddress}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="text-neutral-200">
                  {clubData.brand?.phone}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>مشاوره و پذیرش آنلاین</span>
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs">
                جهت دریافت پاسخ سریع، مشاوره تخصصی و رزرو سانس با کارشناسان ما
                گفتگو کنید.
              </p>
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-dark-950 font-bold transition-all text-xs"
              >
                <span>گفتگو در پیام‌رسان</span>
              </a>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>
              © {currentYear} {clubData.brand?.nameFa}. تمامی حقوق برای این
              مجموعه محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
