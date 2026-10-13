import { useLocale } from "../i18n.jsx";
import { useNow, fmt } from "../lib/lanyard.js";

// Player do que está tocando agora no Spotify (dados do Lanyard). A capa tinge o fundo do cartão,
// a barra anda em tempo real e o equalizador só se mexe enquanto há música.
export default function NowPlaying({ spotify }) {
  const { t } = useLocale();
  const M = t.landing.music;
  const now = useNow(Boolean(spotify));

  if (!spotify) {
    return (
      <div className="player player--idle">
        <p className="player__kicker mono">{M.nowKicker}</p>
        <div className="player__idle">
          <span className="eq eq--off" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <p>{M.idle}</p>
        </div>
      </div>
    );
  }

  const { start, end } = spotify.timestamps;
  const total = end - start;
  const elapsed = Math.min(total, Math.max(0, now - start));
  const artists = spotify.artist.replace(/;\s*/g, ", ");

  return (
    <div className="player" style={{ "--art": `url("${spotify.album_art_url}")` }}>
      <div className="player__tint" aria-hidden="true" />
      <p className="player__kicker mono">
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {M.nowKicker}
      </p>
      <img className="player__art" src={spotify.album_art_url} alt={`${spotify.album}`} width="640" height="640" />
      <div className="player__info">
        <p className="player__song" title={spotify.song}>
          {spotify.song}
        </p>
        <p className="player__artist" title={artists}>
          {artists}
        </p>
        <p className="player__album mono">{spotify.album}</p>
      </div>
      <div
        className="player__bar"
        role="progressbar"
        aria-label={M.progress}
        aria-valuemin={0}
        aria-valuemax={Math.round(total / 1000)}
        aria-valuenow={Math.round(elapsed / 1000)}
      >
        <span style={{ width: `${(elapsed / total) * 100}%` }} />
      </div>
      <p className="player__time mono">
        <span>{fmt(elapsed)}</span>
        <span>-{fmt(total - elapsed)}</span>
      </p>
      {spotify.track_id && (
        <a className="player__open mono" href={`https://open.spotify.com/track/${spotify.track_id}`} target="_blank" rel="noreferrer">
          {M.open} ↗
        </a>
      )}
    </div>
  );
}
