// effects.js — the satisfying bits: the green ring that lands on a found
// difference, the red X on a wrong click, the pulsing hint ring, the burst
// of sparkles and the floating "+100" that rises from each find.

export function drawFoundMarker(ctx, x, y, r, t) {
  // A green ring that pops in, then settles with a check mark.
  const pop = Math.min(1, t / 0.18);
  const rr = r * (0.7 + 0.3 * pop);
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, rr + 5, 0, Math.PI * 2); ctx.stroke();
  if (pop >= 1) {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y);
    ctx.lineTo(x - r * 0.12, y + r * 0.38);
    ctx.lineTo(x + r * 0.5, y - r * 0.38);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawWrongMark(ctx, x, y, age) {
  const alpha = Math.max(0, 1 - age / 0.7);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 12, y - 12); ctx.lineTo(x + 12, y + 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 12, y - 12); ctx.lineTo(x - 12, y + 12); ctx.stroke();
  ctx.restore();
}

export function drawHintRing(ctx, x, y, r, now) {
  const pulse = 0.5 + 0.5 * Math.sin(now * 6);
  ctx.save();
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.65 + 0.35 * pulse;
  ctx.beginPath(); ctx.arc(x, y, r + 4 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r + 10 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

/** One burst of sparkles, spawned where a difference was found. */
export class SparkleBurst {
  constructor(x, y) {
    this.parts = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 40 + Math.random() * 90;
      this.parts.push({
        x, y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 30,
        life: 0.6 + Math.random() * 0.4, age: 0,
        size: 2 + Math.random() * 3,
        color: ['#ffd93b', '#22c55e', '#ffffff', '#7b61ff'][i % 4],
      });
    }
  }
  update(dt) {
    for (const p of this.parts) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; }
    this.parts = this.parts.filter((p) => p.age < p.life);
  }
  draw(ctx) {
    for (const p of this.parts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  get alive() { return this.parts.length > 0; }
}

/** Floating score text that rises and fades. */
export class FloatText {
  constructor(x, y, text, color = '#22c55e') { this.x = x; this.y = y; this.text = text; this.color = color; this.age = 0; }
  update(dt) { this.age += dt; this.y -= 34 * dt; }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - this.age / 1.1);
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 4;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
  get alive() { return this.age < 1.1; }
}
