import React from 'react';
import { Sun, Moon, LogOut, UserCheck, Sparkles } from 'lucide-react';

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
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-900'
          : 'bg-[#060913]/75 border-white/10 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[73px] flex items-center justify-between gap-4">
        {/* Brend logotipi */}
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight block leading-none">
              DevLens <span className="text-cyan-500">AI</span>
            </span>
            <span
              className={`text-[10px] font-mono ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Algorithm Studio
            </span>
          </div>
        </button>

        {/* Sahifalar navigatsiyasi */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActivePage('landing')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activePage === 'landing'
                ? isLight
                  ? 'bg-cyan-500/15 text-cyan-700 border border-cyan-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Asosiy
          </button>
          <button
            type="button"
            onClick={() => setActivePage('workspace')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activePage === 'workspace'
                ? isLight
                  ? 'bg-cyan-500/15 text-cyan-700 border border-cyan-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Studia
          </button>
        </nav>

        {/* O'ng taraf: Rejim almashtirish + Akkaunt */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            title={isLight ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-300" />}
            <span className="hidden md:inline">{isLight ? "Tungi" : "Kunduzgi"}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="max-w-[110px] truncate">{user.name || user.email}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-rose-50 border-slate-200 text-slate-600 hover:text-rose-600'
                    : 'bg-white/5 hover:bg-rose-500/15 border-white/10 text-slate-400 hover:text-rose-300'
                }`}
                title="Chiqish"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
            >
              Kirish
            </button>
          )}
        </div>
      </div>
    </header>
  );
}