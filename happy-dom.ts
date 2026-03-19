import { GlobalWindow } from 'very-happy-dom'

const win = new GlobalWindow({ url: 'http://localhost' })

// Register core browser globals needed by the test environment
const globals: Record<string, unknown> = {
  window: win,
  document: win.document,
  navigator: win.navigator,
  location: win.location,
  localStorage: win.localStorage,
  sessionStorage: win.sessionStorage,
  CustomEvent: win.CustomEvent,
  HTMLElement: win.HTMLElement,
  MutationObserver: win.MutationObserver,
  IntersectionObserver: win.IntersectionObserver,
  ResizeObserver: win.ResizeObserver,
  XMLHttpRequest: win.XMLHttpRequest,
  WebSocket: win.WebSocket,
  File: win.File,
  FileReader: win.FileReader,
  FileList: win.FileList,
  URL: win.URL,
  URLSearchParams: win.URLSearchParams,
  Headers: win.Headers,
  Request: win.Request,
  Response: win.Response,
  FormData: win.FormData,
  performance: win.performance,
  requestAnimationFrame: win.requestAnimationFrame.bind(win),
  cancelAnimationFrame: win.cancelAnimationFrame.bind(win),
  setTimeout: win.setTimeout.bind(win),
  clearTimeout: win.clearTimeout.bind(win),
  setInterval: win.setInterval.bind(win),
  clearInterval: win.clearInterval.bind(win),
  fetch: win.fetch,
}

for (const [key, value] of Object.entries(globals)) {
  if (value !== undefined) {
    ;(globalThis as any)[key] = value
  }
}

// Stub Range and Selection APIs needed by rich text editor tests
class MockRange {
  startContainer: any = null
  startOffset = 0
  endContainer: any = null
  endOffset = 0
  collapsed = true
  commonAncestorContainer: any = null

  setStart(node: any, offset: number): void { this.startContainer = node; this.startOffset = offset; this.commonAncestorContainer = node }
  setEnd(node: any, offset: number): void { this.endContainer = node; this.endOffset = offset }
  collapse(toStart?: boolean): void { this.collapsed = true }
  cloneRange(): MockRange { return Object.assign(new MockRange(), this) }
  selectNode(node: any): void { this.startContainer = node; this.endContainer = node }
  selectNodeContents(node: any): void { this.startContainer = node; this.endContainer = node }
  deleteContents(): void {}
  insertNode(_node: any): void {}
  cloneContents(): any { return (win.document as any).createDocumentFragment?.() ?? {} }
  toString(): string { return '' }
}

class MockSelection {
  rangeCount = 0
  private ranges: MockRange[] = []

  getRangeAt(index: number): MockRange { return this.ranges[index] || new MockRange() }
  addRange(range: MockRange): void { this.ranges.push(range); this.rangeCount = this.ranges.length }
  removeAllRanges(): void { this.ranges = []; this.rangeCount = 0 }
  collapse(node: any, offset?: number): void {}
  toString(): string { return '' }
  get anchorNode(): any { return this.ranges[0]?.startContainer ?? null }
  get anchorOffset(): number { return this.ranges[0]?.startOffset ?? 0 }
  get focusNode(): any { return this.ranges[0]?.endContainer ?? null }
  get focusOffset(): number { return this.ranges[0]?.endOffset ?? 0 }
  get isCollapsed(): boolean { return this.ranges[0]?.collapsed ?? true }
}

const mockSelection = new MockSelection()
const doc = (globalThis as any).document
if (doc && !doc.createRange) {
  doc.createRange = () => new MockRange()
}
if (!(globalThis as any).window.getSelection) {
  ;(globalThis as any).window.getSelection = () => mockSelection
}
if (!(globalThis as any).getSelection) {
  ;(globalThis as any).getSelection = () => mockSelection
}
if (doc && !doc.getSelection) {
  doc.getSelection = () => mockSelection
}
