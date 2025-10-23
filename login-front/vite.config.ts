import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
