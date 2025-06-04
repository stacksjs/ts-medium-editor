import type { MediumEditor as MediumEditorType } from '../../src/types'
import { MediumEditor } from '../../src/core'

export interface TestHelpers {
  elements: HTMLElement[]
  editors: MediumEditorType[]
  createElement: (tag: string, className?: string, html?: string, dontAppend?: boolean) => HTMLElement
  newMediumEditor: (selector: string | HTMLElement | HTMLElement[] | NodeList, options?: any) => MediumEditorType
  cleanupTest: () => void
}

export function setupTestHelpers(): TestHelpers {
  const elements: HTMLElement[] = []
  const editors: MediumEditorType[] = []

  const createElement = (tag: string, className?: string, html?: string, dontAppend?: boolean): HTMLElement => {
    const el = document.createElement(tag)
    el.innerHTML = html || ''
    if (className) {
      el.className = className
    }
    elements.push(el)
    if (!dontAppend) {
      document.body.appendChild(el)
    }
    return el
  }

  const newMediumEditor = (selector: string | HTMLElement | HTMLElement[] | NodeList, options?: any): any => {
    const editor = new MediumEditor(selector, options)
    editors.push(editor as any)
    return editor
  }

  const cleanupTest = (): void => {
    editors.forEach((editor) => {
      if (editor && typeof editor.destroy === 'function') {
        editor.destroy()
      }
    })
    elements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })

    // Clear arrays
    elements.length = 0
    editors.length = 0
  }

  return {
    elements,
    editors,
    createElement,
    newMediumEditor,
    cleanupTest,
  }
}

// Browser detection utilities
export function isIE9(): boolean {
  return navigator.appName.includes('Internet Explorer') && navigator.appVersion.includes('MSIE 9')
}

export function isIE10(): boolean {
  return navigator.appName.includes('Internet Explorer') && navigator.appVersion.includes('MSIE 10')
}

export function isOldIE(): boolean {
  return isIE9() || isIE10()
}

export function isIE(): boolean {
  return ((navigator.appName === 'Microsoft Internet Explorer')
    || ((navigator.appName === 'Netscape')
      && (/Trident\/.*rv:(\d[.0-9]*)/).exec(navigator.userAgent) !== null))
}

export function getEdgeVersion(): number {
  const match = /Edge\/(\d+[,.]\d+)/.exec(navigator.userAgent)
  if (match !== null) {
    return +match[1]
  }
  return 0
}

export function isFirefox(): boolean {
  return navigator.userAgent.toLowerCase().includes('firefox')
}

export function isSafari(): boolean {
  return navigator.userAgent.toLowerCase().includes('safari')
}

// Utility to convert data URI to Blob for file testing
export function dataURItoBlob(dataURI: string): Blob {
  let byteString: string

  if (dataURI.split(',')[0].includes('base64')) {
    byteString = atob(dataURI.split(',')[1])
  }
  else {
    byteString = unescape(dataURI.split(',')[1])
  }

  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}

// Event firing utilities
export interface EventOptions {
  keyCode?: number
  ctrlKey?: boolean
  target?: HTMLElement
  relatedTarget?: HTMLElement
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  currentTarget?: HTMLElement
}

export function fireEvent(element: HTMLElement, eventName: string, options: EventOptions = {}): boolean {
  const evt = prepareEvent(element, eventName, options)
  return firePreparedEvent(evt, element, eventName)
}

export function prepareEvent(element: HTMLElement, eventName: string, options: EventOptions = {}): Event {
  let evt: Event

  if (document.createEvent) {
    evt = document.createEvent('HTMLEvents')
    evt.initEvent(eventName, true, true)

    // Add custom properties using defineProperty for readonly properties
    try {
      Object.defineProperty(evt, 'currentTarget', { value: options.currentTarget || element, writable: false })
      Object.defineProperty(evt, 'keyCode', { value: options.keyCode, writable: false })
      Object.defineProperty(evt, 'which', { value: options.keyCode, writable: false })
      Object.defineProperty(evt, 'ctrlKey', { value: options.ctrlKey || false, writable: false })
      Object.defineProperty(evt, 'metaKey', { value: options.metaKey || false, writable: false })
      Object.defineProperty(evt, 'target', { value: options.target || element, writable: false })
      Object.defineProperty(evt, 'relatedTarget', { value: options.relatedTarget, writable: false })
      Object.defineProperty(evt, 'shiftKey', { value: options.shiftKey || false, writable: false })
      Object.defineProperty(evt, 'altKey', { value: options.altKey || false, writable: false })
    }
    catch {
      // Fallback for environments where properties can't be defined
    }

    if (eventName.includes('drag') || eventName === 'drop') {
      (evt as any).dataTransfer = {
        dropEffect: '',
      }

      if (!isIE9() && eventName === 'drop') {
        const file = dataURItoBlob('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        if (!(file as any).type) {
          (file as any).type = 'image/gif'
        }
        (evt as any).dataTransfer.files = [file]
      }
    }
  }
  else {
    // IE fallback
    evt = (document as any).createEventObject()
  }

  return evt
}

