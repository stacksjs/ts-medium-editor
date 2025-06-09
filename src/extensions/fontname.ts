import type { MediumEditor } from '../types'
import { FormExtension } from './form'

export interface FontNameOptions {
  fonts?: string[]
}

export class FontName extends FormExtension {
  name = 'fontname'
  action = 'fontName'
  aria = 'change font name'
  contentDefault = '&#xB1;' // ±
  contentFA = '<i class="fa fa-font"></i>'

  private fonts: string[] = ['', 'Arial', 'Verdana', 'Times New Roman']

  constructor(editor: MediumEditor, options: FontNameOptions = {}) {
    super(editor)
    this.fonts = options.fonts || this.fonts
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
      // Get FontName of current selection (convert to string since IE returns this as number)
      const fontName = `${document.queryCommandValue('fontName')}`
      this.showForm(fontName)
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
    const select = this.getSelect()
    if (select) {
      select.value = ''
    }
  }

  showForm(fontName?: string): void {
    const select = this.getSelect()

    if (this.editor.saveSelection) {
      this.editor.saveSelection()
    }
    this.hideToolbarDefaultActions()
    this.getForm().style.display = 'block'
    this.setToolbarPosition()

    if (select) {
      select.value = fontName || ''
      select.focus()
    }
  }

  createForm(): HTMLElement {
    const form = document.createElement('div')
    const select = document.createElement('select')
    const close = document.createElement('a')
    const save = document.createElement('a')

    // Font Name Form (div)
    form.className = 'medium-editor-toolbar-form'
    form.id = `medium-editor-toolbar-form-fontname-${this.getEditorId()}`

    // Handle clicks on the form itself
    this.on(form, 'click', this.handleFormClick.bind(this))

    // Add font names
    for (const font of this.fonts) {
      const option = document.createElement('option')
      option.innerHTML = font
      option.value = font
      select.appendChild(option)
    }

    select.className = 'medium-editor-toolbar-select'
    form.appendChild(select)

    // Handle font changes
    this.on(select, 'change', this.handleFontChange.bind(this))

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

  private getSelect(): HTMLSelectElement | null {
    return this.getForm().querySelector('select.medium-editor-toolbar-select')
  }

  private clearFontName(): void {
    // Get selected elements and clear font face attribute
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const element = node as HTMLElement
          return element.tagName.toLowerCase() === 'font' && element.hasAttribute('face')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
        },
      },
    )

    const fontElements: HTMLElement[] = []
    let node: Node | null = walker.nextNode()
    while (node) {
      fontElements.push(node as HTMLElement)
      node = walker.nextNode()
    }

    fontElements.forEach((el) => {
      el.removeAttribute('face')
    })
  }

  private handleFontChange(): void {
    const select = this.getSelect()
    if (!select)
      return

    const font = select.value
    if (font === '') {
      this.clearFontName()
    }
    else {
      this.execAction('fontName', { value: font })
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
    this.clearFontName()
    if (this.editor.checkSelection) {
      this.editor.checkSelection()
    }
  }

  getInteractionElements(): HTMLElement[] {
    return this.form ? [this.form] : []
  }
}
