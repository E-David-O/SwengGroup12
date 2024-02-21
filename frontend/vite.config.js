// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    host: true,
    strictPort: true,
    port: 3000,
    origin: "http:/localhost:5000"
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setupTests.js'],
    testMatch: ['./test/**/*.test.jsx'],
  },
})
