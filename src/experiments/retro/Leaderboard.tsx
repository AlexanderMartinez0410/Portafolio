import React from 'react';
import { type ScoreEntry, GAME_LABELS } from './types';

export const Leaderboard: React.FC<{
  scores: ScoreEntry[];
  filter: string;
  setFilter: (f: string) => void;
}> = ({ scores, filter, setFilter }) => {
  const filtered = filter === 'all' ? scores : scores.filter(s => s.game === filter);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {['all', 'snake', 'minesweeper', 'tetris'].map(g => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors ${
              filter === g
                ? 'bg-amber-600 border-amber-500 text-black'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {g === 'all' ? 'TODOS' : GAME_LABELS[g]}
          </button>
        ))}
      </div>
      <div className="bg-black border border-gray-800 rounded overflow-hidden">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500">
              <th className="text-left px-2 py-1">#</th>
              <th className="text-left px-2 py-1">NOMBRE</th>
              <th className="text-left px-2 py-1">JUEGO</th>
              <th className="text-right px-2 py-1">PTS</th>
              <th className="text-right px-2 py-1">FECHA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-700 py-4">
                  Sin puntuaciones aún
                </td>
              </tr>
            ) : (
              filtered.slice(0, 10).map((s, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-900 ${
                    i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-700' : 'text-gray-600'
                  }`}
                >
                  <td className="px-2 py-1">{i === 0 ? '👑' : `${i + 1}.`}</td>
                  <td className="px-2 py-1 truncate max-w-[80px]">{s.name}</td>
                  <td className="px-2 py-1">{GAME_LABELS[s.game] ?? s.game}</td>
                  <td className="px-2 py-1 text-right font-bold">{s.score.toLocaleString()}</td>
                  <td className="px-2 py-1 text-right text-gray-700">{s.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
