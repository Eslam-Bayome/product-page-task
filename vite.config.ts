/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const fromSrc = (path: string) =>
  fileURLToPath(new URL(`./src/${path}`, import.meta.url));

// Keep in sync with `paths` in tsconfig.app.json.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": fromSrc("components"),
      "@store": fromSrc("store"),
      "@integration": fromSrc("integration"),
      "@config": fromSrc("config"),
      "@lib": fromSrc("lib"),
      "@hooks": fromSrc("hooks"),
      "@messages": fileURLToPath(new URL("./messages", import.meta.url)),
      "@": fromSrc(""),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Playwright owns e2e/.
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
