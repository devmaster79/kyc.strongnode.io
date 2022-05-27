import { defineConfig } from 'vite'
import 'dotenv/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  plugins: [
    // support JSX
    react({
      babel: {
        plugins: ['babel-plugin-macros', '@emotion/babel-plugin']
      }
    }),
    // support absolute imports
    tsconfigPaths(),
    // support importing SVG
    svgrPlugin()
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.REACT_APP_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
