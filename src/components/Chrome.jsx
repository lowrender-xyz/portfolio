import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import { useLocale } from "../i18n.jsx";
import { mulberry32 } from "../lib/motion.js";
import LangSwitch from "./LangSwitch.jsx";
import { useHudProgress } from "./Hud.jsx";

// Seção visível agora (para marcar o item do menu)
function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join();
  useEffect(() => {
    const els = ids.map((h) => document.querySelector(h)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

export function Nav() {
  const { t } = useLocale();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const active = useActiveSection(t.landingNav.map(([h]) => h));
  const progress = useRef(null);
  // troca de tema: o tema novo se abre num círculo a partir do botão (View Transitions);
  // sem suporte ou com "reduzir movimento", troca na hora
  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () =>
      flushSync(() => {
        document.documentElement.dataset.theme = next;
        setTheme(next);
      });
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    vt.finished.finally(() => root.classList.remove("theme-switching"));
  };
  useHudProgress(progress);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <header className="nav" style={{ viewTransitionName: "frame" }}>
      {/* bloco que enche com o progresso da página */}
      <span className="nav__progress" aria-hidden="true">
        <i ref={progress} />
      </span>
      <Link to="/" className="nav__brand" style={{ viewTransitionName: "brand" }} aria-label="sorry · abertura">
        sorry<span className="dot">.</span>
      </Link>
      <nav className="nav__links">
        {t.landingNav.map(([href, label]) => (
          <a key={href} href={href} className={active === href ? "active" : ""}>
            <span className="nav__sq" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
      <div className="nav__tools">
        <a className="btn btn--volt nav__talk" href="#perfil">
          {t.talk}
        </a>
        <LangSwitch />
        <button
          className="theme mono"
          onClick={(e) => toggleTheme(e)}
          aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}
        >
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            {theme === "dark" ? (
              <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" />
              </g>
            ) : (
              <path d="M13.5 9.6A6 6 0 0 1 6.4 2.5a6 6 0 1 0 7.1 7.1Z" fill="currentColor" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="footer" data-scene>
      <div className="footer__big">
        sorry<span className="dot">.</span>
      </div>
      <p className="footer__note mono">
        © 2026 Keven · {t.footer}
      </p>
      {/* atribuição exigida pelos termos da API do TMDB */}
      <p className="footer__credit mono">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          {t.tmdb}
        </a>
      </p>
    </footer>
  );
}

// Grão de filme: um ladrilho de ruído gerado uma vez, com semente fixa.
export function Grain() {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 160;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(160, 160);
    const rnd = mulberry32(21);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = rnd() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    setUrl(c.toDataURL());
  }, []);
  return <div className="grain" aria-hidden="true" style={url ? { backgroundImage: `url(${url})` } : undefined} />;
}

// A luz do projetor: um halo volt que segue o ponteiro.
export function CursorLight() {
  const ref = useRef(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const move = (e) => {
      ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      ref.current.style.opacity = 1;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div className="cursor-light" ref={ref} aria-hidden="true" />;
}

// Revelação por máscara: o conteúdo sobe de dentro da própria linha quando entra na tela.
export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
