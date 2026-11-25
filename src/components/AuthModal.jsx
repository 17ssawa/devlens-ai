import React, { useState, useEffect } from "react";

const STORAGE_USER_KEY = "devlens_user";
const STORAGE_DB_KEY = "devlens_users_db";

function generateChallenge() {
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 7) + 1; // 1..7
  return {
    question: `${a} + ${b} = ?`,
    answer: String(a + b),
  };
}

function saveUserToStorage(userObj) {
  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));

    const rawDb = localStorage.getItem(STORAGE_DB_KEY);
    const db = rawDb ? JSON.parse(rawDb) : [];
    const filtered = Array.isArray(db)
      ? db.filter((item) => item.email?.toLowerCase() !== userObj.email?.toLowerCase())
      : [];

    const nextDb = [userObj, ...filtered];
    localStorage.setItem(STORAGE_DB_KEY, JSON.stringify(nextDb));
  } catch (err) {
    console.error("Ma'lumotlarni saqlashda xatolik:", err);
  }
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  theme = "dark",
}) {
  const isLight = theme === "light";

  const [mode, setMode] = useState("register"); // "register" | "login"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Robot emasligini tekshirish holatlari
  const [humanChecked, setHumanChecked] = useState(false);
  const [challenge, setChallenge] = useState(() => generateChallenge());
  const [challengeInput, setChallengeInput] = useState("");

  // Google kirish holati
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setSavedNotice("");
      setHumanChecked(false);
      setChallenge(generateChallenge());
      setChallengeInput("");

      try {
        const existing = localStorage.getItem(STORAGE_USER_KEY);
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed?.name) setName(parsed.name);
          if (parsed?.email) setEmail(parsed.email);
          if (parsed?.phone) setPhone(parsed.phone);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHumanVerified =
    humanChecked && challengeInput.trim() === challenge.answer;

  const refreshChallenge = () => {
    setChallenge(generateChallenge());
    setChallengeInput("");
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSavedNotice("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split("@")[0] || "Foydalanuvchi";
    const cleanPhone = phone.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Iltimos, to‘g‘ri email manzil kiriting.");
      return;
    }

    if (mode === "register" && name.trim().length < 2) {
      setErrorMsg("Iltimos, ismingizni kiriting (kamida 2 ta harf).");
      return;
    }

    if (password.trim().length < 4) {
      setErrorMsg("Parol kamida 4 ta belgidan iborat bo‘lishi kerak.");
      return;
    }

    if (!humanChecked) {
      setErrorMsg("Avval «Men robot emasman» katagini belgilang.");
      return;
    }

    if (challengeInput.trim() !== challenge.answer) {
      setErrorMsg(
        `Robot tekshiruvi noto‘g‘ri. (${challenge.question}) javobini to‘g‘ri kiriting.`
      );
      return;
    }

    let existingUser = null;
    try {
      const rawDb = localStorage.getItem(STORAGE_DB_KEY);
      const db = rawDb ? JSON.parse(rawDb) : [];
      if (Array.isArray(db)) {
        existingUser = db.find((u) => u.email?.toLowerCase() === cleanEmail) || null;
      }
    } catch (e) {
      console.error(e);
    }

    const userRecord = {
      id: existingUser?.id || `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || existingUser?.phone || "",
      provider: existingUser?.provider || "email",
      isPro: existingUser?.isPro || false,
      verifiedHuman: true,
      updatedAt: new Date().toISOString(),
      createdAt: existingUser?.createdAt || new Date().toISOString(),
    };

    saveUserToStorage(userRecord);
    setSavedNotice("Ma’lumotlaringiz muvaffaqiyatli saqlandi!");

    if (typeof onSuccess === "function") {
      onSuccess(userRecord);
    }
    onClose();
  };

  const handleGoogleSignIn = () => {
    setErrorMsg("");
    setSavedNotice("");

    if (!humanChecked || challengeInput.trim() !== challenge.answer) {
      setErrorMsg(
        "Google orqali kirishdan oldin «Men robot emasman» tekshiruvini yakunlang."
      );
      return;
    }

    setGoogleLoading(true);

    const clientId = import.meta?.env?.VITE_GOOGLE_CLIENT_ID;

    const completeGoogleUser = (googleProfile = {}) => {
      const gEmail =
        googleProfile.email ||
        (email.trim().includes("@")
          ? email.trim().toLowerCase()
          : "student.google@gmail.com");
      const gName =
        googleProfile.name ||
        name.trim() ||
        gEmail.split("@")[0].replace(/[._]/g, " ");

      const googleUser = {
        id: `google_${Date.now()}`,
        name: gName,
        email: gEmail,
        phone: phone.trim() || "",
        provider: "google",
        avatar: googleProfile.picture || "",
        isPro: false,
        verifiedHuman: true,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      saveUserToStorage(googleUser);
      setGoogleLoading(false);
      setSavedNotice("Google akkaunt ma’lumotlari saqlandi!");

      if (typeof onSuccess === "function") {
        onSuccess(googleUser);
      }
      onClose();
    };

    if (clientId && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid profile email",
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch(
                  "https://www.googleapis.com/oauth2/v3/userinfo",
                  {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  }
                );
                const profile = await res.json();
                completeGoogleUser(profile);
              } catch {
                completeGoogleUser();
              }
            } else {
              setGoogleLoading(false);
              setErrorMsg("Google kirish bekor qilindi.");
            }
          },
        });
        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        console.error(err);
      }
    }

    // Agar VITE_GOOGLE_CLIENT_ID hali ulanmagan bo'lsa, darhol saqlanadigan Google sessiya yaratadi
    setTimeout(() => {
      completeGoogleUser();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-colors ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-cyan-500/30 bg-slate-900 text-slate-100"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
          <div>
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400">
              DEVLENS AI • XAVFSIZ KIRISH
            </span>
            <h2 className="mt-1 text-xl font-extrabold">
              {mode === "register" ? "Ro‘yxatdan o‘tish" : "Tizimga kirish"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700/70 px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
            }}
            className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
              mode === "register"
                ? "bg-cyan-400 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
              mode === "login"
                ? "bg-cyan-400 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kirish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Ism familiya
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Sardorbek Karimov"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email manzil
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Telefon raqam (ixtiyoriy, saqlanadi)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 4 ta belgi"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Robot emasligini tekshirish bloki */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={humanChecked}
                  onChange={(e) => setHumanChecked(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-400 cursor-pointer"
                />
                <span>Men robot emasman (Human check)</span>
              </label>

              <button
                type="button"
                onClick={refreshChallenge}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-slate-800 cursor-pointer"
              >
                ↻ Yangilash
              </button>
            </div>

            {humanChecked && (
              <div className="flex items-center gap-2.5 pt-1">
                <span className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-bold text-cyan-300">
                  {challenge.question}
                </span>
                <input
                  type="text"
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value)}
                  placeholder="Javobni yozing"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            )}

            <div className="text-[11px]">
              {isHumanVerified ? (
                <span className="font-semibold text-emerald-400">
                  ✓ Robot emasligingiz tasdiqlandi
                </span>
              ) : (
                <span className="text-slate-400">
                  Tasdiqlash uchun katakni bosing va misolni yeching
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300">
              {errorMsg}
            </div>
          )}

          {savedNotice && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
              {savedNotice}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:opacity-95 transition cursor-pointer"
          >
            {mode === "register"
              ? "Ro‘yxatdan o‘tish va Saqlash"
              : "Kirish va Saqlash"}
          </button>
        </form>

        <div className="my-3.5 flex items-center gap-3 text-[11px] text-slate-500">
          <div className="h-px flex-1 bg-slate-800" />
          <span>YOKI</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-white py-2.5 text-xs font-extrabold text-slate-900 shadow hover:bg-slate-100 transition disabled:opacity-60 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white">
            G
          </span>
          <span>
            {googleLoading ? "Google orqali ulanmoqda..." : "Google orqali kirish"}
          </span>
        </button>
      </div>
    </div>
  );
}