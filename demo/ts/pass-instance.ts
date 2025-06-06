import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Custom Extension Class
class CustomExtension {
  private button: HTMLButtonElement
  private base: any

  constructor() {
    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action'
    this.button.textContent = 'X'
    this.button.onclick = this.onClick.bind(this)
  }

  getButton() {
    return this.button
  }

  onClick() {
    // eslint-disable-next-line no-alert
    alert(`This is editor: #${this.base.id}`)
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create first editor instance
    const editorOne = new MediumEditor('.one', {
      toolbar: {
        buttons: ['extension'],
      },
      extensions: {
        extension: new CustomExtension(),
      },
    })

    // Create second editor instance
    const editorTwo = new MediumEditor('.two', {
      toolbar: {
        buttons: ['extension'],
      },
      extensions: {
        extension: new CustomExtension(),
      },
    })

    // Store editors globally for debugging
    window.passInstanceEditors = {
      one: editorOne,
      two: editorTwo,
    }

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing pass-instance demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    passInstanceEditors: {
      one: any
      two: any
    }
  }
}
