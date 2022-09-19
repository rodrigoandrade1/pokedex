import { fileURLToPath, URL } from "node:url";
import path from 'path'

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  // root: path.resolve(__dirname),
  base: '/<REPO>/',
  build: {
    outDir: "docs",
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
