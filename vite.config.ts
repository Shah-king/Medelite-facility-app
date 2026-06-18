import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/cms-provider-data": {
        target: "https://data.cms.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cms-provider-data/, ""),
      },
    },
  },
})
