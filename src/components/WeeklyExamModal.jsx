import React, { useMemo, useState } from "react";
import { WEEKLY_EXAMS } from "../data/weeklyExamsData";
import { MAX_SCORE, PASS_SCORE, evaluateStageScore } from "../data/platformData";

export default function WeeklyExamModal({
  isOpen,
  onClose,
  examScores = {},
  onCompleteExam,
  theme = "dark"
}) {
  const isLight = theme === "light";
  const [selectedExamId, setSelectedExamId] = useState(WEEKLY_EXAMS[0].id);
  const [answers, setAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);

  const currentExam = useMemo(
    () => WEEKLY_EXAMS.find((e) => e.id === selectedExamId) || WEEKLY_EXAMS[0],
    [selectedExamId]
  );

  if (!isOpen) return null;

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId);
    setAnswers({});
    setSubmittedResult(null);
  };

  const handlePickAnswer = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitExam = () => {
    const list = currentExam.questions || [];
    let correct = 0;
    list.forEach((item, idx) => {
      if (answers[idx] === item.correctIndex) {
        correct += 1;
      }
    });

    const rawScore = Math.round((correct / Math.max(1, list.length)) * MAX_SCORE);
    const evaluated = evaluateStageScore(rawScore);

    setSubmittedResult({
      ...evaluated,
      correct,
      total: list.length
    });

    if (typeof onCompleteExam === "function") {
      onCompleteExam(currentExam.id, evaluated.score);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= (currentExam.questions?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md md:p-5">
      <div
        className={`max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border shadow-2xl transition-colors ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-amber-500/30 bg-slate-900 text-slate-100"
        }`}
      >
        {/* Yuqori panel */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/75"
          }`}
        >
          <div>
            <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400">
              HAFTALIK NAZORAT ISHI • {PASS_SCORE}/{MAX_SCORE} O‘TISH BALI
            </span>
            <h2 className="mt-1 text-xl font-extrabold">
              Haftalik Bilimni Tekshirish & Tahlil Markazi
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
          {/* Haftalik nazorat ishlari tanlovi */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {WEEKLY_EXAMS.map((ex) => {
              const best = examScores?.[ex.id] ?? 0;
              const isSelected = ex.id === currentExam.id;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExam(ex.id)}
                  className={`rounded-2xl border p-3 text-left transition cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/15 shadow"
                      : isLight
                        ? "border-slate-200 bg-slate-50 hover:border-amber-400"
                        : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-400">{ex.week}-HAFTA</span>
                    <span className="text-emerald-400">
                      {best}/{MAX_SCORE}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs font-bold">{ex.title}</div>
                </button>
              );
            })}
          </div>

          {/* Tanlangan nazorat ishi ma'lumoti */}
          <div
            className={`rounded-2xl border p-4 ${
              isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/75"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold">{currentExam.title}</h3>
                <p className="mt-0.5 text-xs opacity-75">{currentExam.subtitle}</p>
              </div>
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-cyan-300">
                Javob: {answeredCount}/{currentExam.questions.length}
              </span>
            </div>
          </div>

          {/* Savollar ro'yxati */}
          <div className="space-y-3.5">
            {currentExam.questions.map((qItem, qIdx) => (
              <div
                key={qIdx}
                className={`space-y-2.5 rounded-2xl border p-4 ${
                  isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-950/60"
                }`}
              >
                <div className="text-xs font-bold text-cyan-400">
                  Nazorat savoli #{qIdx + 1}
                </div>
                <p className="text-sm font-semibold">{qItem.q}</p>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {qItem.options.map((opt, oIdx) => {
                    const picked = answers[qIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handlePickAnswer(qIdx, oIdx)}
                        className={`rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                          picked
                            ? "border-cyan-400 bg-cyan-500/20 font-semibold"
                            : isLight
                              ? "border-slate-200 bg-slate-50 hover:border-cyan-400"
                              : "border-slate-800 bg-slate-900 hover:border-slate-700"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submittedResult && (
                  <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-2.5 text-[11px] text-slate-300">
                    <strong className="text-emerald-400">Tushuntirish:</strong> {qItem.explain}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Yakunlash tugmasi va natija */}
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmitExam}
            className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-950 shadow-lg disabled:opacity-40 cursor-pointer"
          >
            Haftalik Nazorat Ishini Yakunlash & Ballni Saqlash
          </button>

          {submittedResult && (
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/90 p-4 text-xs space-y-1">
              <div className="text-sm font-extrabold text-emerald-400">
                {submittedResult.score} / {submittedResult.maxScore} ball ({submittedResult.correct}/
                {submittedResult.total} to‘g‘ri) — {submittedResult.statusLabel}
              </div>
              <p className="text-slate-300">
                {submittedResult.passed
                  ? `Ajoyib natija! Siz ${PASS_SCORE}+ ball to‘plab haftalik nazoratdan muvaffaqiyatli o‘tdingiz.`
                  : `O‘tish bali ${PASS_SCORE} ball. Mavzularni takrorlab, yana bir bor sinab ko‘ring.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}