import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Unique port for settings
    strictPort: true,
    host: true,
    cors: true,
    origin: 'http://localhost:8000',
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    
  },
  base: '/clients/settings/'
})
