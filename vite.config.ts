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
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp(`^https://masteris4x4.github.io/SpickAppGithubAPI/.*`),
            handler: 'NetworkFirst', // use network if available, but fallback to cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 * 2, // 2 week
              },
            },
          },
          {
            urlPattern: new RegExp(`^https://masteris4x4.github.io/SpickApp/.*`),
            handler: 'StaleWhileRevalidate', // use cache if available, but update in the background
            options: {
              cacheName: 'static-web-app-cache',
              expiration: {
                maxEntries: 500, // ensure we cache enough resources
                maxAgeSeconds: 60 * 60 * 24 * 7 * 2, // 2 week
              },
            },
          }
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
