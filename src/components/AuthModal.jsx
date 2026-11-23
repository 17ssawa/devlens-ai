import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Terminal, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' yoki 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError("Ism va familiyangizni kiriting.");
      return;
    }

    const userData = {
      name: mode === 'signup' ? fullName.trim() : email.split('@')[0],
      email: email.trim(),
      isPro: false,
      joinedAt: new Date().toLocaleDateString()
    };

    // Avval saqlangan PRO holati bo'lsa saqlab qolamiz
    try {
      const existing = JSON.parse(localStorage.getItem('devlens_user') || 'null');
      if (existing && existing.email === userData.email && existing.isPro) {
        userData.isPro = true;
      }
      localStorage.setItem('devlens_user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
    }

    onSuccess(userData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-md rounded-3xl bg-[#090d18] border border-white/15 p-7 shadow-[0_0_60px_rgba(6,182,212,0.2)] relative overflow-hidden"
        >
          {/* Neon yorug'lik */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo va Sarlavha */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white">
              DevLens <span className="text-cyan-400">AI</span>
            </span>
          </div>

          {/* Sign In / Sign Up almashtirgich */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#04060b] border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 border border-cyan-400/40 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kirish (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 border border-cyan-400/40 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Ism va Familiya</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Sardor Karimov"
                    className="w-full bg-[#04060b] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Elektron pochta (Email)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@devlens.uz"
                  className="w-full bg-[#04060b] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Parol</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#04060b] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'signin' ? "Tizimga kirish" : "Hisob yaratish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-500 mt-5 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Barcha algoritmik ma'lumotlaringiz xavfsiz saqlanadi
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}