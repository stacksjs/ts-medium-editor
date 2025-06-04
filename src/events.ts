import type { MediumEditorEventListener, MediumEditorExtension } from './types'
import { util } from './util'

function isElementDescendantOfExtension(extensions: Record<string, MediumEditorExtension> | MediumEditorExtension[] | undefined, element: HTMLElement): boolean {
  if (!extensions) {
    return false
  }

  // Convert object to array if needed
  const extensionArray = Array.isArray(extensions) ? extensions : Object.values(extensions)

  return extensionArray.some((extension) => {
    if (typeof extension.getInteractionElements !== 'function') {
      return false
    }

    let extensionElements = extension.getInteractionElements()
    if (!extensionElements) {
      return false
    }

    if (!Array.isArray(extensionElements)) {
      extensionElements = [extensionElements]
    }
    return extensionElements.some((el) => {
      return util.isDescendant(el, element, true)
    })
  })
}

interface EventRecord {
  target: EventTarget
  event: string
  listener: EventListener
  useCapture: boolean
}

export class Events {
  base: any
  options: any
  events: EventRecord[] = []
  disabledEvents: Record<string, boolean> = {}
  customEvents: Record<string, MediumEditorEventListener[]> = {}
  listeners: Record<string, any> = {}
  contentCache: Record<string, string> = {}
  eventsCache: any[] = []
  execCommandListener?: (execInfo: any) => void
  lastMousedownTarget: EventTarget | null = null
  InputEventOnContenteditableSupported: boolean = !util.isIE && !util.isEdge

  static readonly InputEventOnContenteditableSupported: boolean = !util.isIE && !util.isEdge

  constructor(instance: any) {
    this.base = instance
    this.options = this.base.options
  }

