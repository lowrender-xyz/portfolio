// Modos interativos da abertura (com estado, ao contrário da montagem do nome, que é função do tempo):
//  - "fall": as partículas explodem, caem com gravidade e se empilham no chão da moldura
//  - "planet": viram um planeta com faixas e anéis, e o ponto azul vira uma lua em órbita
// Cada ponto guarda posição livre (fx, fy) e velocidade (vx, vy). O chão é um mapa de alturas por coluna,
// barato o bastante para milhares de pontos.
import { clamp, easeInOut } from "./motion.js";

const C = { ink: "#07080b", line: "#1c2029", paper: "#eceef2", volt: "#3d7bff" };
const GRAVITY = 2400; // px/s²
const FRAME = 14; // a moldura da abertura (inset em px): o chão do site

export function drawBackdrop(ctx, S, dpr) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, S.W, S.H);
  ctx.fillStyle = C.line;
  const g = S.step * 3;
  for (let y = g / 2; y < S.H; y += g) for (let x = g / 2; x < S.W; x += g) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
}

// ── gravidade ───────────────────────────────────────────────────────────────
export function startFall(S) {
  const cx = S.box.x + S.box.w / 2, cy = S.box.y + S.box.h / 2;
  S.cols = new Int16Array(Math.ceil(S.W / S.step) + 2);
  for (const p of S.pts) {
    p.fx = p.cx ?? p.x;
    p.fy = p.cy ?? p.y;
    // explosão a partir do centro do nome, mais forte para cima
    const dx = p.fx - cx, dy = p.fy - cy, d = Math.hypot(dx, dy) || 1;
    const f = 250 + Math.random() * 650;
    p.vx = (dx / d) * f * 0.9 + (Math.random() - 0.5) * 200;
    p.vy = (dy / d) * f * 0.6 - 300 - Math.random() * 500;
    p.settled = false;
  }
}

function stepFall(S, dt) {
  const { step, W, H, cols } = S;
  const floor = H - FRAME - 1;
  for (const p of S.pts) {
    if (p.settled) continue;
    p.vy += GRAVITY * dt;
    p.fx += p.vx * dt;
    p.fy += p.vy * dt;
    // paredes da moldura
    if (p.fx < FRAME + p.r) (p.fx = FRAME + p.r, (p.vx *= -0.5));
    if (p.fx > W - FRAME - p.r) (p.fx = W - FRAME - p.r, (p.vx *= -0.5));
    const c = clamp(Math.floor(p.fx / step), 0, cols.length - 1);
    const ground = floor - cols[c] * step - p.r;
    if (p.fy < ground) continue;
    p.fy = ground;
    if (p.vy > 420) {
      // quica, perdendo energia
      p.vy *= -0.32;
      p.vx *= 0.75;
      continue;
    }
    // escorrega para a coluna vizinha mais baixa, como areia
    const l = c > 0 ? cols[c - 1] : 1e9, r = c < cols.length - 1 ? cols[c + 1] : 1e9;
    if (Math.min(l, r) < cols[c] - 1) {
      const to = l < r ? c - 1 : c + 1;
      p.fx = to * step + step / 2;
      p.vy = 60;
      p.vx = 0;
      continue;
    }
    cols[c]++;
    p.fx = c * step + step / 2;
    p.settled = true;
  }
}

// ── planeta ─────────────────────────────────────────────────────────────────
export function startPlanet(S) {
  const body = S.pts.filter((p) => !p.dot), moon = S.pts.filter((p) => p.dot);
  const nRing = Math.floor(body.length * 0.32), nSphere = body.length - nRing;
  const golden = Math.PI * (3 - Math.sqrt(5));
  body.forEach((p, i) => {
    p.fx = p.cx ?? p.fx ?? p.x;
    p.fy = p.cy ?? p.fy ?? p.y;
    p.speed = 2.2 + Math.random() * 2.4;
    if (i < nSphere) {
      // pontos espalhados por igual na esfera (espiral de Fibonacci)
      const y = 1 - (i / (nSphere - 1)) * 2;
      p.kind = "sphere";
      p.lat = Math.asin(y);
      p.lon = i * golden;
    } else {
      const k = i - nSphere;
      p.kind = "ring";
      p.ang = (k / nRing) * Math.PI * 2 * 7.3;
      // dois anéis com uma divisão no meio, como os de Saturno
      const u = (k * 0.618) % 1;
      p.rad = u < 0.62 ? 1.35 + u * 0.55 : 1.78 + (u - 0.62) * 0.5;
    }
  });
  const golden2 = Math.PI * (3 - Math.sqrt(5));
  moon.forEach((p, i) => {
    p.fx = p.cx ?? p.fx ?? p.x;
    p.fy = p.cy ?? p.fy ?? p.y;
    p.speed = 3;
    p.kind = "moon";
    const y = 1 - (i / Math.max(1, moon.length - 1)) * 2;
    p.lat = Math.asin(y);
    p.lon = i * golden2;
  });
}

