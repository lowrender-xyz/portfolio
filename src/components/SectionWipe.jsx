import { useEffect, useRef } from "react";
import { useLocale } from "../i18n.jsx";
import { getLenis } from "../lib/film.js";
import { whoosh } from "../lib/sfx.js";

// Transição entre seções: qualquer link interno (#jogos, #perfil...) sobe uma cortina azul com o nome da
// seção; a página pula por trás enquanto ela cobre a tela, e a cortina sai por cima.
export default function SectionWipe() {
  const { t } = useLocale();
  const el = useRef(null), label = useRef(null);
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    let busy = false;
    const go = async (hash) => {
      const target = document.querySelector(hash);
      const lenis = getLenis();
      if (!target) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || busy) return lenis ? lenis.scrollTo(target, { offset: -80, immediate: true }) : target.scrollIntoView();
      busy = true;
      const nav = tRef.current.landingNav;
      const i = nav.findIndex(([h]) => h === hash);
      label.current.querySelector("b").textContent = `■ 00${i + 1}`;
      label.current.querySelector("span").textContent = i >= 0 ? nav[i][1] : hash.slice(1);
      whoosh();
      const box = el.current;
      box.style.display = "grid";
      const ease = "cubic-bezier(0.7, 0, 0.2, 1)";
      await box.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 420, easing: ease, fill: "forwards" }).finished;
      await label.current.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "ease-out", fill: "forwards" }).finished;
      if (lenis) lenis.scrollTo(target, { offset: -80, immediate: true, force: true });
      else target.scrollIntoView();
      history.replaceState(null, "", hash);
      await new Promise((r) => setTimeout(r, 160));
      await box.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 480, easing: ease, fill: "forwards" }).finished;
      box.style.display = "none";
      label.current.getAnimations().forEach((a) => a.cancel());
      busy = false;
    };
    // intercepta links internos da página (menu, trilho, botões do topo, "Contato")
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      e.preventDefault();
      go(a.getAttribute("href"));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className="wipe" ref={el} aria-hidden="true">
      <p className="wipe__label" ref={label}>
        <b className="mono" />
        <span />
      </p>
    </div>
  );
}
