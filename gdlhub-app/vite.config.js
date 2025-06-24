import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@': path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
