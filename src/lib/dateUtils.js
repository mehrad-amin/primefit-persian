// src/lib/dateUtils.js
import { clubData } from "@/src/config/clubData.js";

export function getLocalClubTime(date = new Date()) {
  // منطقه زمانی رسمی ایران (تهران)
  const timeZone = clubData.brand?.timeZone || "Asia/Tehran";

  // تاریخ خورشیدی و ساعت رسمی ایران به همراه ارقام و نام ماه‌های فارسی
  const formattedDateTime = new Intl.DateTimeFormat("fa-IR", {
    timeZone,
    calendar: "persian",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // ساعت ۲۴ ساعته اداری و بدون ابهام برای ثبت در شیت
  }).format(date);

  // فقط ساعت رسمی به فرمت ۲۴ ساعته
  const formattedTimeOnly = new Intl.DateTimeFormat("fa-IR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return {
    timeZone,
    formattedDateTime, // مثال: ۱۴۰۵/۰۷/۰۳، ۱۴:۳۰:۰۰
    formattedTimeOnly, // مثال: ۱۴:۳۰:۰۰
  };
}
