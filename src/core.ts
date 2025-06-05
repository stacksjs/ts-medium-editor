import type { MediumEditorExtension, MediumEditorOptions, SelectionState, VersionInfo } from './types'
import { Events } from './events'
import { Placeholder } from './extensions/placeholder'
import { Toolbar } from './extensions/toolbar'
import { selection } from './selection'
import { util } from './util'

// Global state for editor instances
const editors: MediumEditor[] = []
let globalId = 0

// Default options
const DEFAULT_OPTIONS: MediumEditorOptions = {
  activeButtonClass: 'medium-editor-button-active',
  buttonLabels: false,
  delay: 0,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  autoLink: false,
  elementsContainer: document.body,
  contentWindow: window,
  ownerDocument: document,
  targetBlank: false,
  extensions: {},
  spellcheck: true,
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
  },
  placeholder: {
    text: 'Type your text',
    hideOnClick: true,
  },
}

// Version information
const version: VersionInfo = {
  major: 1,
  minor: 0,
  revision: 0,
  preRelease: '',
  toString() {
    return `${this.major}.${this.minor}.${this.revision}${this.preRelease ? `-${this.preRelease}` : ''}`
  },
}

function parseVersionString(release: string): VersionInfo {
  const split = release.split('-')
  const versionParts = split[0].split('.')
  const preRelease = split.length > 1 ? split[1] : ''

  return {
    major: Number.parseInt(versionParts[0], 10),
    minor: Number.parseInt(versionParts[1], 10),
    revision: Number.parseInt(versionParts[2], 10),
    preRelease,
    toString() {
      return [versionParts[0], versionParts[1], versionParts[2]].join('.') + (preRelease ? `-${preRelease}` : '')
    },
  }
}

// Event handlers
function handleDisableExtraSpaces(this: MediumEditor, event: KeyboardEvent): void {
  const node = selection.getSelectionStart(this.options.ownerDocument!)
  if (!node)
    return

  const textContent = node.textContent || ''
  const caretOffsets = selection.getCaretOffsets(node as HTMLElement)

  if ((textContent[caretOffsets.left - 1] === undefined) || (textContent[caretOffsets.left - 1].trim() === '') || (textContent[caretOffsets.left] !== undefined && textContent[caretOffsets.left].trim() === '')) {
    event.preventDefault()
  }
}

function handleDisabledEnterKeydown(this: MediumEditor, event: KeyboardEvent, element: HTMLElement): void {
  if (this.options.disableReturn || element.getAttribute('data-disable-return')) {
    event.preventDefault()
  }
  else if (this.options.disableDoubleReturn || element.getAttribute('data-disable-double-return')) {
    const node = selection.getSelectionStart(this.options.ownerDocument!)
    if (node && node.textContent?.trim() === '' && (node as Element).nodeName.toLowerCase() !== 'li') {
      const prev = node.previousSibling
      if (!prev || (prev.nodeName.toLowerCase() !== 'br' && prev.textContent?.trim() === '')) {
        event.preventDefault()
      }
    }
  }
}

function handleTabKeydown(this: MediumEditor, event: KeyboardEvent): void {
  const node = selection.getSelectionStart(this.options.ownerDocument!)
  const tag = node && (node as Element).nodeName?.toLowerCase()

  if (tag === 'pre') {
    event.preventDefault()
    util.insertHTMLCommand(this.options.ownerDocument!, '    ')
  }

  if (node && util.isListItem(node)) {
    event.preventDefault()

    if (event.shiftKey) {
      this.options.ownerDocument!.execCommand('outdent', false)
    }
    else {
      this.options.ownerDocument!.execCommand('indent', false)
    }
  }
}

