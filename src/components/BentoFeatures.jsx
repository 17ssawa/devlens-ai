import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Cpu, Terminal, Globe2, X, ArrowUpRight, 
  Sparkles, CheckCircle2, Play, Layers, Activity, ShieldCheck 
} from 'lucide-react';

const FEATURES = [
  {
    id: 'visualizer',
    icon: Zap,
    badge: "REAL-TIME 3D ENGINE",
    title: "Jonli Algoritm Vizualizatsiyasi",
    desc: "Kodingizni oddiy matn sifatida qoldirmang. Uni real vaqt rejimida qadam-baqadam harakatlanuvchi animatsiyalarga aylantiring.",
    color: "from-cyan-500/25 via-blue-500/10 to-transparent",
    border: "border-cyan-500/35",
    glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.22)]",
    iconColor: "text-cyan-400",
    accentBg: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300",
    modalContent: {
      subtitle: "Xotira registrlari va Proxy kuzatuv dvigateli",
      overview: "DevLens AI siz yozgan JavaScript kodining har bir satrini mikroskop ostida tahlil qiladi. Massiv elementlari solishtirilganda sariq, o'rin almashganda qizil va o'z joyini topganda zumrad rangda 3D ustunlar jonlanadi.",
      highlights: [
        "JavaScript Proxy texnologiyasi orqali har qanday shaxsiy algoritmni (Bubble, Quick, Selection) avtomatik tutib olish",
        "Animatsiya tezligini 250ms dan 2000ms gacha boshqarish va har bir qadamni orqaga/oldinga qaytarish",
        "Cheksiz sikllardan (while true) avtomatik himoya va jonli xatoliklar konsoli"
      ],
      previewCode: `// Har bir solishtirish va almashish jonli ko'rinadi:
if (arr[j] > arr[j + 1]) {
  [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 3D ustunlar sakrab o'rin almashadi!
}`,
      metrics: [
        { label: "Vizual aniqlik", val: "60 FPS" },
        { label: "Qo'llab-quvvatlash", val: "Cheksiz kod" }
      ]
    }
  },
  {
    id: 'complexity',
    icon: Cpu,
    badge: "AI BIG-O ANALYZER",
    title: "AI Murakkablik Tahlilchisi",
    desc: "Sun'iy intellekt yordamida vaqt (O(n)) va xotira murakkabligini avtomatik ravishda hisoblang.",
    color: "from-indigo-500/25 via-purple-500/10 to-transparent",
    border: "border-indigo-500/35",
    glow: "group-hover:shadow-[0_0_40px_rgba(99,102,241,0.22)]",
    iconColor: "text-indigo-400",
    accentBg: "bg-indigo-500/15 border-indigo-400/40 text-indigo-300",
    modalContent: {
      subtitle: "Avtomatik algoritmik samaradorlik diagnostikasi",
      overview: "Kodingiz nafaqat to'g'ri ishlashi, balki katta ma'lumotlar (1,000,000+ element) bilan ham tez ishlashi shart. AI tahlilchi ichma-ich sikllar va rekursiyani tekshirib, kodingizning Big-O darajasini darhol chiqaradi.",
      highlights: [
        "Vaqt murakkabligi (Time Complexity): O(1), O(log n), O(n), O(n log n) va O(n²) darajalarini avtomatik aniqlash",
        "Xotira murakkabligi (Space Complexity): Qo'shimcha RAM sarfini aniq hisoblash",
        "Kodni tezlashtirish bo'yicha professional arxitektura tavsiyalari"
      ],
      previewCode: `// AI Tahlil Natijasi:
// Quick Sort  -> Vaqt: O(n log n) [Juda tez]
// Bubble Sort -> Vaqt: O(n²)      [Sekin]`,
      metrics: [
        { label: "Tahlil tezligi", val: "< 0.1 soniya" },
        { label: "Aniqlik darajasi", val: "99.4%" }
      ]
    }
  },
  {
    id: 'interview',
    icon: Terminal,
    badge: "FAANG INTERVIEW PREP",
    title: "Texnik Suhbatlarga Tayyorgarlik",
    desc: "Google va Amazon kabi yirik kompaniyalar so'raydigan savollarni amalda o'rganing.",
    color: "from-purple-500/25 via-fuchsia-500/10 to-transparent",
    border: "border-purple-500/35",
    glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.22)]",
    iconColor: "text-purple-400",
    accentBg: "bg-purple-500/15 border-purple-400/40 text-purple-300",
    modalContent: {
      subtitle: "Real texnik intervyu simulyatori va amaliy mashqlar",
      overview: "Yirik xalqaro va mahalliy IT kompaniyalarga ishga kirishda eng ko'p beriladigan algoritmik muammolarni yodlamasdan, mantiqan tushunib yechishni o'rganing.",
      highlights: [
        "Google, Amazon va Meta intervyularidan saralangan real savollar bazasi",
        "Har bir javobdan so'ng sun'iy intellekt tomonidan beriladigan chuqur texnik izoh",
        "Shaxsiy akkauntingizda o'zingiz yozgan eng yaxshi yechimlarni bulutda saqlash"
      ],
      previewCode: `// Intervyu Savoli (Google):
// Massiv allaqachon saralangan bo'lsa, Quick Sort qancha vaqt oladi?
// Javob: Eng yomon holatda O(n²) — pivot tanlashga bog'liq!`,
      metrics: [
        { label: "Kompaniyalar", val: "Google, Meta, Amazon" },
        { label: "Tayyorgarlik", val: "100% Amaliy" }
      ]
    }
  },
  {
    id: 'uzbek',
    icon: Globe2,
    badge: "NATIVE UZBEK AI",
    title: "O'zbek Tilidagi Tushuntirishlar",
    desc: "Mahalliy talablar va o'zbek tilidagi qulay muhitda dasturlashni tubdan anglab yeting.",
    color: "from-emerald-500/25 via-teal-500/10 to-transparent",
    border: "border-emerald-500/35",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.22)]",
    iconColor: "text-emerald-400",
    accentBg: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300",
    modalContent: {
      subtitle: "O'zbekiston yoshlari uchun maxsus yaratilgan intellektual muhit",
      overview: "Endi murakkab inglizcha hujjatlarda qiynalishga hojat yo'q. DevLens AI kodingizdagi har bir jarayonni sof, tushunarli va zamonaviy o'zbek tilida izohlab beradi.",
      highlights: [
        "Har bir algoritm qadamining o'zbek tilidagi jonli sharhi ('Pivot o'z joyiga joylashdi')",
        "O'zbekiston to'lov tizimlari (Uzcard, Humo) bilan to'liq integratsiya",
        "Talabalar va junior dasturchilar uchun tushunarli terminologiya"
      ],
      previewCode: `// Jonli AI Izohi:
"Solishtirish: arr[2] (29) > arr[3] (4).
 Almashish (Swap): 4 va 29 o'rin almashdi."`,
      metrics: [
        { label: "Til qo'llovi", val: "100% O'zbekcha" },
        { label: "O'zlashtirish", val: "3x Tezroq" }
      ]
    }
  }
];

