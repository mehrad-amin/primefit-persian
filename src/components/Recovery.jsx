"use client";

import { clubData } from "../config/clubData.js";
import { Snowflake, Flame, Wind, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  snowflake: Snowflake,
  flame: Flame,
  wind: Wind,
  activity: Activity,
};

function RecoveryCard({ item, index }) {
  const IconComponent = iconMap[item.icon] || Activity;

  // کارت‌های فرد از چپ و کارت‌های زوج از راست
  const isEven = index % 2 === 0;
  const initialX = isEven ? 70 : -70;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -90px 0px" }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-dark-900 border border-neutral-800/80 hover:border-gold-500/40 rounded-2xl p-6 transition-colors duration-300 group hover:-translate-y-1 text-right shadow-lg my-2 md:my-0 transform-gpu will-change-[transform,opacity]"
    >
      <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-dark-950 transition-colors duration-300 mb-5 shadow-sm">
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
        {item.title}
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
        {item.desc}
      </p>
    </motion.div>
  );
}

export default function Recovery() {
  if (!clubData.features?.showRecovery) return null;

  const { recovery } = clubData;
  const items = recovery?.items || [];

  return (
    <section
      id="recovery"
      dir="rtl"
      className="py-24 bg-dark-950 relative overflow-x-hidden font-vazir"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* تیتر بخش */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 transform-gpu"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 shadow-lg shadow-emerald-500/5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{recovery?.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {recovery?.title}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {recovery?.subtitle}
          </p>
        </motion.div>

        {/* کارت‌ها با تفکیک ورود با اسکرول */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <RecoveryCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
