import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5172, // Unique port for download
    strictPort: true,
    host: true,
    cors: true,
    origin: 'http://localhost:8000',
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    
  },
  base: '/clients/download/'
})
