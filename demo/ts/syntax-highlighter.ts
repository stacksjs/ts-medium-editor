import { createHighlighter } from 'shiki'

let highlighter: any = null

export async function initSyntaxHighlighter(): Promise<any> {
  if (highlighter)
    return highlighter

  highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['typescript', 'javascript', 'html', 'css', 'json'],
  })

  return highlighter
}

export async function highlightCode(code: string, lang: string = 'typescript', theme: string = 'github-light'): Promise<string> {
  if (!highlighter) {
    await initSyntaxHighlighter()
  }

  try {
    return highlighter.codeToHtml(code, {
      lang,
      theme,
      transformers: [
        {
          name: 'remove-pre-wrapper',
          root(node: any) {
            // Remove the outer <pre> wrapper and just return the <code> content
            if (node.type === 'element' && node.tagName === 'pre') {
              const codeElement = node.children.find((child: any) =>
                child.type === 'element' && child.tagName === 'code',
              )
              if (codeElement) {
                return codeElement.children
              }
            }
            return node
          },
        },
      ],
    })
  }
  catch (error) {
    console.warn('Failed to highlight code:', error)
    return `<code>${escapeHtml(code)}</code>`
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export async function highlightAllCodeBlocks(): Promise<void> {
  const codeBlocks = document.querySelectorAll('.code-example')
  const loadingIndicator = document.getElementById('syntax-loading')

  for (const block of Array.from(codeBlocks)) {
    const code = block.textContent || ''
    const lang = block.getAttribute('data-lang') || 'typescript'

    try {
      const highlighted = await highlightCode(code, lang)
      block.innerHTML = highlighted
      block.classList.add('shiki-highlighted')
    }
    catch (error) {
      console.warn('Failed to highlight code block:', error)
    }
  }

  // Hide loading indicator
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none'
  }
}
