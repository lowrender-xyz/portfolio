import { useEffect, useState } from "react";
import { useLanyard } from "../lib/lanyard.js";
import { site } from "../data/site.js";
import { useLocale } from "../i18n.jsx";

function useNow(active) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

const fmt = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${p(m)}:${p(r)}` : `${m}:${p(r)}`;
};

function assetUrl(app, img) {
  if (!img) return null;
  if (img.startsWith("mp:external/")) return `https://media.discordapp.net/external/${img.slice(12)}`;
  if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.slice(8)}`;
  return `https://cdn.discordapp.com/app-assets/${app}/${img}.png`;
}

export default function DiscordCard({ presence }) {
  const { t } = useLocale();
  const own = useLanyard(presence === undefined);
  const d = presence === undefined ? own : presence;
  const user = d?.discord_user;
  // sem resposta do Lanyard ainda: "conectando", nunca um "offline" falso
  const status = d ? d.discord_status : "loading";
  const custom = d?.activities?.find((a) => a.type === 4);
  const spotify = d?.listening_to_spotify ? d.spotify : null;
  const game = d?.activities?.find((a) => a.type !== 4 && a.type !== 2) ?? null;
  const now = useNow(Boolean(spotify || game?.timestamps?.start));

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=160`
    : "https://cdn.discordapp.com/embed/avatars/0.png";
  const tag = user?.primary_guild?.identity_enabled ? user.primary_guild : null;
  const verb = { 0: t.discord.playing, 1: t.discord.streaming, 3: t.discord.watching };

  return (
    <article className="discord" data-status={status} aria-live="polite">
      <header className="discord__head">
        <span className="discord__live mono">
          <i /> {t.discord.live} · Discord
        </span>
        <a className="discord__link mono" href={site.discord.profileUrl} target="_blank" rel="noreferrer">
          {t.discord.profile} ↗
        </a>
      </header>

      <div className="discord__id">
        <div className="discord__avatar">
          <img src={avatar} alt="" width="64" height="64" />
          <span className="discord__dot" title={t.discord[status]} />
        </div>
        <div>
          <p className="discord__name">
            {user?.global_name ?? site.nick}
            {tag && (
              <span className="discord__tag mono">
                <img
                  src={`https://cdn.discordapp.com/guild-tag-badges/${tag.identity_guild_id}/${tag.badge}.png?size=24`}
                  alt=""
                  width="12"
                  height="12"
                />
                {tag.tag}
              </span>
            )}
          </p>
          <p className="discord__handle mono">
            @{user?.username ?? site.discord.handle} · {t.discord[status]}
          </p>
        </div>
      </div>

      {custom?.state && <p className="discord__custom">“{custom.state}”</p>}

      <div className="discord__activity">
        {spotify ? (
          <div className="act">
            <img className="act__art" src={spotify.album_art_url} alt="" />
            <div className="act__body">
              <p className="act__kind mono">{t.discord.listening}</p>
              <p className="act__title">{spotify.song}</p>
              <p className="act__sub">
                {t.discord.by} {spotify.artist.replace(/;\s*/g, ", ")}
              </p>
              <div className="act__bar">
                <span
                  style={{
                    width: `${Math.min(100, ((now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`,
                  }}
                />
              </div>
              <p className="act__time mono">
                <span>{fmt(now - spotify.timestamps.start)}</span>
                <span>{fmt(spotify.timestamps.end - spotify.timestamps.start)}</span>
              </p>
            </div>
          </div>
        ) : game ? (
          <div className="act">
            {assetUrl(game.application_id, game.assets?.large_image) ? (
              <img className="act__art" src={assetUrl(game.application_id, game.assets.large_image)} alt="" />
            ) : (
              <div className="act__art act__art--empty mono">{game.name.slice(0, 2)}</div>
            )}
            <div className="act__body">
              <p className="act__kind mono">{verb[game.type] ?? t.discord.playing}</p>
              <p className="act__title">{game.name}</p>
              {game.details && <p className="act__sub">{game.details}</p>}
              {game.state && <p className="act__sub">{game.state}</p>}
              {game.timestamps?.start && (
                <p className="act__time mono">
                  <span>
                    {t.discord.for} {fmt(now - game.timestamps.start)}
                  </span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="act__none mono">{t.discord.noActivity}</p>
        )}
      </div>
    </article>
  );
}
