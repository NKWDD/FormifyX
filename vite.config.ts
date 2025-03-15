import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FormifyX/', // 👈 Make sure this matches your GitHub repository name!
})
