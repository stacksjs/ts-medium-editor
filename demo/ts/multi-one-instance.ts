import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor with first element
    const editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Click here to edit...',
      },
    })

    // Subscribe to input events for demonstration
    editor.subscribe('editableInput', (event: any, editable?: HTMLElement) => {
      if (editable) {
        console.warn('editableInput fired!', editable.id || editable.className)
      }
    })

    // Add second element to the same editor instance
    const secondElement = document.querySelector('.editable2') as HTMLElement
    if (secondElement) {
      editor.addElements(secondElement)
    }

    // Theme switching functionality
    const themeSelector = document.getElementById('sel-themes') as HTMLSelectElement
    const cssLink = document.getElementById('medium-editor-theme') as HTMLLinkElement

    if (themeSelector && cssLink) {
      themeSelector.addEventListener('change', function () {
        cssLink.href = `../src/css/${this.value}.css`
      })
    }

    // Store editor globally for debugging
    window.singleEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing multi-one-instance demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    singleEditor: any
  }
}
