import { useEffect, useRef } from "react";

// Cursor do site no estilo da mira do HUD: um ponto que segue o mouse na hora e quatro cantos que vão atrás
// com atraso suave. Sobre links e botões, os cantos se abrem e enquadram o elemento (a mira trava no alvo).
// Só em mouse de verdade (pointer: fine); em toque, nada muda.
const TARGETS = "a, button, [role=tab], [role=option], .deck__hand, .gcover";

export default function Cursor() {
  const frame = useRef(null), dot = useRef(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = { x: innerWidth / 2, y: innerHeight / 2, seen: false };
    // estado atual da mira (centro e tamanho), que persegue o alvo
    const f = { x: p.x, y: p.y, w: 28, h: 28 };
    let target = null, down = false, raf = 0, last = performance.now();

    const move = (e) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (!p.seen) {
        p.seen = true;
        Object.assign(f, { x: p.x, y: p.y });
        root.classList.add("cursor-on");
      }
      const el = e.target.closest?.(TARGETS);
      target = el && !el.disabled ? el : null;
    };
    const leave = () => root.classList.remove("cursor-on");
    const enter = () => p.seen && root.classList.add("cursor-on");
    const press = () => (down = true);
    const release = () => (down = false);

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let tx = p.x, ty = p.y, tw = 28, th = 28;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        tw = r.width + 14;
        th = r.height + 14;
      }
      if (down) (tw *= 0.86, th *= 0.86);
      // suavização independente da taxa de quadros (mais rápida para posição que para tamanho)
      const kp = reduce ? 1 : 1 - Math.exp(-dt * 22), ks = reduce ? 1 : 1 - Math.exp(-dt * 16);
      f.x += (tx - f.x) * kp;
      f.y += (ty - f.y) * kp;
      f.w += (tw - f.w) * ks;
      f.h += (th - f.h) * ks;
      frame.current.style.transform = `translate3d(${(f.x - f.w / 2).toFixed(1)}px,${(f.y - f.h / 2).toFixed(1)}px,0)`;
      frame.current.style.width = `${f.w.toFixed(1)}px`;
      frame.current.style.height = `${f.h.toFixed(1)}px`;
      frame.current.classList.toggle("is-locked", Boolean(target));
      dot.current.style.transform = `translate3d(${p.x - 3}px,${p.y - 3}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", press);
    addEventListener("pointerup", release);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-on");
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", press);
      removeEventListener("pointerup", release);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__frame" ref={frame}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
