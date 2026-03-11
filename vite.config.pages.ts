import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  envPrefix: "VITE_",
  root: path.resolve(import.meta.dirname, "client"),
  base: "/labia-admin/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist-pages"),
    emptyOutDir: true,
  },
  define: {
    "import.meta.env.VITE_BASE_PATH": JSON.stringify("/labia-admin"),
    "import.meta.env.VITE_ANALYTICS_ENDPOINT": JSON.stringify(""),
    "import.meta.env.VITE_ANALYTICS_WEBSITE_ID": JSON.stringify(""),
  },
});
