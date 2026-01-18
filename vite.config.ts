import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// ✅ Konfigurasi agar React Router tetap jalan di Vercel
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',
  },

  server: {
    host: true,
    port: 5173,
    open: true,
  },

  // ✅ tambahkan konfigurasi preview agar semua route diarahkan ke index.html
  preview: {
    port: 4173,
  },
})
