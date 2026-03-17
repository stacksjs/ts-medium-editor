import { MediumEditor } from './core'
import { Events } from './events'
import { selection } from './selection'
import { util } from './util'

const w = window as any
w.MediumEditor = MediumEditor

// Also expose utilities for advanced usage
w.MediumEditor.Events = Events
w.MediumEditor.selection = selection
w.MediumEditor.util = util

export { MediumEditor as default }
export { Events, MediumEditor, selection, util }
