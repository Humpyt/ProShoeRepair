import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
  build: {
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'esbuild',
    // Disable source maps for production
    sourcemap: false,
  },
  // Optimize deps to ensure proper bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@emotion/react', '@emotion/styled', 'clsx'],
  },
});