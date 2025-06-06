import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor with specific multi-paragraph settings
    const editor = new MediumEditor('.editable', {
      delay: 0,
      toolbar: {
        diffTop: -12,
        allowMultiParagraphSelection: false, // Key setting for this demo
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      anchor: {
        placeholderText: 'Type a link',
      },
      placeholder: {
        text: 'Type some text and try selecting across multiple paragraphs...',
      },
      buttonLabels: 'fontawesome',
    })

    // Store editor globally for debugging
    window.multiParagraphEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing multi-paragraph demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    multiParagraphEditor: any
  }
}
