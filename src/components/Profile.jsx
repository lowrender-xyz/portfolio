import { useLocale } from "../i18n.jsx";
import { site } from "../data/site.js";
import { useNow, fmt } from "../lib/lanyard.js";

// Área do perfil: ficha técnica do Discord ao vivo (Lanyard) e os links. A data da conta sai do próprio ID
// do Discord (os 42 bits altos de um "snowflake" são milissegundos desde 2015-01-01).
const createdAt = (id) => new Date(Number((BigInt(id) >> 22n) + 1420070400000n));

export default function Profile({ presence }) {
  const { t, lang } = useLocale();
  const P = t.landing.profile;
  const d = presence;
  const user = d?.discord_user;
  const status = d ? d.discord_status : "loading";
  const spotify = d?.listening_to_spotify ? d.spotify : null;
  const game = d?.activities?.find((a) => a.type === 0) ?? null;
  const custom = d?.activities?.find((a) => a.type === 4)?.state;
  const now = useNow(Boolean(spotify));
  const tag = user?.primary_guild?.identity_enabled ? user.primary_guild : null;
  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=320`
    : "https://cdn.discordapp.com/embed/avatars/0.png";
  const since = createdAt(site.discord.id).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { month: "short", year: "numeric" });

  let doing = P.idle;
  if (spotify) doing = `${t.discord.listening} · ${spotify.song}`;
  else if (game) doing = `${t.discord.playing} · ${game.name}`;

  return (
    <div className="pf">
      <article className="pf__card" data-status={status}>
        <header className="pf__bar mono">
          <span>■ ID {site.discord.id}</span>
          <span className="pf__status">
            <i /> {t.discord[status]}
          </span>
        </header>

        <div className="pf__id">
          <div className="pf__avatar">
            <img src={avatar} alt="" width="160" height="160" />
          </div>
          <div>
            <p className="pf__name">{user?.global_name ?? site.nick}</p>
            <p className="pf__handle mono">
              @{user?.username ?? site.discord.handle}
              {tag && (
                <span className="pf__tag">
                  <img src={`https://cdn.discordapp.com/guild-tag-badges/${tag.identity_guild_id}/${tag.badge}.png?size=24`} alt="" width="12" height="12" />
                  {tag.tag}
                </span>
              )}
            </p>
            {custom && <p className="pf__custom">“{custom}”</p>}
          </div>
        </div>

        <dl className="pf__spec">
          <div>
            <dt className="mono">{P.now}</dt>
            <dd>{doing}</dd>
          </div>
          <div>
            <dt className="mono">{P.since}</dt>
            <dd>{since}</dd>
          </div>
          <div>
            <dt className="mono">{P.name}</dt>
            <dd>Keven</dd>
          </div>
        </dl>

        {spotify && (
          <div className="pf__track">
            <img src={spotify.album_art_url} alt="" />
            <div>
              <p className="pf__song">{spotify.song}</p>
              <p className="pf__artist">{spotify.artist.replace(/;\s*/g, ", ")}</p>
              <span className="pf__bar-line">
                <i style={{ width: `${Math.min(100, ((now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%` }} />
              </span>
              <p className="pf__time mono">
                <span>{fmt(now - spotify.timestamps.start)}</span>
                <span>{fmt(spotify.timestamps.end - spotify.timestamps.start)}</span>
              </p>
            </div>
          </div>
        )}
      </article>

      <ol className="pf__links">
        {site.socials.map((s, i) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noreferrer">
              <span className="pf__n mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="pf__label mono">{s.label}</span>
              <span className="pf__h">{s.handle}</span>
              <span className="pf__go" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
