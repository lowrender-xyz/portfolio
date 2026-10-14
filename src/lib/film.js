import Lenis from "lenis";

// A página como um filme: rolagem suave com inércia (Lenis) e, a cada quadro, cada efeito calcula
// transform/opacity a partir do progresso da sua cena e escreve direto no elemento que se move.
// (Variáveis CSS na seção obrigavam o navegador a recalcular o estilo de tudo que há dentro dela.)
// Rolar para trás "volta o vídeo": tudo é função da posição, sem estado acumulado.
//
// Progresso de uma cena (retângulo r, altura da tela vh):
//   p   0 quando o topo da cena entra por baixo da tela → 1 quando a base sai por cima
//   c   0 → 1 enquanto a linha do meio da tela atravessa a cena
//   out 0 → 1 enquanto a cena sai por cima (usado no hero)

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const listeners = new Set();
let state = { progress: 0, velocity: 0, chapter: null, lenis: null };

export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
// o Konami assume os transforms por um tempo: enquanto congelado, os efeitos de scroll não escrevem nada
let frozen = false;
export const setFrozen = (v) => {
  frozen = v;
  if (!v) forceWrite = true;
};
let forceWrite = false;
export const getLenis = () => state.lenis;

// [cena, alvo dentro da cena, efeito(progresso, índice do alvo, alvo)] → { t: transform, o: opacity }
const FX = [
  ["#inicio", ".lhero__grid", ({ out }) => ({ t: `translate3d(0,${-out * 140}px,0) scale(${1 - out * 0.08})`, o: 1 - out * 1.5 })],
  ["#inicio", ".lhero__dots", ({ out }) => ({ t: `translate3d(${out * 6}%,0,0) scale(${1 + out * 0.55})`, o: 0.95 - out * 1.1 })],
  ["#inicio", ".lhero__strip", ({ out }) => ({ t: `translate3d(0,${out * 40}px,0)` })],
  // títulos: a palavra em destaque chega deslizando da direita e para quando a cena chega ao meio da tela
  ["[data-chapter]", ".lsec__head .ltitle > em", ({ c }) => ({ t: `translate3d(${Math.max(0, 0.5 - c) * 18}vw,0,0)`, o: 0.35 + Math.min(c, 0.5) * 1.3 })],
  ["[data-chapter]", ".lsec__lead", ({ c }) => ({ t: `translate3d(0,${(0.5 - c) * 60}px,0)` })],
  // numeral gigante na vertical: corre mais devagar que a página (profundidade)
  ["[data-chapter]", ".lsec__big", ({ c }) => ({ t: `translate3d(0,${(c - 0.5) * 160}px,0)` })],
  // jogos: as capas sobem em sequência, deitadas para trás, e se endireitam
  ["#jogos", ".shelf-games > li", ({ p }, i) => {
    const e = clamp((p - 0.08 - i * 0.03) * 4);
    return { t: `translate3d(0,${(1 - e) * 140}px,0) rotateX(${(1 - e) * 28}deg)`, o: e };
  }],
  // filmes e séries: os baralhos sobem e o leque abre quando chegam ao meio da tela
  ["#tela", ".deck", ({ p }) => {
    const e = clamp((p - 0.12) * 3.5);
    return { t: `translate3d(0,${(1 - e) * 90}px,0)`, o: e };
  }],
  ["#tela", ".deck__hand", ({ c }) => ({ v: ["--step", `${1.5 + clamp((c - 0.15) * 2.2) * 6}deg`] })],
  // música: as tiras entram deslizando de lados alternados
  ["#musica", ".artists > li", ({ p }, i) => {
    const e = clamp((p - 0.06 - i * 0.035) * 4), s = i % 2 ? 1 : -1;
    return { t: `translate3d(${(1 - e) * s * 45}vw,0,0) rotate(${(1 - e) * s * 6}deg)`, o: e };
  }],
  ["#musica", ".music__now", ({ c }) => ({ t: `translate3d(0,${(0.5 - c) * 90}px,0)` })],
  // projetos: a janela do Smart7 chega deitada e se endireita
  ["#catalogo", ".mx__stage", ({ p }) => {
    const e = clamp((p - 0.05) * 3.2);
    return { t: `perspective(1600px) rotateX(${(1 - e) * 16}deg) scale(${0.9 + e * 0.1})` };
  }],
  // perfil: a ficha e os links chegam de lados opostos e se encontram no meio
  ["#perfil", ".pf__card", ({ p }) => {
    const e = clamp((p - 0.05) * 3.2);
    return { t: `translate3d(${(1 - e) * -12}vw,0,0)`, o: e };
  }],
  ["#perfil", ".pf__icons > li", ({ p }, i) => {
    const e = clamp((p - 0.08 - i * 0.04) * 4);
    return { t: `translate3d(0,${(1 - e) * 60}px,0) rotate(${(1 - e) * 12}deg)`, o: e };
  }],
  // rodapé: o "sorry." final cresce até o fim da página
  // (o rodapé nunca sai por cima da tela: o efeito termina, parado no lugar, antes do fim da página)
  [".footer", ".footer__big", ({ p }) => {
    const e = clamp(p * 3);
    return { t: `translate3d(0,${(1 - e) * 70}px,0) scale(${0.9 + e * 0.1})`, o: 0.2 + e * 0.8 };
  }],
];

