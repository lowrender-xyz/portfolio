import { useState } from "react";
import { useLocale } from "../i18n.jsx";
import { site } from "../data/site.js";
import { SHOTS, STATS, MODULES } from "../data/smart7.js";
import { GAMES, SCREEN, TOOLS, ARTISTS, sameArtist } from "../data/me.js";
import DiscordCard from "../components/DiscordCard.jsx";
import Halftone from "../components/Halftone.jsx";
import ModuleExplorer from "../components/ModuleExplorer.jsx";
import Shot from "../components/Shot.jsx";
import NowPlaying from "../components/NowPlaying.jsx";
import TornPaper from "../components/TornPaper.jsx";
import Decks from "../components/Decks.jsx";
import GameCover from "../components/GameCover.jsx";
import { Reveal } from "../components/Chrome.jsx";
import { useLanyard } from "../lib/lanyard.js";

// Título com uma palavra de destaque em itálico: "Código, design / e *movimento.*"
function Title({ as: Tag = "h2", parts, className = "" }) {
  return (
    <Tag className={`ltitle ${className}`}>
      {parts.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : <em key={i}>{p.em}</em>))}
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

function Head({ n, k, title, lead }) {
  return (
    <div className="lsec__head">
      <div>
        <Kicker n={n}>{k}</Kicker>
        <Reveal>
          <Title parts={title} />
        </Reveal>
      </div>
      {lead && (
        <Reveal as="p" delay={120} className="lsec__lead">
          {lead}
        </Reveal>
      )}
    </div>
  );
}

// jogo que o Discord diz que está aberto agora (atividade do tipo "Jogando")
function playingNow(presence) {
  const names = (presence?.activities ?? []).filter((a) => a.type === 0).map((a) => a.name.toLowerCase());
  return GAMES.find((g) => g.match.some((m) => names.some((n) => n.includes(m))))?.title ?? null;
}

export default function Landing() {
  const { t, pick, lang } = useLocale();
  const L = t.landing;
  const presence = useLanyard();
  const live = playingNow(presence);
  const spotify = presence?.listening_to_spotify ? presence.spotify : null;
  // o Spotify manda os artistas separados por "; "
  const hearing = spotify ? spotify.artist.split(/;\s*/) : [];
  const [shelf, setShelf] = useState("films");
  const marquee = [...GAMES.map((g) => g.title), "Interestelar", "Suits", "Jumper", ...ARTISTS.slice(0, 4), pick(SCREEN.genres[1]), L.marqueeAi];

  return (
    <main className="landing">
      {/* ── hero ─────────────────────────────────────────── */}
      <section className="lhero" id="inicio">
        <Halftone className="lhero__dots" />
        <div className="lhero__grid">
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
              <a className="btn btn--volt" href="#jogos">
                {L.hero.cta} →
              </a>
              <a className="btn" href="#projetos">
                {L.hero.cta2}
              </a>
            </Reveal>
          </div>
          <Reveal delay={220} className="lhero__card">
            <DiscordCard presence={presence} />
          </Reveal>
        </div>
        <div className="lhero__strip mono">
          <span>FIG. 01 · {L.hero.fig}</span>
          <span>
            DISCORD · <b data-status={presence?.discord_status ?? "loading"}>{t.discord[presence?.discord_status ?? "loading"]}</b>
          </span>
          <span>{live ? `${L.games.now} · ${live}` : L.hero.idle}</span>
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

      {/* ── 01 · jogos ───────────────────────────────────── */}
      <section className="lsec" id="jogos">
        <Head n="01" k={L.games.kicker} title={L.games.title} lead={L.games.lead} />
        <ol className="shelf-games">
          {GAMES.map((g, i) => (
            <Reveal as="li" key={g.title} delay={(i % 8) * 60} className={`gcard ${live === g.title ? "is-live" : ""}`}>
              <GameCover game={g} live={live === g.title} label={L.games.now} />
              <p className="gcard__title">
                {g.title}
                {g.sub && <span> {g.sub}</span>}
              </p>
              <p className="gcard__meta mono">{pick(g.genre)}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── 02 · filmes e séries ─────────────────────────── */}
      <section className="lsec" id="tela">
        <Head n="02" k={L.screen.kicker} title={L.screen.title} lead={L.screen.lead} />
        <div className="shelf-tabs" role="tablist">
          {["films", "series"].map((k) => (
            <button key={k} role="tab" aria-selected={shelf === k} className="mono" onClick={() => setShelf(k)}>
              {L.screen.tabs[k]}
            </button>
          ))}
          <span className="shelf-tabs__genres mono">
            {SCREEN.genres.map((g) => (
              <span key={g.pt}>✦ {pick(g)}</span>
            ))}
          </span>
        </div>
        <Decks tab={shelf} key={shelf} />
      </section>

      {/* ── 03 · música ──────────────────────────────────── */}
      <section className="lsec" id="musica">
        <Head n="03" k={L.music.kicker} title={L.music.title} lead={L.music.lead} />
        <div className="music">
          <ol className="artists">
            {ARTISTS.map((a, i) => {
              const on = hearing.some((h) => sameArtist(h, a));
              // inclinação e rasgo próprios de cada tira, sempre os mesmos
              const tilt = [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7, -1.9][i % 7];
              return (
                <Reveal as="li" key={a} delay={i * 60} className={on ? "is-live" : ""}>
                  <TornPaper seed={i * 7 + 3} tilt={tilt} className="strip">
                    <span className="strip__n mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="strip__name">{a}</span>
                    {on && <b className="strip__live mono">● {L.music.now}</b>}
                  </TornPaper>
                </Reveal>
              );
            })}
          </ol>
          <Reveal delay={150} className="music__now">
            <TornPaper seed={91} tilt={1.4} className="paper--tape music__paper" depth={9}>
              <NowPlaying spotify={spotify} />
            </TornPaper>
          </Reveal>
        </div>
      </section>

      {/* ── 04 · IA e projetos ───────────────────────────── */}
      <section className="lsec" id="projetos">
        <Head n="04" k={L.lab.kicker} title={L.lab.title} lead={L.lab.lead} />
        <Reveal className="project">
          <div>
            <p className="mono kicker">{L.lab.projectKicker}</p>
            <h3 className="project__name">
              Smart<span className="dot">7</span>
            </h3>
            <p className="project__line">{L.lab.projectLine}</p>
          </div>
          <dl className="project__stats">
            {STATS.map((s) => (
              <div key={s.value}>
                <dt>{s.value}</dt>
                <dd className="mono">{pick(s.label)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={100} id="catalogo" className="catalog-wrap">
          <ModuleExplorer />
        </Reveal>
      </section>

      {/* ── 05 · sobre ───────────────────────────────────── */}
      <section className="lsec" id="sobre">
        <Head n="05" k={L.about.kicker} title={L.about.title} lead={L.about.lead} />
        <div className="crafts crafts--landing">
          {L.about.crafts.map((c, i) => (
            <Reveal as="div" key={c.name} delay={i * 80} className="craft">
              <p className="craft__num mono">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="craft__title">{c.name}</h3>
              <p className="craft__lead">{c.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="ul" className="about__tools mono">
          {TOOLS.map((x, i) => (
            <li key={x}>
              <span className="dot">{String(i + 1).padStart(2, "0")}</span> {x}
            </li>
          ))}
        </Reveal>
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
