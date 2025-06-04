import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'browser',
  outdir: './dist',
  plugins: [dts()],
})

// Build a demo-friendly bundle
await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'browser',
  outdir: './demo',
  naming: 'medium-editor.js',
})
