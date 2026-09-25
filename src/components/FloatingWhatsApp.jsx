import { clubData } from "../config/clubData.js";

export default function FloatingWhatsApp({ hasActiveBar = false }) {
  const { brand } = clubData;

  const defaultMsg =
    brand?.defaultWaMessage ||
    "سلام، وقت بخیر. برای دریافت مشاوره اشتراک و هماهنگی جلسه ارزیابی و آشنایی با مجموعه پیام می‌دهم.";

  const waNumber = brand?.whatsappNumber || "989120000000";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <aside
      dir="rtl"
      aria-label="پشتیبانی مستقیم و برخط در واتس‌اپ"
      className={`fixed end-6 z-50 flex items-center group transition-all duration-300 ease-in-out font-vazir transform-gpu ${
        hasActiveBar ? "bottom-20 sm:bottom-24" : "bottom-6"
      }`}
    >
      {/* پیام حبابی راهنما */}
      <span className="hidden md:inline-block me-3 px-3.5 py-1.5 rounded-full bg-dark-900/90 backdrop-blur-md border border-neutral-700 text-xs font-bold text-neutral-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
        مشاوران مجموعه ورزشی آنلاین هستند
      </span>

      {/* دکمه شناور با ترنزیشن نرم */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ارتباط مستقیم و دریافت مشاوره در واتس‌اپ"
        className="flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full shadow-2xl shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer transform-gpu"
      >
        <svg
          className="w-6 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
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

        <span className="hidden sm:inline text-xs font-black tracking-wide text-white select-none">
          مشاوره و پشتیبانی آنلاین
        </span>
      </a>
    </aside>
  );
}
