/**
 * stx Integration Helpers
 *
 * Thin wrapper around `MediumEditor` so stx (and any signal-based) consumers
 * can drop a fully-wired editor into a `<script client>` block without
 * re-implementing the mount/destroy/draft/change-event plumbing every time.
 *
 * Why a helper instead of a `.stx` component:
 *
 *  - `ts-medium-editor` doesn't depend on stx at the library level (no
 *    `state`, `useRef`, `onMount` imports). Shipping an `.stx` component
 *    would require a Bun resolver hop and bake in stx-specific lifecycle
 *    semantics — neither is appropriate for a framework-agnostic editor.
 *  - The mount/teardown logic IS shared. Centralizing it here means a
 *    consumer template only carries markup, styling, and event wiring;
 *    the bookkeeping moves into one tested codepath.
 *
 * Typical usage (inside an `.stx` file):
 *
 * ```stx
 * <script client>
 *   import { mountMediumEditor } from 'ts-medium-editor/stx'
 *   import 'ts-medium-editor/css/medium-editor.css'
 *   import 'ts-medium-editor/css/themes/default.css'
 *
 *   const editorMount = useRef<HTMLElement>('editorMount')
 *
 *   onMount(() => {
 *     if (!editorMount.current) return
 *     return mountMediumEditor({
 *       element: editorMount.current,
 *       storageKey: 'my-app:compose-draft',
 *       editorOptions: { placeholder: { text: 'Share your story…' } },
 *       onChange(html) {
 *         // pipe html into a signal, or rely on the @richtext:change event
 *       },
 *     })
 *   })
 * </script>
 *
 * <div class="...">
 *   <div ref="editorMount" class="medium-editor-element"></div>
 * </div>
 * ```
 *
 * The host `<div ref="editorMount">` already participates in stx's ref
 * system; `mountMediumEditor` takes the resolved DOM element so this
 * module stays signal-API-agnostic.
 *
 * @module ts-medium-editor/stx
 */

import { MediumEditor } from '../core'
import type { MediumEditorOptions } from '../types'

/**
 * Detail payload emitted on the configurable change event (default
 * `richtext:change`). Stable across versions — adding fields is OK,
 * renaming is a breaking change.
 */
export interface RichTextChangeDetail {
  /** The editor's current content as HTML. */
  html: string
}

export interface MountMediumEditorOptions {
  /**
   * The host element to mount on. Already-resolved DOM node (i.e.
   * `ref.current`), not a stx ref handle — this module is framework-agnostic.
   */
  element: HTMLElement

  /**
   * If set, content is auto-saved to `localStorage` under this key and
   * restored on mount. Drafts that collapse to an empty `<p><br></p>`
   * (medium-editor's default empty state) are cleared rather than stored,
   * so a "submit & wipe" flow doesn't leave a stale empty draft behind.
   *
   * Pass `false` or omit to disable persistence entirely (useful for
   * comment composers where each submit should leave no trace).
   */
  storageKey?: string | false

  /**
   * Debounce window in ms for the localStorage write. Saves coalesce
   * inside this window, so keystroke storms don't hammer storage. Only
   * meaningful when `storageKey` is set. Default: 500ms.
   */
  saveDebounceMs?: number

  /**
   * Called whenever the editor's content changes, after the debounce.
   * Receives the current HTML. Mirrors the data dispatched on the
   * `richtext:change` custom event — pick whichever channel fits the
   * consumer's reactivity story.
   */
  onChange?: (html: string) => void

  /**
   * Custom event dispatched on the host element on every change. Bubbles,
   * so parents can listen via stx's `@richtext:change="…"` shorthand
   * without ref-walking.
   *
   * Set to `false` to disable event dispatch (useful when `onChange` is
   * sufficient and you want to avoid a `CustomEvent` allocation per
   * keystroke). Default: `'richtext:change'`.
   */
  changeEvent?: string | false

  /**
   * Passed straight through to `new MediumEditor(element, options)`.
   * Shallow-merged on top of the helper's sensible defaults (floating
   * toolbar, autoLink, smart paste, markdown shortcuts, slash commands,
   * tables, task list, spellcheck). Setting any top-level key here
   * REPLACES the matching default — pass `slashCommands: { commands }`
   * to swap the command set, or `slashCommands: false` to turn it off
   * entirely.
   */
  editorOptions?: MediumEditorOptions
}

/**
 * Sensible defaults that match what most "compose a review / comment /
 * post" surfaces want: floating toolbar with the common formatting set,
 * markdown shortcuts on, smart paste, and the new structural extensions
 * (tables, task list, slash commands) enabled.
 *
 * Toolbar buttons are intentionally minimal — projects routinely want
 * to add/remove specific buttons, and `toolbar.buttons` is the easiest
 * thing to override via `editorOptions`.
 */
