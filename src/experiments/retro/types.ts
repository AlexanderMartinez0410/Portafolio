export interface ScoreEntry {
  name: string;
  score: number;
  game: string;
  date: string;
}

export const LS_KEY = 'retro_pc_scores_v1';

export function loadScores(): ScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function persistScore(entry: ScoreEntry): ScoreEntry[] {
  const all = loadScores();
  all.push(entry);
  all.sort((a, b) => b.score - a.score);
  const top = all.slice(0, 30);
  localStorage.setItem(LS_KEY, JSON.stringify(top));
  return top;
}

export const GAME_LABELS: Record<string, string> = {
  snake: 'SERPIENTE',
  minesweeper: 'BUSCAMINAS',
  tetris: 'TETRIS',
};
