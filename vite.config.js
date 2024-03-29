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
      crypto: "crypto-browserify",
      util: "util",
      buffer: "buffer",
      assert: "empty-module",
      http: "empty-module",
      https: "empty-module",
      os: "empty-module",
      url: "empty-module",
      zlib: "empty-module",
      stream: "stream-browserify",
      _stream_duplex: "empty-module",
      _stream_passthrough: "empty-module",
      _stream_readable: "empty-module",
      _stream_writable: "empty-module",
      _stream_transform: "empty-module",
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
  define: {
    global: "globalThis",
  },
});