const DEFAULT_EDITOR_OPTIONS: MediumEditorOptions = {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist'],
    static: false,
  },
  placeholder: {
    text: 'Tell your story…',
    hideOnClick: true,
  },
  anchor: {
    linkValidation: true,
    targetCheckbox: true,
  },
  paste: {
    cleanPastedHTML: true,
    forcePlainText: false,
  },
  autoLink: true,
  targetBlank: true,
  spellcheck: true,
  markdownShortcuts: true,
  slashCommands: true,
  taskList: true,
  tables: true,
}

// MediumEditor's empty-state shape. Don't persist drafts that collapse to
// this — they're indistinguishable from "user cleared the editor."
const EMPTY_CONTENT = '<p><br></p>'

/**
 * Read a previously-saved draft for this `storageKey`. Returns `''` on
 * any storage failure (Safari private mode, quota exceeded, sandboxed
 * iframe) — callers treat that as "no draft" without throwing.
 */
function readDraft(storageKey: string): string {
  try {
    return localStorage.getItem(storageKey) || ''
  }
  catch {
    return ''
  }
}

/**
 * Write `html` under `storageKey`, or delete the key if the content is
 * empty / whitespace / medium-editor's empty-paragraph sentinel.
 * Wrapped in try/catch so storage failures don't surface as runtime
 * errors during a keystroke.
 */
function writeDraft(storageKey: string, html: string): void {
  try {
    const trimmed = html?.trim()
    if (trimmed && trimmed !== EMPTY_CONTENT)
      localStorage.setItem(storageKey, html)
    else
      localStorage.removeItem(storageKey)
  }
  catch {
    // localStorage unavailable (private mode, quota exhausted, sandboxed
    // iframe) — drafts silently degrade to in-memory. Surfacing this
    // would be more annoying than helpful on every keystroke.
  }
}

/**
 * Mount a configured `MediumEditor` on `options.element`.
 *
 * Returns a teardown function that destroys the editor, cancels pending
 * draft saves, and removes the change-event listener. Pass it through
 * to the `onMount` cleanup slot so the editor is properly torn down on
 * unmount, route change, or HMR reload.
 *
 * Idempotency: this function does not guard against being called twice
 * against the same `element`. The caller's `onMount` already runs once
 * per mount lifecycle; double-mounting would be a consumer bug, not
 * something to silently absorb here.
 *
 * @returns Cleanup function — call from the onMount return slot.
 */
export function mountMediumEditor(options: MountMediumEditorOptions): () => void {
  const {
    element,
    storageKey,
    saveDebounceMs = 500,
    onChange,
    changeEvent = 'richtext:change',
    editorOptions,
  } = options

  // Hydrate from an existing draft BEFORE constructing the editor — once
  // MediumEditor takes over the element, setting innerHTML through the
  // editor's own API would trigger a spurious change event. Setting the
  // raw DOM here keeps the initial state quiet.
  if (storageKey) {
    const draft = readDraft(storageKey)
    if (draft)
      element.innerHTML = draft
  }

  const editor = new MediumEditor(element, {
    ...DEFAULT_EDITOR_OPTIONS,
    ...editorOptions,
  })

  let saveTimer: ReturnType<typeof setTimeout> | null = null

  // `editableInput` fires on every content-affecting interaction (typing,
  // paste, toolbar action, slash-command insertion). One handler, one
  // debounce, one event/callback fan-out.
  const handler = (): void => {
    const html = editor.getContent() || ''

    if (storageKey) {
      if (saveTimer)
        clearTimeout(saveTimer)
      saveTimer = setTimeout(() => writeDraft(storageKey, html), saveDebounceMs)
    }

    if (changeEvent !== false) {
      const detail: RichTextChangeDetail = { html }
      element.dispatchEvent(new CustomEvent(changeEvent, { bubbles: true, detail }))
    }

    onChange?.(html)
  }

  editor.subscribe('editableInput', handler)

  // Restoring a draft populates the element synchronously but doesn't
  // emit `editableInput`. Fire the consumer's onChange / event once
  // explicitly so any derived state (character count, validation,
  // submit-button enable) reflects the restored content from frame 1.
  if (storageKey) {
    const draft = readDraft(storageKey)
    if (draft) {
      if (changeEvent !== false) {
        const detail: RichTextChangeDetail = { html: draft }
        element.dispatchEvent(new CustomEvent(changeEvent, { bubbles: true, detail }))
      }
      onChange?.(draft)
    }
  }

  return () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    editor.unsubscribe('editableInput', handler)
    editor.destroy()
  }
}
