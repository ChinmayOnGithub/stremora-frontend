import path from "path";
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins:
    [
      react(),
      tailwindcss(),
    ],
  server: {
    historyApiFallback: true, // Redirects all routes to index.html
    port: 5173, // Fixed port for development
  },
  preview: {
    port: 5173, // Fixed port for preview after build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      treeshake: false, // Workaround for Rollup bug with conditional expressions
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      }
    },
    minify: 'esbuild',
    target: 'esnext'
  }
})
