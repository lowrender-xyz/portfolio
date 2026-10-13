import { useEffect, useRef } from "react";
import { mulberry32 } from "../lib/motion.js";

// Meio-tom: um glifo grande vira uma grade de pontos. Cada ponto tem o raio da cobertura do glifo
// naquele lugar; perto do cursor os pontos acendem em volt. O desenho é função do tempo e do cursor.
export default function Halftone({ text = "s.", accentFrom = 1, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    let dots = [], W = 0, H = 0, dpr = 1, raf = 0, visible = true;
    const pointer = { x: -9999, y: -9999, k: 0 };

    const build = async () => {
      await document.fonts.ready;
      dpr = Math.min(2, devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      // glifo em canvas fora da tela, medido para ocupar a altura
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      let fs = H * 1.05;
      o.font = `700 ${fs}px "Space Grotesk"`;
      const w = o.measureText(text).width;
      if (w > W * 0.98) fs *= (W * 0.98) / w;
      o.font = `700 ${fs}px "Space Grotesk"`;
      o.textBaseline = "alphabetic";
      const tw = o.measureText(text).width;
      const x0 = W - tw, y0 = H * 0.86;
      // o corpo e o acento (o ponto final) são amostrados em passes separados: o acento sai em volt
      o.fillStyle = "#fff";
      o.fillText(text.slice(0, accentFrom), x0, y0);
      const base = o.getImageData(0, 0, W, H).data;
      const accX = x0 + o.measureText(text.slice(0, accentFrom)).width;
      o.clearRect(0, 0, W, H);
      o.fillText(text.slice(accentFrom), accX, y0);
      const acc = o.getImageData(0, 0, W, H).data;

      const step = Math.max(7, Math.round(W / 110));
      const rnd = mulberry32(3);
      dots = [];
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          const i = (Math.floor(y) * W + Math.floor(x)) * 4 + 3;
          const a = base[i] / 255, b = acc[i] / 255;
          dots.push({ x, y, a, b, r: step * 0.46, ph: rnd() * Math.PI * 2 });
        }
      }
      if (reduce) paint(0);
    };

    const paint = (t) => {
      const paper = css.getPropertyValue("--paper").trim() || "#eceef2";
      const line = css.getPropertyValue("--line").trim() || "#1c2029";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * 0.28;
      for (const d of dots) {
        const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
        const near = Math.max(0, 1 - dist / R) * pointer.k;
        const shimmer = reduce ? 0 : 0.12 * Math.sin(t * 1.4 + d.ph);
        const cov = Math.max(d.a, d.b);
        if (cov < 0.05 && near < 0.05) {
          ctx.fillStyle = line;
          ctx.fillRect(d.x - 0.75, d.y - 0.75, 1.5, 1.5);
          continue;
        }
        const r = d.r * Math.min(1, cov * (0.85 + shimmer) + near * 0.5);
        ctx.fillStyle = d.b > 0.5 || near > 0.35 ? "#3d7bff" : paper;
        ctx.globalAlpha = Math.min(1, 0.35 + cov * 0.65 + near);
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.6, r), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      pointer.k += ((pointer.on ? 1 : 0) - pointer.k) * 0.08;
      if (visible) paint(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = pointer.x > -40 && pointer.y > -40 && pointer.x < W + 40 && pointer.y < H + 40;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    build().then(() => {
      if (!reduce) raf = requestAnimationFrame(loop);
    });
    window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [text, accentFrom]);

  return <canvas ref={ref} className={`halftone ${className}`} aria-hidden="true" />;
}
