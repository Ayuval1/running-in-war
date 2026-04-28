import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '18' }]],
      },
    }),
    visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'ריצה בזמן מלחמה',
        short_name: 'ריצה בטוחה',
        description: 'תכנן מסלולי ריצה בטוחים ליד מרחבים מוגנים',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#0D1B2A',
        background_color: '#0D1B2A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'nominatim', networkTimeoutSeconds: 5 },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/oref': {
        target: 'https://www.oref.org.il',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oref/, ''),
        headers: { referer: 'https://www.oref.org.il/' },
      },
    },
  },
})
