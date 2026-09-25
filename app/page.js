"use client";

import { useState, useEffect } from "react";
import { clubData } from "../src/config/clubData.js";

import Header from "@/src/components/Header.jsx";
import Hero from "@/src/components/Hero.jsx";
import Facilities from "@/src/components/Facilities.jsx";
import Recovery from "@/src/components/Recovery.jsx";
import TransformationsSlider from "@/src/components/TransformationsSlider.jsx";
import FitnessCalculator from "@/src/components/FitnessCalculator.jsx";
import Schedule from "@/src/components/Schedule.jsx";
import Trainers from "@/src/components/Trainers.jsx";
import Testimonials from "@/src/components/Testimonials.jsx";
import Pricing from "@/src/components/Pricing.jsx";
import Faq from "@/src/components/Faq.jsx";
import Footer from "@/src/components/Footer.jsx";
import StickyBookingBar from "@/src/components/StickyBookingBar.jsx";
import FloatingWhatsApp from "@/src/components/FloatingWhatsApp.jsx";

export default function HomePage() {
  const [selectedBookings, setSelectedBookings] = useState({
    plan: null,
    trainer: null,
    classItem: null,
  });

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "fa";
  }, []);

  const handleProceedToForm = () => {
    const el = document.getElementById("lead-capture");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasActiveBooking = Boolean(
    selectedBookings.plan ||
    selectedBookings.trainer ||
    selectedBookings.classItem,
  );

  const handleSelectPlan = (plan) => {
    setSelectedBookings((prev) => ({ ...prev, plan }));
  };

  // ۱. با انتخاب کلاس: مربی همان کلاس به طور خودکار ست و قفل می‌شود
  const handleSelectClass = (classItem) => {
    const matchedTrainer = clubData.trainers?.items?.find(
      (t) => t.name === classItem.trainer,
    );

    setSelectedBookings((prev) => ({
      ...prev,
      classItem,
      trainer: matchedTrainer
        ? {
            id: matchedTrainer.id,
            title: matchedTrainer.name,
            role: matchedTrainer.role,
          }
        : { id: null, title: classItem.trainer, role: "مربی دوره" },
    }));
  };

  // ۲. با انتخاب مربی: اگر با مربی کلاس فعلی مغایرت داشته باشد، کلاس قبلی لغو می‌شود
  const handleSelectTrainer = (trainer) => {
    setSelectedBookings((prev) => {
      const currentTrainerName = trainer.title || trainer.name;
      const isSameTrainer = prev.classItem?.trainer === currentTrainerName;

      return {
        ...prev,
        trainer: {
          id: trainer.id,
          title: currentTrainerName,
          role: trainer.role,
        },
        classItem: isSameTrainer ? prev.classItem : null, // حذف کلاس ناسازگار قبلی
      };
    });
  };

  const handleClearBooking = (type) => {
    setSelectedBookings((prev) => {
      if (type === "classItem" || type === "class") {
        return { ...prev, classItem: null };
      }
      return { ...prev, [type]: null };
    });
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-dark-950 text-neutral-100 flex flex-col relative font-vazir"
    >
      <Header />
      <Hero />
      <Facilities />
      <Recovery />
      <TransformationsSlider />
      <FitnessCalculator />

      {/* اتصال کلاس‌ها با ارسال شناسه کلاس انتخابی */}
      <Schedule
        onSelectClass={handleSelectClass}
        selectedClassId={selectedBookings.classItem?.id}
      />

      {/* اتصال مربیان با مشخص بودن مربی و کلاس انتخابی */}
      <Trainers
        onSelectTrainer={handleSelectTrainer}
        selectedTrainerName={selectedBookings.trainer?.title}
        selectedClassTitle={selectedBookings.classItem?.title}
      />

      <Testimonials />
      <Pricing onSelectPlan={handleSelectPlan} />
      <Faq />

      <Footer
        selectedBookings={selectedBookings}
        onClearBooking={handleClearBooking}
      />

      <StickyBookingBar
        selectedBookings={selectedBookings}
        onClearBooking={handleClearBooking}
        onProceedToForm={handleProceedToForm}
      />

      <FloatingWhatsApp hasActiveBar={hasActiveBooking} />
    </main>
  );
}
