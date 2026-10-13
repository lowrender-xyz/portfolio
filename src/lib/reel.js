// Showreel da abertura. drawReel(ctx, W, H, t) pinta o quadro t (0 ≤ t < LOOP) sem estado:
// pode ser chamado fora de ordem, congelado com ?t=… ou capturado quadro a quadro.
import { clamp, lerp, spring, track, easeInOut, easeOut, mulberry32, SNAPPY, DEFAULT, HEAVY } from "./motion.js";

export const TAKE = 3;
export const LOOP = TAKE * 4;

const C = {
  ink: "#07080B",
  panel: "#0E1015",
  line: "#1C2029",
  mute: "#7A8394",
  paper: "#ECEEF2",
  volt: "#3D7BFF",
};
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const DISPLAY = '"Space Grotesk", system-ui, sans-serif';

// Canvas ignora globalAlpha fora de 0..1 (mantém o anterior): sempre limitar.
const alpha = (ctx, a) => (ctx.globalAlpha = clamp(a));

function region(W, H) {
  if (W / H < 1.1) return { x: W * 0.06, y: H * 0.14, w: W * 0.88, h: H * 0.38 };
  return { x: W * 0.45, y: H * 0.19, w: W * 0.5, h: H * 0.54 };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// ── Take 1 · Código ─────────────────────────────────────────────────────────
const K = "k", S = "s", M = "m", P = "p", F = "f";
const CODE = [
  [["// pdv.ts · smart loja", M]],
  [["export async function ", K], ["finalizarVenda", F], ["(caixa, itens) {", P]],
  [["  if ", K], ["(!caixa.aberto) ", P], ["throw new ", K], ["Erro", F], ["(", P], ['"caixa fechado"', S], [")", P]],
  [["  const ", K], ["total = itens.", P], ["reduce", F], ["((s, i) => s + i.preco * i.qtd, 0)", P]],
  [["  await ", K], ["estoque.", P], ["baixar", F], ["(itens)  ", P], ["// tudo ou nada", M]],
  [["  return ", K], ["emitirNFCe", F], ["({ caixa, itens, total })", P]],
  [["}", P]],
];
const CODE_COLORS = { k: C.volt, s: "#9FB4D9", m: C.mute, p: C.paper, f: "#FFFFFF" };
const CPS = 118;

function takeCode(ctx, R, lt) {
  // o maior trecho de código precisa caber na largura do quadro
  let fs = Math.min(R.w / 42, R.h / 13);
  ctx.font = `400 ${fs}px ${MONO}`;
  const widest = Math.max(...CODE.map((l) => ctx.measureText(l.map((p) => p[0]).join("")).width));
  fs *= Math.min(1, (R.w - fs * 5.6) / widest);
  const lh = fs * 1.75;
  const pad = fs * 1.6;
  const open = spring(lt, ...DEFAULT);
  const fh = lerp(R.h * 0.5, R.h, open);
  const fy = R.y + (R.h - fh) / 2;

  ctx.fillStyle = C.panel;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, R.x, fy, R.w, fh, 10);
  ctx.fill();
  ctx.stroke();
  ctx.save();
  ctx.clip();

  // aba do arquivo
  ctx.font = `500 ${fs * 0.8}px ${MONO}`;
  ctx.fillStyle = C.mute;
  ctx.textBaseline = "middle";
  ctx.fillText("pdv.ts", R.x + pad, fy + fs * 1.4);
  ctx.fillStyle = C.volt;
  ctx.fillRect(R.x + pad, fy + fs * 2.3, ctx.measureText("pdv.ts").width, 2);
  ctx.fillStyle = C.line;
  ctx.fillRect(R.x, fy + fs * 2.3 + 2, R.w, 1);

  let budget = Math.floor(Math.max(0, lt - 0.25) * CPS);
  let cx = 0, cy = 0;
  ctx.font = `400 ${fs}px ${MONO}`;
  const x0 = R.x + pad + fs * 2.4;
  for (let i = 0; i < CODE.length; i++) {
    const y = fy + fs * 4.2 + i * lh;
    ctx.fillStyle = C.line;
    ctx.textAlign = "right";
    ctx.fillText(String(i + 1), x0 - fs * 1.1, y);
    ctx.textAlign = "left";
    if (budget <= 0) break;
    let x = x0;
    for (const [text, kind] of CODE[i]) {
      const part = text.slice(0, Math.max(0, budget));
      budget -= text.length;
      ctx.fillStyle = CODE_COLORS[kind];
      ctx.fillText(part, x, y);
      x += ctx.measureText(part).width;
      cx = x;
      cy = y;
      if (budget <= 0) break;
    }
  }
  if (cy === 0) {
    cx = x0;
    cy = fy + fs * 4.2;
  }
  // cursor pisca depois de terminar de digitar
  const done = budget > 0;
  if (!done || Math.floor(lt * 2.2) % 2 === 0) {
    ctx.fillStyle = C.volt;
    ctx.fillRect(cx + 2, cy - fs * 0.62, fs * 0.55, fs * 1.24);
  }
  ctx.restore();
}

