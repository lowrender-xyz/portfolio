import { useEffect, useRef } from "react";
import { useLocale } from "../i18n.jsx";
import { subscribe } from "../lib/film.js";

// Moldura de interface do site: borda fina em volta da tela, trilho lateral com a mira (gira com a rolagem)
// e um marcador por seção, e o bloco de progresso da barra de cima. Tudo atualizado direto no DOM, a cada
// quadro, a partir do estado do filme (src/lib/film.js).
export function useHudProgress(ref) {
  useEffect(
    () =>
      subscribe(({ progress }) => {
        if (ref.current) ref.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }),
    [ref],
  );
}

export default function Hud() {
  const { t } = useLocale();
  const reticle = useRef(null), ticks = useRef(null), coords = useRef(null);
  const sections = t.landingNav;

  useEffect(
    () =>
      subscribe(({ progress, velocity, chapter }) => {
        if (!reticle.current) return;
        // a mira gira com a página e "treme" com a velocidade
        reticle.current.style.transform = `rotate(${(progress * 360).toFixed(1)}deg) scale(${(1 + Math.min(Math.abs(velocity), 30) / 120).toFixed(3)})`;
        const n = chapter ? parseInt(chapter, 10) : 0;
        ticks.current?.querySelectorAll("a").forEach((a, i) => a.classList.toggle("is-on", i + 1 === n));
        if (coords.current) coords.current.textContent = `${String(Math.round(progress * 1000)).padStart(3, "0")}`;
      }),
    [],
  );

  return (
    <div className="hud" aria-hidden="false">
      <div className="hud__frame" aria-hidden="true" />
      <aside className="hud__rail">
        <svg className="hud__reticle" ref={reticle} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 2v12M20 26v12M2 20h12M26 20h12" />
          <rect x="15" y="15" width="10" height="10" />
        </svg>
        <nav className="hud__ticks" ref={ticks} aria-label="Seções">
          {sections.map(([href, label], i) => (
            <a
              key={href}
              href={href}
              title={label}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <i />
            </a>
          ))}
        </nav>
        <span className="hud__coords mono" ref={coords}>
          000
        </span>
      </aside>
    </div>
  );
}
