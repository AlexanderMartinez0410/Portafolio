import React, { useState, useEffect, useCallback, useRef } from 'react';

const TR = 20, TC = 10;
interface TPiece { shape: number[][]; color: string; x: number; y: number; }
const TPIECES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' },
  { shape: [[1,1],[1,1]], color: '#f0f000' },
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
  { shape: [[0,1,1],[1,1,0]], color: '#00f000' },
  { shape: [[1,1,0],[0,1,1]], color: '#f00000' },
  { shape: [[1,0,0],[1,1,1]], color: '#0000f0' },
  { shape: [[0,0,1],[1,1,1]], color: '#f0a000' },
];
type TBoard = (string | null)[][];

function rndPiece(): TPiece {
  const p = TPIECES[Math.floor(Math.random() * TPIECES.length)];
  return { ...p, x: Math.floor(TC / 2) - Math.floor(p.shape[0].length / 2), y: 0 };
}

function tCanPlace(b: TBoard, shape: number[][], x: number, y: number) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = y + r, nc = x + c;
      if (nr >= TR || nc < 0 || nc >= TC || (nr >= 0 && b[nr][nc])) return false;
    }
  }
  return true;
}

function tPlace(b: TBoard, shape: number[][], x: number, y: number, color: string): TBoard {
  const nb = b.map(r => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && y + r >= 0) nb[y + r][x + c] = color;
    }
  }
  return nb;
}

function tClear(b: TBoard): { board: TBoard; lines: number } {
  const nb = b.filter(row => row.some(c => !c));
  const lines = TR - nb.length;
  return { board: [...Array.from({ length: lines }, () => Array(TC).fill(null)), ...nb], lines };
}

