import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Share2, Route, Compass } from 'lucide-react';

const GRAPH_NODES = [
  { id: 'A', label: 'A', x: 110, y: 150 },
  { id: 'B', label: 'B', x: 240, y: 70 },
  { id: 'C', label: 'C', x: 240, y: 230 },
  { id: 'D', label: 'D', x: 390, y: 80 },
  { id: 'E', label: 'E', x: 390, y: 220 },
  { id: 'F', label: 'F', x: 530, y: 150 }
];

const GRAPH_EDGES = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'E', weight: 8 },
  { from: 'C', to: 'D', weight: 6 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'D', to: 'F', weight: 3 },
  { from: 'E', to: 'F', weight: 1 }
];

function buildAdjacency() {
  const adj = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, []]));
  GRAPH_EDGES.forEach((e) => {
    adj[e.from].push({ to: e.to, weight: e.weight });
    adj[e.to].push({ to: e.from, weight: e.weight });
  });
  return adj;
}

function generateGraphSteps(algo, startId = 'A', targetId = 'F') {
  const adj = buildAdjacency();
  const steps = [];

  if (algo === 'bfs') {
    const visited = new Set([startId]);
    const queue = [startId];
    steps.push({
      current: startId,
      visited: Array.from(visited),
      frontier: [...queue],
      path: [],
      distances: {},
      explanation: `BFS boshlandi: Navbatga '${startId}' tuguni qo'shildi.`
    });

    while (queue.length > 0) {
      const curr = queue.shift();
      steps.push({
        current: curr,
        visited: Array.from(visited),
        frontier: [...queue],
        path: [],
        distances: {},
        explanation: `'${curr}' tuguni navbatdan olindi va qo'shni tugunlar tekshirilmoqda.`
      });

      for (const edge of adj[curr]) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
          steps.push({
            current: edge.to,
            visited: Array.from(visited),
            frontier: [...queue],
            path: edge.to === targetId ? [startId, curr, edge.to] : [],
            distances: {},
            explanation: `Yangi tugun '${edge.to}' topildi va navbat oxiriga qo'shildi.`
          });
          if (edge.to === targetId) {
            return steps;
          }
        }
      }
    }
    return steps;
  }

  if (algo === 'dfs') {
    const visited = new Set();
    const stack = [startId];

    steps.push({
      current: startId,
      visited: [],
      frontier: [...stack],
      path: [],
      distances: {},
      explanation: `DFS boshlandi: Stekka '${startId}' tuguni joylandi.`
    });

    while (stack.length > 0) {
      const curr = stack.pop();
      if (visited.has(curr)) continue;
      visited.add(curr);

      steps.push({
        current: curr,
        visited: Array.from(visited),
        frontier: [...stack],
        path: curr === targetId ? Array.from(visited) : [],
        distances: {},
        explanation: `Chuqurlik bo'yicha '${curr}' tuguniga kirildi.`
      });

      if (curr === targetId) break;

      const neighbors = [...adj[curr]].reverse();
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          stack.push(edge.to);
        }
      }
    }
    return steps;
  }

  // Dijkstra eng qisqa yo'l
  const dist = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, Infinity]));
  const prev = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, null]));
  dist[startId] = 0;
  const unvisited = new Set(GRAPH_NODES.map((n) => n.id));

  steps.push({
    current: startId,
    visited: [],
    frontier: [startId],
    path: [],
    distances: { ...dist },
    explanation: `Dijkstra boshlandi: '${startId}' masofasi 0, qolganlari ∞.`
  });

  while (unvisited.size > 0) {
    let curr = null;
    let bestVal = Infinity;
    for (const nodeId of unvisited) {
      if (dist[nodeId] < bestVal) {
        bestVal = dist[nodeId];
        curr = nodeId;
      }
    }

    if (!curr || bestVal === Infinity) break;
    unvisited.delete(curr);

    steps.push({
      current: curr,
      visited: GRAPH_NODES.map((n) => n.id).filter((id) => !unvisited.has(id)),
      frontier: Array.from(unvisited),
      path: [],
      distances: { ...dist },
      explanation: `Eng yaqin tugun '${curr}' tanlandi (masofa: ${dist[curr]}).`
    });

    if (curr === targetId) break;

    for (const edge of adj[curr]) {
      if (!unvisited.has(edge.to)) continue;
      const alt = dist[curr] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = curr;
        steps.push({
          current: edge.to,
          visited: GRAPH_NODES.map((n) => n.id).filter((id) => !unvisited.has(id)),
          frontier: Array.from(unvisited),
          path: [],
          distances: { ...dist },
          explanation: `'${edge.to}' tuguniga qisqaroq yo'l topildi: ${alt} (orqali '${curr}').`
        });
      }
    }
  }

  const shortestPath = [];
  let trace = targetId;
  while (trace) {
    shortestPath.unshift(trace);
    trace = prev[trace];
  }

  steps.push({
    current: targetId,
    visited: GRAPH_NODES.map((n) => n.id).filter((id) => !unvisited.has(id)),
    frontier: [],
    path: shortestPath[0] === startId ? shortestPath : [],
    distances: { ...dist },
    explanation: `'${startId}' dan '${targetId}' gacha eng qisqa masofa: ${dist[targetId]} (${shortestPath.join(' → ')}).`
  });

  return steps;
}

