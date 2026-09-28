"use client";

import { useState, useEffect } from "react";
import { clubData } from "../config/clubData.js";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "ویژگی‌ها و امکانات", href: "#recovery", show: true },
    {
      label: "سالن‌ها و حریم خصوصی",
      href: "#tour",
      show: true,
    },
    {
      label: "تحولات و نتایج",
      href: "#transformations",
      show: clubData.features?.showTransformations,
    },
    {
      label: "برنامه هفتگی کلاس‌ها",
      href: "#schedule",
      show: clubData.features?.showSchedule,
    },
    {
      label: "کادر مربیان",
      href: "#trainers",
      show: clubData.features?.showTrainers,
    },
    {
      label: "پلن‌های اشتراک",
      href: "#pricing",
      show: clubData.features?.showPricing,
    },
    {
      label: "محاسبه‌گر کالری",
      href: "#calculator",
      show: clubData.features?.showCalculator,
    },
  ].filter((item) => Boolean(item.show));

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <motion.header
      dir="rtl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 font-vazir transform-gpu ${
        isScrolled
          ? "bg-dark-950/90 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* لوگوتایپ برند */}
          <motion.a
            variants={itemVariants}
            href="#"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-950 font-extrabold text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
              PF
            </div>
            <div className="flex flex-col text-right">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-gold-400 transition-colors">
                {clubData.brand?.nameFa}
              </span>
              <span className="text-[10px] text-neutral-400 tracking-wider">
                {clubData.brand?.slogan}
              </span>
            </div>
          </motion.a>

          {/* لینک‌های ناوبری دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                variants={itemVariants}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-neutral-300 hover:text-gold-400 whitespace-nowrap transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* دکمه اکشن هدر */}
          <motion.div
            variants={itemVariants}
            className="hidden sm:flex items-center gap-3 shrink-0"
          >
            <a
              href="#lead-capture"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-xl shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>رزرو ارزیابی و مشاوره</span>
            </a>
          </motion.div>

          {/* دکمه منوی موبایل */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg bg-dark-850 border border-neutral-800 text-neutral-300 active:scale-95 transition-transform"
              aria-label="منوی ناوبری"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* منوی بازشونده موبایل */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 p-4 rounded-2xl bg-dark-900/95 border border-neutral-800 shadow-2xl space-y-3 backdrop-blur-xl"
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-dark-800 hover:text-gold-400 transition-colors text-right"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                <a
                  href="#lead-capture"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold text-dark-950 bg-gold-500 rounded-lg hover:brightness-105 active:scale-98 transition-all"
                >
                  رزرو ارزیابی و مشاوره
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
