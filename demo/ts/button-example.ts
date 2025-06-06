import rangy from 'rangy'
import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Highlighter styles are now in the core CSS files

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize rangy
  rangy.init()

  // Create the editor first
  const editor = new MediumEditor('.editable', {
    toolbar: {
      buttons: ['bold', 'italic', 'underline'],
    },
    buttonLabels: 'fontawesome',
  })

  // Add the highlighter button after a short delay to ensure toolbar is ready
  setTimeout(() => {
    addHighlighterButton(editor)
  }, 200)

  // Apply syntax highlighting to code examples
  await highlightAllCodeBlocks()
})

function addHighlighterButton(editor: any) {
  const toolbar = editor.getExtensionByName('toolbar')

  if (!toolbar || !toolbar.toolbar) {
    console.error('Toolbar not found')
    return
  }

  // Create the highlighter button
  const button = document.createElement('button')
  button.className = 'medium-editor-action medium-editor-action-highlighter'
  button.setAttribute('data-action', 'highlighter')
  button.innerHTML = '<b>H</b>'
  button.title = 'Highlight'

  // Initialize rangy class applier
  const classApplier = (rangy as any).createClassApplier('highlight', {
    elementTagName: 'mark',
    normalize: true,
  })

  // Add click handler
  button.addEventListener('click', (event) => {
    event.preventDefault()
    // Highlighter button clicked

    classApplier.toggleSelection()

    // Notify editor of content change
    if (editor && editor.checkContentChanged) {
      editor.checkContentChanged()
    }

    // Update button state
    updateButtonState(button)
  })

  // Add the button to the toolbar
  toolbar.toolbar.appendChild(button)
  toolbar.buttons.push(button)

  // Highlighter button added successfully

  // Set up selection change listener to update button state
  document.addEventListener('selectionchange', () => {
    updateButtonState(button)
  })
}

function updateButtonState(button: HTMLElement) {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer

    // Check if selection is within a highlight
    let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element
    let isHighlighted = false

    while (element && element !== document.body) {
      if (element.tagName === 'MARK' && element.classList.contains('highlight')) {
        isHighlighted = true
        break
      }
      element = element.parentElement
    }

    if (isHighlighted) {
      button.classList.add('medium-editor-button-active')
    }
    else {
      button.classList.remove('medium-editor-button-active')
    }
  }
  else {
    button.classList.remove('medium-editor-button-active')
  }
}
