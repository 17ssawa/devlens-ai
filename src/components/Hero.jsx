import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Cpu, ArrowRight } from 'lucide-react';

export default function Hero({ onStart, theme = 'dark' }) {
  const isLight = theme === 'light';

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border ${
            isLight
              ? 'bg-white/90 border-cyan-500/30 text-cyan-700 shadow-xs'
              : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Vizual Algoritm va AI Mentor Platformasi</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Algoritmlarni shunchaki o&apos;qimang —{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
            3D da ko&apos;ring va tushuning
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          Kodingizni yozing, qadam-baqadam xotira ustunlaridagi harakatni kuzating, xatolarni AI Kod Mentori bilan tuzating va texnik suhbatlarga tayyorlaning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
        >
          <button
            type="button"
            onClick={onStart}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Studiyani ishga tushirish</span>
          </button>

          <a
            href="#features"
            className={`px-6 py-3 rounded-2xl border text-sm font-semibold transition inline-flex items-center gap-2 ${
              isLight
                ? 'bg-white/90 hover:bg-white border-slate-300 text-slate-800 shadow-xs'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-slate-200'
            }`}
          >
            <span>Imkoniyatlarni ko&apos;rish</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Preview Karta (Endi Kunduzgi va Tungi rejimga to'liq moslashadi) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-12 rounded-3xl border p-5 sm:p-7 text-left shadow-2xl transition-colors duration-300 ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
              : 'bg-[#070b14]/90 border-cyan-500/25 text-slate-100 shadow-cyan-950/50'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Chap kod oynasi */}
            <div
              className={`lg:col-span-5 rounded-2xl border p-4 font-mono text-xs space-y-2.5 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-[#04060b] border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-500/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  &gt;_ binarySearch.js
                </span>
              </div>

              <div className="space-y-1.5 leading-relaxed">
                <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  <span className="opacity-50 mr-2">1 |</span>
                  let mid = Math.floor((l + r) / 2);
                </div>
                <div
                  className={`px-2.5 py-1.5 rounded-lg border font-semibold ${
                    isLight
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-950'
                      : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                  }`}
                >
                  <span className="opacity-60 mr-2">2 |</span>
                  if (arr[mid] === target) return mid;
                </div>
                <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  <span className="opacity-50 mr-2">3 |</span>
                  else if (arr[mid] &lt; target) l = mid + 1;
                </div>
              </div>
            </div>

            {/* O'ng registrlar va xulosa */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-cyan-500" /> Xotira registrlari
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  O(log n) • 3 qadam
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[2, 5, 8, 12, 16, 23, 38].map((val, idx) => {
                  const isTarget = val === 12;
                  return (
                    <div
                      key={val}
                      className={`rounded-2xl border py-3 flex flex-col items-center justify-center font-bold transition ${
                        isTarget
                          ? isLight
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-950 shadow-md shadow-cyan-500/20'
                            : 'bg-cyan-500/25 border-cyan-400 text-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-white/[0.03] border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{val}</span>
                      <span className="text-[10px] font-mono opacity-60">[{idx}]</span>
                    </div>
                  );
                })}
              </div>

              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                  isLight
                    ? 'bg-cyan-50/90 border-cyan-200 text-cyan-950'
                    : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-200'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>
                  <strong>AI Xulosasi:</strong> O&apos;rta indeks [3] qiymati maqsadga mos keldi. Qidiruv muvaffaqiyatli yakunlandi.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}