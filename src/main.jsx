import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LocaleProvider } from "./i18n.jsx";
import Opening from "./components/Opening.jsx";
import { Nav, Footer, Grain, CursorLight } from "./components/Chrome.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./styles.css";

function Site({ children }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // com âncora (#catalogo), rola até a seção; sem âncora, volta ao topo
    const el = hash && document.querySelector(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocaleProvider>
      <BrowserRouter>
        <Grain />
        <CursorLight />
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
