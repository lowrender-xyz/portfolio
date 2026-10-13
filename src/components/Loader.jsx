import { useEffect, useState } from "react";
import { useLocale } from "../i18n.jsx";

// Tela de carregamento com progresso real: fontes e as imagens que já estão no HTML. Some quando tudo
// carregou (ou depois de 4 s, para nunca prender o visitante). Uma vez por sessão.
// Vindo da abertura, a tela termina toda azul: aqui essa cortina recolhe e revela a landing.
function BootCurtain() {
  const [on, setOn] = useState(() => {
    try {
      return sessionStorage.getItem("boot") === "1";
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    if (!on) return;
    try {
      sessionStorage.removeItem("boot");
    } catch (e) {}
  }, [on]);
  if (!on) return null;
  return <div className="boot-curtain" aria-hidden="true" onAnimationEnd={() => setOn(false)} />;
}

export default function Loader() {
  return (
    <>
      <BootCurtain />
      <FileLoader />
    </>
  );
}

function FileLoader() {
  const { t } = useLocale();
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(() => {
    try {
      return sessionStorage.getItem("loaded") === "1";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (done) return;
    let alive = true;
    const finish = () => {
      if (!alive) return;
      setPct(100);
      setTimeout(() => alive && setDone(true), 650);
      try {
        sessionStorage.setItem("loaded", "1");
      } catch (e) {}
    };
    const imgs = [...document.images].filter((i) => i.loading !== "lazy");
    const tasks = [document.fonts.ready, ...imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => (i.onload = i.onerror = r))))];
    let n = 0;
    tasks.forEach((p) => p.then(() => alive && setPct(Math.round((++n / tasks.length) * 100))));
    Promise.all(tasks).then(finish);
    const cap = setTimeout(finish, 4000);
    return () => {
      alive = false;
      clearTimeout(cap);
    };
  }, [done]);

  if (done) return null;
  return (
    <div className={`loader ${pct >= 100 ? "is-out" : ""}`} role="status" aria-label={`${t.landing.loading} ${pct}%`}>
      <div className="loader__line mono">
        <span>■ {t.landing.loading}</span>
        <span className="loader__bar">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </span>
        <span>{String(pct).padStart(3, "0")}%</span>
      </div>
      <p className="loader__brand">
        sorry<span className="dot">.</span>
      </p>
    </div>
  );
}
