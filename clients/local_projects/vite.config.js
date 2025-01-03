import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs/promises';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
      // Include JS files in JSX transform
      include: '**/*.{jsx,js}',
  })],
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
    rollupOptions: {
      output: {
        // Ensure proper handling of JSX files
        format: 'es',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    }
  },
  base: '/clients/local-projects/',
  esbuild: {
    loader: 'jsx', // Tell esbuild to handle .js files as JSX
    include: /src\/.*\.jsx?$/, // Apply JSX transform to .js files
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await fs.readFile(args.path, "utf8"),
            }));
          },
        },
      ],
    },
  },
})
