import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n.jsx";
import { MODULES, SHOTS } from "../data/smart7.js";
import Shot from "./Shot.jsx";

const DURATION = 7000; // ms em cada módulo antes de passar para o próximo

// Módulos do Smart7 em abas com temporizador: a lista à esquerda, a tela real do módulo numa janela à direita.
// A barra do módulo ativo enche em DURATION e o próximo entra sozinho; mouse em cima, foco no teclado ou a
// seção fora da tela pausam o ciclo. Clicar na tela amplia.
export default function ModuleExplorer() {
  const { t, pick, lang } = useLocale();
  const C = t.landing.catalog;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState(null);
  const root = useRef(null);
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const running = visible && !paused && !zoom && !reduce;
  const m = MODULES[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const key = (e) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [zoom]);

  const go = (i) => setActive((i + MODULES.length) % MODULES.length);
  const [main, extra] = m.shots;

  return (
    <div
      className={`mx ${running ? "is-running" : ""}`}
      ref={root}
      style={{ "--dur": `${DURATION}ms` }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ol className="mx__tabs" role="tablist" aria-label={C.aria}>
        {MODULES.map((mod, i) => (
          <li key={mod.code}>
            <button
              role="tab"
              aria-selected={i === active}
              className={`mx__tab ${i === active ? "is-active" : ""}`}
              onClick={() => go(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowRight") (e.preventDefault(), go(active + 1));
                if (e.key === "ArrowUp" || e.key === "ArrowLeft") (e.preventDefault(), go(active - 1));
              }}
            >
              <span className="mx__code mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="mx__title">{pick(mod.title)}</span>
              <span className="mx__tag mono">{pick(mod.tag)}</span>
              {/* a barra enche no módulo ativo; ao terminar, passa para o próximo */}
              <span className="mx__bar" aria-hidden="true">
                {i === active && <span key={active} onAnimationEnd={() => go(active + 1)} />}
              </span>
            </button>
            {i === active && (
              <div className="mx__detail">
                <p className="mx__line">{pick(mod.line)}</p>
                <ul>
                  {mod.features[lang].slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mx__stage" role="tabpanel">
        <div className="mx__window" key={m.code}>
          <div className="mx__chrome mono">
            <span className="mx__lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>smart7 · {pick(m.title).toLowerCase()}</span>
            <span className="mx__demo">{C.demoShort}</span>
          </div>
          {main ? (
            <button className="mx__shot" onClick={() => setZoom(SHOTS[main])} aria-label={`${C.enlarge}: ${pick(SHOTS[main].alt)}`}>
              <Shot shot={SHOTS[main]} loading="eager" />
            </button>
          ) : (
            // sem tela: o módulo fiscal mostra o fluxo da contingência, não uma tela inventada
            <div className="mx__empty">
              <ol className="mono">
                {(lang === "pt" ? ["venda", "nota reservada", "fila", "autorizada"] : ["sale", "invoice reserved", "queue", "authorized"]).map((s, k) => (
                  <li key={s} style={{ "--k": k }}>
                    <span>{String(k + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
              {m.note && <p className="mono">{pick(m.note)}</p>}
            </div>
          )}
        </div>
        {extra && (
          <button className="mx__extra" key={`${m.code}-x`} onClick={() => setZoom(SHOTS[extra])} aria-label={`${C.enlarge}: ${pick(SHOTS[extra].alt)}`}>
            <Shot shot={SHOTS[extra]} />
          </button>
        )}
      </div>

      {zoom && (
        <button className="zoom" onClick={() => setZoom(null)} aria-label={C.close}>
          <Shot shot={zoom} loading="eager" />
        </button>
      )}
    </div>
  );
}
