import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O site mora em lowrender.xyz/sorry/ (a entrada do lowrender repassa /sorry/* para este site):
// tudo é gerado com essa base, e o build vai para dist/sorry para os arquivos ficarem nesse caminho.
export default defineConfig({
  base: "/sorry/",
  plugins: [react()],
  build: { outDir: "dist/sorry", emptyOutDir: true },
});
