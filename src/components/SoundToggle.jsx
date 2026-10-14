import { useEffect, useState } from "react";
import { soundOn, setSound, onSound } from "../lib/sfx.js";

// Botão de som (desligado por padrão). Três barras que dançam quando o som está ligado.
export default function SoundToggle({ className = "" }) {
  const [on, setOn] = useState(soundOn);
  useEffect(() => onSound(setOn), []);
  return (
    <button
      className={`sound ${on ? "is-on" : ""} ${className}`}
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Desligar som" : "Ligar som"}
      title={on ? "Som: ligado" : "Som: desligado"}
    >
      <i />
      <i />
      <i />
    </button>
  );
}
