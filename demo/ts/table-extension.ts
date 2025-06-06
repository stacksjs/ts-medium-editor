import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Simple Table Extension
class TableExtension {
  private button: HTMLButtonElement
  private base: any

  constructor() {
    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action'
    this.button.innerHTML = '<i class="fa fa-table"></i>'
    this.button.title = 'Insert Table'
    this.button.onclick = this.onClick.bind(this)
  }

  getButton() {
    return this.button
  }

  onClick() {
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Header 1</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Header 2</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 6</td>
          </tr>
        </tbody>
      </table>
    `

    // Insert table at current cursor position
    if (this.base && this.base.elements && this.base.elements[0]) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const tableElement = document.createElement('div')
        tableElement.innerHTML = tableHTML
        range.deleteContents()
        range.insertNode(tableElement.firstElementChild!)

        // Clear selection
        selection.removeAllRanges()
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor with table extension
    const editor = new MediumEditor('.editable', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'table'],
        static: true,
      },
      buttonLabels: 'fontawesome',
      extensions: {
        table: new TableExtension(),
      },
      placeholder: {
        text: 'Click here to start editing. Use the table button to insert tables...',
      },
    })

    // Store editor globally for debugging
    window.tableEditor = editor

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
  }
  catch (error) {
    console.error('Error initializing table-extension demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    tableEditor: any
  }
}
