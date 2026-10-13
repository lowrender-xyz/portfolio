import { useLocale } from "../i18n.jsx";
import { useTransitionNavigate } from "../lib/transition.js";

// Capa tipográfica: usada enquanto o projeto não tem capturas próprias.
export function Cover({ project, index, large = false }) {
  const { t, pick } = useLocale();
  const shot = project.shots?.[0];
  return (
    <div className={`cover ${large ? "cover--large" : ""}`} style={{ viewTransitionName: `cover-${project.slug}` }}>
      {shot ? (
        <img src={shot.src} alt={pick(shot.alt)} />
      ) : project.mark ? (
        <img className="cover__mark" src={project.mark} alt="" />
      ) : (
        <span className="cover__num">{String(index + 1).padStart(2, "0")}</span>
      )}
      <span className="cover__meta mono">
        {t.kinds[project.kind]} · {project.year}
      </span>
    </div>
  );
}

export default function ProjectCard({ project, index }) {
  const { t, pick } = useLocale();
  const go = useTransitionNavigate();

  if (project.soon) {
    return (
      <article className="pcard pcard--soon">
        <div className="cover cover--soon">
          <span className="mono">{t.soon}</span>
        </div>
        <div className="pcard__body">
          <p className="pcard__kind mono">
            {String(index + 1).padStart(2, "0")} · {t.kinds[project.kind]}
          </p>
          <h3 className="pcard__title">{pick(project.title)}</h3>
          <p className="pcard__line">{pick(project.tagline)}</p>
        </div>
      </article>
    );
  }

  const href = `/projetos/${project.slug}`;
  return (
    <article className="pcard">
      <a
        href={href}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          go(href);
        }}
      >
        <Cover project={project} index={index} />
        <div className="pcard__body">
          <p className="pcard__kind mono">
            {String(index + 1).padStart(2, "0")} · {t.kinds[project.kind]}
            {project.private && <span className="pcard__lock"> · {t.privateCode}</span>}
          </p>
          <h3 className="pcard__title">{project.title}</h3>
          <p className="pcard__line">{pick(project.tagline)}</p>
          <span className="pcard__go mono">{t.openProject} →</span>
        </div>
      </a>
    </article>
  );
}
