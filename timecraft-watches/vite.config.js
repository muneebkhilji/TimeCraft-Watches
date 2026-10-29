import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Vite dev server already serves index.html for unknown URLs,
// so routes like /products/p3 work when opened or refreshed directly.
export default defineConfig({
  plugins: [react()],
})
