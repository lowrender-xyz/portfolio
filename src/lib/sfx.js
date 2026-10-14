// Efeitos sonoros sintetizados com Web Audio (nenhum arquivo de áudio). Desligados por padrão; a escolha
// fica salva no navegador. O contexto de áudio só nasce depois de um gesto do visitante (regra dos browsers).
const KEY = "sound";
let ac = null, master = null, noiseBuf = null;
const subs = new Set();

export const soundOn = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch (e) {
    return false;
  }
};
export const onSound = (fn) => (subs.add(fn), () => subs.delete(fn));

export function setSound(on) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch (e) {}
  if (on) {
    audio();
    chime();
  }
  subs.forEach((fn) => fn(on));
}

function audio() {
  if (!ac) {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = 0.32;
    // compressor suave: nada estoura quando vários sons tocam juntos
    const comp = ac.createDynamicsCompressor();
    master.connect(comp).connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === "suspended") ac.resume();
  return ac;
}

const ready = () => soundOn() && audio();

function tone({ f = 880, f2 = null, type = "sine", dur = 0.08, gain = 0.4, at = 0 }) {
  const c = ready();
  if (!c) return;
  const t = c.currentTime + at;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise({ dur = 0.3, from = 400, to = 4000, q = 1.2, gain = 0.25, at = 0 }) {
  const c = ready();
  if (!c) return;
  const t = c.currentTime + at;
  const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
  src.buffer = noiseBuf;
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(from, t);
  bp.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

// mira trava num alvo
export const tick = () => tone({ f: 2400, type: "square", dur: 0.025, gain: 0.08 });
// clique
export const blip = () => tone({ f: 660, f2: 990, type: "triangle", dur: 0.07, gain: 0.22 });
// troca de tema: varredura para cima (claro) ou para baixo (escuro)
export const sweep = (up) => (tone({ f: up ? 300 : 900, f2: up ? 900 : 300, type: "sine", dur: 0.45, gain: 0.25 }), noise({ dur: 0.45, from: up ? 600 : 3000, to: up ? 3000 : 600, gain: 0.08 }));
// transição de seção
export const whoosh = () => noise({ dur: 0.55, from: 300, to: 3500, q: 0.8, gain: 0.3 });
// partícula/objeto batendo no chão
export const thud = (k = 1) => tone({ f: 140 * k, f2: 55, type: "sine", dur: 0.16, gain: 0.35 });
// entrada e confirmação: acorde curto em arpejo (mi menor com a nona)
export const chime = () => [659, 784, 988, 1480].forEach((f, i) => tone({ f, type: "triangle", dur: 0.5, gain: 0.12, at: i * 0.06 }));
