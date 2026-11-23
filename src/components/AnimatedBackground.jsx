import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NODES = [
  { id: 'n1', cx: 160, cy: 170, dx: [0, 18, -12, 0], dy: [0, -14, 16, 0], dur: 8 },
  { id: 'n2', cx: 340, cy: 120, dx: [0, -16, 14, 0], dy: [0, 12, -10, 0], dur: 9.5 },
  { id: 'n3', cx: 560, cy: 150, dx: [0, 20, -15, 0], dy: [0, 15, -12, 0], dur: 7.8 },
  { id: 'n4', cx: 740, cy: 210, dx: [0, -14, 18, 0], dy: [0, -16, 12, 0], dur: 10.2 },
  { id: 'n5', cx: 220, cy: 360, dx: [0, 15, -18, 0], dy: [0, 18, -14, 0], dur: 8.6 },
  { id: 'n6', cx: 680, cy: 380, dx: [0, -19, 12, 0], dy: [0, -12, 17, 0], dur: 9.1 },
  { id: 'n7', cx: 180, cy: 560, dx: [0, 14, -10, 0], dy: [0, -18, 12, 0], dur: 11 },
  { id: 'n8', cx: 450, cy: 610, dx: [0, -22, 20, 0], dy: [0, 10, -15, 0], dur: 8.2 },
  { id: 'n9', cx: 720, cy: 570, dx: [0, 16, -14, 0], dy: [0, -14, 16, 0], dur: 9.8 }
];

const EDGES = [
  ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4'],
  ['n1', 'n5'], ['n2', 'n5'], ['n3', 'n6'],
  ['n4', 'n6'], ['n5', 'n7'], ['n5', 'n8'],
  ['n6', 'n8'], ['n6', 'n9'], ['n7', 'n8'], ['n8', 'n9']
];

