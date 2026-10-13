import { useRef } from "react";

// Capa de jogo que inclina em 3D seguindo o ponteiro, com um reflexo de luz no ponto mais alto.
// Só mexe em variáveis CSS (--rx, --ry, --gx, --gy); a transição suave fica no CSS.
export default function GameCover({ game, live, label }) {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    ref.current.style.setProperty("--gx", `${x * 100}%`);
    ref.current.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    for (const k of ["--rx", "--ry"]) ref.current.style.setProperty(k, "0deg");
  };
  return (
    <div className="gcover" ref={ref} onPointerMove={move} onPointerLeave={leave}>
      <img src={game.cover} alt={game.title} loading="lazy" referrerPolicy="no-referrer" />
      <span className="gcover__glare" aria-hidden="true" />
      {live && <span className="gcover__live mono">● {label}</span>}
    </div>
  );
}
