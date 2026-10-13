import { useLocale } from "../i18n.jsx";

// Print do Smart7 que acompanha o tema do site: as duas versões ficam no HTML e o CSS mostra só a do tema
// ativo. Com loading="lazy", o navegador não baixa a versão escondida (display: none).
export default function Shot({ shot, className = "", alt, ...rest }) {
  const { pick } = useLocale();
  const text = alt ?? pick(shot.alt);
  return (
    <>
      <img className={`${className} only-dark`} src={shot.src} alt={text} loading="lazy" draggable="false" {...rest} />
      <img className={`${className} only-light`} src={shot.srcLight} alt={text} loading="lazy" draggable="false" {...rest} />
    </>
  );
}
