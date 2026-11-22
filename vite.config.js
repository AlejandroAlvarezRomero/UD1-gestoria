import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves the site under /<repo>/; local dev and preview follow the same prefix.
  base: '/UD1-gestoria/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
  },
  server: { port: 5173, strictPort: true },
}))
