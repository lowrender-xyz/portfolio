import { useRef } from "react";
import { useLocale } from "../i18n.jsx";
import data from "../data/screen.json";

// Fileiras de pôsteres do TMDB (dados gerados por scripts/fetch-tmdb.mjs). As imagens vêm da CDN do TMDB.
const IMG = "https://image.tmdb.org/t/p/";

const LABELS = {
  favoritos: { pt: "Favorito", en: "Favorite" },
  nolan: { pt: "Christopher Nolan", en: "Christopher Nolan" },
  marvel: { pt: "Universo Marvel", en: "Marvel Universe" },
  dc: { pt: "Universo DC", en: "DC Universe" },
  favoritas: { pt: "Favoritas", en: "Favorites" },
  hbo: { pt: "HBO · as novas", en: "HBO · the new ones" },
  herois: { pt: "Marvel & DC · séries", en: "Marvel & DC · series" },
};

function Spotlight({ items }) {
  const { lang, t } = useLocale();
  return (
    <div className={`spot spot--${items.length}`}>
      {items.map((x) => (
        <article key={x.id} className="spot__card">
          {x.backdrop && <img className="spot__bg" src={`${IMG}w1280${x.backdrop}`} alt="" loading="lazy" />}
          <img className="spot__poster" src={`${IMG}w342${x.poster}`} alt={lang === "pt" ? x.pt : x.en} loading="lazy" />
          <div className="spot__info">
            <p className="mono kicker">★ {t.landing.screen.favorite}</p>
            <h3>{lang === "pt" ? x.pt : x.en}</h3>
            <p className="mono">
              {x.year}
              {lang === "pt" && x.pt !== x.en ? ` · ${x.en}` : ""}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Row({ id, items, index }) {
  const { lang, pick, t } = useLocale();
  const track = useRef(null);
  const scroll = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="row" aria-label={pick(LABELS[id])}>
      <header className="row__head">
        <p className="mono">
          <span className="dot">{String(index).padStart(2, "0")}</span> {pick(LABELS[id])}
          <span className="row__count">
            {" "}
            · {items.length} {items[0].kind === "movie" ? t.landing.screen.films : t.landing.screen.shows}
          </span>
        </p>
        <div className="row__nav">
          <button className="ring-btn" onClick={() => scroll(-1)} aria-label={t.landing.screen.prev}>
            ←
          </button>
          <button className="ring-btn" onClick={() => scroll(1)} aria-label={t.landing.screen.next}>
            →
          </button>
        </div>
      </header>
      <ol className="row__track" ref={track}>
        {items.map((x) => (
          <li key={x.id} className="poster-card">
            <span className="poster-card__img">
              <img src={`${IMG}w342${x.poster}`} alt="" loading="lazy" />
            </span>
            <span className="poster-card__title">{lang === "pt" ? x.pt : x.en}</span>
            <span className="poster-card__year mono">{x.year}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ScreenRows({ tab }) {
  const rows = data.rows[tab];
  const [spot, ...rest] = rows;
  return (
    <div className="screen-rows">
      <Spotlight items={spot.items} />
      {rest.map((r, i) => (
        <Row key={r.id} id={r.id} items={r.items} index={i + 1} />
      ))}
    </div>
  );
}
