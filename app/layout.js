import { Vazirmatn } from "next/font/google";
import { clubData } from "../src/config/clubData.js";
import "./globals.css";

// فونت وزیرمتن برای کل متون و اعداد رابط کاربری
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

const SITE_URL = "https://primefit-landing.vercel.app";

export const metadata = {
  title: `${clubData.brand.nameFa} | ${clubData.brand.slogan}`,
  description: `${clubData.brand.nameFa} در ${clubData.brand.city} - مجهزترین و لوکس‌ترین مجموعه ورزشی و تندرستی. تجربه تمرین با استانداردهای المپیک، سالن کاملاً مجزا و ۱۰۰٪ اختصاصی بانوان، سوییت‌های VIP و مجموعه ریکاوری پیشرفته. همین حالا اقدام کنید.`,
  keywords: [
    "باشگاه بدنسازی تهران",
    "باشگاه ورزشی اختصاصی بانوان",
    "جیم لوکس الهیه فرشته",
    "Prime Fit Athletic Club",
    "مربی خصوصی بین المللی",
    "حوضچه یخ و سونا فنلاندی",
    "کراس فیت و پیلاتس ریفورمر",
  ],
  authors: [{ name: clubData.brand.nameFa }],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${clubData.brand.nameFa} | مجموعه ورزشی و بدنسازی پریمیوم`,
    description: `به جامعه ورزشکاران حرفه‌ای ${clubData.brand.city} بپیوندید. محیط تمرینی بی‌نظیر با برترین تجهیزات بیومکانیک روز دنیا.`,
    url: SITE_URL,
    siteName: clubData.brand.nameFa,
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: `${clubData.brand.nameFa} - سالن تمرین و بدنسازی مجهز`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: clubData.brand.nameFa,
    description: clubData.brand.slogan,
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <head>
        {/* پری‌لود پوستر برای نمایش میلی‌ثانیه‌ای عکس */}
        <link rel="preload" as="image" href="/hero-poster-mobile-1.png" />
        {/* پری‌لود خود ویدیو با اولویت بالا */}
        <link
          rel="preload"
          as="video"
          href="/hero-video-2.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="video"
          href="/hero-video.mp4"
          type="video/mp4"
        />
      </head>
      <body className="bg-dark-950 text-neutral-100 antialiased selection:bg-gold-500 selection:text-dark-950 min-h-screen flex flex-col font-vazir">
        {children}
      </body>
    </html>
  );
}
