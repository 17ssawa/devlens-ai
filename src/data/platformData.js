// src/data/platformData.js
export const PASS_SCORE = 80;
export const MAX_SCORE = 111;

export const ALGORITHMS_32 = [
  // 1. Massiv va Saralash (8)
  { id: "bubble-sort", name: "Bubble Sort", category: "Saralash", level: 1, bigO: "O(n²)", desc: "Yonma-yon elementlarni solishtirib almashtirish." },
  { id: "selection-sort", name: "Selection Sort", category: "Saralash", level: 1, bigO: "O(n²)", desc: "Eng kichik elementni tanlab boshiga qo‘yish." },
  { id: "insertion-sort", name: "Insertion Sort", category: "Saralash", level: 1, bigO: "O(n²)", desc: "Har elementni saralangan qismga o‘z joyiga qo‘yish." },
  { id: "merge-sort", name: "Merge Sort", category: "Saralash", level: 2, bigO: "O(n log n)", desc: "Bo‘lib tashla va zabt et usulida birlashtirib saralash." },
  { id: "quick-sort", name: "Quick Sort", category: "Saralash", level: 2, bigO: "O(n log n)", desc: "Tayanch (pivot) element atrofida bo‘lib saralash." },
  { id: "heap-sort", name: "Heap Sort", category: "Saralash", level: 3, bigO: "O(n log n)", desc: "Max-Heap daraxt tuzilmasi yordamida saralash." },
  { id: "counting-sort", name: "Counting Sort", category: "Saralash", level: 2, bigO: "O(n + k)", desc: "Qiymatlarni sanash orqali chiziqli vaqtda saralash." },
  { id: "radix-sort", name: "Radix Sort", category: "Saralash", level: 3, bigO: "O(d(n + k))", desc: "Razryadlar (birlik, o‘nlik, yuzlik) bo‘yicha saralash." },

  // 2. Qidiruv va Oyna/Ko'rsatkichlar (6)
  { id: "linear-search", name: "Linear Search", category: "Qidiruv", level: 1, bigO: "O(n)", desc: "Elementni boshidan oxirigacha ketma-ket izlash." },
  { id: "binary-search", name: "Binary Search", category: "Qidiruv", level: 1, bigO: "O(log n)", desc: "Saralangan massivni ikkiga bo‘lib tez qidirish." },
  { id: "jump-search", name: "Jump Search", category: "Qidiruv", level: 2, bigO: "O(√n)", desc: "Oldinga sakrab, keyin orqaga chiziqli tekshirish." },
  { id: "interpolation-search", name: "Interpolation Search", category: "Qidiruv", level: 3, bigO: "O(log log n)", desc: "Qiymat taqsimotiga qarab taxminiy indeks topish." },
  { id: "two-pointers", name: "Two Pointers", category: "Ko'rsatkichlar", level: 2, bigO: "O(n)", desc: "Ikki ko‘rsatkich yordamida juftlik yoki shartni topish." },
  { id: "sliding-window", name: "Sliding Window", category: "Ko'rsatkichlar", level: 2, bigO: "O(n)", desc: "Harakatlanuvchi oyna bilan sub-massiv tahlili." },

  // 3. Ma'lumotlar tuzilmalari (6)
  { id: "stack-lifo", name: "Stack (LIFO)", category: "Tuzilmalar", level: 1, bigO: "O(1)", desc: "Oxirgi kirgan birinchi chiqadi (Push / Pop)." },
  { id: "queue-fifo", name: "Queue (FIFO)", category: "Tuzilmalar", level: 1, bigO: "O(1)", desc: "Birinchi kirgan birinchi chiqadi (Enqueue / Dequeue)." },
  { id: "linked-list", name: "Linked List", category: "Tuzilmalar", level: 2, bigO: "O(n)", desc: "Ko‘rsatkichlar bilan bog‘langan tugunlar zanjiri." },
  { id: "bst-search", name: "Binary Search Tree", category: "Tuzilmalar", level: 2, bigO: "O(log n)", desc: "Chap kichik, o‘ng katta bo‘lgan daraxt tuzilmasi." },
  { id: "min-heap", name: "Min / Max Heap", category: "Tuzilmalar", level: 3, bigO: "O(log n)", desc: "Ustuvor navbat uchun ikkilik uyurmali daraxt." },
  { id: "hash-table", name: "Hash Table", category: "Tuzilmalar", level: 2, bigO: "O(1)", desc: "Kalit-qiymat juftligini xesh funksiya bilan saqlash." },

  // 4. Graflar va Yo'l topish (6)
  { id: "bfs-graph", name: "BFS (Kenglik bo‘yicha)", category: "Graflar", level: 2, bigO: "O(V + E)", desc: "Qatlamma-qatlam eng yaqin qo‘shnilarni aylanish." },
  { id: "dfs-graph", name: "DFS (Chuqurlik bo‘yicha)", category: "Graflar", level: 2, bigO: "O(V + E)", desc: "Bir yo‘nalishda oxirigacha kirib, keyin qaytish." },
  { id: "dijkstra", name: "Dijkstra Shortest Path", category: "Graflar", level: 3, bigO: "O((V + E) log V)", desc: "Musbat vaznli grafda eng qisqa yo‘lni topish." },
  { id: "a-star", name: "A* Pathfinding", category: "Graflar", level: 3, bigO: "O(E)", desc: "Evristika yordamida maqsadga tez yo‘l chizish." },
  { id: "kruskal-mst", name: "Kruskal MST", category: "Graflar", level: 3, bigO: "O(E log E)", desc: "Minimal qamrovchi daraxt (siklsiz eng arzon bog‘lanish)." },
  { id: "topological-sort", name: "Topological Sort", category: "Graflar", level: 3, bigO: "O(V + E)", desc: "Bog‘liqlik tartibiga ko‘ra vazifalarni joylashtirish." },

  // 5. Matematika, Geometriya va Rekursiya (6)
  { id: "recursion-fib", name: "Rekursiv Daraxt / Fib", category: "Matematika & Geo", level: 1, bigO: "O(2ⁿ)", desc: "Funksiya o‘zini chaqirishi va chaqiruv daraxti." },
  { id: "euclidean-gcd", name: "Evklid Algoritmi (EKUB)", category: "Matematika & Geo", level: 1, bigO: "O(log min(a,b))", desc: "Qoldiq bo‘lish orqali eng katta umumiy bo‘luvchi." },
  { id: "sieve-eratosthenes", name: "Eratosfen G‘alviri", category: "Matematika & Geo", level: 2, bigO: "O(n log log n)", desc: "Tub sonlarni karrali sonlarni elash orqali topish." },
  { id: "convex-hull", name: "Convex Hull (Qavariq qobiq)", category: "Matematika & Geo", level: 3, bigO: "O(n log n)", desc: "Nuqtalar to‘plamini o‘rab turuvchi tashqi ko‘pburchak." },
  { id: "golden-spiral", name: "Oltin Burchak Spiral", category: "Matematika & Geo", level: 2, bigO: "O(n)", desc: "137.5° burchak va trigonometriya bilan tabiiy spiral." },
  { id: "harmonic-wave", name: "Sinus-Kosinus Vektor", category: "Matematika & Geo", level: 2, bigO: "O(n)", desc: "Aylana, burchak va to‘lqin geometriyasi animatsiyasi." },
];