export default function AnimatedBackground({ theme = 'dark' }) {
  const isLight = theme === 'light';

  const [pointer, setPointer] = useState({ x: -500, y: -500, active: false });
  const [trailNodes, setTrailNodes] = useState([]);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const registerPoint = (x, y) => {
      setPointer({ x, y, active: true });

      const now = Date.now();
      if (now - lastSpawnRef.current > 65) {
        lastSpawnRef.current = now;
        const id = `t-${now}-${Math.random().toString(36).slice(2, 6)}`;
        setTrailNodes((prev) => [...prev.slice(-9), { id, x, y }]);
      }
    };

    const handleMouseMove = (e) => {
      registerPoint(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        registerPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        registerPoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleLeave = () => {
      setPointer((prev) => ({ ...prev, active: false }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    if (trailNodes.length === 0) return;
    const timer = setInterval(() => {
      setTrailNodes((prev) => prev.slice(1));
    }, 320);
    return () => clearInterval(timer);
  }, [trailNodes.length]);

  const cyanStroke = isLight ? 'rgba(2, 132, 199, 0.30)' : 'rgba(34, 211, 238, 0.24)';
  const indigoStroke = isLight ? 'rgba(79, 70, 229, 0.26)' : 'rgba(129, 140, 248, 0.21)';
  const brightAccent = isLight ? 'rgba(14, 116, 144, 0.55)' : 'rgba(103, 232, 249, 0.5)';
  const edgeColor = isLight ? 'rgba(2, 132, 199, 0.14)' : 'rgba(56, 189, 248, 0.13)';
  const nodeFill = isLight ? 'rgba(79, 70, 229, 0.45)' : 'rgba(34, 211, 238, 0.55)';
  const gridLineColor = isLight ? 'rgba(15, 23, 42, 0.045)' : 'rgba(34, 211, 238, 0.055)';
  const pointerLineColor = isLight ? 'rgba(2, 132, 199, 0.42)' : 'rgba(34, 211, 238, 0.45)';
  const pointerNodeFill = isLight ? '#4f46e5' : '#22d3ee';

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-[#f4f7fc] via-[#edf2fa] to-[#e4ecf8]'
            : 'bg-[#04060c]'
        }`}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridLineColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: '44px 44px'
        }}
      />

      <svg
        viewBox="0 0 900 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {EDGES.map(([fromId, toId], idx) => {
          const a = nodeMap[fromId];
          const b = nodeMap[toId];
          return (
            <motion.line
              key={`${fromId}-${toId}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke={edgeColor}
              strokeWidth="1.1"
              strokeDasharray="4 6"
              animate={{
                strokeDashoffset: [0, -20],
                opacity: [0.35, 0.85, 0.35]
              }}
              transition={{
                duration: 4 + (idx % 3),
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          );
        })}

        {NODES.map((node) => (
          <motion.g
            key={node.id}
            animate={{
              x: node.dx,
              y: node.dy
            }}
            transition={{
              duration: node.dur,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="11"
              fill="none"
              stroke={cyanStroke}
              strokeWidth="0.9"
              animate={{ scale: [0.85, 1.35, 0.85], opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx={node.cx} cy={node.cy} r="3.5" fill={nodeFill} />
          </motion.g>
        ))}
      </svg>

      <svg className="absolute inset-0 w-full h-full">
        {trailNodes.map((node, idx) => {
          const next = trailNodes[idx + 1];
          return (
            <g key={node.id}>
              {next && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={pointerLineColor}
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  opacity={(idx + 1) / (trailNodes.length + 1)}
                />
              )}
              {pointer.active && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={pointer.x}
                  y2={pointer.y}
                  stroke={pointerLineColor}
                  strokeWidth="0.8"
                  opacity={((idx + 1) / (trailNodes.length + 1)) * 0.45}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={2.5 + (idx % 2)}
                fill={pointerNodeFill}
                opacity={(idx + 1) / (trailNodes.length + 1)}
              />
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {pointer.active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: pointer.x - 22,
              y: pointer.y - 22
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.4 }}
            className="fixed top-0 left-0 w-11 h-11 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
              className={`w-11 h-11 rounded-full border border-dashed ${
                isLight ? 'border-cyan-700/45' : 'border-cyan-400/50'
              }`}
            />
            <span
              className={`absolute w-1.5 h-1.5 rounded-full ${
                isLight ? 'bg-indigo-600' : 'bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[520px] h-[520px] sm:w-[920px] sm:h-[920px]">
          <motion.svg
            viewBox="0 0 900 900"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="450"
              cy="450"
              r="410"
              fill="none"
              stroke={cyanStroke}
              strokeWidth="1.2"
              strokeDasharray="24 12 4 12"
            />
            <polygon points="450,24 444,38 456,38" fill={brightAccent} />
            <polygon points="450,876 444,862 456,862" fill={brightAccent} />
          </motion.svg>

          <motion.svg
            viewBox="0 0 900 900"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
          >
            <path
              d="M 450 130 A 320 320 0 0 1 726 290"
              fill="none"
              stroke={brightAccent}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 730 580 A 320 320 0 0 1 480 768"
              fill="none"
              stroke={indigoStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 185 595 A 320 320 0 0 1 245 225"
              fill="none"
              stroke={cyanStroke}
              strokeWidth="1.8"
              strokeDasharray="14 8"
            />
          </motion.svg>

          <motion.svg
            viewBox="0 0 900 900"
            className="absolute inset-0 w-full h-full"
            animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle
              cx="450"
              cy="450"
              r="225"
              fill="none"
              stroke={indigoStroke}
              strokeWidth="1.2"
              strokeDasharray="6 10"
            />
            <circle
              cx="450"
              cy="450"
              r="145"
              fill="none"
              stroke={cyanStroke}
              strokeWidth="1"
            />
          </motion.svg>

          <motion.svg
            viewBox="0 0 900 900"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: [-32, 36, -32] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M 450 450 L 450 90 A 360 360 0 0 1 685 180 Z"
              fill={isLight ? 'rgba(14, 165, 233, 0.05)' : 'rgba(34, 211, 238, 0.045)'}
            />
            <line
              x1="450"
              y1="450"
              x2="450"
              y2="90"
              stroke={brightAccent}
              strokeWidth="1.1"
              strokeDasharray="5 6"
            />
          </motion.svg>
        </div>
      </div>

      <div className="hidden sm:flex items-end justify-center gap-1.5 h-12 fixed bottom-3 left-1/2 -translate-x-1/2 opacity-55">
        {[18, 34, 24, 44, 28, 38, 20, 42, 26, 32, 22, 36].map((h, i) => (
          <motion.span
            key={i}
            animate={{
              height: [`${Math.max(8, h - 12)}px`, `${h}px`, `${Math.max(10, h - 8)}px`]
            }}
            transition={{
              duration: 1.4 + (i % 4) * 0.25,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`w-1 rounded-full ${
              isLight ? 'bg-indigo-600/35' : 'bg-cyan-400/35'
            }`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: ['-5%', '105%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        className={`absolute inset-x-0 h-[1.5px] ${
          isLight
            ? 'bg-gradient-to-r from-transparent via-cyan-600/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent'
        }`}
      />

      <motion.div
        animate={{ x: ['8%', '90%', '8%'] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex items-center gap-1.5 absolute top-24 left-0"
      >
        <span
          className={`w-2 h-2 rotate-45 border ${
            isLight ? 'border-cyan-700/45 bg-cyan-500/20' : 'border-cyan-400/50 bg-cyan-400/20'
          }`}
        />
        <span
          className={`text-[10px] font-mono tracking-widest ${
            isLight ? 'text-slate-600/80' : 'text-cyan-300/45'
          }`}
        >
          ALGO.NET // ACTIVE
        </span>
      </motion.div>

      <div
        className={`hidden sm:block absolute top-24 left-6 w-6 h-6 border-t-2 border-l-2 rounded-tl-md ${
          isLight ? 'border-cyan-700/25' : 'border-cyan-400/25'
        }`}
      />
      <div
        className={`hidden sm:block absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 rounded-br-md ${
          isLight ? 'border-indigo-700/25' : 'border-indigo-400/25'
        }`}
      />
    </div>
  );
}