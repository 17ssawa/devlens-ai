import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Kodni qanday yozaman va qadam-baqadam ko'raman?",
    a: "Studiya bo'limida tayyor shablonlardan birini tanlang yoki o'z JavaScript funksiyangizni yozing, so'ng 'Tahlil' yoki 'Ijro' tugmasini bosing. Ustunlar harakati va qadam slideri darhol ishga tushadi."
  },
  {
    q: "Platforma telefonda qulay ishlaydimi?",
    a: "Ha, yuqorida alohida bo'limlar paneli, test massiv tugmalari, qadam slideri va sensorli ekranga moslashgan interaktiv fon mavjud. Qulaylik uchun 'Tejamkor rejim'ni ham yoqishingiz mumkin."
  },
  {
    q: "XP va kunlik vazifalar qanday ishlaydi?",
    a: "Algoritmlarni oxirigacha ko'rib chiqqaningizda, kunlik vazifalarni bajarganingizda yoki texnik suhbatda javob berganingizda XP ballar va kunlik seriya qo'shilib boradi."
  },
  {
    q: "Yozgan kodlarimni saqlab qo'ya olamanmi?",
    a: "Ha, tizimga kirganingizdan so'ng 'Saqlash' tugmasi orqali kodlaringizni shaxsiy ro'yxatingizga saqlashingiz va keyin yana Studiyaga qaytarib ochishingiz mumkin."
  }
];

export default function FaqSection({ theme = 'dark' }) {
  const isLight = theme === 'light';
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border ${
            isLight
              ? 'bg-white border-cyan-500/35 text-cyan-700'
              : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
          <span>Tez-tez beriladigan savollar</span>
        </div>
        <h2
          className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Ko&apos;p beriladigan savollar
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                isLight
                  ? 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
                  : 'bg-[#080d1a]/80 border-white/10 text-slate-100 backdrop-blur-xl'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  className={`px-5 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isLight
                      ? 'border-slate-100 text-slate-600'
                      : 'border-white/5 text-slate-300'
                  }`}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}