export const BUG_HUNT_CHALLENGES = [
  {
    id: "bug-1",
    title: "Binary Search — Cheksiz sikl xatosi",
    level: 1,
    isWeeklyExam: false,
    points: 111,
    animationSteps: [
      "low = 0, high = 5, target = 10",
      "mid = (0 + 5) // 2 = 2 -> arr[2] = 7 (< 10)",
      "XATO QADAM: low = mid (2) qoldi -> mid yana 2 chiqadi!"
    ],
    codeSnippet: `while low <= high:
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        low = mid      # <-- Xato shu yerda!
    else:
        high = mid - 1`,
    options: [
      "low = mid o‘rniga low = mid + 1 bo‘lishi kerak",
      "mid hisoblashda qo‘shish emas, ayirish ishlatiladi",
      "while sharti low < high bo‘lishi kerak"
    ],
    correctIndex: 0,
    explanation: "arr[mid] < target bo‘lganda mid element tekshirildi va kichik; low = mid + 1 qilinmasa cheksiz aylanish yuz beradi."
  },
  {
    id: "bug-2",
    title: "Haftalik Nazorat — BFS Navbat (Queue) xatosi",
    level: 2,
    isWeeklyExam: true,
    points: 111,
    animationSteps: [
      "Start = A -> queue = [A], visited = {A}",
      "A dan qo‘shnilar B va C olindi",
      "XATO QADAM: queue.pop() oxiridan oldi (DFS kabi bo‘lib qoldi)"
    ],
    codeSnippet: `while queue:
    node = queue.pop()     # <-- BFS uchun xato!
    for nxt in graph[node]:
        if nxt not in visited:
            visited.add(nxt)
            queue.append(nxt)`,
    options: [
      "queue.pop() o‘rniga queue.popleft() (FIFO) ishlatilishi kerak",
      "visited.add(nxt) sikldan tashqarida bo‘lishi kerak",
      "graph[node] o‘rniga graph[nxt] yozilishi kerak"
    ],
    correctIndex: 0,
    explanation: "BFS kenglik bo‘yicha yurishi uchun navbatning boshidan (FIFO: popleft / pop(0)) olinadi."
  }
];

