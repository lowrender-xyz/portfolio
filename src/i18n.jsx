import { createContext, useContext, useEffect, useState } from "react";

const dict = {
  pt: {
    enter: "Entrar",
    role: "dev, design & motion",
    takes: ["Código", "Design", "Motion", "Produto"],
    nav: { home: "Início", projects: "Projetos", skills: "Skills" },
    heroKicker: "Keven · dev, design & motion",
    heroLine: "Construo sistemas que rodam negócio de verdade e cuido de como eles parecem e se movem.",
    seeProjects: "Ver projetos",
    tools: "Ferramentas",
    featured: "Em destaque",
    moreProjects: "Outros projetos",
    allProjects: "Todos os projetos",
    openProject: "Abrir projeto",
    privateCode: "Código privado",
    viewCode: "Ver código",
    soon: "Em breve",
    back: "Voltar aos projetos",
    stack: "Stack",
    whatItDoes: "O que faz",
    projectsTitle: "Projetos",
    projectsLead: "Sistemas, bots e o que mais sair do editor. Design e motion entram aqui assim que forem publicados.",
    skillsTitle: "O que eu faço",
    skillsLead: "Três ofícios, um mesmo cuidado: funcionar bem e parecer certo.",
    kinds: { dev: "Dev", design: "Design", motion: "Motion" },
    discord: {
      online: "Online",
      idle: "Ausente",
      dnd: "Não perturbe",
      offline: "Offline",
      playing: "Jogando",
      listening: "Ouvindo no Spotify",
      watching: "Assistindo",
      streaming: "Em live",
      noActivity: "Sem atividade agora",
      live: "Ao vivo",
      for: "há",
      by: "de",
      profile: "Ver perfil",
    },
    footer: "Feito em código, quadro a quadro.",
    notFound: "Essa cena não existe.",
  },
  en: {
    enter: "Enter",
    role: "dev, design & motion",
    takes: ["Code", "Design", "Motion", "Product"],
    nav: { home: "Home", projects: "Projects", skills: "Skills" },
    heroKicker: "Keven · dev, design & motion",
    heroLine: "I build systems that run real businesses, and I care about how they look and move.",
    seeProjects: "See projects",
    tools: "Tools",
    featured: "Featured",
    moreProjects: "More projects",
    allProjects: "All projects",
    openProject: "Open project",
    privateCode: "Private code",
    viewCode: "View code",
    soon: "Coming soon",
    back: "Back to projects",
    stack: "Stack",
    whatItDoes: "What it does",
    projectsTitle: "Projects",
    projectsLead: "Systems, bots and whatever else leaves the editor. Design and motion land here once published.",
    skillsTitle: "What I do",
    skillsLead: "Three crafts, one standard: work well and look right.",
    kinds: { dev: "Dev", design: "Design", motion: "Motion" },
    discord: {
      online: "Online",
      idle: "Idle",
      dnd: "Do not disturb",
      offline: "Offline",
      playing: "Playing",
      listening: "Listening on Spotify",
      watching: "Watching",
      streaming: "Streaming",
      noActivity: "Nothing going on right now",
      live: "Live",
      for: "for",
      by: "by",
      profile: "View profile",
    },
    footer: "Made in code, frame by frame.",
    notFound: "This scene doesn't exist.",
  },
};

const Ctx = createContext(null);

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "pt" || saved === "en") return saved;
    } catch (e) {}
    return navigator.language?.startsWith("pt") ? "pt" : "en";
  });
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
  }, [lang]);
  // pick(): escolhe a versão do idioma quando o valor é {pt, en}
  const pick = (v) => (v && typeof v === "object" && "pt" in v ? v[lang] : v);
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang], pick }}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);
