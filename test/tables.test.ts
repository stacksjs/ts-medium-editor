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

describe('Tables extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', '<p><br></p>')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  it('inserts a 3x3 table by default', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el)
    const table = el.querySelector('table.medium-editor-table')!
    expect(table.querySelectorAll('tr').length).toBe(3)
    expect(table.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(3)
  })

  it('inserts a row above and below', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el, 2, 2)
    const cell = el.querySelector('td')!
    ext.insertRow(cell, 'above')
    ext.insertRow(cell, 'below')
    expect(el.querySelectorAll('tr').length).toBe(4)
  })

  it('inserts a column left and right', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el, 2, 2)
    const cell = el.querySelector('td')!
    ext.insertColumn(cell, 'right')
    ext.insertColumn(cell, 'left')
    expect(el.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(4)
  })

  it('removes the table when the last row is deleted', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el, 1, 2)
    const cell = el.querySelector('td')!
    ext.deleteRow(cell)
    expect(el.querySelector('table')).toBeNull()
  })

  it('Tab moves to the next cell', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el, 2, 2)
    const cells = Array.from(el.querySelectorAll('td')) as HTMLTableCellElement[]
    placeCursor(cells[0], 0)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    const sel = window.getSelection()
    expect(sel?.anchorNode === cells[1] || cells[1].contains(sel?.anchorNode || null)).toBe(true)
  })

  it('Tab from the last cell appends a new row', () => {
    const editor = helpers.newMediumEditor('.editor', { tables: true })
    const ext = editor.getExtensionByName('tables') as any
    placeCursor(el.querySelector('p')!, 0)
    ext.insert(el, 2, 2)
    const cells = Array.from(el.querySelectorAll('td')) as HTMLTableCellElement[]
    const last = cells[cells.length - 1]
    placeCursor(last, 0)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(el.querySelectorAll('tr').length).toBe(3)
  })
})
