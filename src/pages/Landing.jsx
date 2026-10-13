import { useLocale } from "../i18n.jsx";
import { site } from "../data/site.js";
import { SHOTS, STATS, HIGHLIGHTS, METHOD, MODULES } from "../data/smart7.js";
import DiscordCard from "../components/DiscordCard.jsx";
import Halftone from "../components/Halftone.jsx";
import Catalog from "../components/Catalog.jsx";
import { Reveal } from "../components/Chrome.jsx";
import { useLanyard } from "../lib/lanyard.js";

// Título com uma palavra de destaque em itálico: "Do código / ao *balcão*."
function Title({ as: Tag = "h2", parts, className = "" }) {
  const { pick } = useLocale();
  return (
    <Tag className={`ltitle ${className}`}>
      {pick(parts).map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <em key={i}>{p.em}</em>
        ),
      )}
    </Tag>
  );
}

function Kicker({ n, children }) {
  return (
    <Reveal as="p" className="lkicker mono">
      <span className="dot">{n}</span>
      <i />
      {children}
    </Reveal>
  );
}

const TOOLS = ["VS Code", "Photoshop", "Python", "Claude", "TypeScript", "React", "Node.js"];

export default function Landing() {
  const { t, pick, lang } = useLocale();
  const L = t.landing;
  const presence = useLanyard();
  const marquee = MODULES.map((m) => pick(m.title));

  return (
    <main className="landing">
      {/* ── hero ─────────────────────────────────────────── */}
      <section className="lhero" id="inicio">
        <Halftone className="lhero__dots" />
        <div className="lhero__copy">
          <Reveal as="p" className="lkicker mono">
            <span className="pulse" /> {L.hero.kicker}
          </Reveal>
          <Reveal delay={80}>
            <Title as="h1" parts={L.hero.title} className="lhero__title" />
          </Reveal>
          <Reveal as="p" delay={180} className="lhero__lead">
            {L.hero.lead}
          </Reveal>
          <Reveal delay={260} className="lhero__cta">
            <a className="btn btn--volt" href="#smart7">
              {L.hero.cta} →
            </a>
            <a className="btn" href="#catalogo">
              {L.hero.cta2}
            </a>
          </Reveal>
        </div>
        <div className="lhero__strip mono">
          <span>FIG. 01 · {L.hero.fig}</span>
          <span>
            DISCORD · <b data-status={presence?.discord_status ?? "offline"}>{t.discord[presence?.discord_status ?? "offline"]}</b>
          </span>
          <span>SMART7 · 82 {L.hero.perms}</span>
          <span>({L.hero.scroll})</span>
        </div>
      </section>

      <div className="marquee mono" aria-hidden="true">
        <div>
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* ── 01 · produto ─────────────────────────────────── */}
      <section className="lsec" id="smart7">
        <div className="lsec__head">
          <div>
            <Kicker n="01">{L.product.kicker}</Kicker>
            <Reveal>
              <Title parts={L.product.title} />
            </Reveal>
          </div>
          <Reveal as="p" delay={120} className="lsec__lead">
            {L.product.lead}
          </Reveal>
        </div>
        <Reveal className="screen">
          <div className="screen__bar mono">
            <span>smart7 · {L.product.screen}</span>
            <span>{L.product.demo}</span>
          </div>
          <img src={SHOTS.dashboard.src} alt={pick(SHOTS.dashboard.alt)} />
        </Reveal>
        <dl className="lstats">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 70}>
              <dt>{s.value}</dt>
              <dd className="mono">{pick(s.label)}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ── 02 · destaques ───────────────────────────────── */}
      <section className="lsec" id="destaques">
        <div className="lsec__head">
          <div>
            <Kicker n="02">{L.highlights.kicker}</Kicker>
            <Reveal>
              <Title parts={L.highlights.title} />
            </Reveal>
          </div>
          <Reveal as="p" delay={120} className="lsec__lead">
            {L.highlights.lead}
          </Reveal>
        </div>
        <div className="hl">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.letter} delay={(i % 2) * 90} className={`hl__card hl__card--${h.letter.toLowerCase()}`}>
              <p className="hl__tag mono">
                <span className="hl__letter">{h.letter}</span>
                {pick(h.tag)}
              </p>
              <h3>{pick(h.title)}</h3>
              <p className="hl__text">{pick(h.text)}</p>
              {h.chips && (
                <ul className="chips">
                  {h.chips.map((c) => (
                    <li key={c} className="mono">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {h.shot && (
                <div className="hl__shot">
                  <img src={SHOTS[h.shot].src} alt={pick(SHOTS[h.shot].alt)} loading="lazy" />
                </div>
              )}
              {h.flow && (
                <ol className="hl__flow mono">
                  {(lang === "pt" ? h.flow : h.flowEn).map((f, k) => (
                    <li key={f} style={{ "--k": k }}>
                      {f}
                    </li>
                  ))}
                </ol>
              )}
              {h.perms && (
                <pre className="hl__perms mono" aria-label={L.highlights.permsAria}>
                  <span className="c">// {L.highlights.permsNote}</span>
                  {"\n"}
                  {"{"}
                  {"\n"}
                  {'  "perfil": "vendedor",'}
                  {"\n"}
                  {h.perms.map(([k, ok]) => (
                    <span key={k} className={ok ? "ok" : "no"}>
                      {`  "${k}": ${ok},`}
                      {"\n"}
                    </span>
                  ))}
                  {"}"}
                </pre>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 03 · método ──────────────────────────────────── */}
      <section className="lsec" id="metodo">
        <div className="lsec__head">
          <div>
            <Kicker n="03">{L.method.kicker}</Kicker>
            <Reveal>
              <Title parts={L.method.title} />
            </Reveal>
          </div>
          <Reveal as="p" delay={120} className="lsec__lead">
            {L.method.lead}
          </Reveal>
        </div>
        <ol className="method">
          {METHOD.map((m, i) => (
            <Reveal as="li" key={m.n} delay={i * 90}>
              <span className="method__n mono">{m.n}</span>
              <h3>{pick(m.title)}</h3>
              <p>{pick(m.text)}</p>
              <ul className="chips">
                {m.tags.map((x) => (
                  <li key={x} className="mono">
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── 04 · quem fez ────────────────────────────────── */}
      <section className="lsec" id="sobre">
        <div className="lsec__head">
          <div>
            <Kicker n="04">{L.about.kicker}</Kicker>
            <Reveal>
              <Title parts={L.about.title} />
            </Reveal>
          </div>
          <Reveal as="p" delay={120} className="lsec__lead">
            {L.about.lead}
          </Reveal>
        </div>
        <div className="about">
          <div className="crafts crafts--landing">
            {L.about.crafts.map((c, i) => (
              <Reveal as="div" key={c.name} delay={i * 80} className="craft">
                <p className="craft__num mono">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="craft__title">{c.name}</h3>
                <p className="craft__lead">{c.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150} className="about__side">
            <DiscordCard presence={presence} />
            <ul className="about__tools mono">
              {TOOLS.map((x, i) => (
                <li key={x}>
                  <span className="dot">{String(i + 1).padStart(2, "0")}</span> {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 05 · catálogo ────────────────────────────────── */}
      <section className="lsec lsec--catalog" id="catalogo">
        <div className="lsec__head">
          <div>
            <Kicker n="05">{L.catalog.kicker}</Kicker>
            <Reveal>
              <Title parts={L.catalog.title} />
            </Reveal>
          </div>
          <Reveal as="p" delay={120} className="lsec__lead">
            {L.catalog.lead}
          </Reveal>
        </div>
        <Catalog />
      </section>

      {/* ── contato ──────────────────────────────────────── */}
      <section className="lcontact" id="contato">
        <Kicker n="06">{L.contact.kicker}</Kicker>
        <Reveal>
          <Title parts={L.contact.title} />
        </Reveal>
        <div className="lcontact__links">
          {site.socials.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <a href={s.url} target="_blank" rel="noreferrer">
                <span className="mono">{s.label}</span>
                <span>{s.handle}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
