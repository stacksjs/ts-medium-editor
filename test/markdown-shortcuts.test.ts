import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { setupTestHelpers } from './helpers/test-utils'

function placeCaretAtEnd(textNode: Text): void {
  const range = document.createRange()
  range.setStart(textNode, textNode.length)
  range.collapse(true)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function fireKeyup(editable: HTMLElement, key: string): void {
  const evt = new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true })
  editable.dispatchEvent(evt)
}

interface ExecCall { command: string, value?: string }

// happy-dom's execCommand only implements `formatBlock` for headings reliably
// and is missing `blockquote`, `pre`, `insertUnorderedList`, and
// `insertOrderedList`. Tests that need to verify those branches stub
// execCommand and assert the extension dispatched the right command — the
// real DOM transform is the browser's responsibility.
function spyExec(): { calls: ExecCall[], restore: () => void } {
  const calls: ExecCall[] = []
  const original = document.execCommand
  document.execCommand = function patched(cmd: string, _ui?: boolean, value?: string): boolean {
    calls.push({ command: cmd, value })
    return original.call(document, cmd, _ui, value)
  } as typeof document.execCommand
  return { calls, restore: () => { document.execCommand = original } }
}

describe('MarkdownShortcuts extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', '<p># </p>')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  it('dispatches formatBlock=h1 for "# "', () => {
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', { markdownShortcuts: true })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'formatBlock' && c.value === 'h1')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('dispatches formatBlock=h2 for "## "', () => {
    el.innerHTML = '<p>## </p>'
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', { markdownShortcuts: true })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'formatBlock' && c.value === 'h2')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('dispatches formatBlock=blockquote for "> "', () => {
    el.innerHTML = '<p>&gt; </p>'
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', { markdownShortcuts: true })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'formatBlock' && c.value === 'blockquote')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('dispatches insertUnorderedList for "- "', () => {
    el.innerHTML = '<p>- </p>'
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', { markdownShortcuts: true })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'insertUnorderedList')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('dispatches insertOrderedList for "1. "', () => {
    el.innerHTML = '<p>1. </p>'
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', { markdownShortcuts: true })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'insertOrderedList')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('does nothing when shortcuts are disabled', () => {
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor')
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'formatBlock')).toBe(false)
      expect(el.querySelector('p')).not.toBeNull()
    }
    finally {
      spy.restore()
    }
  })

  it('respects custom block patterns', () => {
    el.innerHTML = '<p>!! </p>'
    const spy = spyExec()
    try {
      helpers.newMediumEditor('.editor', {
        markdownShortcuts: {
          blocks: [{ pattern: /^!!\s$/, block: 'h2' }],
          lists: false,
          inline: false,
        },
      })
      const p = el.querySelector('p')!
      placeCaretAtEnd(p.firstChild as Text)
      fireKeyup(el, ' ')
      expect(spy.calls.some(c => c.command === 'formatBlock' && c.value === 'h2')).toBe(true)
    }
    finally {
      spy.restore()
    }
  })

  it('converts a previous "---" line into an hr on Enter', () => {
    el.innerHTML = '<p>---</p><p><br></p>'
    helpers.newMediumEditor('.editor', { markdownShortcuts: true })
    const empty = el.querySelectorAll('p')[1] as HTMLElement
    const range = document.createRange()
    range.setStart(empty, 0)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    fireKeyup(el, 'Enter')
    expect(el.querySelector('hr')).not.toBeNull()
  })
})
