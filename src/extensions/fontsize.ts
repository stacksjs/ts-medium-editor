import type { MediumEditor } from '../types'
import { FormExtension } from './form'

export interface FontSizeOptions {
  minSize?: number
  maxSize?: number
}

export class FontSize extends FormExtension {
  name = 'fontsize'
  action = 'fontSize'
  aria = 'increase/decrease font size'
  contentDefault = '&#xB1;' // ±
  contentFA = '<i class="fa fa-text-height"></i>'

  private minSize = 1
  private maxSize = 7

  constructor(editor: MediumEditor, options: FontSizeOptions = {}) {
    super(editor)
    this.minSize = options.minSize || this.minSize
    this.maxSize = options.maxSize || this.maxSize
  }

  init(): void {
    // No additional initialization needed
  }

  destroy(): void {
    if (this.form && this.form.parentNode) {
      this.form.parentNode.removeChild(this.form)
      delete this.form
    }
  }

  handleClick(event: Event): boolean {
    event.preventDefault()
    event.stopPropagation()

    if (!this.isDisplayed()) {
      // Get fontSize of current selection (convert to string since IE returns this as number)
      const fontSize = document.queryCommandValue('fontSize') + ''
      this.showForm(fontSize)
    }

    return false
  }

  getForm(): HTMLElement {
    if (!this.form) {
      this.form = this.createForm()
    }
    return this.form
  }

  isDisplayed(): boolean {
    return this.getForm().style.display === 'block'
  }

  hideForm(): void {
    this.getForm().style.display = 'none'
    const input = this.getInput()
    if (input) {
      input.value = ''
    }
  }

  showForm(fontSize?: string): void {
    const input = this.getInput()

    if (this.editor.saveSelection) {
      this.editor.saveSelection()
    }
    this.hideToolbarDefaultActions()
    this.getForm().style.display = 'block'
    this.setToolbarPosition()

    if (input) {
      input.value = fontSize || ''
      input.focus()
    }
  }

  createForm(): HTMLElement {
    const form = document.createElement('div')
    const input = document.createElement('input')
    const close = document.createElement('a')
    const save = document.createElement('a')

    // Font Size Form (div)
    form.className = 'medium-editor-toolbar-form'
    form.id = `medium-editor-toolbar-form-fontsize-${this.getEditorId()}`

    // Handle clicks on the form itself
    this.on(form, 'click', this.handleFormClick.bind(this))

    // Add font size slider
    input.setAttribute('type', 'range')
    input.setAttribute('min', this.minSize.toString())
    input.setAttribute('max', this.maxSize.toString())
    input.className = 'medium-editor-toolbar-input'
    form.appendChild(input)

    // Handle slider changes
    this.on(input, 'change', this.handleSliderChange.bind(this))

    // Add save button
    save.setAttribute('href', '#')
    save.className = 'medium-editor-toolbar-save'
    save.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome'
      ? '<i class="fa fa-check"></i>'
      : '&#10003;'
    form.appendChild(save)

    // Handle save button clicks
    this.on(save, 'click', this.handleSaveClick.bind(this), true)

    // Add close button
    close.setAttribute('href', '#')
    close.className = 'medium-editor-toolbar-close'
    close.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome'
      ? '<i class="fa fa-times"></i>'
      : '&times;'
    form.appendChild(close)

    // Handle close button clicks
    this.on(close, 'click', this.handleCloseClick.bind(this))

    return form
  }

  private getInput(): HTMLInputElement | null {
    return this.getForm().querySelector('input.medium-editor-toolbar-input')
  }

  private clearFontSize(): void {
    // Get selected elements and clear font size attribute
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const element = node as HTMLElement
          return element.tagName.toLowerCase() === 'font' && element.hasAttribute('size')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
        }
      }
    )

    const fontElements: HTMLElement[] = []
    let node: Node | null = walker.nextNode()
    while (node) {
      fontElements.push(node as HTMLElement)
      node = walker.nextNode()
    }

    fontElements.forEach(el => {
      el.removeAttribute('size')
    })
  }

  private handleSliderChange(): void {
    const input = this.getInput()
    if (!input) return

    const size = input.value
    if (size === '4') { // Default size
      this.clearFontSize()
    } else {
      this.execAction('fontSize', { value: size })
    }
  }

  protected doFormSave(): void {
    if (this.editor.restoreSelection) {
      this.editor.restoreSelection()
    }
    if (this.editor.checkSelection) {
      this.editor.checkSelection()
    }
  }

  protected doFormCancel(): void {
    if (this.editor.restoreSelection) {
      this.editor.restoreSelection()
    }
    this.clearFontSize()
    if (this.editor.checkSelection) {
      this.editor.checkSelection()
    }
  }

  getInteractionElements(): HTMLElement[] {
    return this.form ? [this.form] : []
  }
}