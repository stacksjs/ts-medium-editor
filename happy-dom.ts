import { GlobalWindow } from 'happy-dom'

const win = new GlobalWindow({ url: 'http://localhost' })

// Register all browser globals from the window instance
for (const key of Object.getOwnPropertyNames(win)) {
  if (key === 'constructor' || key === 'undefined' || key === 'NaN' || key === 'Infinity') continue
  try {
    ;(globalThis as any)[key] = (win as any)[key]
  }
  catch {
    // Some properties may not be configurable
  }
}

// Register prototype-level getters/methods
for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(win))) {
  if (key === 'constructor' || key in globalThis) continue
  try {
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(win), key)
    if (descriptor?.get) {
      Object.defineProperty(globalThis, key, {
        get: () => (win as any)[key],
        configurable: true,
      })
    }
    else if (typeof (win as any)[key] === 'function') {
      ;(globalThis as any)[key] = (win as any)[key].bind(win)
    }
  }
  catch {
    // Skip non-configurable properties
  }
}

// Ensure window is set
;(globalThis as any).window = win