// ── Take 2 · Design ─────────────────────────────────────────────────────────
function takeDesign(ctx, R, lt) {
  const u = Math.min(R.w / 16, R.h / 9);
  const AW = u * 15, AH = u * 8.4;
  const ax = R.x + (R.w - AW) / 2, ay = R.y + (R.h - AH) / 2;

  ctx.fillStyle = C.panel;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  roundRect(ctx, ax, ay, AW, AH, 6);
  ctx.fill();
  ctx.stroke();

  // camadas no grid de 12 colunas do artboard
  const g = AW / 12, m = u * 0.5;
  const layers = [
    { x: 0.5, y: 0.6, w: 6.5, h: 3.2, fill: "#151924", text: true },
    { x: 7.5, y: 0.6, w: 4, h: 5.2, fill: "#1A2030", img: true },
    { x: 0.5, y: 4.3, w: 2, h: 1.5, fill: "#151924" },
    { x: 2.7, y: 4.3, w: 2, h: 1.5, fill: "#151924" },
    { x: 4.9, y: 4.3, w: 2.1, h: 1.5, fill: C.volt },
  ];
  const rng = mulberry32(7);
  layers.forEach((L, i) => {
    const ox = (rng() - 0.5) * AW * 0.9, oy = (rng() - 0.5) * AH * 1.2, rot = (rng() - 0.5) * 0.5;
    const s = spring(lt - 0.12 - i * 0.13, ...DEFAULT);
    const x = ax + L.x * g + ox * (1 - s), y = ay + L.y * (AH / 7) + oy * (1 - s);
    const w = L.w * g, h = L.h * (AH / 7);
    ctx.save();
    alpha(ctx, s * 3);
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rot * (1 - s));
    ctx.fillStyle = L.fill;
    roundRect(ctx, -w / 2, -h / 2, w, h, 4);
    ctx.fill();
    if (L.text) {
      ctx.fillStyle = C.paper;
      ctx.font = `700 ${h * 0.42}px ${DISPLAY}`;
      ctx.textBaseline = "middle";
      ctx.fillText("sorry.", -w / 2 + m, -h * 0.08);
      ctx.fillStyle = C.mute;
      ctx.fillRect(-w / 2 + m, h * 0.24, w * 0.5, h * 0.05);
      ctx.fillRect(-w / 2 + m, h * 0.34, w * 0.34, h * 0.05);
    }
    if (L.img) {
      // "imagem": faixas diagonais finas
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.clip();
      ctx.strokeStyle = "#232B3F";
      ctx.lineWidth = 1;
      for (let k = -h; k < w + h; k += u * 0.35) {
        ctx.beginPath();
        ctx.moveTo(-w / 2 + k, -h / 2);
        ctx.lineTo(-w / 2 + k - h, h / 2);
        ctx.stroke();
      }
      ctx.fillStyle = C.volt;
      ctx.beginPath();
      ctx.arc(w * 0.12, -h * 0.12, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // guias de alinhamento aparecem quando as camadas encaixam
  const gA = spring(lt - 1.0, ...SNAPPY) * (1 - clamp((lt - 2.3) / 0.4));
  alpha(ctx, gA * 0.9);
  ctx.strokeStyle = C.volt;
  ctx.setLineDash([4, 4]);
  for (const gx of [0.5, 7, 7.5]) {
    ctx.beginPath();
    ctx.moveTo(ax + gx * g, ay - u * 0.6);
    ctx.lineTo(ax + gx * g, ay + AH + u * 0.6);
    ctx.stroke();
  }
  const hy = ay + 4.3 * (AH / 7);
  ctx.beginPath();
  ctx.moveTo(ax - u * 0.6, hy);
  ctx.lineTo(ax + AW + u * 0.6, hy);
  ctx.stroke();
  ctx.setLineDash([]);
  alpha(ctx, 1);

  // seleção na camada da imagem + cursor que a "pega"
  const sel = spring(lt - 1.45, ...SNAPPY);
  const L = layers[1];
  const sx = ax + L.x * g, sy = ay + L.y * (AH / 7), sw = L.w * g, sh = L.h * (AH / 7);
  alpha(ctx, sel);
  ctx.strokeStyle = C.volt;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx - 3, sy - 3, sw + 6, sh + 6);
  ctx.fillStyle = C.paper;
  for (const [hx, hy2] of [[sx - 3, sy - 3], [sx + sw + 3, sy - 3], [sx - 3, sy + sh + 3], [sx + sw + 3, sy + sh + 3]]) {
    ctx.fillRect(hx - 3.5, hy2 - 3.5, 7, 7);
    ctx.strokeRect(hx - 3.5, hy2 - 3.5, 7, 7);
  }
  ctx.font = `500 ${u * 0.32}px ${MONO}`;
  ctx.fillStyle = C.volt;
  ctx.textBaseline = "bottom";
  ctx.fillText(`${Math.round(sw)} × ${Math.round(sh)}`, sx, sy - u * 0.25);
  alpha(ctx, 1);

  const px = track(lt, [{ t: 0, v: ax + AW * 1.05 }, { t: 1.05, v: sx + sw + 3 }], DEFAULT);
  const py = track(lt, [{ t: 0, v: ay + AH * 1.1 }, { t: 1.05, v: sy + sh + 3 }], DEFAULT);
  drawPointer(ctx, px, py, u * 0.62, spring(lt - 0.6, ...SNAPPY));
}

function drawPointer(ctx, x, y, s, a) {
  alpha(ctx, a);
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s * 1.5);
  ctx.lineTo(s * 0.42, s * 1.12);
  ctx.lineTo(s * 0.72, s * 1.7);
  ctx.lineTo(s * 0.92, s * 1.6);
  ctx.lineTo(s * 0.64, s * 1.04);
  ctx.lineTo(s * 1.1, s * 1.04);
  ctx.closePath();
  ctx.fillStyle = C.paper;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  alpha(ctx, 1);
}

// ── Take 3 · Motion ─────────────────────────────────────────────────────────
const bez = (p0, p1, p2, p3, s) => {
  const i = 1 - s;
  return i * i * i * p0 + 3 * i * i * s * p1 + 3 * i * s * s * p2 + s * s * s * p3;
};
// cubic-bezier(.2,.8,.2,1): resolve x→s por bisseção (determinístico)
function bezierY(x) {
  let lo = 0, hi = 1;
  for (let k = 0; k < 24; k++) {
    const mid = (lo + hi) / 2;
    if (bez(0, 0.2, 0.2, 1, mid) < x) lo = mid;
    else hi = mid;
  }
  return bez(0, 0.8, 1, 1, (lo + hi) / 2);
}

function takeMotion(ctx, R, lt) {
  const u = Math.min(R.w / 16, R.h / 9);
  const gs = Math.min(R.h * 0.62, R.w * 0.38);
  const gx = R.x + u * 0.6, gy = R.y + u * 0.4;

  // gráfico da curva
  const open = spring(lt, ...DEFAULT);
  alpha(ctx, open);
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(gx, gy, gs, gs);
  for (let k = 1; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(gx + (gs * k) / 4, gy);
    ctx.lineTo(gx + (gs * k) / 4, gy + gs);
    ctx.moveTo(gx, gy + (gs * k) / 4);
    ctx.lineTo(gx + gs, gy + (gs * k) / 4);
    ctx.stroke();
  }
  const P = (x, y) => [gx + x * gs, gy + gs - y * gs];
  const draw = easeOut((lt - 0.2) / 0.9);
  const hA = spring(lt - 0.15, ...SNAPPY);
  // alças
  ctx.strokeStyle = C.mute;
  alpha(ctx, hA);
  const [a0x, a0y] = P(0, 0), [c1x, c1y] = P(0.2, 0.8), [c2x, c2y] = P(0.2, 1), [a1x, a1y] = P(1, 1);
  ctx.beginPath();
  ctx.moveTo(a0x, a0y);
  ctx.lineTo(lerp(a0x, c1x, hA), lerp(a0y, c1y, hA));
  ctx.moveTo(a1x, a1y);
  ctx.lineTo(lerp(a1x, c2x, hA), lerp(a1y, c2y, hA));
  ctx.stroke();
  ctx.fillStyle = C.volt;
  for (const [x, y] of [[lerp(a0x, c1x, hA), lerp(a0y, c1y, hA)], [lerp(a1x, c2x, hA), lerp(a1y, c2y, hA)]]) {
    ctx.beginPath();
    ctx.arc(x, y, u * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
  // curva
  alpha(ctx, 1);
  ctx.strokeStyle = C.paper;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const N = 80;
  for (let k = 0; k <= Math.floor(N * draw); k++) {
    const s = k / N;
    const [x, y] = P(bez(0, 0.2, 0.2, 1, s), bez(0, 0.8, 1, 1, s));
    k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.font = `500 ${u * 0.3}px ${MONO}`;
  ctx.fillStyle = C.mute;
  ctx.textBaseline = "top";
  alpha(ctx, open);
  ctx.fillText("cubic-bezier(.2, .8, .2, 1)", gx, gy + gs + u * 0.3);

  // objeto animado seguindo a curva, com rastro
  const tx = gx + gs + u * 1.2, tw = R.x + R.w - tx - u * 0.3;
  const prog = (x) => bezierY(clamp((x - 0.9) / 1.4));
  const rowY = gy + gs * 0.35;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(tx, rowY);
  ctx.lineTo(tx + tw, rowY);
  ctx.stroke();
  for (let k = 7; k >= 0; k--) {
    const p = prog(lt - k * 0.035);
    alpha(ctx, open * (k ? 0.08 + (7 - k) * 0.03 : 1));
    ctx.fillStyle = k ? C.volt : C.paper;
    roundRect(ctx, tx + p * (tw - u * 1.2), rowY - u * 0.6, u * 1.2, u * 1.2, u * 0.3);
    ctx.fill();
  }
  alpha(ctx, 1);

  // timeline com keyframes que estalam quando o playhead passa
  const tlY = gy + gs * 0.78, tlX = tx, tlW = tw;
  ctx.fillStyle = C.line;
  ctx.fillRect(tlX, tlY, tlW, 2);
  const head = clamp((lt - 0.4) / 2.2);
  const keys = [0.08, 0.3, 0.52, 0.7, 0.92];
  keys.forEach((kx) => {
    const pop = spring(lt - (0.4 + kx * 2.2), ...SNAPPY);
    const sz = u * (0.16 + 0.14 * pop);
    ctx.save();
    ctx.translate(tlX + kx * tlW, tlY + 1);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = pop > 0.02 ? C.volt : C.mute;
    ctx.fillRect(-sz, -sz, sz * 2, sz * 2);
    ctx.restore();
  });
  const hx = tlX + head * tlW;
  ctx.fillStyle = C.paper;
  ctx.fillRect(hx - 1, tlY - u * 0.6, 2, u * 1.2);
  const frame = Math.floor(head * 72);
  ctx.font = `500 ${u * 0.3}px ${MONO}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = C.mute;
  ctx.fillText(`00:00:${String(Math.floor(frame / 24)).padStart(2, "0")}:${String(frame % 24).padStart(2, "0")}`, tlX, tlY + u * 0.7);
}

// ── Take 4 · Produto ────────────────────────────────────────────────────────
const STATS = [
  { n: 80, label: { pt: "permissões", en: "permissions" } },
  { n: 5, label: { pt: "perfis de acesso", en: "access roles" } },
  { n: 44, label: { pt: "dígitos na chave da NF-e", en: "digits in the NF-e key" } },
];

function takeProduct(ctx, R, lt, mark, lang) {
  const u = Math.min(R.w / 16, R.h / 9);
  const s = spring(lt - 0.05, ...HEAVY);
  const size = u * 3.6;
  const mx = R.x + u * 0.6, my = R.y + R.h / 2 - size * 0.62;

  ctx.save();
  alpha(ctx, s * 1.4);
  ctx.translate(mx + size / 2, my + size / 2);
  ctx.scale(lerp(0.86, 1, s), lerp(0.86, 1, s));
  if (mark && mark.complete && mark.naturalWidth) ctx.drawImage(mark, -size / 2, -size / 2, size, size);
  ctx.restore();

  // nome
  const nameA = spring(lt - 0.35, ...HEAVY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(mx, my + size + u * 0.2, R.w, u * 1.6);
  ctx.clip();
  ctx.fillStyle = C.paper;
  ctx.font = `700 ${u * 0.95}px ${DISPLAY}`;
  ctx.textBaseline = "top";
  ctx.fillText("Smart Loja ERP", mx, my + size + u * 0.35 + (1 - nameA) * u * 1.4);
  ctx.restore();
  alpha(ctx, nameA);
  ctx.fillStyle = C.mute;
  ctx.font = `500 ${u * 0.32}px ${MONO}`;
  ctx.textBaseline = "top";
  ctx.fillText(lang === "pt" ? "SAAS MULTILOJA · PDV · FISCAL · ESTOQUE" : "MULTI-STORE SAAS · POS · TAX · STOCK", mx, my + size + u * 1.65);
  alpha(ctx, 1);

  // números rolando (quantizados por quadro: sem fantasma no motion blur)
  const colX = R.x + R.w * 0.56;
  STATS.forEach((st, i) => {
    const t0 = 0.55 + i * 0.22;
    const a = spring(lt - t0, ...DEFAULT);
    const q = Math.floor(lt * 60) / 60;
    const n = Math.round(st.n * easeOut((q - t0) / 0.9));
    const y = R.y + R.h * 0.18 + i * u * 2.2;
    alpha(ctx, a);
    ctx.fillStyle = C.line;
    ctx.fillRect(colX, y - u * 0.35, (R.x + R.w - colX) * a, 1);
    ctx.fillStyle = i === 0 ? C.volt : C.paper;
    ctx.font = `700 ${u * 1.15}px ${DISPLAY}`;
    ctx.textBaseline = "top";
    ctx.fillText(String(Math.max(0, n)), colX, y);
    ctx.fillStyle = C.mute;
    ctx.font = `500 ${u * 0.32}px ${MONO}`;
    ctx.fillText(st.label[lang].toUpperCase(), colX, y + u * 1.35);
  });
  alpha(ctx, 1);
}

// ── composição ──────────────────────────────────────────────────────────────
const TAKES = [takeCode, takeDesign, takeMotion, takeProduct];

export function drawReel(ctx, W, H, t, mark, lang = "pt", dpr = 1) {
  t = ((t % LOOP) + LOOP) % LOOP;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);
  const R = region(W, H);

  const i = Math.floor(t / TAKE);
  const lt = t - i * TAKE;
  // empurrão lento de câmera dentro do take
  const push = 1 + 0.035 * easeInOut(lt / TAKE);
  ctx.save();
  ctx.translate(R.x + R.w / 2, R.y + R.h / 2);
  ctx.scale(push, push);
  ctx.translate(-(R.x + R.w / 2), -(R.y + R.h / 2));
  TAKES[i](ctx, R, lt, mark, lang);
  ctx.restore();

  // obturador: uma faixa de tinta atravessa a região em cada corte (inclusive a emenda do loop)
  for (const b of [0, TAKE, TAKE * 2, TAKE * 3, LOOP]) {
    const p = (t - (b - 0.22)) / 0.44;
    if (p <= 0 || p >= 1) continue;
    const left = R.x - 20 + (R.w + 40) * easeInOut(clamp((p - 0.5) * 2));
    const right = R.x - 20 + (R.w + 40) * easeInOut(clamp(p * 2));
    ctx.fillStyle = C.ink;
    ctx.fillRect(left, R.y - 30, right - left, R.h + 60);
    ctx.fillStyle = C.volt;
    ctx.fillRect(p < 0.5 ? right - 2 : left, R.y - 30, 2, R.h + 60);
  }
}

export function timecode(t, fps = 24) {
  const f = Math.floor(t * fps);
  const p = (n) => String(n).padStart(2, "0");
  return `00:00:${p(Math.floor(f / fps))}:${p(f % fps)}`;
}
