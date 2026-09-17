import React, { useState, useEffect, useRef } from 'react';
import { GAME_LABELS } from './types';

export const GameOverModal: React.FC<{
  score: number;
  gameId: string;
  onSave: (n: string) => void;
  onRetry: () => void;
  onMenu: () => void;
}> = ({ score, gameId, onSave, onRetry, onMenu }) => {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setSaved(true);
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 rounded-lg">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-72 text-center space-y-4">
        <div className="font-mono">
          <div className="text-red-400 text-xs mb-1">— PARTIDA TERMINADA —</div>
          <div className="text-white text-4xl font-bold">{score.toLocaleString()}</div>
          <div className="text-gray-500 text-xs mt-1">puntos · {GAME_LABELS[gameId] ?? gameId}</div>
        </div>
        {!saved ? (
          <div className="space-y-2">
            <p className="font-mono text-gray-400 text-xs">¿Guardar puntuación?</p>
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value.slice(0, 12))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Tu nombre (máx 12)"
              maxLength={12}
              className="w-full bg-black border border-gray-700 text-white font-mono text-sm px-3 py-1.5 rounded focus:outline-none focus:border-amber-600 text-center placeholder-gray-700"
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-black font-mono text-xs rounded transition-colors"
            >
              GUARDAR
            </button>
          </div>
        ) : (
          <div className="font-mono text-green-400 text-xs">✓ Puntuación guardada</div>
        )}
        <div className="flex gap-2">
          <button
            onClick={onRetry}
            className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-mono text-xs rounded transition-colors"
          >
            REINTENTAR
          </button>
          <button
            onClick={onMenu}
            className="flex-1 py-1.5 border border-gray-700 hover:border-gray-500 text-gray-400 font-mono text-xs rounded transition-colors"
          >
            MENÚ
          </button>
        </div>
      </div>
    </div>
  );
};
