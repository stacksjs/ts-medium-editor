// Import MediumEditor from the TypeScript source
import { MediumEditor } from '../../src/index.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      autoLink: true,
      toolbar: {
        buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote'],
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
  }
  catch (error) {
    console.error('Error initializing editor:', error)
  }
})