export default function GraphVisualizer({ theme = 'dark' }) {
  const isLight = theme === 'light';
  const [algo, setAlgo] = useState('dijkstra');
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = useMemo(() => generateGraphSteps(algo, 'A', 'F'), [algo]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [algo]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setStepIdx((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 850);
    return () => clearInterval(t);
  }, [isPlaying, steps.length]);

  const active = steps[stepIdx] || steps[0];
  const nodePos = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n]));

  const isEdgeInPath = (from, to) => {
    if (!active.path || active.path.length < 2) return false;
    for (let i = 0; i < active.path.length - 1; i++) {
      const a = active.path[i];
      const b = active.path[i + 1];
      if ((a === from && b === to) || (a === to && b === from)) return true;
    }
    return false;
  };

  return (
    <div
      className={`rounded-3xl border p-4 sm:p-6 space-y-4 transition-colors duration-300 ${
        isLight
          ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#080d1a]/85 border-white/10 text-slate-100 backdrop-blur-xl'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
            {algo === 'dijkstra' ? <Route className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">Graf &amp; Qidiruv Vizualizatori (A → F)</h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Qadam {stepIdx + 1} / {steps.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'dijkstra', label: 'Dijkstra (Eng qisqa)' },
            { id: 'bfs', label: 'BFS (Kenglik)' },
            { id: 'dfs', label: 'DFS (Chuqurlik)' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAlgo(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                algo === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-transparent'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graf SVG maydoni */}
      <div
        className={`w-full rounded-2xl border overflow-hidden p-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#040710] border-white/10'
        }`}
      >
        <svg viewBox="0 0 640 300" className="w-full h-52 sm:h-64">
          {GRAPH_EDGES.map((edge) => {
            const a = nodePos[edge.from];
            const b = nodePos[edge.to];
            const inPath = isEdgeInPath(edge.from, edge.to);
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={
                    inPath
                      ? '#10b981'
                      : isLight
                      ? 'rgba(100, 116, 139, 0.35)'
                      : 'rgba(148, 163, 184, 0.25)'
                  }
                  strokeWidth={inPath ? 3.5 : 1.8}
                />
                <circle
                  cx={midX}
                  cy={midY - 8}
                  r="10"
                  fill={isLight ? '#ffffff' : '#0b1222'}
                  stroke={inPath ? '#10b981' : 'rgba(34, 211, 238, 0.35)'}
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={inPath ? '#10b981' : isLight ? '#0f172a' : '#e2e8f0'}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {GRAPH_NODES.map((node) => {
            const isCurrent = active.current === node.id;
            const isVisited = active.visited?.includes(node.id);
            const isInPath = active.path?.includes(node.id);
            const distVal = active.distances?.[node.id];

            const fill = isInPath
              ? '#10b981'
              : isCurrent
              ? '#06b6d4'
              : isVisited
              ? '#6366f1'
              : isLight
              ? '#ffffff'
              : '#0f172a';

            const stroke = isInPath
              ? '#059669'
              : isCurrent
              ? '#67e8f9'
              : isLight
              ? '#0284c7'
              : '#38bdf8';

            const textFill =
              isInPath || isCurrent || isVisited
                ? '#ffffff'
                : isLight
                ? '#0f172a'
                : '#f8fafc';

            return (
              <motion.g
                key={node.id}
                animate={{ scale: isCurrent ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="21"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={textFill}
                >
                  {node.label}
                </text>
                {distVal !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + 34}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={isLight ? '#0369a1' : '#67e8f9'}
                  >
                    d={distVal === Infinity ? '∞' : distVal}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Boshqaruv va slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? "To'xtatish" : 'Boshlash'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx(0);
            }}
            className={`p-2 rounded-xl border cursor-pointer ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
            }`}
            title="Qayta boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, steps.length - 1)}
          value={stepIdx}
          onChange={(e) => {
            setIsPlaying(false);
            setStepIdx(Number(e.target.value));
          }}
          className="flex-1 accent-cyan-500 cursor-pointer"
        />
      </div>

      {/* Qadam izohi */}
      <div
        className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
          isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-950' : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-100'
        }`}
      >
        <Share2 className="w-4 h-4 text-cyan-500 shrink-0" />
        <span>{active.explanation}</span>
      </div>
    </div>
  );
}