export const PYTHON_MATH_TEMPLATES = {
  spiral: {
    name: "Oltin Spiral (137.5°)",
    angleDeg: 137.5,
    radiusStep: 4.2,
    pointsCount: 140,
    code: `# Geometrik Spiral & Matematika (Python)\nimport math\n\npoints = 140\nangle_deg = 137.5\nfor i in range(points):\n    r = 4.2 * math.sqrt(i)\n    theta = math.radians(i * angle_deg)\n    x = r * math.cos(theta)\n    y = r * math.sin(theta)\n    if i % 35 == 0:\n        print(f"Nuqta #{i}: r={r:.1f}, x={x:.1f}, y={y:.1f}")`
  },
  starPolygon: {
    name: "Geometrik Yulduz / Burchak",
    angleDeg: 144,
    radiusStep: 1.5,
    pointsCount: 90,
    code: `# Burchak va Kosinus/Sinus Koordinatalari\nimport math\n\nsteps = 90\nstep_angle = 144.0\nfor k in range(steps):\n    rad = math.radians(k * step_angle)\n    px = math.cos(rad) * 110\n    py = math.sin(rad) * 110\n    if k in (0, 1, 2, 5):\n        print(f"Qadam {k}: burchak={(k*step_angle)%360:.0f}°, ({px:.1f}, {py:.1f})")`
  }
};

export function evaluateStageScore(score) {
  const safeScore = Math.max(0, Math.min(MAX_SCORE, Number(score) || 0));
  return {
    score: safeScore,
    maxScore: MAX_SCORE,
    passScore: PASS_SCORE,
    passed: safeScore >= PASS_SCORE,
    statusLabel: safeScore >= PASS_SCORE ? "O‘tdi (Keyingi bosqich ochiq)" : "O‘tmadi (80+ ball kerak)"
  };
}

export function getUnlockedLevels(stageScoresMap = {}) {
  // 1-bosqich har doim ochiq; keyingi bosqich oldingi bosqich >= 80 ball bo'lsa ochiladi
  const unlocked = [1];
  let current = 1;
  while (current < 12) {
    const prevScore = stageScoresMap[current] ?? 0;
    if (prevScore >= PASS_SCORE) {
      current += 1;
      unlocked.push(current);
    } else {
      break;
    }
  }
  return unlocked;
}