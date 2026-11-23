import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, CreditCard } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: "Boshlang'ich (Free)",
    price: "0 so'm",
    period: "/ abadiy",
    desc: "Algoritmlarni noldan o'rganishni boshlagan talabalar uchun.",
    features: [
      "Asosiy saralash algoritmlari (Bubble, Selection)",
      "3D xotira ustunlari vizualizatsiyasi",
      "Kuniga 10 ta kod tahlili",
      "O'zbek tilidagi AI tushuntirishlar"
    ],
    highlighted: false,
    cta: "Bepul boshlash"
  },
  {
    id: 'pro',
    name: "Pro Developer",
    price: "49,000 so'm",
    period: "/ oyiga",
    desc: "Texnik suhbatlarga jiddiy tayyorlanayotgan dasturchilar uchun.",
    features: [
      "Cheksiz shaxsiy algoritm yozish va Proxy tahlil",
      "Quick Sort, Merge Sort va murakkab algoritmlar",
      "Bulutda cheksiz kod saqlash",
      "FAANG (Google, Meta) intervyu simulyatori",
      "Avtomatik Big-O va xotira optimizatsiyasi"
    ],
    highlighted: true,
    cta: "Pro bilan boshlash"
  }
];

export default function Pricing({ onStart, onSelectPro, user }) {
  return (
    <section id="pricing" className="py-24 px-6 relative z-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            O'zingizga mos <span className="text-cyan-400">tarifni</span> tanlang
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Barcha asosiy vositalar bepul. Yirik IT kompaniyalar suhbatiga tayyorlanish uchun Pro imkoniyatlaridan foydalaning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isAlreadyPro = plan.id === 'pro' && user?.isPro;
            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                className={`p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-cyan-500/15 via-[#090d18]/90 to-[#080b14]/90 border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.18)]'
                    : 'bg-[#080b14]/70 border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Tavsiya etiladi
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mb-6">{plan.desc}</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.id === 'pro' ? (
                  <button
                    onClick={isAlreadyPro ? onStart : onSelectPro}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isAlreadyPro ? "Pro Faol — Studiyani ochish" : plan.cta}</span>
                  </button>
                ) : (
                  <button
                    onClick={onStart}
                    className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition cursor-pointer"
                  >
                    {plan.cta}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}