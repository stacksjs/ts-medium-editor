import { dts } from 'bun-plugin-dtsx'

// Build the main library
await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'browser',
  outdir: './dist',
  plugins: [dts()],
})

// Build UMD version for browser global usage
await Bun.build({
  entrypoints: ['src/browser.ts'],
  target: 'browser',
  outdir: './dist',
  naming: 'medium-editor.umd.js',
})

// Demo files are served directly as TypeScript - no build needed
// Bun auto-transpiles .ts files when served
