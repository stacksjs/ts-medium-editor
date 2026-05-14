import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { setupTestHelpers } from './helpers/test-utils'

function placeCursor(node: Node, offset: number): void {
  const range = document.createRange()
  range.setStart(node, offset)
  range.collapse(true)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function fireKeydown(el: HTMLElement, key: string): KeyboardEvent {
  const evt = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  el.dispatchEvent(evt)
  return evt
}

function fireInput(el: HTMLElement): void {
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

function typeChar(textNode: Text, char: string, editable: HTMLElement): void {
  textNode.textContent = (textNode.textContent || '') + char
  placeCursor(textNode, textNode.textContent!.length)
  fireInput(editable)
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

describe('SlashCommands extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', '<p><br></p>')
  })

  afterEach(() => {
    helpers.cleanupTest()
    document.querySelectorAll('.medium-editor-slash-menu').forEach(n => n.remove())
  })

  it('opens the menu when "/" is typed in an empty block', async () => {
    helpers.newMediumEditor('.editor', { slashCommands: true })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    // Browser inserts the slash after the listener returns — mirror that
    // before the queued microtask runs.
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    expect(document.querySelector('.medium-editor-slash-menu')).not.toBeNull()
  })

  it('does not open in a non-empty block', async () => {
    el.innerHTML = '<p>hello/</p>'
    helpers.newMediumEditor('.editor', { slashCommands: true })
    const p = el.querySelector('p')!
    placeCursor(p.firstChild!, 6)
    fireKeydown(el, '/')
    await flushMicrotasks()
    expect(document.querySelector('.medium-editor-slash-menu')).toBeNull()
  })

  it('filters commands by typed query', async () => {
    helpers.newMediumEditor('.editor', { slashCommands: true })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    typeChar(t, 'h', el)
    typeChar(t, 'e', el)
    typeChar(t, 'a', el)
    typeChar(t, 'd', el)
    const rows = document.querySelectorAll('.medium-editor-slash-menu [role="option"]')
    expect(rows.length).toBeGreaterThan(0)
    rows.forEach((row) => {
      expect(row.textContent?.toLowerCase()).toContain('head')
    })
  })

  it('closes on Escape', async () => {
    helpers.newMediumEditor('.editor', { slashCommands: true })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    expect(document.querySelector('.medium-editor-slash-menu')).not.toBeNull()
    fireKeydown(el, 'Escape')
    expect(document.querySelector('.medium-editor-slash-menu')).toBeNull()
  })

  it('moves highlight on ArrowDown', async () => {
    helpers.newMediumEditor('.editor', { slashCommands: true })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    fireKeydown(el, 'ArrowDown')
    const rows = document.querySelectorAll('.medium-editor-slash-menu [role="option"]')
    expect(rows[1]?.getAttribute('aria-selected')).toBe('true')
  })

  it('accepts extra commands and includes them in the menu', async () => {
    let triggered = false
    helpers.newMediumEditor('.editor', {
      slashCommands: {
        extraCommands: [{
          id: 'mention',
          label: 'Mention',
          description: 'Insert a mention',
          action: () => { triggered = true },
        }],
      },
    })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    typeChar(t, 'm', el)
    typeChar(t, 'e', el)
    typeChar(t, 'n', el)
    const row = document.querySelector('.medium-editor-slash-menu [data-id="mention"]') as HTMLElement | null
    expect(row).not.toBeNull()
    fireKeydown(el, 'Enter')
    expect(triggered).toBe(true)
  })

  it('removes the slash run when a command is committed', async () => {
    helpers.newMediumEditor('.editor', {
      slashCommands: {
        commands: [{
          id: 'noop',
          label: 'Noop',
          action: () => {},
        }],
      },
    })
    const p = el.querySelector('p')!
    p.innerHTML = ''
    placeCursor(p, 0)
    fireKeydown(el, '/')
    const t = document.createTextNode('/')
    p.appendChild(t)
    placeCursor(t, 1)
    await flushMicrotasks()
    typeChar(t, 'n', el)
    fireKeydown(el, 'Enter')
    expect((p.textContent || '').includes('/')).toBe(false)
  })
})
