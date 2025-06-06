import { serve } from 'bun'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'

const PORT = 3000
const publicDir = join(import.meta.dir, 'demo')
const srcDir = join(import.meta.dir, 'src')
const distDir = join(import.meta.dir, 'dist')

// MIME types
const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ts': 'application/javascript', // We'll transpile TypeScript on the fly
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  return mimeTypes[ext] || 'text/plain'
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  let pathname = url.pathname

  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/nested-editable.html'
  }

  // Remove leading slash
  pathname = pathname.slice(1)

  // Handle different file locations
  let filePath: string
  let content: string | Buffer

  try {
    if (pathname.startsWith('src/')) {
      // Serve source files from src directory
      filePath = join(srcDir, pathname.slice(4))
    }
    else if (pathname.startsWith('dist/')) {
      // Serve built files from dist directory
      filePath = join(distDir, pathname.slice(5))
    }
    else if (pathname.startsWith('demo/ts/') && pathname.endsWith('.ts')) {
      // Serve and transpile TypeScript demo files
      filePath = join(publicDir, pathname.slice(5))
      if (existsSync(filePath)) {
        // Transpile TypeScript to JavaScript
        const tsContent = readFileSync(filePath, 'utf-8')
        const transpiled = await Bun.build({
          entrypoints: [filePath],
          target: 'browser',
        })

        if (transpiled.outputs.length > 0) {
          content = await transpiled.outputs[0].text()
          return new Response(content, {
            headers: {
              'Content-Type': 'application/javascript',
              'Access-Control-Allow-Origin': '*',
            },
          })
        }
      }
    }
    else {
      // Serve from demo directory
      filePath = join(publicDir, pathname)
    }

    if (!existsSync(filePath)) {
      return new Response('File not found', { status: 404 })
    }

    const contentType = getContentType(filePath)

    if (contentType.startsWith('text/') || contentType === 'application/javascript') {
      content = readFileSync(filePath, 'utf-8')
    }
    else {
      content = readFileSync(filePath)
    }

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
  catch (error) {
    console.error('Error serving file:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

console.log(`🚀 Demo server starting on http://localhost:${PORT}`)
console.log(`📁 Serving from: ${publicDir}`)
console.log('📄 Demo available at: http://localhost:3000/nested-editable.html')

serve({
  port: PORT,
  fetch: handleRequest,
})
