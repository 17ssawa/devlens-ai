import React, { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoFeatures from "./components/BentoFeatures";
import Pricing from "./components/Pricing";
import Dashboard from "./components/Dashboard";
import AnimatedBackground from "./components/AnimatedBackground";
import AuthModal from "./components/AuthModal";
import PaymentModal from "./components/PaymentModal";
import PythonStudioModal from "./components/PythonStudioModal";
import WeeklyExamModal from "./components/WeeklyExamModal";
import {
  ALGORITHMS_32,
  BUG_HUNT_CHALLENGES,
  MAX_SCORE,
  PASS_SCORE,
  evaluateStageScore,
  getUnlockedLevels,
} from "./data/platformData";

const STORAGE_KEYS = {
  user: "devlens_user",
  usersDb: "devlens_users_db",
  paymentsDb: "devlens_payments_db",
  theme: "devlens_theme",
  lang: "devlens_lang",
  lessonScores: "devlens_lesson_scores",
  examScores: "devlens_exam_scores",
  stageScores: "devlens_stage_scores",
  leaderboard: "devlens_leaderboard_db",
  suggestions: "devlens_suggestions_db",
};

const UI_BY_LANG = {
  uz: {
    studyBtn: "📚 Study (16 Dars)",
    algosTab: `32+ Algoritm (${ALGORITHMS_32.length})`,
    testTab: "Xatoni Top Test",
    communityTab: "Reyting & Takliflar",
    dashboardTab: "Dashboard",
    adminBtn: "🛡️ Admin",
    weeklyExamBtn: "📝 Nazorat",
    pythonBtn: "🐍 Python",
    closeBtn: "✕",
    allLessons: "Barchasi (16)",
    month1: "1-Oy (1–8)",
    month2: "2-Oy (9–16)",
    lessonBadge: "DARS",
    lockedLessonBadge: "🔒 DARS",
    step1Tab: "1. Kirish & 30m Nazariya",
    step2Tab: "2. 90m O‘yin",
    step3Tab: "3. 10 Talik Test",
    introLabel: "Kirish",
    lecture30Label: "30 Daqiqalik Nazariy Tushuntirish",
    showLabel: "Ko‘rsatib Berish",
    nextStepBtn: "Keyingi qadam →",
    toGameBtn: "90 Daqiqalik O‘yinga O‘tish →",
    game90Label: "90 Daqiqalik O‘yin & Amaliyot",
    checkGameBtn: "Tekshirish",
    gameOkMsg: "O‘yin muvaffaqiyatli bajarildi! 10 talik test ochildi.",
    gameRetryMsg: "Javobni yana bir bor tekshirib ko‘ring.",
    toQuizBtn: "10 Talik Testga →",
    quiz10Label: "10 Talik Test",
    finishQuizBtn: "Testni Yakunlash",
    nextLessonBtn: "Keyingi dars",
    adminBadge: "🛡️ ADMIN PANEL • LOCALSTORAGE",
    adminTitle: "Kiritilgan Ma’lumotlar",
    copyJson: "📋 JSON",
    copiedJson: "✓ JSON",
    clearStorage: "♻ Tozalash",
    usersCount: "Foydalanuvchi",
    paymentsCount: "To‘lovlar",
    scoresCount: "Ballar",
    suggestionsCount: "Takliflar",
    tabUsers: "Foydalanuvchilar",
    tabPayments: "To‘lovlar",
    tabScores: "Ballar",
    tabSuggestions: "Taklif & Reyting",
    searchPlaceholder: "Qidirish...",
    algoSearchPlaceholder: "Algoritm qidirish (Dijkstra, Spiral, Heap)...",
    allCategories: "Barchasi",
    autoDemoOn: "✨ Auto ON",
    autoDemoOff: "✨ Auto-Demo",
    pauseBtn: "⏸ Pauza",
    playBtn: "▶ Start",
    speedLabel: "Tezlik",
    levelsTitle: "Bosqichlar",
    passNote: "Keyingi bosqich uchun kamida",
    passNoteEnd: "ball kerak.",
    checkBtn: "Tekshirish",
    suggestionPlaceholder: "Taklif yoki fikringizni yozing...",
    defaultUserName: "Siz (O‘quvchi)",
    footerText: "© 2026 DevLens AI. Barcha huquqlar himoyalangan.",
  },
  ru: {
    studyBtn: "📚 Study (16 Уроков)",
    algosTab: `32+ Алгоритмов (${ALGORITHMS_32.length})`,
    testTab: "Найди Баг",
    communityTab: "Рейтинг и Идеи",
    dashboardTab: "Дашборд",
    adminBtn: "🛡️ Админ",
    weeklyExamBtn: "📝 Экзамен",
    pythonBtn: "🐍 Python",
    closeBtn: "✕",
    allLessons: "Все (16)",
    month1: "1-й Месяц (1–8)",
    month2: "2-й Месяц (9–16)",
    lessonBadge: "УРОК",
    lockedLessonBadge: "🔒 УРОК",
    step1Tab: "1. Введение & 30м Теория",
    step2Tab: "2. 90м Игра",
    step3Tab: "3. Тест (10)",
    introLabel: "Введение",
    lecture30Label: "30-Минутная Теория",
    showLabel: "Пошаговый Показ",
    nextStepBtn: "Далее →",
    toGameBtn: "К 90м Игре →",
    game90Label: "90-Минутная Игра и Практика",
    checkGameBtn: "Проверить",
    gameOkMsg: "Игра пройдена! Тест из 10 вопросов открыт.",
    gameRetryMsg: "Проверьте ответ ещё раз.",
    toQuizBtn: "К Тесту →",
    quiz10Label: "Тест из 10 Вопросов",
    finishQuizBtn: "Завершить Тест",
    nextLessonBtn: "Следующий урок",
    adminBadge: "🛡️ АДМИН ПАНЕЛЬ • LOCALSTORAGE",
    adminTitle: "Сохранённые Данные",
    copyJson: "📋 JSON",
    copiedJson: "✓ JSON",
    clearStorage: "♻ Очистить",
    usersCount: "Пользователи",
    paymentsCount: "Оплаты",
    scoresCount: "Баллы",
    suggestionsCount: "Идеи",
    tabUsers: "Пользователи",
    tabPayments: "Оплаты",
    tabScores: "Баллы",
    tabSuggestions: "Идеи и Рейтинг",
    searchPlaceholder: "Поиск...",
    algoSearchPlaceholder: "Поиск алгоритма (Dijkstra, Spiral, Heap)...",
    allCategories: "Все",
    autoDemoOn: "✨ Auto ВКЛ",
    autoDemoOff: "✨ Auto-Demo",
    pauseBtn: "⏸ Пауза",
    playBtn: "▶ Старт",
    speedLabel: "Скорость",
    levelsTitle: "Этапы",
    passNote: "Нужно минимум",
    passNoteEnd: "баллов для открытия следующего этапа.",
    checkBtn: "Проверить",
    suggestionPlaceholder: "Напишите вашу идею или предложение...",
    defaultUserName: "Вы (Ученик)",
    footerText: "© 2026 DevLens AI. Все права защищены.",
  },
  en: {
    studyBtn: "📚 Study (16 Lessons)",
    algosTab: `32+ Algorithms (${ALGORITHMS_32.length})`,
    testTab: "Find Bug Test",
    communityTab: "Rank & Ideas",
    dashboardTab: "Dashboard",
    adminBtn: "🛡️ Admin",
    weeklyExamBtn: "📝 Exam",
    pythonBtn: "🐍 Python",
    closeBtn: "✕",
    allLessons: "All (16)",
    month1: "Month 1 (1–8)",
    month2: "Month 2 (9–16)",
    lessonBadge: "LESSON",
    lockedLessonBadge: "🔒 LESSON",
    step1Tab: "1. Intro & 30m Theory",
    step2Tab: "2. 90m Game",
    step3Tab: "3. Quiz (10)",
    introLabel: "Introduction",
    lecture30Label: "30-Minute Theory",
    showLabel: "Walkthrough",
    nextStepBtn: "Next step →",
    toGameBtn: "Go to 90m Game →",
    game90Label: "90-Minute Game & Practice",
    checkGameBtn: "Check",
    gameOkMsg: "Game completed! The 10-question quiz is now unlocked.",
    gameRetryMsg: "Check your answer and try again.",
    toQuizBtn: "Go to Quiz →",
    quiz10Label: "10-Question Quiz",
    finishQuizBtn: "Finish Quiz",
    nextLessonBtn: "Next lesson",
    adminBadge: "🛡️ ADMIN PANEL • LOCALSTORAGE",
    adminTitle: "Stored Data Monitoring",
    copyJson: "📋 JSON",
    copiedJson: "✓ JSON",
    clearStorage: "♻ Clear",
    usersCount: "Users",
    paymentsCount: "Payments",
    scoresCount: "Scores",
    suggestionsCount: "Ideas",
    tabUsers: "Users",
    tabPayments: "Payments",
    tabScores: "Scores",
    tabSuggestions: "Ideas & Rank",
    searchPlaceholder: "Search...",
    algoSearchPlaceholder: "Search algorithm (Dijkstra, Spiral, Heap)...",
    allCategories: "All",
    autoDemoOn: "✨ Auto ON",
    autoDemoOff: "✨ Auto-Demo",
    pauseBtn: "⏸ Pause",
    playBtn: "▶ Play",
    speedLabel: "Speed",
    levelsTitle: "Levels",
    passNote: "Score at least",
    passNoteEnd: "points to unlock the next level.",
    checkBtn: "Check",
    suggestionPlaceholder: "Share your idea or feedback...",
    defaultUserName: "You (Learner)",
    footerText: "© 2026 DevLens AI. All rights reserved.",
  },
};

const INITIAL_LEADERBOARD_BY_LANG = {
  uz: [
    { id: "u1", name: "Siz (O‘quvchi)", score: 86, efficiency: "88%", streak: 6 },
    { id: "u2", name: "Azizbek", score: 104, efficiency: "96%", streak: 12 },
    { id: "u3", name: "Madina", score: 95, efficiency: "91%", streak: 9 },
    { id: "u4", name: "Jasur", score: 84, efficiency: "85%", streak: 7 },
  ],
  ru: [
    { id: "u1", name: "Вы (Ученик)", score: 86, efficiency: "88%", streak: 6 },
    { id: "u2", name: "Азизбек", score: 104, efficiency: "96%", streak: 12 },
    { id: "u3", name: "Мадина", score: 95, efficiency: "91%", streak: 9 },
    { id: "u4", name: "Жасур", score: 84, efficiency: "85%", streak: 7 },
  ],
  en: [
    { id: "u1", name: "You (Learner)", score: 86, efficiency: "88%", streak: 6 },
    { id: "u2", name: "Azizbek", score: 104, efficiency: "96%", streak: 12 },
    { id: "u3", name: "Madina", score: 95, efficiency: "91%", streak: 9 },
    { id: "u4", name: "Jasur", score: 84, efficiency: "85%", streak: 7 },
  ],
};

const INITIAL_SUGGESTIONS_BY_LANG = {
  uz: [
    {
      id: "s1",
      author: "Dilshod",
      text: "Haftalik Zoom tahlilda Dijkstra va A* ni yonma-yon solishtiraylik.",
      votes: 14,
    },
    {
      id: "s2",
      author: "Nilufar",
      text: "Python studiyasiga ko‘pburchak burchagini avtomatik aylantiruvchi rejim qo‘shilsa zo‘r bo‘ladi.",
      votes: 19,
    },
  ],
  ru: [
    {
      id: "s1",
      author: "Дилшод",
      text: "Давайте на еженедельном разборе сравним алгоритмы Дейкстры и A* рядом.",
      votes: 14,
    },
    {
      id: "s2",
      author: "Нилуфар",
      text: "Было бы круто добавить в Python-студию режим плавного вращения угла многоугольника.",
      votes: 19,
    },
  ],
  en: [
    {
      id: "s1",
      author: "Dilshod",
      text: "Let’s compare Dijkstra and A* side by side in this week’s live session.",
      votes: 14,
    },
    {
      id: "s2",
      author: "Nilufar",
      text: "Adding an auto-rotating polygon angle mode to the Python studio would be awesome.",
      votes: 19,
    },
  ],
};

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (err) {
    console.error(`localStorage o‘qishda xato (${key}):`, err);
    return fallback;
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`localStorage yozishda xato (${key}):`, err);
  }
}

