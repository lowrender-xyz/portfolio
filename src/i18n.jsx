import { createContext, useContext, useEffect, useState } from "react";

const dict = {
  pt: {
    enter: "Entrar",
    role: "dev, design & motion",
    takes: ["Código", "Design", "Motion", "Produto"],
    nav: { home: "Início", projects: "Projetos", skills: "Skills" },
    landingNav: [
      ["#smart7", "Smart7"],
      ["#destaques", "Destaques"],
      ["#metodo", "Método"],
      ["#sobre", "Sobre"],
      ["#catalogo", "Catálogo"],
    ],
    talk: "Falar comigo",
    landing: {
      hero: {
        kicker: "Keven · dev, design & motion",
        title: ["Do código\nao ", { em: "balcão." }],
        lead: "Sou o Keven, o sorry. Construo sistemas que rodam negócio de verdade, como o Smart7, e cuido de como eles parecem e se movem.",
        cta: "Conhecer o Smart7",
        cta2: "Ver os módulos",
        fig: "SINAL AO VIVO",
        perms: "PERMISSÕES",
        scroll: "ROLE",
      },
      product: {
        kicker: "O produto",
        title: ["Uma loja inteira\nem ", { em: "uma tela." }],
        lead: "O Smart7 é um ERP multiloja para varejo: frente de caixa, emissão fiscal, estoque, financeiro e relatórios, com os dados de cada loja isolados. Feito do banco ao app instalável.",
        screen: "visão geral",
        demo: "TELA REAL · DADOS DE DEMONSTRAÇÃO",
      },
      highlights: {
        kicker: "Destaques",
        title: ["Quatro problemas\nque o caixa ", { em: "não pode ter." }],
        lead: "Cada um vira uma regra no código, não um aviso na tela.",
        permsAria: "Exemplo de permissões do perfil vendedor",
        permsNote: "perfil vendedor (padrão do sistema)",
      },
      method: {
        kicker: "Método",
        title: ["Do banco\nao ", { em: "balcão." }],
        lead: "Quatro camadas, uma pessoa. Cada decisão técnica pensando em quem está no caixa às 18h de sábado.",
      },
      about: {
        kicker: "Quem fez",
        title: ["Três ofícios,\num ", { em: "cuidado." }],
        lead: "Funcionar bem e parecer certo. O Smart7 é o dev; este site, com o reel da abertura feito em código, é o design e o motion.",
        crafts: [
          { name: "Dev", text: "Sistemas completos em TypeScript, React, Node e PostgreSQL, além de Python, com regras de negócio que aguentam o dia a dia de uma loja." },
          { name: "Design", text: "Interfaces e peças em Photoshop com hierarquia clara: cada elemento no lugar por um motivo." },
          { name: "Motion", text: "Movimento escrito em código, com física de mola e ritmo de corte, como o reel que abre este site." },
        ],
      },
      catalog: {
        kicker: "Catálogo",
        title: ["Explore cada\n", { em: "módulo." }],
        lead: "Oito áreas do Smart7. Arraste o anel e abra um cartão para ver as telas reais e o que cada área faz.",
        aria: "Módulos do Smart7. Use as setas para girar e Enter para abrir.",
        screens: "TELAS",
        open: "Abrir módulo",
        prev: "Módulo anterior",
        next: "Próximo módulo",
        hint: "ARRASTE O ANEL · ← → NO TECLADO · ENTER ABRE",
        close: "Fechar",
        enlarge: "Ampliar",
        demo: "Telas reais do Smart7 rodando num ambiente local com dados de demonstração fictícios.",
      },
      contact: {
        kicker: "Contato",
        title: ["Tem um negócio\npara ", { em: "rodar?" }],
      },
    },
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
    projectsLead: "Um sistema que roda loja de verdade, do caixa à nota fiscal.",
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
    landingNav: [
      ["#smart7", "Smart7"],
      ["#destaques", "Highlights"],
      ["#metodo", "Method"],
      ["#sobre", "About"],
      ["#catalogo", "Catalog"],
    ],
    talk: "Talk to me",
    landing: {
      hero: {
        kicker: "Keven · dev, design & motion",
        title: ["From code\nto the ", { em: "counter." }],
        lead: "I'm Keven, aka sorry. I build systems that run real businesses, like Smart7, and I care about how they look and move.",
        cta: "Meet Smart7",
        cta2: "See the modules",
        fig: "LIVE SIGNAL",
        perms: "PERMISSIONS",
        scroll: "SCROLL",
      },
      product: {
        kicker: "The product",
        title: ["A whole store\non ", { em: "one screen." }],
        lead: "Smart7 is a multi-store retail ERP: point of sale, tax invoicing, stock, finance and reports, with each store's data isolated. Built from the database to the installable app.",
        screen: "overview",
        demo: "REAL SCREEN · DEMO DATA",
      },
      highlights: {
        kicker: "Highlights",
        title: ["Four problems\na register ", { em: "can't have." }],
        lead: "Each one becomes a rule in the code, not a warning on screen.",
        permsAria: "Sample permissions of the salesperson role",
        permsNote: "salesperson role (system default)",
      },
      method: {
        kicker: "Method",
        title: ["From database\nto ", { em: "counter." }],
        lead: "Four layers, one person. Every technical decision made for whoever is at the register at 6 pm on a Saturday.",
      },
      about: {
        kicker: "Who made it",
        title: ["Three crafts,\none ", { em: "standard." }],
        lead: "Work well and look right. Smart7 is the dev; this site, with its code-made opening reel, is the design and motion.",
        crafts: [
          { name: "Dev", text: "Complete systems in TypeScript, React, Node and PostgreSQL, plus Python, with business rules that hold up to a store's daily grind." },
          { name: "Design", text: "Interfaces and Photoshop pieces with a clear hierarchy: every element placed for a reason." },
          { name: "Motion", text: "Motion written in code, with spring physics and cut rhythm, like the reel that opens this site." },
        ],
      },
      catalog: {
        kicker: "Catalog",
        title: ["Explore every\n", { em: "module." }],
        lead: "Eight areas of Smart7. Drag the ring and open a card to see the real screens and what each area does.",
        aria: "Smart7 modules. Use the arrows to rotate and Enter to open.",
        screens: "SCREENS",
        open: "Open module",
        prev: "Previous module",
        next: "Next module",
        hint: "DRAG THE RING · ← → ON KEYBOARD · ENTER OPENS",
        close: "Close",
        enlarge: "Enlarge",
        demo: "Real Smart7 screens running locally with fictional demo data.",
      },
      contact: {
        kicker: "Contact",
        title: ["Got a business\nto ", { em: "run?" }],
      },
    },
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
    projectsLead: "A system that runs real stores, from the register to the tax invoice.",
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