function tRotate(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

export const TetrisGame: React.FC<{ onGameOver: (s: number) => void; onScoreChange: (s: number) => void }> = ({ onGameOver, onScoreChange }) => {
  const [board, setBoard] = useState<TBoard>(() => Array.from({ length: TR }, () => Array(TC).fill(null)));
  const [cur, setCur] = useState<TPiece>(rndPiece);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const bRef = useRef<TBoard>(Array.from({ length: TR }, () => Array(TC).fill(null)));
  const cRef = useRef<TPiece>(cur);
  const sRef = useRef(0);
  const lRef = useRef(1);
  const rRef = useRef(false);

  const die = useCallback(() => {
    setRunning(false);
    rRef.current = false;
    setDead(true);
    onGameOver(sRef.current);
  }, [onGameOver]);

  const drop = useCallback(() => {
    const c = cRef.current;
    if (tCanPlace(bRef.current, c.shape, c.x, c.y + 1)) {
      const next = { ...c, y: c.y + 1 };
      cRef.current = next;
      setCur(next);
    } else {
      const nb = tPlace(bRef.current, c.shape, c.x, c.y, c.color);
      const { board: cl, lines } = tClear(nb);
      bRef.current = cl;
      setBoard([...cl]);
      const pts = [0, 100, 300, 500, 800][lines] ?? 0;
      const ns = sRef.current + pts * lRef.current;
      sRef.current = ns;
      setScore(ns);
      onScoreChange(ns);
      const nl = Math.floor(ns / 1000) + 1;
      lRef.current = nl;
      setLevel(nl);
      const next = rndPiece();
      if (!tCanPlace(cl, next.shape, next.x, next.y)) { die(); return; }
      cRef.current = next;
      setCur(next);
    }
  }, [die, onScoreChange]);

  useEffect(() => {
    if (!running) return;
    const spd = Math.max(100, 600 - (lRef.current - 1) * 60);
    const id = setInterval(drop, spd);
    return () => clearInterval(id);
  }, [running, drop, level]);

  // Shared action fns so mobile buttons can call them
  const moveLeft = useCallback(() => {
    const c = cRef.current;
    if (tCanPlace(bRef.current, c.shape, c.x - 1, c.y)) {
      const n = { ...c, x: c.x - 1 };
      cRef.current = n;
      setCur(n);
    }
  }, []);

  const moveRight = useCallback(() => {
    const c = cRef.current;
    if (tCanPlace(bRef.current, c.shape, c.x + 1, c.y)) {
      const n = { ...c, x: c.x + 1 };
      cRef.current = n;
      setCur(n);
    }
  }, []);

  const rotate = useCallback(() => {
    const c = cRef.current;
    const rs = tRotate(c.shape);
    if (tCanPlace(bRef.current, rs, c.x, c.y)) {
      const n = { ...c, shape: rs };
      cRef.current = n;
      setCur(n);
    }
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!rRef.current) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveLeft(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); moveRight(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); drop(); }
      else if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); rotate(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [drop, moveLeft, moveRight, rotate]);

  const reset = () => {
    const b = Array.from({ length: TR }, () => Array(TC).fill(null)) as TBoard;
    const p = rndPiece();
    bRef.current = b;
    cRef.current = p;
    sRef.current = 0;
    lRef.current = 1;
    setBoard(b);
    setCur(p);
    setScore(0);
    setLevel(1);
    setDead(false);
    setRunning(true);
    rRef.current = true;
    onScoreChange(0);
  };

  const display: TBoard = board.map(row => [...row]);
  if (!dead) {
    for (let r = 0; r < cur.shape.length; r++) {
      for (let c = 0; c < cur.shape[r].length; c++) {
        if (cur.shape[r][c] && cur.y + r >= 0 && cur.y + r < TR && cur.x + c >= 0 && cur.x + c < TC) {
          display[cur.y + r][cur.x + c] = cur.color;
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {/* Top stats row */}
      <div className="flex justify-between w-full px-1">
        <span className="font-mono text-purple-400 text-xs">PTS: {score}</span>
        <span className="font-mono text-gray-600 text-xs">NIVEL: {level}</span>
        {!running && !dead && <button onClick={reset} className="font-mono text-purple-400 text-xs border border-purple-800 px-2 py-0.5 rounded">INICIAR</button>}
        {running && <button onClick={() => { setRunning(r => { rRef.current = !r; return !r; }); }} className="font-mono text-gray-400 text-xs border border-gray-700 px-2 py-0.5 rounded">PAUSA</button>}
        {dead && <button onClick={reset} className="font-mono text-purple-400 text-xs border border-purple-800 px-2 py-0.5 rounded">REINICIAR</button>}
      </div>

      {/* Board */}
      <div className="border-2 border-purple-800 bg-black" style={{ display: 'grid', gridTemplateColumns: `repeat(${TC}, 22px)`, gap: 1, padding: 4 }}>
        {display.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className="w-5 h-5 rounded-sm" style={{ backgroundColor: cell ?? '#111', boxShadow: cell ? 'inset 0 0 4px rgba(255,255,255,0.2)' : undefined }} />
        )))}
      </div>

      {/* Mobile touch controls */}
      <div className="flex gap-2 w-full justify-center mt-1">
        <button
          onTouchStart={e => { e.preventDefault(); moveLeft(); }} onClick={moveLeft}
          className="flex-1 max-w-[72px] py-3 bg-purple-950 border border-purple-800 text-purple-300 text-xl rounded-lg active:bg-purple-800 flex items-center justify-center transition-colors"
        >
          &#9668;
        </button>
        <button
          onTouchStart={e => { e.preventDefault(); drop(); }} onClick={drop}
          className="flex-1 max-w-[72px] py-3 bg-purple-950 border border-purple-800 text-purple-300 text-xl rounded-lg active:bg-purple-800 flex items-center justify-center transition-colors"
        >
          &#9660;
        </button>
        <button
          onTouchStart={e => { e.preventDefault(); rotate(); }} onClick={rotate}
          className="flex-1 max-w-[72px] py-3 bg-indigo-950 border border-indigo-700 text-indigo-300 text-sm font-mono rounded-lg active:bg-indigo-800 flex items-center justify-center transition-colors"
        >
          ROT
        </button>
        <button
          onTouchStart={e => { e.preventDefault(); moveRight(); }} onClick={moveRight}
          className="flex-1 max-w-[72px] py-3 bg-purple-950 border border-purple-800 text-purple-300 text-xl rounded-lg active:bg-purple-800 flex items-center justify-center transition-colors"
        >
          &#9658;
        </button>
      </div>
      <p className="font-mono text-gray-700 text-xs">← BAJAR ROT →</p>
    </div>
  );
};
