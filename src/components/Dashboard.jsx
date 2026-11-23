import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
  Cpu, Sparkles, Layers, Bookmark,
  Terminal, Sliders, CheckCircle2, Shuffle, Plus, PlayCircle, X,
  Trash2, ArrowUpRight, Award, Flame, Clock, Check, AlertCircle, Lock, LogIn,
  Bot, Send, Code2, MessageSquare, Lightbulb, RefreshCw, Copy, Zap, Trophy, GitBranch, Bug, ListOrdered, Medal, Download
} from 'lucide-react';
import { askAiMentor, getInterviewScenarios, evaluateInterviewAnswer } from '../services/aiEngine';
import GraphVisualizer from './GraphVisualizer';

const INITIAL_PRESETS = {
  bubbleAsc: {
    name: "Bubble (O'sish)",
    complexity: { time: "O(n²)", space: "O(1)" },
    code: `// Bubble Sort (O'sish tartibida)
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`
  },
  quickSort: {
    name: "Quick Sort",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    code: `// Quick Sort (Tezkor saralash)
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },
  bubbleDesc: {
    name: "Bubble (Teskari)",
    complexity: { time: "O(n²)", space: "O(1)" },
    code: `// Bubble Sort (Kamayish tartibida)
function reverseBubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] < arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`
  },
  selection: {
    name: "Selection Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    code: `// Selection Sort (Tanlab saralash)
function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`
  }
};

const BUG_HUNT_SNIPPET = `// Bug Hunt vazifasi: bu kodda 2 ta xato bor! Topib to'g'rilang
function buggyBubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (arr[j] < arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`;

const TEST_CASES = [
  { id: 'worst', label: 'Teskari', values: [45, 36, 28, 19, 11, 5] },
  { id: 'best', label: 'Saralangan', values: [5, 11, 19, 28, 36, 45] },
  { id: 'dups', label: 'Takroriy', values: [14, 7, 14, 22, 7, 14] }
];

const DAILY_CHALLENGES = [
  {
    id: 'dc-1',
    title: "Quick Sort qadamlarini tahlil qiling",
    desc: "Quick Sort shablonini tanlang va kamida 3 ta qadamni ko'rib chiqing.",
    xp: 50,
    presetKey: 'quickSort'
  },
  {
    id: 'dc-2',
    title: "Eng yomon holatni sinang",
    desc: "Teskari tartibdagi massiv bilan Bubble Sort qanday ishlashini kuzating.",
    xp: 40,
    presetKey: 'bubbleAsc',
    testValues: [45, 36, 28, 19, 11, 5]
  },
  {
    id: 'dc-3',
    title: "Selection Sort minimal qiymatini toping",
    desc: "Selection Sort algoritmini ishga tushirib, eng kichik element qanday tanlanishini ko'ring.",
    xp: 45,
    presetKey: 'selection'
  }
];

const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    company: "Google",
    difficulty: "O'rta",
    question: "Quick Sort algoritmining o'rtacha va eng yomon holatdagi vaqt murakkabligi (Time Complexity) qanday?",
    options: [
      "O'rtacha: O(n log n), Eng yomon: O(n²)",
      "O'rtacha: O(n²), Eng yomon: O(n log n)",
      "Har doim O(n log n)",
      "O'rtacha: O(n), Eng yomon: O(n²)"
    ],
    correct: 0,
    explanation: "Pivot har safar eng katta yoki eng kichik elementga tushib qolsa, Quick Sort O(n²) ga tushadi."
  },
  {
    id: 2,
    company: "Amazon",
    difficulty: "Oson",
    question: "Bubble Sort algoritmi qancha qo'shimcha xotira (Space Complexity) talab qiladi?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: 2,
    explanation: "Bubble Sort 'in-place' saralash algoritmi bo'lib, faqat bitta vaqtinchalik o'zgaruvchi uchun O(1) xotira ishlatadi."
  },
  {
    id: 3,
    company: "Meta",
    difficulty: "Qiyin",
    question: "Qaysi saralash algoritmi har qanday holatda ham O(n log n) vaqtni kafolatlaydi va barqaror (stable) hisoblanadi?",
    options: ["Quick Sort", "Selection Sort", "Merge Sort", "Heap Sort"],
    correct: 2,
    explanation: "Merge Sort massivni teng ikkiga bo'lib birlashtirgani uchun eng yomon holatda ham O(n log n) vaqtni kafolatlaydi."
  }
];

function detectComplexity(codeStr) {
  if (/quickSort|partition|mergeSort/i.test(codeStr)) {
    return { time: "O(n log n)", space: "O(log n)" };
  }
  const forCount = (codeStr.match(/\b(for|while)\b/g) || []).length;
  if (forCount >= 2) return { time: "O(n²)", space: "O(1)" };
  if (forCount === 1) return { time: "O(n)", space: "O(1)" };
  return { time: "O(1)", space: "O(1)" };
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Umumiy', fullLabel: 'Umumiy ko‘rinish', icon: Layers },
  { id: 'visualizer', label: 'Studiya', fullLabel: 'Algoritm Studiyasi', icon: Cpu },
  { id: 'graphs', label: 'Graflar', fullLabel: 'Graf & Yo‘llar', icon: GitBranch },
  { id: 'saved', label: 'Saqlangan', fullLabel: 'Saqlangan kodlar', icon: Bookmark },
  { id: 'interview', label: 'Suhbat', fullLabel: 'Texnik suhbat', icon: Terminal },
];

export default function Dashboard({ user, onOpenAuth, theme = 'dark' }) {
  const isLight = theme === 'light';

  const [presets, setPresets] = useState(INITIAL_PRESETS);
  const [activePreset, setActivePreset] = useState('bubbleAsc');
  const [userCode, setUserCode] = useState(INITIAL_PRESETS.bubbleAsc.code);
  const [codeError, setCodeError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showTraceLog, setShowTraceLog] = useState(false);
  const [bugFixedCount, setBugFixedCount] = useState(0);

  // XP, Streak va Kunlik vazifalar
  const [xp, setXp] = useState(() => {
    try {
      return Number(localStorage.getItem('devlens_xp') || 120);
    } catch {
      return 120;
    }
  });
  const [streak, setStreak] = useState(() => {
    try {
      return Number(localStorage.getItem('devlens_streak') || 3);
    } catch {
      return 3;
    }
  });
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem('devlens_challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [liteMotion, setLiteMotion] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('devlens_xp', String(xp));
      localStorage.setItem('devlens_streak', String(streak));
      localStorage.setItem('devlens_challenges', JSON.stringify(completedChallenges));
    } catch (e) {
      console.error(e);
    }
  }, [xp, streak, completedChallenges]);

  const awardXp = (amount, reasonText) => {
    setXp((prev) => prev + amount);
    setConsoleMsg(`+${amount} XP! ${reasonText}`);
  };

  const handleCompleteChallenge = (challenge) => {
    if (challenge.presetKey) {
      handleSelectPreset(challenge.presetKey);
    }
    if (challenge.testValues) {
      setIsPlaying(false);
      setRawInput(challenge.testValues.join(', '));
      setArray(challenge.testValues.map((val, idx) => ({ id: `dc-${idx}-${Date.now()}`, val })));
    }
    setActiveMenu('visualizer');
    if (!completedChallenges.includes(challenge.id)) {
      setCompletedChallenges((prev) => [...prev, challenge.id]);
      setXp((prev) => prev + challenge.xp);
      setStreak((prev) => prev + 1);
      setConsoleMsg(`Vazifa bajarildi: "${challenge.title}" (+${challenge.xp} XP, +1 kunlik seriya)!`);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopiedCode(true);
      setConsoleMsg("Kod vaqtinchalik xotiraga nusxalandi.");
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setConsoleMsg("Nusxalashda brauzer ruxsati cheklangan.");
    }
  };

  const handleDownloadSummary = () => {
    const algoTitle = presets[activePreset]?.name || 'Custom Algoritm';
    const traceLines = steps
      .map((s, idx) => `${idx + 1}. ${s.explanation}`)
      .join('\n');

    const mdContent = [
      `# DevLens 3D — Algoritm Konspekti`,
      ``,
      `- **Algoritm:** ${algoTitle}`,
      `- **Vaqt murakkabligi (Time):** ${liveComplexity.time}`,
      `- **Xotira murakkabligi (Space):** ${liveComplexity.space}`,
      `- **Test massivi:** [${array.map((it) => it.val).join(', ')}]`,
      `- **Jami qadamlar:** ${steps.length}`,
      ``,
      `## JavaScript Kodi`,
      '```javascript',
      userCode,
      '```',
      ``,
      `## Qadamma-qadam Ijro Logi`,
      traceLines || '1. Tayyor.'
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${algoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-konspekt.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setConsoleMsg(`"${algoTitle}" konspekti (.md) yuklab olindi!`);
  };

  const handleLoadBugHunt = () => {
    setIsPlaying(false);
    setUserCode(BUG_HUNT_SNIPPET);
    setCodeError(null);
    setConsoleMsg("Bug Hunt kodi yuklandi! Xatolarni topib, to'g'rilang va 'Tahlil' tugmasini bosing.");
  };

  // AI Kod Mentori va Umumiy AI Yordamchi
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: "Salom! Men AI Yordamchiman. Dasturlash, algoritmlar yoki istalgan boshqa mavzuda savol bering — batafsil javob beraman."
    }
  ]);

  // 2-bosqichli Texnik Suhbat Simulyatori
  const scenarios = getInterviewScenarios();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [interviewStage, setInterviewStage] = useState(1);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewScores, setInterviewScores] = useState([]);
  const [showInterviewReport, setShowInterviewReport] = useState(false);
  const [interviewChat, setInterviewChat] = useState(() => {
    const first = getInterviewScenarios()[0];
    return [
      {
        id: 'init-interviewer',
        role: 'ai',
        stage: 1,
        text: `${first.company} (${first.role}) texnik suhbatiga xush kelibsiz!\n\n1-bosqich savol: ${first.question}`
      }
    ];
  });

  // Saqlangan kodlar
  const [savedCodes, setSavedCodes] = useState([]);

  useEffect(() => {
    if (!user || !user.email) {
      setSavedCodes([]);
      return;
    }
    try {
      const storageKey = `devlens_saved_codes_${user.email}`;
      const local = localStorage.getItem(storageKey);
      setSavedCodes(local ? JSON.parse(local) : []);
    } catch {
      setSavedCodes([]);
    }
  }, [user]);

  const persistSavedCodes = (updatedList) => {
    setSavedCodes(updatedList);
    if (user && user.email) {
      try {
        localStorage.setItem(`devlens_saved_codes_${user.email}`, JSON.stringify(updatedList));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlgoName, setNewAlgoName] = useState("");
  const [newAlgoCode, setNewAlgoCode] = useState("function myAlgo(arr) {\n  // O'z algoritmik kodingizni yozing\n  return arr;\n}");

  const [rawInput, setRawInput] = useState("18, 7, 29, 4, 12, 22");
  const [array, setArray] = useState([
    { id: '1', val: 18 },
    { id: '2', val: 7 },
    { id: '3', val: 29 },
    { id: '4', val: 4 },
    { id: '5', val: 12 },
    { id: '6', val: 22 },
  ]);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [activeMenu, setActiveMenu] = useState('visualizer');
  const [consoleMsg, setConsoleMsg] = useState("Muharrir tayyor. Kod yozing yoki shablon tanlang.");
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const executeUserCode = useCallback((arrData, codeToRun) => {
    const workingItems = arrData.map(item => ({ ...item }));
    const rawValues = workingItems.map(item => item.val);
    const history = [];
    let opsCount = 0;
    const MAX_OPS = 600;

    const snapshot = () => workingItems.map(item => ({ ...item }));

    history.push({
      array: snapshot(),
      comparing: [],
      swapping: [],
      sorted: [],
      explanation: "Boshlang'ich holat. Foydalanuvchi kodi ishga tushirilmoqda..."
    });

    const fnMatch = codeToRun.match(/function\s+([a-zA-Z0-9_$]+)/);
    const entryFnName = fnMatch ? fnMatch[1] : null;

    if (!entryFnName) {
      throw new Error("Kodingizda kamida bitta 'function nomi(arr)' bo'lishi kerak.");
    }

    let lastReadIdx = null;
    let pendingSwap = [];

    const proxyArr = new Proxy(rawValues, {
      get(target, prop) {
        const idx = Number(prop);
        if (!isNaN(idx) && prop !== 'length') {
          opsCount++;
          if (opsCount > MAX_OPS) {
            throw new Error("Cheksiz sikl aniqlandi (600 dan ortiq operatsiya). Kod to'xtatildi.");
          }

          if (lastReadIdx !== null && lastReadIdx !== idx) {
            history.push({
              array: snapshot(),
              comparing: [lastReadIdx, idx],
              swapping: [],
              sorted: [],
              explanation: `Solishtirish / O'qish: arr[${lastReadIdx}] (${target[lastReadIdx]}) va arr[${idx}] (${target[idx]}).`
            });
            lastReadIdx = null;
          } else {
            lastReadIdx = idx;
          }
        }
        return Reflect.get(target, prop);
      },
      set(target, prop, newValue) {
        const idx = Number(prop);
        if (!isNaN(idx)) {
          opsCount++;
          if (opsCount > MAX_OPS) {
            throw new Error("Cheksiz sikl aniqlandi. Kod to'xtatildi.");
          }

          const oldValue = target[idx];
          const result = Reflect.set(target, prop, newValue);

          const existingMatch = workingItems.find((it, i) => it.val === newValue && i !== idx);
          workingItems[idx] = {
            id: existingMatch ? `${existingMatch.id}-s${opsCount}` : `item-${idx}-${opsCount}`,
            val: newValue
          };

          pendingSwap.push(idx);
          if (pendingSwap.length >= 2 || oldValue !== newValue) {
            const activeIndices = [...new Set(pendingSwap)].slice(-2);
            history.push({
              array: snapshot(),
              comparing: [],
              swapping: activeIndices,
              sorted: [],
              explanation: `Qiymat o'zgardi: arr[${idx}] = ${newValue} (oldingisi: ${oldValue}).`
            });
            if (pendingSwap.length >= 2) pendingSwap = [];
          }
          return result;
        }
        return Reflect.set(target, prop, newValue);
      }
    });

    const runner = new Function('arr', `${codeToRun}\nreturn ${entryFnName}(arr);`);
    runner(proxyArr);

    history.push({
      array: snapshot(),
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: workingItems.length }, (_, idx) => idx),
      explanation: `Muvaffaqiyatli! ${entryFnName}() funksiyasi ${history.length - 1} ta qadamda yakunlandi.`
    });

    return history;
  }, []);

  useEffect(() => {
    try {
      const computedSteps = executeUserCode(array, userCode);
      setSteps(computedSteps);
      setCurrentStep(0);
      setCodeError(null);
    } catch (err) {
      setCodeError(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array, activePreset]);

  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          awardXp(15, "Algoritm qadamlari to'liq ko'rib chiqildi.");
          return prev;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps, speed]);

  const handleSelectPreset = (key) => {
    setIsPlaying(false);
    setActivePreset(key);
    setUserCode(presets[key].code);
    setCodeError(null);
    setConsoleMsg(`Shablon yuklandi: ${presets[key].name}.`);
  };

  const handleRunCode = () => {
    setIsPlaying(false);
    try {
      const computedSteps = executeUserCode(array, userCode);
      setSteps(computedSteps);
      setCurrentStep(0);
      setCodeError(null);
      setIsPlaying(true);

      if (userCode.includes('buggyBubbleSort') && userCode.includes('n - i - 1')) {
        setBugFixedCount((c) => c + 1);
        awardXp(30, "Bug Hunt muvaffaqiyatli tuzatildi!");
      } else {
        setConsoleMsg(`Kompilyatsiya muvaffaqiyatli! ${computedSteps.length} ta qadam aniqlandi.`);
      }
    } catch (err) {
      setCodeError(err.message);
      setConsoleMsg(`Xatolik: ${err.message}`);
    }
  };

  const handleSendMentorMessage = async (customPromptText = null) => {
    const textToSend = (customPromptText ?? mentorInput).trim();
    if (!textToSend || isMentorLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: textToSend };
    const nextHistory = [...mentorMessages, userMsg];
    setMentorMessages(nextHistory);
    if (!customPromptText) setMentorInput("");
    setIsMentorLoading(true);

    try {
      const aiResult = await askAiMentor({
        prompt: textToSend,
        currentCode: activeMenu === 'visualizer' ? userCode : '',
        codeError: activeMenu === 'visualizer' ? codeError : null,
        history: nextHistory
      });

      const complexityNote =
        activeMenu === 'visualizer' && /murakkablik|o\(/i.test(textToSend)
          ? `\n\nJoriy kod murakkabligi: Vaqt ${liveComplexity.time}, Xotira ${liveComplexity.space}.`
          : "";

      const aiMsg = {
        id: `ai-${Date.now() + 1}`,
        role: 'ai',
        text: `${aiResult.reply}${complexityNote}`,
        suggestedCode: aiResult.suggestedCode || null
      };

      setMentorMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsMentorLoading(false);
    }
  };

  const handleApplySuggestedCode = (code, runImmediately = false) => {
    setUserCode(code);
    setCodeError(null);
    setActiveMenu('visualizer');
    if (runImmediately) {
      setIsPlaying(false);
      try {
        const computedSteps = executeUserCode(array, code);
        setSteps(computedSteps);
        setCurrentStep(0);
        setIsPlaying(true);
        setConsoleMsg("AI Mentor kodi muharrirga joylandi va 3D da ishga tushdi!");
      } catch (err) {
        setCodeError(err.message);
        setConsoleMsg(`Xatolik: ${err.message}`);
      }
    } else {
      setConsoleMsg("AI Mentor tavsiya qilgan kod muharrirga joylandi.");
    }
  };

  const handleSelectScenario = (idx) => {
    setActiveScenarioIdx(idx);
    setInterviewStage(1);
    setShowInterviewReport(false);
    const sc = scenarios[idx];
    setInterviewAnswer("");
    setInterviewChat([
      {
        id: `sc-${sc.id}-${Date.now()}`,
        role: 'ai',
        stage: 1,
        text: `${sc.company} (${sc.role}) suhbatiga o'tdik.\n\n1-bosqich savol: ${sc.question}`
      }
    ]);
  };

  const handleSubmitInterviewAnswer = (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim()) return;

    const currentSc = scenarios[activeScenarioIdx];
    const userBubble = { id: `ia-u-${Date.now()}`, role: 'user', text: interviewAnswer.trim() };
    const evalResult = evaluateInterviewAnswer({
      scenario: currentSc,
      answerText: interviewAnswer,
      stage: interviewStage
    });

    const numericScore = typeof evalResult.score === 'number' ? evalResult.score : 80;
    setInterviewScores((prev) => [
      ...prev,
      {
        company: currentSc.company,
        topic: `${currentSc.topic} (${interviewStage}-bosqich)`,
        score: numericScore
      }
    ]);
    setXp((prev) => prev + Math.round(numericScore / 4));

    const aiBubble = {
      id: `ia-ai-${Date.now() + 1}`,
      role: 'ai',
      score: numericScore,
      stage: interviewStage,
      text: `${evalResult.feedback}\n\n${evalResult.followUp}`
    };

    setInterviewChat(prev => [...prev, userBubble, aiBubble]);
    setInterviewAnswer("");
    if (interviewStage === 1) {
      setInterviewStage(2);
    }
  };

  const handleSaveCurrentCode = () => {
    if (!user) {
      setConsoleMsg("Kodni saqlash uchun avval ro'yxatdan o'ting yoki tizimga kiring!");
      onOpenAuth();
      return;
    }

    const titleMatch = userCode.match(/function\s+([a-zA-Z0-9_$]+)/);
    const autoTitle = titleMatch ? `${titleMatch[1]}()` : `Custom Algoritm #${savedCodes.length + 1}`;
    const detected = detectComplexity(userCode);

    const newItem = {
      id: `save-${Date.now()}`,
      title: autoTitle,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      complexity: detected.time,
      code: userCode
    };
    persistSavedCodes([newItem, ...savedCodes]);
    setConsoleMsg(`"${autoTitle}" shaxsiy akkauntingizga saqlandi!`);
  };

  const handleAddNewAlgorithm = (e) => {
    e.preventDefault();
    if (!newAlgoName.trim()) return;

    const key = `custom_${Date.now()}`;
    const detected = detectComplexity(newAlgoCode);
    setPresets(prev => ({
      ...prev,
      [key]: {
        name: newAlgoName.trim(),
        complexity: detected,
        code: newAlgoCode
      }
    }));
    setActivePreset(key);
    setUserCode(newAlgoCode);
    setIsModalOpen(false);
    setNewAlgoName("");
    setConsoleMsg(`Yangi algoritm qo'shildi: "${newAlgoName}".`);
  };

  const handleApplyCustomArray = (e) => {
    e.preventDefault();
    const numbers = rawInput
      .split(',')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n))
      .slice(0, 8);
    if (numbers.length === 0) return;
    setIsPlaying(false);
    setArray(numbers.map((val, idx) => ({ id: `custom-${idx}-${Date.now()}`, val })));
  };

  const handleApplyTestCase = (values) => {
    setIsPlaying(false);
    setRawInput(values.join(', '));
    setArray(values.map((val, idx) => ({ id: `tc-${idx}-${Date.now()}`, val })));
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const randomNums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 5);
    setRawInput(randomNums.join(', '));
    setArray(randomNums.map((val, idx) => ({ id: `rand-${idx}-${Date.now()}`, val })));
  };

  const currentData = steps[currentStep] || {
    array,
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: "Tayyor."
  };

  const liveComplexity = detectComplexity(userCode);
  const currentScenario = scenarios[activeScenarioIdx];
  const avgInterviewScore =
    interviewScores.length > 0
      ? Math.round(interviewScores.reduce((acc, item) => acc + item.score, 0) / interviewScores.length)
      : 0;

  const badges = [
    {
      id: 'b-start',
      title: "Ilk Qadam",
      desc: "100+ XP to'pladingiz",
      unlocked: xp >= 100
    },
    {
      id: 'b-daily',
      title: "Algoritm Ustasi",
      desc: "Kamida 1 ta kunlik vazifani bajardingiz",
      unlocked: completedChallenges.length >= 1
    },
    {
      id: 'b-streak',
      title: "Olovli Seriya",
      desc: "3+ kunlik uzluksiz mashq seriyasi",
      unlocked: streak >= 3
    },
    {
      id: 'b-interview',
      title: "Suhbat Chempioni",
      desc: "Texnik suhbatda 80+ ball oldingiz",
      unlocked: interviewScores.some((s) => s.score >= 80)
    },
    {
      id: 'b-bug',
      title: "Xato Ovchisi",
      desc: "Bug Hunt kodini muvaffaqiyatli tuzatdingiz",
      unlocked: bugFixedCount >= 1
    },
    {
      id: 'b-saved',
      title: "Kolleksioner",
      desc: "Kamida 1 ta kodni saqlab qo'ydingiz",
      unlocked: savedCodes.length >= 1
    }
  ];

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const codeLines = userCode.split('\n');

  const surfaceClass = isLight
    ? 'bg-white/90 border-slate-200/90 text-slate-900 shadow-sm'
    : 'bg-[#080b14]/75 border-white/10 text-slate-200 backdrop-blur-xl';

  const codeBlockClass = isLight
    ? 'bg-slate-50 border-slate-200 text-indigo-950'
    : 'bg-[#04060b] border-white/10 text-cyan-200';

  const mutedTextClass = isLight ? 'text-slate-600' : 'text-slate-400';
  const headingTextClass = isLight ? 'text-slate-900' : 'text-white';

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] lg:overflow-hidden select-none relative transition-colors duration-300 ${
        isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-slate-200'
      }`}
    >
      {/* Yangi algoritm qo'shish Modali */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={liteMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl space-y-5 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/15 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold flex items-center gap-2 ${headingTextClass}`}>
                  <Plus className="w-4 h-4 text-cyan-500" /> Yangi algoritm qo&apos;shish
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewAlgorithm} className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${mutedTextClass}`}>Algoritm nomi</label>
                  <input
                    type="text"
                    required
                    value={newAlgoName}
                    onChange={(e) => setNewAlgoName(e.target.value)}
                    placeholder="Masalan: Insertion Sort"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#05070c] border-white/15 text-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${mutedTextClass}`}>JavaScript kodi</label>
                  <textarea
                    rows={6}
                    value={newAlgoCode}
                    onChange={(e) => setNewAlgoCode(e.target.value)}
                    className={`w-full border rounded-xl p-3.5 text-xs font-mono focus:outline-none focus:border-cyan-500 transition resize-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#04060b] border-white/15 text-cyan-100'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 transition cursor-pointer"
                  >
                    Qo&apos;shish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobil bo'limlar paneli */}
      <div
        className={`lg:hidden border-b px-3 py-2 flex items-center gap-1.5 overflow-x-auto ${
          isLight ? 'bg-white/90 border-slate-200 backdrop-blur-md' : 'bg-[#080b14]/85 border-white/10 backdrop-blur-md'
        }`}
      >
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          const isLocked = item.id === 'saved' && !user;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-sm'
                  : isLight
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-white/[0.04] text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {isLocked && <Lock className="w-3 h-3 opacity-75" />}
            </button>
          );
        })}
      </div>

      {/* Desktop chap menyu */}
      <aside
        className={`w-64 border-r p-4 hidden lg:flex flex-col justify-between transition-colors duration-300 ${
          isLight ? 'bg-white/85 border-slate-200 backdrop-blur-xl' : 'bg-[#080b14]/70 border-white/10 backdrop-blur-xl'
        }`}
      >
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-3">
            Boshqaruv paneli
          </div>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            const locked = item.id === 'saved' && !user;
            const badge = item.id === 'saved' && user ? savedCodes.length : 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'text-cyan-900 font-semibold'
                      : 'text-white'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className={`absolute inset-0 rounded-xl border ${
                      isLight
                        ? 'bg-cyan-500/15 border-cyan-500/35'
                        : 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/15 border-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                    }`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : ''}`} />
                  <span>{item.fullLabel}</span>
                </div>
                {locked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-500 relative z-10" />
                ) : (
                  badge > 0 && (
                    <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
                      {badge}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>

        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/[0.02] border-white/10'
          }`}
        >
          <div className={`flex items-center justify-between text-xs font-semibold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
            <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> Massivni sozlash</span>
            <button type="button" onClick={handleRandomize} className="text-slate-400 hover:text-cyan-500 transition cursor-pointer" title="Tasodifiy">
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleApplyCustomArray} className="space-y-2">
            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Masalan: 12, 4, 9, 2"
              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 transition ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#05070c] border-white/10 text-slate-200'
              }`}
            />
            <button
              type="submit"
              className={`w-full py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isLight
                  ? 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/35 text-cyan-800'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Kiritish
            </button>
          </form>

          <div className="flex items-center gap-1 pt-1">
            {TEST_CASES.map((tc) => (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleApplyTestCase(tc.values)}
                className={`flex-1 py-1 rounded-lg border text-[10px] font-semibold transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
                }`}
              >
                {tc.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-500/10 space-y-1">
            <div className={`flex justify-between text-[11px] ${mutedTextClass}`}>
              <span>Tezlik:</span>
              <span className="text-cyan-500 font-mono font-semibold">{speed}ms</span>
            </div>
            <input
              type="range"
              min="250"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => setLiteMotion(!liteMotion)}
            className={`w-full py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition cursor-pointer ${
              liteMotion
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
                : isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Tejamkor rejim
            </span>
            <span>{liteMotion ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </aside>

      {/* ASOSIY KONTENT */}
      <div className="flex-1 flex flex-col lg:overflow-hidden relative">

        {/* 1. UMUMIY KO'RINISH + XP / YUTUQLAR / KUNLIK VAZIFALAR */}
        {activeMenu === 'dashboard' && (
          <div className="flex-1 lg:overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl sm:text-3xl font-extrabold ${headingTextClass}`}>
                  Xush kelibsiz{user ? `, ${user.name}` : ''}!
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${mutedTextClass}`}>
                  XP to&apos;plang, nishonlarni oching va kunlik algoritmik vazifalarni bajaring.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMenu('visualizer')}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer w-fit"
              >
                <Cpu className="w-4 h-4" /> Studiyaga o&apos;tish
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {[
                { label: "Tajriba balli (XP)", val: `${xp} XP`, sub: `Daraja ${Math.floor(xp / 100) + 1}`, icon: Trophy, color: "text-cyan-500" },
                { label: "Kunlik seriya", val: `${streak} kun`, sub: "Doimiy mashq faolligi", icon: Flame, color: "text-amber-500" },
                {
                  label: "Ochilgan yutuqlar",
                  val: `${unlockedBadgesCount} / ${badges.length}`,
                  sub: "Maxsus nishonlar kolleksiyasi",
                  icon: Medal,
                  color: "text-indigo-500"
                }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className={`p-5 sm:p-6 rounded-3xl border space-y-2.5 ${surfaceClass}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${mutedTextClass}`}>{stat.label}</span>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`text-2xl sm:text-3xl font-extrabold ${headingTextClass}`}>{stat.val}</div>
                    <div className="text-xs text-slate-500">{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* YUTUQLAR (BADGES) VITRINASI */}
            <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${surfaceClass}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${headingTextClass}`}>
                  <Medal className="w-4 h-4 text-amber-500" /> Yutuqlar va Nishonlar (Badges)
                </h3>
                <span className="text-xs font-mono font-semibold text-amber-500">
                  {unlockedBadgesCount}/{badges.length} ochilgan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition ${
                      b.unlocked
                        ? isLight
                          ? 'bg-amber-50/70 border-amber-300 text-slate-900'
                          : 'bg-amber-500/10 border-amber-400/35 text-white'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white/[0.02] border-white/10 opacity-55'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        b.unlocked
                          ? 'bg-amber-500 text-white shadow-sm'
                          : isLight
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      <Medal className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{b.title}</div>
                      <div className={`text-[11px] truncate ${mutedTextClass}`}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bugungi Algoritmik Vazifalar */}
            <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${surfaceClass}`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${headingTextClass}`}>
                  <Sparkles className="w-4 h-4 text-cyan-500" /> Bugungi Algoritmik Vazifalar
                </h3>
                <span className="text-xs font-mono text-cyan-500 font-semibold">
                  {completedChallenges.length} / {DAILY_CHALLENGES.length} bajarildi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DAILY_CHALLENGES.map((ch) => {
                  const done = completedChallenges.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                        isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                            +{ch.xp} XP
                          </span>
                          {done && (
                            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-bold ${headingTextClass}`}>{ch.title}</h4>
                        <p className={`text-xs leading-relaxed ${mutedTextClass}`}>{ch.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCompleteChallenge(ch)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 transition cursor-pointer"
                      >
                        {done ? "Qayta ko'rish" : "Boshlash va XP olish"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Taqqoslash jadvali */}
            <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${surfaceClass}`}>
              <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${headingTextClass}`}>
                <Award className="w-4 h-4 text-indigo-500" /> Asosiy Saralash Algoritmlari Taqqoslashi
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm min-w-[460px]">
                  <thead>
                    <tr className={`border-b ${isLight ? 'border-slate-200 text-slate-600' : 'border-white/10 text-slate-400'}`}>
                      <th className="py-3 px-3 sm:px-4">Algoritm</th>
                      <th className="py-3 px-3 sm:px-4">Eng yaxshi</th>
                      <th className="py-3 px-3 sm:px-4">O&apos;rtacha</th>
                      <th className="py-3 px-3 sm:px-4">Xotira</th>
                      <th className="py-3 px-3 sm:px-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
                    <tr>
                      <td className={`py-3.5 px-3 sm:px-4 font-sans font-semibold ${headingTextClass}`}>Quick Sort</td>
                      <td className="py-3.5 px-3 sm:px-4 text-emerald-500 font-semibold">O(n log n)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-cyan-500 font-semibold">O(n log n)</td>
                      <td className={`py-3.5 px-3 sm:px-4 ${mutedTextClass}`}>O(log n)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-sans">
                        <button type="button" onClick={() => { handleSelectPreset('quickSort'); setActiveMenu('visualizer'); }} className="text-xs text-cyan-500 hover:underline cursor-pointer">
                          Sinab ko&apos;rish →
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className={`py-3.5 px-3 sm:px-4 font-sans font-semibold ${headingTextClass}`}>Bubble Sort</td>
                      <td className="py-3.5 px-3 sm:px-4 text-emerald-500 font-semibold">O(n)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-amber-500 font-semibold">O(n²)</td>
                      <td className={`py-3.5 px-3 sm:px-4 ${mutedTextClass}`}>O(1)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-sans">
                        <button type="button" onClick={() => { handleSelectPreset('bubbleAsc'); setActiveMenu('visualizer'); }} className="text-xs text-cyan-500 hover:underline cursor-pointer">
                          Sinab ko&apos;rish →
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className={`py-3.5 px-3 sm:px-4 font-sans font-semibold ${headingTextClass}`}>Selection Sort</td>
                      <td className="py-3.5 px-3 sm:px-4 text-amber-500 font-semibold">O(n²)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-amber-500 font-semibold">O(n²)</td>
                      <td className={`py-3.5 px-3 sm:px-4 ${mutedTextClass}`}>O(1)</td>
                      <td className="py-3.5 px-3 sm:px-4 text-right font-sans">
                        <button type="button" onClick={() => { handleSelectPreset('selection'); setActiveMenu('visualizer'); }} className="text-xs text-cyan-500 hover:underline cursor-pointer">
                          Sinab ko&apos;rish →
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. ALGORITM STUDIYASI */}
        {activeMenu === 'visualizer' && (
          <>
            <header
              className={`min-h-16 py-2.5 border-b px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md transition-colors duration-300 ${
                isLight ? 'bg-white/85 border-slate-200' : 'bg-[#080b14]/50 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`px-2.5 sm:px-3 py-1 rounded-lg border text-[11px] sm:text-xs font-mono font-medium ${
                  isLight ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
                }`}>
                  Studio
                </span>
                <div className={`flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border ${
                  isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/[0.03] border-white/5 text-slate-400'
                }`}>
                  <span>Qadam:</span>
                  <strong className="text-cyan-500 font-mono">{currentStep + 1}</strong>
                  <span>/ {steps.length || 1}</span>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] font-mono font-bold">
                  {xp} XP
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowTraceLog(!showTraceLog)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    showTraceLog
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                  title="Qadamlar ro'yxati"
                >
                  <ListOrdered className="w-4 h-4 text-emerald-500" />
                  <span className="hidden md:inline">Qadamlar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMentorOpen(!isMentorOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    isMentorOpen
                      ? 'bg-cyan-500/25 border-cyan-500 text-cyan-600 dark:text-cyan-300'
                      : isLight
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                      : 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/30 text-indigo-200'
                  }`}
                >
                  <Bot className="w-4 h-4 text-cyan-500" />
                  <span className="hidden sm:inline">AI Kod Mentori</span>
                  <span className="sm:hidden">AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white'
                  }`}
                  title="Qaytadan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`p-2 rounded-xl border disabled:opacity-30 transition cursor-pointer ${
                    isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                  title="Orqaga"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <motion.button
                  type="button"
                  whileHover={liteMotion ? undefined : { scale: 1.02 }}
                  whileTap={liteMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={steps.length <= 1}
                  className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 disabled:opacity-40 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? "To'xtat" : "Ijro"}</span>
                </motion.button>
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStep >= steps.length - 1}
                  className={`p-2 rounded-xl border disabled:opacity-30 transition cursor-pointer ${
                    isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                  title="Oldinga"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </header>

            <div
              className={`lg:hidden px-3 py-2.5 border-b flex flex-col gap-2 ${
                isLight ? 'bg-white/75 border-slate-200' : 'bg-[#080b14]/55 border-white/10'
              }`}
            >
              <form onSubmit={handleApplyCustomArray} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="18, 7, 29, 4..."
                  className={`flex-1 min-w-0 border rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#05070c] border-white/15 text-slate-200'
                  }`}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Massiv
                </button>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="p-1.5 rounded-xl border border-slate-300/40 text-slate-500 hover:text-cyan-500 shrink-0 cursor-pointer"
                  title="Tasodifiy massiv"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {TEST_CASES.map((tc) => (
                    <button
                      key={tc.id}
                      type="button"
                      onClick={() => handleApplyTestCase(tc.values)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {tc.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="range"
                    min="250"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-20 accent-cyan-500"
                  />
                  <span className="font-mono text-[10px] text-cyan-500">{speed}ms</span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
              <div
                className={`border-b lg:border-b-0 lg:border-r p-4 sm:p-6 flex flex-col justify-between transition-colors duration-300 ${
                  isLight ? 'bg-white/85 border-slate-200' : 'bg-[#070a11]/80 border-white/10 backdrop-blur-sm'
                }`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                    {Object.entries(presets).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPreset(key)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                          activePreset === key
                            ? isLight
                              ? 'bg-cyan-500/15 border border-cyan-500 text-cyan-800 font-semibold'
                              : 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleLoadBugHunt}
                      className="px-2.5 py-1 rounded-lg border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                      title="Xatoli kodni topish mashqi"
                    >
                      <Bug className="w-3.5 h-3.5" /> Bug Hunt
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                        isLight
                          ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-700'
                          : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Qo&apos;shish
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-xs ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-cyan-300'
                      }`}
                      title="Kodni nusxalash"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSummary}
                      className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-xs ${
                        isLight
                          ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-cyan-300'
                      }`}
                      title="Konspekt (.md) yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCurrentCode}
                      className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-xs ${
                        user
                          ? isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-cyan-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20'
                      }`}
                      title={user ? "Saqlangan kodlarga qo'shish" : "Saqlash uchun tizimga kiring"}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {!user && <Lock className="w-2.5 h-2.5" />}
                    </button>
                    <motion.button
                      type="button"
                      whileHover={liteMotion ? undefined : { scale: 1.03 }}
                      whileTap={liteMotion ? undefined : { scale: 0.97 }}
                      onClick={handleRunCode}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        isLight
                          ? 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-800'
                          : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Tahlil
                    </motion.button>
                  </div>
                </div>

                <div
                  className={`flex-1 relative flex min-h-[220px] sm:min-h-[260px] rounded-2xl border overflow-hidden transition-colors duration-300 ${
                    codeError ? 'border-rose-500/60' : isLight ? 'border-slate-300 bg-white' : 'border-white/15 bg-[#04060b]'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className={`py-3.5 sm:py-4 px-2.5 text-right font-mono text-xs sm:text-sm select-none border-r leading-relaxed ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-[#060913] border-white/10 text-slate-600'
                    }`}
                  >
                    {codeLines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    spellCheck="false"
                    className={`w-full flex-1 p-3.5 sm:p-4 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed bg-transparent ${
                      isLight ? 'text-slate-900' : 'text-cyan-100'
                    }`}
                  />
                </div>

                <div
                  className={`mt-3 px-3.5 py-2 rounded-xl border text-[11px] font-mono flex items-center gap-2 ${
                    codeError
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700'
                      : 'bg-white/[0.03] border-white/10 text-slate-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${codeError ? 'bg-rose-400' : 'bg-cyan-400 animate-pulse'}`} />
                  <span className="truncate">{consoleMsg}</span>
                </div>
              </div>

              <div className="bg-transparent p-4 sm:p-6 flex flex-col justify-between relative overflow-x-auto min-h-[340px]">
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${mutedTextClass}`}>
                    Xotira Ustunlari
                  </span>
                  <div
                    className={`flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs px-3 py-1.5 rounded-full border flex-wrap ${
                      isLight ? 'bg-white/90 border-slate-200' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Solishtirish
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-400" /> Almashish
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tayyor
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 min-w-fit mx-auto">
                  <div className="flex items-end gap-2 sm:gap-4 h-44 sm:h-48">
                    {currentData.array.map((item, idx) => {
                      const isComparing = currentData.comparing.includes(idx);
                      const isSwapping = currentData.swapping.includes(idx);
                      const isSorted = currentData.sorted.includes(idx);

                      let cardStyle = isLight
                        ? "bg-white border-slate-300 text-slate-900 shadow-md"
                        : "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/15 text-white";

                      if (isComparing) {
                        cardStyle = "bg-gradient-to-b from-amber-500/35 to-amber-600/15 border-amber-400 text-amber-950 dark:text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.35)]";
                      }
                      if (isSwapping) {
                        cardStyle = "bg-gradient-to-b from-rose-500/40 to-rose-600/20 border-rose-400 text-white shadow-[0_0_35px_rgba(244,63,94,0.45)]";
                      }
                      if (isSorted) {
                        cardStyle = "bg-gradient-to-b from-emerald-500/35 to-emerald-600/15 border-emerald-400 text-emerald-950 dark:text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.3)]";
                      }

                      const heightPx = Math.max(44, Math.min(160, item.val * 3.3 + 34));

                      return (
                        <div key={item.id} className="flex flex-col items-center">
                          <motion.div
                            layout={!liteMotion}
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                            animate={
                              liteMotion
                                ? undefined
                                : {
                                    y: isSwapping ? -14 : isComparing ? -7 : 0,
                                    scale: isSwapping ? 1.06 : 1
                                  }
                            }
                            className={`w-9 sm:w-14 rounded-2xl border backdrop-blur-xl flex flex-col items-center justify-between py-2.5 sm:py-3 font-bold text-sm sm:text-lg transition-colors duration-300 relative overflow-hidden ${cardStyle}`}
                            style={{ height: `${heightPx}px` }}
                          >
                            <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
                            <span>{item.val}</span>
                            <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isLight ? 'bg-slate-100 text-slate-700' : 'opacity-60 bg-black/30'
                            }`}>
                              [{idx}]
                            </span>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {steps.length > 1 && (
                  <div className={`relative z-10 mb-3 px-3.5 py-2 rounded-2xl border flex items-center gap-3 ${surfaceClass}`}>
                    <span className="text-[11px] font-mono font-semibold text-cyan-500 shrink-0">
                      {currentStep + 1}/{steps.length}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={steps.length - 1}
                      value={currentStep}
                      onChange={(e) => {
                        setIsPlaying(false);
                        setCurrentStep(Number(e.target.value));
                      }}
                      className="flex-1 accent-cyan-500 cursor-pointer"
                    />
                  </div>
                )}

                {showTraceLog && steps.length > 0 && (
                  <div className={`relative z-10 mb-3 p-3 rounded-2xl border max-h-32 overflow-y-auto space-y-1 text-xs ${surfaceClass}`}>
                    {steps.map((st, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStep(idx);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition cursor-pointer flex items-center gap-2 ${
                          idx === currentStep
                            ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 font-bold'
                            : isLight
                            ? 'hover:bg-slate-100 text-slate-700'
                            : 'hover:bg-white/5 text-slate-400'
                        }`}
                      >
                        <span className="text-cyan-500 shrink-0">#{idx + 1}</span>
                        <span className="truncate">{st.explanation}</span>
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={liteMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`relative z-10 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 ${surfaceClass}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4 text-cyan-500" />
                    </div>
                    <span className="leading-relaxed">{currentData.explanation}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div
              className={`relative border-t px-4 sm:px-6 py-3.5 sm:py-4 backdrop-blur-xl transition-colors duration-300 ${
                isLight ? 'bg-white/85 border-slate-200' : 'bg-[#080b14]/70 border-white/10'
              }`}
            >
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${headingTextClass}`}>
                      AI Murakkablik Tahlili <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className={`text-xs ${mutedTextClass}`}>
                      Jonli tahlil: <strong className="text-cyan-500">{presets[activePreset]?.name || "Custom Code"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`px-3.5 sm:px-4 py-2 rounded-xl border flex-1 sm:flex-initial ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                    <span className={`text-[10px] uppercase tracking-wider block ${mutedTextClass}`}>Vaqt</span>
                    <span className="text-sm font-mono font-bold text-cyan-500">{liveComplexity.time}</span>
                  </div>
                  <div className={`px-3.5 sm:px-4 py-2 rounded-xl border flex-1 sm:flex-initial ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                    <span className={`text-[10px] uppercase tracking-wider block ${mutedTextClass}`}>Xotira</span>
                    <span className="text-sm font-mono font-bold text-emerald-500">{liveComplexity.space}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 2B. GRAF VA QIDIRUV ALGORITMLARI */}
        {activeMenu === 'graphs' && (
          <div className="flex-1 lg:overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-6">
            <div>
              <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 ${headingTextClass}`}>
                <GitBranch className="w-6 h-6 text-cyan-500" /> Graf &amp; Eng Qisqa Yo&apos;l Laboratoriyasi
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${mutedTextClass}`}>
                Dijkstra, BFS va DFS algoritmlari tugunlar bo&apos;ylab qanday harakatlanishini qadam-baqadam ko&apos;ring.
              </p>
            </div>
            <GraphVisualizer theme={theme} />
          </div>
        )}

        {/* 3. SAQLANGAN KODLAR */}
        {activeMenu === 'saved' && (
          <div className="flex-1 lg:overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-6">
            {!user ? (
              <div className={`max-w-lg mx-auto mt-6 sm:mt-12 p-6 sm:p-10 rounded-3xl border text-center space-y-5 shadow-2xl ${surfaceClass}`}>
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-500">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className={`text-xl sm:text-2xl font-extrabold ${headingTextClass}`}>
                    Algoritmlar saqlanmagan
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
                    Siz hozir mehmon (ro&apos;yxatdan o&apos;tmagan) rejimidasiz. Yozgan algoritmlaringizni saqlab qo&apos;yish uchun shaxsiy akkauntingizga kiring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish yoki Ro&apos;yxatdan o&apos;tish</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 ${headingTextClass}`}>
                      <Bookmark className="w-6 h-6 text-cyan-500" /> Saqlangan kodlar
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 ${mutedTextClass}`}>
                      <span className="text-cyan-500 font-medium break-all">{user.email}</span> akkauntiga biriktirilgan barcha algoritmlar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('visualizer')}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer w-fit ${
                      isLight ? 'bg-white border-slate-200 text-cyan-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
                    }`}
                  >
                    + Yangi kod yozish
                  </button>
                </div>

                {savedCodes.length === 0 ? (
                  <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-3 ${surfaceClass}`}>
                    <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
                      Akkauntingizda hali saqlangan algoritmlar yo&apos;q. Studiyada kod yozib, <strong className="text-cyan-500">Saqlash (Bookmark)</strong> tugmasini bosing.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {savedCodes.map((item) => (
                      <div key={item.id} className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${surfaceClass}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={`text-base font-bold ${headingTextClass}`}>{item.title}</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                              <Clock className="w-3 h-3" /> {item.date} • <span className="text-cyan-500 font-mono">{item.complexity}</span>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => persistSavedCodes(savedCodes.filter(c => c.id !== item.id))}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition cursor-pointer shrink-0"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <pre className={`border rounded-2xl p-3.5 sm:p-4 text-xs font-mono overflow-x-auto max-h-40 ${codeBlockClass}`}>
                          {item.code}
                        </pre>

                        <button
                          type="button"
                          onClick={() => {
                            setUserCode(item.code);
                            setActiveMenu('visualizer');
                            setConsoleMsg(`"${item.title}" Studiyaga yuklandi. 'Tahlil' tugmasini bosing.`);
                          }}
                          className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          Studiyada ochish <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 4. 2-BOSQICHLI TEXNIK SUHBAT */}
        {activeMenu === 'interview' && (
          <div className="flex-1 lg:overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 ${headingTextClass}`}>
                  <Terminal className="w-6 h-6 text-cyan-500" /> Texnik Suhbat Simulyatori
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${mutedTextClass}`}>
                  2 bosqichli jonli suhbatdan o&apos;ting va AI Suhbatdoshning yakuniy tavsiyasini oling.
                </p>
              </div>
              {interviewScores.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowInterviewReport(!showInterviewReport)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer w-fit"
                >
                  {showInterviewReport ? "Hisobotni yopish" : `Yakuniy hisobot (${avgInterviewScore}/100)`}
                </button>
              )}
            </div>

            {showInterviewReport && interviewScores.length > 0 && (
              <div className={`p-5 rounded-3xl border max-w-4xl space-y-3 ${surfaceClass}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm sm:text-base font-bold ${headingTextClass}`}>
                    Suhbat Yakuniy Tahlili
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                    O&apos;rtacha ball: {avgInterviewScore} / 100
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {interviewScores.map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <span>
                        <strong>{item.company}</strong> — {item.topic}
                      </span>
                      <span className="font-mono font-bold text-cyan-500">{item.score} ball</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`p-4 sm:p-7 rounded-3xl border space-y-5 max-w-4xl shadow-xl ${surfaceClass}`}>
              <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-500 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm sm:text-base font-bold ${headingTextClass}`}>AI Texnik Suhbatdosh</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
                        {interviewStage}-bosqich
                      </span>
                    </div>
                    <p className={`text-xs ${mutedTextClass}`}>
                      Kompaniya: <strong className="text-cyan-500">{currentScenario.company}</strong> • Mavzu: {currentScenario.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {scenarios.map((sc, idx) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectScenario(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        activeScenarioIdx === idx
                          ? 'bg-cyan-500/25 border border-cyan-500 text-cyan-800 dark:text-cyan-200'
                          : isLight
                          ? 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sc.company}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-400/25 text-amber-200'
              }`}>
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Yo&apos;naltiruvchi nuqtalar: </span>
                  {currentScenario.hints.join(" • ")}
                </div>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {interviewChat.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium'
                          : isLight
                          ? 'bg-slate-100 border border-slate-200 text-slate-900'
                          : 'bg-white/[0.04] border border-white/10 text-slate-200'
                      }`}
                    >
                      {m.score !== undefined && (
                        <div className="mb-1.5 inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          {m.stage}-bosqich AI Baho: {m.score} / 100
                        </div>
                      )}
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitInterviewAnswer} className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <input
                  type="text"
                  value={interviewAnswer}
                  onChange={(e) => setInterviewAnswer(e.target.value)}
                  placeholder={`${interviewStage}-bosqich savoliga javobingizni yozing...`}
                  className={`flex-1 min-w-0 border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#05070c] border-white/15 text-white'
                  }`}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" /> Javobni yuborish
                </button>
              </form>
            </div>

            <div className="space-y-5 max-w-4xl">
              <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${headingTextClass}`}>
                <RefreshCw className="w-4 h-4 text-cyan-500" /> Tezkor Bilim Tekshiruvi
              </h3>

              {INTERVIEW_QUESTIONS.map((q) => {
                const chosen = selectedAnswers[q.id];
                const isAnswered = chosen !== undefined;
                return (
                  <div key={q.id} className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${surfaceClass}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        {q.company} Interview
                      </span>
                      <span className={`text-xs ${mutedTextClass}`}>Daraja: <strong className="text-cyan-500">{q.difficulty}</strong></span>
                    </div>

                    <h4 className={`text-sm sm:text-base font-bold leading-relaxed ${headingTextClass}`}>{q.question}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, idx) => {
                        let btnStyle = isLight
                          ? "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07]";

                        if (isAnswered) {
                          if (idx === q.correct) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold";
                          else if (idx === chosen) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200";
                        }
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!isAnswered && idx === q.correct) {
                                setXp((prev) => prev + 20);
                              }
                              setSelectedAnswers(prev => ({ ...prev, [q.id]: idx }));
                            }}
                            className={`p-3.5 rounded-2xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && idx === q.correct && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                            {isAnswered && idx === chosen && idx !== q.correct && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-950' : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-100'
                      }`}>
                        <strong>AI Izohi:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* BARCHA SAHIFALARDA SUZUVCHI AI YORDAMCHI TUGMASI */}
      {!isMentorOpen && (
        <button
          type="button"
          onClick={() => setIsMentorOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-cyan-500/30 hover:opacity-95 transition cursor-pointer flex items-center gap-2"
        >
          <Bot className="w-4 h-4" />
          <span>AI Yordamchi</span>
        </button>
      )}

      {/* GLOBAL AI YORDAMCHI OYNASI */}
      <AnimatePresence>
        {isMentorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-40 sm:w-[420px] h-[72vh] sm:h-[490px] rounded-3xl border backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden ${
              isLight ? 'bg-white border-cyan-500/40 text-slate-900' : 'bg-[#090e1a]/95 border-cyan-500/35 text-slate-200'
            }`}
          >
            <div className={`px-4 sm:px-5 py-3.5 border-b flex items-center justify-between ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-500">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${headingTextClass}`}>AI Yordamchi &amp; Mentor</h4>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Istalgan savolga tayyor
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMentorOpen(false)}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`px-3 sm:px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/5 bg-[#060912]'}`}>
              {[
                { label: "Kodni tahlil qil", q: "Kodni tahlil qil" },
                { label: "Murakkablik", q: "Kodni murakkablik va vaqt jihatidan tahlil qil" },
                { label: "Xatoni tuzat", q: "Kodimdagi xatoni tekshir va tuzat" },
                { label: "Quick Sort", q: "Quick Sort yozib ber" },
                { label: "Big-O nima?", q: "Big-O murakkablik nima? Oddiy misollar bilan tushuntir." },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSendMentorMessage(chip.q)}
                  disabled={isMentorLoading}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold whitespace-nowrap transition cursor-pointer disabled:opacity-50 ${
                    isLight
                      ? 'bg-white hover:bg-cyan-50 border-slate-200 text-cyan-700'
                      : 'bg-white/[0.04] hover:bg-cyan-500/15 border-white/10 text-cyan-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 text-xs">
              {mentorMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium'
                        : isLight
                        ? 'bg-slate-100 border border-slate-200 text-slate-900'
                        : 'bg-white/[0.05] border border-white/10 text-slate-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.suggestedCode && (
                      <div className="mt-2.5 space-y-2">
                        <pre className={`border rounded-xl p-2.5 text-[10px] font-mono overflow-x-auto ${codeBlockClass}`}>
                          {msg.suggestedCode}
                        </pre>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApplySuggestedCode(msg.suggestedCode, false)}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                              isLight
                                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                                : 'bg-slate-800 hover:bg-slate-700 border-white/15 text-slate-100'
                            }`}
                          >
                            <Code2 className="w-3 h-3 text-cyan-500" /> Muharrirga qo&apos;y
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplySuggestedCode(msg.suggestedCode, true)}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                              isLight
                                ? 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-800'
                                : 'bg-cyan-500/25 hover:bg-cyan-500/35 border-cyan-400/50 text-cyan-200'
                            }`}
                          >
                            <Play className="w-3 h-3 fill-current" /> 3D da ishlat
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isMentorLoading && (
                <div className="flex items-start">
                  <div className={`rounded-2xl px-3.5 py-2 text-xs opacity-75 ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/[0.05] text-slate-300'}`}>
                    Javob tayyorlanmoqda...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMentorMessage(); }}
              className={`p-3 border-t flex items-center gap-2 ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#060912]'}`}
            >
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                placeholder="Istalgan savol bering..."
                disabled={isMentorLoading}
                className={`flex-1 min-w-0 border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500 transition disabled:opacity-60 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0b0f1d] border-white/10 text-white'
                }`}
              />
              <button
                type="submit"
                disabled={isMentorLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-95 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}