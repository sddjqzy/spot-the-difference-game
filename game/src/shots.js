// shots.js — screenshot presets for the maker's own screenshots.
// ?shot=cover  → Garden, 3 of 5 found, 4 left to find, timer frozen at 2:10
// ?shot=harbor → Harbor at Dusk, 2 of 6 found, a hint ring pulsing
// ?shot=market → Winter Market, 4 of 7 found, timer frozen at 1:05
// ?shot=win    → victory screen after all six worlds
// These are real renders of the game's own code, with the clock frozen so
// the numbers stay still for the camera. Normal play never uses them.
import { LEVELS } from './levels.js';

const PRESETS = {
  cover: { level: 0, found: 3, timeLeft: 130 },
  harbor: { level: 1, found: 2, timeLeft: 118, hint: true },
  market: { level: 4, found: 4, timeLeft: 65 },
  win: { level: 5, found: 8, victory: true, timeLeft: 45 },
};

export function applyShotPreset(game) {
  const shot = new URLSearchParams(window.location.search).get('shot');
  const preset = PRESETS[shot];
  if (!preset) return false;
  game.frozen = true;
  game.startLevel(preset.level);
  game.frozen = true;
  const level = LEVELS[preset.level];
  game.timeLeft = preset.timeLeft;
  for (let i = 0; i < preset.found; i++) {
    const d = level.diffs[i];
    game.found.add(d.id);
    game.foundAt.set(d.id, 1);
  }
  game.score = preset.found * 100 + 250;
  game.totalFound = preset.found;
  if (preset.hint) {
    const next = level.diffs[preset.found];
    game.hint = { diff: next, until: Number.POSITIVE_INFINITY };
    game.hintsLeft = 2;
    game.setMessage(`Hint: ${next.hint}`);
  } else {
    game.setMessage(`Found ${preset.found} of ${level.diffs.length} — ${level.diffs.length - preset.found} differences still hiding!`);
  }
  if (preset.victory) {
    game.score = 5840;
    game.totalFound = 39;
    game.bestCombo = 5;
    game.hits = 42;
    game.clicks = 46;
    game.showVictory();
  }
  game.updateHud();
  return true;
}
