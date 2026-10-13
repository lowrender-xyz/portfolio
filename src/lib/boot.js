// Abertura: pontos espalhados convergem e formam "sorry." (a mesma trama de pontos do "S" da landing).
// drawBoot(ctx, scene, t, extra) pinta o quadro t sem estado acumulado: a montagem (0 → INTRO s) é função
// pura do tempo; depois dela os pontos "respiram" e fogem do ponteiro, e a saída (exit 0 → 1) os espalha.
import { clamp, spring, mulberry32, easeInOut } from "./motion.js";
import { DEFAULT_FONT, fontString } from "./bootFonts.js";

export const INTRO = 3.6; // segundos até o "sorry." estar montado e a mira travada

const C = { ink: "#07080b", line: "#1c2029", paper: "#eceef2", mute: "#7a8394", volt: "#3d7bff" };

// amostra o texto numa grade e devolve os pontos (alvo, origem espalhada, atraso)
export function buildScene(W, H, font = DEFAULT_FONT) {
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const o = off.getContext("2d");
  const mobile = W / H < 1.1;
  let fs = (mobile ? W * 0.36 : Math.min(W * 0.26, H * 0.5)) * (font.scale ?? 1);
  o.font = fontString(font, fs);
  const body = "sorry", dot = ".";
  // a palavra inteira (com o ponto) cabe em 84% da largura, com folga para a mira
  const fit = (W * (mobile ? 0.8 : 0.84)) / o.measureText(body + dot).width;
  if (fit < 1) {
    fs *= fit;
    o.font = fontString(font, fs);
  }
  const wBody = o.measureText(body).width, wDot = o.measureText(dot).width;
  const x0 = (W - (wBody + wDot)) / 2;
  const y0 = H * (mobile ? 0.5 : 0.56);
  o.fillStyle = "#fff";
  o.fillText(body, x0, y0);
  const a = o.getImageData(0, 0, W, H).data;
  o.clearRect(0, 0, W, H);
  o.fillText(dot, x0 + wBody, y0);
  const b = o.getImageData(0, 0, W, H).data;

  const step = mobile ? 4 : Math.max(6, Math.round(Math.min(W, H * 1.6) / 130));
  const rnd = mulberry32(11);
  const pts = [];
  let dotCx = 0, dotCy = 0, dotN = 0, minY = H, maxY = 0;
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const i = (Math.floor(y) * W + Math.floor(x)) * 4 + 3;
      const isBody = a[i] > 128, isDot = b[i] > 128;
      if (!isBody && !isDot) continue;
      const ang = rnd() * Math.PI * 2, dist = (0.55 + rnd() * 0.9) * Math.hypot(W, H) * 0.5;
      pts.push({
        x, y, dot: isDot,
        sx: W / 2 + Math.cos(ang) * dist, sy: H / 2 + Math.sin(ang) * dist,
        // varre da esquerda para a direita, com um pouco de acaso; o ponto final chega por último
        delay: 0.5 + (x / W) * 1.1 + rnd() * 0.35 + (isDot ? 0.35 : 0),
        r: step * 0.42,
        ph: rnd() * Math.PI * 2,
      });
      if (isDot) (dotCx += x, dotCy += y, dotN++);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  return {
    W, H, step, pts, mobile,
    dot: { x: dotCx / Math.max(1, dotN), y: dotCy / Math.max(1, dotN), r: wDot * 0.42 },
    box: { x: x0, y: minY, w: wBody + wDot, h: maxY - minY },
  };
}

