import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

// Navegação com View Transitions: elementos com o mesmo view-transition-name viram um só
// (botão Entrar → moldura do cabeçalho, cartão do projeto → capa). Sem suporte, navega direto.
export function useTransitionNavigate() {
  const navigate = useNavigate();
  return (to) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return navigate(to);
    document.startViewTransition(() => {
      flushSync(() => navigate(to));
      window.scrollTo(0, 0);
    });
  };
}
