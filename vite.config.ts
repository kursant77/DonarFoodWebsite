import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// ❌ import.meta.dirname yo‘q — buning o‘rniga path.dirname(import.meta.url)
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // ⚠️ await ishlatib bo‘lmaydi to‘g‘ridan-to‘g‘ri array ichida — shu uchun promise emas, oddiy import ishlatamiz
          // yoki bu pluginlar kerak bo‘lmasa butunlay olib tashla
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  root: path.resolve(__dirname, "client"),

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      // 🔁 Barcha API so‘rovlarini 5000-portdagi backend’ga yo‘naltirish
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
