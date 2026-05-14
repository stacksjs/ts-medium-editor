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

describe('TaskList extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', '<p><br></p>')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  it('inserts a task list with one empty item', () => {
    const editor = helpers.newMediumEditor('.editor', { taskList: true })
    const ext = editor.getExtensionByName('taskList') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el)
    const list = el.querySelector('ul.medium-editor-task-list')
    expect(list).not.toBeNull()
    expect(list!.querySelectorAll('li.medium-editor-task-item').length).toBe(1)
    expect(list!.querySelector('input[type="checkbox"]')).not.toBeNull()
  })

  it('toggles data-checked when the checkbox is clicked', () => {
    const editor = helpers.newMediumEditor('.editor', { taskList: true })
    const ext = editor.getExtensionByName('taskList') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el)
    const item = el.querySelector('li.medium-editor-task-item')!
    const checkbox = item.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(item.getAttribute('data-checked')).toBe('false')
    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(item.getAttribute('data-checked')).toBe('true')
    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(item.getAttribute('data-checked')).toBe('false')
  })

  it('appends a new item on Enter inside a non-empty item', () => {
    const editor = helpers.newMediumEditor('.editor', { taskList: true })
    const ext = editor.getExtensionByName('taskList') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el)
    const item = el.querySelector('li.medium-editor-task-item')!
    const text = item.querySelector('.task-text') as HTMLElement
    text.textContent = 'first'
    placeCursor(text.firstChild!, 5)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    expect(el.querySelectorAll('li.medium-editor-task-item').length).toBe(2)
  })

  it('exits the list on Enter inside an empty item', () => {
    const editor = helpers.newMediumEditor('.editor', { taskList: true })
    const ext = editor.getExtensionByName('taskList') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el)
    const item = el.querySelector('li.medium-editor-task-item')!
    const text = item.querySelector('.task-text') as HTMLElement
    placeCursor(text, 0)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    expect(el.querySelector('li.medium-editor-task-item')).toBeNull()
    expect(el.querySelectorAll('p').length).toBeGreaterThan(0)
  })
})
