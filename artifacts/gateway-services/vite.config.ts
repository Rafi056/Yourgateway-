import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        (await import("autoprefixer")).default(),
        (await import("tailwindcss")).default(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared/routes": path.resolve(import.meta.dirname, "src/shared/routes.ts"),
      "@shared/schema": path.resolve(import.meta.dirname, "src/shared/schema.ts"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
  },
  preview: {
    port,
    host: "0.0.0.0",
  },
});
