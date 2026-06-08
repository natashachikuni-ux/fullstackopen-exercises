import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // This MUST be true for the matchers to work globally
    setupFiles: './testSetup.js', 
  },
})