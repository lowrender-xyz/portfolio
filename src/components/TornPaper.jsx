import { useMemo } from "react";
import { mulberry32 } from "../lib/motion.js";

// Pedaço de papel rasgado: as bordas de cima e de baixo são um clip-path serrilhado gerado com semente
// fixa (cada tira tem o seu rasgo, sempre o mesmo). A textura e os vincos ficam no CSS (.paper).
function tornEdge(seed, { teeth = 46, depth = 7, sides = "tb" } = {}) {
  const r = mulberry32(seed);
  const pts = [];
  const top = sides.includes("t"), bottom = sides.includes("b");
  // borda de cima, da esquerda para a direita
  for (let i = 0; i <= teeth; i++) {
    const x = (i / teeth) * 100;
    const y = top ? r() * depth * (i % 3 === 0 ? 1.6 : 1) : 0;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}px`);
  }
  // borda de baixo, da direita para a esquerda
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100;
    const y = bottom ? r() * depth * (i % 4 === 0 ? 1.7 : 1) : 0;
    pts.push(`${x.toFixed(2)}% calc(100% - ${y.toFixed(2)}px)`);
  }
  return `polygon(${pts.join(", ")})`;
}

export default function TornPaper({ seed = 1, tilt = 0, sides = "tb", depth, className = "", as: Tag = "div", children, style, ...rest }) {
  const clip = useMemo(() => tornEdge(seed, { sides, depth }), [seed, sides, depth]);
  return (
    <Tag className={`paper ${className}`} style={{ "--tilt": `${tilt}deg`, "--seed": seed, ...style }} {...rest}>
      <span className="paper__sheet" style={{ clipPath: clip }} aria-hidden="true" />
      <span className="paper__body">{children}</span>
    </Tag>
  );
}
