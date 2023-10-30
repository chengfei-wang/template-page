import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), jsx()],
  server: {
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 1024,
  }
})