function buildLocalizedQuiz10(lang, topicLabel, algoLabel, complexity) {
  const templates = {
    uz: [
      {
        q: `${algoLabel} algoritmining asosiy vaqt murakkabligi qanday ifodalanadi?`,
        options: [complexity, "O(n!)", "O(1) har doim"],
        correctIndex: 0,
      },
      {
        q: `${topicLabel} mavzusida vizual animatsiya nimaga yordam beradi?`,
        options: [
          "Har bir qadamda ma’lumot holati qanday o‘zgarishini ko‘rishga",
          "Koddan barcha o‘zgaruvchilarni olib tashlashga",
          "Xotirani butunlay o‘chirishga",
        ],
        correctIndex: 0,
      },
      {
        q: `${algoLabel} qo‘llashdan oldin eng muhim birinchi qadam qaysi?`,
        options: [
          "Kiruvchi ma’lumot turi va shartlarini tekshirish",
          "Test natijasini o‘zgartirish",
          "Cheksiz sikl qo‘yish",
        ],
        correctIndex: 0,
      },
      {
        q: `Agar ${algoLabel} da noto‘g‘ri chegara berilsa, nima yuz beradi?`,
        options: [
          "Xato natija yoki cheksiz sikl / chiqish xatosi paydo bo‘ladi",
          "Kompyuter o‘z-o‘zidan kodni to‘g‘rilaydi",
          "Algoritm tezligi cheksiz oshadi",
        ],
        correctIndex: 0,
      },
      {
        q: `${topicLabel} bo‘yicha 90 daqiqalik o‘yin va amaliyotning asosiy maqsadi nima?`,
        options: [
          "Nazariyani real holatlarda sinab ko‘rib, mustahkamlash",
          "Faqat ekranga qarab o‘tirish",
          "Tushuntirishni o‘tkazib yuborish",
        ],
        correctIndex: 0,
      },
      {
        q: `${algoLabel} ni optimallashtirishda nimaga e’tibor qaratiladi?`,
        options: [
          "Ortiqcha solishtirish, takror hisoblash va xotira sarfini kamaytirishga",
          "Iloji boricha ko‘p takroriy massiv yaratishga",
          "Shartlarni umuman tekshirmaslikka",
        ],
        correctIndex: 0,
      },
      {
        q: `Keyingi darsni ochish uchun 10 talik testdan kamida necha ball kerak?`,
        options: [`${PASS_SCORE} ball (${MAX_SCORE} ballik tizimda)`, "10 ball", "25 ball"],
        correctIndex: 0,
      },
      {
        q: `${topicLabel} mavzusida eng yomon holat (worst case) qachon yuzaga keladi?`,
        options: [
          "Ma’lumotlar algoritmga eng noqulay tartibda berilganda",
          "Massiv bo‘sh bo‘lganda",
          "Test boshlanmasdan oldin",
        ],
        correctIndex: 0,
      },
      {
        q: `${algoLabel} ni boshqa algoritmlar bilan solishtirish nima beradi?`,
        options: [
          "Qaysi vaziyatda qaysi usul eng mos ekanini to‘g‘ri tanlashni",
          "Barcha algoritmlarni bir xil qilishni",
          "Kod yozish zaruratini yo‘qotishni",
        ],
        correctIndex: 0,
      },
      {
        q: `${topicLabel} mavzusini to‘liq o‘zlashtirish belgisi qaysi?`,
        options: [
          "Kirish + 30m nazariya/ko‘rsatish + 90m o‘yin/amaliyot + 10 talik test",
          "Faqat sarlavhani o‘qish",
          "Testni yechmasdan o‘tkazib yuborish",
        ],
        correctIndex: 0,
      },
    ],
    ru: [
      {
        q: `Как обозначается основная временная сложность алгоритма ${algoLabel}?`,
        options: [complexity, "O(n!)", "O(1) всегда"],
        correctIndex: 0,
      },
      {
        q: `Зачем нужна визуальная анимация в теме «${topicLabel}»?`,
        options: [
          "Чтобы видеть, как меняется состояние данных на каждом шаге",
          "Чтобы удалить все переменные из кода",
          "Чтобы полностью очистить память",
        ],
        correctIndex: 0,
      },
      {
        q: `Какой первый шаг самый важный перед применением ${algoLabel}?`,
        options: [
          "Проверить тип входных данных и условия задачи",
          "Изменить результат теста вручную",
          "Добавить бесконечный цикл",
        ],
        correctIndex: 0,
      },
      {
        q: `Что произойдёт, если в ${algoLabel} задать неверную границу?`,
        options: [
          "Появится неверный ответ, зацикливание или выход за границы",
          "Код исправит себя сам",
          "Скорость вырастет бесконечно",
        ],
        correctIndex: 0,
      },
      {
        q: `В чём главная цель 90-минутной игры и практики по теме «${topicLabel}»?`,
        options: [
          "Закрепить теорию на практических сценариях",
          "Просто смотреть в экран без действий",
          "Пропустить разбор темы",
        ],
        correctIndex: 0,
      },
      {
        q: `На что направлена оптимизация ${algoLabel}?`,
        options: [
          "На сокращение лишних сравнений, пересчётов и памяти",
          "На создание множества дублирующих массивов",
          "На отказ от проверки условий",
        ],
        correctIndex: 0,
      },
      {
        q: `Сколько минимум баллов нужно набрать в тесте из 10 вопросов для открытия следующего урока?`,
        options: [`${PASS_SCORE} баллов (из ${MAX_SCORE})`, "10 баллов", "25 баллов"],
        correctIndex: 0,
      },
      {
        q: `Когда возникает худший случай (worst case) в теме «${topicLabel}»?`,
        options: [
          "Когда входные данные расположены самым неудобным образом",
          "Когда массив пуст",
          "До запуска теста",
        ],
        correctIndex: 0,
      },
      {
        q: `Что даёт сравнение ${algoLabel} с другими алгоритмами?`,
        options: [
          "Умение выбрать подходящий метод под конкретную задачу",
          "Одинаковость всех алгоритмов",
          "Отсутствие необходимости писать код",
        ],
        correctIndex: 0,
      },
      {
        q: `Что показывает полноценное усвоение темы «${topicLabel}»?`,
        options: [
          "Введение + 30м теория/показ + 90м игра/практика + тест из 10 вопросов",
          "Прочтение только заголовка",
          "Пропуск теста без решения",
        ],
        correctIndex: 0,
      },
    ],
    en: [
      {
        q: `What is the primary time complexity of ${algoLabel}?`,
        options: [complexity, "O(n!)", "O(1) always"],
        correctIndex: 0,
      },
      {
        q: `How does visual animation help in "${topicLabel}"?`,
        options: [
          "It shows how data state changes step by step",
          "It removes all variables from the code",
          "It wipes memory completely",
        ],
        correctIndex: 0,
      },
      {
        q: `What is the most important first step before applying ${algoLabel}?`,
        options: [
          "Inspecting input types, constraints, and conditions",
          "Hardcoding the test output",
          "Adding an infinite loop",
        ],
        correctIndex: 0,
      },
      {
        q: `What happens if you pass a wrong boundary in ${algoLabel}?`,
        options: [
          "Incorrect output, an infinite loop, or an out-of-bounds error occurs",
          "The runtime rewrites the code automatically",
          "Execution speed becomes infinite",
        ],
        correctIndex: 0,
      },
      {
        q: `What is the main goal of the 90-minute game & practice in "${topicLabel}"?`,
        options: [
          "Reinforcing theory through realistic interactive scenarios",
          "Staring at the screen passively",
          "Skipping the explanation",
        ],
        correctIndex: 0,
      },
      {
        q: `What do you focus on when optimizing ${algoLabel}?`,
        options: [
          "Reducing redundant comparisons, recomputations, and memory usage",
          "Allocating as many extra arrays as possible",
          "Skipping boundary checks",
        ],
        correctIndex: 0,
      },
      {
        q: `What is the minimum passing score on the 10-question quiz to unlock the next lesson?`,
        options: [`${PASS_SCORE} points (out of ${MAX_SCORE})`, "10 points", "25 points"],
        correctIndex: 0,
      },
      {
        q: `When does the worst case happen in "${topicLabel}"?`,
        options: [
          "When input data arrives in the least favorable order",
          "When the array is empty",
          "Before starting the quiz",
        ],
        correctIndex: 0,
      },
      {
        q: `What does comparing ${algoLabel} with alternatives give you?`,
        options: [
          "Knowing which approach fits a given problem best",
          "Making all algorithms identical",
          "Eliminating the need to write code",
        ],
        correctIndex: 0,
      },
      {
        q: `What indicates full mastery of "${topicLabel}"?`,
        options: [
          "Intro + 30m theory/walkthrough + 90m game/practice + 10-question quiz",
          "Reading only the title",
          "Skipping the quiz unanswered",
        ],
        correctIndex: 0,
      },
    ],
  };

  return templates[lang] || templates.uz;
}

