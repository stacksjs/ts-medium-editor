// Make this file a module
export {}

// Global type declarations
declare global {
  interface Window {
    nestedEditor: any
  }
}

// Variables to hold the imported modules
let MediumEditor: any = null
let highlightAllCodeBlocks: (() => Promise<void>) | null = null

// Function to load MediumEditor with fallback approaches
async function loadMediumEditor(): Promise<any> {
  if (MediumEditor)
    return MediumEditor

  try {
    // First try the built version
    const module = await import('../../dist/index.js')
    MediumEditor = module.MediumEditor || module.default
    return MediumEditor
  }
  catch (e1) {
    try {
      // Fallback to source version
      const module = await import('../../src/index.ts')
      MediumEditor = module.MediumEditor || module.default
      return MediumEditor
    }
    catch (e2) {
      console.error('Could not import MediumEditor:', e1, e2)
      throw new Error('MediumEditor could not be loaded')
    }
  }
}

// Function to load syntax highlighter with error handling
async function loadSyntaxHighlighter(): Promise<() => Promise<void>> {
  if (highlightAllCodeBlocks)
    return highlightAllCodeBlocks

  try {
    const syntaxModule = await import('./syntax-highlighter.ts')
    highlightAllCodeBlocks = syntaxModule.highlightAllCodeBlocks
    return highlightAllCodeBlocks
  }
  catch (error) {
    console.warn('Syntax highlighter not available:', error)
    highlightAllCodeBlocks = async () => {
      console.log('Syntax highlighting skipped - module not available')
    }
    return highlightAllCodeBlocks
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing Medium Editor...')

    // Load MediumEditor
    const EditorClass = await loadMediumEditor()

    if (!EditorClass) {
      throw new Error('MediumEditor class not available')
    }

    // Create editor with FontAwesome button labels
    const editor = new EditorClass('.editable', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Click here to edit...',
      },
    })

    console.log('Medium Editor initialized successfully:', editor)

    // Theme switching functionality
    const themeSelector = document.getElementById('sel-themes') as HTMLSelectElement
    const cssLink = document.getElementById('medium-editor-theme') as HTMLLinkElement

    if (themeSelector && cssLink) {
      themeSelector.addEventListener('change', function () {
        console.log('Changing theme to:', this.value)
        cssLink.href = `../src/css/${this.value}.css`
      })
    }

    // Store editor globally for debugging
    window.nestedEditor = editor

    // Apply syntax highlighting to code examples
    try {
      const highlighter = await loadSyntaxHighlighter()
      await highlighter()
      console.log('Code syntax highlighting applied successfully')
    }
    catch (syntaxError) {
      console.warn('Code syntax highlighting failed:', syntaxError)
    }
  }
  catch (error) {
    console.error('Error initializing nested-editable demo:', error)

    // Fallback: show error message to user
    const container = document.getElementById('container')
    if (container) {
      const errorDiv = document.createElement('div')
      errorDiv.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem 0; border-radius: 4px; border: 1px solid #f5c6cb;">
          <strong>Error:</strong> Failed to initialize Medium Editor.
          Please check the browser console for more details.
          <br><br>
          <em>Error: ${error instanceof Error ? error.message : String(error)}</em>
          <br><br>
          <small>Try running the demo server with: <code>bun run serve-demo.ts</code></small>
        </div>
      `
      container.insertBefore(errorDiv, container.firstChild)
    }
  }
})
