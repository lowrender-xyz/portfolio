import { useLocale } from "../i18n.jsx";

// Linha de terminal rolando com dados reais do momento (Discord via Lanyard): status, jogo aberto e música.
export default function Ticker({ presence, live }) {
  const { t } = useLocale();
  const T = t.landing.ticker;
  const status = presence ? t.discord[presence.discord_status] : t.discord.loading;
  const sp = presence?.listening_to_spotify ? presence.spotify : null;
  const lines = [
    `// ${T.sync}`,
    `DISCORD.STATUS = ${status.toUpperCase()}`,
    live ? `GAME.RUNNING = ${live.toUpperCase()}` : `GAME.RUNNING = ${T.none}`,
    sp ? `SPOTIFY.NOW = ${`${sp.song} — ${sp.artist.replace(/;\s*/g, ", ")}`.toUpperCase()}` : `SPOTIFY.NOW = ${T.none}`,
    `PROJECT.SMART7 = ${T.online}`,
  ];
  const row = lines.join("   ·   ");
  return (
    <div className="ticker mono" aria-label={lines.join(". ")}>
      <div aria-hidden="true">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}