function planetTargets(S, t) {
  const R = Math.min(S.W, S.H) * (S.mobile ? 0.3 : 0.22);
  const cx = S.W / 2, cy = S.H * 0.5;
  const rot = t * 0.35, tilt = 0.42;
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const orbit = t * 0.7, mr = R * 0.16;
  const mx3 = Math.cos(orbit) * R * 2.45, mz3 = Math.sin(orbit) * R * 2.45;
  const moon = { x: cx + mx3, y: cy - (-mz3 * st), z: mz3 * ct };
  for (const p of S.pts) {
    let x3, y3, z3, scale = R;
    if (p.kind === "sphere" || p.kind === "moon") {
      const lon = p.lon + (p.kind === "moon" ? t * 0.8 : rot);
      x3 = Math.cos(p.lat) * Math.cos(lon);
      y3 = Math.sin(p.lat);
      z3 = Math.cos(p.lat) * Math.sin(lon);
      if (p.kind === "moon") scale = mr;
    } else {
      const a = p.ang + rot * 0.55;
      x3 = Math.cos(a) * p.rad;
      y3 = 0;
      z3 = Math.sin(a) * p.rad;
    }
    // inclina o conjunto em torno do eixo X
    const y2 = y3 * ct - z3 * st, z2 = y3 * st + z3 * ct;
    if (p.kind === "moon") {
      p.tx = moon.x + x3 * scale;
      p.ty = moon.y - y2 * scale;
      p.tz = moon.z / R + z2 * 0.1;
    } else {
      p.tx = cx + x3 * scale;
      p.ty = cy - y2 * scale;
      p.tz = z2;
    }
    // atrás do planeta: anel e lua somem dentro do disco
    const behind = p.kind !== "sphere" && p.tz < 0 && Math.hypot(p.tx - cx, p.ty - cy) < R * 0.98;
    p.hide = behind;
    // faixas de Júpiter: o brilho varia com a latitude
    p.band = p.kind === "sphere" ? 0.55 + 0.45 * Math.sin(p.lat * 11 + 0.6) : 1;
  }
}

// ── quadro ──────────────────────────────────────────────────────────────────
export function drawPlay(ctx, S, mode, t, dt, { dpr = 1, exit = 0 } = {}) {
  dt = Math.min(dt, 1 / 30);
  if (mode === "fall") stepFall(S, dt);
  else if (mode === "planet") {
    planetTargets(S, t);
    for (const p of S.pts) {
      const k = 1 - Math.exp(-dt * p.speed);
      p.fx += (p.tx - p.fx) * k;
      p.fy += (p.ty - p.fy) * k;
    }
  }
  drawBackdrop(ctx, S, dpr);
  const ex = easeInOut(clamp(exit));
  // planeta: desenha o que está atrás primeiro
  const passes = mode === "planet" ? [(p) => p.tz < 0, (p) => p.tz >= 0] : [() => true];
  for (const pass of passes) {
    for (const p of S.pts) {
      if (!pass(p) || (mode === "planet" && p.hide)) continue;
      let r = p.r, a = 1;
      if (mode === "planet") {
        const depth = (p.tz + 1) / 2;
        r = p.r * (p.kind === "ring" ? 0.55 : 0.5 + 0.55 * depth);
        a = (p.kind === "sphere" ? p.band : 0.9) * (0.25 + 0.75 * clamp(depth));
      }
      ctx.globalAlpha = a * (1 - ex * 0.6);
      ctx.fillStyle = p.dot ? C.volt : C.paper;
      ctx.beginPath();
      ctx.arc(p.fx, p.fy, Math.max(0.5, r * (1 - ex * 0.7)), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  // saída: o azul cobre a tela a partir do centro
  if (ex > 0) {
    const R = Math.hypot(S.W, S.H) * easeInOut(clamp((exit - 0.2) / 0.8));
    ctx.fillStyle = C.volt;
    ctx.beginPath();
    ctx.arc(S.W / 2, S.H / 2, R, 0, Math.PI * 2);
    ctx.fill();
  }
}

// volta ao nome: a montagem recomeça a partir de onde cada ponto está
export function backToName(S, t0) {
  for (const p of S.pts) {
    p.sx = p.fx ?? p.x;
    p.sy = p.fy ?? p.y;
    p.delay = Math.random() * 0.3 + (p.x / S.W) * 0.35;
  }
  S.t0 = t0;
  S.lockAt = 0.9;
}

// o clique caiu no nome? (retângulo do texto com folga)
export const hitName = (S, x, y) =>
  x > S.box.x - 30 && x < S.box.x + S.box.w + 30 && y > S.box.y - 30 && y < S.box.y + S.box.h + 30;