// troca de fonte com a tela parada: a cena nova parte de onde os pontos da antiga estão, em ordem da
// esquerda para a direita, e chega em ~1 s; a mira trava de novo no ponto azul novo
export function morphScene(prev, next, t0) {
  const old = [...prev.pts].sort((a, b) => a.x - b.x || a.y - b.y);
  const rnd = mulberry32(next.pts.length);
  [...next.pts].sort((a, b) => a.x - b.x || a.y - b.y).forEach((p, j) => {
    const o = old[Math.floor((j / next.pts.length) * old.length)] ?? old[0];
    p.sx = o.x + (rnd() - 0.5) * 30;
    p.sy = o.y + (rnd() - 0.5) * 30;
    p.delay = (p.x / next.W) * 0.45 + rnd() * 0.25;
  });
  next.t0 = t0;
  next.lockAt = 0.9;
  return next;
}

export function drawBoot(ctx, S, t, { dpr = 1, pointer = null, exit = 0 } = {}) {
  const { W, H, pts, step } = S;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);

  // trama de fundo
  ctx.fillStyle = C.line;
  const g = step * 3;
  for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);

  const idle = Math.max(0, t - INTRO);
  const ex = easeInOut(clamp(exit));
  for (const p of pts) {
    const k = spring(t - (S.t0 ?? 0) - p.delay, 90, 13); // chega com um leve balanço
    let x = p.sx + (p.x - p.sx) * k, y = p.sy + (p.y - p.sy) * k;
    // parado: uma onda lenta atravessa a palavra
    const wave = idle > 0 ? Math.sin(p.x * 0.012 - idle * 2.2 + p.ph * 0.15) : 0;
    let r = p.r * clamp(k * 1.2) * (1 + wave * 0.18 * clamp(idle));
    // os pontos fogem do ponteiro
    if (pointer && idle > 0) {
      const dx = x - pointer.x, dy = y - pointer.y, d = Math.hypot(dx, dy), R = 120;
      if (d < R && d > 0.01) {
        const f = (1 - d / R) ** 2 * 26 * clamp(idle * 2);
        x += (dx / d) * f;
        y += (dy / d) * f;
      }
    }
    // saída: espalham-se a partir do ponto azul
    if (ex > 0) {
      const dx = p.x - S.dot.x, dy = p.y - S.dot.y, d = Math.hypot(dx, dy) || 1;
      x += (dx / d) * ex * (300 + p.ph * 60);
      y += (dy / d) * ex * (300 + p.ph * 60);
      r *= 1 - ex * 0.7;
    }
    if (r < 0.3) continue;
    ctx.globalAlpha = clamp(0.25 + k) * (1 - ex * 0.6);
    ctx.fillStyle = p.dot ? C.volt : C.paper;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // mira: quatro cantos que se fecham sobre o ponto azul
  const lock = spring(t - (S.t0 ?? 0) - (S.lockAt ?? 2.7), 170, 22);
  if (lock > 0.01 && ex < 1) {
    const { x, y, r } = S.dot;
    const s = r * (1.9 + (1 - lock) * 5), arm = r * 0.7;
    ctx.globalAlpha = clamp(lock * 1.4) * (1 - ex);
    ctx.strokeStyle = C.volt;
    ctx.lineWidth = 2;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cx = x + sx * s, cy = y + sy * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy - sy * arm);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - sx * arm, cy);
      ctx.stroke();
    }
    // linha de cota até a borda do texto (só onde cabe)
    if (!S.mobile) {
    ctx.strokeStyle = C.mute;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(x + s + 8, y);
    ctx.lineTo(x + s + 8 + 60 * lock, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = `500 11px "JetBrains Mono", monospace`;
    ctx.fillStyle = C.mute;
    ctx.textBaseline = "middle";
    ctx.fillText("■ 001", x + s + 76, y);
    }
    ctx.globalAlpha = 1;
  }

  // saída: o ponto azul cresce até cobrir a tela
  if (ex > 0) {
    const R = Math.hypot(W, H) * easeInOut(clamp((exit - 0.25) / 0.75));
    ctx.fillStyle = C.volt;
    ctx.beginPath();
    ctx.arc(S.dot.x, S.dot.y, Math.max(S.dot.r, R), 0, Math.PI * 2);
    ctx.fill();
  }
}
