/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa"
import { defineConfig } from 'vite'

const basePath = '/SpickApp/'

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: { // copy manifest from public/manifest.json
        "short_name": "SpickApp",
        "name": "SpickApp",
        "description": "Romanian learning app for foreign, especially couriers.",
        "icons": [
          {
            "src": "/SpickApp/spickapp-256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-32.png",
            "sizes": "32x32",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-24.png",
            "sizes": "24x24",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-16.png",
            "sizes": "16x16",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "/SpickApp/spickapp-512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
          }
        ],
        "screenshots": [
          {
            "src": "/SpickApp/ss-desk.png",
            "sizes": "1280x720",
            "type": "image/png",
            "focus_mode": "center",
            "form_factor": "wide"
          },
          {
            "src": "/SpickApp/ss-mobile.png",
            "sizes": "720x1280",
            "type": "image/png",
            "focus_mode": "center",
            "form_factor": "narrow"
          }
        ],
        "workbox": {
          "globPatterns": ["**/*.{js,css,html,ico,png,svg,json}"],
        },
        "start_url": "/SpickApp/",
        "display": "standalone",
        "theme_color": "#ffffff",
        "background_color": "#ffffff",
        "orientation": "portrait",
        "display_override": ["standalone", "browser"]
      }
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
