import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_API_URL env var allows switching between local dev and production.
// Default: production API Gateway.
// Usage: VITE_API_URL=http://localhost:3000 yarn dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
