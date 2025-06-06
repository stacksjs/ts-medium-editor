import { dts } from 'bun-plugin-dtsx'

// Build the main library
await Bun.build({
  entrypoints: ['src/index.ts'],
  target: 'browser',
  outdir: './dist',
  plugins: [dts()],
})

// Build demo files
await Bun.build({
  entrypoints: ['demo/ts/button-example.ts'],
  target: 'browser',
  outdir: './demo/js',
  naming: '[dir]/[name].js',
})
