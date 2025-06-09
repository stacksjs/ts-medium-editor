/* eslint-disable no-console */

// Make this file a module
export {}

// Global type declarations
declare global {
  interface Window {
    passInstanceEditors: {
      one: any
      two: any
    }
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

// Custom Extension Class that properly implements Medium Editor extension interface
class CustomExtension {
  name = 'customExtension'
  private button: HTMLButtonElement
  private base: any

  constructor() {
    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action custom-extension'
    this.button.innerHTML = '🎯'
    this.button.title = 'Custom Extension Action - Click to see editor info'
    this.button.setAttribute('data-action', 'customExtension')

    // Use click instead of mousedown to avoid interfering with selection handling
    this.button.addEventListener('click', (event) => {
      event.preventDefault() // Prevent default action
      event.stopImmediatePropagation() // Stop immediate propagation to prevent conflicts

      // Use longer timeout to ensure other operations are complete
      setTimeout(() => {
        this.onClick()
      }, 100)
    }, true) // Use capture phase to handle before other handlers
  }

  // Called when the extension is initialized
  init() {
    console.log(`✓ Custom extension initialized for editor #${this.base?.id}`)
  }

  // Required method to return the button element
  getButton() {
    return this.button
  }

  // Called when button is clicked
  onClick() {
    if (!this.base) {
      // eslint-disable-next-line no-alert
      alert('Extension not properly initialized!')
      return
    }

    // Store current selection before showing alert
    let savedSelection: any = null
    try {
      savedSelection = this.base.exportSelection()
    }
    catch (error) {
      console.warn('Could not save selection:', error)
    }

    // Access the editor instance through this.base
    const editorInfo = {
      id: this.base.id,
      elements: this.base.elements.length,
      content: `${this.base.getContent(0)?.substring(0, 80)}...`,
      isActive: this.base.isActive(),
      version: this.base.version?.toString() || 'Unknown',
    }

    const message = `🎯 Custom Extension Info:

Editor Instance ID: #${editorInfo.id}
Number of Elements: ${editorInfo.elements}
Is Active: ${editorInfo.isActive}
Version: ${editorInfo.version}

Current Content Preview:
"${editorInfo.content}"

Click OK to see more details in console.`

    // eslint-disable-next-line no-alert
    alert(message)

    // Restore selection after alert
    if (savedSelection) {
      try {
        this.base.importSelection(savedSelection)
      }
      catch (error) {
        console.warn('Could not restore selection:', error)
      }
    }

    // Log additional details to console
    console.log('Full Editor Instance Details:', {
      id: this.base.id,
      elements: this.base.elements,
      options: this.base.options,
      extensions: Object.keys(this.base.extensions),
      isActive: this.base.isActive(),
      version: this.base.version,
      fullContent: this.base.getContent(0),
    })
  }

  // Optional: Called to check if button should be active
  isActive() {
    return true // Always show our custom button
  }

  // Optional: Called when extension should be destroyed
  destroy() {
    console.log(`Custom extension destroyed for editor #${this.base?.id}`)
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Initializing Custom Extension Demo...')

    // Load MediumEditor
    const EditorClass = await loadMediumEditor()

    if (!EditorClass) {
      throw new Error('MediumEditor class not available')
    }

    console.log('✓ MediumEditor loaded successfully')

    // Create first editor instance with custom extension
    const editorOne = new EditorClass('.one', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'customExtension'],
        // Ensure toolbar updates properly
        updateOnEmptySelection: false,
        standardizeSelectionStart: false,
      },
      extensions: {
        customExtension: new CustomExtension(),
      },
      placeholder: {
        text: 'Click here to edit the first editor...',
      },
      // Improve selection handling
      delay: 50,
    })

    // Create second editor instance with custom extension
    const editorTwo = new EditorClass('.two', {
      buttonLabels: 'fontawesome',
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'customExtension'],
        // Ensure toolbar updates properly
        updateOnEmptySelection: false,
        standardizeSelectionStart: false,
      },
      extensions: {
        customExtension: new CustomExtension(),
      },
      placeholder: {
        text: 'Click here to edit the second editor...',
      },
      // Improve selection handling
      delay: 50,
    })

    console.log('✓ Both editor instances created successfully')

    // Add click logging to help debug first-click issues
    const addClickLogging = (editor: any, name: string) => {
      editor.subscribe('editableClick', () => {
        console.log(`📍 ${name} editor clicked`)
      })

      // Add specific toolbar button click logging
      const toolbar = editor.getExtensionByName('toolbar')
      if (toolbar && toolbar.toolbar) {
        toolbar.toolbar.addEventListener('click', (event: Event) => {
          const target = event.target as HTMLElement
          const action = target.getAttribute('data-action')
          if (action) {
            console.log(`🔘 ${name} toolbar button clicked:`, action)
          }
        })
      }
    }

    addClickLogging(editorOne, 'First')
    addClickLogging(editorTwo, 'Second')

    console.log('✓ Custom Extension Demo initialized successfully:', { editorOne, editorTwo })

    // Show success status
    const statusIndicator = document.getElementById('status-indicator')
    if (statusIndicator) {
      statusIndicator.innerHTML = `
        <div class="status-indicator status-success">
          ✅ Custom Extension Demo initialized successfully! Select text in either editor and use the formatting buttons. The green 🎯 button shows extension functionality. Check console for debugging info.
        </div>
      `
    }

    // Store editors globally for debugging
    window.passInstanceEditors = {
      one: editorOne,
      two: editorTwo,
    }

    // Apply syntax highlighting to code examples
    try {
      const highlighter = await loadSyntaxHighlighter()
      await highlighter()
      console.log('✓ Code syntax highlighting applied successfully')
    }
    catch (syntaxError) {
      console.warn('Code syntax highlighting failed:', syntaxError)
    }
  }
  catch (error) {
    console.error('❌ Error initializing pass-instance demo:', error)

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
