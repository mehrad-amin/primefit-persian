"use client";

import { useState } from "react";
import { clubData } from "../config/clubData.js";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function Faq() {
  if (!clubData.features?.showFaq) return null;

  const { faq } = clubData;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleQuestion = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const defaultWaMsg = clubData.brand?.defaultWaMessage || "";
  const waUrl = `https://wa.me/${clubData.brand?.whatsappNumber}?text=${encodeURIComponent(
    defaultWaMsg,
  )}`;

  return (
    <section
      id="faq"
      dir="rtl"
      className="py-24 bg-dark-900 border-t border-neutral-800/80 relative font-vazir"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* تیتر بخش */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{faq.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {faq.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {faq.subtitle}
          </p>
        </div>

        {/* لیست آکاردئون */}
        <div className="space-y-4">
          {faq.items?.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-answer-${idx}`;

            return (
              <div
                key={idx}
                className="bg-dark-850/80 border border-neutral-800/90 rounded-2xl overflow-hidden transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full p-6 text-start flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center shrink-0 transition-transform duration-300 transform-gpu ${
                      isOpen
                        ? "rotate-180 bg-gold-500 text-dark-950"
                        : "text-gold-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/60 mt-1"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* پشتیبانی اختصاصی واتساپ یا بله */}
        <div className="mt-12 text-center bg-dark-850/40 p-6 rounded-2xl border border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-300 font-medium">
            {faq.supportText}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-[#25D366]/10 border border-neutral-700 hover:border-[#25D366]/50 text-xs font-bold text-white hover:text-[#25D366] transition-all duration-200 group shadow-md"
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
            <span>{faq.supportWaBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
