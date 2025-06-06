import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Main editor with static toolbar
    const editor = new MediumEditor('.editable', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        static: true,
        sticky: true,
      },
      buttonLabels: 'fontawesome',
      placeholder: {
        text: 'Click here to edit...',
      },
    })

    // Left column editor with left-aligned static toolbar
    const editorColOne = new MediumEditor('#column-one', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        sticky: true,
        static: true,
        align: 'left',
        updateOnEmptySelection: true,
      },
      buttonLabels: 'fontawesome',
      placeholder: {
        text: 'Left-aligned toolbar...',
      },
    })

    // Center column editor with center-aligned static toolbar
    const editorColTwo = new MediumEditor('#column-two', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        sticky: true,
        static: true,
        align: 'center',
        updateOnEmptySelection: true,
      },
      buttonLabels: 'fontawesome',
      placeholder: {
        text: 'Center-aligned toolbar...',
      },
    })

    // Right column editor with right-aligned static toolbar
    const editorColThree = new MediumEditor('#column-three', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        sticky: true,
        static: true,
        align: 'right',
        updateOnEmptySelection: true,
      },
      buttonLabels: 'fontawesome',
      placeholder: {
        text: 'Right-aligned toolbar...',
      },
    })

    // Store editors globally for debugging
    window.staticToolbarEditors = {
      main: editor,
      leftColumn: editorColOne,
      centerColumn: editorColTwo,
      rightColumn: editorColThree,
    }

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing static-toolbar demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    staticToolbarEditors: {
      main: any
      leftColumn: any
      centerColumn: any
      rightColumn: any
    }
  }
}
