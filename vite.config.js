import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/frontend-opendata/', // <- penting untuk GitHub Pages
  server: {
    port: 3001,
    strictPort: true
  }
})
