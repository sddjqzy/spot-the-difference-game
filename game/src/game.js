// game.js — Twin Worlds: the state machine, the timer, the scoring, the
// hints and the input. It owns the two panels and the HUD; the art lives in
// scenes.js, the level data in levels.js, the sounds in audio.js.
import { LEVELS, TOTAL_DIFFS } from './levels.js';
import { drawScene, PANEL_W, PANEL_H } from './scenes.js';
import { drawFoundMarker, drawWrongMark, drawHintRing, SparkleBurst, FloatText } from './effects.js';
import { playFound, playWrong, playHint, playLevelClear, playVictory, playTimeUp, playClick, toggleMute, isMuted } from './audio.js';

const $ = (id) => document.getElementById(id);

export class TwinWorldsGame {
  constructor() {
    this.left = $('panel-left');
    this.right = $('panel-right');
    this.lctx = this.left.getContext('2d');
    this.rctx = this.right.getContext('2d');
    this.state = 'menu'; // menu | playing | levelClear | victory | timeUp
    this.levelIndex = 0;
    this.found = new Set();
    this.foundAt = new Map(); // diff id -> seconds since found (for pop-in)
    this.score = 0;
    this.totalFound = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.frozen = false; // screenshot mode: the clock does not run
    this.wrongMarks = []; // {x, y, age, panel}
    this.bursts = [];
    this.floats = [];
    this.hint = null; // {diff, until}
    this.hintMessage = '';
    this.shakeUntil = 0;
    this.clicks = 0;
    this.hits = 0;
    this.lastTs = 0;
    this.levelStartScore = 0;
    this.bindInput();
    this.buildMenu();
    this.showOverlay('menu');
  }

