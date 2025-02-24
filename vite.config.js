import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import daisyui from "daisyui"


// https://vite.dev/config/
export default defineConfig({
  plugins:
    [
      react(),
      tailwindcss(),
      daisyui()
    ],
  server: {
    historyApiFallback: true, // Redirects all routes to index.html
    port: 5173, // Fixed port for development
  },
  preview: {
    port: 5173, // Fixed port for preview after build
  },
})