function handleAutoLink(this: MediumEditor, element: HTMLElement): void {
  if (!this.options.autoLink) {
    return
  }

  // Get current selection
  const selection = this.options.contentWindow!.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return
  }

  const range = selection.getRangeAt(0)
  const textNode = range.startContainer

  // Only process if cursor is in a text node
  if (textNode.nodeType !== Node.TEXT_NODE) {
    return
  }

  const textContent = textNode.textContent || ''
  const caretPosition = range.startOffset

  // eslint-disable-next-line no-console
  console.log('AutoLink check:', {
    textContent: JSON.stringify(textContent),
    caretPosition,
    lastChar: JSON.stringify(textContent[caretPosition - 1]),
  })

  // Only trigger after space (regular space or non-breaking space) or period
  const lastChar = textContent[caretPosition - 1]
  const isSpace = lastChar === ' ' || lastChar === '\u00A0' // regular space or &nbsp;
  const isPeriod = lastChar === '.'
  const shouldTrigger = isSpace || isPeriod

  // eslint-disable-next-line no-console
  console.log('Character check:', {
    lastChar: JSON.stringify(lastChar),
    charCode: lastChar ? lastChar.charCodeAt(0) : 'undefined',
    isSpace,
    isPeriod,
    shouldTrigger,
    isRegularSpace: lastChar === ' ',
    isNbsp: lastChar === '\u00A0',
  })

  if (!shouldTrigger) {
    // eslint-disable-next-line no-console
    console.log('Not triggering - last char is not a space or period:', JSON.stringify(lastChar))
    return
  }

  // eslint-disable-next-line no-console
  console.log('Trigger character detected (space or period), looking for URLs...')

  // Look for complete URLs that come BEFORE the trigger character (space or period)
  // The URL should end right before the trigger character we just typed
  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info|tech|app|dev|co|uk|ly|me|tv|ai|biz|ca|de|fr|jp|au|br|in|ru|cn|it|es|nl|se|no|dk|fi|be|at|ch|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|is|ie|pt|gr|cy|mt|lu|li|ad|sm|va|mc|gg|je|im|fo|gl|ax|sj|bv|hm|tf|aq|gs|cc|tk|ml|ga|cf)(?:\/\S*)?/g
  const matches = Array.from(textContent.matchAll(urlRegex))

  // eslint-disable-next-line no-console
  console.log('Found matches:', matches.map(m => ({ url: m[0], start: m.index, end: m.index! + m[0].length })))

  for (const match of matches) {
    const url = match[0]
    const startPos = match.index!
    const endPos = startPos + url.length

    // eslint-disable-next-line no-console
    console.log('Checking match:', { url, startPos, endPos, caretPosition, endPos_eq_caretPos_minus_1: endPos === caretPosition - 1 })

    // Only process if the URL ends exactly where the trigger character was typed (one position before cursor)
    if (endPos === caretPosition - 1) {
      // Check if already linked
      let currentParent = textNode.parentNode
      while (currentParent && currentParent !== element) {
        if (currentParent.nodeName.toLowerCase() === 'a') {
          return
        }
        currentParent = currentParent.parentNode
      }

      // Create the link using DOM manipulation
      const beforeText = textContent.substring(0, startPos)
      const afterText = textContent.substring(endPos)

      const beforeNode = beforeText ? this.options.ownerDocument!.createTextNode(beforeText) : null
      const afterNode = afterText ? this.options.ownerDocument!.createTextNode(afterText) : null

      const linkElement = this.options.ownerDocument!.createElement('a')
      linkElement.href = url
      linkElement.textContent = url

      if (this.options.targetBlank) {
        linkElement.target = '_blank'
        linkElement.rel = 'noopener noreferrer'
      }

      const parent = textNode.parentNode!

      if (beforeNode) {
        parent.insertBefore(beforeNode, textNode)
      }

      parent.insertBefore(linkElement, textNode)

      if (afterNode) {
        parent.insertBefore(afterNode, textNode)
      }

      parent.removeChild(textNode)

      // Position cursor after the link
      const newRange = this.options.ownerDocument!.createRange()
      if (afterNode) {
        // If triggered by period, position cursor after the period (offset 1)
        // If triggered by space, position cursor at the space (offset 0)
        const offset = isPeriod ? 1 : 0
        newRange.setStart(afterNode, offset)
      }
      else {
        newRange.setStartAfter(linkElement)
      }
      newRange.collapse(true)

      selection.removeAllRanges()
      selection.addRange(newRange)

      // Trigger content change
      this.checkContentChanged(element)

      return
    }
  }
}

