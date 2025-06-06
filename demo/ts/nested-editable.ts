import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor with FontAwesome button labels
    const editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Click here to edit...',
      },
    })

    // Theme switching functionality
    const themeSelector = document.getElementById('sel-themes') as HTMLSelectElement
    const cssLink = document.getElementById('medium-editor-theme') as HTMLLinkElement

    if (themeSelector && cssLink) {
      themeSelector.addEventListener('change', function () {
        cssLink.href = `../src/css/${this.value}.css`
      })
    }

    // Store editor globally for debugging
    window.nestedEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing nested-editable demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    nestedEditor: any
  }
}
