import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor for textarea elements
    const editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Edit this textarea content...',
      },
    })

    // Store editor globally for debugging
    window.textareaEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing textarea demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    textareaEditor: any
  }
}
