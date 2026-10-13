import { Link, useParams } from "react-router-dom";
import { useLocale } from "../i18n.jsx";
import { projects, projectBySlug } from "../data/projects.js";
import { Cover } from "../components/ProjectCard.jsx";
import { Reveal } from "../components/Chrome.jsx";
import NotFound from "./NotFound.jsx";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, pick } = useLocale();
  const p = projectBySlug(slug);
  if (!p) return <NotFound />;
  const index = projects.indexOf(p);

  return (
    <main className="page detail">
      <Link className="mono link back" to="/projetos">
        ← {t.back}
      </Link>
      <header className="detail__head">
        <p className="kicker mono">
          {String(index + 1).padStart(2, "0")} · {t.kinds[p.kind]} · {p.year}
        </p>
        <h1 className="page-title">{p.title}</h1>
        <p className="page-lead">{pick(p.tagline)}</p>
      </header>

      <Cover project={p} index={index} large />

      <section className="detail__grid">
        <Reveal className="detail__summary">
          <p>{pick(p.summary)}</p>
          {p.stats && (
            <dl className="stats">
              {p.stats.map((s) => (
                <div key={s.value}>
                  <dt>{s.value}</dt>
                  <dd className="mono">{pick(s.label)}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
        <Reveal as="aside" delay={100} className="detail__side">
          <h2 className="mono">{t.stack}</h2>
          <ul className="chips">
            {p.stack.map((s) => (
              <li key={s} className="mono">
                {s}
              </li>
            ))}
          </ul>
          {p.repo ? (
            <a className="btn btn--volt" href={p.repo} target="_blank" rel="noreferrer">
              {t.viewCode} ↗
            </a>
          ) : (
            <p className="mono muted">{t.privateCode}</p>
          )}
        </Reveal>
      </section>

      {p.features.length > 0 && (
        <section className="features">
          <Reveal as="h2">{t.whatItDoes}</Reveal>
          <ol>
            {p.features.map((f, i) => (
              <Reveal as="li" key={f.title.pt} delay={(i % 2) * 80}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <h3>{pick(f.title)}</h3>
                <p>{pick(f.text)}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {p.shots.length > 1 && (
        <section className="shots">
          {p.shots.slice(1).map((s) => (
            <Reveal as="figure" key={s.src}>
              <img src={s.src} alt={pick(s.alt)} loading="lazy" />
              <figcaption className="mono">{pick(s.alt)}</figcaption>
            </Reveal>
          ))}
        </section>
      )}
    </main>
  );
}
