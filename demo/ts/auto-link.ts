// Import MediumEditor from the TypeScript source
import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor instance first
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
    ;(window as any).editor = editor

    // Debug: Check if anchor extension is loaded
    // eslint-disable-next-line no-console
    console.log('Loaded extensions:', Object.keys(editor.extensions))
    const anchorExt = editor.getExtensionByName('anchor')
    // eslint-disable-next-line no-console
    console.log('Anchor extension:', anchorExt)

    // Apply syntax highlighting to any code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing editor:', error)
  }
})
