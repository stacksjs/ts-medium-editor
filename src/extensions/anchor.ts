import type { MediumEditor, MediumEditorExtension, AnchorOptions } from '../types'

export class Anchor implements MediumEditorExtension {
  name = 'anchor'
  action = 'createLink'
  aria = 'link'
  tagNames: string[] = ['a']
  contentDefault = '<b>#</b>'
  contentFA = '<i class="fa fa-link"></i>'

  // Anchor Form Options
  customClassOption: string | null = null
  customClassOptionText = 'Button'
  linkValidation = false
  placeholderText = 'Paste or type a link'
  targetCheckbox = false
  targetCheckboxText = 'Open in new window'

  // Form properties
  form?: HTMLElement
  private editor: MediumEditor
  private formSaveLabel = '&#10003;'
  private formCloseLabel = '&times;'
  private activeClass = 'medium-editor-toolbar-form-active'

  constructor(editor: MediumEditor, options: AnchorOptions = {}) {
    this.editor = editor
    this.customClassOption = options.customClassOption || this.customClassOption
    this.customClassOptionText = options.customClassOptionText || this.customClassOptionText
    this.linkValidation = options.linkValidation !== undefined ? options.linkValidation : this.linkValidation
    this.placeholderText = options.placeholderText || this.placeholderText
    this.targetCheckbox = options.targetCheckbox !== undefined ? options.targetCheckbox : this.targetCheckbox
    this.targetCheckboxText = options.targetCheckboxText || this.targetCheckboxText
  }

  init(): void {
    this.editor.subscribe('editableKeydown', this.handleKeydown.bind(this))
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

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false

    const range = selection.getRangeAt(0)

    // Check if we're clicking on an existing link
    if (this.isWithinAnchor(range)) {
      this.execAction('unlink')
      return false
    }

    if (!this.isDisplayed()) {
      this.showForm()
    }

    return false
  }

  handleKeydown(event: KeyboardEvent): void {
    // Ctrl/Cmd + K for creating links
    if (event.key === 'k' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
      this.handleClick(event)
    }
  }

  private isWithinAnchor(range: Range): boolean {
    let node: Node | null = range.commonAncestorContainer
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  getForm(): HTMLElement {
    if (!this.form) {
      this.form = this.createForm()
    }
    return this.form
  }

  private getTemplate(): string {
    const template = [
      `<input type="text" class="medium-editor-toolbar-input" placeholder="${this.placeholderText}">`
    ]

    const buttonLabels = this.editor.options.buttonLabels
    template.push(
      '<a href="#" class="medium-editor-toolbar-save">',
      buttonLabels === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
      '</a>'
    )

    template.push(
      '<a href="#" class="medium-editor-toolbar-close">',
      buttonLabels === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
      '</a>'
    )

    if (this.targetCheckbox) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        `<input type="checkbox" class="medium-editor-toolbar-anchor-target" id="medium-editor-toolbar-anchor-target-field-${this.editor.id}">`,
        `<label for="medium-editor-toolbar-anchor-target-field-${this.editor.id}">`,
        this.targetCheckboxText,
        '</label>',
        '</div>'
      )
    }

