import { Link } from "react-router-dom";
import { useLocale } from "../i18n.jsx";
import { Reveal } from "../components/Chrome.jsx";

// Ferramentas informadas pelo Keven + o que aparece no código dos projetos (READMEs dos repositórios).
const CRAFTS = [
  {
    kind: "dev",
    lead: {
      pt: "Sistemas web completos, do banco de dados ao app instalável, e bots que organizam comunidades no Discord.",
      en: "Complete web systems, from the database to the installable app, and bots that run Discord communities.",
    },
    tools: ["TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Python", "Flask", "discord.js", "VS Code"],
    proof: { pt: "Smart Loja ERP, bots de setagem e VIP", en: "Smart Loja ERP, role and VIP bots" },
    to: "/projetos",
  },
  {
    kind: "design",
    lead: {
      pt: "Peças visuais e interfaces com hierarquia clara: cada elemento no lugar por um motivo.",
      en: "Visual pieces and interfaces with a clear hierarchy: every element placed for a reason.",
    },
    tools: ["Photoshop"],
    proof: { pt: "Portfólio de design em breve", en: "Design portfolio coming soon" },
  },
  {
    kind: "motion",
    lead: {
      pt: "Movimento escrito em código, com física de mola e ritmo de corte, como o reel da abertura deste site.",
      en: "Motion written in code, with spring physics and cut rhythm, like the reel that opens this site.",
    },
    tools: ["Canvas", "CSS", "Claude"],
    proof: { pt: "Ver o reel da abertura", en: "Watch the opening reel" },
    to: "/",
  },
];

export default function Skills() {
  const { t, pick } = useLocale();
  return (
    <main className="page">
      <header className="page-head">
        <Reveal as="p" className="kicker mono">
          03 · {t.nav.skills}
        </Reveal>
        <h1 className="page-title">
          <Reveal as="span" delay={60}>
            {t.skillsTitle}
          </Reveal>
        </h1>
        <Reveal as="p" delay={140} className="page-lead">
          {t.skillsLead}
        </Reveal>
      </header>
      <div className="crafts">
        {CRAFTS.map((c, i) => (
          <Reveal as="section" key={c.kind} delay={i * 90} className="craft">
            <p className="craft__num mono">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="craft__title">{t.kinds[c.kind]}</h2>
            <p className="craft__lead">{pick(c.lead)}</p>
            <ul className="chips">
              {c.tools.map((tool) => (
                <li key={tool} className="mono">
                  {tool}
                </li>
              ))}
            </ul>
            {c.to ? (
              <Link className="craft__proof mono link" to={c.to}>
                {pick(c.proof)} →
              </Link>
            ) : (
              <p className="craft__proof mono muted">{pick(c.proof)}</p>
            )}
          </Reveal>
        ))}
      </div>
    </main>
  );
}
