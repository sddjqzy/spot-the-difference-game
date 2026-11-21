// scenes.js — the hand-drawn art for every level of Twin Worlds.
// Each scene is drawn twice: once plain (left panel) and once with every
// difference applied (right panel). `applied` is a Set of difference ids
// that are switched on for this render. All art is original vector art
// drawn with the canvas 2D API; no images are loaded.
export const PANEL_W = 600;
export const PANEL_H = 440;

function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function ellipse(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function poly(ctx, points) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fill();
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
}
function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}
function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  circle(ctx, x, y, 18 * s); circle(ctx, x + 20 * s, y - 8 * s, 22 * s);
  circle(ctx, x + 44 * s, y, 18 * s); circle(ctx, x + 22 * s, y + 8 * s, 20 * s);
}
function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6);
  }
  ctx.fillStyle = center; circle(ctx, x, y, 5);
  ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 26); ctx.stroke();
}

// ---------------------------------------------------------------- Level 1: Sunny Garden
function drawGarden(ctx, applied) {
  sky(ctx, '#8fd3ff', '#e8f7ff');
  // Sun (g1: rays missing on the right)
  ctx.fillStyle = '#ffd93b'; circle(ctx, 90, 70, 34);
  ctx.fillStyle = '#ffec99'; circle(ctx, 90, 70, 24);
  if (!applied.has('g1')) {
    ctx.strokeStyle = '#f5b301'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(a) * 42, 70 + Math.sin(a) * 42);
      ctx.lineTo(90 + Math.cos(a) * 56, 70 + Math.sin(a) * 56);
      ctx.stroke();
    }
  }
  cloud(ctx, 250, 60, 1); cloud(ctx, 430, 95, 0.8);
  // Hills and lawn
  ctx.fillStyle = '#7ec850'; ctx.beginPath();
  ctx.moveTo(0, 300); ctx.quadraticCurveTo(200, 250, 400, 300);
  ctx.quadraticCurveTo(520, 330, 600, 300); ctx.lineTo(600, 440); ctx.lineTo(0, 440); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#66bb44'; ctx.fillRect(0, 380, 600, 60);
  // House
  ctx.fillStyle = '#ffb74d'; ctx.fillRect(390, 230, 150, 110);
  ctx.fillStyle = '#e4572e'; poly(ctx, [[375, 232], [465, 165], [555, 232]]);
  ctx.fillStyle = '#8d5a2b'; ctx.fillRect(450, 285, 30, 55);
  ctx.fillStyle = '#bfe8ff'; ctx.fillRect(405, 250, 34, 34); ctx.fillRect(500, 250, 34, 34);
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 3;
  ctx.strokeRect(405, 250, 34, 34); ctx.strokeRect(500, 250, 34, 34);
  ctx.beginPath(); ctx.moveTo(422, 250); ctx.lineTo(422, 284); ctx.moveTo(405, 267); ctx.lineTo(439, 267); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(517, 250); ctx.lineTo(517, 284); ctx.moveTo(500, 267); ctx.lineTo(534, 267); ctx.stroke();
  // Tree
  ctx.fillStyle = '#7a4a21'; ctx.fillRect(100, 250, 22, 90);
  ctx.fillStyle = '#43a047'; circle(ctx, 111, 215, 46); circle(ctx, 75, 245, 32); circle(ctx, 148, 245, 32);
  ctx.fillStyle = '#66bb6a'; circle(ctx, 100, 200, 22); circle(ctx, 130, 225, 18);
  // Fence (g4: one plank missing on the right)
  ctx.fillStyle = '#f5f0e6';
  for (let x = 20; x < 600; x += 34) {
    if (applied.has('g4') && x === 462) continue;
    ctx.fillRect(x, 356, 22, 44);
    ctx.beginPath(); ctx.moveTo(x, 356); ctx.lineTo(x + 11, 346); ctx.lineTo(x + 22, 356); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#e8dfc8'; ctx.fillRect(0, 372, 600, 6); ctx.fillRect(0, 390, 600, 6);
  // Flowers (g3: the red flower turns purple on the right)
  flower(ctx, 180, 392, applied.has('g3') ? '#9b59d0' : '#e63946', '#ffd93b');
  flower(ctx, 250, 398, '#ff8fab', '#fff3b0');
  flower(ctx, 330, 394, '#ff8fab', '#fff3b0');
  flower(ctx, 560, 398, '#e63946', '#ffd93b');
  flower(ctx, 60, 400, '#ff8fab', '#fff3b0');
  // Cat (g2: tail up on the left, drooping on the right)
  ctx.fillStyle = '#ff9f43';
  ellipse(ctx, 305, 335, 26, 20); // body
  circle(ctx, 282, 310, 15); // head
  poly(ctx, [[272, 300], [276, 286], [282, 298]]);
  poly(ctx, [[288, 298], [294, 286], [296, 300]]);
  ctx.strokeStyle = '#ff9f43'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(328, 330);
  if (applied.has('g2')) { ctx.quadraticCurveTo(352, 335, 350, 352); }
  else { ctx.quadraticCurveTo(352, 318, 344, 300); }
  ctx.stroke();
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 277, 308, 2); circle(ctx, 287, 308, 2);
  // Butterfly (g5: present on the left, gone on the right)
  if (!applied.has('g5')) {
    ctx.fillStyle = '#7b61ff';
    ellipse(ctx, 192, 146, 10, 14); ellipse(ctx, 210, 146, 10, 14);
    ellipse(ctx, 194, 162, 8, 10); ellipse(ctx, 208, 162, 8, 10);
    ctx.fillStyle = '#2b2b2b'; ctx.fillRect(199, 142, 4, 24);
  }
}

