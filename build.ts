import { cp } from 'node:fs/promises'
import { dts } from 'bun-plugin-dtsx'

async function build(): Promise < void> {
  // Build all distinct entrypoints in one pass so they emit as sibling
  // chunks (not bundled into index.js) and the package.json `exports`
  // map can route imports without a second roundtrip. Adding a new
  // entrypoint here is the only step required for a new subpath export.
  await Bun.build( {
    entrypoints: ['src/index.ts', 'src/stx/index.ts'],
    target: 'browser',
    outdir: './dist',
    plugins: [dts()],
  })

  // Build UMD version for browser global usage
  await Bun.build( {
    entrypoints: ['src/browser.ts'],
    target: 'browser',
    outdir: './dist',
    naming: 'medium-editor.umd.js',
  })

  // Copy stylesheets so `ts-medium-editor/css/*` imports (mapped via
  // package.json exports to `./dist/css/*`) resolve.
  await cp('src/css', 'dist/css', { recursive: true })
}

build()

// Demo files are served directly as TypeScript - no build needed
// Bun auto-transpiles .ts files when served
