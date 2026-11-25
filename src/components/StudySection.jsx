import React, { useEffect, useMemo, useRef, useState } from "react";
import { STUDY_LESSONS, getUnlockedLessonOrders } from "../data/studyLessonsData";
import { MAX_SCORE, PASS_SCORE, evaluateStageScore } from "../data/platformData";

export default function StudySection({ lessonScores = {}, onCompleteLesson, theme = "dark" }) {
  const isLight = theme === "light";

  const unlockedOrders = useMemo(
    () => getUnlockedLessonOrders(lessonScores),
    [lessonScores]
  );

  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = Barchasi, 1 = 1-oy, 2 = 2-oy
  const [activeLessonId, setActiveLessonId] = useState(STUDY_LESSONS[0].id);

  // Dars ichidagi bosqich: 'theory' (30m) -> 'game' (90m) -> 'quiz' (10 ta test)
  const [lessonStep, setLessonStep] = useState("theory");
  const [gameChoice, setGameChoice] = useState(null);
  const [gameSolved, setGameSolved] = useState(false);
  const [gameNote, setGameNote] = useState("");

  // 10 talik test holatlari
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

  // Jonli vizual sahna animatsiyasi
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setAnimPhase((prev) => (prev + dt * 2.3) % 1000);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
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
    bg.addColorStop(0, "#091124");
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
      const total = 90;
      for (let i = 0; i < total; i += 1) {
        const angle = i * ((137.5 * Math.PI) / 180) + animPhase * 0.25;
        const radius =
          vType === "wave"
            ? 40
            : Math.min(w, h) * 0.4 * Math.sqrt((i + 1) / total);
        const px =
          vType === "wave"
            ? 24 + (i / total) * (w - 48)
            : cx + Math.cos(angle) * radius;
        const py =
          vType === "wave"
            ? cy + Math.sin(i * 0.25 + animPhase * 1.4) * 36
            : cy + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const strokeGrad = ctx.createLinearGradient(0, 0, w, h);
      strokeGrad.addColorStop(0, "#22d3ee");
      strokeGrad.addColorStop(0.5, "#a855f7");
      strokeGrad.addColorStop(1, "#f472b6");
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    } else if (vType === "graph" || vType === "path" || vType === "tree") {
      const nodes = [
        { x: cx, y: 24 },
        { x: cx - 95, y: 72 },
        { x: cx + 95, y: 72 },
        { x: cx - 140, y: 120 },
        { x: cx - 45, y: 120 },
        { x: cx + 45, y: 120 },
        { x: cx + 140, y: 120 }
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
        const isHit = idx === activeNode;
        ctx.fillStyle = isHit ? "#f472b6" : "#22d3ee";
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHit ? 8.5 : 6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      const count = 12;
      const gap = 8;
      const barW = (w - 48 - gap * (count - 1)) / count;
      const focusIdx = Math.floor(animPhase * 2) % count;

      for (let i = 0; i < count; i += 1) {
        const factor = 0.45 + 0.55 * Math.abs(Math.sin(animPhase * 0.6 + i * 0.5));
        const barH = 22 + factor * (h - 46);
        const x = 24 + i * (barW + gap);
        const y = h - 14 - barH;
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
  }, [currentLesson, animPhase]);

  const resetLessonInternalState = () => {
    setLessonStep("theory");
    setGameChoice(null);
    setGameSolved(false);
    setGameNote("");
    setAnswers({});
    setQuizSummary(null);
  };

  const handleSelectLesson = (lesson) => {
    if (!unlockedOrders.includes(lesson.order)) return;
    setActiveLessonId(lesson.id);
    resetLessonInternalState();
  };

  const handleCheckGame = () => {
    if (!isCurrentUnlocked || gameChoice === null) return;
    const ok = gameChoice === currentLesson.gameChallenge.correctIndex;
    setGameSolved(ok);
    setGameNote(
      ok
        ? currentLesson.gameChallenge.rewardNote
        : "O‘yin shartini diqqat bilan tekshirib, boshqa variantni sinab ko‘ring."
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
    resetLessonInternalState();
  };

  const answeredCount = Object.keys(answers).length;
  const allTenAnswered = answeredCount >= (currentLesson.quiz10?.length || 10);

  return (
    <section
      className={`space-y-6 rounded-3xl border p-5 md:p-6 shadow-2xl transition-colors duration-300 ${
        isLight
          ? "border-slate-200/90 bg-white/95 text-slate-900"
          : "border-cyan-500/25 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 text-slate-100 backdrop-blur-xl"
      }`}
    >
      {/* Yuqori sarlavha va 2 oylik progress */}
      <div
        className={`flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${
          isLight ? "border-slate-200" : "border-slate-800/90"
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide ${
                isLight
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
              }`}
            >
              DEVLENS AI STUDY • 2 OYLIK (8 HAFTA • 16 DARS)
            </span>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {completedCount} / {STUDY_LESSONS.length} dars o‘zlashtirildi
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
            Tushuntirish → O‘yin & Amaliyot → 10 Talik Test
          </h2>
          <p className="mt-0.5 text-xs opacity-75">
            Har bir dars 2 soatlik formatda: 30 daqiqa nazariya/vizual, 90 daqiqa o‘yin/amaliyot va oxirida 10 talik test ({PASS_SCORE}/{MAX_SCORE} o‘tish bali).
          </p>
        </div>

        <div
          className={`min-w-[260px] rounded-2xl border p-3.5 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/80"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-cyan-400">2 oylik progress</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] opacity-75">
            <span>O‘tish: {PASS_SCORE} ball</span>
            <span>Maks: {MAX_SCORE} ball</span>
          </div>
        </div>
      </div>

      {/* Oy filtrlari */}
      <div className="flex flex-wrap items-center gap-2">
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
                ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md"
                : isLight
                  ? "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "border border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
            }`}
          >
            {mTab.label}
          </button>
        ))}
      </div>

      {/* Ketma-ket ochiladigan darslar ro'yxati */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              className={`rounded-2xl border p-3.5 text-left transition-all ${
                !unlocked
                  ? isLight
                    ? "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-400 opacity-70"
                    : "cursor-not-allowed border-slate-800/80 bg-slate-950/50 text-slate-500 opacity-60"
                  : isSelected
                    ? "cursor-pointer border-cyan-400 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-slate-900 shadow-lg ring-1 ring-cyan-400/40"
                    : isLight
                      ? "cursor-pointer border-slate-200 bg-white hover:border-cyan-400"
                      : "cursor-pointer border-slate-800 bg-slate-950/80 hover:border-cyan-500/40"
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
                    ? `✓ ${lesson.order}-DARS • O‘TILDI`
                    : unlocked
                      ? `▶ ${lesson.order}-DARS • OCHIQ`
                      : `🔒 ${lesson.order}-DARS • YOPIQ`}
                </span>
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-emerald-300">
                  {bestScore}/{MAX_SCORE}
                </span>
              </div>
              <div className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug">
                {lesson.title}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] opacity-75">
                <span>{lesson.month}</span>
                <span className="font-mono text-fuchsia-400">{lesson.bigO}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tanlangan dars ichidagi 3 bosqichli o'quv oqimi */}
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

          {/* 3 bosqich indikatori */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              type="button"
              disabled={!isCurrentUnlocked}
              onClick={() => setLessonStep("theory")}
              className={`rounded-xl px-3 py-1.5 cursor-pointer ${
                lessonStep === "theory"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              1. Tushuntirish (30m)
            </button>
            <button
              type="button"
              disabled={!isCurrentUnlocked}
              onClick={() => setLessonStep("game")}
              className={`rounded-xl px-3 py-1.5 cursor-pointer ${
                lessonStep === "game"
                  ? "bg-fuchsia-400 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              2. O‘yin & Amaliyot (90m)
            </button>
            <button
              type="button"
              disabled={!isCurrentUnlocked || !gameSolved}
              onClick={() => setLessonStep("quiz")}
              className={`rounded-xl px-3 py-1.5 ${
                !gameSolved
                  ? "cursor-not-allowed bg-slate-900 text-slate-500 border border-slate-800"
                  : lessonStep === "quiz"
                    ? "cursor-pointer bg-emerald-400 text-slate-950"
                    : "cursor-pointer bg-slate-800 text-emerald-300 hover:bg-slate-700"
              }`}
            >
              {gameSolved ? "3. 10 Talik Test (Ochiq)" : "🔒 3. 10 Talik Test"}
            </button>
          </div>
        </div>

        {/* 1-BOSQICH: 30 daqiqalik Tushuntirish + Jonli Vizual */}
        {lessonStep === "theory" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                30 Daqiqalik Nazariy va Mantiqiy Tushuntirish
              </div>
              {currentLesson.theoryBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3.5 text-sm leading-relaxed ${
                    isLight
                      ? "border-slate-200 bg-white text-slate-800"
                      : "border-slate-800 bg-slate-900/90 text-slate-200"
                  }`}
                >
                  {block}
                </div>
              ))}
              <button
                type="button"
                disabled={!isCurrentUnlocked}
                onClick={() => setLessonStep("game")}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 cursor-pointer"
              >
                Tushundim — 90 Daqiqalik O‘yin & Amaliyotga O‘tish →
              </button>
            </div>

            <div className="space-y-2 lg:col-span-5">
              <div className="text-xs font-bold text-fuchsia-400">
                Jonli Vizual Sahna: {currentLesson.algoName}
              </div>
              <canvas
                ref={previewCanvasRef}
                width={460}
                height={180}
                className="w-full rounded-xl border border-slate-800"
              />
            </div>
          </div>
        )}

        {/* 2-BOSQICH: 90 daqiqalik Darsga oid O'yin va Amaliyot */}
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
                  10 Talik Yakuniy Testni Boshlash →
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

        {/* 3-BOSQICH: Dars yakunidagi 10 talik test (111 ball / 80 o'tish bali) */}
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

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {currentLesson.quiz10.map((qItem, qIdx) => (
                <div
                  key={qIdx}
                  className={`rounded-xl border p-4 space-y-2.5 ${
                    isLight
                      ? "border-slate-200 bg-white"
                      : "border-slate-800 bg-slate-900/85"
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
                    ? `Tabriklaymiz! ${PASS_SCORE}+ ball to‘pladingiz va ${nextLesson ? `${nextLesson.order}-dars` : "keyingi bosqich"} ochildi.`
                    : `Keyingi darsni ochish uchun kamida ${PASS_SCORE} ball kerak. Qayta urinib ko‘ring.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}