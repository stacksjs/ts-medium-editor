import { MediumEditor } from './core'
import { Events } from './events'
import { selection } from './selection'
import { util } from './util'

// Make MediumEditor available globally
;(window as any).MediumEditor = MediumEditor

// Also expose utilities for advanced usage
;(window as any).MediumEditor.Events = Events
;(window as any).MediumEditor.selection = selection
;(window as any).MediumEditor.util = util

export { MediumEditor as default }
export { MediumEditor, Events, selection, util }
