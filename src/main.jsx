import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LocaleProvider } from "./i18n.jsx";
import Opening from "./components/Opening.jsx";
import { Nav, Footer, Grain, CursorLight } from "./components/Chrome.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Skills from "./pages/Skills.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./styles.css";

function Site({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
          <Route path="/inicio" element={<Site><Home /></Site>} />
          <Route path="/projetos" element={<Site><Projects /></Site>} />
          <Route path="/projetos/:slug" element={<Site><ProjectDetail /></Site>} />
          <Route path="/skills" element={<Site><Skills /></Site>} />
          <Route path="*" element={<Site><NotFound /></Site>} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  </StrictMode>,
);
