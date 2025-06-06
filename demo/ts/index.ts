// Import MediumEditor from the TypeScript source
import { MediumEditor } from '../../src/index.ts'

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize demo editors with full toolbar functionality
    const _basicEditor = new MediumEditor('.editable-basic', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Start typing here...',
      },
    })

    const _articleEditor = new MediumEditor('.editable-article', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Write your article...',
      },
    })

    // Multi-element editor
    const titleElement = document.querySelector('.editable-title') as HTMLElement
    const contentElement = document.querySelector('.editable-content') as HTMLElement

    if (titleElement && contentElement) {
      const _multiEditor = new MediumEditor([titleElement, contentElement], {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor'],
        },
        placeholder: {
          text: 'Enter content...',
        },
      })
    }

    const realtimeEditor = new MediumEditor('.editable-realtime', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Type something to see real-time output...',
      },
    })

    // Set up real-time output monitoring
    const realtimeElement = document.querySelector('.editable-realtime')
    const outputElement = document.getElementById('realtime-output')

    if (realtimeElement && outputElement) {
      // Initialize output
      outputElement.textContent = realtimeElement.innerHTML

      // Monitor for changes
      realtimeEditor.subscribe('editableInput', () => {
        outputElement.textContent = realtimeElement.innerHTML
      })
    }

    // Demo initialized successfully
  }
  catch (error) {
    console.error('Error initializing demo:', error)
  }
})