function createElementsArray(
  selector: string | HTMLElement | HTMLElement[] | NodeList,
  doc: Document,
  filterEditorElements?: boolean,
): HTMLElement[] {
  let elements: HTMLElement[] = []

  if (typeof selector === 'string') {
    const nodeList = doc.querySelectorAll(selector)
    elements = Array.from(nodeList).filter((node): node is HTMLElement =>
      node.nodeType === Node.ELEMENT_NODE && typeof (node as HTMLElement).setAttribute === 'function',
    )
  }
  else if (selector && typeof selector === 'object' && 'length' in selector) {
    // Handle NodeList or HTMLElement[]
    elements = Array.from(selector).filter((node): node is HTMLElement =>
      node && node.nodeType === Node.ELEMENT_NODE && typeof (node as HTMLElement).setAttribute === 'function',
    )
  }
  else if (selector && typeof selector === 'object') {
    // Single HTMLElement
    if (selector.nodeType === Node.ELEMENT_NODE && typeof selector.setAttribute === 'function') {
      elements = [selector as HTMLElement]
    }
  }

  if (filterEditorElements) {
    elements = elements.filter(el => !util.isMediumEditorElement(el))
  }

  return elements
}

function initElement(element: HTMLElement, editorId: number): void {
  element.setAttribute('medium-editor-index', editorId.toString())
  element.setAttribute('contentEditable', 'true')
  element.setAttribute('data-medium-editor-element', 'true')
  element.classList.add('medium-editor-element')
}

export class MediumEditor {
  id: number
  elements: HTMLElement[] = []
  options: MediumEditorOptions
  events: Events
  selection: typeof selection = selection
  util: typeof util = util
  version: typeof version = version
  extensions: Record<string, MediumEditorExtension> = {}
  preventSelectionUpdates = false

  private savedSelection?: SelectionState | null
  private originalSelector?: string | HTMLElement | HTMLElement[] | NodeList
  private originalContent: Map<HTMLElement, string> = new Map()
  private isEditorActive = true

  constructor(elements?: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions) {
    this.id = ++globalId
    this.options = util.defaults(options || {}, DEFAULT_OPTIONS)
    this.events = new Events(this)

    editors.push(this)

    if (elements) {
      this.originalSelector = elements
      this.init(elements, options)
    }
  }

  init(elements: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions): MediumEditor {
    this.options = util.defaults(options || {}, this.options)
    this.originalSelector = elements
    this.elements = createElementsArray(elements, this.options.ownerDocument!)

    if (this.elements.length === 0) {
      return this
    }

    this.setup()
    return this
  }

  setup(): MediumEditor {
    // If elements array is empty and we have an original selector, re-query
    if (this.elements.length === 0 && this.originalSelector) {
      this.elements = createElementsArray(this.originalSelector, this.options.ownerDocument!)
    }

    this.elements.forEach((element, index) => {
      // Store original content if not already stored
      if (!this.originalContent.has(element)) {
        this.originalContent.set(element, element.innerHTML)
      }
      initElement(element, this.id + index)
    })

    this.initExtensions()
    this.attachHandlers()

    return this
  }

  destroy(): void {
    // Store focused elements before cleanup
    const focusedElements = this.elements.filter(el => el.getAttribute('data-medium-focused') === 'true')

    // Call destroy on all extensions
    Object.values(this.extensions).forEach((extension) => {
      if (extension && typeof extension.destroy === 'function') {
        extension.destroy()
      }
    })

    this.events.destroy()

    this.elements.forEach((element) => {
      element.removeAttribute('medium-editor-index')
      element.removeAttribute('contentEditable')
      element.removeAttribute('data-medium-editor-element')
      element.classList.remove('medium-editor-element')
    })

    // Set focused elements to false after all cleanup
    focusedElements.forEach((element) => {
      element.setAttribute('data-medium-focused', 'false')
    })

    // Reset the elements array
    this.elements = []

    const index = editors.indexOf(this)
    if (index !== -1) {
      editors.splice(index, 1)
    }
  }

