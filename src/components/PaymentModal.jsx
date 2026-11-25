import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, user, theme = 'dark' }) {
  const isLight = theme === 'light';
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setExpiry(digits);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const digitsOnly = cardNumber.replace(/\s/g, '');
    const last4 = digitsOnly.slice(-4) || '8842';
    const brand = digitsOnly.startsWith('8600')
      ? 'Uzcard'
      : digitsOnly.startsWith('9860')
      ? 'Humo'
      : 'Visa / MC';

    onPaymentSuccess({
      cardHolder: cardHolder.trim() || user?.name || 'PRO Foydalanuvchi',
      last4,
      brand
    });
    setCardNumber('');
    setExpiry('');
    setCvv('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className={`w-full max-w-md rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-5 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#0a0f1c] border-white/15 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold">DevLens PRO</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Karta ma&apos;lumotlarini kiriting
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Karta egasining ismi
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="JASUR KARIMOV"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-[#050811] border-white/15 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Karta raqami
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="8600 0000 0000 0000"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-500 transition ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-[#050811] border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Amal qilish muddati
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-500 transition ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-[#050811] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-500 transition ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-[#050811] border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-2 text-[11px] pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Ma&apos;lumotlar xavfsiz himoyalangan holda qayta ishlanadi.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer mt-2"
              >
                PRO rejimni faollashtirish
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}