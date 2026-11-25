import React, { useEffect, useRef, useState } from "react";

const PYTHON_TEMPLATES = [
  {
    id: "golden-spiral",
    title: "Oltin Burchak Spiral (137.5°)",
    badge: "Geometriya & Math",
    code: `import math

n = 36
golden_angle = math.radians(137.5)

for i in range(n):
    r = 6 * math.sqrt(i + 1)
    theta = i * golden_angle
    x = round(math.cos(theta) * r, 2)
    y = round(math.sin(theta) * r, 2)
    print(f"Nuqta #{i + 1}: r={round(r, 1)}, x={x}, y={y}")
`
  },
  {
    id: "harmonic-wave",
    title: "Sinus & Kosinus Fazaviy To‘lqin",
    badge: "Trigonometriya",
    code: `import math

steps = 24
for i in range(steps):
    t = i * 0.35
    sin_val = round(math.sin(t), 3)
    cos_val = round(math.cos(t), 3)
    print(f"qadam={i + 1} | sin={sin_val} | cos={cos_val}")
`
  },
  {
    id: "binary-steps",
    title: "Binary Search Qadamlar Sahnasi",
    badge: "Algoritm O(log n)",
    code: `arr = [2, 5, 9, 14, 19, 27, 35, 48, 63, 81]
target = 48
low, high = 0, len(arr) - 1
step = 0

while low <= high:
    step += 1
    mid = (low + high) // 2
    print(f"Qadam {step}: low={low}, mid={mid}, high={high}, val={arr[mid]}")
    if arr[mid] == target:
        print(f"Topildi! Indeks={mid}, qiymat={arr[mid]}")
        break
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
`
  }
];

function extractCoordsFromText(lines) {
  const points = [];
  const xyRegex = /x\s*=\s*(-?\d+(?:\.\d+)?)\s*,\s*y\s*=\s*(-?\d+(?:\.\d+)?)/i;
  const pairRegex = /\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/;

  lines.forEach((line, idx) => {
    const m1 = line.match(xyRegex);
    const m2 = line.match(pairRegex);
    if (m1) {
      points.push({ x: parseFloat(m1[1]), y: parseFloat(m1[2]), label: line, idx });
    } else if (m2) {
      points.push({ x: parseFloat(m2[1]), y: parseFloat(m2[2]), label: line, idx });
    }
  });

  if (points.length > 0) return points;

  // Agar koordinata topilmasa, qatorlar asosida spiral/to'lqin nuqtalarini chizamiz
  return lines.slice(0, 60).map((line, idx) => {
    const angle = idx * ((137.5 * Math.PI) / 180);
    const r = 8 + Math.sqrt(idx + 1) * 14;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      label: line,
      idx
    };
  });
}

function runFallbackEngine(code) {
  const lines = [];
  const trimmed = code.trim();

  if (!trimmed) {
    return {
      mode: "Lokal Dvigatel",
      error: null,
      prints: []
    };
  }

  // Oddiy sintaksis tekshiruvlari
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return {
      mode: "Lokal Dvigatel",
      error: "SyntaxError: Qavslar soni mos emas ('(' va ')' ni tekshiring).",
      prints: []
    };
  }

  const printMatches = [...code.matchAll(/print\s*\(([\s\S]*?)\)/g)];
  for (let i = 0; i < printMatches.length; i += 1) {
    const rawArg = printMatches[i][1].trim();
    const cleaned = rawArg
      .replace(/^f?["']|["']$/g, "")
      .replace(/\{[^}]+\}/g, "<qiymat>");
    lines.push(cleaned || `Natija #${i + 1}`);
  }

  if (lines.length === 0) {
    for (let i = 0; i < 18; i += 1) {
      const angle = i * ((137.5 * Math.PI) / 180);
      const r = 6 * Math.sqrt(i + 1);
      const x = (Math.cos(angle) * r).toFixed(2);
      const y = (Math.sin(angle) * r).toFixed(2);
      lines.push(`Nuqta #${i + 1}: x=${x}, y=${y}`);
    }
  }

  return {
    mode: "Lokal Zaxira Dvigatel",
    error: null,
    prints: lines.slice(0, 80)
  };
}

let pyodideInstancePromise = null;

async function getPyodideEngine() {
  if (typeof window === "undefined") return null;
  if (window.pyodideInstance) return window.pyodideInstance;
  if (pyodideInstancePromise) return pyodideInstancePromise;

  pyodideInstancePromise = (async () => {
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Pyodide yuklanmadi"));
          document.head.appendChild(script);
        });
      }
      if (typeof window.loadPyodide === "function") {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
        });
        window.pyodideInstance = py;
        return py;
      }
      return null;
    } catch {
      return null;
    }
  })();

  return pyodideInstancePromise;
}