// ---------------------------------------------------------------- Level 2: Harbor at Dusk
function drawHarbor(ctx, applied) {
  sky(ctx, '#ff9e64', '#7b5ea7');
  ctx.fillStyle = '#fff3b0'; circle(ctx, 520, 70, 26);
  if (!applied.has('h6')) { ctx.fillStyle = '#e8d28a'; circle(ctx, 512, 62, 6); circle(ctx, 528, 78, 4); circle(ctx, 526, 60, 3); }
  cloud(ctx, 180, 80, 0.9); cloud(ctx, 350, 55, 0.7);
  // Sea
  ctx.fillStyle = '#2e6f9e'; ctx.fillRect(0, 290, 600, 150);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3;
  for (let y = 310; y < 430; y += 26) {
    ctx.beginPath(); ctx.moveTo(20, y);
    for (let x = 20; x <= 580; x += 40) ctx.quadraticCurveTo(x + 20, y - 6, x + 40, y);
    ctx.stroke();
  }
  // Dock
  ctx.fillStyle = '#8d5a2b'; ctx.fillRect(0, 360, 260, 18); ctx.fillRect(0, 378, 260, 8);
  // Lighthouse
  ctx.fillStyle = '#f5f0e6'; poly(ctx, [[70, 300], [80, 170], [110, 170], [120, 300]]);
  ctx.fillStyle = '#e4572e'; ctx.fillRect(74, 262, 42, 16); ctx.fillRect(78, 218, 34, 16); ctx.fillRect(82, 174, 26, 16);
  ctx.fillStyle = '#2b2b2b'; ctx.fillRect(76, 152, 38, 20);
  ctx.fillStyle = '#ffe66d'; circle(ctx, 95, 162, 9);
  if (!applied.has('h1')) { // light beam on the left
    ctx.fillStyle = 'rgba(255,230,109,0.35)';
    poly(ctx, [[104, 162], [240, 120], [240, 205]]);
  }
  // Sailboat (h2: white sail left, red sail right)
  ctx.fillStyle = '#5a3a1a'; poly(ctx, [[270, 330], [350, 330], [335, 312], [285, 312]]);
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(306, 240, 5, 74);
  ctx.fillStyle = applied.has('h2') ? '#e4572e' : '#ffffff';
  poly(ctx, [[312, 246], [312, 308], [352, 308]]);
  ctx.fillStyle = applied.has('h2') ? '#c94f2e' : '#f0f0f0';
  poly(ctx, [[304, 250], [304, 308], [272, 308]]);
  // Rowboat
  ctx.fillStyle = '#7a4a21'; ellipse(ctx, 470, 345, 42, 12);
  ctx.fillStyle = '#a06a35'; ellipse(ctx, 470, 340, 42, 10);
  // Gulls (h3: an extra gull on the right)
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const gulls = [[300, 90], [340, 110], [260, 120]];
  if (applied.has('h3')) gulls.push([392, 88]);
  for (const [gx, gy] of gulls) {
    ctx.beginPath(); ctx.moveTo(gx - 12, gy); ctx.quadraticCurveTo(gx - 4, gy - 8, gx, gy);
    ctx.quadraticCurveTo(gx + 4, gy - 8, gx + 12, gy); ctx.stroke();
  }
  // Crates (h4: one crate missing on the right)
  ctx.fillStyle = '#c98f3d'; ctx.fillRect(180, 330, 30, 30); ctx.fillRect(212, 330, 30, 30);
  if (!applied.has('h4')) { ctx.fillStyle = '#b57a2e'; ctx.fillRect(196, 300, 30, 30); }
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 2;
  ctx.strokeRect(180, 330, 30, 30); ctx.strokeRect(212, 330, 30, 30);
  if (!applied.has('h4')) ctx.strokeRect(196, 300, 30, 30);
  // Buoy (h5: stripe orange left, teal right)
  ctx.fillStyle = '#e4572e'; circle(ctx, 520, 340, 18);
  ctx.fillStyle = applied.has('h5') ? '#2ec4b6' : '#ffd93b'; ctx.fillRect(502, 334, 36, 10);
  ctx.fillStyle = '#2b2b2b'; ctx.fillRect(518, 314, 4, 12);
  // Rope coil
  ctx.strokeStyle = '#d9b380'; ctx.lineWidth = 5;
  circle(ctx, 120, 392, 16); ctx.strokeStyle = '#b98d54';
  ctx.beginPath(); ctx.arc(120, 392, 10, 0, Math.PI * 2); ctx.stroke();
}

