import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
