import { useEffect, useRef } from "react";
import { subscribe, scrubTo } from "../lib/film.js";

const RUNTIME = 180; // a página inteira "dura" 3 minutos no timecode
const FPS = 24;
const tc = (s) => {
  const f = Math.floor(s * FPS), p = (n) => String(n).padStart(2, "0");
  return `00:${p(Math.floor(f / FPS / 60))}:${p(Math.floor(f / FPS) % 60)}:${p(f % FPS)}`;
};

// Barra de reprodução fixa: o scroll é a agulha do vídeo. Timecode, capítulo atual e progresso seguem a
// rolagem; o ícone mostra ▶ enquanto a página se move e ❚❚ quando para. Clicar na barra leva àquele ponto.
// Atualiza o DOM direto (sem re-render do React a cada quadro).
export default function PlayerBar() {
  const root = useRef(null), bar = useRef(null), time = useRef(null), chap = useRef(null);
  useEffect(() => {
    let idle = 0, lastChapter = null;
    return subscribe(({ progress, velocity, chapter }) => {
      if (!root.current) return;
      bar.current.style.transform = `scaleX(${progress})`;
      time.current.textContent = tc(progress * RUNTIME);
      if (chapter !== lastChapter) {
        lastChapter = chapter;
        chap.current.textContent = chapter ?? "";
        chap.current.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 360, easing: "ease-out" });
      }
      // "tocando" enquanto há movimento; pausa depois de ~12 quadros parado
      if (Math.abs(velocity) > 0.15) idle = 0;
      else idle++;
      root.current.dataset.playing = idle < 12 ? "1" : "0";
    });
  }, []);

  return (
    <div className="player-bar mono" ref={root} data-playing="0">
      <span className="player-bar__icon" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="player-bar__time" ref={time}>
        00:00:00:00
      </span>
      <button
        className="player-bar__track"
        aria-label="Linha do tempo da página"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          scrubTo((e.clientX - r.left) / r.width);
        }}
      >
        <span ref={bar} />
      </button>
      <span className="player-bar__chapter" ref={chap} />
    </div>
  );
}
