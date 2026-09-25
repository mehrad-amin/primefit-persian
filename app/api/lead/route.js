import { NextResponse } from "next/server";
import { getLocalClubTime } from "@/src/lib/dateUtils.js";

async function resolveEnvironmentVariables() {
  let cfEnv = {};
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    if (ctx && ctx.env) cfEnv = ctx.env;
  } catch (e) {}

  return {
    GOOGLE_SHEET_WEBHOOK_URL:
      cfEnv.GOOGLE_SHEET_WEBHOOK_URL ||
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      "",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      countryCode,
      phone,
      goal,
      selectedBranch,
      bookings = {},
      joinWaitlist = false,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "نام و نام خانوادگی و شماره موبایل الزامی است.",
        },
        { status: 400 },
      );
    }

    const cleanCountryCode = countryCode
      ? countryCode.replace("+", "").trim()
      : "98";
    const cleanPhone = phone.replace(/^0+/, "").replace(/\s+/g, "").trim();
    const fullInternationalPhone = `${cleanCountryCode}${cleanPhone}`;

    const defaultGreeting = `سلام ${fullName} عزیز، از پذیرش مجموعه ورزشی پرایم فیت جهت هماهنگی جلسه ارزیابی و اشتراک در خدمت شما هستیم.`;
    const oneClickWaLink = `https://wa.me/${fullInternationalPhone}?text=${encodeURIComponent(
      defaultGreeting,
    )}`;
    const { formattedDateTime, timeZone } = getLocalClubTime(new Date());

    const selectedSummary =
      [
        bookings?.plan
          ? `پلن عضویت: ${bookings.plan} ${
              bookings.planPrice ? `(${bookings.planPrice})` : ""
            }`
          : null,
        bookings?.trainer ? `مربی اختصاصی: ${bookings.trainer}` : null,
        bookings?.classSession
          ? `سانس تمرینی: ${bookings.classSession} ${
              bookings.classTime ? `(${bookings.classTime})` : ""
            }`
          : null,
      ]
        .filter(Boolean)
        .join(" | ") || "رزرو جلسه ارزیابی و آشنایی با مجموعه";

    const env = await resolveEnvironmentVariables();
    let sheetResult = { success: true, status: "CONFIRMED" };

    // ارسال مستقیم به گوگل شیت و بررسی وضعیت
    if (env.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        // ایجاد کنترلر تایم‌اوت ۴ ثانیه‌ای برای جلوگیری از مسدود ماندن ورکر در صورت کندی گوگل
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const sheetRes = await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            timestamp: `${formattedDateTime} (${timeZone})`,
            name: fullName,
            phone: `+${fullInternationalPhone}`,
            goal: goal || "-",
            branch: selectedBranch || "-",
            reservations: selectedSummary,
            classSession: bookings?.classSession || null,
            classId: bookings?.classId || null,
            joinWaitlist: Boolean(joinWaitlist),
            whatsappLink: oneClickWaLink,
            language: "fa",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        sheetResult = await sheetRes.json();

        // اگر ظرفیت سانس پر بود، پاسخ آنی جهت پیشنهاد لیست انتظار بازمی‌گردد
        if (sheetResult.status === "CLASS_FULL") {
          return NextResponse.json(sheetResult, { status: 200 });
        }
      } catch (err) {
        console.error("Google Sheet Sync Error:", err);
      }
    }

    const isWaitlist = sheetResult.status === "WAITLIST_CONFIRMED";

    return NextResponse.json({
      success: true,
      status: sheetResult.status || "CONFIRMED",
      message: isWaitlist
        ? "درخواست شما با موفقیت در لیست انتظار ثبت شد."
        : "اطلاعات شما با موفقیت دریافت و رزرو اولیه ثبت گردید.",
    });
  } catch (error) {
    console.error("Lead route global error:", error);
    return NextResponse.json(
      { success: false, error: "خطای داخلی سرور" },
      { status: 500 },
    );
  }
}
