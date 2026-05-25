import vikeSolid from "vike-solid/vite";
/// <reference types="@batijs/core/types" />

import vike from "vike/plugin";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), vike(), vikeSolid()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
