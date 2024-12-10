import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //agregado para render
  build: {
    outDir: 'dist', // Asegúrate de que esté configurado como 'dist'
  },
})
