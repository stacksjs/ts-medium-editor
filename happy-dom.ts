import { GlobalWindow } from 'very-happy-dom'

const window = new GlobalWindow()

// Register browser globals for test environment
for (const key of Object.getOwnPropertyNames(window)) {
  if (!(key in globalThis)) {
    window.setGlobal(key, (window as any)[key])
  }
}
