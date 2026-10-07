import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Les-derniers-messages/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
