import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // First editor instance - handles multiple elements with class 'editable'
    const editor1 = new MediumEditor('.editable', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Click here to edit...',
      },
      buttonLabels: 'fontawesome',
    })

    // Second editor instance - handles elements with class 'secondEditable'
    const editor2 = new MediumEditor('.secondEditable', {
      toolbar: {
        buttons: ['bold', 'italic', 'quote', 'pre'],
      },
      placeholder: {
        text: 'Different toolbar configuration...',
      },
      buttonLabels: 'fontawesome',
    })

    // Store editors globally for debugging
    window.multiEditors = {
      main: editor1,
      secondary: editor2,
    }

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing multi-editor demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    multiEditors: {
      main: any
      secondary: any
    }
  }
}
