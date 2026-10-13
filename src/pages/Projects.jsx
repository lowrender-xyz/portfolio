import { useLocale } from "../i18n.jsx";
import { projects } from "../data/projects.js";
import ProjectCard from "../components/ProjectCard.jsx";
import { Reveal } from "../components/Chrome.jsx";

export default function Projects() {
  const { t } = useLocale();
  return (
    <main className="page">
      <header className="page-head">
        <Reveal as="p" className="kicker mono">
          {String(projects.filter((p) => !p.soon).length).padStart(2, "0")} · {t.projectsTitle}
        </Reveal>
        <h1 className="page-title">
          <Reveal as="span" delay={60}>
            {t.projectsTitle}
          </Reveal>
        </h1>
        <Reveal as="p" delay={140} className="page-lead">
          {t.projectsLead}
        </Reveal>
      </header>
      <div className="grid grid--3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 70}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