export default function PythonStudioModal({ isOpen, onClose, theme = "dark" }) {
  const isLight = theme === "light";

  const [activeTemplateId, setActiveTemplateId] = useState(PYTHON_TEMPLATES[0].id);
  const [code, setCode] = useState(PYTHON_TEMPLATES[0].code);
  const [prints, setPrints] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [engineLabel, setEngineLabel] = useState("Tayyor");
  const [isRunning, setIsRunning] = useState(false);

  const canvasRef = useRef(null);

  const runCode = async (targetCode) => {
    setIsRunning(true);
    setErrorMsg(null);

    try {
      const pyodide = await getPyodideEngine();
      if (pyodide) {
        const wrappedScript = `
import sys, io, math
_buf = io.StringIO()
_old_out = sys.stdout
sys.stdout = _buf
try:
${targetCode
  .split("\n")
  .map((line) => "    " + line)
  .join("\n")}
finally:
    sys.stdout = _old_out
_buf.getvalue()
`;
        const stdoutText = await pyodide.runPythonAsync(wrappedScript);
        const outLines = String(stdoutText || "")
          .split("\n")
          .map((l) => l.trimEnd())
          .filter((l) => l.length > 0);

        setPrints(outLines.slice(0, 100));
        setEngineLabel("Pyodide (Real Python)");
      } else {
        const fallback = runFallbackEngine(targetCode);
        setPrints(fallback.prints);
        setErrorMsg(fallback.error);
        setEngineLabel(fallback.mode);
      }
    } catch (err) {
      const cleanErr = String(err?.message || err || "Python bajarishda xatolik yuz berdi.");
      const lastLine = cleanErr.split("\n").filter(Boolean).slice(-2).join(" — ");
      setErrorMsg(lastLine || cleanErr);
      setPrints([]);
      setEngineLabel("Xato Aniqlangan");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    runCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Natijalar asosida Canvas chizmasi
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#081022");
    bg.addColorStop(1, "#050712");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // O'qlar
    ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    if (errorMsg) {
      ctx.fillStyle = "#fda4af";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Xatolik tufayli chizma to‘xtatildi", cx, cy);
      return;
    }

    const pts = extractCoordsFromText(prints);
    if (pts.length === 0) return;

    const maxAbs = Math.max(
      25,
      ...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)))
    );
    const scale = (Math.min(w, h) * 0.4) / maxAbs;

    ctx.beginPath();
    pts.forEach((p, i) => {
      const px = cx + p.x * scale;
      const py = cy - p.y * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.5, "#a855f7");
    grad.addColorStop(1, "#34d399");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    pts.forEach((p, i) => {
      const px = cx + p.x * scale;
      const py = cy - p.y * scale;
      ctx.fillStyle = i === pts.length - 1 ? "#f472b6" : "#22d3ee";
      ctx.beginPath();
      ctx.arc(px, py, i === pts.length - 1 ? 5.5 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [isOpen, prints, errorMsg]);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl) => {
    setActiveTemplateId(tpl.id);
    setCode(tpl.code);
    runCode(tpl.code);
  };

  const handleResetTemplate = () => {
    const found =
      PYTHON_TEMPLATES.find((t) => t.id === activeTemplateId) || PYTHON_TEMPLATES[0];
    setCode(found.code);
    runCode(found.code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md md:p-5">
      <div
        className={`max-h-[93vh] w-full max-w-6xl overflow-y-auto rounded-3xl border shadow-2xl transition-colors ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-cyan-500/30 bg-slate-900 text-slate-100"
        }`}
      >
        {/* Yuqori panel */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/80"
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-0.5 text-xs font-bold text-cyan-400">
                🐍 DEVLENS PYTHON STUDIO
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Dvigatel: {engineLabel}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold">
              Kod → Print Kartochkalar & Geometrik Vizualizatsiya
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            ✕ Yopish
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Shablonlar qatori */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {PYTHON_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeTemplateId === tpl.id
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : isLight
                        ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetTemplate}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
              >
                ↺ Asl shablon
              </button>
              <button
                type="button"
                disabled={isRunning}
                onClick={() => runCode(code)}
                className="rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? "⏳ Ishlamoqda..." : "▶ Kodni Ishga Tushirish"}
              </button>
            </div>
          </div>

          {/* Asosiy 2 ustun: Chapda kod muharriri, o'ngda Canvas + Print kartochkalar */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-6">
              <div className="text-xs font-bold text-cyan-400">Python Kod Muharriri</div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={17}
                spellCheck={false}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-4 lg:col-span-6">
              <div>
                <div className="mb-1.5 text-xs font-bold text-fuchsia-400">
                  Vizual Koordinata / Chizma Sahnasi
                </div>
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={190}
                  className="w-full rounded-2xl border border-slate-800"
                />
              </div>

              {errorMsg ? (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-200">
                  <div className="font-extrabold text-rose-400">Xato Kartochkasi</div>
                  <pre className="mt-1.5 whitespace-pre-wrap font-mono text-xs">{errorMsg}</pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Print Kartochkalari ({prints.length})</span>
                    <span className="text-[11px] font-normal opacity-75">Har bir qator = 1 kartochka</span>
                  </div>
                  <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {prints.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border px-3 py-2 font-mono text-xs ${
                          isLight
                            ? "border-slate-200 bg-slate-50 text-slate-800"
                            : "border-slate-800 bg-slate-950/80 text-cyan-200"
                        }`}
                      >
                        <span className="mr-1.5 text-[10px] font-bold text-fuchsia-400">
                          #{idx + 1}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}