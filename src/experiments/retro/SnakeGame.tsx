import React, { useState, useEffect, useCallback, useRef } from 'react';

const SNAKE_COLS = 20;
const SNAKE_ROWS = 16;
type Dir = 'U' | 'D' | 'L' | 'R';
type Pos = { x: number; y: number };

function rndPos(exclude: Pos[]): Pos {
  let p: Pos;
  do {
    p = { x: Math.floor(Math.random() * SNAKE_COLS), y: Math.floor(Math.random() * SNAKE_ROWS) };
  } while (exclude.some(q => q.x === p.x && q.y === p.y));
  return p;
}

export const SnakeGame: React.FC<{ onGameOver: (s: number) => void; onScoreChange: (s: number) => void }> = ({ onGameOver, onScoreChange }) => {
  // All game state lives in refs — game loop never has stale closures
  const snakeRef = useRef<Pos[]>([{ x: 10, y: 8 }]);
  const foodRef  = useRef<Pos>({ x: 15, y: 8 });
  const scoreRef = useRef(0);
  const dirRef   = useRef<Dir>('R');
  const runningRef = useRef(false);
  const deadRef    = useRef(false);

  // Display state — updated once per tick for rendering
  type DS = { snake: Pos[]; food: Pos; score: number; running: boolean; dead: boolean };
  const [ds, setDs] = useState<DS>({
    snake: [{ x: 10, y: 8 }],
    food:  { x: 15, y: 8 },
    score: 0, running: false, dead: false,
  });

  const startGame = useCallback(() => {
    if (runningRef.current) return; // guard against double-fire
    const s: Pos[] = [{ x: 10, y: 8 }];
    const f: Pos   = { x: 15, y: 8 };
    snakeRef.current   = s;
    foodRef.current    = f;
    scoreRef.current   = 0;
    dirRef.current     = 'R';
    deadRef.current    = false;
    runningRef.current = true;
    setDs({ snake: s, food: f, score: 0, running: true, dead: false });
    onScoreChange(0);
  }, [onScoreChange]);

  // Game tick — only reads/writes refs, calls ONE setDs at the end
  const tick = useCallback(() => {
    if (!runningRef.current) return;
    const prev = snakeRef.current;
    const h = prev[0];
    const d = dirRef.current;
    const nx: Pos = {
      x: (h.x + (d === 'R' ? 1 : d === 'L' ? -1 : 0) + SNAKE_COLS) % SNAKE_COLS,
      y: (h.y + (d === 'D' ? 1 : d === 'U' ? -1 : 0) + SNAKE_ROWS) % SNAKE_ROWS,
    };

    // Self-collision
    if (prev.slice(1).some(p => p.x === nx.x && p.y === nx.y)) {
      runningRef.current = false;
      deadRef.current    = true;
      setDs(s => ({ ...s, running: false, dead: true }));
      onGameOver(scoreRef.current);
      return;
    }

    const ate = nx.x === foodRef.current.x && nx.y === foodRef.current.y;
    const ns  = ate ? [nx, ...prev] : [nx, ...prev.slice(0, -1)];
    snakeRef.current = ns;

    if (ate) {
      const sc = scoreRef.current + 10;
      scoreRef.current = sc;
      const nf = rndPos(ns);
      foodRef.current = nf;
      onScoreChange(sc);
      setDs(s => ({ ...s, snake: ns, food: nf, score: sc }));
    } else {
      setDs(s => ({ ...s, snake: ns }));
    }
  }, [onGameOver, onScoreChange]);

  useEffect(() => {
    if (!ds.running) return;
    const id = setInterval(tick, 130);
    return () => clearInterval(id);
  }, [ds.running, tick]);

  // Unified move fn — reads refs, no stale closures, safe from double-fire
  const move = useCallback((d: Dir) => {
    if (!runningRef.current && !deadRef.current) {
      dirRef.current = d;
      startGame();
      return;
    }
    if (!runningRef.current) return;
    const opp: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
    if (d !== opp[dirRef.current]) dirRef.current = d;
  }, [startGame]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      move(next);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [move]);

  const touchRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      <div className="flex justify-between w-full px-1">
        <span className="font-mono text-green-400 text-xs">PTS: {ds.score}</span>
        <span className="font-mono text-gray-600 text-xs">
          {ds.running ? `LEN: ${ds.snake.length}` : ds.dead ? 'GAME OVER' : 'PRESIONA DIRECCION'}
        </span>
      </div>

      <div
        className="border-2 border-green-900 bg-black cursor-pointer"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${SNAKE_COLS}, 14px)`, gap: '1px', padding: 4 }}
        onTouchStart={e => { const t = e.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY }; }}
        onTouchEnd={e => {
          if (!touchRef.current) return;
          const dx = e.changedTouches[0].clientX - touchRef.current.x;
          const dy = e.changedTouches[0].clientY - touchRef.current.y;
          touchRef.current = null;
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
          if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'R' : 'L');
          else move(dy > 0 ? 'D' : 'U');
        }}
      >
        {Array.from({ length: SNAKE_ROWS }, (_, y) => Array.from({ length: SNAKE_COLS }, (_, x) => {
          const isHead = ds.snake[0].x === x && ds.snake[0].y === y;
          const isBody = ds.snake.slice(1).some(p => p.x === x && p.y === y);
          const isFood = ds.food.x === x && ds.food.y === y;
          let bg = 'bg-black';
          if (isHead) bg = 'bg-green-300';
          else if (isBody) bg = 'bg-green-800';
          else if (isFood) bg = 'bg-red-600';
          return <div key={`${x}-${y}`} className={`w-3 h-3 ${bg}`} />;
        }))}
      </div>

      {/* D-Pad: onTouchStart only on mobile (e.preventDefault stops the click event) */}
      <div className="grid grid-cols-3 gap-1.5 mt-1">
        <div />
        <button onTouchStart={e => { e.preventDefault(); move('U'); }} onClick={() => move('U')}
          className="w-12 h-12 bg-green-950 border border-green-800 text-green-400 text-lg rounded-lg active:bg-green-800 flex items-center justify-center font-bold">
          &#9650;
        </button>
        <div />
        <button onTouchStart={e => { e.preventDefault(); move('L'); }} onClick={() => move('L')}
          className="w-12 h-12 bg-green-950 border border-green-800 text-green-400 text-lg rounded-lg active:bg-green-800 flex items-center justify-center font-bold">
          &#9668;
        </button>
        <div className="w-12 h-12 bg-green-950/30 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-green-900" />
        </div>
        <button onTouchStart={e => { e.preventDefault(); move('R'); }} onClick={() => move('R')}
          className="w-12 h-12 bg-green-950 border border-green-800 text-green-400 text-lg rounded-lg active:bg-green-800 flex items-center justify-center font-bold">
          &#9658;
        </button>
        <div />
        <button onTouchStart={e => { e.preventDefault(); move('D'); }} onClick={() => move('D')}
          className="w-12 h-12 bg-green-950 border border-green-800 text-green-400 text-lg rounded-lg active:bg-green-800 flex items-center justify-center font-bold">
          &#9660;
        </button>
        <div />
      </div>

      {ds.dead && (
        <button onClick={startGame} className="px-4 py-1.5 bg-green-900 hover:bg-green-800 text-green-400 border border-green-700 font-mono text-xs rounded">
          REINTENTAR [{ds.score} PTS]
        </button>
      )}
      {!ds.running && !ds.dead && (
        <button onClick={startGame} className="px-4 py-1.5 bg-green-900 hover:bg-green-800 text-green-400 border border-green-700 font-mono text-xs rounded">
          [INICIAR]
        </button>
      )}
    </div>
  );
};
