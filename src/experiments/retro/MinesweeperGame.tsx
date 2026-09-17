import React, { useState, useEffect, useRef } from 'react';

const MS_R = 10, MS_C = 12, MS_M = 14;
interface MsCell { mine: boolean; revealed: boolean; flagged: boolean; adj: number; }

function mkBoard(): MsCell[][] {
  const b: MsCell[][] = Array.from({ length: MS_R }, () => Array.from({ length: MS_C }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 })));
  let p = 0;
  while (p < MS_M) {
    const r = Math.floor(Math.random() * MS_R), c = Math.floor(Math.random() * MS_C);
    if (!b[r][c].mine) { b[r][c].mine = true; p++; }
  }
  for (let r = 0; r < MS_R; r++) {
    for (let c = 0; c < MS_C; c++) {
      if (!b[r][c].mine) {
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < MS_R && nc >= 0 && nc < MS_C && b[nr][nc].mine) cnt++;
          }
        }
        b[r][c].adj = cnt;
      }
    }
  }
  return b;
}

function flood(b: MsCell[][], r: number, c: number): MsCell[][] {
  const nb = b.map(row => row.map(cl => ({ ...cl })));
  const q = [[r, c]];
  while (q.length) {
    const item = q.pop()!;
    const cr = item[0], cc = item[1];
    if (cr < 0 || cr >= MS_R || cc < 0 || cc >= MS_C) continue;
    const cell = nb[cr][cc];
    if (cell.revealed || cell.flagged || cell.mine) continue;
    cell.revealed = true;
    if (cell.adj === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) q.push([cr + dr, cc + dc]);
      }
    }
  }
  return nb;
}

const adjC: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-green-400',
  3: 'text-red-400',
  4: 'text-purple-400',
  5: 'text-red-600',
  6: 'text-cyan-400',
  7: 'text-white',
  8: 'text-gray-400'
};

export const MinesweeperGame: React.FC<{ onGameOver: (s: number) => void; onScoreChange: (s: number) => void }> = ({ onGameOver, onScoreChange }) => {
  const [board, setBoard] = useState<MsCell[][]>(mkBoard);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flags, setFlags] = useState(MS_M);
  const [time, setTime] = useState(0);
  // flagMode: when true, tapping a cell places/removes a flag instead of revealing
  const [flagMode, setFlagMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);

  const stopT = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => stopT(), []);

  const reset = () => {
    stopT();
    setBoard(mkBoard());
    setPhase('idle');
    setFlags(MS_M);
    setTime(0);
    timeRef.current = 0;
    setFlagMode(false);
    onScoreChange(0);
  };

  const reveal = (r: number, c: number) => {
    if (phase === 'won' || phase === 'lost') return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    if (phase === 'idle') {
      setPhase('playing');
      timerRef.current = setInterval(() => { timeRef.current++; setTime(t => t + 1); }, 1000);
    }
    if (cell.mine) {
      const nb = board.map(row => row.map(cl => cl.mine ? { ...cl, revealed: true } : cl));
      setBoard(nb);
      setPhase('lost');
      stopT();
      onGameOver(0);
      return;
    }
    const nb = flood(board, r, c);
    setBoard(nb);
    const safe = MS_R * MS_C - MS_M;
    const rev = nb.flat().filter(cl => cl.revealed).length;
    if (rev >= safe) {
      setPhase('won');
      stopT();
      const sc = Math.max(0, 1000 - timeRef.current * 10 + 500);
      onScoreChange(sc);
      onGameOver(sc);
    }
  };

  const flagCell = (r: number, c: number) => {
    if (phase === 'won' || phase === 'lost' || board[r][c].revealed) return;
    const nb = board.map(row => row.map(cl => ({ ...cl })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
    setFlags(f => f + (nb[r][c].flagged ? -1 : 1));
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    flagCell(r, c);
  };

  // Unified cell tap: depends on flagMode state
  const tapCell = (r: number, c: number) => {
    if (flagMode) flagCell(r, c);
    else reveal(r, c);
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full">
      {/* Status bar */}
      <div className="flex justify-between w-full px-1">
        <span className="font-mono text-red-400 text-xs">MINAS: {flags}</span>
        <span className={`font-mono text-xs ${phase === 'won' ? 'text-green-400' : phase === 'lost' ? 'text-red-400' : 'text-gray-400'}`}>
          {phase === 'won' ? '[GANASTE!]' : phase === 'lost' ? '[BOOM!]' : phase === 'playing' ? `T: ${time}s` : 'BUSCAMINAS'}
        </span>
        <button onClick={reset} className="font-mono text-yellow-400 text-xs border border-yellow-800 px-2 py-0.5 rounded hover:bg-yellow-900 transition-colors">[R]</button>
      </div>

      {/* Mobile: flag mode toggle */}
      <div className="flex gap-2 w-full px-1">
        <button
          onClick={() => setFlagMode(false)}
          className={`flex-1 py-1.5 font-mono text-xs rounded border transition-colors ${
            !flagMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-600'
          }`}
        >
          REVELAR
        </button>
        <button
          onClick={() => setFlagMode(true)}
          className={`flex-1 py-1.5 font-mono text-xs rounded border transition-colors ${
            flagMode ? 'bg-red-800 border-red-600 text-red-200' : 'border-gray-700 text-gray-500 hover:border-gray-600'
          }`}
        >
          BANDERA [F]
        </button>
      </div>

      {/* Board */}
      <div className="border-2 border-gray-700 bg-gray-900 p-1 overflow-auto max-w-full" style={{ display: 'grid', gridTemplateColumns: `repeat(${MS_C}, 24px)`, gap: 1 }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`}
            onClick={() => tapCell(r, c)}
            onContextMenu={e => flag(e, r, c)}
            className={`w-6 h-6 text-xs font-bold font-mono flex items-center justify-center transition-colors ${
              cell.revealed
                ? cell.mine ? 'bg-red-900 text-red-400' : 'bg-gray-800'
                : flagMode && !cell.revealed
                  ? 'bg-gray-600 border border-red-800 active:bg-red-900'
                  : 'bg-gray-600 hover:bg-gray-500 border border-gray-500 active:bg-gray-700'
            }`}
          >
            {cell.revealed
              ? cell.mine ? 'X' : cell.adj > 0 ? <span className={adjC[cell.adj]}>{cell.adj}</span> : ''
              : cell.flagged ? <span className="text-red-400">F</span> : ''}
          </button>
        )))}
      </div>
      <p className="font-mono text-gray-600 text-xs">
        {flagMode ? 'MODO BANDERA: toca para marcar' : 'MODO REVELAR: toca para abrir'}
      </p>
    </div>
  );
};