  // Event handling
  on(target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture = false): MediumEditor {
    this.events.attachDOMEvent(target, event, listener, useCapture)
    return this
  }

  off(target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture = false): MediumEditor {
    this.events.detachDOMEvent(target, event, listener, useCapture)
    return this
  }

  subscribe(event: string, listener: (data?: any, editable?: HTMLElement) => void): MediumEditor {
    this.events.attachCustomEvent(event, listener)
    return this
  }

  unsubscribe(event: string, listener: (data?: any, editable?: HTMLElement) => void): MediumEditor {
    this.events.detachCustomEvent(event, listener)
    return this
  }

  trigger(name: string, data?: any, editable?: HTMLElement): MediumEditor {
    this.events.triggerCustomEvent(name, data, editable)
    return this
  }

  delay(fn: () => void): void {
    setTimeout(fn, this.options.delay || 0)
  }

  // Content methods
  serialize(): Record<string, string> {
    const result: Record<string, string> = {}

    this.elements.forEach((element, index) => {
      const key = element.id || `element-${index}`
      result[key] = element.innerHTML.trim()
    })

    return result
  }

  getContent(index?: number): string | null {
    if (index !== undefined && this.elements[index]) {
      return this.elements[index].innerHTML.trim()
    }

    if (this.elements.length === 0) {
      return null
    }

    return this.elements.map(el => el.innerHTML.trim()).join('')
  }

  setContent(html: string, index?: number): void {
    let target: HTMLElement | undefined
    if (index !== undefined && this.elements[index]) {
      target = this.elements[index]
      target.innerHTML = html
    }
    else if (this.elements[0]) {
      // When no index is provided, set content only on the first element
      target = this.elements[0]
      target.innerHTML = html
    }

    if (target) {
      this.checkContentChanged(target)
    }
  }

  resetContent(element?: HTMLElement): void {
    if (element) {
      const originalContent = this.originalContent.get(element)
      if (originalContent !== undefined) {
        element.innerHTML = originalContent
      }
    }
    else {
      this.elements.forEach((el) => {
        const originalContent = this.originalContent.get(el)
        if (originalContent !== undefined) {
          el.innerHTML = originalContent
        }
      })
    }
  }

  checkContentChanged(editable?: HTMLElement): void {
    const elements = editable ? [editable] : this.elements
    elements.forEach((element) => {
      this.trigger('editableInput', null, element)
    })
  }

  // Selection methods
  exportSelection(): SelectionState | null {
    const selectionElement = this.selection.getSelectionElement(this.options.contentWindow!)
    if (!selectionElement) {
      return null
    }

    const editableElementIndex = this.elements.indexOf(selectionElement)
    let selectionState: SelectionState | null = null

    if (editableElementIndex >= 0) {
      selectionState = this.selection.exportSelection(selectionElement, this.options.ownerDocument!)
    }

    if (selectionState !== null && editableElementIndex !== 0) {
      (selectionState as any).editableElementIndex = editableElementIndex
    }

    return selectionState
  }

  saveSelection(): void {
    this.savedSelection = this.exportSelection()
  }

  importSelection(selectionState: SelectionState, favorLaterSelectionAnchor = false): void {
    if (!selectionState) {
      return
    }

    const editableElement = this.elements[(selectionState as any).editableElementIndex || 0]
    if (!editableElement) {
      return
    }

    this.selection.importSelection(selectionState, editableElement, this.options.ownerDocument!, favorLaterSelectionAnchor)
  }

  restoreSelection(): void {
    if (this.savedSelection) {
      this.importSelection(this.savedSelection)
    }
  }

  selectAllContents(): void {
    const focusedElement = this.getFocusedElement()
    if (focusedElement) {
      this.selection.selectNode(focusedElement, this.options.ownerDocument!)
    }
  }

  selectElement(element: HTMLElement): void {
    this.selection.selectNode(element, this.options.ownerDocument!)

    const selElement = this.selection.getSelectionElement(this.options.contentWindow!)
    if (selElement) {
      this.events.focusElement(selElement)
    }
  }

  getFocusedElement(): HTMLElement | null {
    return this.elements.find(el => el.getAttribute('data-medium-focused') === 'true') || null
  }