    if (this.customClassOption) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        `<input type="checkbox" class="medium-editor-toolbar-anchor-button" id="medium-editor-toolbar-anchor-button-field-${this.editor.id}">`,
        `<label for="medium-editor-toolbar-anchor-button-field-${this.editor.id}">`,
        this.customClassOptionText,
        '</label>',
        '</div>'
      )
    }

    return template.join('')
  }

  isDisplayed(): boolean {
    return this.form ? this.form.classList.contains(this.activeClass) : false
  }

  hideForm(): void {
    if (this.form) {
      this.form.classList.remove(this.activeClass)
      const input = this.getInput()
      if (input) input.value = ''
    }
  }

  showForm(opts: { value?: string; target?: string; buttonClass?: string } = {}): void {
    const input = this.getInput()
    const targetCheckbox = this.getAnchorTargetCheckbox()
    const buttonCheckbox = this.getAnchorButtonCheckbox()

    if (this.editor.saveSelection) {
      this.editor.saveSelection()
    }

    this.hideToolbarDefaultActions()

    if (this.form) {
      this.form.classList.add(this.activeClass)
    }

    this.setToolbarPosition()

    if (input) {
      input.value = opts.value || ''
      input.focus()
    }

    if (targetCheckbox) {
      targetCheckbox.checked = opts.target === '_blank'
    }

    if (buttonCheckbox && this.customClassOption) {
      const classList = opts.buttonClass ? opts.buttonClass.split(' ') : []
      buttonCheckbox.checked = classList.includes(this.customClassOption)
    }
  }

  private getFormOpts(): { value: string; target: string; buttonClass?: string } {
    const input = this.getInput()
    const targetCheckbox = this.getAnchorTargetCheckbox()
    const buttonCheckbox = this.getAnchorButtonCheckbox()

    let value = input ? input.value.trim() : ''

    if (this.linkValidation) {
      value = this.checkLinkFormat(value)
    }

    const opts: { value: string; target: string; buttonClass?: string } = {
      value,
      target: '_self'
    }

    if (targetCheckbox && targetCheckbox.checked) {
      opts.target = '_blank'
    }

    if (buttonCheckbox && buttonCheckbox.checked && this.customClassOption) {
      opts.buttonClass = this.customClassOption
    }

    return opts
  }

  private doFormSave(): void {
    const opts = this.getFormOpts()
    this.completeFormSave(opts)
  }

  private completeFormSave(opts: { value: string; target: string; buttonClass?: string }): void {
    if (this.editor.restoreSelection) {
      this.editor.restoreSelection()
    }
    this.execAction(this.action, opts)
    if (this.editor.checkSelection) {
      this.editor.checkSelection()
    }
  }

  private checkLinkFormat(value: string): string {
    const urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):|^\#/i
    const hasScheme = urlSchemeRegex.test(value)
    const telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/

    if (telRegex.test(value)) {
      return 'tel:' + value
    }

    if (!hasScheme) {
      const host = value.split('/')[0]
      if (host.match(/.+(\.|:).+/) || host === 'localhost') {
        return 'http://' + value
      }
    }

    return value
  }

  private doFormCancel(): void {
    if (this.editor.restoreSelection) {
      this.editor.restoreSelection()
    }
    if (this.editor.checkSelection) {
      this.editor.checkSelection()
    }
  }

  private createForm(): HTMLElement {
    const form = document.createElement('div')
    form.className = 'medium-editor-toolbar-form'
    form.id = `medium-editor-toolbar-form-anchor-${this.editor.id}`
    form.innerHTML = this.getTemplate()
    this.attachFormEvents(form)
    return form
  }

  private attachFormEvents(form: HTMLElement): void {
    const close = form.querySelector('.medium-editor-toolbar-close')
    const save = form.querySelector('.medium-editor-toolbar-save')
    const input = form.querySelector('.medium-editor-toolbar-input') as HTMLInputElement

    // Handle form clicks
    form.addEventListener('click', this.handleFormClick.bind(this))

    // Handle input keyup
    if (input) {
      input.addEventListener('keyup', this.handleTextboxKeyup.bind(this))
    }

    // Handle close button
    if (close) {
      close.addEventListener('click', this.handleCloseClick.bind(this))
    }

    // Handle save button
    if (save) {
      save.addEventListener('click', this.handleSaveClick.bind(this), true)
    }
  }

  private getInput(): HTMLInputElement | null {
    return this.form ? this.form.querySelector('input.medium-editor-toolbar-input') : null
  }

  private getAnchorTargetCheckbox(): HTMLInputElement | null {
    return this.form ? this.form.querySelector('.medium-editor-toolbar-anchor-target') : null
  }

  private getAnchorButtonCheckbox(): HTMLInputElement | null {
    return this.form ? this.form.querySelector('.medium-editor-toolbar-anchor-button') : null
  }

  private handleTextboxKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.doFormSave()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      this.doFormCancel()
    }
  }

  private handleFormClick(event: Event): void {
    event.stopPropagation()
  }

  private handleSaveClick(event: Event): void {
    event.preventDefault()
    this.doFormSave()
  }

  private handleCloseClick(event: Event): void {
    event.preventDefault()
    this.doFormCancel()
  }

  private execAction(action: string, opts?: any): boolean {
    if (this.editor.execAction) {
      return this.editor.execAction(action, opts)
    }
    return false
  }

  private hideToolbarDefaultActions(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'hideToolbarDefaultActions' in toolbar) {
      (toolbar as any).hideToolbarDefaultActions()
    }
  }

  private setToolbarPosition(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'setToolbarPosition' in toolbar) {
      (toolbar as any).setToolbarPosition()
    }
  }

  getInteractionElements(): HTMLElement[] {
    return this.form ? [this.form] : []
  }
}