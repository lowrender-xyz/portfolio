import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LocaleProvider } from "./i18n.jsx";
import Opening from "./components/Opening.jsx";
import { Nav, Footer, Grain, CursorLight } from "./components/Chrome.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound.jsx";
import Hud from "./components/Hud.jsx";
import Loader from "./components/Loader.jsx";
import Cursor from "./components/Cursor.jsx";
import SectionWipe from "./components/SectionWipe.jsx";
import Konami from "./components/Konami.jsx";
import { startFilm, getLenis } from "./lib/film.js";
import "./styles.css";

function Site({ children }) {
  const { pathname, hash } = useLocation();
  // rolagem de filme (inércia + cenas amarradas ao scroll) enquanto o site está aberto
  useEffect(() => startFilm(), []);
  useEffect(() => {
    // com âncora (#catalogo), rola até a seção; sem âncora, volta ao topo
    const el = hash && document.querySelector(hash);
    const lenis = getLenis();
    if (el) requestAnimationFrame(() => (lenis ? lenis.scrollTo(el, { offset: -80, immediate: true }) : el.scrollIntoView()));
    else lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <Hud />
      <SectionWipe />
      <Konami />
      <Loader />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocaleProvider>
      {/* As rotas continuam as mesmas (/, /inicio...), dentro da base do site (/sorry). */}
      <BrowserRouter basename={import.meta.env.BASE_URL.slice(0, -1)}>
        <Grain />
        <CursorLight />
        <Cursor />
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/inicio" element={<Site><Landing /></Site>} />
          {/* endereços da versão anterior levam às seções da landing */}
          <Route path="/projetos/*" element={<Navigate to="/inicio#smart7" replace />} />
          <Route path="/skills" element={<Navigate to="/inicio#sobre" replace />} />
          <Route path="*" element={<Site><NotFound /></Site>} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  </StrictMode>,
);
