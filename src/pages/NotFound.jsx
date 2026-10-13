import { Link } from "react-router-dom";
import { useLocale } from "../i18n.jsx";

export default function NotFound() {
  const { t } = useLocale();
  return (
    <main className="page notfound">
      <p className="kicker mono">404 · 00:00:00:00</p>
      <h1 className="page-title">{t.notFound}</h1>
      <Link className="btn btn--volt" to="/inicio">
        {t.nav.home} →
      </Link>
    </main>
  );
}
