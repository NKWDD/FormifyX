import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Set this to '/' for a custom domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // This is the default, but you can customize it
  },
});