export default function BentoFeatures({ onStart }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <section id="features" className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Sarlavha */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Kelajak texnologiyalari
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Nima uchun <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">DevLens AI</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Dasturlashni o'rganishni zerikarli o'qishdan interaktiv tajribaga aylantiruvchi vositalar. Batafsil ma'lumot olish uchun istalgan kartani bosing.
          </p>
        </div>

        {/* Bento Grid Kartalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.button
                key={feat.id}
                type="button"
                onClick={() => setSelectedFeature(feat)}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className={`group text-left p-8 rounded-3xl bg-[#080b14]/75 border ${feat.border} ${feat.glow} backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer transition-all`}
              >
                {/* Futuristik gradient nur */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity`} />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center ${feat.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/10 transition-colors">
                      <span>Batafsil</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">
                    {feat.badge}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* FUTURISTIK BATAFSIL MA'LUMOT MODALI */}
      <AnimatePresence>
        {selectedFeature && (
          <div 
            onClick={() => setSelectedFeature(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-2xl rounded-[32px] bg-[#080c17] border border-cyan-500/35 p-6 sm:p-9 shadow-[0_0_90px_rgba(6,182,212,0.25)] relative overflow-hidden my-8"
            >
              {/* Yuqori neon chiziq va fon nurlari */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute -top-28 -right-28 w-64 h-64 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-28 -left-28 w-64 h-64 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

              {/* Yopish tugmasi */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6 relative z-10 pr-10">
                <div className={`w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center shrink-0 ${selectedFeature.iconColor}`}>
                  {React.createElement(selectedFeature.icon, { className: "w-7 h-7" })}
                </div>
                <div>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border mb-2 ${selectedFeature.accentBg}`}>
                    {selectedFeature.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300/90 mt-1 font-medium">
                    {selectedFeature.modalContent.subtitle}
                  </p>
                </div>
              </div>

              {/* Asosiy tavsif */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                {selectedFeature.modalContent.overview}
              </p>

              {/* Afzalliklar ro'yxati */}
              <div className="space-y-2.5 mb-6 relative z-10">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Asosiy imkoniyatlar:
                </div>
                {selectedFeature.modalContent.highlights.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Jonli kod va ko'rsatkichlar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-7 relative z-10">
                <div className="sm:col-span-8 bg-[#04060b] border border-white/15 rounded-2xl p-4 font-mono text-xs text-cyan-200 overflow-x-auto flex items-center">
                  <pre className="leading-relaxed">{selectedFeature.modalContent.previewCode}</pre>
                </div>
                <div className="sm:col-span-4 flex flex-col justify-between gap-3">
                  {selectedFeature.modalContent.metrics.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex-1 flex flex-col justify-center">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{m.label}</span>
                      <span className="text-base font-extrabold text-white font-mono mt-0.5">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pastki harakat tugmalari */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DevLens AI Studiyasida bepul sinab ko'ring</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition cursor-pointer"
                  >
                    Yopish
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFeature(null);
                      if (onStart) onStart();
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Amalda sinab ko'rish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}