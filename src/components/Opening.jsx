import { useEffect, useRef } from "react";
import { drawReel, timecode, LOOP, TAKE } from "../lib/reel.js";
import { useLocale } from "../i18n.jsx";
import { useTransitionNavigate } from "../lib/transition.js";
import LangSwitch from "./LangSwitch.jsx";

export default function Opening() {
  const { t, lang } = useLocale();
  const go = useTransitionNavigate();
  const canvasRef = useRef(null);
  const tcRef = useRef(null);
  const takeRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mark = new Image();
    mark.src = "/brand/smart7-mark.png";
    const params = new URLSearchParams(location.search);
    const frozen = params.has("t") ? Number(params.get("t")) : null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, start = performance.now(), lastTake = -1, alive = true;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    const paint = (time) => {
      if (!alive || !tcRef.current) return;
      drawReel(ctx, W, H, time, mark, langRef.current, canvas.width / W);
      tcRef.current.textContent = timecode(time);
      const take = Math.floor(time / TAKE);
      if (take !== lastTake) {
        lastTake = take;
        takeRef.current.dataset.take = take;
      }
    };
    resize();
    window.seek = (time) => paint(((time % LOOP) + LOOP) % LOOP);

    const loop = (now) => {
      if (!alive) return;
      paint(((now - start) / 1000) % LOOP);
      raf = requestAnimationFrame(loop);
    };
    const still = frozen ?? (reduce ? TAKE * 3 + 2.4 : null);
    Promise.all([document.fonts.ready, mark.decode().catch(() => {})]).then(() => {
      if (!alive) return;
      window.ready = true;
      if (still !== null) paint(still);
      else {
        start = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    const onResize = () => {
      resize();
      if (still !== null) paint(still);
    };
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="opening">
      <canvas ref={canvasRef} className="opening__reel" aria-hidden="true" />
      <div className="opening__vignette" />
      <div className="opening__bar opening__bar--top" />
      <div className="opening__bar opening__bar--bottom" />

      <div className="opening__meta mono">
        <span className="rec" />
        REEL 01 · <span ref={tcRef}>00:00:00:00</span>
      </div>
      <div className="opening__take mono" ref={takeRef} data-take="0">
        {t.takes.map((name, i) => (
          <span key={name} data-i={i}>
            {String(i + 1).padStart(2, "0")} / 04 · {name}
          </span>
        ))}
      </div>

      <div className="opening__title">
        <h1 className="opening__nick" style={{ viewTransitionName: "brand" }}>
          sorry<span className="dot">.</span>
        </h1>
        <p className="opening__role">
          <span>Keven</span> · {t.role}
        </p>
        <button className="opening__enter" style={{ viewTransitionName: "frame" }} onClick={() => go("/inicio")}>
          {t.enter} <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="opening__lang">
        <LangSwitch />
      </div>
    </main>
  );
}
