import { useState } from "react";
import { useLocale } from "../i18n.jsx";
import data from "../data/screen.json";

// Filmes e séries como baralhos: cada grupo é um maço em leque, com o pôster numa carta de baralho
// (número e naipe nos cantos). Passar o mouse abre o leque; clicar puxa a próxima carta para o topo.
// Pôsteres do TMDB, gerados por scripts/fetch-tmdb.mjs.
const IMG = "https://image.tmdb.org/t/p/w342";
const FAN = 6; // cartas visíveis no leque

const DECKS = {
  favoritos: { suit: "★", name: { pt: "Favorito", en: "Favorite" } },
  nolan: { suit: "♠", name: { pt: "Christopher Nolan", en: "Christopher Nolan" } },
  marvel: { suit: "♥", name: { pt: "Marvel", en: "Marvel" } },
  dc: { suit: "♦", name: { pt: "DC", en: "DC" } },
  favoritas: { suit: "★", name: { pt: "Favoritas", en: "Favorites" } },
  hbo: { suit: "♣", name: { pt: "HBO", en: "HBO" } },
  herois: { suit: "♥", name: { pt: "Marvel & DC", en: "Marvel & DC" } },
};
const RED = new Set(["♥", "♦"]);

function Deck({ id, items }) {
  const { pick, lang, t } = useLocale();
  const [top, setTop] = useState(0);
  const [thrown, setThrown] = useState(null); // carta que acabou de sair do topo (anima voando)
  const { suit, name } = DECKS[id];
  const n = items.length;
  // ordem do maço: a carta do topo é a última desenhada
  const hand = Array.from({ length: Math.min(FAN, n) }, (_, k) => (top + k) % n).reverse();
  const current = items[top];
  const title = (x) => (lang === "pt" ? x.pt : x.en);

  return (
    <figure className={`deck ${RED.has(suit) ? "deck--red" : ""} ${n === 1 ? "deck--single" : ""}`}>
      <button
        className="deck__hand"
        onClick={() => {
          setThrown({ idx: top, key: Date.now() });
          setTop((top + 1) % n);
        }}
        aria-label={`${pick(name)}: ${title(current)}. ${n > 1 ? t.landing.screen.next : ""}`}
        disabled={n === 1}
      >
        {hand.map((idx, k) => {
          const depth = hand.length - 1 - k; // 0 = topo
          const x = items[idx];
          return (
            <span key={x.id} className="pcard" style={{ "--d": depth, zIndex: k }}>
              <span className="pcard__face">
                <img src={`${IMG}${x.poster}`} alt="" loading="lazy" draggable="false" />
              </span>
              <span className="pcard__pip pcard__pip--tl">
                <b>{String(idx + 1).padStart(2, "0")}</b>
                <i>{suit}</i>
              </span>
              <span className="pcard__pip pcard__pip--br">
                <b>{String(idx + 1).padStart(2, "0")}</b>
                <i>{suit}</i>
              </span>
            </span>
          );
        })}
        {thrown && n > 1 && (
          <span key={thrown.key} className="pcard pcard--out" aria-hidden="true" onAnimationEnd={() => setThrown(null)}>
            <span className="pcard__face">
              <img src={`${IMG}${items[thrown.idx].poster}`} alt="" draggable="false" />
            </span>
          </span>
        )}
      </button>
      <figcaption className="deck__cap">
        <span className="deck__name">
          <i>{suit}</i> {pick(name)}
        </span>
        <span className="deck__now mono">
          {title(current)} · {current.year}
        </span>
        <span className="deck__count mono">
          {String(top + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Decks({ tab }) {
  return (
    <div className="decks">
      {data.rows[tab].map((r) => (
        <Deck key={r.id} id={r.id} items={r.items} />
      ))}
    </div>
  );
}
