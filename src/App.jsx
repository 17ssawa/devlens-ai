import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoFeatures from './components/BentoFeatures';
import Pricing from './components/Pricing';
import Dashboard from './components/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('devlens_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedTheme = localStorage.getItem('devlens_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('devlens_theme', nextTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('devlens_user');
    setUser(null);
  };

  const handleSelectPro = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handlePaymentSuccess = (cardInfo) => {
    const updatedUser = {
      ...(user || { name: cardInfo.cardHolder, email: 'pro@devlens.uz' }),
      isPro: true,
      cardLast4: cardInfo.last4,
      cardBrand: cardInfo.brand
    };
    setUser(updatedUser);
    localStorage.setItem('devlens_user', JSON.stringify(updatedUser));
    setActivePage('workspace');
  };

  const isLight = theme === 'light';

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-slate-100 via-sky-50/70 to-indigo-100/60 text-slate-900'
          : 'bg-[#05070d] text-slate-100'
      }`}
    >
      <AnimatedBackground theme={theme} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
        }}
        theme={theme}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        user={user}
        theme={theme}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {activePage === 'landing' ? (
          <main className="flex-1">
            <Hero onStart={() => setActivePage('workspace')} theme={theme} />
            <BentoFeatures onStart={() => setActivePage('workspace')} theme={theme} />
            <Pricing
              user={user}
              onStart={() => setActivePage('workspace')}
              onSelectPro={handleSelectPro}
              theme={theme}
            />

            <footer
              className={`py-8 border-t text-center text-xs transition-colors duration-300 ${
                isLight
                  ? 'border-slate-200 bg-white/75 text-slate-500'
                  : 'border-white/10 bg-[#05070c]/60 backdrop-blur-md text-slate-500'
              }`}
            >
              &copy; 2026 DevLens AI. Barcha huquqlar himoyalangan. O&apos;zbekiston yoshlari uchun.
            </footer>
          </main>
        ) : (
          <main className="flex-1">
            <Dashboard user={user} onOpenAuth={() => setIsAuthOpen(true)} theme={theme} />
          </main>
        )}
      </div>
    </div>
  );
}