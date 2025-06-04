import type { HeadConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import viteConfig from './vite.config'

// https://vitepress.dev/reference/site-config

const analyticsHead: HeadConfig[] = [
  [
    'script',
    {
      'src': 'https://cdn.usefathom.com/script.js',
      'data-site': 'KXMDAIEU',
      'defer': '',
    },
  ],
]

const nav = [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/intro' },
  { text: 'API', link: '/api' },
  { text: 'GitHub', link: 'https://github.com/stacksjs/ts-medium-editor' },
]

const sidebar = [
  {
    text: 'Get Started',
    items: [
      { text: 'Introduction', link: '/intro' },
      { text: 'Installation', link: '/install' },
      { text: 'Usage', link: '/usage' },
    ],
  },
  {
    text: 'Core Features',
    items: [
      { text: 'Toolbar', link: '/features/toolbar' },
      { text: 'Text Formatting', link: '/features/formatting' },
      { text: 'Placeholder', link: '/features/placeholder' },
      { text: 'Links & Anchors', link: '/features/links' },
      { text: 'Events', link: '/features/events' },
    ],
  },
  {
    text: 'Advanced Usage',
    items: [
      { text: 'Custom Extensions', link: '/advanced/custom-extensions' },
      { text: 'Multiple Editors', link: '/advanced/multiple-editors' },
      { text: 'Real-time Collaboration', link: '/advanced/collaboration' },
      { text: 'Performance Optimization', link: '/advanced/performance' },
      { text: 'Testing', link: '/advanced/testing' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'API Reference', link: '/api' },
      { text: 'Extensions', link: '/extensions' },
    ],
  },
]

const description = 'A modern, TypeScript-first rich text editor inspired by Medium.com'
const title = 'TypeScript Medium Editor | Modern WYSIWYG Editor'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: 'TypeScript Medium Editor',
    description,
    metaChunk: true,
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#3eaf7c' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
      ['meta', { name: 'title', content: title }],
      ['meta', { name: 'description', content: description }],
      ['meta', { name: 'author', content: 'Stacks.js, Inc.' }],
      ['meta', {
        name: 'tags',
        content: 'typescript, medium-editor, wysiwyg, rich-text-editor, contenteditable, toolbar, modern, lightweight',
      }],

      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],

      ['meta', { property: 'og:site_name', content: 'TypeScript Medium Editor' }],
      ['meta', { property: 'og:image', content: './images/og-image.jpg' }],
      ['meta', { property: 'og:url', content: 'https://ts-medium-editor.dev/' }],
      ...analyticsHead,
    ],

    themeConfig: {
      search: {
        provider: 'local',
      },
      logo: {
        light: './images/logo-transparent.svg',
        dark: './images/logo-white-transparent.svg',
      },

      nav,
      sidebar,

      editLink: {
        pattern: 'https://github.com/stacksjs/ts-medium-editor/edit/main/docs/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2024 TypeScript Medium Editor',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/stacksjs/ts-medium-editor' },
      ],

      // algolia: services.algolia,

      // carbonAds: {
      //   code: '',
      //   placement: '',
      // },
    },

    pwa: {
      manifest: {
        theme_color: '#0A0ABC',
      },
    },

    markdown: {
      theme: 'github-dark',
      lineNumbers: true,
    },

    vite: viteConfig,
  }),
)
