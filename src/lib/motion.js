// Movimento em forma fechada: tudo é função pura do tempo (sem estado entre frames).

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;

// Progresso 0→1 de uma mola que parte em t=0. k = rigidez, c = amortecimento, massa 1.
export function spring(t, k = 170, c = 26) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k);
  const z = c / (2 * w0);
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

export const SNAPPY = [320, 30];
export const DEFAULT = [170, 26];
export const HEAVY = [120, 24];

// Valor com vários alvos: cada chave {t, v} marca o INÍCIO do movimento até v.
export function track(t, keys, [k, c] = DEFAULT) {
  let v = keys[0].v;
  for (let i = 1; i < keys.length; i++) v += (keys[i].v - keys[i - 1].v) * spring(t - keys[i].t, k, c);
  return v;
}

export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);

export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
