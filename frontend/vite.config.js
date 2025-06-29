import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  build: {
        rollupOptions: {
      // Optional: Externalize big packages
      external: ['@mui/icons-material']
    }
  },
})
