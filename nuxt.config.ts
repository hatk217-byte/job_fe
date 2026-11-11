import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  routeRules: {
    '/terms': { redirect: '/policy#dieu-khoan-dieu-kien' },
    '/privacy': { redirect: '/policy#chinh-sach-quyen-rieng-tu' },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'vi',
      },

      charset: 'utf-8',
      title: 'TuyenGiaoVien.com',
      titleTemplate: (titleChunk?: string) =>
        titleChunk && String(titleChunk).trim().length > 0
          ? `${String(titleChunk).trim()} - TuyenGiaoVien.com`
          : 'TuyenGiaoVien.com',
      viewport:
        'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${import.meta.env.NUXT_APP_BASE_URL}favicon.ico`,
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/apple-touch-icon.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
        },
      ],
    },
    baseURL: import.meta.env.NUXT_APP_BASE_URL,
  },

  fonts: {
    subsets: ['latin', 'vietnamese'],
    families: [
      {
        name: 'Be Vietnam Pro',
        weights: [300, 400, 500, 600, 700, 800],
        provider: 'google',
      },
      {
        name: 'Plus Jakarta Sans',
        weights: [300, 400, 500, 600, 700, 800],
        provider: 'google',
      },
      {
        name: 'Inter',
        weights: [400, 500, 600, 700, 800],
        provider: 'google',
      },
    ],
  },

  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-lodash',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],

  ui: {
    colorMode: false,
    fonts: false,
  },

  runtimeConfig: {
    public: {
      apiUrl: import.meta.env.NUXT_PUBLIC_API_URL,
      baseUrl: import.meta.env.NUXT_PUBLIC_BASE_URL,
      adminUrl: process.env.NUXT_PUBLIC_ADMIN_URL || import.meta.env.NUXT_PUBLIC_ADMIN_URL,
      cookieDomain: process.env.NUXT_PUBLIC_COOKIE_DOMAIN || import.meta.env.NUXT_PUBLIC_COOKIE_DOMAIN,
      prefixImageUrl: import.meta.env.NUXT_APP_BASE_URL,
      bankCodeApiKey: import.meta.env.NUXT_PUBLIC_BANK_CODE_API_KEY,
      ekycUrl: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_URL,
      ekycApiKey: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_KEY,
      ekycScriptUrl: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_SCRIPT,
      imgbbApiKey: import.meta.env.NUXT_PUBLIC_IMGBB_API_KEY,
    },
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Female Deet App',
      short_name: 'Deet',
      start_url: import.meta.env.NUXT_APP_BASE_URL,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        {
          src: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-512.png`,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      navigateFallback: `${import.meta.env.NUXT_APP_BASE_URL}index.html`,
      globIgnores: ['**/node_modules/**/*'],
      runtimeCaching: [
        {
          urlPattern: '/*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'general-cache',
          },
        },
      ],
    },
    devOptions: {
      enabled: process.env.NODE_ENV !== 'development',
      type: 'module',
    },
  },

  image: {
    dir: 'assets/images',
  },

  imports: {
    dirs: ['stores', 'constants', 'composables', 'enums'],
    autoImport: true,
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  build: {
    transpile: ['vue-i18n'],
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json'),
        ],
      }),
    ],
  },

  i18n: {
    defaultLocale: 'ja',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    vueI18n: '@/i18n.config.ts',
  },
})
