import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get the relative container element
    const relativeContainer = document.getElementById('someRelativeDiv') as HTMLElement

    // Create editor with relative toolbar container
    const editor = new MediumEditor('.editable', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'strikethrough', 'quote', 'anchor', 'image', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'superscript', 'subscript', 'orderedlist', 'unorderedlist', 'pre', 'outdent', 'indent', 'h2', 'h3'],
        relativeContainer,
      },
      buttonLabels: 'fontawesome',
      placeholder: {
        text: 'Select text to see the toolbar appear in the red container below...',
      },
    })

    // Store editor globally for debugging
    window.relativeToolbarEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing relative-toolbar demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    relativeToolbarEditor: any
  }
}
