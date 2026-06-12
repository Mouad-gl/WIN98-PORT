import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using a relative base so the build works whether it's served from a
// domain root (Vercel/Netlify) or a sub-path (GitHub Pages project sites).
export default defineConfig({
  plugins: [react()],
  base: './',
})