  getSelectedParentElement(range?: Range): HTMLElement {
    const selectionRange = range || this.selection.getSelectionRange(this.options.ownerDocument!)
    if (selectionRange) {
      return this.selection.getSelectedParentElement(selectionRange)
    }
    return this.options.ownerDocument!.body
  }

  stopSelectionUpdates(): void {
    this.preventSelectionUpdates = true
  }

  startSelectionUpdates(): void {
    this.preventSelectionUpdates = false
  }

  checkSelection(): void {
    const toolbar = this.getExtensionByName('toolbar') as any
    if (toolbar && typeof toolbar.checkState === 'function') {
      toolbar.checkState()
    }
  }

  // Action methods
  execAction(action: string, opts?: any): boolean {
    // Handle case where ownerDocument doesn't have execCommand (e.g., in test environments)
    if (!this.options.ownerDocument || typeof this.options.ownerDocument.execCommand !== 'function') {
      // Fallback for test environments - delegate to toolbar if available
      const toolbar = this.getExtensionByName('toolbar') as any
      if (toolbar && typeof toolbar.applyFormattingFallback === 'function') {
        toolbar.applyFormattingFallback(action)
        return true
      }
      return false
    }
    return this.options.ownerDocument.execCommand(action, false, opts)
  }

  queryCommandState(action: string): boolean {
    return this.options.ownerDocument!.queryCommandState(action)
  }

  // Extension methods
  getExtensionByName(name: string): MediumEditorExtension | undefined {
    return this.extensions[name]
  }

  addBuiltInExtension(_name: string, _opts?: any): MediumEditor {
    // Implementation for adding built-in extensions
    return this
  }

  // Element management
  addElements(selector: string | HTMLElement | HTMLElement[] | NodeList): MediumEditor {
    const newElements = createElementsArray(selector, this.options.ownerDocument!, true)

    newElements.forEach((element, index) => {
      initElement(element, this.id + this.elements.length + index)
      this.elements.push(element)
    })

    return this
  }

  removeElements(selector: string | HTMLElement | HTMLElement[] | NodeList): MediumEditor {
    const elementsToRemove = createElementsArray(selector, this.options.ownerDocument!)

    elementsToRemove.forEach((element) => {
      const index = this.elements.indexOf(element)
      if (index !== -1) {
        this.elements.splice(index, 1)
        element.removeAttribute('medium-editor-index')
        element.removeAttribute('contentEditable')
        element.removeAttribute('data-medium-editor-element')
        element.classList.remove('medium-editor-element')
      }
    })

    return this
  }

  // State methods
  activate(): MediumEditor {
    this.isEditorActive = true
    this.elements.forEach((element) => {
      element.setAttribute('contentEditable', 'true')
      element.removeAttribute('disabled')
    })
    this.trigger('activate')
    return this
  }

  deactivate(): MediumEditor {
    this.isEditorActive = false
    this.elements.forEach((element) => {
      element.setAttribute('contentEditable', 'false')
      element.setAttribute('disabled', 'true')
    })
    this.trigger('deactivate')
    return this
  }

  isActive(): boolean {
    return this.isEditorActive
  }

  // Utility methods
  createLink(opts: { value: string, target?: string, buttonClass?: string }): void {
    const range = this.selection.getSelectionRange(this.options.ownerDocument!)
    if (range) {
      const anchor = this.options.ownerDocument!.createElement('a')
      anchor.href = opts.value
      if (opts.target) {
        anchor.target = opts.target
      }

      try {
        range.surroundContents(anchor)
      }
      catch {
        // Fallback for complex selections
        const contents = range.extractContents()
        anchor.appendChild(contents)
        range.insertNode(anchor)
      }
    }
  }

  cleanPaste(text: string): string {
    // Basic paste cleaning - remove non-printable characters
    // eslint-disable-next-line no-control-regex
    return text.replace(/[\x00-\x1F\x7F]/g, '')
  }

