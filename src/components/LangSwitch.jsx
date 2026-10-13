import { useLocale } from "../i18n.jsx";

export default function LangSwitch() {
  const { lang, setLang } = useLocale();
  return (
    <div className="switch mono" role="group" aria-label="Idioma / Language">
      {["pt", "en"].map((l) => (
        <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
