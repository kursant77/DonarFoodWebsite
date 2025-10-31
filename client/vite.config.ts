import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"), // 🔥 Bu juda muhim!
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
