// Wrapper to make MediumEditor available globally
import { Events, MediumEditor, selection, util } from './medium-editor.js'

// Attach to window object for global access
window.MediumEditor = MediumEditor
window.MediumEditorEvents = Events
window.MediumEditorUtil = util
window.MediumEditorSelection = selection

// MediumEditor loaded and available globally
