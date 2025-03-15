import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/FormifyX/', // Ensure this matches your GitHub repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // This is the default, but you can customize it
  },
});