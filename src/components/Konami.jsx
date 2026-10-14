import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n.jsx";
import { setFrozen, getLenis } from "../lib/film.js";
import { thud, chime } from "../lib/sfx.js";

// ↑ ↑ ↓ ↓ ← → ← → B A: os blocos visíveis da página despencam com gravidade, giram, quicam e param no chão
// da moldura. Clique ou Esc devolve tudo ao lugar.
const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const PIECES = [
  ".nav__links a", ".nav__brand", ".hud__reticle", ".hud__ticks a",
  ".lkicker", ".ltitle > span", ".ltitle > em", ".lsec__lead", ".lsec__big", ".ruler",
  ".lhero__lead", ".lhero__cta .btn", ".lhero__dots", ".lhero__strip span",
  ".gcard", ".shelf-tabs button", ".deck", ".strip", ".music__now",
  ".project__name", ".project__line", ".project__stats > div", ".mx__tab", ".mx__window",
  ".craft", ".about__tools li", ".pf__card", ".pf__icons li", ".footer__big", ".ticker", ".marquee",
].join(",");
const G = 2600;

export default function Konami() {
  const { t } = useLocale();
  const [on, setOn] = useState(false);
  const state = useRef(null);

  useEffect(() => {
    let i = 0;
    const key = (e) => {
      if (state.current) {
        if (e.key === "Escape") restore();
        return;
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0;
      if (i === CODE.length) {
        i = 0;
        fall();
      }
    };

    const fall = () => {
      const vh = innerHeight, vw = innerWidth, floor = vh - 16;
      const els = [...document.querySelectorAll(PIECES)].filter((el) => {
        const r = el.getBoundingClientRect();
        // só o que está na tela e não está dentro de outra peça que já vai cair
        return r.bottom > 0 && r.top < vh && r.width > 0 && !el.parentElement.closest(PIECES);
      });
      if (!els.length) return;
      setFrozen(true);
      getLenis()?.stop();
      const bodies = els.map((el) => {
        const r = el.getBoundingClientRect();
        // transform não vale em elemento de linha: vira inline-block enquanto cai
        const inline = getComputedStyle(el).display === "inline";
        if (inline) el.style.display = "inline-block";
        return {
          el, r, inline, prev: el.style.transform, prevT: el.style.transition,
          x: 0, y: 0, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 380,
          a: 0, va: (Math.random() - 0.5) * 340, rest: false, bounces: 0,
          delay: Math.random() * 0.18 + (1 - r.top / vh) * 0.12,
        };
      });
      bodies.forEach((b) => (b.el.style.transition = "none"));
      let last = performance.now(), age = 0;
      const step = (now) => {
        const dt = Math.min(1 / 30, (now - last) / 1000);
        last = now;
        age += dt;
        let moving = false;
        for (const b of bodies) {
          if (b.rest || age < b.delay) {
            moving ||= !b.rest;
            continue;
          }
          moving = true;
          b.vy += G * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.a += b.va * dt;
          // chão: a base girada do bloco não passa da moldura
          const half = (Math.abs(Math.sin((b.a * Math.PI) / 180)) * b.r.width + Math.abs(Math.cos((b.a * Math.PI) / 180)) * b.r.height) / 2;
          const bottom = b.r.top + b.r.height / 2 + b.y + half;
          if (bottom > floor) {
            b.y -= bottom - floor;
            if (Math.abs(b.vy) > 260 && b.bounces < 3) {
              b.vy *= -0.38;
              b.va *= 0.5;
              b.bounces++;
              if (b.bounces === 1) thud(0.7 + Math.random() * 0.6);
            } else {
              b.vy = 0;
              b.va = 0;
              b.rest = true;
            }
            b.vx *= 0.7;
          }
          // paredes
          const left = b.r.left + b.x, right = left + b.r.width;
          if (left < 14) (b.x += 14 - left, (b.vx = Math.abs(b.vx) * 0.5));
          if (right > vw - 14) (b.x -= right - (vw - 14), (b.vx = -Math.abs(b.vx) * 0.5));
          b.el.style.transform = `${b.prev || ""} translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) rotate(${b.a.toFixed(1)}deg)`;
        }
        if (moving && state.current) state.current.raf = requestAnimationFrame(step);
      };
      state.current = { bodies, raf: requestAnimationFrame(step) };
      setOn(true);
    };

    const restore = () => {
      const s = state.current;
      if (!s) return;
      cancelAnimationFrame(s.raf);
      state.current = null;
      chime();
      for (const b of s.bodies) {
        b.el.style.transition = "transform 0.9s cubic-bezier(0.34, 1.3, 0.5, 1)";
        b.el.style.transform = b.prev;
      }
      setTimeout(() => {
        for (const b of s.bodies) {
          b.el.style.transition = b.prevT;
          if (b.inline) b.el.style.display = "";
        }
        setFrozen(false);
        getLenis()?.start();
      }, 950);
      setOn(false);
    };
    const click = () => state.current && restore();
    addEventListener("keydown", key);
    addEventListener("pointerdown", click);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("pointerdown", click);
      if (state.current) cancelAnimationFrame(state.current.raf);
    };
  }, []);

  return on ? (
    <p className="konami mono" role="status">
      ■ {t.konami}
    </p>
  ) : null;
}