export function firePreparedEvent(event: Event, element: HTMLElement, eventName: string): boolean {
  if (element.dispatchEvent) {
    return element.dispatchEvent(event)
  }
  else {
    // IE fallback
    return (element as any).fireEvent(`on${eventName}`, event)
  }
}

// Selection utilities
export function placeCursorInsideElement(el: HTMLElement, index = 0): void {
  const range = document.createRange()
  const sel = window.getSelection()

  if (el.childNodes[index]) {
    range.setStart(el.childNodes[index], 0)
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
}

export interface SelectionOptions {
  index?: number
  offset?: number
  eventToFire?: string
}

export function selectElementContents(el: HTMLElement, options: SelectionOptions = {}): void {
  const range = document.createRange()
  const sel = window.getSelection()

  if (options.index !== undefined && el.childNodes[options.index]) {
    range.selectNodeContents(el.childNodes[options.index])
  }
  else {
    range.selectNodeContents(el)
  }

  if (options.offset !== undefined) {
    range.setStart(range.startContainer, options.offset)
  }

  sel?.removeAllRanges()
  sel?.addRange(range)
}

export function selectElementContentsAndFire(el: HTMLElement, options: SelectionOptions = {}): void {
  selectElementContents(el, options)
  fireEvent(el, 'focus')
  fireEvent(el, 'click')

  // Fire the custom event if specified
  if (options.eventToFire) {
    fireEvent(el, options.eventToFire)
  }
}

// Mock for setTimeout/setInterval timing
export function tick(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Utility to wait for next microtask
export function nextTick(): Promise<void> {
  return Promise.resolve()
}

// Mock execCommand for testing
export function mockExecCommand(): any {
  const originalExecCommand = (document as any).execCommand

  // Create a mock function that tracks calls
  let callCount = 0
  const calls: any[] = []
  const mockFn = (...args: any[]) => {
    callCount++
    calls.push(args)
    return true
  }

  // Add mock properties
  ;(mockFn as any).mock = {
    calls,
    callCount: () => callCount,
    returnValue: (_value: any) => { /* Mock functionality */ },
  }

  // Replace execCommand with our mock
  Object.defineProperty(document, 'execCommand', {
    value: mockFn,
    writable: true,
    configurable: true,
  })

  return {
    mockFn,
    restore: () => {
      if (originalExecCommand) {
        Object.defineProperty(document, 'execCommand', {
          value: originalExecCommand,
          writable: true,
          configurable: true,
        })
      }
      else {
        delete (document as any).execCommand
      }
    },
  }
}

// Mock ownerDocument.execCommand for MediumEditor instances
export function mockOwnerDocumentExecCommand(ownerDoc: Document = document): any {
  const originalExecCommand = (ownerDoc as any).execCommand

  // Create a mock function that tracks calls
  let callCount = 0
  const calls: any[] = []
  const mockFn = (...args: any[]) => {
    callCount++
    calls.push(args)
    return true
  }

  // Add mock properties
  ;(mockFn as any).mock = {
    calls,
    callCount: () => callCount,
    returnValue: (_value: any) => { /* Mock functionality */ },
  }

  // Replace execCommand with our mock
  Object.defineProperty(ownerDoc, 'execCommand', {
    value: mockFn,
    writable: true,
    configurable: true,
  })

  return {
    mockFn,
    restore: () => {
      if (originalExecCommand) {
        Object.defineProperty(ownerDoc, 'execCommand', {
          value: originalExecCommand,
          writable: true,
          configurable: true,
        })
      }
      else {
        delete (ownerDoc as any).execCommand
      }
    },
  }
}
