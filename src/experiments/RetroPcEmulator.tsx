import React, { useState, useEffect, useCallback } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { type ScoreEntry, GAME_LABELS, LS_KEY, loadScores, persistScore } from './retro/types';
import { SnakeGame } from './retro/SnakeGame';
import { MinesweeperGame } from './retro/MinesweeperGame';
import { TetrisGame } from './retro/TetrisGame';
import { Leaderboard } from './retro/Leaderboard';
import { GameOverModal } from './retro/GameOverModal';
import { BootSequence } from './retro/BootSequence';

const MENU_ITEMS = [
  { id: 'snake', label: 'SERPIENTE', sub: 'Clasico de los 90s · Snake' },
  { id: 'minesweeper', label: 'BUSCAMINAS', sub: 'Windows 3.11 edition' },
  { id: 'tetris', label: 'TETRIS', sub: 'Caida de bloques' },
  { id: 'scores', label: 'PUNTUACIONES', sub: 'Ver mejores partidas guardadas' },
];

export const RetroPcEmulator: React.FC<ExperimentComponentProps> = ({ onTelemetryUpdate }) => {
  const [phase, setPhase] = useState<'boot' | 'menu' | 'game' | 'scores'>('boot');
  const [activeGame, setActiveGame] = useState<string>('menu');
  const [menuSel, setMenuSel] = useState(0);
  const [scores, setScores] = useState<ScoreEntry[]>(loadScores);
  const [lbFilter, setLbFilter] = useState('all');
  const [currentScore, setCurrentScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const selectItem = useCallback((idx: number) => {
    const item = MENU_ITEMS[idx];
    if (item.id === 'scores') {
      setPhase('scores');
    } else {
      setActiveGame(item.id);
      setPhase('game');
      setCurrentScore(0);
      setShowGameOver(false);
      setGameKey(k => k + 1);
    }
  }, []);

  useEffect(() => {
    if (phase !== 'menu') return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMenuSel(s => (s - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuSel(s => (s + 1) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        setMenuSel(s => { selectItem(s); return s; });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, selectItem]);

  const handleGameOver = (sc: number) => {
    setFinalScore(sc);
    setShowGameOver(true);
  };

  const handleSaveScore = (name: string) => {
    const entry: ScoreEntry = {
      name,
      score: finalScore,
      game: activeGame,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    };
    const updated = persistScore(entry);
    setScores(updated);
    onTelemetryUpdate?.({
      customMetrics: [
        { label: 'Guardado', value: finalScore, color: 'text-amber-400' },
        { label: 'Juego', value: GAME_LABELS[activeGame] ?? activeGame, color: 'text-blue-400' }
      ]
    });
  };

  const handleRetry = () => {
    setShowGameOver(false);
    setCurrentScore(0);
    setGameKey(k => k + 1);
  };

  const handleMenu = () => {
    setShowGameOver(false);
    setPhase('menu');
    setActiveGame('menu');
  };

  useEffect(() => {
    onTelemetryUpdate?.({
      customMetrics: [
        { label: 'Juego', value: GAME_LABELS[activeGame] ?? 'Menú', color: 'text-amber-400' },
        { label: 'Puntos', value: currentScore, color: 'text-green-400' },
        { label: 'Records', value: scores.length, color: 'text-blue-400' },
      ]
    });
  }, [currentScore, activeGame, scores.length, onTelemetryUpdate]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-gray-950 to-gray-900">
      {/* DESKTOP: CRT Monitor shell */}
      <div className="hidden md:block w-full max-w-3xl">
        {/* Bezel */}
        <div
          className="relative bg-gradient-to-b from-stone-400 to-stone-500 rounded-2xl p-4 shadow-2xl border-4 border-stone-600"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)' }}
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-mono text-stone-700 text-xs font-bold tracking-widest">DinoSoft RetroPC 9000</span>
            <div className="flex gap-1 items-center">
              <div className={`w-2 h-2 rounded-full ${phase === 'boot' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="font-mono text-stone-600 text-xs">{phase === 'boot' ? 'POST' : 'ON'}</span>
            </div>
          </div>

          {/* Screen */}
          <div className="relative rounded-lg overflow-hidden bg-black" style={{ minHeight: 380, boxShadow: 'inset 0 0 30px rgba(0,255,0,0.05)' }}>
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)' }} />

            {phase === 'boot' && <BootSequence onDone={() => setPhase('menu')} />}

            {phase === 'menu' && (
              <div className="p-6 font-mono text-green-400 space-y-4">
                <div className="border-b border-green-900 pb-3 mb-4">
                  <pre className="text-green-300 text-xs leading-tight">{`╔══════════════════════════════╗\n║   C:\\GAMES\\MENU.EXE v1.0   ║\n╚══════════════════════════════╝`}</pre>
                </div>
                {MENU_ITEMS.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => { setMenuSel(i); selectItem(i); }}
                    onMouseEnter={() => setMenuSel(i)}
                    className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${menuSel === i ? 'bg-green-900/60 text-green-300' : 'hover:bg-green-900/30'}`}
                  >
                    <span className="text-green-600 w-3">{menuSel === i ? '►' : ''}</span>
                    <div>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-green-700 text-xs">{item.sub}</div>
                    </div>
                  </div>
                ))}
                <div className="text-green-800 text-xs mt-4">↑↓ navegar · Enter o clic para seleccionar</div>
              </div>
            )}

            {phase === 'game' && (
              <div className="relative p-3 flex flex-col items-center justify-center" style={{ minHeight: 380 }}>
                <div className="flex justify-between w-full mb-3 px-1">
                  <button onClick={handleMenu} className="font-mono text-gray-600 text-xs hover:text-gray-400 transition-colors">← MENÚ</button>
                  <span className="font-mono text-xs text-gray-600">{GAME_LABELS[activeGame] ?? activeGame}</span>
                  <span className="font-mono text-xs text-gray-600">PTS: {currentScore}</span>
                </div>
                {activeGame === 'snake' && <SnakeGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
                {activeGame === 'minesweeper' && <MinesweeperGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
                {activeGame === 'tetris' && <TetrisGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
                {showGameOver && <GameOverModal score={finalScore} gameId={activeGame} onSave={handleSaveScore} onRetry={handleRetry} onMenu={handleMenu} />}
              </div>
            )}

            {phase === 'scores' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <button onClick={() => setPhase('menu')} className="font-mono text-gray-600 text-xs hover:text-gray-400 transition-colors">← MENÚ</button>
                  <span className="font-mono text-amber-400 text-xs">TABLA DE PUNTUACIONES</span>
                  <button onClick={() => { localStorage.removeItem(LS_KEY); setScores([]); }} className="font-mono text-red-900 text-xs hover:text-red-600 transition-colors">BORRAR</button>
                </div>
                <Leaderboard scores={scores} filter={lbFilter} setFilter={setLbFilter} />
              </div>
            )}
          </div>

          {/* Monitor bottom bar */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex gap-1.5 items-center">
              <div className="w-4 h-1.5 bg-stone-600 rounded-full border border-stone-700" />
              <div className="w-4 h-1.5 bg-stone-600 rounded-full border border-stone-700" />
              <div className="w-4 h-1.5 bg-stone-600 rounded-full border border-stone-700" />
            </div>
            <div className="font-mono text-stone-600 text-[10px] tracking-widest">DinoSoft DPC-9000 · 1993</div>
            <div className="flex gap-1.5 items-center">
              <div className="w-3 h-3 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${phase === 'boot' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
              </div>
              <div className="w-3 h-3 rounded-full bg-stone-700 border border-stone-600" />
            </div>
          </div>
        </div>

        {/* Stand */}
        <div className="flex justify-center"><div className="w-32 h-4 bg-gradient-to-b from-stone-500 to-stone-600 rounded-b-md" /></div>
        <div className="flex justify-center"><div className="w-48 h-2 bg-stone-600 rounded-b-lg" /></div>
      </div>

      {/* MOBILE: bare screen without bezel */}
      <div className="md:hidden w-full bg-black border border-gray-800 rounded-lg overflow-hidden" style={{ minHeight: 420 }}>
        {/* Mobile header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-900">
          <span className="font-mono text-green-700 text-xs">RetroPC</span>
          <div className="flex gap-1 items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${phase === 'boot' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="font-mono text-gray-700 text-xs">{phase === 'boot' ? 'BOOT' : 'OK'}</span>
          </div>
        </div>

        {/* CRT scanlines overlay */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)' }} />

          {phase === 'boot' && <BootSequence onDone={() => setPhase('menu')} />}

          {phase === 'menu' && (
            <div className="p-4 font-mono text-green-400 space-y-3">
              <pre className="text-green-300 text-xs leading-tight">{`C:\\GAMES\\MENU.EXE`}</pre>
              {MENU_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => { setMenuSel(i); selectItem(i); }}
                  className="flex items-center gap-2 px-2 py-2.5 rounded cursor-pointer transition-colors bg-green-900/20 active:bg-green-900/60 border border-green-900/30"
                >
                  <span className="text-green-500 w-3 text-xs">&gt;</span>
                  <div>
                    <div className="text-sm">{item.label}</div>
                    <div className="text-green-700 text-xs">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {phase === 'game' && (
            <div className="relative p-2 flex flex-col items-center justify-center">
              <div className="flex justify-between w-full mb-2 px-1">
                <button onClick={handleMenu} className="font-mono text-gray-600 text-xs hover:text-gray-400">&lt;- MENU</button>
                <span className="font-mono text-xs text-gray-600">{GAME_LABELS[activeGame] ?? activeGame}</span>
                <span className="font-mono text-xs text-gray-600">PTS: {currentScore}</span>
              </div>
              {activeGame === 'snake' && <SnakeGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
              {activeGame === 'minesweeper' && <MinesweeperGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
              {activeGame === 'tetris' && <TetrisGame key={gameKey} onGameOver={handleGameOver} onScoreChange={setCurrentScore} />}
              {showGameOver && <GameOverModal score={finalScore} gameId={activeGame} onSave={handleSaveScore} onRetry={handleRetry} onMenu={handleMenu} />}
            </div>
          )}

          {phase === 'scores' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <button onClick={() => setPhase('menu')} className="font-mono text-gray-600 text-xs hover:text-gray-400">&lt;- MENU</button>
                <span className="font-mono text-amber-400 text-xs">PUNTUACIONES</span>
                <button onClick={() => { localStorage.removeItem(LS_KEY); setScores([]); }} className="font-mono text-red-900 text-xs hover:text-red-600">BORRAR</button>
              </div>
              <Leaderboard scores={scores} filter={lbFilter} setFilter={setLbFilter} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