  // DOM Event Handling
  attachDOMEvent(targets: EventTarget | EventTarget[] | HTMLCollectionOf<Element>, event: string, listener: EventListener, useCapture = false): void {
    let targetArray: EventTarget[]

    if (Array.isArray(targets)) {
      targetArray = targets
    }
    else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets) as EventTarget[]
    }
    else {
      targetArray = [targets]
    }

    targetArray.forEach((target) => {
      target.addEventListener(event, listener, useCapture)
      this.events.push({ target, event, listener, useCapture })
    })
  }

  detachDOMEvent(targets: EventTarget | EventTarget[] | HTMLCollectionOf<Element>, event: string, listener: EventListener, useCapture = false): void {
    let targetArray: EventTarget[]

    if (Array.isArray(targets)) {
      targetArray = targets
    }
    else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets) as EventTarget[]
    }
    else {
      targetArray = [targets]
    }

    targetArray.forEach((target) => {
      const index = this.indexOfListener(target, event, listener, useCapture)
      if (index !== -1) {
        const eventRecord = this.events.splice(index, 1)[0]
        eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture)
      }
    })
  }

  indexOfListener(target: EventTarget, event: string, listener: EventListener, useCapture: boolean): number {
    for (let i = 0; i < this.events.length; i++) {
      const item = this.events[i]
      if (item.target === target && item.event === event && item.listener === listener && item.useCapture === useCapture) {
        return i
      }
    }
    return -1
  }

  detachAllDOMEvents(): void {
    let eventRecord = this.events.pop()
    while (eventRecord) {
      eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture)
      eventRecord = this.events.pop()
    }
  }

  detachAllEventsFromElement(element: HTMLElement): void {
    const filtered = this.events.filter((e) => {
      const target = e.target as any
      return target && target.getAttribute && target.getAttribute('medium-editor-index') === element.getAttribute('medium-editor-index')
    })

    filtered.forEach((eventRecord) => {
      this.detachDOMEvent(eventRecord.target, eventRecord.event, eventRecord.listener, eventRecord.useCapture)
    })
  }

  attachAllEventsToElement(element: HTMLElement): void {
    if (this.listeners.editableInput) {
      this.contentCache[element.getAttribute('medium-editor-index') || ''] = element.innerHTML
    }

    if (this.eventsCache) {
      this.eventsCache.forEach((e) => {
        this.attachDOMEvent(element, e.name, e.handler.bind(this))
      })
    }
  }

  // Custom Event Handling
  enableCustomEvent(event: string): void {
    if (this.disabledEvents[event] !== undefined) {
      delete this.disabledEvents[event]
    }
  }

  disableCustomEvent(event: string): void {
    this.disabledEvents[event] = true
  }

  attachCustomEvent(event: string, listener: MediumEditorEventListener): void {
    if (!this.customEvents[event]) {
      this.customEvents[event] = []
    }
    this.customEvents[event].push(listener)
  }

  detachCustomEvent(event: string, listener: MediumEditorEventListener): void {
    const index = this.indexOfCustomListener(event, listener)
    if (index !== -1) {
      this.customEvents[event].splice(index, 1)
    }
  }

  indexOfCustomListener(event: string, listener: MediumEditorEventListener): number {
    if (!this.customEvents[event] || !this.customEvents[event].length) {
      return -1
    }

    return this.customEvents[event].indexOf(listener)
  }

  detachAllCustomEvents(): void {
    this.customEvents = {}
  }

  triggerCustomEvent(name: string, data?: any, editable?: HTMLElement): void {
    if (this.customEvents[name] && !this.disabledEvents[name]) {
      this.customEvents[name].forEach((listener) => {
        listener(data, editable)
      })
    }
  }

  // Event listener setup
  setupListener(name: string): void {
    if (this.listeners[name]) {
      return
    }

    switch (name) {
      case 'externalInteraction':
        // Detecting when user has interacted with elements outside of MediumEditor
        this.attachDOMEvent(this.options.ownerDocument.body, 'mousedown', this.handleBodyMousedown.bind(this), true)
        this.attachDOMEvent(this.options.ownerDocument.body, 'click', this.handleBodyClick.bind(this), true)
        this.attachDOMEvent(this.options.ownerDocument.body, 'focus', this.handleBodyFocus.bind(this), true)
        this.listeners[name] = true
        break
      case 'blur':
        // Detecting when focus is lost
        this.setupListener('externalInteraction')
        this.listeners[name] = true
        break
      case 'focus':
        // Detecting when focus moves into some part of MediumEditor
        this.setupListener('externalInteraction')
        // Also add direct focus listeners to each editor element since focus doesn't bubble
        this.attachToEachElement('focus', this.handleElementFocus.bind(this))
        this.listeners[name] = true
        break
      case 'editableInput':
        // setup cache for knowing when the content has changed
        this.contentCache = {}
        this.base.elements.forEach((element: HTMLElement) => {
          this.contentCache[element.getAttribute('medium-editor-index') || ''] = element.innerHTML
        })
        this.listeners[name] = this.handleInput.bind(this)
        this.attachToEachElement('input', this.listeners[name])
        break
      case 'editableClick':
        this.listeners[name] = this.handleClick.bind(this)
        this.attachToEachElement('click', this.listeners[name])
        break
      case 'editableBlur':
        this.listeners[name] = this.handleBlur.bind(this)
        this.attachToEachElement('blur', this.listeners[name])
        break
      case 'editableKeypress':
        this.listeners[name] = this.handleKeypress.bind(this)
        this.attachToEachElement('keypress', this.listeners[name])
        break
      case 'editableKeyup':
        this.listeners[name] = this.handleKeyup.bind(this)
        this.attachToEachElement('keyup', this.listeners[name])
        break
      case 'editableKeydown':
        this.listeners[name] = this.handleKeydown.bind(this)
        this.attachToEachElement('keydown', this.listeners[name])
        break
      case 'editablePaste':
        this.listeners[name] = this.handlePaste.bind(this)
        this.attachToEachElement('paste', this.listeners[name])
        break
      case 'editableDrag':
        this.listeners[name] = this.handleDrag.bind(this)
        this.attachToEachElement('dragstart', this.listeners[name])
        this.attachToEachElement('dragover', this.listeners[name])
        this.attachToEachElement('dragleave', this.listeners[name])
        break
      case 'editableDrop':
        this.listeners[name] = this.handleDrop.bind(this)
        this.attachToEachElement('drop', this.listeners[name])
        break
    }
  }

  attachToEachElement(name: string, handler: EventListener): void {
    this.base.elements.forEach((element: HTMLElement) => {
      this.attachDOMEvent(element, name, handler.bind(this))
    })

    this.eventsCache.push({ name, handler })
  }

  // Event handlers
  handleInput(event: Event): void {
    if (event.target) {
      this.updateInput(event.target as HTMLElement, event)
    }
  }

  handleClick(event: Event): void {
    this.triggerCustomEvent('editableClick', event, event.target as HTMLElement)
  }

  handleBlur(event: Event): void {
    this.triggerCustomEvent('editableBlur', event, event.target as HTMLElement)
  }

  handleKeypress(event: KeyboardEvent): void {
    this.triggerCustomEvent('editableKeypress', event, event.target as HTMLElement)
  }

  handleKeyup(event: KeyboardEvent): void {
    this.triggerCustomEvent('editableKeyup', event, event.target as HTMLElement)
  }

  handleKeydown(event: KeyboardEvent): void {
    this.triggerCustomEvent('editableKeydown', event, event.target as HTMLElement)
  }

  handleElementFocus(event: Event): void {
    this.updateFocus(event.target as HTMLElement, event)
  }

  handlePaste(event: Event): void {
    this.triggerCustomEvent('editablePaste', event, event.target as HTMLElement)
  }

  handleDrag(event: Event): void {
    this.triggerCustomEvent('editableDrag', event, event.target as HTMLElement)
  }

  handleDrop(event: Event): void {
    this.triggerCustomEvent('editableDrop', event, event.target as HTMLElement)
  }

  updateInput(target: HTMLElement, eventObj: Event): void {
    const index = target.getAttribute('medium-editor-index')
    if (index && this.contentCache[index] && this.contentCache[index] !== target.innerHTML) {
      this.triggerCustomEvent('editableInput', eventObj, target)
    }
    if (index) {
      this.contentCache[index] = target.innerHTML
    }
  }

  // Document-level event handlers
  handleDocumentSelectionChange(_event: Event): void {
    if (this.base.options.ownerDocument.getSelection) {
      const selection = this.base.options.ownerDocument.getSelection()
      if (selection && !selection.isCollapsed) {
        this.base.checkSelection()
      }
    }
  }

  handleDocumentExecCommand(): void {
    // Handle execCommand events
    this.base.checkSelection()
  }

  handleBodyClick(event: Event): void {
    this.updateFocus(event.target as HTMLElement, event)
  }

  handleBodyFocus(event: Event): void {
    this.updateFocus(event.target as HTMLElement, event)
  }

  handleBodyMousedown(event: Event): void {
    this.lastMousedownTarget = event.target
  }

  updateFocus(target: HTMLElement, eventObj: Event): void {
    const hadFocus = this.base.getFocusedElement()
    let toFocus: HTMLElement | null = null

    // For clicks, we need to know if the mousedown that caused the click happened inside the existing focused element
    // or one of the extension elements. If so, we don't want to focus another element
    if (hadFocus
      && (eventObj as any).type === 'click'
      && this.lastMousedownTarget
      && (util.isDescendant(hadFocus, this.lastMousedownTarget as Node, true)
        || isElementDescendantOfExtension(this.base.extensions, this.lastMousedownTarget as HTMLElement))) {
      toFocus = hadFocus
    }

    if (!toFocus) {
      this.base.elements.some((element: HTMLElement) => {
        // If the target is part of an editor element, this is the element getting focus
        if (!toFocus && util.isDescendant(element, target, true)) {
          toFocus = element
        }
        // bail if we found an element that's getting focus
        return !!toFocus
      })
    }

    // Check if the target is external (not part of the editor, toolbar, or any other extension)
    const externalEvent = !util.isDescendant(hadFocus, target, true)
      && !isElementDescendantOfExtension(this.base.extensions, target)

    if (toFocus !== hadFocus) {
      // If element has focus, and focus is going outside of editor
      // Don't blur focused element if clicking on editor, toolbar, or anchorpreview
      if (hadFocus && externalEvent) {
        // Trigger blur on the editable that has lost focus
        hadFocus.removeAttribute('data-medium-focused')
        this.triggerCustomEvent('blur', eventObj, hadFocus)
      }

      // If focus is going into an editor element
      if (toFocus) {
        // Trigger focus on the editable that now has focus
        toFocus.setAttribute('data-medium-focused', 'true')
        this.triggerCustomEvent('focus', eventObj, toFocus)
      }
    }

    if (externalEvent) {
      this.triggerCustomEvent('externalInteraction', eventObj)
    }
  }

  focusElement(element: HTMLElement): void {
    element.focus()
    const focusEvent = new Event('focus')
    Object.defineProperty(focusEvent, 'target', { value: element, writable: false })
    this.updateFocus(element, focusEvent)
  }

  cleanupElement(element: HTMLElement): void {
    element.removeAttribute('data-medium-focused')
  }

  // ExecCommand handling
  attachToExecCommand(): void {
    if (this.execCommandListener) {
      return
    }

    this.execCommandListener = (_execInfo: any) => {
      this.handleDocumentExecCommand()
    }

    this.wrapExecCommand()

    const doc = this.options.ownerDocument as any
    if (!doc.execCommand.listeners) {
      doc.execCommand.listeners = []
    }
    doc.execCommand.listeners.push(this.execCommandListener)
  }

  detachExecCommand(): void {
    const doc = this.options.ownerDocument as any
    if (this.execCommandListener && doc.execCommand && doc.execCommand.listeners) {
      const index = doc.execCommand.listeners.indexOf(this.execCommandListener)
      if (index !== -1) {
        doc.execCommand.listeners.splice(index, 1)
      }
      if (doc.execCommand.listeners.length === 0) {
        this.unwrapExecCommand()
      }
    }
  }

  wrapExecCommand(): void {
    const doc = this.options.ownerDocument as any

    if (doc.execCommand.listeners) {
      return
    }

    const callListeners = (args: any[], result: any) => {
      if (doc.execCommand.listeners) {
        doc.execCommand.listeners.forEach((listener: any) => {
          listener({ command: args[0], args, result })
        })
      }
    }

    const originalExecCommand = doc.execCommand
    const wrapper = function (...args: any[]) {
      const result = originalExecCommand.apply(doc, args)
      callListeners(args, result)
      return result
    }

    wrapper.listeners = []
    wrapper.original = originalExecCommand
    doc.execCommand = wrapper
  }

  unwrapExecCommand(): void {
    const doc = this.options.ownerDocument as any
    if (doc.execCommand.original) {
      doc.execCommand = doc.execCommand.original
    }
  }

  // Cleanup
  destroy(): void {
    this.detachAllDOMEvents()
    this.detachAllCustomEvents()
    this.detachExecCommand()

    if (this.base.elements) {
      this.base.elements.forEach((element: HTMLElement) => {
        element.removeAttribute('data-medium-focused')
      })
    }
  }
}
