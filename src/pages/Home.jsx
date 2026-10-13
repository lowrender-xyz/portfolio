import { Link } from "react-router-dom";
import { useLocale } from "../i18n.jsx";
import { projects } from "../data/projects.js";
import { site } from "../data/site.js";
import DiscordCard from "../components/DiscordCard.jsx";
import ProjectCard, { Cover } from "../components/ProjectCard.jsx";
import { Reveal } from "../components/Chrome.jsx";
import { useTransitionNavigate } from "../lib/transition.js";

const TOOLS = ["VS Code", "Photoshop", "Python", "Claude", "TypeScript", "React", "Node.js"];

export default function Home() {
  const { t, pick } = useLocale();
  const go = useTransitionNavigate();
  const [featured, ...others] = projects;
  const rest = others.filter((p) => !p.soon);

  return (
    <main className="page home">
      <section className="hero">
        <div className="hero__text">
          <Reveal as="p" className="kicker mono">
            {t.heroKicker}
          </Reveal>
          <h1 className="hero__nick">
            <Reveal as="span" delay={80}>
              sorry<span className="dot">.</span>
            </Reveal>
          </h1>
          <Reveal as="p" delay={180} className="hero__line">
            {t.heroLine}
          </Reveal>
          <Reveal delay={260} className="hero__cta">
            <Link className="btn btn--volt" to="/projetos">
              {t.seeProjects} →
            </Link>
            <a className="btn" href={site.socials[0].url} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </Reveal>
        </div>
        <Reveal delay={200} className="hero__card">
          <DiscordCard />
        </Reveal>
      </section>

      <section className="tools" aria-label={t.tools}>
        <span className="tools__label mono">{t.tools}</span>
        <ul>
          {TOOLS.map((tool, i) => (
            <li key={tool}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span> {tool}
            </li>
          ))}
        </ul>
      </section>

      <section className="featured">
        <Reveal as="p" className="kicker mono">
          ★ {t.featured}
        </Reveal>
        <a
          className="featured__card"
          href={`/projetos/${featured.slug}`}
          onClick={(e) => {
            e.preventDefault();
            go(`/projetos/${featured.slug}`);
          }}
        >
          <Cover project={featured} index={0} large />
          <div className="featured__body">
            <h2 className="featured__title">{featured.title}</h2>
            <p className="featured__line">{pick(featured.tagline)}</p>
            <dl className="stats">
              {featured.stats.map((s) => (
                <div key={s.value}>
                  <dt>{s.value}</dt>
                  <dd className="mono">{pick(s.label)}</dd>
                </div>
              ))}
            </dl>
            <span className="pcard__go mono">{t.openProject} →</span>
          </div>
        </a>
      </section>

      <section className="more">
        <div className="section-head">
          <Reveal as="h2">{t.moreProjects}</Reveal>
          <Link className="mono link" to="/projetos">
            {t.allProjects} →
          </Link>
        </div>
        <div className="grid grid--3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProjectCard project={p} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
