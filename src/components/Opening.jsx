import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildScene, drawBoot, morphScene, INTRO } from "../lib/boot.js";
import { DEFAULT_FONT, BOOT_FONTS, RANDOM_CHANCE, loadFont, pickFont } from "../lib/bootFonts.js";
import { startFall, startPlanet, drawPlay, backToName, hitName } from "../lib/play.js";
import { useLocale } from "../i18n.jsx";
import { useLanyard } from "../lib/lanyard.js";
import { GAMES, ARTISTS } from "../data/me.js";
import LangSwitch from "./LangSwitch.jsx";
import SoundToggle from "./SoundToggle.jsx";
import { whoosh, chime, thud } from "../lib/sfx.js";

const EXIT = 0.95; // segundos da saída (pontos se espalham, o azul cobre a tela)

// Abertura: inicialização do sistema. O terminal digita dados reais enquanto os pontos montam "sorry.";
// a mira trava no ponto azul e o botão Entrar aparece. ?t=2.4 congela um quadro da montagem.
export default function Opening() {
  const { t } = useLocale();
  const B = t.boot;
  const navigate = useNavigate();
  const presence = useLanyard();
  const canvas = useRef(null);
  const term = useRef(null);
  const clock = useRef(null);
  const exitAt = useRef(null);
  const clickRef = useRef(null); // tratador de clique no canvas (definido dentro do efeito)
  const [ready, setReady] = useState(false);

  const status = presence ? t.discord[presence.discord_status] : t.discord.loading;
  const lines = [
    ["//", B.init],
    [B.profile, "KEVEN"],
    ["DISCORD", `@XSXRY · ${status.toUpperCase()}`],
    [B.games, String(GAMES.length).padStart(2, "0")],
    [B.artists, String(ARTISTS.length).padStart(2, "0")],
    [B.project, "SMART7"],
    [B.font, "…"],
    ["//", B.ok],
  ];
  const linesRef = useRef(lines);
  linesRef.current = lines;

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const params = new URLSearchParams(location.search);
    const frozen = params.has("t") ? Number(params.get("t")) : null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene = null, raf = 0, alive = true, start = 0, shown = false;
    // fonte: ?font=Bungee força uma; quadro congelado usa a padrão; senão RANDOM_CHANCE de sortear
    const forced = BOOT_FONTS.find((f) => f.name.toLowerCase() === (params.get("font") || "").toLowerCase());
    let font = forced ?? (frozen === null && Math.random() < RANDOM_CHANCE ? pickFont() : DEFAULT_FONT);
    let nextSwap = INTRO + 7 + Math.random() * 4, swapping = false;
    // modos do clique no nome: nome → gravidade → nome → planeta → nome …
    let mode = "name", nextEffect = "fall", lastNow = 0;
    const pointer = { x: -9999, y: -9999 };
    let dpr = 1;

    const build = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      const W = cv.clientWidth, H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      scene = buildScene(W, H, font);
    };
    // de tempos em tempos, com a tela parada, os pontos se remontam noutra fonte
    const swap = async (time) => {
      swapping = true;
      const next = await loadFont(pickFont(font));
      if (!alive || exitAt.current) return;
      font = next;
      scene = morphScene(scene, buildScene(cv.clientWidth, cv.clientHeight, font), (performance.now() - start) / 1000);
      nextSwap = time + 8 + Math.random() * 4;
      swapping = false;
    };
    // o terminal acompanha a montagem: uma linha a cada ~0,42 s, digitada caractere a caractere
    const type = (time) => {
      const el = term.current;
      if (!el) return;
      const ls = linesRef.current;
      el.querySelectorAll("li").forEach((li, i) => {
        const [k, v0] = ls[i];
        const v = k === B.font ? font.name.toUpperCase() : v0;
        const full = k === "//" ? `// ${v}` : `> ${k.padEnd(10, ".")} ${v}`;
        const n = Math.floor(Math.max(0, time - 0.15 - i * 0.42) * 60);
        li.textContent = full.slice(0, n);
        li.dataset.on = n > 0 ? "1" : "0";
      });
      const f = Math.floor(Math.min(time, 99) * 24);
      clock.current.textContent = `BOOT 00:00:${String(Math.floor(f / 24)).padStart(2, "0")}:${String(f % 24).padStart(2, "0")}`;
    };
    const paint = (time, exit = 0) => {
      drawBoot(ctx, scene, time, { dpr, pointer: frozen === null ? pointer : null, exit });
      type(time);
      if (!shown && time >= INTRO - 0.4) {
        shown = true;
        setReady(true);
      }
    };
    const loop = (now) => {
      if (!alive) return;
      const time = (now - start) / 1000;
      const exit = exitAt.current ? (now - exitAt.current) / 1000 / EXIT : 0;
      const dt = lastNow ? (now - lastNow) / 1000 : 0;
      lastNow = now;
      if (mode === "name") {
        if (!reduce && !swapping && !exitAt.current && time > nextSwap) swap(time);
        paint(time, exit);
      } else {
        drawPlay(ctx, scene, mode, time, dt, { dpr, exit });
        type(time);
      }
      if (exit >= 1) {
        try {
          sessionStorage.setItem("sorry:loaded", "1");
          sessionStorage.setItem("sorry:boot", "1");
        } catch (e) {}
        navigate("/inicio");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    clickRef.current = (e) => {
      if (!scene || !shown || exitAt.current || frozen !== null) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const time = (performance.now() - start) / 1000;
      if (mode === "name") {
        if (!hitName(scene, x, y)) return;
        mode = nextEffect;
        nextEffect = mode === "fall" ? "planet" : "fall";
        mode === "fall" ? startFall(scene) : startPlanet(scene);
        whoosh();
        if (mode === "fall") [0.9, 1.15, 1.4].forEach((d, k) => setTimeout(() => thud(0.8 + k * 0.2), d * 1000));
      } else {
        // qualquer clique devolve as partículas ao nome
        backToName(scene, time);
        whoosh();
        mode = "name";
        nextSwap = time + 9;
      }
      cv.dataset.mode = mode;
    };
    const move = (e) => {
      const r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const resize = () => {
      build();
      if (frozen !== null) paint(frozen);
    };

    Promise.all([document.fonts.ready, loadFont(font)]).then(() => {
      if (!alive) return;
      build();
      window.ready = true;
      window.seek = (time) => paint(time);
      if (frozen !== null) return paint(frozen);
      start = performance.now() - (reduce ? INTRO * 1000 + 500 : 0);
      raf = requestAnimationFrame(loop);
    });
    addEventListener("pointermove", move);
    addEventListener("resize", resize);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("resize", resize);
    };
  }, [navigate]);

  const enter = () => {
    if (exitAt.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return navigate("/inicio");
    exitAt.current = performance.now();
    chime();
  };

  return (
    <main className={`boot ${ready ? "is-ready" : ""}`} onKeyDown={(e) => e.key === "Enter" && ready && enter()}>
      <canvas ref={canvas} className="boot__canvas" aria-hidden="true" onClick={(e) => clickRef.current?.(e)} />
      <div className="boot__frame" aria-hidden="true" />

      <header className="boot__top mono">
        <span className="boot__clock">
          <i /> <span ref={clock}>BOOT 00:00:00:00</span>
        </span>
        <span className="boot__tools">
          <SoundToggle />
          <LangSwitch />
        </span>
      </header>

      <ol className="boot__term mono" ref={term} aria-hidden="true">
        {lines.map((_, i) => (
          <li key={i} />
        ))}
      </ol>

      <h1 className="sr-only">sorry. · Keven</h1>

      <div className="boot__foot">
        <p className="boot__role mono">
          <span className="boot__sq" />
          KEVEN · {B.role}
        </p>
        <button className="boot__enter" onClick={enter} disabled={!ready}>
          {t.enter} <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="boot__hint mono">
        <span className="boot__play">{B.play}</span> · {B.counts}
      </p>
    </main>
  );
}