  // ------------------------------------------------------------ input
  bindInput() {
    const onClick = (e, panel) => {
      if (this.state !== 'playing' || this.frozen) return;
      const rect = panel.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * PANEL_W;
      const y = ((e.clientY - rect.top) / rect.height) * PANEL_H;
      this.clickAt(x, y);
    };
    this.left.addEventListener('click', (e) => onClick(e, this.left));
    this.right.addEventListener('click', (e) => onClick(e, this.right));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') this.useHint();
      if (e.key === 'm' || e.key === 'M') this.toggleSound();
      if (e.key === 'Enter') {
        if (this.state === 'menu') this.startLevel(0);
        else if (this.state === 'levelClear') this.nextLevel();
        else if (this.state === 'victory' || this.state === 'timeUp') this.backToMenu();
      }
      if (e.key >= '1' && e.key <= '6' && this.state === 'menu') this.startLevel(Number(e.key) - 1);
    });
    $('btn-hint').addEventListener('click', () => this.useHint());
    $('btn-sound').addEventListener('click', () => this.toggleSound());
    $('btn-menu').addEventListener('click', () => { playClick(); this.backToMenu(); });
    $('btn-restart').addEventListener('click', () => { playClick(); this.startLevel(this.levelIndex); });
    $('btn-next').addEventListener('click', () => { playClick(); this.nextLevel(); });
    $('btn-again').addEventListener('click', () => { playClick(); this.startLevel(0); });
    $('btn-retry').addEventListener('click', () => { playClick(); this.startLevel(this.levelIndex); });
    $('btn-menu2').addEventListener('click', () => { playClick(); this.backToMenu(); });
    $('btn-menu4').addEventListener('click', () => { playClick(); this.backToMenu(); });
    $('btn-menu3').addEventListener('click', () => { playClick(); this.backToMenu(); });
    $('btn-start').addEventListener('click', () => { playClick(); this.startLevel(0); });
  }

  toggleSound() {
    const muted = toggleMute();
    $('btn-sound').textContent = muted ? '🔇 Muted' : '🔊 Sound';
    if (!muted) playClick();
  }

  // ------------------------------------------------------------ flow
  buildMenu() {
    const grid = $('level-grid');
    grid.innerHTML = '';
    LEVELS.forEach((level, i) => {
      const card = document.createElement('button');
      card.className = 'level-card';
      card.innerHTML = `<span class="level-num">${i + 1}</span>
        <span class="level-name">${level.name}</span>
        <span class="level-meta">${level.diffs.length} differences · ${Math.floor(level.timeLimit / 60)}:${String(level.timeLimit % 60).padStart(2, '0')}</span>`;
      card.addEventListener('click', () => { playClick(); this.startLevel(i); });
      grid.appendChild(card);
    });
  }

  startLevel(i) {
    this.levelIndex = i;
    const level = LEVELS[i];
    this.found = new Set();
    this.foundAt = new Map();
    this.combo = 0;
    this.hintsLeft = level.hints;
    this.timeLeft = level.timeLimit;
    this.wrongMarks = [];
    this.bursts = [];
    this.floats = [];
    this.hint = null;
    this.hintMessage = '';
    this.levelStartScore = this.score;
    this.state = 'playing';
    this.hideOverlays();
    this.updateHud();
    $('level-tagline').textContent = level.tagline;
    this.setMessage(`Level ${i + 1} — ${level.name}: find ${level.diffs.length} differences!`);
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
    else this.showVictory();
  }

  backToMenu() {
    this.state = 'menu';
    this.score = 0;
    this.totalFound = 0;
    this.bestCombo = 0;
    this.hits = 0;
    this.clicks = 0;
    this.showOverlay('menu');
    this.updateHud();
  }

  clickAt(x, y) {
    const level = LEVELS[this.levelIndex];
    this.clicks += 1;
    const hit = level.diffs.find((d) => !this.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r);
    if (hit) {
      this.found.add(hit.id);
      this.foundAt.set(hit.id, 0);
      this.hits += 1;
      this.totalFound += 1;
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const comboBonus = (this.combo - 1) * 25;
      const gained = 100 + comboBonus;
      this.score += gained;
      playFound();
      this.bursts.push(new SparkleBurst(hit.x, hit.y));
      this.floats.push(new FloatText(hit.x, hit.y - 10, `+${gained}${this.combo > 1 ? '  ×' + this.combo + ' combo!' : ''}`));
      if (this.found.size === level.diffs.length) {
        this.levelCleared();
      } else {
        this.setMessage(`Found: ${hit.label}! ${level.diffs.length - this.found.size} to go.`);
      }
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - 15);
      playWrong();
      this.wrongMarks.push({ x, y, age: 0 });
      this.shakeUntil = performance.now() / 1000 + 0.25;
      this.setMessage('Not a difference — look closer! (−15 points)');
    }
    this.updateHud();
  }

  useHint() {
    if (this.state !== 'playing' || this.frozen) return;
    const level = LEVELS[this.levelIndex];
    if (this.hintsLeft <= 0) { this.setMessage('No hints left on this level!'); return; }
    const remaining = level.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 50);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hint = { diff: pick, until: performance.now() / 1000 + 4 };
    this.hintMessage = pick.hint;
    playHint();
    this.setMessage(`Hint (−50): ${pick.hint}`);
    this.updateHud();
  }

  levelCleared() {
    const level = LEVELS[this.levelIndex];
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.score += timeBonus;
    const accuracy = this.clicks === 0 ? 100 : Math.round((this.hits / this.clicks) * 100);
    const stars = this.timeLeft >= 60 && accuracy >= 80 ? 3 : this.timeLeft >= 30 && accuracy >= 60 ? 2 : 1;
    this.state = 'levelClear';
    if (this.levelIndex + 1 === LEVELS.length) { this.showVictory(); return; }
    playLevelClear();
    $('clear-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('clear-title').textContent = `${level.name} — cleared!`;
    $('clear-detail').textContent =
      `All ${level.diffs.length} differences found · time bonus +${timeBonus} · accuracy ${accuracy}% · score ${this.score}`;
    $('btn-next').textContent = `Next: ${LEVELS[this.levelIndex + 1].name} →`;
    this.showOverlay('levelClear');
    this.updateHud();
  }

  showVictory() {
    this.state = 'victory';
    playVictory();
    const accuracy = this.clicks === 0 ? 100 : Math.round((this.hits / this.clicks) * 100);
    $('victory-score').textContent = this.score;
    $('victory-detail').textContent =
      `All ${TOTAL_DIFFS} differences across 6 worlds · best combo ×${this.bestCombo} · accuracy ${accuracy}%`;
    this.showOverlay('victory');
    this.updateHud();
  }

  timeUp() {
    this.state = 'timeUp';
    playTimeUp();
    const level = LEVELS[this.levelIndex];
    $('timeup-detail').textContent =
      `You found ${this.found.size} of ${level.diffs.length} differences in ${level.name}. Try again — you were close!`;
    this.showOverlay('timeUp');
    this.updateHud();
  }

  // ------------------------------------------------------------ HUD
  updateHud() {
    const level = LEVELS[this.levelIndex];
    $('level-name').textContent = `Level ${this.levelIndex + 1}/6 · ${level.name}`;
    $('score').textContent = `Score ${this.score}`;
    const left = level.diffs.length - this.found.size;
    $('counter').textContent = `🔍 Found ${this.found.size} / ${level.diffs.length} · ${left} left`;
    $('btn-hint').textContent = `💡 Hint (${this.hintsLeft})`;
    $('btn-hint').disabled = this.hintsLeft <= 0 || this.state !== 'playing';
    const tl = Number.isFinite(this.timeLeft) ? Math.max(0, this.timeLeft) : 0;
    const mm = Math.floor(tl / 60);
    const ss = String(Math.floor(tl) % 60).padStart(2, '0');
    $('timer').textContent = `⏱ ${mm}:${ss}`;
    $('timer').classList.toggle('low', this.timeLeft <= 20 && this.state === 'playing');
    $('timer-bar').style.width = `${(Math.max(0, this.timeLeft) / level.timeLimit) * 100}%`;
    $('timer-bar').classList.toggle('low', this.timeLeft <= 20 && this.state === 'playing');
    $('level-dots').innerHTML = LEVELS.map((l, i) =>
      `<span class="dot${i === this.levelIndex ? ' current' : ''}${i < this.levelIndex ? ' done' : ''}">${i + 1}</span>`).join('');
  }

  setMessage(text) { $('message').textContent = text; }

  showOverlay(which) {
    this.hideOverlays();
    $(`overlay-${which}`).classList.remove('hidden');
  }
  hideOverlays() {
    for (const id of ['menu', 'levelClear', 'victory', 'timeUp']) $(`overlay-${id}`).classList.add('hidden');
  }

  // ------------------------------------------------------------ frame
  frame(ts) {
    const dt = Math.min(0.05, (ts - this.lastTs) / 1000 || 0.016);
    this.lastTs = ts;
    const now = ts / 1000;
    if (this.state === 'playing' && !this.frozen) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.timeUp(); }
      if (Math.floor(this.timeLeft) !== Math.floor(this.timeLeft + dt)) this.updateHud();
    }
    for (const id of this.foundAt.keys()) this.foundAt.set(id, this.foundAt.get(id) + dt);
    for (const m of this.wrongMarks) m.age += dt;
    this.wrongMarks = this.wrongMarks.filter((m) => m.age < 0.7);
    for (const b of this.bursts) b.update(dt);
    this.bursts = this.bursts.filter((b) => b.alive);
    for (const f of this.floats) f.update(dt);
    this.floats = this.floats.filter((f) => f.alive);
    if (this.hint && now > this.hint.until) this.hint = null;

    const level = LEVELS[this.levelIndex];
    const allIds = new Set(level.diffs.map((d) => d.id));
    const shake = now < this.shakeUntil ? (Math.random() - 0.5) * 6 : 0;
    for (const [ctx, applied] of [[this.lctx, new Set()], [this.rctx, allIds]]) {
      ctx.save();
      ctx.translate(shake, 0);
      drawScene(ctx, this.levelIndex, applied);
      for (const d of level.diffs) {
        if (this.found.has(d.id)) drawFoundMarker(ctx, d.x, d.y, d.r, this.foundAt.get(d.id) || 0);
      }
      if (this.hint) drawHintRing(ctx, this.hint.diff.x, this.hint.diff.y, this.hint.diff.r, now);
      for (const m of this.wrongMarks) drawWrongMark(ctx, m.x, m.y, m.age);
      for (const b of this.bursts) b.draw(ctx);
      for (const f of this.floats) f.draw(ctx);
      ctx.restore();
    }
    requestAnimationFrame((t) => this.frame(t));
  }

  start() {
    this.updateHud();
    requestAnimationFrame((t) => this.frame(t));
  }
}
