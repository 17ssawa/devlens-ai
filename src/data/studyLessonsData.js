import React, { useEffect, useMemo, useRef, useState } from "react";
import { STUDY_LESSONS, getUnlockedLessonOrders } from "../data/studyLessonsData";
import { MAX_SCORE, PASS_SCORE, evaluateStageScore } from "../data/platformData";

export default function StudyModal({
  isOpen,
  onClose,
  lessonScores = {},
  onCompleteLesson,
  theme = "dark"
}) {
  const isLight = theme === "light";

  const unlockedOrders = useMemo(
    () => getUnlockedLessonOrders(lessonScores),
    [lessonScores]
  );

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState(STUDY_LESSONS[0].id);

  // 'theory' (Kirish + 30m nazariya/ko'rsatish) -> 'game' (90m o'yin) -> 'quiz' (10 ta test)
  const [lessonStep, setLessonStep] = useState("theory");
  const [shownStepIndex, setShownStepIndex] = useState(0);

  const [gameChoice, setGameChoice] = useState(null);
  const [gameSolved, setGameSolved] = useState(false);
  const [gameNote, setGameNote] = useState("");

  const [answers, setAnswers] = useState({});
  const [quizSummary, setQuizSummary] = useState(null);
  const [animPhase, setAnimPhase] = useState(0);

  const previewCanvasRef = useRef(null);

  const currentLesson =
    STUDY_LESSONS.find((item) => item.id === activeLessonId) || STUDY_LESSONS[0];

  const isCurrentUnlocked = unlockedOrders.includes(currentLesson.order);

  const completedCount = useMemo(() => {
    return STUDY_LESSONS.filter((l) => (lessonScores?.[l.id] ?? 0) >= PASS_SCORE).length;
  }, [lessonScores]);

  const progressPercent = Math.round((completedCount / STUDY_LESSONS.length) * 100);

  const visibleLessons = useMemo(() => {
    if (selectedMonth === 0) return STUDY_LESSONS;
    return STUDY_LESSONS.filter((l) => l.monthNumber === selectedMonth);
  }, [selectedMonth]);

  const nextLesson = useMemo(() => {
    return STUDY_LESSONS.find((l) => l.order === currentLesson.order + 1) || null;
  }, [currentLesson]);

  useEffect(() => {
    if (!isOpen) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setAnimPhase((prev) => (prev + dt * 2.2) % 1000);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#091226");
    bg.addColorStop(1, "#050814");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const vType = currentLesson.visualType;

    if (vType === "spiral" || vType === "wave" || vType === "capstone") {
      ctx.beginPath();
      const total = 95;
      for (let i = 0; i < total; i += 1) {
        const angle = i * ((137.5 * Math.PI) / 180) + animPhase * 0.25;
        const radius =
          vType === "wave"
            ? 42
            : Math.min(w, h) * 0.4 * Math.sqrt((i + 1) / total);
        const px =
          vType === "wave"
            ? 24 + (i / total) * (w - 48)
            : cx + Math.cos(angle) * radius;
        const py =
          vType === "wave"
            ? cy + Math.sin(i * 0.25 + animPhase * 1.4) * 38
            : cy + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#22d3ee");
      g.addColorStop(0.5, "#a855f7");
      g.addColorStop(1, "#f472b6");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    } else if (vType === "graph" || vType === "path" || vType === "tree") {
      const nodes = [
        { x: cx, y: 26 },
        { x: cx - 105, y: 78 },
        { x: cx + 105, y: 78 },
        { x: cx - 155, y: 132 },
        { x: cx - 50, y: 132 },
        { x: cx + 50, y: 132 },
        { x: cx + 155, y: 132 }
      ];
      const edges = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]
      ];
      const activeNode = Math.floor(animPhase * 1.6) % nodes.length;

      edges.forEach(([a, b]) => {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });

      nodes.forEach((n, idx) => {
        const hit = idx === activeNode;
        ctx.fillStyle = hit ? "#f472b6" : "#22d3ee";
        ctx.beginPath();
        ctx.arc(n.x, n.y, hit ? 9 : 6.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      const count = 14;
      const gap = 8;
      const barW = (w - 48 - gap * (count - 1)) / count;
      const focusIdx = Math.floor(animPhase * 2) % count;

      for (let i = 0; i < count; i += 1) {
        const factor = 0.45 + 0.55 * Math.abs(Math.sin(animPhase * 0.6 + i * 0.5));
        const barH = 24 + factor * (h - 50);
        const x = 24 + i * (barW + gap);
        const y = h - 16 - barH;
        ctx.fillStyle = i === focusIdx ? "#34d399" : "#38bdf8";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, barW, barH, 5);
        } else {
          ctx.rect(x, y, barW, barH);
        }
        ctx.fill();
      }
    }
  }, [isOpen, currentLesson, animPhase]);

  if (!isOpen) return null;

  const resetLessonState = () => {
    setLessonStep("theory");
    setShownStepIndex(0);
    setGameChoice(null);
    setGameSolved(false);
    setGameNote("");
    setAnswers({});
    setQuizSummary(null);
  };

  const handleSelectLesson = (lesson) => {
    if (!unlockedOrders.includes(lesson.order)) return;
    setActiveLessonId(lesson.id);
    resetLessonState();
  };

  const handleRevealNextStep = () => {
    const total = currentLesson.showSteps?.length || 1;
    setShownStepIndex((prev) => (prev + 1) % total);
  };

  const handleCheckGame = () => {
    if (!isCurrentUnlocked || gameChoice === null) return;
    const ok = gameChoice === currentLesson.gameChallenge.correctIndex;
    setGameSolved(ok);
    setGameNote(
      ok
        ? currentLesson.gameChallenge.rewardNote
        : "O‘yin shartini yana bir bor ko‘rib chiqing va boshqa javobni sinang."
    );
  };

  const handleSelectQuizOption = (qIndex, optIndex) => {
    if (!isCurrentUnlocked) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleFinishTenQuiz = () => {
    if (!isCurrentUnlocked) return;
    const questions = currentLesson.quiz10 || [];
    let correctCount = 0;
    questions.forEach((item, idx) => {
      if (answers[idx] === item.correctIndex) {
        correctCount += 1;
      }
    });

    const rawScore = Math.round((correctCount / Math.max(1, questions.length)) * MAX_SCORE);
    const evaluated = evaluateStageScore(rawScore);

    setQuizSummary({
      ...evaluated,
      correctCount,
      totalCount: questions.length
    });

    if (typeof onCompleteLesson === "function") {
      onCompleteLesson(currentLesson.id, evaluated.score);
    }
  };

  const handleGoNextLesson = () => {
    if (!nextLesson) return;
    setActiveLessonId(nextLesson.id);
    setSelectedMonth(0);
    resetLessonState();
  };

  const answeredCount = Object.keys(answers).length;
  const allTenAnswered = answeredCount >= (currentLesson.quiz10?.length || 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md">
      <div
        className={`max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl border shadow-2xl transition-colors ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-cyan-500/30 bg-slate-900 text-slate-100"
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/85"
          }`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-400">
                📚 DEVLENS STUDY • ALOHIDA DARSLIK OYNASI
              </span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                {completedCount}/{STUDY_LESSONS.length} dars ({progressPercent}%)
              </span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold">
              2 Oylik Algoritmlar & Matematika Akademiyasi
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            ✕ Oynani Yopish
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 0, label: "Barcha Darslar (16)" },
                { id: 1, label: "1-Oy (1–8 Darslar)" },
                { id: 2, label: "2-Oy (9–16 Darslar)" }
              ].map((mTab) => (
                <button
                  key={mTab.id}
                  type="button"
                  onClick={() => setSelectedMonth(mTab.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                    selectedMonth === mTab.id
                      ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950"
                      : isLight
                        ? "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "border border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {mTab.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold opacity-80">
              O‘tish bali: <strong className="text-emerald-400">{PASS_SCORE}</strong> /{" "}
              <strong className="text-cyan-400">{MAX_SCORE}</strong> ball
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleLessons.map((lesson) => {
              const unlocked = unlockedOrders.includes(lesson.order);
              const bestScore = lessonScores?.[lesson.id] ?? 0;
              const isPassed = bestScore >= PASS_SCORE;
              const isSelected = currentLesson.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    !unlocked
                      ? isLight
                        ? "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-400 opacity-70"
                        : "cursor-not-allowed border-slate-800/80 bg-slate-950/50 text-slate-500 opacity-60"
                      : isSelected
                        ? "cursor-pointer border-cyan-400 bg-cyan-500/15 shadow ring-1 ring-cyan-400/40"
                        : isLight
                          ? "cursor-pointer border-slate-200 bg-white hover:border-cyan-400"
                          : "cursor-pointer border-slate-800 bg-slate-950/75 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span
                      className={
                        isPassed
                          ? "text-emerald-400"
                          : unlocked
                            ? "text-cyan-400"
                            : "text-slate-500"
                      }
                    >
                      {isPassed
                        ? `✓ ${lesson.order}-DARS`
                        : unlocked
                          ? `▶ ${lesson.order}-DARS • OCHIQ`
                          : `🔒 ${lesson.order}-DARS • YOPIQ`}
                    </span>
                    <span className="text-emerald-400">
                      {bestScore}/{MAX_SCORE}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs font-bold">{lesson.title}</div>
                </button>
              );
            })}
          </div>

          <div
            className={`space-y-5 rounded-2xl border p-5 ${
              isLight ? "border-slate-200 bg-slate-50/90" : "border-slate-800 bg-slate-950/80"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs font-bold text-fuchsia-400">
                  {currentLesson.month} • {currentLesson.durationLabel}
                </span>
                <h3 className="mt-1 text-xl font-extrabold">{currentLesson.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLessonStep("theory")}
                  className={`rounded-xl px-3 py-1.5 cursor-pointer ${
                    lessonStep === "theory"
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  1. Kirish & 30m Nazariya
                </button>
                <button
                  type="button"
                  onClick={() => setLessonStep("game")}
                  className={`rounded-xl px-3 py-1.5 cursor-pointer ${
                    lessonStep === "game"
                      ? "bg-fuchsia-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  2. 90m O‘yin & Amaliyot
                </button>
                <button
                  type="button"
                  disabled={!gameSolved}
                  onClick={() => setLessonStep("quiz")}
                  className={`rounded-xl px-3 py-1.5 ${
                    !gameSolved
                      ? "cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-500"
                      : lessonStep === "quiz"
                        ? "cursor-pointer bg-emerald-400 text-slate-950"
                        : "cursor-pointer bg-slate-800 text-emerald-300 hover:bg-slate-700"
                  }`}
                >
                  {gameSolved ? "3. 10 Talik Test (Ochiq)" : "🔒 3. 10 Talik Test"}
                </button>
              </div>
            </div>

            {lessonStep === "theory" && (
              <div className="space-y-4">
                <div
                  className={`rounded-2xl border p-4 text-sm leading-relaxed ${
                    isLight
                      ? "border-cyan-200 bg-cyan-50 text-slate-800"
                      : "border-cyan-500/30 bg-cyan-950/25 text-cyan-100"
                  }`}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                    Mavzuga Kirish
                  </div>
                  <p className="mt-1">{currentLesson.intro}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                  <div className="space-y-3 lg:col-span-7">
                    <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
                      30 Daqiqalik Nazariy Tushuntirish
                    </div>

                    {currentLesson.lecture30Min.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3.5 ${
                          isLight
                            ? "border-slate-200 bg-white"
                            : "border-slate-800 bg-slate-900/90"
                        }`}
                      >
                        <div className="text-xs font-bold text-cyan-400">{item.heading}</div>
                        <p className="mt-1 text-xs leading-relaxed opacity-90">{item.body}</p>
                      </div>
                    ))}

                    <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-300">
                          Amaliy Ko‘rsatib Berish ({shownStepIndex + 1}/
                          {currentLesson.showSteps.length})
                        </span>
                        <button
                          type="button"
                          onClick={handleRevealNextStep}
                          className="rounded-lg bg-amber-400 px-3 py-1 text-[11px] font-bold text-slate-950 hover:opacity-95 cursor-pointer"
                        >
                          Keyingi qadamni ko‘rsat →
                        </button>
                      </div>
                      <p className="text-xs text-slate-200">
                        {currentLesson.showSteps[shownStepIndex]}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLessonStep("game")}
                      className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 cursor-pointer"
                    >
                      Nazariyani Ko‘rdim — 90 Daqiqalik O‘yin & Amaliyotga O‘tish →
                    </button>
                  </div>

                  <div className="space-y-2 lg:col-span-5">
                    <div className="text-xs font-bold text-emerald-400">
                      Jonli Vizual Sahna: {currentLesson.algoName}
                    </div>
                    <canvas
                      ref={previewCanvasRef}
                      width={460}
                      height={220}
                      className="w-full rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {lessonStep === "game" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
                  90 Daqiqalik Darsga Oid O‘yin va Amaliy Mashg‘ulot
                </div>
                <h4 className="text-lg font-bold">{currentLesson.gameChallenge.title}</h4>
                <p className="text-sm opacity-90">{currentLesson.gameChallenge.instruction}</p>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {currentLesson.gameChallenge.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGameChoice(idx)}
                      className={`rounded-xl border p-3.5 text-left text-xs font-medium transition cursor-pointer ${
                        gameChoice === idx
                          ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                          : isLight
                            ? "border-slate-200 bg-white hover:border-fuchsia-400"
                            : "border-slate-800 bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={gameChoice === null}
                    onClick={handleCheckGame}
                    className="rounded-xl bg-gradient-to-r from-fuchsia-400 to-cyan-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 disabled:opacity-40 cursor-pointer"
                  >
                    O‘yin Javobini Tekshirish
                  </button>

                  {gameSolved && (
                    <button
                      type="button"
                      onClick={() => setLessonStep("quiz")}
                      className="rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 cursor-pointer"
                    >
                      10 Talik Yakuniy Testga O‘tish →
                    </button>
                  )}
                </div>

                {gameNote && (
                  <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3 text-xs text-cyan-200">
                    {gameNote}
                  </div>
                )}
              </div>
            )}

            {lessonStep === "quiz" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Dars Yakuniy 10 Talik Testi ({MAX_SCORE} ball • O‘tish: {PASS_SCORE} ball)
                    </span>
                    <h4 className="text-lg font-bold">
                      Javob berilgan savollar: {answeredCount} / {currentLesson.quiz10.length}
                    </h4>
                  </div>
                </div>

                <div className="max-h-[420px] space-y-3.5 overflow-y-auto pr-1">
                  {currentLesson.quiz10.map((qItem, qIdx) => (
                    <div
                      key={qIdx}
                      className={`space-y-2 rounded-xl border p-4 ${
                        isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/85"
                      }`}
                    >
                      <div className="text-xs font-bold text-cyan-400">
                        Savol #{qIdx + 1} / {currentLesson.quiz10.length}
                      </div>
                      <p className="text-sm font-semibold">{qItem.q}</p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        {qItem.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                            className={`rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                              answers[qIdx] === oIdx
                                ? "border-emerald-400 bg-emerald-500/20 font-semibold"
                                : isLight
                                  ? "border-slate-200 bg-slate-50 hover:border-emerald-400"
                                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!allTenAnswered}
                  onClick={handleFinishTenQuiz}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-lg disabled:opacity-40 cursor-pointer"
                >
                  10 Talik Testni Yakunlash & Ballni Hisoblash
                </button>

                {quizSummary && (
                  <div className="rounded-xl border border-emerald-500/40 bg-slate-900 p-4 text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-emerald-400">
                        {quizSummary.score} / {quizSummary.maxScore} ball ({quizSummary.correctCount}/
                        {quizSummary.totalCount} to‘g‘ri) — {quizSummary.statusLabel}
                      </span>
                      {quizSummary.passed && nextLesson && (
                        <button
                          type="button"
                          onClick={handleGoNextLesson}
                          className="rounded-lg bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:opacity-95 cursor-pointer"
                        >
                          Keyingi darsga o‘tish ({nextLesson.order}-dars) →
                        </button>
                      )}
                    </div>
                    <p className="opacity-90">
                      {quizSummary.passed
                        ? `Barakalla! ${PASS_SCORE}+ ball to‘pladingiz va ${nextLesson ? `${nextLesson.order}-dars` : "keyingi bosqich"} ochildi.`
                        : `Keyingi darsni ochish uchun kamida ${PASS_SCORE} ball kerak. Yana bir bor sinab ko‘ring.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}