// src/data/weeklyExamsData.js
import { MAX_SCORE, PASS_SCORE } from "./platformData";

export const WEEKLY_EXAMS = [
  {
    id: "week-exam-1",
    week: 1,
    monthNumber: 1,
    title: "1-Haftalik Nazorat Ishi: Qidiruv va Saralash Asoslari",
    subtitle: "1–2-darslar bo‘yicha (Linear Search, Binary Search, Two Pointers, Jump/Ternary)",
    passScore: PASS_SCORE,
    maxScore: MAX_SCORE,
    questions: [
      {
        q: "Tartiblanmagan ro‘yxatdan element qidirishda qaysi algoritm majburiy qo‘llaniladi?",
        options: [
          "Linear Search (Chiziqli qidiruv)",
          "Faqat Binary Search",
          "Faqat Interpolation Search"
        ],
        correctIndex: 0,
        explain: "Binary Search faqat saralangan ma’lumotlarda ishlaydi; tartibsiz ro‘yxatda chiziqli ko‘rib chiqish kerak."
      },
      {
        q: "Binary Search qidiruv oralig‘ini har qadamda qanday o‘zgartiradi?",
        options: [
          "Ikki barobarga (yarmiga) qisqartiradi",
          "Bitta elementga kamaytiradi",
          "O‘zgartirmaydi"
        ],
        correctIndex: 0,
        explain: "Har taqqoslashda o‘rta indeks tekshirilib, keraksiz yarim qism tashlab yuboriladi."
      },
      {
        q: "Saralangan massivda yig‘indisi ma’lum songa teng ikki elementni topishda qaysi usul qulay?",
        options: [
          "Two Pointers (chap va o‘ng ko‘rsatkichlar)",
          "Tasodifiy almashtirish",
          "Faqat rekursiv nusxalash"
        ],
        correctIndex: 0,
        explain: "Saralangan massivda ikki ko‘rsatkich yig‘indini tekshirib, chap yoki o‘ng chegarani siljitadi."
      },
      {
        q: "Sliding Window usuli qaysi turdagi masalalarda vaqtni O(n) gacha tushiradi?",
        options: [
          "Uzluksiz qism massiv yoki satr (subarray / substring) masalalarida",
          "Faqat daraxt balandligini o‘lchashda",
          "Grafdagi eng uzoq yo‘lda"
        ],
        correctIndex: 0,
        explain: "Oyna chegaralarini surish orqali har bir oynani boshidan qayta hisoblash shart bo‘lmaydi."
      },
      {
        q: "Binary Search on Answer qachon ishlatiladi?",
        options: [
          "Javob qiymati monoton (tekshirish funksiyasi ha/yo‘q tartibida o‘zgaruvchi) bo‘lganda",
          "Faqat matnli fayllarni o‘qishda",
          "Massiv uzunligi 0 bo‘lganda"
        ],
        correctIndex: 0,
        explain: "Agar nomzod javob X uchun shart bajarilsa, undan katta/kichik javoblar uchun mantiq aniq bo‘lsa, ikkilik izlash ishlaydi."
      }
    ]
  },
  {
    id: "week-exam-2",
    week: 2,
    monthNumber: 1,
    title: "2-Haftalik Nazorat Ishi: Saralash Algoritmlari (O(n²) va O(n log n))",
    subtitle: "3–4-darslar bo‘yicha (Bubble, Selection, Insertion, Merge, Quick, Counting/Radix)",
    passScore: PASS_SCORE,
    maxScore: MAX_SCORE,
    questions: [
      {
        q: "Merge Sort va Quick Sort o‘rtacha holatda qanday vaqt murakkabligiga ega?",
        options: ["O(n log n)", "O(n³)", "O(1)"],
        correctIndex: 0,
        explain: "Ikkala algoritm ham bo‘lib tashlash tamoyiliga asoslanib, o‘rtacha O(n log n) tezlik beradi."
      },
      {
        q: "Qaysi saralash algoritmi elementlarni qo‘shni juftlar bo‘yicha taqqoslab joy almashtiradi?",
        options: ["Bubble Sort", "Counting Sort", "Bucket Sort"],
        correctIndex: 0,
        explain: "Bubble Sort yonma-yon elementlarni solishtirib, katta qiymatlarni o‘ngga suradi."
      },
      {
        q: "Counting Sort qaysi holatda eng samarali ishlaydi?",
        options: [
          "Qiymatlar diapazoni (k) kichik butun sonlardan iborat bo‘lganda",
          "Haqiqiy sonlarning cheksiz kasr qismlarida",
          "Graf tugunlarini saralashda"
        ],
        correctIndex: 0,
        explain: "Counting Sort O(n + k) vaqtda ishlaydi, shuning uchun k kichik bo‘lganda juda tezdir."
      },
      {
        q: "Barqaror (Stable) saralash algoritmi nimani anglatadi?",
        options: [
          "Teng qiymatli elementlarning boshlang‘ich nisbiy tartibi saqlanishini",
          "Massivni har doim kamayish tartibida chiqarishni",
          "Xotirani ikki barobar oshirishni"
        ],
        correctIndex: 0,
        explain: "Agar ikkita element teng bo‘lsa, avval kelgani avval turishi barqarorlikdir."
      },
      {
        q: "Quick Sortda yomon holat (O(n²)) qachon yuzaga kelishi mumkin?",
        options: [
          "Pivot har safar eng kichik yoki eng katta element bo‘lib qolsa",
          "Massiv uzunligi juft son bo‘lsa",
          "Elementlar musbat bo‘lsa"
        ],
        correctIndex: 0,
        explain: "Noto‘g‘ri pivot tanlovi massivni noteng bo‘laklarga ajratib, chuqurlikni n gacha oshiradi."
      }
    ]
  },
  {
    id: "week-exam-3",
    week: 3,
    monthNumber: 1,
    title: "3-Haftalik Nazorat Ishi: Rekursiya, Backtracking va Geometriya",
    subtitle: "5–6-darslar bo‘yicha (Recursion, Backtracking, Golden Spiral, Convex Hull, GCD)",
    passScore: PASS_SCORE,
    maxScore: MAX_SCORE,
    questions: [
      {
        q: "Rekursiv funksiyada base case (to‘xtash sharti) bo‘lmasa nima sodir bo‘ladi?",
        options: [
          "Cheksiz chaqiruv va stek to‘lishi (Stack Overflow / RecursionError)",
          "Funksiya avtomatik 0 qaytaradi",
          "Kompilyator uni o‘chirib tashlaydi"
        ],
        correctIndex: 0,
        explain: "To‘xtash shartisiz rekursiya chaqiruv stekini to‘ldirib, xatoga olib keladi."
      },
      {
        q: "Backtracking usuli qaysi vazifalarda qo‘llaniladi?",
        options: [
          "Kombinatsiyalar, permutatsiyalar, labirint va shartli qidiruv masalalarida",
          "Faqat sonlarni qo‘shishda",
          "Faylni o‘chirishda"
        ],
        correctIndex: 0,
        explain: "Backtracking nomzod yechimni quradi, shart buzilsa orqaga qaytib boshqa variantni sinaydi."
      },
      {
        q: "137.5° oltin burchak yordamida nuqtalar joylashtirilganda qanday shakl hosil bo‘ladi?",
        options: [
          "Tabiatdagi o‘simlik va spiral tuzilmalarga o‘xshash oltin spiral",
          "Faqat kvadrat",
          "To‘g‘ri chiziq"
        ],
        correctIndex: 0,
        explain: "Oltin burchak nuqtalarning bir-biriga ustma-ust tushmasdan zich va uyg‘un joylashishini ta’minlaydi."
      },
      {
        q: "Convex Hull (Qavariq qobiq) nima?",
        options: [
          "Nuqtalar to‘plamini o‘rab turuvchi eng kichik qavariq ko‘pburchak",
          "Ikki sonning EKUBi",
          "Massivdagi eng katta indeks"
        ],
        correctIndex: 0,
        explain: "Convex Hull tekislikdagi nuqtalarning tashqi chegarasini belgilaydi."
      },
      {
        q: "Evklid algoritmi nimani hisoblaydi?",
        options: [
          "Ikki butun sonning eng katta umumiy bo‘luvchisini (EKUB / GCD)",
          "Kvadrat tenglama ildizini",
          "Grafdagi sikllar sonini"
        ],
        correctIndex: 0,
        explain: "gcd(a, b) = gcd(b, a % b) qoidasi asosida EKUB tez topiladi."
      }
    ]
  },
  {
    id: "week-exam-4",
    week: 4,
    monthNumber: 2,
    title: "4-Haftalik Nazorat Ishi: Tuzilmalar, Daraxtlar, Graflar va DP",
    subtitle: "7–16-darslar bo‘yicha (Stack/Queue, BST/Heap, BFS/DFS, Dijkstra, MST, DP, Greedy)",
    passScore: PASS_SCORE,
    maxScore: MAX_SCORE,
    questions: [
      {
        q: "BFS (Kenglik bo‘yicha qidiruv) asosan qaysi ma’lumot tuzilmasiga tayanadi?",
        options: ["Queue (FIFO navbat)", "Stack (LIFO)", "Faqat massivni teskarisiga"],
        correctIndex: 0,
        explain: "BFS yaqin tugunlarni avval tekshirish uchun Queue navbatidan foydalanadi."
      },
      {
        q: "Dijkstra algoritmi qaysi turdagi masalani yechadi?",
        options: [
          "Manfiy bo‘lmagan vaznli grafda eng qisqa yo‘lni topishni",
          "Matnni shifrlashni",
          "Massivni saralashni"
        ],
        correctIndex: 0,
        explain: "Dijkstra manfiy qirralar bo‘lmagan holatda eng qisqa masofani ishonchli topadi."
      },
      {
        q: "Dinamik dasturlash (DP) qaysi muammolarda eng foydali?",
        options: [
          "Takrorlanuvchi kichik masalalar (overlapping subproblems) va optimal substruktura bo‘lganda",
          "Hech qanday takrorlanish bo‘lmaganda",
          "Faqat 1 ta elementli massivda"
        ],
        correctIndex: 0,
        explain: "DP oldin hisoblangan natijalarni saqlab, qayta hisoblash vaqtini keskin kamaytiradi."
      },
      {
        q: "Greedy (Ochko‘z) algoritm qanday qaror qabul qiladi?",
        options: [
          "Har qadamda joriy sharoitda eng foydali ko‘ringan lokal tanlovni qiladi",
          "Barcha variantlarni oxirigacha ko‘rib chiqadi",
          "Faqat tasodifiy tanlaydi"
        ],
        correctIndex: 0,
        explain: "Greedy har qadamda eng yaxshi lokal qadamni tanlaydi."
      },
      {
        q: "2 oylik dastur davomida o‘zlashtirishni to‘g‘ri baholash mezoni qaysi?",
        options: [
          "Tushuntirish + 90 daqiqalik o‘yin/amaliyot + 10 talik test va haftalik nazoratda 80+ ball",
          "Faqat bitta mavzuni ko‘rish",
          "Nazorat ishini topshirmaslik"
        ],
        correctIndex: 0,
        explain: "Muntazam amaliyot va nazorat ishlari real natijani ko‘rsatadi."
      }
    ]
  }
];