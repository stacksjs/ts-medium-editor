import type { ESLintConfig } from '@stacksjs/eslint-config'
import stacks from '@stacksjs/eslint-config'

const config: ESLintConfig = stacks({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  jsonc: true,
  yaml: true,
  ignores: [
    'src/wrappers/start.js',
    'src/wrappers/end.js',
  ],
})

export default config