const LESSON_SPECS = [
  {
    id: "lesson-1",
    order: 1,
    monthNumber: 1,
    bigO: "O(log n)",
    uz: {
      month: "1-oy • 1-hafta",
      title: "1-dars: Chiziqli & Ikkilik Qidiruv + Two Pointers / Sliding Window",
      topic: "Chiziqli va Ikkilik Qidiruv",
      algo: "Binary Search",
      intro:
        "Kirish: Katta hajmdagi ro‘yxatlar, ma’lumotlar bazalari va log fayllardan kerakli qiymatni topishda to‘g‘ri qidiruv algoritmi ishlash tezligini yuzlab marta oshirishi mumkin.",
      lecture30Min: [
        {
          heading: "1. Linear Search — O(n) vaqt, O(1) xotira",
          body: "Elementlar ketma-ket 0-indeksdan boshlab tekshiriladi. Tartiblanmagan yoki kichik massivlarda sodda va ishonchli ishlaydi.",
        },
        {
          heading: "2. Binary Search — O(log n) vaqt, O(1) xotira",
          body: "Faqat saralangan massivlarda ishlaydi. O‘rta indeks (mid) tekshirilib, har qadamda qidiruv maydoni ikkiga bo‘linadi.",
        },
        {
          heading: "3. Two Pointers & Sliding Window — O(n)",
          body: "Two Pointers ikki indeks bilan juftliklarni tez topadi; Sliding Window esa uzluksiz oraliqni surib qayta hisoblashni kamaytiradi.",
        },
      ],
      showSteps: [
        "1-qadam: Saralangan [2, 6, 11, 18, 25, 34, 49] massivida 34 ni izlaymiz.",
        "2-qadam: O‘rta qiymat 18 < 34 bo‘lgani uchun chap yarim tashlanadi.",
        "3-qadam: O‘ng yarimda 34 topiladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Yashirin Qiymatni Top!",
      gameInstruction:
        "Saralangan [3, 8, 14, 21, 34, 55, 89] massividan 55 ni izlashda Binary Search o‘rta element (21) dan keyin nima qiladi?",
      gameChoices: [
        "21 < 55 bo‘lgani uchun o‘ng yarimga o‘tadi",
        "Massivni boshidan oxirigacha almashtiradi",
        "Qidiruvni darhol to‘xtatadi",
      ],
    },
    ru: {
      month: "1-й мес. • 1-я нед.",
      title: "Урок 1: Линейный и Бинарный Поиск + Two Pointers / Sliding Window",
      topic: "Линейный и бинарный поиск",
      algo: "Binary Search",
      intro:
        "Введение: В больших списках, базах данных и логах правильный алгоритм поиска ускоряет работу в сотни раз.",
      lecture30Min: [
        {
          heading: "1. Linear Search — время O(n), память O(1)",
          body: "Элементы проверяются последовательно с начала массива. Прост и надёжен на небольших или неотсортированных данных.",
        },
        {
          heading: "2. Binary Search — время O(log n), память O(1)",
          body: "Работает на отсортированных массивах, деля область поиска пополам на каждом шаге по среднему индексу.",
        },
        {
          heading: "3. Two Pointers & Sliding Window — O(n)",
          body: "Два указателя быстро находят пары, а скользящее окно эффективно обновляет сумму или условие на отрезке.",
        },
      ],
      showSteps: [
        "Шаг 1: Ищем 34 в отсортированном массиве [2, 6, 11, 18, 25, 34, 49].",
        "Шаг 2: Так как 18 < 34, левая половина отбрасывается.",
        "Шаг 3: В правой половине находим 34.",
      ],
      gameTitle: "90-Минутная Игра: Найди Скрытое Число!",
      gameInstruction:
        "При поиске 55 в [3, 8, 14, 21, 34, 55, 89] что делает Binary Search после среднего элемента 21?",
      gameChoices: [
        "Переходит в правую половину, так как 21 < 55",
        "Перемешивает весь массив",
        "Сразу останавливает поиск",
      ],
    },
    en: {
      month: "Month 1 • Week 1",
      title: "Lesson 1: Linear & Binary Search + Two Pointers / Sliding Window",
      topic: "Linear and Binary Search",
      algo: "Binary Search",
      intro:
        "Intro: Across large lists, databases, and logs, choosing the right search strategy can speed up lookups by orders of magnitude.",
      lecture30Min: [
        {
          heading: "1. Linear Search — O(n) time, O(1) space",
          body: "Scans elements sequentially from start to end. Simple and reliable for unsorted or small arrays.",
        },
        {
          heading: "2. Binary Search — O(log n) time, O(1) space",
          body: "Works on sorted data by checking the middle index and halving the search interval each step.",
        },
        {
          heading: "3. Two Pointers & Sliding Window — O(n)",
          body: "Two Pointers finds pairs efficiently; Sliding Window updates window state without recomputing from scratch.",
        },
      ],
      showSteps: [
        "Step 1: Search for 34 in sorted [2, 6, 11, 18, 25, 34, 49].",
        "Step 2: Since 18 < 34, discard the left half.",
        "Step 3: Locate 34 in the right half.",
      ],
      gameTitle: "90-Minute Game: Find the Hidden Value!",
      gameInstruction:
        "Searching for 55 in [3, 8, 14, 21, 34, 55, 89], what does Binary Search do after checking middle 21?",
      gameChoices: [
        "Moves to the right half because 21 < 55",
        "Reverses the entire array",
        "Stops immediately",
      ],
    },
  },
  {
    id: "lesson-2",
    order: 2,
    monthNumber: 1,
    bigO: "O(√n)",
    uz: {
      month: "1-oy • 1-hafta",
      title: "2-dars: Jump Search, Ternary Search & Binary Search on Answer",
      topic: "Jump va Answer Qidiruv",
      algo: "Jump Search",
      intro:
        "Kirish: Ba’zan indeksni emas, balki eng kam vaqt, eng kichik sig‘im yoki eng yaxshi chegaraviy qiymatni topish talab etiladi.",
      lecture30Min: [
        {
          heading: "1. Jump Search — O(√n)",
          body: "√n qadam bilan oldinga sakrab, kerakli blok topilgach shu blok ichida chiziqli tekshiruv o‘tkaziladi.",
        },
        {
          heading: "2. Ternary Search",
          body: "Oraliqni uch qismga bo‘lib, bir cho‘qqili (unimodal) funksiyalarda ekstremumni izlaydi.",
        },
        {
          heading: "3. Binary Search on Answer",
          body: "Javob oralig‘i [low, high] bo‘yicha tekshirish funksiyasi yordamida eng optimal qiymat tanlanadi.",
        },
      ],
      showSteps: [
        "1-qadam: N = 100 uchun sakrash qadami √100 = 10.",
        "2-qadam: 0, 10, 20, 30 indekslar tekshiriladi.",
        "3-qadam: Kerakli blok ichida aniq qiymat topiladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Sakrash Qadamini Hisobla!",
      gameInstruction: "100 ta elementli massivda Jump Search uchun standart qadam uzunligi qancha?",
      gameChoices: ["10 (√100 = 10)", "50", "2"],
    },
    ru: {
      month: "1-й мес. • 1-я нед.",
      title: "Урок 2: Jump Search, Ternary Search и Поиск по Ответу",
      topic: "Jump и поиск по ответу",
      algo: "Jump Search",
      intro:
        "Введение: Иногда нужно найти не индекс, а минимальное время, объём или оптимальное пороговое значение.",
      lecture30Min: [
        {
          heading: "1. Jump Search — O(√n)",
          body: "Прыгает вперёд с шагом √n, а затем выполняет линейный поиск внутри нужного блока.",
        },
        {
          heading: "2. Ternary Search",
          body: "Делит отрезок на три части для поиска экстремума на унимодальных функциях.",
        },
        {
          heading: "3. Binary Search on Answer",
          body: "Бинарный поиск по диапазону возможных ответов с помощью функции проверки.",
        },
      ],
      showSteps: [
        "Шаг 1: Для N = 100 шаг прыжка равен √100 = 10.",
        "Шаг 2: Проверяем индексы 0, 10, 20, 30.",
        "Шаг 3: Находим значение внутри выбранного блока.",
      ],
      gameTitle: "90-Минутная Игра: Вычисли Шаг Прыжка!",
      gameInstruction: "Каков стандартный размер шага Jump Search для массива из 100 элементов?",
      gameChoices: ["10 (√100 = 10)", "50", "2"],
    },
    en: {
      month: "Month 1 • Week 1",
      title: "Lesson 2: Jump Search, Ternary Search & Binary Search on Answer",
      topic: "Jump and Answer Search",
      algo: "Jump Search",
      intro:
        "Intro: Often you aren’t looking for an index, but the minimum feasible capacity, time, or threshold.",
      lecture30Min: [
        {
          heading: "1. Jump Search — O(√n)",
          body: "Jumps ahead by steps of √n, then scans linearly inside the matching block.",
        },
        {
          heading: "2. Ternary Search",
          body: "Splits a range into three parts to find extrema on unimodal functions.",
        },
        {
          heading: "3. Binary Search on Answer",
          body: "Applies binary search over candidate answers using a feasibility predicate.",
        },
      ],
      showSteps: [
        "Step 1: For N = 100, step size is √100 = 10.",
        "Step 2: Check indices 0, 10, 20, 30.",
        "Step 3: Scan within the matching block.",
      ],
      gameTitle: "90-Minute Game: Compute the Jump Step!",
      gameInstruction: "What is the standard Jump Search step size for an array of 100 elements?",
      gameChoices: ["10 (√100 = 10)", "50", "2"],
    },
  },
  {
    id: "lesson-3",
    order: 3,
    monthNumber: 1,
    bigO: "O(n²)",
    uz: {
      month: "1-oy • 2-hafta",
      title: "3-dars: Bubble, Selection, Insertion & Shell Sort",
      topic: "Asosiy Saralash Usullari",
      algo: "Insertion & Bubble Sort",
      intro:
        "Kirish: Ma’lumotlarni tartiblash qidiruv va tahlilni tezlashtiradi. Asosiy saralash algoritmlari ishlash mantig‘ini chuqur tushunishga yordam beradi.",
      lecture30Min: [
        {
          heading: "1. Bubble & Selection Sort — O(n²)",
          body: "Bubble Sort qo‘shni elementlarni solishtiradi; Selection Sort esa eng kichik elementni topib oldinga qo‘yadi.",
        },
        {
          heading: "2. Insertion Sort",
          body: "Har bir elementni oldingi tartibli qismdagi o‘z joyiga qo‘yadi; deyarli tartiblangan massivlarda juda tez ishlaydi.",
        },
        {
          heading: "3. Shell Sort",
          body: "Katta qadam (gap) bilan elementlarni yaqinlashtirib, keyin qadamni 1 gacha kamaytirib yakunlaydi.",
        },
      ],
      showSteps: [
        "1-qadam: [5, 2, 4, 1] massivida 5 va 2 taqqoslanadi.",
        "2-qadam: Birinchi o‘tish oxirida eng katta son oxiriga boradi.",
        "3-qadam: Keyingi o‘tishlarda qolgan qism tartiblanadi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Birinchi O‘tish Natijasi",
      gameInstruction:
        "[5, 1, 4, 2] massivida Bubble Sortning birinchi to‘liq o‘tishidan keyin 5 qayerda turadi?",
      gameChoices: ["Eng oxirgi o‘rinda", "Eng birinchi o‘rinda", "O‘rtada"],
    },
    ru: {
      month: "1-й мес. • 2-я нед.",
      title: "Урок 3: Bubble, Selection, Insertion и Shell Sort",
      topic: "Базовые сортировки",
      algo: "Insertion & Bubble Sort",
      intro:
        "Введение: Упорядочивание ускоряет поиск и анализ, а базовые сортировки помогают понять механику работы с массивами.",
      lecture30Min: [
        {
          heading: "1. Bubble & Selection Sort — O(n²)",
          body: "Bubble Sort сравнивает соседние элементы, а Selection Sort находит минимум и ставит вперёд.",
        },
        {
          heading: "2. Insertion Sort",
          body: "Вставляет каждый элемент в отсортированную часть; отлично работает на почти отсортированных данных.",
        },
        {
          heading: "3. Shell Sort",
          body: "Сортирует с уменьшающимся шагом (gap), завершая проходом с шагом 1.",
        },
      ],
      showSteps: [
        "Шаг 1: В [5, 2, 4, 1] сравниваем 5 и 2.",
        "Шаг 2: После первого прохода максимум оказывается в конце.",
        "Шаг 3: Следующие проходы упорядочивают остаток.",
      ],
      gameTitle: "90-Минутная Игра: Итог Первого Прохода",
      gameInstruction:
        "Где окажется 5 в [5, 1, 4, 2] после первого полного прохода Bubble Sort?",
      gameChoices: ["В самом конце", "В самом начале", "Посередине"],
    },
    en: {
      month: "Month 1 • Week 2",
      title: "Lesson 3: Bubble, Selection, Insertion & Shell Sort",
      topic: "Elementary Sorting",
      algo: "Insertion & Bubble Sort",
      intro:
        "Intro: Sorting accelerates search and analysis, while elementary sorts build intuition for array invariants.",
      lecture30Min: [
        {
          heading: "1. Bubble & Selection Sort — O(n²)",
          body: "Bubble Sort swaps adjacent out-of-order pairs; Selection Sort places the minimum at the front each pass.",
        },
        {
          heading: "2. Insertion Sort",
          body: "Inserts each item into its sorted prefix; fast on nearly sorted inputs.",
        },
        {
          heading: "3. Shell Sort",
          body: "Uses a shrinking gap sequence before finishing with gap 1.",
        },
      ],
      showSteps: [
        "Step 1: Compare 5 and 2 in [5, 2, 4, 1].",
        "Step 2: After pass 1, the largest element moves to the end.",
        "Step 3: Subsequent passes sort the remaining prefix.",
      ],
      gameTitle: "90-Minute Game: First Pass Result",
      gameInstruction:
        "In [5, 1, 4, 2], where does 5 end up after one full pass of Bubble Sort?",
      gameChoices: ["At the very end", "At the very start", "In the middle"],
    },
  },
  {
    id: "lesson-4",
    order: 4,
    monthNumber: 1,
    bigO: "O(n log n)",
    uz: {
      month: "1-oy • 2-hafta",
      title: "4-dars: Merge, Quick, Counting, Radix & Bucket Sort",
      topic: "Tezkor Saralash Algoritmlari",
      algo: "Merge & Quick Sort",
      intro:
        "Kirish: Katta hajmli ma’lumotlarda O(n²) sekin bo‘lgani uchun bo‘lib saralash (Divide & Conquer) va razryad/hisob bo‘yicha saralash qo‘llaniladi.",
      lecture30Min: [
        {
          heading: "1. Merge Sort — O(n log n)",
          body: "Massivni yarmiga bo‘lib, har bir qismni alohida saralaydi va tartibli holda qo‘shadi.",
        },
        {
          heading: "2. Quick Sort — O(n log n) o‘rtacha",
          body: "Pivot atrofida kichik va katta elementlarni ajratib, rekursiv saralaydi.",
        },
        {
          heading: "3. Counting, Radix & Bucket Sort",
          body: "Sonlarning uchrash soni, razryadlari yoki oraliqlari bo‘yicha tez tartiblash usullari.",
        },
      ],
      showSteps: [
        "1-qadam: [8, 3, 5, 1] ikkita [8, 3] va [5, 1] qismga bo‘linadi.",
        "2-qadam: Har bir qism kichik bo‘laklarda saralanadi.",
        "3-qadam: Tartibli qismlar birlashtiriladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Bo‘linish Darajasi",
      gameInstruction: "8 ta elementli massiv Merge Sortda nechta bo‘linish darajasida 1 talikka tushadi?",
      gameChoices: ["3 darajada (2³ = 8)", "8 darajada", "2 darajada"],
    },
    ru: {
      month: "1-й мес. • 2-я нед.",
      title: "Урок 4: Merge, Quick, Counting, Radix и Bucket Sort",
      topic: "Быстрые сортировки",
      algo: "Merge & Quick Sort",
      intro:
        "Введение: На больших объёмах данных O(n²) слишком медленна, поэтому применяют «разделяй и властвуй» и несортирующие методы.",
      lecture30Min: [
        {
          heading: "1. Merge Sort — O(n log n)",
          body: "Делит массив пополам, сортирует части и сливает их в единый отсортированный массив.",
        },
        {
          heading: "2. Quick Sort — в среднем O(n log n)",
          body: "Выбирает опорный элемент (pivot) и рекурсивно сортирует части.",
        },
        {
          heading: "3. Counting, Radix & Bucket Sort",
          body: "Сортировки подсчётом, по разрядам и по корзинам.",
        },
      ],
      showSteps: [
        "Шаг 1: Делим [8, 3, 5, 1] на [8, 3] и [5, 1].",
        "Шаг 2: Сортируем каждую часть.",
        "Шаг 3: Сливаем отсортированные фрагменты.",
      ],
      gameTitle: "90-Минутная Игра: Уровни Деления",
      gameInstruction: "За сколько уровней деления Merge Sort доходит до блоков по 1 элементу при N = 8?",
      gameChoices: ["За 3 уровня (2³ = 8)", "За 8 уровней", "За 2 уровня"],
    },
    en: {
      month: "Month 1 • Week 2",
      title: "Lesson 4: Merge, Quick, Counting, Radix & Bucket Sort",
      topic: "Fast Sorting Algorithms",
      algo: "Merge & Quick Sort",
      intro:
        "Intro: Because O(n²) doesn’t scale to large inputs, divide-and-conquer and distribution sorts are essential.",
      lecture30Min: [
        {
          heading: "1. Merge Sort — O(n log n)",
          body: "Splits the array in half, sorts each half, and merges them cleanly.",
        },
        {
          heading: "2. Quick Sort — O(n log n) average",
          body: "Partitions around a pivot and recursively sorts subarrays.",
        },
        {
          heading: "3. Counting, Radix & Bucket Sort",
          body: "Linear-time specialized sorts based on counts, digits, or buckets.",
        },
      ],
      showSteps: [
        "Step 1: Split [8, 3, 5, 1] into [8, 3] and [5, 1].",
        "Step 2: Sort each subproblem.",
        "Step 3: Merge the sorted halves.",
      ],
      gameTitle: "90-Minute Game: Division Depth",
      gameInstruction: "How many split levels does Merge Sort take to reach size 1 for N = 8?",
      gameChoices: ["3 levels (2³ = 8)", "8 levels", "2 levels"],
    },
  },
  {
    id: "lesson-5",
    order: 5,
    monthNumber: 1,
    bigO: "O(2ⁿ)",
    uz: {
      month: "1-oy • 3-hafta",
      title: "5-dars: Rekursiya, Backtracking & Oltin Burchak Spiral (137.5°)",
      topic: "Rekursiya, Backtracking va Spiral",
      algo: "Backtracking & Golden Spiral",
      intro:
        "Kirish: Rekursiya va backtracking murakkab variantlarni tekshirishda, oltin burchak spiral (137.5°) esa tabiat va geometriyadagi muvozanatli taqsimotni ko‘rsatishda ishlatiladi.",
      lecture30Min: [
        {
          heading: "1. Rekursiya va Base Case",
          body: "Funksiya o‘zini kichikroq holat bilan chaqiradi; to‘xtash sharti (base case) cheksiz chaqiruvning oldini oladi.",
        },
        {
          heading: "2. Backtracking",
          body: "Yechimni qadamma-qadam quradi; shart bajarilmasa orqaga qaytib boshqa yo‘lni sinaydi.",
        },
        {
          heading: "3. Oltin Burchak Spiral (137.5°)",
          body: "r = c·√i va θ = i·137.5° formulasi nuqtalarni zich va tabiiy spiral shaklida joylashtiradi.",
        },
      ],
      showSteps: [
        "1-qadam: Base case tekshiriladi.",
        "2-qadam: Burchak +137.5° ga burilib, radius √i ga ko‘paytiriladi.",
        "3-qadam: Noto‘g‘ri yo‘lda orqaga qaytib (backtrack) boshqa variant tanlanadi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Backtracking Harakati",
      gameInstruction: "Labirintda yo‘l berkitilsa, Backtracking nima qiladi?",
      gameChoices: [
        "Oxirgi tanlov nuqtasiga qaytib boshqa yo‘lni sinaydi",
        "Barcha yo‘llarni o‘chiradi",
        "Bir joyda to‘xtab qoladi",
      ],
    },
    ru: {
      month: "1-й мес. • 3-я нед.",
      title: "Урок 5: Рекурсия, Backtracking и Золотой Угол (137.5°)",
      topic: "Рекурсия, Backtracking и спираль",
      algo: "Backtracking & Golden Spiral",
      intro:
        "Введение: Рекурсия и backtracking перебирают варианты, а спираль золотого угла (137.5°) показывает равномерное распределение.",
      lecture30Min: [
        {
          heading: "1. Рекурсия и базовый случай",
          body: "Функция вызывает себя для меньшей задачи; базовый случай предотвращает бесконечную рекурсию.",
        },
        {
          heading: "2. Backtracking",
          body: "Строит решение по шагам и откатывается назад при нарушении ограничений.",
        },
        {
          heading: "3. Спираль золотого угла (137.5°)",
          body: "Формулы r = c·√i и θ = i·137.5° создают плотное, равномерное спиральное расположение.",
        },
      ],
      showSteps: [
        "Шаг 1: Проверяем базовый случай.",
        "Шаг 2: Поворачиваем на +137.5° и масштабируем радиус пропорционально √i.",
        "Шаг 3: При тупике откатываемся назад и пробуем другой путь.",
      ],
      gameTitle: "90-Минутная Игра: Действие Backtracking",
      gameInstruction: "Что делает Backtracking, когда путь в лабиринте заблокирован?",
      gameChoices: [
        "Возвращается к последнему выбору и пробует другой путь",
        "Удаляет все пути",
        "Замирает на месте",
      ],
    },
    en: {
      month: "Month 1 • Week 3",
      title: "Lesson 5: Recursion, Backtracking & Golden Angle Spiral (137.5°)",
      topic: "Recursion, Backtracking and Spiral",
      algo: "Backtracking & Golden Spiral",
      intro:
        "Intro: Recursion and backtracking explore search spaces, while the golden angle (137.5°) illustrates balanced radial packing.",
      lecture30Min: [
        {
          heading: "1. Recursion & Base Case",
          body: "Solves smaller subproblems until a base case terminates the call chain.",
        },
        {
          heading: "2. Backtracking",
          body: "Builds candidates incrementally and backtracks as soon as a constraint fails.",
        },
        {
          heading: "3. Golden Angle Spiral (137.5°)",
          body: "Using r = c·√i and θ = i·137.5° spaces points evenly along a spiral.",
        },
      ],
      showSteps: [
        "Step 1: Check the base case.",
        "Step 2: Advance angle by +137.5° and scale radius with √i.",
        "Step 3: Backtrack on a dead end and test another branch.",
      ],
      gameTitle: "90-Minute Game: Backtracking Move",
      gameInstruction: "When a path hits a dead end in a maze, what does Backtracking do?",
      gameChoices: [
        "Steps back to the last decision point and tries another branch",
        "Deletes all paths",
        "Stays stuck in place",
      ],
    },
  },
  {
    id: "lesson-6",
    order: 6,
    monthNumber: 1,
    bigO: "O(n log n)",
    uz: {
      month: "1-oy • 3-hafta",
      title: "6-dars: Convex Hull, Geometriya, Evklid GCD & Eratosfen G‘alviri",
      topic: "Geometriya va Sonlar Nazariyasi",
      algo: "Convex Hull & GCD",
      intro:
        "Kirish: Geometriya, EKUB (GCD) va tub sonlarni topish algoritmlari hisoblash samaradorligining muhim qismidir.",
      lecture30Min: [
        {
          heading: "1. Convex Hull",
          body: "Nuqtalar to‘plamini tashqaridan o‘rab turuvchi eng kichik qavariq ko‘pburchak.",
        },
        {
          heading: "2. Evklid Algoritmi (GCD)",
          body: "gcd(a, b) = gcd(b, a % b) orqali eng katta umumiy bo‘luvchini tez topadi.",
        },
        {
          heading: "3. Eratosfen G‘alviri",
          body: "Tub sonlarning karralilarini belgilab, tub sonlarni tezkor ajratib oladi.",
        },
      ],
      showSteps: [
        "1-qadam: gcd(48, 18) -> gcd(18, 12).",
        "2-qadam: gcd(12, 6) -> gcd(6, 0) = 6.",
        "3-qadam: Tub sonlar karralilari elab chiqiladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Qavariq Qobiq",
      gameInstruction: "Nuqtalar atrofiga tortilgan eng kichik qavariq chegara qanday ataladi?",
      gameChoices: ["Convex Hull", "Bitta nuqta", "Kvadrat har doim"],
    },
    ru: {
      month: "1-й мес. • 3-я нед.",
      title: "Урок 6: Convex Hull, Геометрия, НОД Евклида и Решето Эратосфена",
      topic: "Геометрия и теория чисел",
      algo: "Convex Hull & GCD",
      intro:
        "Введение: Вычислительная геометрия, НОД и поиск простых чисел — важные инструменты эффективных алгоритмов.",
      lecture30Min: [
        {
          heading: "1. Convex Hull",
          body: "Наименьшая выпуклая оболочка, содержащая заданное множество точек.",
        },
        {
          heading: "2. Алгоритм Евклида (НОД)",
          body: "Находит наибольший общий делитель по формуле gcd(a, b) = gcd(b, a % b).",
        },
        {
          heading: "3. Решето Эратосфена",
          body: "Отсеивает составные числа, отмечая кратные простых чисел.",
        },
      ],
      showSteps: [
        "Шаг 1: gcd(48, 18) -> gcd(18, 12).",
        "Шаг 2: gcd(12, 6) -> gcd(6, 0) = 6.",
        "Шаг 3: Вычёркиваем кратные простых чисел.",
      ],
      gameTitle: "90-Минутная Игра: Выпуклая Оболочка",
      gameInstruction: "Как называется наименьшая выпуклая граница вокруг множества точек?",
      gameChoices: ["Convex Hull", "Одна точка", "Всегда квадрат"],
    },
    en: {
      month: "Month 1 • Week 3",
      title: "Lesson 6: Convex Hull, Geometry, Euclidean GCD & Sieve of Eratosthenes",
      topic: "Geometry and Number Theory",
      algo: "Convex Hull & GCD",
      intro:
        "Intro: Computational geometry, GCD, and prime sieves form core building blocks of algorithmic problem solving.",
      lecture30Min: [
        {
          heading: "1. Convex Hull",
          body: "Smallest convex polygon enclosing a given set of points.",
        },
        {
          heading: "2. Euclidean Algorithm (GCD)",
          body: "Computes greatest common divisor via gcd(a, b) = gcd(b, a % b).",
        },
        {
          heading: "3. Sieve of Eratosthenes",
          body: "Marks multiples of primes to find primes efficiently.",
        },
      ],
      showSteps: [
        "Step 1: gcd(48, 18) -> gcd(18, 12).",
        "Step 2: gcd(12, 6) -> gcd(6, 0) = 6.",
        "Step 3: Sieve out multiples of primes.",
      ],
      gameTitle: "90-Minute Game: Convex Boundary",
      gameInstruction: "What is the smallest convex boundary enclosing a set of points called?",
      gameChoices: ["Convex Hull", "A single point", "Always a square"],
    },
  },
  {
    id: "lesson-7",
    order: 7,
    monthNumber: 1,
    bigO: "O(1)",
    uz: {
      month: "1-oy • 4-hafta",
      title: "7-dars: Stack, Queue, Deque, Linked List & Hash Table",
      topic: "Asosiy Ma’lumot Tuzilmalari",
      algo: "Stack, Queue & Hash Table",
      intro:
        "Kirish: Ma’lumotlarni to‘g‘ri tuzilmada saqlash qo‘shish, o‘chirish va qidirish tezligini belgilaydi.",
      lecture30Min: [
        {
          heading: "1. Stack (LIFO) & Queue (FIFO)",
          body: "Stack oxirgi kirganini birinchi chiqaradi; Queue esa birinchi kirganini birinchi chiqaradi.",
        },
        {
          heading: "2. Deque & Linked List",
          body: "Deque ikki uchdan ishlaydi; Linked List tugunlar zanjiridan tashkil topadi.",
        },
        {
          heading: "3. Hash Table",
          body: "Kalit orqali qiymatni o‘rtacha O(1) vaqtda topadi.",
        },
      ],
      showSteps: [
        "1-qadam: Stackga [1, 2] kirsa, pop() avval 2 ni qaytaradi.",
        "2-qadam: Queuega [1, 2] kirsa, dequeue() avval 1 ni qaytaradi.",
        "3-qadam: Hash jadval kalitni indeksga bog‘laydi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: LIFO Qoidasi",
      gameInstruction: "Stack (LIFO) da oxirgi qo‘shilgan element qachon chiqariladi?",
      gameChoices: ["Eng birinchi bo‘lib", "Eng oxirida", "Hech qachon"],
    },
    ru: {
      month: "1-й мес. • 4-я нед.",
      title: "Урок 7: Stack, Queue, Deque, Linked List и Hash Table",
      topic: "Базовые структуры данных",
      algo: "Stack, Queue & Hash Table",
      intro:
        "Введение: Выбор структуры данных определяет скорость вставки, удаления и поиска.",
      lecture30Min: [
        {
          heading: "1. Stack (LIFO) и Queue (FIFO)",
          body: "Стек работает по принципу «последним пришёл — первым вышел», очередь — «первым пришёл — первым вышел».",
        },
        {
          heading: "2. Deque и Linked List",
          body: "Дек поддерживает операции с обоих концов, связный список состоит из узлов.",
        },
        {
          heading: "3. Hash Table",
          body: "Обеспечивает поиск по ключу в среднем за O(1).",
        },
      ],
      showSteps: [
        "Шаг 1: В стеке [1, 2] pop() первым вернёт 2.",
        "Шаг 2: В очереди [1, 2] dequeue() первым вернёт 1.",
        "Шаг 3: Хэш-таблица отображает ключ в индекс.",
      ],
      gameTitle: "90-Минутная Игра: Правило LIFO",
      gameInstruction: "Когда извлекается последний добавленный элемент в Stack (LIFO)?",
      gameChoices: ["Самым первым", "Самым последним", "Никогда"],
    },
    en: {
      month: "Month 1 • Week 4",
      title: "Lesson 7: Stack, Queue, Deque, Linked List & Hash Table",
      topic: "Core Data Structures",
      algo: "Stack, Queue & Hash Table",
      intro:
        "Intro: Choosing the right data structure governs insertion, deletion, and lookup performance.",
      lecture30Min: [
        {
          heading: "1. Stack (LIFO) & Queue (FIFO)",
          body: "Stacks pop last-in first-out; queues dequeue first-in first-out.",
        },
        {
          heading: "2. Deque & Linked List",
          body: "Deques operate at both ends; linked lists chain nodes via pointers.",
        },
        {
          heading: "3. Hash Table",
          body: "Provides average O(1) key-based lookup.",
        },
      ],
      showSteps: [
        "Step 1: On stack [1, 2], pop() returns 2 first.",
        "Step 2: On queue [1, 2], dequeue() returns 1 first.",
        "Step 3: Hash tables map keys to buckets.",
      ],
      gameTitle: "90-Minute Game: LIFO Rule",
      gameInstruction: "In a Stack (LIFO), when is the most recently pushed item popped?",
      gameChoices: ["First", "Last", "Never"],
    },
  },
  {
    id: "lesson-8",
    order: 8,
    monthNumber: 1,
    bigO: "O(log n)",
    uz: {
      month: "1-oy • 4-hafta",
      title: "8-dars: Binary Search Tree (BST), Heap / Priority Queue & Trie",
      topic: "Daraxtlar, Heap va Trie",
      algo: "BST, Heap & Trie",
      intro:
        "Kirish: Daraxt, Heap va Trie tuzilmalari ierarxik qidiruv, ustuvor navbatlar va satr prefikslari bilan ishlashda qo‘llaniladi.",
      lecture30Min: [
        {
          heading: "1. Binary Search Tree (BST)",
          body: "Chapda kichik, o‘ngda katta qiymatlar joylashadi.",
        },
        {
          heading: "2. Min-Heap / Max-Heap",
          body: "Eng kichik yoki eng katta element doim yuqorida turadi.",
        },
        {
          heading: "3. Trie",
          body: "So‘zlarni harflar bo‘yicha shoxlatib saqlaydi.",
        },
      ],
      showSteps: [
        "1-qadam: Ildizdan chap yoki o‘ng shox tanlanadi.",
        "2-qadam: Heapda eng ustuvor element olinib, muvozanat tiklanadi.",
        "3-qadam: Trie bo‘ylab so‘z harfma-harf tekshiriladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Min-Heap Tepasi",
      gameInstruction: "Min-Heapda [12, 4, 19, 7] bo‘lsa, eng yuqorida qaysi son turadi?",
      gameChoices: ["4", "19", "12"],
    },
    ru: {
      month: "1-й мес. • 4-я нед.",
      title: "Урок 8: Binary Search Tree (BST), Heap и Trie",
      topic: "Деревья, Heap и Trie",
      algo: "BST, Heap & Trie",
      intro:
        "Введение: Деревья, кучи и префиксные деревья помогают в упорядоченном поиске, очередях приоритетов и работе со строками.",
      lecture30Min: [
        {
          heading: "1. Binary Search Tree (BST)",
          body: "В левом поддереве ключи меньше узла, в правом — больше.",
        },
        {
          heading: "2. Min-Heap / Max-Heap",
          body: "Минимум или максимум всегда доступен на вершине кучи.",
        },
        {
          heading: "3. Trie",
          body: "Хранит строки по префиксам символов.",
        },
      ],
      showSteps: [
        "Шаг 1: Выбираем левую или правую ветвь от корня.",
        "Шаг 2: Извлекаем приоритетный элемент и восстанавливаем кучу.",
        "Шаг 3: Проходим по Trie символ за символом.",
      ],
      gameTitle: "90-Минутная Игра: Вершина Min-Heap",
      gameInstruction: "Какое число находится на вершине Min-Heap для [12, 4, 19, 7]?",
      gameChoices: ["4", "19", "12"],
    },
    en: {
      month: "Month 1 • Week 4",
      title: "Lesson 8: Binary Search Tree (BST), Heap / Priority Queue & Trie",
      topic: "Trees, Heaps and Tries",
      algo: "BST, Heap & Trie",
      intro:
        "Intro: Trees, heaps, and tries power ordered search, priority queues, and prefix operations.",
      lecture30Min: [
        {
          heading: "1. Binary Search Tree (BST)",
          body: "Left subtrees hold smaller values; right subtrees hold larger values.",
        },
        {
          heading: "2. Min-Heap / Max-Heap",
          body: "Keeps the minimum or maximum element at the root.",
        },
        {
          heading: "3. Trie",
          body: "Stores strings along character prefix paths.",
        },
      ],
      showSteps: [
        "Step 1: Branch left or right from the root.",
        "Step 2: Pop the top priority item and heapify.",
        "Step 3: Walk the Trie character by character.",
      ],
      gameTitle: "90-Minute Game: Min-Heap Top",
      gameInstruction: "In a Min-Heap of [12, 4, 19, 7], which value sits at the top?",
      gameChoices: ["4", "19", "12"],
    },
  },
  {
    id: "lesson-9",
    order: 9,
    monthNumber: 2,
    bigO: "O(V + E)",
    uz: {
      month: "2-oy • 5-hafta",
      title: "9-dars: Graflar — BFS, DFS, Topological Sort & Sikl Aniqlash",
      topic: "Graf Aylanish Algoritmlari",
      algo: "BFS & DFS",
      intro:
        "Kirish: 2-oyda graflar, eng qisqa yo‘llar, dinamik dasturlash va optimallashtirish algoritmlarini o‘rganamiz.",
      lecture30Min: [
        {
          heading: "1. BFS — O(V + E)",
          body: "Qatlamma-qatlam yurib, vaznsiz grafda eng qisqa qadamlar sonini topadi.",
        },
        {
          heading: "2. DFS — O(V + E)",
          body: "Chuqurlikka kirib borib, komponentlar va sikllarni aniqlaydi.",
        },
        {
          heading: "3. Topological Sort",
          body: "Bog‘liq vazifalarni to‘g‘ri ketma-ketlikda joylashtiradi.",
        },
      ],
      showSteps: [
        "1-qadam: Boshlang‘ich tugun navbatga qo‘shiladi.",
        "2-qadam: Qo‘shni tugunlar tashrif buyurilgan deb belgilanadi.",
        "3-qadam: Barcha bog‘liq tugunlar aylanib chiqiladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Eng Kam Qadamli Yo‘l",
      gameInstruction: "Vaznsiz grafda eng qisqa yo‘lni topishda qaysi usul ishlatiladi?",
      gameChoices: ["BFS", "Bubble Sort", "GCD"],
    },
    ru: {
      month: "2-й мес. • 5-я нед.",
      title: "Урок 9: Графы — BFS, DFS, Topological Sort и Поиск Циклов",
      topic: "Обход графов",
      algo: "BFS & DFS",
      intro:
        "Введение: Во втором месяце изучаем графы, кратчайшие пути, динамическое программирование и оптимизацию.",
      lecture30Min: [
        {
          heading: "1. BFS — O(V + E)",
          body: "Обходит граф слоями и находит кратчайший путь в невзвешенном графе.",
        },
        {
          heading: "2. DFS — O(V + E)",
          body: "Идёт в глубину, помогая находить компоненты и циклы.",
        },
        {
          heading: "3. Topological Sort",
          body: "Упорядочивает вершины ориентированного ациклического графа по зависимостям.",
        },
      ],
      showSteps: [
        "Шаг 1: Добавляем стартовую вершину в очередь.",
        "Шаг 2: Помечаем соседние вершины как посещённые.",
        "Шаг 3: Обходим достижимые вершины.",
      ],
      gameTitle: "90-Минутная Игра: Меньше Шагов",
      gameInstruction: "Какой обход находит кратчайший путь в невзвешенном графе?",
      gameChoices: ["BFS", "Bubble Sort", "GCD"],
    },
    en: {
      month: "Month 2 • Week 5",
      title: "Lesson 9: Graphs — BFS, DFS, Topological Sort & Cycle Detection",
      topic: "Graph Traversal",
      algo: "BFS & DFS",
      intro:
        "Intro: Month 2 covers graphs, shortest paths, dynamic programming, and optimization.",
      lecture30Min: [
        {
          heading: "1. BFS — O(V + E)",
          body: "Explores level by level and finds shortest paths in unweighted graphs.",
        },
        {
          heading: "2. DFS — O(V + E)",
          body: "Explores depth-first to inspect components and cycles.",
        },
        {
          heading: "3. Topological Sort",
          body: "Orders DAG vertices so dependencies precede dependents.",
        },
      ],
      showSteps: [
        "Step 1: Enqueue the start vertex.",
        "Step 2: Mark neighbors as visited.",
        "Step 3: Traverse reachable nodes.",
      ],
      gameTitle: "90-Minute Game: Fewest Hops",
      gameInstruction: "Which traversal finds shortest paths in an unweighted graph?",
      gameChoices: ["BFS", "Bubble Sort", "GCD"],
    },
  },
  {
    id: "lesson-10",
    order: 10,
    monthNumber: 2,
    bigO: "O((V+E) log V)",
    uz: {
      month: "2-oy • 5-hafta",
      title: "10-dars: Dijkstra, Bellman-Ford, Floyd-Warshall & A* Yo‘l Topish",
      topic: "Eng Qisqa Yo‘l Algoritmlari",
      algo: "Dijkstra & A*",
      intro:
        "Kirish: Vaznli graflarda eng qisqa yoki eng arzon marshrutni topish navigatsiya va tarmoq tahlilida asosiy o‘rin tutadi.",
      lecture30Min: [
        {
          heading: "1. Dijkstra Algoritmi",
          body: "Manfiy bo‘lmagan vaznlarda eng yaqin tugun orqali masofalarni yangilaydi.",
        },
        {
          heading: "2. Bellman-Ford & Floyd-Warshall",
          body: "Manfiy vaznlar va barcha juftliklar orasidagi masofalarni hisoblaydi.",
        },
        {
          heading: "3. A* Algoritmi",
          body: "Haqiqiy masofa va taxminiy masofani birlashtirib, maqsadga tez yetadi.",
        },
      ],
      showSteps: [
        "1-qadam: Boshlang‘ich tugun masofasi 0 qilib olinadi.",
        "2-qadam: Eng kichik masofali tugun tanlanadi.",
        "3-qadam: Qo‘shni yo‘llar masofasi yangilanadi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Eng Qisqa Marshrut",
      gameInstruction: "Musbat vaznli grafda eng qisqa yo‘lni topish uchun qaysi algoritm qo‘llaniladi?",
      gameChoices: ["Dijkstra", "Selection Sort", "Trie"],
    },
    ru: {
      month: "2-й мес. • 5-я нед.",
      title: "Урок 10: Dijkstra, Bellman-Ford, Floyd-Warshall и A*",
      topic: "Кратчайшие пути",
      algo: "Dijkstra & A*",
      intro:
        "Введение: Поиск кратчайшего маршрута во взвешенных графах важен для навигации и сетей.",
      lecture30Min: [
        {
          heading: "1. Алгоритм Дейкстры",
          body: "Обновляет расстояния при неотрицательных весах рёбер.",
        },
        {
          heading: "2. Bellman-Ford и Floyd-Warshall",
          body: "Работают с отрицательными весами и находят пути между всеми парами.",
        },
        {
          heading: "3. Алгоритм A*",
          body: "Использует эвристику для ускорения поиска цели.",
        },
      ],
      showSteps: [
        "Шаг 1: Ставим расстояние до старта равным 0.",
        "Шаг 2: Берём вершину с наименьшим расстоянием.",
        "Шаг 3: Обновляем расстояния до соседей.",
      ],
      gameTitle: "90-Минутная Игра: Кратчайший Маршрут",
      gameInstruction: "Какой алгоритм находит кратчайший путь в графе с неотрицательными весами?",
      gameChoices: ["Dijkstra", "Selection Sort", "Trie"],
    },
    en: {
      month: "Month 2 • Week 5",
      title: "Lesson 10: Dijkstra, Bellman-Ford, Floyd-Warshall & A* Pathfinding",
      topic: "Shortest Path Algorithms",
      algo: "Dijkstra & A*",
      intro:
        "Intro: Finding shortest paths in weighted graphs underpins routing, logistics, and network analysis.",
      lecture30Min: [
        {
          heading: "1. Dijkstra’s Algorithm",
          body: "Relaxes outgoing edges from the closest unvisited node for non-negative weights.",
        },
        {
          heading: "2. Bellman-Ford & Floyd-Warshall",
          body: "Handle negative weights and all-pairs shortest paths.",
        },
        {
          heading: "3. A* Search",
          body: "Combines path cost with a heuristic estimate to guide search.",
        },
      ],
      showSteps: [
        "Step 1: Initialize source distance to 0.",
        "Step 2: Pick the nearest unvisited vertex.",
        "Step 3: Relax adjacent edge weights.",
      ],
      gameTitle: "90-Minute Game: Shortest Route",
      gameInstruction: "Which algorithm finds shortest paths with non-negative edge weights?",
      gameChoices: ["Dijkstra", "Selection Sort", "Trie"],
    },
  },
  {
    id: "lesson-11",
    order: 11,
    monthNumber: 2,
    bigO: "O(E log E)",
    uz: {
      month: "2-oy • 6-hafta",
      title: "11-dars: Union-Find (DSU), Kruskal MST & Prim MST",
      topic: "MST va Union-Find",
      algo: "Kruskal & Prim MST",
      intro:
        "Kirish: Tarmoqlarni eng kam xarajat bilan ulash Minimal Qamrovchi Daraxt (MST) algoritmlari orqali bajariladi.",
      lecture30Min: [
        {
          heading: "1. Union-Find (DSU)",
          body: "Guruhlarni birlashtirish va bir guruhga mansublikni tez tekshiradi.",
        },
        {
          heading: "2. Kruskal MST",
          body: "Eng arzon qirralarni sikl hosil qilmaydigan tartibda qo‘shadi.",
        },
        {
          heading: "3. Prim MST",
          body: "Daraxtga eng yaqin yangi tugunni ulab boradi.",
        },
      ],
      showSteps: [
        "1-qadam: Qirralar vazni bo‘yicha tartiblanadi.",
        "2-qadam: Sikl hosil qiluvchi qirralar chetlab o‘tiladi.",
        "3-qadam: Minimal xarajatli ulanish hosil bo‘ladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Sikl Nazorati",
      gameInstruction: "MST qurishda yangi qirra sikl yaratsa, nima qilish kerak?",
      gameChoices: ["Uni qo‘shmaslik", "Barcha qirralarni o‘chirish", "Vaznni oshirish"],
    },
    ru: {
      month: "2-й мес. • 6-я нед.",
      title: "Урок 11: Union-Find (DSU), Kruskal MST и Prim MST",
      topic: "MST и Union-Find",
      algo: "Kruskal & Prim MST",
      intro:
        "Введение: Минимальное остовное дерево (MST) соединяет вершины с минимальной суммарной стоимостью.",
      lecture30Min: [
        {
          heading: "1. Union-Find (DSU)",
          body: "Быстро объединяет компоненты и проверяет принадлежность к одной компоненте.",
        },
        {
          heading: "2. Kruskal MST",
          body: "Добавляет рёбра по возрастанию веса, не образуя циклов.",
        },
        {
          heading: "3. Prim MST",
          body: "Растит дерево, присоединяя ближайшее ребро к текущей компоненте.",
        },
      ],
      showSteps: [
        "Шаг 1: Сортируем рёбра по весу.",
        "Шаг 2: Пропускаем рёбра, создающие цикл.",
        "Шаг 3: Получаем минимальный остов.",
      ],
      gameTitle: "90-Минутная Игра: Контроль Циклов",
      gameInstruction: "Что делать при построении MST, если ребро замыкает цикл?",
      gameChoices: ["Не добавлять его", "Удалить все рёбра", "Увеличить вес"],
    },
    en: {
      month: "Month 2 • Week 6",
      title: "Lesson 11: Union-Find (DSU), Kruskal MST & Prim MST",
      topic: "MST and Union-Find",
      algo: "Kruskal & Prim MST",
      intro:
        "Intro: Minimum Spanning Trees (MST) connect vertices at minimum total edge cost.",
      lecture30Min: [
        {
          heading: "1. Union-Find (DSU)",
          body: "Tracks disjoint sets and merges components efficiently.",
        },
        {
          heading: "2. Kruskal’s MST",
          body: "Picks lightest edges that do not form a cycle.",
        },
        {
          heading: "3. Prim’s MST",
          body: "Grows the tree by adding the cheapest crossing edge.",
        },
      ],
      showSteps: [
        "Step 1: Sort edges by weight.",
        "Step 2: Skip edges that create a cycle.",
        "Step 3: Assemble the minimum spanning tree.",
      ],
      gameTitle: "90-Minute Game: Cycle Check",
      gameInstruction: "When building an MST, what do you do if an edge creates a cycle?",
      gameChoices: ["Skip it", "Delete all edges", "Increase its weight"],
    },
  },
  {
    id: "lesson-12",
    order: 12,
    monthNumber: 2,
    bigO: "O(n)",
    uz: {
      month: "2-oy • 6-hafta",
      title: "12-dars: Kadane’s Algorithm, Sliding Window Max & Bit Manipulation",
      topic: "Kadane va Bitli Amallar",
      algo: "Kadane & XOR",
      intro:
        "Kirish: Maksimal qism yig‘indini topish va bitlar bilan ishlash tezkor hisoblashda juda samarali.",
      lecture30Min: [
        {
          heading: "1. Kadane’s Algorithm — O(n)",
          body: "Eng katta uzluksiz qism massiv yig‘indisini bitta o‘tishda topadi.",
        },
        {
          heading: "2. Sliding Window Max",
          body: "Har bir oynadagi eng katta qiymatni kuzatib boradi.",
        },
        {
          heading: "3. Bit Manipulation",
          body: "AND, OR, XOR va siljitish amallari bilan tezkor hisoblash.",
        },
      ],
      showSteps: [
        "1-qadam: Joriy yig‘indi yangilanadi.",
        "2-qadam: Maksimal natija saqlab boriladi.",
        "3-qadam: Bitli amallar tekshiriladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: XOR Natijasi",
      gameInstruction: "a ^ a ifodasi nimaga teng?",
      gameChoices: ["0 ga", "a ga", "1 ga"],
    },
    ru: {
      month: "2-й мес. • 6-я нед.",
      title: "Урок 12: Алгоритм Кадане, Sliding Window Max и Битовые Операции",
      topic: "Кадане и битовые операции",
      algo: "Kadane & XOR",
      intro:
        "Введение: Поиск максимальной суммы подмассива и битовые операции помогают писать быстрый код.",
      lecture30Min: [
        {
          heading: "1. Алгоритм Кадане — O(n)",
          body: "Находит максимальную сумму непрерывного подмассива за один проход.",
        },
        {
          heading: "2. Sliding Window Max",
          body: "Отслеживает максимум в скользящем окне.",
        },
        {
          heading: "3. Битовые операции",
          body: "AND, OR, XOR и сдвиги для быстрой обработки данных.",
        },
      ],
      showSteps: [
        "Шаг 1: Обновляем текущую сумму.",
        "Шаг 2: Сохраняем лучший результат.",
        "Шаг 3: Проверяем битовую логику.",
      ],
      gameTitle: "90-Минутная Игра: Результат XOR",
      gameInstruction: "Чему равно выражение a ^ a?",
      gameChoices: ["0", "a", "1"],
    },
    en: {
      month: "Month 2 • Week 6",
      title: "Lesson 12: Kadane’s Algorithm, Sliding Window Max & Bit Manipulation",
      topic: "Kadane and Bitwise Ops",
      algo: "Kadane & XOR",
      intro:
        "Intro: Maximum subarray sums and bitwise operations enable fast, clean solutions.",
      lecture30Min: [
        {
          heading: "1. Kadane’s Algorithm — O(n)",
          body: "Finds the maximum contiguous subarray sum in a single pass.",
        },
        {
          heading: "2. Sliding Window Max",
          body: "Tracks the maximum element across each window.",
        },
        {
          heading: "3. Bit Manipulation",
          body: "Uses AND, OR, XOR, and shifts for low-level efficiency.",
        },
      ],
      showSteps: [
        "Step 1: Update current running sum.",
        "Step 2: Track the best sum seen so far.",
        "Step 3: Verify bitwise operations.",
      ],
      gameTitle: "90-Minute Game: XOR Result",
      gameInstruction: "What does a ^ a evaluate to?",
      gameChoices: ["0", "a", "1"],
    },
  },
  {
    id: "lesson-13",
    order: 13,
    monthNumber: 2,
    bigO: "O(n·W)",
    uz: {
      month: "2-oy • 7-hafta",
      title: "13-dars: Dinamik Dasturlash (1D DP) & 0/1 Knapsack (Ryukzak)",
      topic: "1D DP va Knapsack",
      algo: "Dynamic Programming",
      intro:
        "Kirish: Dinamik dasturlash takroriy hisoblashlarni eslab qolib, murakkab masalalarni tez yechadi.",
      lecture30Min: [
        {
          heading: "1. Memoization & Tabulation",
          body: "Oldingi natijalarni saqlab, bir xil masalani qayta ishlamaslik.",
        },
        {
          heading: "2. 1D DP",
          body: "Bir o‘lchovli holatlar zanjiri orqali yechim qurish.",
        },
        {
          heading: "3. 0/1 Knapsack",
          body: "Berilgan sig‘im ichida eng katta qiymatni yig‘ish.",
        },
      ],
      showSteps: [
        "1-qadam: Boshlang‘ich holatlar aniqlanadi.",
        "2-qadam: O‘tish formulasi bo‘yicha qiymatlar hisoblanadi.",
        "3-qadam: Yakuniy optimal natija olinadi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: DP Foydasi",
      gameInstruction: "DP da natijalarni saqlash nimani tejaydi?",
      gameChoices: ["Takror hisoblash vaqtini", "Xotirani doim 0 qiladi", "Kod shriftini o‘zgartiradi"],
    },
    ru: {
      month: "2-й мес. • 7-я нед.",
      title: "Урок 13: Динамическое Программирование (1D DP) и 0/1 Knapsack",
      topic: "1D DP и рюкзак",
      algo: "Dynamic Programming",
      intro:
        "Введение: Динамическое программирование сохраняет результаты подзадач, избегая повторных вычислений.",
      lecture30Min: [
        {
          heading: "1. Мемоизация и табуляция",
          body: "Кэширование результатов подзадач сверху вниз или заполнение таблицы снизу вверх.",
        },
        {
          heading: "2. 1D DP",
          body: "Построение ответа по одномерному состоянию.",
        },
        {
          heading: "3. Задача о рюкзаке (0/1 Knapsack)",
          body: "Максимизация ценности при ограничении вместимости.",
        },
      ],
      showSteps: [
        "Шаг 1: Задаём базовые состояния.",
        "Шаг 2: Пересчитываем состояния по формуле перехода.",
        "Шаг 3: Получаем оптимальный ответ.",
      ],
      gameTitle: "90-Минутная Игра: Польза DP",
      gameInstruction: "Что экономит сохранение промежуточных результатов в DP?",
      gameChoices: ["Время повторных вычислений", "Обнуляет память", "Меняет шрифт кода"],
    },
    en: {
      month: "Month 2 • Week 7",
      title: "Lesson 13: Dynamic Programming (1D DP) & 0/1 Knapsack",
      topic: "1D DP and Knapsack",
      algo: "Dynamic Programming",
      intro:
        "Intro: Dynamic programming avoids recomputing overlapping subproblems.",
      lecture30Min: [
        {
          heading: "1. Memoization & Tabulation",
          body: "Cache subproblem results top-down or build answers bottom-up in a table.",
        },
        {
          heading: "2. 1D DP",
          body: "Transitions along a one-dimensional state array.",
        },
        {
          heading: "3. 0/1 Knapsack",
          body: "Maximizes total value within a capacity limit.",
        },
      ],
      showSteps: [
        "Step 1: Define base cases.",
        "Step 2: Apply the state transition formula.",
        "Step 3: Read the optimal answer.",
      ],
      gameTitle: "90-Minute Game: DP Benefit",
      gameInstruction: "What does caching subproblems in DP save?",
      gameChoices: ["Repeated computation time", "Sets memory to zero", "Changes editor font"],
    },
  },
  {
    id: "lesson-14",
    order: 14,
    monthNumber: 2,
    bigO: "O(n·m)",
    uz: {
      month: "2-oy • 7-hafta",
      title: "14-dars: 2D DP — LCS, LIS & Edit Distance (Levenshtein)",
      topic: "2D DP: LCS, LIS, Edit Distance",
      algo: "LCS & Edit Distance",
      intro:
        "Kirish: Matnlar va ketma-ketliklarni solishtirishda 2D dinamik dasturlash keng qo‘llaniladi.",
      lecture30Min: [
        {
          heading: "1. LCS",
          body: "Ikki ketma-ketlikdagi eng uzun umumiy qism ketma-ketlik.",
        },
        {
          heading: "2. LIS",
          body: "Eng uzun o‘suvchi qism ketma-ketlik.",
        },
        {
          heading: "3. Edit Distance",
          body: "Qo‘shish, o‘chirish va almashtirish amallarining eng kam soni.",
        },
      ],
      showSteps: [
        "1-qadam: 2D jadval yaratiladi.",
        "2-qadam: Moslik va o‘tish shartlari to‘ldiriladi.",
        "3-qadam: Jadval oxiridan javob olinadi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Edit Distance Amallari",
      gameInstruction: "Edit Distance da qaysi amallar asosiy hisoblanadi?",
      gameChoices: ["Insert, Delete, Replace", "Faqat o‘chirish", "Faqat nusxalash"],
    },
    ru: {
      month: "2-й мес. • 7-я нед.",
      title: "Урок 14: 2D DP — LCS, LIS и Edit Distance (Левенштейн)",
      topic: "2D DP: LCS, LIS, Edit Distance",
      algo: "LCS & Edit Distance",
      intro:
        "Введение: Двумерное ДП помогает сравнивать строки и последовательности.",
      lecture30Min: [
        {
          heading: "1. LCS",
          body: "Наибольшая общая подпоследовательность двух последовательностей.",
        },
        {
          heading: "2. LIS",
          body: "Наибольшая возрастающая подпоследовательность.",
        },
        {
          heading: "3. Edit Distance",
          body: "Минимальное число операций вставки, удаления и замены.",
        },
      ],
      showSteps: [
        "Шаг 1: Создаём 2D-таблицу.",
        "Шаг 2: Заполняем переходы и совпадения.",
        "Шаг 3: Считываем итоговое значение.",
      ],
      gameTitle: "90-Минутная Игра: Операции Edit Distance",
      gameInstruction: "Какие операции входят в Edit Distance?",
      gameChoices: ["Insert, Delete, Replace", "Только удаление", "Только копирование"],
    },
    en: {
      month: "Month 2 • Week 7",
      title: "Lesson 14: 2D DP — LCS, LIS & Edit Distance (Levenshtein)",
      topic: "2D DP: LCS, LIS, Edit Distance",
      algo: "LCS & Edit Distance",
      intro:
        "Intro: 2D dynamic programming compares strings and sequences cleanly.",
      lecture30Min: [
        {
          heading: "1. LCS",
          body: "Longest Common Subsequence between two sequences.",
        },
        {
          heading: "2. LIS",
          body: "Longest Increasing Subsequence.",
        },
        {
          heading: "3. Edit Distance",
          body: "Minimum insertions, deletions, and substitutions to transform one string into another.",
        },
      ],
      showSteps: [
        "Step 1: Allocate a 2D DP table.",
        "Step 2: Fill matches and transition costs.",
        "Step 3: Read the final distance.",
      ],
      gameTitle: "90-Minute Game: Edit Distance Ops",
      gameInstruction: "Which operations define standard Edit Distance?",
      gameChoices: ["Insert, Delete, Replace", "Delete only", "Copy only"],
    },
  },
  {
    id: "lesson-15",
    order: 15,
    monthNumber: 2,
    bigO: "O(n log n)",
    uz: {
      month: "2-oy • 8-hafta",
      title: "15-dars: Greedy Algoritmlar & Satr Algoritmlari (KMP, Z-Algorithm)",
      topic: "Greedy va KMP",
      algo: "Greedy & KMP",
      intro:
        "Kirish: Vaqt intervallarini rejalashtirish va matn ichidan naqshni tez qidirish amaliyotda ko‘p uchraydi.",
      lecture30Min: [
        {
          heading: "1. Greedy Algoritmlar",
          body: "Har qadamda eng foydali lokal qarorni tanlash.",
        },
        {
          heading: "2. KMP Satr Qidiruvi",
          body: "Prefiks jadvali yordamida ortiqcha qaytishlarsiz qidirish.",
        },
        {
          heading: "3. Shartni Tekshirish",
          body: "Greedy tanlov to‘g‘ri ishlash shartlarini tekshirish.",
        },
      ],
      showSteps: [
        "1-qadam: Intervallar tugash vaqti bo‘yicha saralanadi.",
        "2-qadam: Mos keyingi interval tanlanadi.",
        "3-qadam: KMP jadvali orqali tez siljish amalga oshiriladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Intervallar Tanlovi",
      gameInstruction: "Eng ko‘p uchrashuvga ulgurish uchun avval qaysi birini tanlash foydali?",
      gameChoices: ["Eng erta tugaydiganini", "Eng kech boshlanadiganini", "Eng uzunini"],
    },
    ru: {
      month: "2-й мес. • 8-я нед.",
      title: "Урок 15: Жадные Алгоритмы и Поиск по Строкам (KMP, Z-Algorithm)",
      topic: "Greedy и KMP",
      algo: "Greedy & KMP",
      intro:
        "Введение: Планирование интервалов и быстрый поиск подстроки часто встречаются на практике.",
      lecture30Min: [
        {
          heading: "1. Жадные алгоритмы",
          body: "Выбор локально лучшего решения на каждом шаге.",
        },
        {
          heading: "2. Алгоритм KMP",
          body: "Использует префикс-функцию, чтобы не возвращаться назад по тексту.",
        },
        {
          heading: "3. Проверка корректности",
          body: "Убеждаемся, что жадный выбор не портит оптимальность.",
        },
      ],
      showSteps: [
        "Шаг 1: Сортируем интервалы по времени окончания.",
        "Шаг 2: Выбираем следующий совместимый интервал.",
        "Шаг 3: Сдвигаемся по префикс-таблице KMP.",
      ],
      gameTitle: "90-Минутная Игра: Выбор Интервалов",
      gameInstruction: "Какой интервал лучше выбрать первым, чтобы вместить больше встреч?",
      gameChoices: ["Который заканчивается раньше всех", "Который начинается позже всех", "Самый длинный"],
    },
    en: {
      month: "Month 2 • Week 8",
      title: "Lesson 15: Greedy Algorithms & String Matching (KMP, Z-Algorithm)",
      topic: "Greedy and KMP",
      algo: "Greedy & KMP",
      intro:
        "Intro: Interval scheduling and fast pattern matching are staples of practical engineering.",
      lecture30Min: [
        {
          heading: "1. Greedy Algorithms",
          body: "Make the locally optimal choice at each step when greedy choice holds.",
        },
        {
          heading: "2. KMP Pattern Matching",
          body: "Uses a prefix table (LPS) to avoid re-checking matched characters.",
        },
        {
          heading: "3. Correctness Check",
          body: "Verify that greedy choices preserve global optimality.",
        },
      ],
      showSteps: [
        "Step 1: Sort intervals by finish time.",
        "Step 2: Pick the next non-overlapping interval.",
        "Step 3: Shift using the KMP table on mismatch.",
      ],
      gameTitle: "90-Minute Game: Interval Selection",
      gameInstruction: "To fit the maximum number of non-overlapping meetings, which should you pick first?",
      gameChoices: ["Earliest finish time", "Latest start time", "Longest duration"],
    },
  },
  {
    id: "lesson-16",
    order: 16,
    monthNumber: 2,
    bigO: "O(n log n)",
    uz: {
      month: "2-oy • 8-hafta (Yakuniy)",
      title: "16-dars: Algoritmlar Sintezi, Murakkablik Tahlili & Yakuniy Amaliyot",
      topic: "Algoritmlar Sintezi",
      algo: "Algorithm Mastery",
      intro:
        "Kirish: 2 oylik dasturning yakuniy darsi — masala shartiga qarab eng mos algoritm va murakkablikni tanlash.",
      lecture30Min: [
        {
          heading: "1. Hajm (n) Va Murakkablik",
          body: "Katta n uchun O(n log n), O(n) yoki O(V + E) yechimlar tanlanadi.",
        },
        {
          heading: "2. Masala Turiga Qarab Tanlov",
          body: "Qidiruv, graf, DP yoki greedy usulni to‘g‘ri aniqlash.",
        },
        {
          heading: "3. Yakuniy Tekshiruv",
          body: "Chekka holatlar va testlar orqali yechimni mustahkamlash.",
        },
      ],
      showSteps: [
        "1-qadam: Kiruvchi hajm va shartlar o‘qiladi.",
        "2-qadam: Mos algoritm tanlanadi.",
        "3-qadam: Testlar orqali tekshiriladi.",
      ],
      gameTitle: "90 Daqiqalik O‘yin: Tezlikni Hisobla",
      gameInstruction: "n = 200,000 bo‘lsa, qaysi murakkablik qulay?",
      gameChoices: ["O(n log n) yoki O(n)", "O(n!)", "O(2ⁿ)"],
    },
    ru: {
      month: "2-й мес. • 8-я нед. (Итог)",
      title: "Урок 16: Синтез Алгоритмов, Анализ Сложности и Практика",
      topic: "Синтез алгоритмов",
      algo: "Algorithm Mastery",
      intro:
        "Введение: Итоговый урок двухмесячного курса — выбор подходящего алгоритма и сложности под условия задачи.",
      lecture30Min: [
        {
          heading: "1. Размер входа (n) и сложность",
          body: "Для больших n подходят решения O(n log n), O(n) или O(V + E).",
        },
        {
          heading: "2. Выбор по типу задачи",
          body: "Определяем, нужен ли поиск, граф, ДП или жадный подход.",
        },
        {
          heading: "3. Финальная проверка",
          body: "Проверяем граничные случаи и тесты.",
        },
      ],
      showSteps: [
        "Шаг 1: Анализируем ограничения и размер n.",
        "Шаг 2: Подбираем алгоритм.",
        "Шаг 3: Проверяем на тестах.",
      ],
      gameTitle: "90-Минутная Игра: Оценка Сложности",
      gameInstruction: "Какая сложность комфортна при n = 200,000?",
      gameChoices: ["O(n log n) или O(n)", "O(n!)", "O(2ⁿ)"],
    },
    en: {
      month: "Month 2 • Week 8 (Capstone)",
      title: "Lesson 16: Algorithm Synthesis, Complexity Analysis & Final Practice",
      topic: "Algorithm Synthesis",
      algo: "Algorithm Mastery",
      intro:
        "Intro: Capstone lesson — matching constraints and input sizes to the right algorithm and complexity.",
      lecture30Min: [
        {
          heading: "1. Input Size (n) & Complexity",
          body: "Large n generally calls for O(n log n), O(n), or O(V + E) approaches.",
        },
        {
          heading: "2. Matching Problem Patterns",
          body: "Decide between search, graph, DP, greedy, or data-structure techniques.",
        },
        {
          heading: "3. Final Verification",
          body: "Validate edge cases and test thoroughly.",
        },
      ],
      showSteps: [
        "Step 1: Read constraints and input size n.",
        "Step 2: Choose the fitting algorithm.",
        "Step 3: Test edge cases.",
      ],
      gameTitle: "90-Minute Game: Complexity Check",
      gameInstruction: "For n = 200,000, which complexity fits comfortably?",
      gameChoices: ["O(n log n) or O(n)", "O(n!)", "O(2ⁿ)"],
    },
  },
];

function getLocalizedLessons(lang) {
  const safeLang = ["uz", "ru", "en"].includes(lang) ? lang : "uz";
  return LESSON_SPECS.map((spec) => {
    const l = spec[safeLang] || spec.uz;
    return {
      id: spec.id,
      order: spec.order,
      monthNumber: spec.monthNumber,
      month: l.month,
      title: l.title,
      algoName: l.algo,
      intro: l.intro,
      lecture30Min: l.lecture30Min,
      showSteps: l.showSteps,
      gameChallenge: {
        title: l.gameTitle,
        instruction: l.gameInstruction,
        choices: l.gameChoices,
        correctIndex: 0,
      },
      quiz10: buildLocalizedQuiz10(safeLang, l.topic, l.algo, spec.bigO),
    };
  });
}

function LanguageSwitcher({ lang, onChangeLang }) {
  const langs = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];
  return (
    <div className="inline-flex shrink-0 items-center rounded-xl border border-slate-700/80 bg-slate-950/90 p-0.5 text-[11px] font-extrabold">
      {langs.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => onChangeLang(item.code)}
          className={`rounded-lg px-2 py-1 transition cursor-pointer ${
            lang === item.code
              ? "bg-cyan-400 text-slate-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function StudyWindowModal({
  isOpen,
  onClose,
  lessonScores = {},
  onCompleteLesson,
  theme = "dark",
  lang = "uz",
  onChangeLang,
}) {
  const t = UI_BY_LANG[lang] || UI_BY_LANG.uz;
  const lessons16 = useMemo(() => getLocalizedLessons(lang), [lang]);
  const isLight = theme === "light";

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState(lessons16[0].id);
  const [stepMode, setStepMode] = useState("theory");
  const [shownStep, setShownStep] = useState(0);
  const [gameChoice, setGameChoice] = useState(null);
  const [gameSolved, setGameSolved] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [answers, setAnswers] = useState({});
  const [quizSummary, setQuizSummary] = useState(null);

  const unlockedOrders = useMemo(() => {
    const unlocked = [1];
    for (let i = 0; i < lessons16.length - 1; i += 1) {
      const curr = lessons16[i];
      const next = lessons16[i + 1];
      if ((lessonScores?.[curr.id] ?? 0) >= PASS_SCORE) {
        unlocked.push(next.order);
      } else {
        break;
      }
    }
    return unlocked;
  }, [lessonScores, lessons16]);

  const currentLesson =
    lessons16.find((l) => l.id === activeLessonId) || lessons16[0];

  const visibleLessons = useMemo(() => {
    if (selectedMonth === 0) return lessons16;
    return lessons16.filter((l) => l.monthNumber === selectedMonth);
  }, [selectedMonth, lessons16]);

  const nextLesson = useMemo(() => {
    return lessons16.find((l) => l.order === currentLesson.order + 1) || null;
  }, [currentLesson, lessons16]);

  if (!isOpen) return null;

  const resetCurrentLessonState = () => {
    setStepMode("theory");
    setShownStep(0);
    setGameChoice(null);
    setGameSolved(false);
    setGameMessage("");
    setAnswers({});
    setQuizSummary(null);
  };

  const handleSelectLesson = (lesson) => {
    if (!unlockedOrders.includes(lesson.order)) return;
    setActiveLessonId(lesson.id);
    resetCurrentLessonState();
  };

  const handleCheckGame = () => {
    if (gameChoice === null) return;
    const ok = gameChoice === currentLesson.gameChallenge.correctIndex;
    setGameSolved(ok);
    setGameMessage(ok ? t.gameOkMsg : t.gameRetryMsg);
  };

  const handleFinishQuiz = () => {
    const list = currentLesson.quiz10 || [];
    let correct = 0;
    list.forEach((item, idx) => {
      if (answers[idx] === item.correctIndex) correct += 1;
    });
    const raw = Math.round((correct / Math.max(1, list.length)) * MAX_SCORE);
    const evalRes = evaluateStageScore(raw);
    setQuizSummary({ ...evalRes, correct, total: list.length });
    if (typeof onCompleteLesson === "function") {
      onCompleteLesson(currentLesson.id, evalRes.score);
    }
  };

  const handleNextLesson = () => {
    if (!nextLesson) return;
    setActiveLessonId(nextLesson.id);
    setSelectedMonth(0);
    resetCurrentLessonState();
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= (currentLesson.quiz10?.length || 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md">
      <div
        className={`max-h-[90dvh] w-full max-w-6xl overflow-y-auto overflow-x-hidden rounded-2xl sm:rounded-3xl border shadow-2xl ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-cyan-500/30 bg-slate-900 text-slate-100"
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-3.5 py-3 sm:px-5 sm:py-4 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/85"
          }`}
        >
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              {t.studyBtn}
            </span>
            <h2 className="mt-1 text-base sm:text-xl font-extrabold leading-snug">
              {currentLesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onChangeLang && <LanguageSwitcher lang={lang} onChangeLang={onChangeLang} />}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 p-3.5 sm:p-5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 0, label: t.allLessons },
              { id: 1, label: t.month1 },
              { id: 2, label: t.month2 },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={`rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold cursor-pointer ${
                  selectedMonth === m.id
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {visibleLessons.map((lesson) => {
              const unlocked = unlockedOrders.includes(lesson.order);
              const best = lessonScores?.[lesson.id] ?? 0;
              const isSel = currentLesson.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`rounded-xl border p-3 text-left text-xs transition ${
                    !unlocked
                      ? "cursor-not-allowed border-slate-800 bg-slate-950/50 text-slate-500 opacity-60"
                      : isSel
                        ? "cursor-pointer border-cyan-400 bg-cyan-500/15"
                        : "cursor-pointer border-slate-800 bg-slate-950/75 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between font-bold">
                    <span>
                      {unlocked
                        ? `${lesson.order}-${t.lessonBadge}`
                        : `${t.lockedLessonBadge} ${lesson.order}`}
                    </span>
                    <span className="text-emerald-400">
                      {best}/{MAX_SCORE}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 font-semibold">{lesson.title}</div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 border-t border-slate-800 pt-3.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setStepMode("theory")}
              className={`rounded-xl px-3 py-2 cursor-pointer ${
                stepMode === "theory"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t.step1Tab}
            </button>
            <button
              type="button"
              onClick={() => setStepMode("game")}
              className={`rounded-xl px-3 py-2 cursor-pointer ${
                stepMode === "game"
                  ? "bg-fuchsia-400 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t.step2Tab}
            </button>
            <button
              type="button"
              disabled={!gameSolved}
              onClick={() => setStepMode("quiz")}
              className={`rounded-xl px-3 py-2 ${
                !gameSolved
                  ? "cursor-not-allowed bg-slate-900 text-slate-500 border border-slate-800"
                  : stepMode === "quiz"
                    ? "cursor-pointer bg-emerald-400 text-slate-950"
                    : "cursor-pointer bg-slate-800 text-emerald-300"
              }`}
            >
              {gameSolved ? t.step3Tab : `🔒 ${t.step3Tab}`}
            </button>
          </div>

          {stepMode === "theory" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/25 p-3.5 sm:p-4 text-xs sm:text-sm text-cyan-100">
                <div className="text-[11px] font-bold uppercase text-cyan-400">{t.introLabel}</div>
                <p className="mt-1">{currentLesson.intro}</p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <div className="text-[11px] font-bold uppercase text-fuchsia-400">
                  {t.lecture30Label}
                </div>
                {currentLesson.lecture30Min.map((sec, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 sm:p-3.5"
                  >
                    <div className="text-xs font-bold text-cyan-300">{sec.heading}</div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3.5 sm:p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    {t.showLabel} ({shownStep + 1}/{currentLesson.showSteps.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setShownStep((p) => (p + 1) % currentLesson.showSteps.length)
                    }
                    className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 cursor-pointer"
                  >
                    {t.nextStepBtn}
                  </button>
                </div>
                <p className="text-xs text-slate-200">{currentLesson.showSteps[shownStep]}</p>
              </div>

              <button
                type="button"
                onClick={() => setStepMode("game")}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 cursor-pointer"
              >
                {t.toGameBtn}
              </button>
            </div>
          )}

          {stepMode === "game" && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase text-fuchsia-400">{t.game90Label}</div>
              <h3 className="text-base sm:text-lg font-bold">{currentLesson.gameChallenge.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentLesson.gameChallenge.instruction}
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {currentLesson.gameChallenge.choices.map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGameChoice(idx)}
                    className={`rounded-xl border p-3 text-left text-xs cursor-pointer ${
                      gameChoice === idx
                        ? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
                        : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  disabled={gameChoice === null}
                  onClick={handleCheckGame}
                  className="rounded-xl bg-fuchsia-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 disabled:opacity-40 cursor-pointer"
                >
                  {t.checkGameBtn}
                </button>
                {gameSolved && (
                  <button
                    type="button"
                    onClick={() => setStepMode("quiz")}
                    className="rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 cursor-pointer"
                  >
                    {t.toQuizBtn}
                  </button>
                )}
              </div>

              {gameMessage && (
                <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-3 text-xs text-cyan-200">
                  {gameMessage}
                </div>
              )}
            </div>
          )}

          {stepMode === "quiz" && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase text-emerald-400">
                {t.quiz10Label} ({MAX_SCORE} • {PASS_SCORE}) — {answeredCount}/
                {currentLesson.quiz10.length}
              </div>

              <div className="max-h-80 sm:max-h-96 space-y-2.5 overflow-y-auto pr-1">
                {currentLesson.quiz10.map((qItem, qIdx) => (
                  <div
                    key={qIdx}
                    className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3"
                  >
                    <div className="text-xs font-semibold text-white">
                      {qIdx + 1}. {qItem.q}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                      {qItem.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className={`rounded-xl border p-2.5 text-left text-xs cursor-pointer ${
                            answers[qIdx] === oIdx
                              ? "border-emerald-400 bg-emerald-500/20 text-white"
                              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
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
                disabled={!allAnswered}
                onClick={handleFinishQuiz}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-xs font-extrabold text-slate-950 disabled:opacity-40 cursor-pointer"
              >
                {t.finishQuizBtn}
              </button>

              {quizSummary && (
                <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-3.5 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                      {quizSummary.score} / {quizSummary.maxScore} ({quizSummary.correct}/
                      {quizSummary.total}) — {quizSummary.statusLabel}
                    </span>
                    {quizSummary.passed && nextLesson && (
                      <button
                        type="button"
                        onClick={handleNextLesson}
                        className="rounded-lg bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 cursor-pointer"
                      >
                        {t.nextLessonBtn} ({nextLesson.order}) →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPanelModal({
  isOpen,
  onClose,
  theme = "dark",
  lang = "uz",
  onChangeLang,
  usersDb = [],
  paymentsDb = [],
  lessonScores = {},
  examScores = {},
  stageScores = {},
  suggestions = [],
  leaderboard = [],
  onClearDemoStorage,
}) {
  const t = UI_BY_LANG[lang] || UI_BY_LANG.uz;
  const isLight = theme === "light";
  const [adminTab, setAdminTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const q = searchTerm.trim().toLowerCase();

  const filteredUsers = usersDb.filter((u) => {
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q) ||
      (u.provider || "").toLowerCase().includes(q)
    );
  });

  const filteredPayments = paymentsDb.filter((p) => {
    if (!q) return true;
    return (
      (p.cardHolder || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.last4 || "").toLowerCase().includes(q)
    );
  });

  const handleExportJson = () => {
    const dump = {
      exportedAt: new Date().toISOString(),
      mode: "demo-localstorage",
      lang,
      usersDb,
      paymentsDb,
      lessonScores,
      examScores,
      stageScores,
      suggestions,
      leaderboard,
    };
    const text = JSON.stringify(dump, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md">
      <div
        className={`max-h-[90dvh] w-full max-w-6xl overflow-y-auto overflow-x-hidden rounded-2xl sm:rounded-3xl border shadow-2xl ${
          isLight
            ? "border-slate-200 bg-white text-slate-900"
            : "border-amber-500/35 bg-slate-900 text-slate-100"
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-3.5 py-3 sm:px-5 sm:py-4 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/85"
          }`}
        >
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              {t.adminBadge}
            </span>
            <h2 className="mt-1 text-base sm:text-xl font-extrabold leading-snug">
              {t.adminTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {onChangeLang && <LanguageSwitcher lang={lang} onChangeLang={onChangeLang} />}
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            >
              {copiedJson ? t.copiedJson : t.copyJson}
            </button>
            <button
              type="button"
              onClick={onClearDemoStorage}
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              {t.clearStorage}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 p-3.5 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-3.5">
              <div className="text-[11px] text-slate-400">{t.usersCount}</div>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-cyan-400">
                {usersDb.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-3.5">
              <div className="text-[11px] text-slate-400">{t.paymentsCount}</div>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-400">
                {paymentsDb.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-3.5">
              <div className="text-[11px] text-slate-400">{t.scoresCount}</div>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-fuchsia-400">
                {Object.keys(lessonScores).length +
                  Object.keys(examScores).length +
                  Object.keys(stageScores).length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-3.5">
              <div className="text-[11px] text-slate-400">{t.suggestionsCount}</div>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-300">
                {suggestions.length}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { id: "users", label: `${t.tabUsers} (${usersDb.length})` },
                { id: "payments", label: `${t.tabPayments} (${paymentsDb.length})` },
                { id: "scores", label: t.tabScores },
                { id: "suggestions", label: `${t.tabSuggestions} (${suggestions.length})` },
              ].map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  onClick={() => setAdminTab(tabItem.id)}
                  className={`rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold cursor-pointer ${
                    adminTab === tabItem.id
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full sm:w-72 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {adminTab === "users" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
              <table className="min-w-[640px] w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="px-3.5 py-2.5">#</th>
                    <th className="px-3.5 py-2.5">Name</th>
                    <th className="px-3.5 py-2.5">Email</th>
                    <th className="px-3.5 py-2.5">Phone</th>
                    <th className="px-3.5 py-2.5">Provider</th>
                    <th className="px-3.5 py-2.5">Human</th>
                    <th className="px-3.5 py-2.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                        —
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, i) => (
                      <tr key={u.id || i} className="hover:bg-slate-900/50">
                        <td className="px-3.5 py-2.5 font-bold text-cyan-400">{i + 1}</td>
                        <td className="px-3.5 py-2.5 font-semibold text-white">{u.name || "—"}</td>
                        <td className="px-3.5 py-2.5 text-slate-300">{u.email || "—"}</td>
                        <td className="px-3.5 py-2.5 text-slate-300">{u.phone || "—"}</td>
                        <td className="px-3.5 py-2.5">
                          <span className="rounded-lg bg-indigo-500/15 px-2 py-0.5 font-semibold text-indigo-300">
                            {u.provider || "email"}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 font-semibold text-emerald-400">
                          {u.verifiedHuman ? "✓ OK" : "—"}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === "payments" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
              <table className="min-w-[520px] w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="px-3.5 py-2.5">#</th>
                    <th className="px-3.5 py-2.5">Holder</th>
                    <th className="px-3.5 py-2.5">Card</th>
                    <th className="px-3.5 py-2.5">Status</th>
                    <th className="px-3.5 py-2.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                        —
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p, i) => (
                      <tr key={p.id || i} className="hover:bg-slate-900/50">
                        <td className="px-3.5 py-2.5 font-bold text-emerald-400">{i + 1}</td>
                        <td className="px-3.5 py-2.5 font-semibold text-white">
                          {p.cardHolder || "—"}
                        </td>
                        <td className="px-3.5 py-2.5 font-mono text-cyan-300">
                          {p.brand || "CARD"} •••• {p.last4 || "0000"}
                        </td>
                        <td className="px-3.5 py-2.5 text-emerald-400 font-semibold">PRO (Demo)</td>
                        <td className="px-3.5 py-2.5 text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === "scores" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 sm:p-4 space-y-2">
                <div className="text-xs font-bold text-cyan-400">{t.studyBtn}</div>
                {Object.keys(lessonScores).length === 0 ? (
                  <p className="text-xs text-slate-400">—</p>
                ) : (
                  Object.entries(lessonScores).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between rounded-lg bg-slate-900 px-3 py-2 text-xs"
                    >
                      <span>{k}</span>
                      <strong className="text-emerald-400">
                        {v}/{MAX_SCORE}
                      </strong>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 sm:p-4 space-y-2">
                <div className="text-xs font-bold text-amber-300">{t.weeklyExamBtn}</div>
                {Object.keys(examScores).length === 0 ? (
                  <p className="text-xs text-slate-400">—</p>
                ) : (
                  Object.entries(examScores).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between rounded-lg bg-slate-900 px-3 py-2 text-xs"
                    >
                      <span>{k}</span>
                      <strong className="text-emerald-400">
                        {v}/{MAX_SCORE}
                      </strong>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 sm:p-4 space-y-2">
                <div className="text-xs font-bold text-fuchsia-400">{t.levelsTitle}</div>
                {Object.entries(stageScores).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between rounded-lg bg-slate-900 px-3 py-2 text-xs"
                  >
                    <span>Level {k}</span>
                    <strong className="text-emerald-400">
                      {v}/{MAX_SCORE}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === "suggestions" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 sm:p-4 space-y-2.5">
                <div className="text-xs font-bold text-fuchsia-300">{t.suggestionsCount}</div>
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs"
                  >
                    <div className="flex justify-between font-bold text-cyan-300">
                      <span>{s.author}</span>
                      <span className="text-amber-300">▲ {s.votes}</span>
                    </div>
                    <p className="mt-1 text-slate-200">{s.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 sm:p-4 space-y-2">
                <div className="text-xs font-bold text-emerald-300">{t.tabSuggestions}</div>
                {[...leaderboard]
                  .sort((a, b) => b.score - a.score)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs"
                    >
                      <span>
                        #{idx + 1} <strong>{item.name}</strong>
                      </span>
                      <span className="font-bold text-emerald-400">{item.score}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = readLocalJson(STORAGE_KEYS.lang, "uz");
    return ["uz", "ru", "en"].includes(saved) ? saved : "uz";
  });
  const t = UI_BY_LANG[lang] || UI_BY_LANG.uz;

  const [activePage, setActivePage] = useState("landing");
  const [user, setUser] = useState(() => readLocalJson(STORAGE_KEYS.user, null));
  const [usersDb, setUsersDb] = useState(() => readLocalJson(STORAGE_KEYS.usersDb, []));
  const [paymentsDb, setPaymentsDb] = useState(() =>
    readLocalJson(STORAGE_KEYS.paymentsDb, [])
  );

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = readLocalJson(STORAGE_KEYS.theme, "dark");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isPythonOpen, setIsPythonOpen] = useState(false);
  const [isWeeklyExamOpen, setIsWeeklyExamOpen] = useState(false);
  const [studioTab, setStudioTab] = useState("algorithms");

  const [lessonScores, setLessonScores] = useState(() =>
    readLocalJson(STORAGE_KEYS.lessonScores, {})
  );
  const [examScores, setExamScores] = useState(() =>
    readLocalJson(STORAGE_KEYS.examScores, {})
  );
  const [stageScores, setStageScores] = useState(() =>
    readLocalJson(STORAGE_KEYS.stageScores, { 1: 86 })
  );
  const [selectedLevel, setSelectedLevel] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [algoSearch, setAlgoSearch] = useState("");
  const [selectedAlgoId, setSelectedAlgoId] = useState(ALGORITHMS_32[0].id);
  const [isAnimating, setIsAnimating] = useState(true);
  const [autoDemo, setAutoDemo] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1.2);
  const [animTick, setAnimTick] = useState(0);

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const [leaderboard, setLeaderboard] = useState(() =>
    readLocalJson(STORAGE_KEYS.leaderboard, INITIAL_LEADERBOARD_BY_LANG.uz)
  );
  const [suggestionInput, setSuggestionInput] = useState("");
  const [suggestions, setSuggestions] = useState(() =>
    readLocalJson(STORAGE_KEYS.suggestions, INITIAL_SUGGESTIONS_BY_LANG.uz)
  );

  const canvasRef = useRef(null);

  const handleChangeLang = (nextLang) => {
    if (!["uz", "ru", "en"].includes(nextLang)) return;
    setLang(nextLang);
    setLeaderboard((prev) => {
      const defaults = INITIAL_LEADERBOARD_BY_LANG[nextLang] || INITIAL_LEADERBOARD_BY_LANG.uz;
      return prev.map((item) => {
        if (item.id === "u1") {
          return { ...item, name: defaults[0].name };
        }
        return item;
      });
    });
    setSuggestions((prev) => {
      const prevDefaults = Object.values(INITIAL_SUGGESTIONS_BY_LANG).flat();
      const onlyCustom = prev.filter(
        (s) => !prevDefaults.some((d) => d.id === s.id && d.text === s.text)
      );
      return [
        ...(INITIAL_SUGGESTIONS_BY_LANG[nextLang] || INITIAL_SUGGESTIONS_BY_LANG.uz),
        ...onlyCustom,
      ];
    });
  };

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.user, user);
  }, [user]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.usersDb, usersDb);
  }, [usersDb]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.paymentsDb, paymentsDb);
  }, [paymentsDb]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.lessonScores, lessonScores);
  }, [lessonScores]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.examScores, examScores);
  }, [examScores]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.stageScores, stageScores);
  }, [stageScores]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.leaderboard, leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    writeLocalJson(STORAGE_KEYS.suggestions, suggestions);
  }, [suggestions]);

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    setUsersDb((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const filtered = list.filter(
        (item) => (item.email || "").toLowerCase() !== (loggedUser.email || "").toLowerCase()
      );
      return [
        {
          ...loggedUser,
          updatedAt: loggedUser.updatedAt || new Date().toISOString(),
        },
        ...filtered,
      ];
    });
  };

  const handleCompleteLesson = (lessonId, earnedScore) => {
    setLessonScores((prev) => ({
      ...prev,
      [lessonId]: Math.max(prev[lessonId] ?? 0, earnedScore),
    }));

    setLeaderboard((prev) =>
      prev.map((item) =>
        item.id === "u1"
          ? {
              ...item,
              score: Math.max(item.score, earnedScore),
              efficiency: earnedScore >= PASS_SCORE ? "94%" : item.efficiency,
            }
          : item
      )
    );
  };

  const handleCompleteExam = (examId, earnedScore) => {
    setExamScores((prev) => ({
      ...prev,
      [examId]: Math.max(prev[examId] ?? 0, earnedScore),
    }));

    setLeaderboard((prev) =>
      prev.map((item) =>
        item.id === "u1"
          ? {
              ...item,
              score: Math.max(item.score, earnedScore),
              efficiency: earnedScore >= PASS_SCORE ? "97%" : item.efficiency,
            }
          : item
      )
    );
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
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
      ...(user || { name: cardInfo.cardHolder, email: "pro@devlens.uz" }),
      isPro: true,
      cardLast4: cardInfo.last4,
      cardBrand: cardInfo.brand,
      updatedAt: new Date().toISOString(),
    };
    setUser(updatedUser);
    handleAuthSuccess(updatedUser);

    const paymentRecord = {
      id: `pay_${Date.now()}`,
      cardHolder: cardInfo.cardHolder || updatedUser.name,
      email: updatedUser.email,
      brand: cardInfo.brand || "CARD",
      last4: cardInfo.last4 || "0000",
      createdAt: new Date().toISOString(),
    };
    setPaymentsDb((prev) => [paymentRecord, ...(Array.isArray(prev) ? prev : [])]);
    setActivePage("workspace");
  };

  const handleClearDemoStorage = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k === STORAGE_KEYS.lang) return;
      try {
        localStorage.removeItem(k);
      } catch (e) {
        console.error(e);
      }
    });
    setUser(null);
    setUsersDb([]);
    setPaymentsDb([]);
    setLessonScores({});
    setExamScores({});
    setStageScores({ 1: 86 });
    setLeaderboard(INITIAL_LEADERBOARD_BY_LANG[lang] || INITIAL_LEADERBOARD_BY_LANG.uz);
    setSuggestions(INITIAL_SUGGESTIONS_BY_LANG[lang] || INITIAL_SUGGESTIONS_BY_LANG.uz);
  };

  const unlockedLevels = useMemo(() => getUnlockedLevels(stageScores), [stageScores]);
  const maxUnlockedLevel = useMemo(() => Math.max(1, ...unlockedLevels), [unlockedLevels]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(ALGORITHMS_32.map((item) => item.category)));
    return ["Barchasi", ...unique];
  }, []);

  const filteredAlgorithms = useMemo(() => {
    const q = algoSearch.trim().toLowerCase();
    return ALGORITHMS_32.filter((item) => {
      const catOk = selectedCategory === "Barchasi" || item.category === selectedCategory;
      const lvlOk = item.level <= maxUnlockedLevel;
      const searchOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.bigO.toLowerCase().includes(q);
      return catOk && lvlOk && searchOk;
    });
  }, [selectedCategory, maxUnlockedLevel, algoSearch]);

  const activeAlgorithm = useMemo(() => {
    return (
      ALGORITHMS_32.find((item) => item.id === selectedAlgoId) ||
      filteredAlgorithms[0] ||
      ALGORITHMS_32[0]
    );
  }, [selectedAlgoId, filteredAlgorithms]);

  const currentChallenge = BUG_HUNT_CHALLENGES[challengeIdx] || BUG_HUNT_CHALLENGES[0];

  useEffect(() => {
    if (activePage !== "workspace" || studioTab !== "algorithms" || !autoDemo) return;
    const pool = filteredAlgorithms.length > 0 ? filteredAlgorithms : ALGORITHMS_32;
    const timer = setInterval(() => {
      setSelectedAlgoId((prevId) => {
        const idx = pool.findIndex((a) => a.id === prevId);
        const nextIdx = (idx + 1) % pool.length;
        return pool[nextIdx].id;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [activePage, studioTab, autoDemo, filteredAlgorithms]);

  useEffect(() => {
    if (activePage !== "workspace" || studioTab !== "algorithms" || !isAnimating) return;
    let rafId = 0;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAnimTick((prev) => (prev + dt * 2.1 * animSpeed) % 10000);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [activePage, studioTab, isAnimating, animSpeed]);

  useEffect(() => {
    if (activePage !== "workspace" || studioTab !== "algorithms") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#091226");
    bgGrad.addColorStop(0.55, "#0b152b");
    bgGrad.addColorStop(1, "#050814");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 24; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 24; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const cat = activeAlgorithm.category;

    if (cat === "Graflar") {
      const nodes = [
        { x: cx - 170, y: cy - 55, label: "A" },
        { x: cx - 55, y: cy - 85, label: "B" },
        { x: cx - 55, y: cy + 55, label: "C" },
        { x: cx + 65, y: cy - 65, label: "D" },
        { x: cx + 65, y: cy + 65, label: "E" },
        { x: cx + 185, y: cy, label: "F" },
      ];
      const edges = [
        [0, 1], [0, 2], [1, 3], [2, 4], [1, 4], [3, 5], [4, 5],
      ];
      const activeIdx = Math.floor(animTick * 1.4) % nodes.length;

      edges.forEach(([a, b]) => {
        const isPath = a === activeIdx || b === activeIdx;
        ctx.strokeStyle = isPath ? "#34d399" : "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = isPath ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });

      nodes.forEach((n, idx) => {
        const hit = idx === activeIdx;
        ctx.fillStyle = hit ? "#f472b6" : "#0f172a";
        ctx.strokeStyle = hit ? "#f9a8d4" : "#22d3ee";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, hit ? 20 : 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y);
      });
    } else if (cat === "Matematika & Geo") {
      ctx.beginPath();
      const total = 130;
      for (let i = 0; i < total; i += 1) {
        const angle = i * ((137.5 * Math.PI) / 180) + animTick * 0.35;
        const r = Math.min(width, height) * 0.4 * Math.sqrt((i + 1) / total);
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const g = ctx.createLinearGradient(cx - 140, cy - 120, cx + 140, cy + 120);
      g.addColorStop(0, "#22d3ee");
      g.addColorStop(0.5, "#a855f7");
      g.addColorStop(1, "#f472b6");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const tipAngle = animTick * 1.1;
      const tipR = Math.min(width, height) * 0.36;
      const tx = cx + Math.cos(tipAngle) * tipR;
      const ty = cy + Math.sin(tipAngle) * tipR;

      ctx.strokeStyle = "rgba(52, 211, 153, 0.75)";
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (cat === "Tuzilmalar") {
      const boxes = 6;
      const boxW = 74;
      const boxH = 34;
      const startX = cx - ((boxes * (boxW + 12)) / 2);
      const highlightIdx = Math.floor(animTick * 1.5) % boxes;

      for (let i = 0; i < boxes; i += 1) {
        const bx = startX + i * (boxW + 12);
        const by = cy - boxH / 2 + Math.sin(animTick + i) * 6;
        const active = i === highlightIdx;

        ctx.fillStyle = active ? "rgba(34, 211, 238, 0.22)" : "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = active ? "#22d3ee" : "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(bx, by, boxW, boxH, 8);
        } else {
          ctx.rect(bx, by, boxW, boxH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = active ? "#67e8f9" : "#e2e8f0";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`[${(i + 1) * 15}]`, bx + boxW / 2, by + boxH / 2);

        if (i < boxes - 1) {
          ctx.strokeStyle = "#a855f7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx + boxW + 2, by + boxH / 2);
          ctx.lineTo(bx + boxW + 10, by + boxH / 2);
          ctx.stroke();
        }
      }
    } else {
      const barsCount = 16;
      const gap = 8;
      const usableWidth = Math.max(140, width - 64 - gap * (barsCount - 1));
      const barWidth = Math.max(10, usableWidth / barsCount);
      const activeIndex = Math.floor(animTick * 2.2) % barsCount;
      const secondaryIndex = (activeIndex + 1) % barsCount;

      for (let i = 0; i < barsCount; i += 1) {
        const baseHeight = ((i + 2) / (barsCount + 2)) * (height - 88);
        const wave = 0.72 + 0.28 * Math.cos(animTick * 0.7 + i * 0.45);
        const barHeight = Math.max(24, baseHeight * wave);
        const x = 32 + i * (barWidth + gap);
        const y = height - 28 - barHeight;

        const isPrimary = i === activeIndex;
        const isSecondary = i === secondaryIndex;

        ctx.fillStyle = isPrimary ? "#22d3ee" : isSecondary ? "#f472b6" : "#334155";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, barWidth, barHeight, 6);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    }
  }, [activePage, studioTab, activeAlgorithm, animTick]);

  const handleSubmitTest = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentChallenge.correctIndex;
    const earned = isCorrect ? MAX_SCORE : 54;
    const evaluated = evaluateStageScore(earned);

    setTestResult({
      ...evaluated,
      isCorrect,
      explanation: currentChallenge.explanation,
    });

    const targetLevel = currentChallenge.level || 1;
    setStageScores((prev) => ({
      ...prev,
      [targetLevel]: Math.max(prev[targetLevel] ?? 0, earned),
    }));

    setLeaderboard((prev) =>
      prev.map((item) =>
        item.id === "u1"
          ? {
              ...item,
              score: Math.max(item.score, earned),
              efficiency: isCorrect ? "98%" : item.efficiency,
            }
          : item
      )
    );
  };

  const handleAddSuggestion = (e) => {
    e.preventDefault();
    const trimmed = suggestionInput.trim();
    if (!trimmed) return;
    setSuggestions((prev) => [
      {
        id: `s-${Date.now()}`,
        author: user?.name || t.defaultUserName,
        text: trimmed,
        votes: 1,
      },
      ...prev,
    ]);
    setSuggestionInput("");
  };

  const handleVote = (id) => {
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
  };

  const sortedLeaderboard = useMemo(
    () => [...leaderboard].sort((a, b) => b.score - a.score),
    [leaderboard]
  );

  const isLight = theme === "light";

  return (
    <div
      data-theme={theme}
      data-lang={lang}
      className={`min-h-screen flex flex-col overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-slate-950 relative transition-colors duration-300 ${
        isLight
          ? "bg-gradient-to-br from-slate-100 via-sky-50/70 to-indigo-100/60 text-slate-900"
          : "bg-[#05070d] text-slate-100"
      }`}
    >
      <AnimatedBackground theme={theme} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        theme={theme}
        lang={lang}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        user={user}
        theme={theme}
        lang={lang}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        theme={theme}
        lang={lang}
        onChangeLang={handleChangeLang}
        usersDb={usersDb}
        paymentsDb={paymentsDb}
        lessonScores={lessonScores}
        examScores={examScores}
        stageScores={stageScores}
        suggestions={suggestions}
        leaderboard={leaderboard}
        onClearDemoStorage={handleClearDemoStorage}
      />

      <StudyWindowModal
        isOpen={isStudyOpen}
        onClose={() => setIsStudyOpen(false)}
        lessonScores={lessonScores}
        onCompleteLesson={handleCompleteLesson}
        theme={theme}
        lang={lang}
        onChangeLang={handleChangeLang}
      />

      <PythonStudioModal
        isOpen={isPythonOpen}
        onClose={() => setIsPythonOpen(false)}
        theme={theme}
        lang={lang}
      />

      <WeeklyExamModal
        isOpen={isWeeklyExamOpen}
        onClose={() => setIsWeeklyExamOpen(false)}
        examScores={examScores}
        onCompleteExam={handleCompleteExam}
        theme={theme}
        lang={lang}
      />

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          lang={lang}
          onChangeLang={handleChangeLang}
        />

        {activePage === "landing" ? (
          <main className="flex-1 min-w-0">
            <Hero onStart={() => setActivePage("workspace")} theme={theme} lang={lang} />
            <BentoFeatures onStart={() => setActivePage("workspace")} theme={theme} lang={lang} />
            <Pricing
              user={user}
              onStart={() => setActivePage("workspace")}
              onSelectPro={handleSelectPro}
              theme={theme}
              lang={lang}
            />

            <footer
              className={`py-6 sm:py-8 px-4 border-t text-center text-xs transition-colors duration-300 ${
                isLight
                  ? "border-slate-200 bg-white/75 text-slate-500"
                  : "border-white/10 bg-[#05070c]/60 backdrop-blur-md text-slate-500"
              }`}
            >
              <div className="mb-2.5 flex justify-center">
                <LanguageSwitcher lang={lang} onChangeLang={handleChangeLang} />
              </div>
              {t.footerText}
            </footer>
          </main>
        ) : (
          <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 min-w-0">
            <div className="flex flex-col gap-3 rounded-2xl border border-cyan-500/25 bg-slate-900/85 p-3 sm:p-4 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudyOpen(true)}
                  className="col-span-2 sm:col-span-1 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow hover:opacity-95 transition cursor-pointer"
                >
                  {t.studyBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("algorithms")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    studioTab === "algorithms"
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {t.algosTab}
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("test")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    studioTab === "test"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {t.testTab}
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("community")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    studioTab === "community"
                      ? "bg-fuchsia-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {t.communityTab}
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("dashboard")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    studioTab === "dashboard"
                      ? "bg-indigo-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {t.dashboardTab}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5">
                <LanguageSwitcher lang={lang} onChangeLang={handleChangeLang} />

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(true)}
                    className="rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-extrabold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
                  >
                    {t.adminBtn} ({usersDb.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWeeklyExamOpen(true)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
                  >
                    {t.weeklyExamBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPythonOpen(true)}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-lg hover:opacity-95 transition cursor-pointer"
                  >
                    {t.pythonBtn}
                  </button>
                </div>
              </div>
            </div>

            {studioTab !== "dashboard" && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-cyan-300">
                    {t.levelsTitle} ({MAX_SCORE} • {PASS_SCORE})
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    {t.passNote} {PASS_SCORE} {t.passNoteEnd}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4].map((lvl) => {
                    const unlocked = unlockedLevels.includes(lvl);
                    const sc = stageScores[lvl] ?? 0;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          !unlocked
                            ? "cursor-not-allowed border-slate-800 bg-slate-950/60 text-slate-600"
                            : selectedLevel === lvl
                              ? "cursor-pointer border-cyan-400 bg-cyan-500/20 text-cyan-200"
                              : "cursor-pointer border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }`}
                      >
                        {unlocked ? `Level ${lvl}` : `🔒 Level ${lvl}`} • {sc}/{MAX_SCORE}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {studioTab === "algorithms" && (
              <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 min-w-0">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/85 p-3.5 sm:p-4 lg:col-span-5 min-w-0">
                  <input
                    type="text"
                    value={algoSearch}
                    onChange={(e) => setAlgoSearch(e.target.value)}
                    placeholder={t.algoSearchPlaceholder}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-cyan-400 text-slate-950"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {cat === "Barchasi" ? t.allCategories : cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid max-h-72 sm:max-h-[420px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {filteredAlgorithms.map((algo) => (
                      <button
                        key={algo.id}
                        type="button"
                        onClick={() => setSelectedAlgoId(algo.id)}
                        className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                          activeAlgorithm.id === algo.id
                            ? "border-cyan-400 bg-cyan-500/15 shadow"
                            : "border-slate-800 bg-slate-950/75 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                          <span>{algo.category}</span>
                          <span>{algo.bigO}</span>
                        </div>
                        <div className="mt-1 text-sm font-bold text-white">{algo.name}</div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{algo.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 sm:gap-4 rounded-2xl border border-slate-800 bg-slate-900/85 p-3.5 sm:p-5 lg:col-span-7 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs font-semibold text-fuchsia-300">
                        Level {activeAlgorithm.level} • {activeAlgorithm.bigO} • #
                        {Math.floor(animTick * 2)}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                        {activeAlgorithm.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => setAutoDemo((d) => !d)}
                        className={`rounded-xl border px-3 py-1.5 sm:py-2 text-xs font-semibold transition cursor-pointer ${
                          autoDemo
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                            : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {autoDemo ? t.autoDemoOn : t.autoDemoOff}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAnimating((prev) => !prev)}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-cyan-300 hover:bg-slate-700 cursor-pointer"
                      >
                        {isAnimating ? t.pauseBtn : t.playBtn}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">{activeAlgorithm.desc}</p>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
                    <span>
                      {t.speedLabel}: <strong>{animSpeed.toFixed(1)}x</strong>
                    </span>
                    <input
                      type="range"
                      min="0.4"
                      max="3"
                      step="0.2"
                      value={animSpeed}
                      onChange={(e) => setAnimSpeed(Number(e.target.value))}
                      className="w-28 sm:w-36 accent-cyan-400"
                    />
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={280}
                    className="h-52 sm:h-72 w-full rounded-xl border border-slate-800"
                  />
                </div>
              </section>
            )}

            {studioTab === "test" && (
              <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-0.5 text-[11px] font-semibold text-amber-300">
                      {t.testTab}
                    </span>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-white">
                      {currentChallenge.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {BUG_HUNT_CHALLENGES.map((challenge, idx) => (
                      <button
                        key={challenge.id}
                        type="button"
                        onClick={() => {
                          setChallengeIdx(idx);
                          setSelectedOption(null);
                          setTestResult(null);
                        }}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${
                          challengeIdx === idx
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        #{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 lg:col-span-6 min-w-0">
                    {currentChallenge.animationSteps.map((stepText, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200"
                      >
                        {stepText}
                      </div>
                    ))}
                    <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-emerald-300">
                      {currentChallenge.codeSnippet}
                    </pre>
                  </div>

                  <div className="flex flex-col justify-between space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 lg:col-span-6 min-w-0">
                    <div className="space-y-2">
                      {currentChallenge.options.map((optionText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full rounded-xl border p-3 text-left text-xs transition cursor-pointer ${
                            selectedOption === idx
                              ? "border-cyan-400 bg-cyan-500/15 text-white"
                              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {optionText}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitTest}
                      disabled={selectedOption === null}
                      className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-40 cursor-pointer"
                    >
                      {t.checkBtn}
                    </button>

                    {testResult && (
                      <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-3 text-xs">
                        <div className="font-bold text-cyan-300">
                          {testResult.score} / {testResult.maxScore} — {testResult.statusLabel}
                        </div>
                        <p className="mt-1 text-slate-300">{testResult.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {studioTab === "community" && (
              <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-5 lg:col-span-5">
                  <h3 className="text-sm sm:text-base font-bold text-cyan-300">{t.communityTab}</h3>
                  <div className="space-y-2">
                    {sortedLeaderboard.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="mr-2 font-bold text-fuchsia-300">#{idx + 1}</span>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="ml-2 text-slate-400">• {item.streak}d</span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-emerald-300">{item.score}</div>
                          <div className="text-[11px] text-slate-400">{item.efficiency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-5 lg:col-span-7">
                  <h3 className="text-sm sm:text-base font-bold text-fuchsia-300">
                    {t.suggestionsCount}
                  </h3>

                  <form onSubmit={handleAddSuggestion} className="flex gap-2">
                    <input
                      type="text"
                      value={suggestionInput}
                      onChange={(e) => setSuggestionInput(e.target.value)}
                      placeholder={t.suggestionPlaceholder}
                      className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-95 cursor-pointer"
                    >
                      +
                    </button>
                  </form>

                  <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                    {suggestions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-cyan-300">{s.author}</div>
                          <p className="mt-1 text-slate-200 break-words">{s.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVote(s.id)}
                          className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-slate-700 cursor-pointer"
                        >
                          ▲ {s.votes}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {studioTab === "dashboard" && (
              <Dashboard
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                theme={theme}
                lang={lang}
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