// ---------------------------------------------------------------- Level 3: Cozy Kitchen
function drawKitchen(ctx, applied) {
  ctx.fillStyle = '#ffe8c2'; ctx.fillRect(0, 0, 600, 440);
  ctx.fillStyle = '#f7d9a0'; ctx.fillRect(0, 320, 600, 120);
  // Window with curtains
  ctx.fillStyle = '#bfe8ff'; ctx.fillRect(90, 70, 130, 130);
  ctx.fillStyle = '#ffd93b'; circle(ctx, 185, 105, 18);
  ctx.fillStyle = '#7ec850'; poly(ctx, [[100, 200], [130, 160], [160, 200]]);
  ctx.fillStyle = '#ff8fab';
  poly(ctx, [[78, 60], [108, 60], [100, 210], [82, 210]]);
  poly(ctx, [[212, 60], [242, 60], [238, 210], [220, 210]]);
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 4; ctx.strokeRect(90, 70, 130, 130);
  ctx.beginPath(); ctx.moveTo(155, 70); ctx.lineTo(155, 200); ctx.moveTo(90, 135); ctx.lineTo(220, 135); ctx.stroke();
  // Wall clock (k1: 3:00 left, 4:30 right)
  ctx.fillStyle = '#ffffff'; circle(ctx, 480, 110, 34);
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(480, 110, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(480, 110);
  if (applied.has('k1')) { ctx.lineTo(480, 132); } else { ctx.lineTo(480, 88); }
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(480, 110);
  if (applied.has('k1')) { ctx.lineTo(462, 110); } else { ctx.lineTo(500, 110); }
  ctx.stroke();
  // Shelf with jars
  ctx.fillStyle = '#a06a35'; ctx.fillRect(360, 170, 180, 10);
  ctx.fillStyle = '#bfe8ff'; rr(ctx, 375, 120, 34, 50, 6);
  ctx.fillStyle = '#ffd93b'; rr(ctx, 420, 120, 34, 50, 6);
  ctx.fillStyle = '#ff8fab'; rr(ctx, 465, 120, 34, 50, 6);
  ctx.fillStyle = applied.has('k4') ? '#2ec4b6' : '#e4572e';
  ctx.fillRect(465, 138, 34, 14);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(375, 138, 34, 14); ctx.fillRect(420, 138, 34, 14);
  // Table
  ctx.fillStyle = '#a06a35'; ctx.fillRect(60, 310, 480, 16);
  ctx.fillStyle = '#8d5a2b'; ctx.fillRect(90, 326, 14, 90); ctx.fillRect(496, 326, 14, 90);
  // Teapot (k2: steam left, none right)
  ctx.fillStyle = '#7b61ff'; ellipse(ctx, 280, 285, 42, 28);
  ctx.fillStyle = '#7b61ff'; circle(ctx, 280, 252, 12);
  ctx.fillStyle = '#6a4fe0'; poly(ctx, [[238, 280], [214, 262], [220, 292]]);
  ctx.strokeStyle = '#6a4fe0'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(322, 282, 16, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  if (!applied.has('k2')) {
    ctx.strokeStyle = 'rgba(150,150,150,0.8)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(272, 238); ctx.quadraticCurveTo(264, 222, 272, 208); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(288, 238); ctx.quadraticCurveTo(296, 222, 288, 206); ctx.stroke();
  }
  // Fruit bowl (k3: one apple missing on the right)
  ctx.fillStyle = '#e4572e'; ellipse(ctx, 430, 305, 52, 14);
  ctx.fillStyle = '#e63946'; circle(ctx, 408, 292, 13); circle(ctx, 452, 292, 13);
  if (!applied.has('k3')) { ctx.fillStyle = '#e63946'; circle(ctx, 430, 284, 13); }
  ctx.fillStyle = '#43a047';
  ctx.beginPath(); ctx.moveTo(430, 272); ctx.quadraticCurveTo(442, 262, 448, 272); ctx.quadraticCurveTo(438, 278, 430, 272); ctx.fill();
  // Spoon on the table
  ctx.fillStyle = '#c0c0c0'; ellipse(ctx, 350, 306, 7, 12); ctx.fillRect(347, 306, 6, 22);
  // Cat on chair (k5: ear up left, flopped right)
  ctx.fillStyle = '#8d5a2b'; ctx.fillRect(96, 300, 60, 12); ctx.fillRect(102, 312, 10, 60); ctx.fillRect(140, 312, 10, 60);
  ctx.fillStyle = '#ff9f43'; ellipse(ctx, 126, 288, 24, 16);
  circle(ctx, 106, 268, 13);
  poly(ctx, [[96, 258], [100, 246], [106, 256]]);
  if (applied.has('k5')) { poly(ctx, [[112, 256], [122, 260], [114, 268]]); }
  else { poly(ctx, [[110, 258], [116, 246], [118, 258]]); }
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 101, 266, 2); circle(ctx, 111, 266, 2);
  // Rug (k6: stripe red left, teal right)
  ctx.fillStyle = '#ff8fab'; rr(ctx, 240, 392, 220, 34, 8);
  ctx.fillStyle = applied.has('k6') ? '#2ec4b6' : '#e4572e';
  ctx.fillRect(240, 402, 220, 10);
}

// ---------------------------------------------------------------- Level 4: Space Station
function drawSpace(ctx, applied) {
  ctx.fillStyle = '#0b1030'; ctx.fillRect(0, 0, 600, 440);
  // Stars (s2: one extra star on the right)
  ctx.fillStyle = '#ffffff';
  const stars = [[60, 60], [140, 40], [220, 90], [320, 50], [420, 70], [500, 40], [560, 130],
    [80, 160], [180, 140], [280, 130], [380, 150], [540, 200], [40, 260], [150, 220], [560, 300]];
  if (applied.has('s2')) stars.push([118, 84]);
  for (const [sx, sy] of stars) { circle(ctx, sx, sy, 2.5); }
  ctx.fillStyle = '#ffe66d';
  circle(ctx, 320, 50, 3.5); circle(ctx, 500, 40, 3.5); circle(ctx, 80, 160, 3.5);
  // Planet with ring (s1: ring present left, gone right)
  ctx.fillStyle = '#e4572e'; circle(ctx, 450, 110, 42);
  ctx.fillStyle = '#ff8a5c'; circle(ctx, 436, 96, 14); circle(ctx, 462, 122, 9);
  if (!applied.has('s1')) {
    ctx.strokeStyle = '#ffd93b'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(450, 110, 66, 16, -0.35, 0, Math.PI * 2); ctx.stroke();
  }
  // Moon
  ctx.fillStyle = '#d9d9d9'; circle(ctx, 80, 320, 26);
  ctx.fillStyle = '#bdbdbd'; circle(ctx, 72, 314, 5); circle(ctx, 88, 326, 4);
  // Astronaut (s3: visor blue left, gold right)
  ctx.fillStyle = '#f5f0e6';
  ellipse(ctx, 200, 280, 30, 36); // body
  circle(ctx, 200, 226, 22); // helmet
  ctx.fillStyle = applied.has('s3') ? '#ffd93b' : '#4fc3f7';
  ellipse(ctx, 200, 226, 15, 12); // visor
  ctx.strokeStyle = '#f5f0e6'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(172, 268); ctx.lineTo(150, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(228, 268); ctx.lineTo(250, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(184, 314); ctx.lineTo(176, 340); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(216, 314); ctx.lineTo(224, 340); ctx.stroke();
  ctx.fillStyle = '#e4572e'; ctx.fillRect(192, 272, 16, 10);
  // Rocket (s4: flame present left, gone right)
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath(); ctx.moveTo(350, 250); ctx.quadraticCurveTo(330, 300, 332, 340);
  ctx.lineTo(368, 340); ctx.quadraticCurveTo(370, 300, 350, 250); ctx.fill();
  ctx.fillStyle = '#e4572e'; poly(ctx, [[350, 250], [336, 278], [350, 272]]);
  ctx.fillStyle = '#e4572e'; poly(ctx, [[332, 340], [318, 362], [334, 348]]);
  ctx.fillStyle = '#e4572e'; poly(ctx, [[368, 340], [382, 362], [366, 348]]);
  ctx.fillStyle = '#4fc3f7'; circle(ctx, 350, 300, 10);
  if (!applied.has('s4')) {
    ctx.fillStyle = '#ffb703';
    poly(ctx, [[340, 342], [350, 384], [360, 342]]);
    ctx.fillStyle = '#ffe66d'; poly(ctx, [[344, 342], [350, 368], [356, 342]]);
  }
  // Satellite (s5: dish tilted up left, down right)
  ctx.fillStyle = '#c0c0c0'; ctx.fillRect(500, 210, 44, 18);
  ctx.fillStyle = '#7b61ff'; ctx.fillRect(478, 214, 20, 10); ctx.fillRect(546, 214, 20, 10);
  ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(522, 210); ctx.lineTo(522, 190); ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath(); ctx.arc(522, 188, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0b1030';
  if (applied.has('s5')) { ctx.beginPath(); ctx.arc(522, 200, 10, 0, Math.PI); ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(522, 176, 10, Math.PI, 0); ctx.fill(); }
  // Control panel (s6: one light red left, green right)
  ctx.fillStyle = '#3a3f5c'; rr(ctx, 200, 388, 200, 36, 8);
  ctx.fillStyle = '#4fc3f7'; circle(ctx, 230, 406, 6); circle(ctx, 260, 406, 6);
  ctx.fillStyle = applied.has('s6') ? '#43a047' : '#e63946'; circle(ctx, 290, 406, 6);
  ctx.fillStyle = '#ffe66d'; circle(ctx, 320, 406, 6);
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 2;
  ctx.strokeRect(345, 398, 40, 16);
  // Alien plant (s7: three leaves left, two right)
  ctx.fillStyle = '#7b61ff'; ctx.fillRect(86, 380, 8, 40);
  ctx.fillStyle = '#43d17c';
  ctx.beginPath(); ctx.ellipse(80, 372, 16, 7, -0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(102, 366, 16, 7, 0.6, 0, Math.PI * 2); ctx.fill();
  if (!applied.has('s7')) { ctx.beginPath(); ctx.ellipse(90, 352, 8, 16, 0, 0, Math.PI * 2); ctx.fill(); }
}

// ---------------------------------------------------------------- Level 5: Winter Market
function drawMarket(ctx, applied) {
  sky(ctx, '#2b3a67', '#7b8fc4');
  ctx.fillStyle = '#ffffff';
  const flakes = [[40, 60], [120, 100], [200, 50], [300, 90], [380, 50], [460, 90], [540, 60],
    [90, 180], [180, 150], [280, 170], [420, 150], [520, 210], [60, 260], [560, 280]];
  if (applied.has('w5')) flakes.push([252, 88]);
  for (const [fx, fy] of flakes) {
    ctx.beginPath(); ctx.moveTo(fx - 5, fy); ctx.lineTo(fx + 5, fy); ctx.moveTo(fx, fy - 5); ctx.lineTo(fx, fy + 5); ctx.stroke();
  }
  ctx.fillStyle = '#eef3ff'; ctx.fillRect(0, 380, 600, 60);
  // String lights
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 30); ctx.quadraticCurveTo(300, 90, 600, 30); ctx.stroke();
  const bulbColors = ['#ffd93b', '#ff6b6b', '#2ec4b6', '#ff8fab'];
  for (let i = 0; i < 12; i++) {
    const t = i / 11, bx = 20 + t * 560;
    const by = 30 + Math.sin(t * Math.PI) * 0 + (1 - Math.pow(2 * t - 1, 2)) * 42;
    ctx.fillStyle = bulbColors[i % 4]; circle(ctx, bx, by + 8, 7);
  }
  // Stall 1 (left): cocoa stand with chimney (w7: smoke left, none right)
  ctx.fillStyle = '#8d5a2b'; ctx.fillRect(300, 260, 120, 90);
  ctx.fillStyle = '#e4572e'; poly(ctx, [[290, 262], [360, 210], [430, 262]]);
  ctx.fillStyle = '#ffe8c2'; ctx.fillRect(310, 270, 100, 34);
  ctx.fillStyle = '#2b2b2b'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('COCOA', 360, 292);
  ctx.fillStyle = '#7a4a21'; ctx.fillRect(330, 310, 12, 40); ctx.fillRect(390, 310, 12, 40);
  ctx.fillStyle = '#6b4a2b'; ctx.fillRect(396, 210, 18, 52);
  if (!applied.has('w7')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 405, 196, 9); circle(ctx, 412, 182, 12); circle(ctx, 404, 166, 14);
  }
  // Stall 2 (right): gift stall (w4: star sign left, plain right)
  ctx.fillStyle = '#2ec4b6'; ctx.fillRect(470, 270, 110, 80);
  ctx.fillStyle = '#ff8fab'; poly(ctx, [[462, 272], [525, 224], [588, 272]]);
  ctx.fillStyle = '#ffe8c2'; ctx.fillRect(480, 280, 90, 30);
  if (!applied.has('w4')) {
    ctx.fillStyle = '#ffd93b';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(525 + Math.cos(a) * 11, 295 + Math.sin(a) * 11);
      ctx.lineTo(525 + Math.cos(a2) * 5, 295 + Math.sin(a2) * 5);
    }
    ctx.closePath(); ctx.fill();
  }
  // Snowman (w1: hat left, none right; w6: scarf red left, teal right)
  ctx.fillStyle = '#ffffff';
  circle(ctx, 150, 352, 40); circle(ctx, 150, 292, 30); circle(ctx, 150, 244, 22);
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 142, 240, 3); circle(ctx, 158, 240, 3);
  ctx.fillStyle = '#ff8c42'; poly(ctx, [[150, 246], [176, 250], [150, 254]]);
  ctx.fillStyle = '#2b2b2b';
  circle(ctx, 150, 288, 3); circle(ctx, 150, 304, 3); circle(ctx, 150, 344, 3); circle(ctx, 150, 360, 3);
  ctx.strokeStyle = '#7a4a21'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(122, 292); ctx.lineTo(96, 272); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(178, 292); ctx.lineTo(204, 272); ctx.stroke();
  if (!applied.has('w1')) {
    ctx.fillStyle = '#2b2b2b'; ctx.fillRect(132, 214, 36, 16); ctx.fillRect(128, 228, 44, 6);
  }
  ctx.fillStyle = applied.has('w6') ? '#2ec4b6' : '#e4572e';
  ctx.fillRect(128, 262, 44, 10); ctx.fillRect(160, 262, 10, 26);
  // Gifts pile (w3: bow red left, gold right)
  ctx.fillStyle = '#7b61ff'; ctx.fillRect(430, 352, 40, 28);
  ctx.fillStyle = '#ff8fab'; ctx.fillRect(472, 358, 36, 22);
  ctx.fillStyle = applied.has('w3') ? '#ffd93b' : '#e4572e';
  circle(ctx, 450, 350, 7); circle(ctx, 450, 350, 7);
  ctx.fillRect(447, 352, 6, 28);
  ctx.fillStyle = '#ffd93b'; circle(ctx, 490, 356, 6);
  // Lantern (w2: lit warm left, dark right)
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(520, 60); ctx.lineTo(520, 120); ctx.stroke();
  ctx.fillStyle = applied.has('w2') ? '#5a5a5a' : '#ffd93b';
  rr(ctx, 505, 120, 30, 38, 6);
  ctx.fillStyle = '#2b2b2b'; ctx.fillRect(502, 114, 36, 6); ctx.fillRect(502, 158, 36, 6);
  if (!applied.has('w2')) {
    ctx.fillStyle = 'rgba(255,217,59,0.25)'; circle(ctx, 520, 139, 30);
  }
}

// ---------------------------------------------------------------- Level 6: Jungle Temple
function drawTemple(ctx, applied) {
  sky(ctx, '#2f7d4f', '#a8d08d');
  ctx.fillStyle = '#1e5c33'; // jungle back wall
  ctx.beginPath(); ctx.moveTo(0, 120); ctx.quadraticCurveTo(150, 60, 300, 110);
  ctx.quadraticCurveTo(450, 150, 600, 90); ctx.lineTo(600, 440); ctx.lineTo(0, 440); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a6d4b'; ctx.fillRect(0, 400, 600, 40);
  // Temple
  ctx.fillStyle = '#c9b18a'; ctx.fillRect(220, 180, 160, 200);
  ctx.fillStyle = '#b39b72'; ctx.fillRect(200, 160, 200, 22);
  ctx.fillStyle = '#b39b72'; ctx.fillRect(210, 140, 180, 22);
  ctx.fillStyle = '#8a6d4b'; ctx.fillRect(260, 300, 80, 80);
  ctx.fillStyle = '#3a2c18'; ctx.fillRect(280, 320, 40, 60);
  ctx.strokeStyle = '#8a6d4b'; ctx.lineWidth = 3;
  ctx.strokeRect(232, 200, 40, 50); ctx.strokeRect(328, 200, 40, 50);
  // Stone crack (j7: crack present left, gone right)
  if (!applied.has('j7')) {
    ctx.strokeStyle = '#6b5636'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(300, 380); ctx.lineTo(292, 396); ctx.lineTo(306, 408); ctx.lineTo(296, 420); ctx.stroke();
  }
  // Idol (j3: forehead gem present left, gone right)
  ctx.fillStyle = '#ffd93b';
  poly(ctx, [[292, 210], [308, 210], [300, 240]]);
  ctx.fillStyle = '#e8b800'; circle(ctx, 300, 226, 4);
  if (!applied.has('j3')) { ctx.fillStyle = '#2ec4b6'; circle(ctx, 300, 200, 7); }
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 292, 222, 2); circle(ctx, 308, 222, 2);
  // Waterfall (j5: flow lines left, still right)
  ctx.fillStyle = '#bfe8ff';
  ctx.beginPath(); ctx.moveTo(470, 130); ctx.lineTo(500, 130); ctx.lineTo(496, 330); ctx.lineTo(474, 330); ctx.closePath(); ctx.fill();
  if (!applied.has('j5')) {
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(480, 150); ctx.lineTo(480, 310); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(492, 150); ctx.lineTo(492, 310); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(191,232,255,0.8)'; ellipse(ctx, 485, 345, 46, 12);
  // Torches (j1: left flame left, gone right; j8: right flame tall left, short right)
  for (const [tx, big] of [[120, 'j1'], [480, 'j8']]) {
    ctx.fillStyle = '#7a4a21'; ctx.fillRect(tx - 4, 240, 8, 90);
    ctx.fillStyle = '#8d5a2b'; ctx.fillRect(tx - 10, 232, 20, 12);
    const show = big === 'j1' ? !applied.has('j1') : true;
    if (show) {
      const h = big === 'j8' && applied.has('j8') ? 14 : 26;
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath(); ctx.ellipse(tx, 222 - (26 - h) / 2, 10, h, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd93b';
      ctx.beginPath(); ctx.ellipse(tx, 226 - (26 - h) / 2, 5, h * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Vines with flower (j4: flower present left, gone right)
  ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(400, 60); ctx.quadraticCurveTo(430, 110, 410, 160); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(430, 60); ctx.quadraticCurveTo(400, 100, 440, 140); ctx.stroke();
  if (!applied.has('j4')) flower(ctx, 424, 118, '#ff8fab', '#ffd93b');
  // Monkey (j2: tail curled left, straight down right)
  ctx.fillStyle = '#8d5a2b';
  ellipse(ctx, 180, 320, 24, 20);
  circle(ctx, 162, 296, 14);
  circle(ctx, 152, 286, 5); circle(ctx, 172, 286, 5);
  ctx.fillStyle = '#d9b380'; ellipse(ctx, 162, 300, 9, 7);
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 158, 294, 2); circle(ctx, 166, 294, 2);
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(202, 322);
  if (applied.has('j2')) { ctx.lineTo(214, 352); } else { ctx.quadraticCurveTo(224, 318, 216, 298); }
  ctx.stroke();
  // Parrot (j6: wing green left, red right)
  ctx.fillStyle = '#e63946'; ellipse(ctx, 520, 122, 20, 13);
  ctx.fillStyle = applied.has('j6') ? '#e63946' : '#43a047';
  ctx.beginPath(); ctx.ellipse(516, 124, 12, 7, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e63946'; circle(ctx, 538, 112, 9);
  ctx.fillStyle = '#ffd93b'; poly(ctx, [[546, 112], [556, 116], [546, 118]]);
  ctx.fillStyle = '#2b2b2b'; circle(ctx, 540, 110, 2);
  ctx.strokeStyle = '#7a4a21'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(480, 150); ctx.lineTo(560, 140); ctx.stroke();
  // Jungle flowers on the ground
  flower(ctx, 60, 398, '#ff8fab', '#ffd93b');
  flower(ctx, 560, 398, '#e63946', '#ffd93b');
  flower(ctx, 340, 404, '#ff8fab', '#ffd93b');
}

// ------------------------------------------------------------------ dispatcher
const SCENE_DRAW = [drawGarden, drawHarbor, drawKitchen, drawSpace, drawMarket, drawTemple];

/** Draw level `index` (0-based) onto `ctx`. `applied` holds the ids of the
 *  differences switched on for this panel (empty = left panel, all = right). */
export function drawScene(ctx, index, applied) {
  ctx.save();
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  SCENE_DRAW[index](ctx, applied);
  ctx.restore();
}
