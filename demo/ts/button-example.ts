import { MediumEditor } from '../../src/index.ts'

// Define CSS for highlighting
const highlightCSS = `
  .highlight {
    background-color: #ffff99;
    padding: 2px 4px;
    border-radius: 2px;
  }
`

// Add the CSS to the document
const style = document.createElement('style')
style.textContent = highlightCSS
document.head.appendChild(style)

// Create a custom highlighter button extension
function createHighlighterExtension() {
  return {
    name: 'highlighter',
    action: 'highlight',
    aria: 'Highlight text',
    tagNames: ['mark'],
    contentDefault: '<b>H</b>',
    contentFA: '<i class="fa fa-paint-brush"></i>',
    classList: ['medium-editor-action'],
    attrs: {
      'data-action': 'highlight',
    },

    init() {
      // Initialize rangy if available
      if (window.rangy) {
        this.classApplier = window.rangy.createClassApplier('highlight', {
          elementTagName: 'mark',
          normalize: true,
        })
      }
    },

    handleClick(_event: Event) {
      if (this.classApplier) {
        this.classApplier.toggleSelection()
      }
      else {
        // Fallback without rangy
        document.execCommand('hiliteColor', false, '#ffff99')
      }

      // Notify editor of content change
      if (this.base && typeof this.base.checkContentChanged === 'function') {
        this.base.checkContentChanged()
      }
    },

    destroy() {
      if (this.classApplier) {
        this.classApplier = null
      }
    },
  }
}

// Initialize the editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize rangy if available
  if (window.rangy) {
    window.rangy.init()
  }

  // Create the editor with custom highlighter button
  const _editor = new MediumEditor('.editable', {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'highlighter'],
    },
    buttonLabels: 'fontawesome',
    extensions: {
      highlighter: createHighlighterExtension(),
    },
  })

  // Editor initialized successfully
})

// Type declarations for rangy
declare global {
  interface Window {
    rangy?: {
      init(): void
      createClassApplier(className: string, options: any): any
    }
  }
}
