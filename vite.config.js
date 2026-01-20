import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 important for cloud hosting
    port: 5174,
    strictPort: true,
    allowedHosts: [
      'spendify-client-sesf.onrender.com'
    ]
  }
})
