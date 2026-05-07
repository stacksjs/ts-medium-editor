import { cp } from 'node:fs/promises'
import { dts } from 'bun-plugin-dtsx'

async function build(): Promise < void> {
  // Build the main library
  await Bun.build( {
    entrypoints: ['src/index.ts'],
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
