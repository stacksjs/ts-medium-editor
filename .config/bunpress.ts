import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'ts-medium-editor',
  description: 'A modern, minimal & performant Medium-like rich text editor',
  url: 'https://ts-medium-editor.netlify.app',

  theme: {
    primaryColor: '#00ab6c',
  },

  sidebar: [
    { text: 'Introduction', link: '/' },
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Toolbar Configuration', link: '/guide/toolbar' },
        { text: 'Extensions', link: '/guide/extensions' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Auto-Link Detection', link: '/features/auto-link' },
        { text: 'Clean Paste', link: '/features/clean-paste' },
        { text: 'Keyboard Commands', link: '/features/keyboard-commands' },
        { text: 'Placeholder', link: '/features/placeholder' },
        { text: 'Multiple Editors', link: '/features/multiple-editors' },
      ],
    },
    {
      text: 'Examples',
      items: [
        { text: 'Basic Editor', link: '/examples/basic' },
        { text: 'Custom Toolbar', link: '/examples/custom-toolbar' },
        { text: 'Static Toolbar', link: '/examples/static-toolbar' },
        { text: 'Theme Switching', link: '/examples/themes' },
      ],
    },
    { text: 'API Reference', link: '/api' },
    { text: 'Configuration', link: '/config' },
  ],

  navbar: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'API', link: '/api' },
    { text: 'Examples', link: '/examples/basic' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-medium-editor' },
  ],

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'og:title', content: 'ts-medium-editor' }],
    ['meta', { name: 'og:description', content: 'A modern Medium-like WYSIWYG editor' }],
  ],
}

export default config
