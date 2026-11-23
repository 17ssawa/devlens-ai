import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, CheckCircle2, Sparkles, Lock } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, user }) {
  const [cardHolder, setCardHolder] = useState(user?.name?.toUpperCase() || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  // Karta raqamini 4 tadan qilib formatlash (8600 1234 5678 9012)
  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Amal qilish muddatini MM/YY formatlash
  const handleExpiryChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setExpiry(digits);
    }
  };

  // Karta turini aniqlash (Uzcard, Humo, Visa, Mastercard)
  const detectCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('8600') || clean.startsWith('5614')) return { name: 'UZCARD', color: 'from-blue-600 to-cyan-500' };
    if (clean.startsWith('9860')) return { name: 'HUMO', color: 'from-emerald-600 to-teal-400' };
    if (clean.startsWith('4')) return { name: 'VISA', color: 'from-indigo-600 to-purple-500' };
    if (clean.startsWith('5')) return { name: 'MASTERCARD', color: 'from-amber-600 to-rose-500' };
    return { name: 'DEVLENS PAY', color: 'from-cyan-500 via-blue-600 to-indigo-700' };
  };

  const brand = detectCardBrand();
  const isUzbekCard = brand.name === 'UZCARD' || brand.name === 'HUMO';

  const handlePay = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5 || !cardHolder.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onPaymentSuccess({
          cardHolder: cardHolder.trim(),
          last4: cardNumber.slice(-4),
          brand: brand.name
        });
        onClose();
      }, 1500);
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-lg rounded-3xl bg-[#090d18] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_70px_rgba(6,182,212,0.22)] relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {isDone ? (
            <div className="py-12 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>
              <h3 className="text-xl font-extrabold text-white">To'lov muvaffaqiyatli amalga oshdi!</h3>
              <p className="text-xs text-slate-400">
                Sizning <strong className="text-cyan-300">Pro Developer</strong> obunangiz faollashtirildi. Studiyaga o'tilmoqda...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Pro Developer Obunasi
                </div>
                <h3 className="text-xl font-extrabold text-white">Plastik kartani ulash</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Oylik to'lov: <strong className="text-white">49,000 so'm</strong> • Uzcard, Humo, Visa va Mastercard qabul qilinadi.
                </p>
              </div>

              {/* Jonli 3D Plastik Karta Maketi */}
              <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${brand.color} p-6 flex flex-col justify-between shadow-2xl mb-6 relative overflow-hidden border border-white/20`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="w-10 h-7 rounded-md bg-amber-300/80 border border-amber-100/50" />
                  <span className="text-xs font-extrabold tracking-widest text-white/95 bg-black/25 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {brand.name}
                  </span>
                </div>

                <div className="font-mono text-lg sm:text-xl tracking-widest text-white font-bold drop-shadow">
                  {cardNumber || '8600 •••• •••• ••••'}
                </div>

                <div className="flex items-end justify-between text-xs text-white/90">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider opacity-70 block">Karta egasi</span>
                    <span className="font-semibold tracking-wide uppercase">
                      {cardHolder || 'ISM FAMILIYA'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider opacity-70 block">Muddati</span>
                    <span className="font-mono font-semibold">{expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Karta ma'lumotlari formasi */}
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Ism va Familiya (Karta egasi)</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="SARDOR KARIMOV"
                    className="w-full bg-[#04060b] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-medium focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Plastik karta raqami</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="8600 0000 0000 0000"
                      className="w-full bg-[#04060b] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Amal qilish muddati</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="09/29"
                      className="w-full bg-[#04060b] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {isUzbekCard ? "SMS Kod / CVV (ixtiyoriy)" : "CVV / CVC kod"}
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required={!isUzbekCard}
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full bg-[#04060b] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 hover:opacity-95 disabled:opacity-50 transition cursor-pointer mt-2"
                >
                  {isProcessing ? "Karta tekshirilmoqda..." : "49,000 so'm to'lash va Ulash"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-bit SSL shifrlangan xavfsiz to'lov tizimi</span>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}