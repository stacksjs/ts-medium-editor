import { MediumEditor } from './core'

// Attach to global window object for browser compatibility
if (typeof window !== 'undefined') {
  (window as any).MediumEditor = MediumEditor
}

export { MediumEditor as default }
export * from './index'