  pasteHTML(html: string, options?: { cleanAttrs?: string[], cleanTags?: string[], unwrapTags?: string[] }): void {
    const tempDiv = this.options.ownerDocument!.createElement('div')
    tempDiv.innerHTML = html

    if (options?.cleanAttrs) {
      util.cleanupAttrs(tempDiv, options.cleanAttrs)
    }

    if (options?.cleanTags) {
      util.cleanupTags(tempDiv, options.cleanTags)
    }

    if (options?.unwrapTags) {
      util.unwrapTags(tempDiv, options.unwrapTags)
    }

    util.insertHTMLCommand(this.options.ownerDocument!, tempDiv.innerHTML)
  }

  // Private methods
  private initExtensions(): void {
    // Initialize built-in toolbar extension if enabled
    if (this.options.toolbar) {
      const container = this.options.elementsContainer || document.body
      // Merge user toolbar options with defaults to ensure all properties are available
      const toolbarOptions = {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'] as Array<string>,
        static: false,
        align: 'center' as 'center' | 'left' | 'right',
        sticky: false,
        updateOnEmptySelection: false,
        allowMultiParagraphSelection: true,
        standardizeSelectionStart: false,
        relativeContainer: null as HTMLElement | null,
        diffLeft: 0,
        diffTop: 0,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        ...this.options.toolbar,
      }
      const toolbar = new Toolbar(toolbarOptions, container, this as any)
      toolbar.init()
      this.extensions.toolbar = toolbar
    }

    // Initialize built-in placeholder extension if enabled
    if (this.options.placeholder) {
      const placeholder = new Placeholder(this, this.options.placeholder)
      placeholder.init()
      this.extensions.placeholder = placeholder
    }

    // Initialize custom extensions
    Object.keys(this.options.extensions || {}).forEach((name) => {
      const extension = this.options.extensions![name]
      if (extension && typeof extension.init === 'function') {
        extension.init()
        this.extensions[name] = extension
      }
    })
  }

  private attachHandlers(): void {
    // Set up focus/blur tracking for data-medium-focused attribute
    this.events.setupListener('focus')
    this.events.setupListener('blur')

    // Set up common event listeners that tests and extensions expect
    this.events.setupListener('editableKeydown')
    this.events.setupListener('editableKeyup')
    this.events.setupListener('editableInput')
    this.events.setupListener('editableClick')
    this.events.setupListener('editableBlur')
    this.events.setupListener('editablePaste')
    this.events.setupListener('editableDrag')
    this.events.setupListener('editableDrop')

    // Add global mouseup handler to catch selection changes anywhere in the document
    this.on(this.options.ownerDocument!, 'mouseup', () => {
      // Use setTimeout to ensure selection is finalized
      setTimeout(() => {
        this.checkSelection()
      }, 0)
    })

    // Attach core event handlers
    this.elements.forEach((element) => {
      this.on(element, 'keydown', (event: Event) => {
        const keyEvent = event as KeyboardEvent

        if (util.isKey(keyEvent, util.keyCode.SPACE) && this.options.disableExtraSpaces) {
          handleDisableExtraSpaces.call(this, keyEvent)
        }

        if (util.isKey(keyEvent, util.keyCode.ENTER)) {
          handleDisabledEnterKeydown.call(this, keyEvent, element)
        }

        if (util.isKey(keyEvent, util.keyCode.TAB)) {
          handleTabKeydown.call(this, keyEvent)
        }
      })

      // Add mouseup handler to trigger selection updates
      this.on(element, 'mouseup', () => {
        // Use setTimeout to ensure selection is finalized
        setTimeout(() => {
          this.checkSelection()
        }, 10) // Slightly longer delay to ensure selection is processed
      })

      // Add auto-link detection on input only
      this.on(element, 'input', () => {
        if (this.options.autoLink) {
          // Small delay to ensure DOM is updated
          setTimeout(() => {
            handleAutoLink.call(this, element)
          }, 100) // Slightly longer delay to ensure all DOM changes are complete
        }
      })
    })
  }

  // Static methods
  static parseVersionString: typeof parseVersionString = parseVersionString
  static version: typeof version = version
  static util: typeof util = util
  static selection: typeof selection = selection
}

// Export the constructor and static members
export { MediumEditor as default, parseVersionString, selection, util, version }
