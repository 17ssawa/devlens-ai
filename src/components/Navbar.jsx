import React from 'react';
import { Cpu, Sun, Moon, LogIn, LogOut, UserCheck, Sparkles } from 'lucide-react';

export default function Navbar({
  activePage,
  setActivePage,
  user,
  onOpenAuth,
  onLogout,
  theme = 'dark',
  onToggleTheme
}) {
  const isLight = theme === 'light';

  return (
    <nav
      className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
        isLight
          ? 'bg-white/85 border-slate-200/90 text-slate-900 backdrop-blur-xl shadow-xs'
          : 'bg-[#060912]/80 border-white/10 text-slate-100 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-[73px] flex items-center justify-between gap-2">
        {/* Brend logotipi */}
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer shrink-0 group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight">
                DevLens
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                AI
              </span>
            </div>
            <span
              className={`hidden sm:block text-[11px] ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              3D Algoritm Studiyasi
            </span>
          </div>
        </button>

        {/* Markaziy sahifa almashtirgich (Asosiy / Studiya) */}
        <div
          className={`flex items-center p-1 rounded-2xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.04] border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={() => setActivePage('landing')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activePage === 'landing'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Asosiy
          </button>
          <button
            type="button"
            onClick={() => setActivePage('workspace')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              activePage === 'workspace'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Studiya</span>
          </button>
        </div>

        {/* O'ng tomon: Rejim va Akkaunt */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Mavzuni o'zgartirish"
            title={isLight ? 'Tungi rejim' : 'Kunduzgi rejim'}
            className={`p-2 sm:p-2.5 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-amber-600'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-cyan-300'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="max-w-[110px] truncate">{user.name}</span>
                {user.isPro && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold">
                    PRO
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Chiqish"
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-300'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/15 text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-500" />
              <span>Kirish</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}