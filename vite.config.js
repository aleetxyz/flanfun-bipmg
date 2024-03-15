import { defineConfig } from "vite";

import react from "@vitejs/plugin-react-swc";
import inject from "@rollup/plugin-inject";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 1337,
    host: true,
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ["Buffer", "Buffer"], process: "process" })],
    },
    outDir: "./build",
  },
});
