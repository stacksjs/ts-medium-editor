// Import MediumEditor from the TypeScript source
import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Declare editor for debugging
declare global {
  interface Window {
    editor: any
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const container = document.getElementById('container')
    const editor = new MediumEditor('.editable', {
      elementsContainer: container,
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        relativeContainer: container,
      },
    })

    const cssLink = document.getElementById('medium-editor-theme') as HTMLLinkElement
    const themeSelect = document.getElementById('sel-themes') as HTMLSelectElement

    if (themeSelect && cssLink) {
      themeSelect.addEventListener('change', function () {
        cssLink.href = `../src/css/${this.value}.css`
      })
    }

    // Make it globally available for debugging
    window.editor = editor

    // Apply syntax highlighting to any code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing editor:', error)
  }
})
