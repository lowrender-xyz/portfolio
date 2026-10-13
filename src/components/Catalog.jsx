import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n.jsx";
import { MODULES, SHOTS } from "../data/smart7.js";
import { spring } from "../lib/motion.js";
import Shot from "./Shot.jsx";

const N = MODULES.length;
const STEP = 30; // graus entre cartões no arco
const PX = 170; // pixels de arrasto por cartão

// Anel 3D de módulos em loop: a posição p (em cartões, contínua) gira o arco; cada cartão fica no ângulo
// da sua distância até p, então o anel não tem começo nem fim. Soltar encaixa no cartão mais próximo com
// uma mola em forma fechada. O cartão da frente abre o painel (clique, Enter ou o botão "Abrir").
export default function Catalog() {
  const { t, pick } = useLocale();
  const [open, setOpen] = useState(null);
  const [front, setFront] = useState(0);
  const ringRef = useRef(null);
  const stage = useRef(null);
  const st = useRef({ angle: 0, from: 0, target: 0, t0: 0, drag: null, moved: 0, raf: 0 });

  const apply = (p) => {
    const f = ((Math.round(p) % N) + N) % N;
    ringRef.current.querySelectorAll(".mod").forEach((el, i) => {
      let rel = (((i - p) % N) + N) % N;
      if (rel > N / 2) rel -= N;
      el.style.transform = `rotateY(${rel * STEP}deg) translateZ(var(--r))`;
      // quanto o cartão encara a câmera: 1 de frente, 0 de lado
      el.style.setProperty("--facing", Math.max(0, Math.cos((rel * STEP * Math.PI) / 180)).toFixed(3));
      el.style.zIndex = String(100 - Math.round(Math.abs(rel) * 10));
      el.dataset.front = i === f ? "1" : "0";
    });
    setFront(f);
  };

  const snapTo = (target) => {
    const s = st.current;
    cancelAnimationFrame(s.raf);
    s.from = s.angle;
    s.target = target;
    s.t0 = performance.now();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (now) => {
      const k = reduce ? 1 : spring((now - s.t0) / 1000, 170, 26);
      s.angle = s.from + (s.target - s.from) * k;
      apply(s.angle);
      if (k < 0.999) s.raf = requestAnimationFrame(tick);
      else apply((s.angle = s.target));
    };
    s.raf = requestAnimationFrame(tick);
  };
  const go = (dir) => snapTo(Math.round(st.current.target) + dir);

  useEffect(() => {
    apply(0);
    const el = stage.current;
    const s = st.current;
    const down = (e) => {
      if (e.button !== 0) return;
      cancelAnimationFrame(s.raf);
      s.drag = { x: e.clientX, a: s.angle, last: e.clientX, lt: performance.now(), v: 0 };
      s.moved = 0;
    };
    const move = (e) => {
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x;
      s.moved = Math.max(s.moved, Math.abs(dx));
      // só vira arrasto depois de alguns pixels: assim o clique no cartão continua funcionando
      if (s.moved > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
      const now = performance.now();
      // velocidade em px/ms, medida em janelas de pelo menos 16 ms (um evento único não vira arremesso)
      s.drag.v = (e.clientX - s.drag.last) / Math.max(16, now - s.drag.lt);
      s.drag.last = e.clientX;
      s.drag.lt = now;
      s.angle = s.drag.a - dx / PX;
      apply(s.angle);
    };
    const up = () => {
      if (!s.drag) return;
      const fling = Math.max(-1, Math.min(1, (-s.drag.v * 100) / PX));
      s.drag = null;
      snapTo(Math.round(s.angle + fling));
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(s.raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  const onCard = (i) => {
    if (st.current.moved > 6) return; // foi arrasto, não clique
    if (i === front) setOpen(MODULES[i]);
    else {
      // gira pelo caminho mais curto até o cartão clicado
      const cur = Math.round(st.current.target);
      let diff = (((i - cur) % N) + N) % N;
      if (diff > N / 2) diff -= N;
      snapTo(cur + diff);
    }
  };

  return (
    <>
      <div
        className="ring-stage"
        ref={stage}
        tabIndex={0}
        role="listbox"
        aria-label={t.landing.catalog.aria}
        aria-activedescendant={`mod-${front}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          else if (e.key === "ArrowLeft") go(-1);
          else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(MODULES[front]);
          } else return;
          e.preventDefault();
        }}
      >
        <div className="ring" ref={ringRef}>
          {MODULES.map((m, i) => {
            const cover = m.shots[0] && SHOTS[m.shots[0]];
            return (
              <button
                key={m.code}
                id={`mod-${i}`}
                role="option"
                aria-selected={i === front}
                className="mod"
                style={{ "--i": i }}
                onClick={() => onCard(i)}
                tabIndex={-1}
              >
                <span className="mod__head mono">
                  <span>{pick(m.tag)}</span>
                  <span>{m.code}</span>
                </span>
                <span className="mod__media">{cover && <Shot shot={cover} alt="" />}</span>
                <span className="mod__title">{pick(m.title)}</span>
                <span className="mod__line">{pick(m.line)}</span>
                <span className="mod__foot mono">
                  <span>{t.landing.catalog.screens}</span>
                  <span>{m.shots.length || "—"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="ring-controls">
        <button className="ring-btn" onClick={() => go(-1)} aria-label={t.landing.catalog.prev}>
          ←
        </button>
        <p className="mono">
          <span className="dot">{String(front + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")} · {pick(MODULES[front].title)}
        </p>
        <button className="btn btn--volt" onClick={() => setOpen(MODULES[front])}>
          {t.landing.catalog.open} →
        </button>
        <button className="ring-btn" onClick={() => go(1)} aria-label={t.landing.catalog.next}>
          →
        </button>
      </div>
      <p className="ring-hint mono">{t.landing.catalog.hint}</p>
      {open && <ModulePanel module={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function ModulePanel({ module: m, onClose }) {
  const { t, pick, lang } = useLocale();
  const [zoom, setZoom] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const key = (e) => {
      if (e.key === "Escape") zoom ? setZoom(null) : onClose();
    };
    window.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", key);
      prev?.focus?.();
    };
  }, [onClose, zoom]);

  return (
    <div className="panel-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header className="panel__head">
          <p className="mono kicker">
            {m.code} · {pick(m.tag)}
          </p>
          <button className="panel__close mono" ref={closeRef} onClick={onClose}>
            {t.landing.catalog.close} ✕
          </button>
        </header>
        <h2 id="panel-title" className="panel__title">
          {pick(m.title)}
        </h2>
        <p className="panel__line">{pick(m.line)}</p>
        <ol className="panel__features">
          {m.features[lang].map((f, i) => (
            <li key={f}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {f}
            </li>
          ))}
        </ol>
        {m.note && <p className="panel__note mono">{pick(m.note)}</p>}
        {m.shots.length > 0 && (
          <div className="panel__shots">
            {m.shots.map((k) => (
              <figure key={k}>
                <button onClick={() => setZoom(SHOTS[k])} aria-label={`${t.landing.catalog.enlarge}: ${pick(SHOTS[k].alt)}`}>
                  <Shot shot={SHOTS[k]} />
                </button>
                <figcaption className="mono">{pick(SHOTS[k].alt)}</figcaption>
              </figure>
            ))}
          </div>
        )}
        <p className="panel__demo mono">{t.landing.catalog.demo}</p>
      </aside>
      {zoom && (
        <button className="zoom" onClick={() => setZoom(null)} aria-label={t.landing.catalog.close}>
          <Shot shot={zoom} loading="eager" />
        </button>
      )}
    </div>
  );
}
