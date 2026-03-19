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
