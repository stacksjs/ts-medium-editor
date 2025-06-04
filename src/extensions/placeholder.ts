import type { MediumEditor, MediumEditorExtension, PlaceholderOptions } from '../types'

export class Placeholder implements MediumEditorExtension {
  name = 'placeholder'
  text: string = 'Type your text'
  hideOnClick: boolean = true
  hideOnFocus: boolean = false

  private editor: MediumEditor

  constructor(editor: MediumEditor, options: PlaceholderOptions = {}) {
    this.editor = editor
    this.text = options.text || this.text
    this.hideOnClick = options.hideOnClick !== undefined ? options.hideOnClick : this.hideOnClick

    // For backward compatibility: if hideOnFocus is not explicitly provided,
    // use hideOnClick value (original behavior)
    // If hideOnFocus is explicitly provided, use that value
    if (options.hideOnFocus !== undefined) {
      this.hideOnFocus = options.hideOnFocus
    }
    else {
      // Backward compatibility: hideOnClick controlled both click and focus
      this.hideOnFocus = this.hideOnClick
    }
  }

  init(): void {
    this.initPlaceholders()
    this.attachEventHandlers()
  }

  initPlaceholders(): void {
    this.editor.elements.forEach((el: HTMLElement) => this.initElement(el))
  }

  handleAddElement(_data?: any, editable?: HTMLElement): void {
    if (editable) {
      this.initElement(editable)
    }
  }

  initElement(el: HTMLElement): void {
    if (!el.getAttribute('data-placeholder')) {
      el.setAttribute('data-placeholder', this.text)
    }
    this.updatePlaceholder(el)
  }

  destroy(): void {
    this.editor.elements.forEach((el: HTMLElement) => this.cleanupElement(el))
  }

  handleRemoveElement(_event: Event, editable: HTMLElement): void {
    this.cleanupElement(editable)
  }

  cleanupElement(el: HTMLElement): void {
    if (el.getAttribute('data-placeholder') === this.text) {
      el.removeAttribute('data-placeholder')
    }
  }

  showPlaceholder(el: HTMLElement): void {
    if (el) {
      // Firefox handling: Use relative positioning for empty elements
      if (this.isFirefox() && el.childNodes.length === 0) {
        el.classList.add('medium-editor-placeholder-relative')
        el.classList.remove('medium-editor-placeholder')
      }
      else {
        el.classList.add('medium-editor-placeholder')
        el.classList.remove('medium-editor-placeholder-relative')
      }
    }
  }

  hidePlaceholder(el: HTMLElement): void {
    if (el) {
      el.classList.remove('medium-editor-placeholder')
      el.classList.remove('medium-editor-placeholder-relative')
    }
  }

  updatePlaceholder(el: HTMLElement, dontShow?: boolean): void {
    // If the element has content, hide the placeholder
    if (el.querySelector('img, blockquote, ul, ol, table') || (el.textContent?.replace(/^\s+|\s+$/g, '') !== '')) {
      return this.hidePlaceholder(el)
    }

    if (dontShow) {
      this.hidePlaceholder(el)
    }
    else {
      this.showPlaceholder(el)
    }
  }

  attachEventHandlers(): void {
    if (this.hideOnClick || this.hideOnFocus) {
      // For the 'hideOnClick' or 'hideOnFocus' options, hide placeholder on focus
      this.editor.subscribe('focus', this.handleFocus.bind(this))
    }

    // If the editor has content, it should always hide the placeholder
    this.editor.subscribe('editableInput', this.handleInput.bind(this))

    // When the editor loses focus, check if the placeholder should be visible
    this.editor.subscribe('blur', this.handleBlur.bind(this))

    // Need to know when elements are added/removed from the editor
    this.editor.subscribe('addElement', this.handleAddElement.bind(this))
    this.editor.subscribe('removeElement', this.handleRemoveElement.bind(this))
  }

  handleInput(_event: Event, element: HTMLElement): void {
    // If the placeholder should be hidden on focus and the element has focus, don't show the placeholder
    const dontShow = this.hideOnFocus && (element === this.editor.getFocusedElement())

    // Editor's content has changed, check if the placeholder should be hidden
    this.updatePlaceholder(element, dontShow)
  }

  handleFocus(_event: Event, element: HTMLElement): void {
    // Editor has focus, hide the placeholder if hideOnFocus is enabled
    if (this.hideOnFocus) {
      this.hidePlaceholder(element)
    }
  }

  handleBlur(_event: Event, element: HTMLElement): void {
    // Editor has lost focus, check if the placeholder should be shown
    this.updatePlaceholder(element)
  }

  private isFirefox(): boolean {
    return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
  }
}
