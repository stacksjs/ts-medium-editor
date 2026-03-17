import type { Theme } from 'vitepress'
import './styles/main.css'
import './styles/overrides.css'
import './styles/vars.css'
import 'uno.css'
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

export default {
  ...DefaultTheme,

  enhanceApp(ctx: any) {
    ctx.app.use(TwoSlashFloatingVue)
  },

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
} satisfies Theme
