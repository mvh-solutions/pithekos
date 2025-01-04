import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Unique port for local_projects
    strictPort: true,
    host: true,
    cors: true,
    origin: 'http://localhost:8000',
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    
  },
  base: '/clients/local-projects/'
})
