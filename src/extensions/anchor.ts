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
  private lastClickTime = 0
  private clickDebounceMs = 300

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

    // Debounce rapid clicks
    const currentTime = Date.now()
    if (currentTime - this.lastClickTime < this.clickDebounceMs) {
      console.log('🚫 Click debounced - too soon after last click')
      return false
    }
    this.lastClickTime = currentTime

    console.log('🔗 Anchor handleClick called')

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      console.warn('No selection available for anchor action')
      return false
    }

    const range = selection.getRangeAt(0)
    const selectedText = range.toString().trim()

    console.log('Selection details:', {
      text: selectedText,
      rangeCount: selection.rangeCount,
      collapsed: range.collapsed
    })

    // Require non-empty selection for creating links
    if (!selectedText && !this.isWithinAnchor(range)) {
      console.warn('Cannot create link: no text selected')
      return false
    }

    // Check if we're clicking on an existing link
    if (this.isWithinAnchor(range)) {
      console.log('Removing existing link')
      this.execAction('unlink')
      return false
    }

    // Only show form if this was an explicit user action (button click or keyboard shortcut)
    // Don't show automatically on text selection
    if (!this.isDisplayed()) {
      console.log('Showing anchor form')
      this.showForm()
    } else {
      console.log('Anchor form already displayed')
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
    // Check both start and end containers for anchor elements
    const containers = [range.startContainer, range.endContainer, range.commonAncestorContainer]

    for (const container of containers) {
      let node: Node | null = container
      while (node && node !== document.body) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
          console.log('Found anchor element:', node)
          return true
        }
        node = node.parentNode
      }
    }

    // Also check if the selection contains any anchor elements
    if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
      const element = range.commonAncestorContainer as HTMLElement
      const anchors = element.querySelectorAll('a')
      if (anchors.length > 0) {
        console.log('Found anchor elements in selection:', anchors.length)
        return true
      }
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
    console.log('Hiding form...')

    if (this.form) {
      this.form.classList.remove(this.activeClass)
      // Force hide the form with inline style
      this.form.style.display = 'none'
      const input = this.getInput()
      if (input) {
        input.value = ''
        input.style.borderColor = '' // Reset any error styling
        input.blur() // Remove focus
      }
      console.log('Form hidden')
    }

    this.showToolbarDefaultActions()
    console.log('Toolbar buttons restored')
  }

  showForm(opts: { value?: string; target?: string; buttonClass?: string } = {}): void {
    console.log('Showing form with options:', opts)

    // Ensure form exists
    if (!this.form) {
      console.log('Creating form...')
      this.form = this.createForm()
    }

    const input = this.getInput()
    const targetCheckbox = this.getAnchorTargetCheckbox()
    const buttonCheckbox = this.getAnchorButtonCheckbox()

    // Save current selection
    if (this.editor.saveSelection) {
      console.log('Saving selection...')
      this.editor.saveSelection()
    }

    // Hide toolbar buttons
    this.hideToolbarDefaultActions()

    // Show the form
    if (this.form) {
      this.form.classList.add(this.activeClass)
      // Remove any inline display style that might be hiding the form
      this.form.style.display = ''
      console.log('Form activated')
    }

    // Position the toolbar
    this.setToolbarPosition()

    // Set form values and focus
    if (input) {
      input.value = opts.value || ''
      input.style.borderColor = '' // Reset any error styling

      // Focus with a small delay to ensure form is visible
      setTimeout(() => {
        input.focus()
        input.select() // Select existing text if any
      }, 50)
    }

    if (targetCheckbox) {
      targetCheckbox.checked = opts.target === '_blank'
    }

    if (buttonCheckbox && this.customClassOption) {
      const classList = opts.buttonClass ? opts.buttonClass.split(' ') : []
      buttonCheckbox.checked = classList.includes(this.customClassOption)
    }

    console.log('Form setup complete')
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

    // Validate URL
    if (!opts.value || opts.value.trim() === '') {
      console.warn('Cannot save link: empty URL')
      const input = this.getInput()
      if (input) {
        input.focus()
        input.style.borderColor = '#dc3545' // Red border for error
        setTimeout(() => {
          input.style.borderColor = ''
        }, 2000)
      }
      return
    }

    console.log('Saving link with options:', opts)
    this.completeFormSave(opts)
  }

  private completeFormSave(opts: { value: string; target: string; buttonClass?: string }): void {
    console.log('Completing form save...')

    // Restore selection first, before hiding form
    if (this.editor.restoreSelection) {
      this.editor.restoreSelection()
    }

    // Execute the link creation
    const success = this.execAction(this.action, opts)

    if (success) {
      console.log('Link created successfully')
      this.hideForm()
    } else {
      console.error('Failed to create link')
      // Don't hide form on failure, let user try again
      return
    }

    // Update editor state
    if (this.editor.checkSelection) {
      setTimeout(() => {
        this.editor.checkSelection()
      }, 10)
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
    this.hideForm()
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
    console.log('Textbox keyup:', event.key)

    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      console.log('Enter pressed - saving form')
      this.doFormSave()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      console.log('Escape pressed - canceling form')
      this.doFormCancel()
      return
    }

    // Clear any error styling when user starts typing
    const input = event.target as HTMLInputElement
    if (input && input.style.borderColor) {
      input.style.borderColor = ''
    }
  }

  private handleFormClick(event: Event): void {
    event.stopPropagation()
  }

  private handleSaveClick(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    console.log('Save button clicked')
    this.doFormSave()
  }

  private handleCloseClick(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    console.log('Close button clicked')
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

  private showToolbarDefaultActions(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'showToolbarDefaultActions' in toolbar) {
      (toolbar as any).showToolbarDefaultActions()
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