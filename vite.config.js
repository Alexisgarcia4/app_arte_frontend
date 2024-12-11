import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // Expone el servidor a todas las interfaces de red
    port: process.env.PORT || 3000  // Usa el puerto proporcionado por Render o 3000 por defecto
  }
  
})
