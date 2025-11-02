import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    open: true,
    watch: {
      // Ative polling se o Vite não detectar alterações (WSL, Docker, network mounts)
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
    },
  },
});
