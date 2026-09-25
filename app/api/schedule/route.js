import { NextResponse } from "next/server";
import { clubData } from "../../../src/config/clubData.js";

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

export async function GET() {
  const fallbackClasses = clubData.schedule?.classes || [];
  const fallbackPlans = clubData.pricing?.plans || [];
  const env = await resolveEnvironmentVariables();
  const webhookUrl = env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      classes: fallbackClasses,
      plans: fallbackPlans,
      source: "fallback_config",
    });
  }

  try {
    const res = await fetch(webhookUrl, {
      next: { revalidate: 10 },
    });

    if (!res.ok) throw new Error("Google Sheets fetch failed");

    const data = await res.json();

    // تبدیل ویژگی‌های متنی جداشده با کاما به آرایه استاندارد فارسی
    const formattedPlans = (data.plans || fallbackPlans).map((p) => {
      const rawFeatures =
        p.features || p.featuresFa || p.featuresAr || p.featuresEn || [];
      const features = Array.isArray(rawFeatures)
        ? rawFeatures
        : String(rawFeatures)
            .split(/[,،]/)
            .map((s) => s.trim())
            .filter(Boolean);

      return {
        ...p,
        name: p.name || p.nameFa || p.nameAr || p.nameEn || "",
        period: p.period || p.periodFa || p.periodAr || p.periodEn || "",
        badge: p.badge || p.badgeFa || p.badgeAr || p.badgeEn || null,
        isPopular: Boolean(p.isPopular === true || p.isPopular === "TRUE"),
        features,
      };
    });

    // استانداردسازی فیلدهای فارسی کلاس‌ها در صورت دریافت از شیت
    const formattedClasses = (data.classes || fallbackClasses).map((c) => ({
      ...c,
      title: c.title || c.titleFa || c.titleAr || c.titleEn || "",
      trainer:
        c.trainer ||
        c.trainerFa ||
        c.trainerAr ||
        c.coachAr ||
        c.trainerEn ||
        "-",
      time: c.time || c.timeFa || c.timeAr || c.timeEn || "",
      intensity:
        c.intensity || c.intensityFa || c.intensityAr || c.intensityEn || "",
      seatsLeft: Number(c.seatsLeft ?? 0),
      isLadiesOnly: Boolean(
        c.isLadiesOnly === true || c.isLadiesOnly === "TRUE",
      ),
    }));

    return NextResponse.json(
      {
        classes: formattedClasses,
        plans: formattedPlans,
        source: "live_sheet",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    console.error("Schedule/Plans API error:", error);
    return NextResponse.json({
      classes: fallbackClasses,
      plans: fallbackPlans,
      source: "fallback_error",
    });
  }
}
