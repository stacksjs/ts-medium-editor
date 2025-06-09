/* eslint-disable no-console */
// Make this file a module
export {}

// Global type declarations
declare global {
  interface Window {
    multiParagraphEditor: any
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
    console.log('Initializing Multi-Paragraph Demo...')

    // Load MediumEditor
    const EditorClass = await loadMediumEditor()

    if (!EditorClass) {
      throw new Error('MediumEditor class not available')
    }

    // Create editor with specific multi-paragraph settings
    const editor = new EditorClass('.editable', {
      delay: 0,
      buttonLabels: 'fontawesome',
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
    })

    console.log('Multi-Paragraph Editor initialized successfully:', editor)

    // Show success status
    const statusIndicator = document.getElementById('status-indicator')
    if (statusIndicator) {
      statusIndicator.innerHTML = `
        <div class="status-indicator status-success">
          ✅ Multi-Paragraph Demo initialized successfully! Try selecting text within a single paragraph vs across multiple paragraphs.
        </div>
      `
    }

    // Store editor globally for debugging
    window.multiParagraphEditor = editor

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
    console.error('Error initializing multi-paragraph demo:', error)

    // Fallback: show error message to user
    const statusIndicator = document.getElementById('status-indicator')
    if (statusIndicator) {
      statusIndicator.innerHTML = `
        <div class="status-indicator status-error">
          <strong>Error:</strong> Failed to initialize Medium Editor.
          Please check the browser console for more details.
          <br><br>
          <em>Error: ${error instanceof Error ? error.message : String(error)}</em>
          <br><br>
          <small>Try running the demo server with: <code>bun run serve-demo.ts</code></small>
        </div>
      `
    }
  }
})