export function startFilm() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = reduce
    ? null
    : new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        anchors: { offset: -80 },
        // carrosséis horizontais e a imagem ampliada rolam por conta própria
        prevent: (node) => Boolean(node.closest?.(".shelf-games, .mx__tabs, .zoom")),
      });
  state.lenis = lenis;
  let raf = 0, lastY = -1, tick = 0, scenes = [], chapters = [], marquee = null, lastSkew = "";

  // monta a lista de cenas e alvos (relida de vez em quando: a página monta e troca seções)
  const collect = () => {
    const map = new Map();
    for (const [sceneSel, targetSel, fx] of FX) {
      for (const scene of document.querySelectorAll(sceneSel)) {
        if (!map.has(scene)) map.set(scene, []);
        const targets = [...scene.querySelectorAll(targetSel)];
        targets.forEach((el, i) => {
          // a transição da revelação não pode suavizar o transform que o scroll escreve
          if (!el.dataset.fx) {
            el.dataset.fx = "1";
            el.style.transitionProperty = "clip-path, opacity, filter";
          }
          map.get(scene).push({ el, i, fx, last: {} });
        });
      }
    }
    scenes = [...map].map(([el, targets]) => ({ el, targets }));
    chapters = [...document.querySelectorAll("[data-chapter]")];
    marquee = document.querySelector(".marquee");
  };

  const frame = (t) => {
    lenis?.raf(t);
    if (tick++ % 45 === 0) collect();
    const vh = innerHeight, y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const vel = clamp(lenis ? lenis.velocity : y - (lastY < 0 ? y : lastY), -40, 40);
    const moved = y !== lastY || tick < 4 || tick % 45 === 1 || forceWrite;
    if (!frozen) forceWrite = false;
    lastY = y;

    if (moved) {
      // 1) leituras
      const rects = scenes.map((s) => s.el.getBoundingClientRect());
      let chapter = null;
      for (const el of chapters) if (el.getBoundingClientRect().top <= vh * 0.5) chapter = el.dataset.chapter;
      state.chapter = chapter;
      // 2) escritas, só nos alvos e só do que mudou
      if (!reduce && !frozen) {
        scenes.forEach((s, k) => {
          const r = rects[k];
          if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return; // longe da tela: não mexe
          const prog = {
            p: clamp((vh - r.top) / (vh + r.height)),
            c: clamp((vh * 0.5 - r.top) / r.height),
            out: clamp(-r.top / r.height),
          };
          for (const tg of s.targets) {
            const { t: tr, o, v } = tg.fx(prog, tg.i, tg.el);
            if (tr !== undefined && (tr !== tg.last.t || tg.el.style.transform !== tr)) tg.el.style.transform = tg.last.t = tr;
            if (o !== undefined) {
              const os = clamp(o).toFixed(3);
              if (os !== tg.last.o) tg.el.style.opacity = tg.last.o = os;
            }
            if (v && v[1] !== tg.last.v) tg.el.style.setProperty(v[0], (tg.last.v = v[1]));
          }
        });
      }
    }
    // a faixa de nomes inclina com a velocidade
    const skew = reduce ? "" : `skewX(${(vel * -0.35).toFixed(1)}deg)`;
    if (marquee && skew !== lastSkew) marquee.style.transform = lastSkew = skew;

    state = { ...state, progress: y / max, velocity: vel };
    for (const fn of listeners) fn(state);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    state.lenis = null;
  };
}

export function scrubTo(fraction) {
  const max = document.documentElement.scrollHeight - innerHeight;
  const y = clamp(fraction) * max;
  if (state.lenis) state.lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo(0, y);
}
