import type { MediumEditor, MediumEditorExtension, TablesOptions } from '../types'
import { selection } from '../selection'
import { util } from '../util'

const TABLE_CLASS = 'medium-editor-table'

export class Tables implements MediumEditorExtension {
  name = 'tables'

  private editor: MediumEditor
  private tableClass: string
  private defaultRows: number
  private defaultCols: number
  private boundKeydown: (event: KeyboardEvent) => void

  constructor(editor: MediumEditor, options: TablesOptions = {}) {
    this.editor = editor
    this.tableClass = options.tableClass ?? TABLE_CLASS
    this.defaultRows = options.defaultRows ?? 3
    this.defaultCols = options.defaultCols ?? 3
    this.boundKeydown = (event: KeyboardEvent): void => this.onKeydown(event)
  }

  init(): void {
    this.editor.elements.forEach((el) => {
      el.addEventListener('keydown', this.boundKeydown)
    })
  }

  destroy(): void {
    this.editor.elements.forEach((el) => {
      el.removeEventListener('keydown', this.boundKeydown)
    })
  }

  /**
   * Insert a table at the caret. Replaces the current empty block when one
   * exists, otherwise appends to the editable.
   */
  insert(editable: HTMLElement, rows?: number, cols?: number): void {
    const r = rows ?? this.defaultRows
    const c = cols ?? this.defaultCols
    const doc = this.editor.options.ownerDocument!
    const table = this.makeTable(doc, r, c)
    const block = util.getClosestBlockContainer(
      selection.getSelectionStart(doc) || editable,
    )
    if (block && editable.contains(block) && (block.textContent || '').trim() === '')
      block.replaceWith(table)
    else
      editable.appendChild(table)

    const firstCell = table.querySelector('td')
    if (firstCell)
      selection.moveCursor(doc, firstCell, 0)
    this.editor.checkContentChanged(editable)
  }

  insertRow(cell: HTMLTableCellElement, where: 'above' | 'below'): void {
    const row = cell.closest('tr')
    const table = cell.closest('table')
    if (!row || !table)
      return
    const tbody = table.querySelector('tbody') ?? table
    const colCount = row.children.length
    const newRow = this.editor.options.ownerDocument!.createElement('tr')
    for (let i = 0; i < colCount; i++) {
      newRow.appendChild(this.makeCell(this.editor.options.ownerDocument!))
    }
    if (where === 'above')
      tbody.insertBefore(newRow, row)
    else
      row.after(newRow)
    this.notifyChange(table)
  }

  insertColumn(cell: HTMLTableCellElement, where: 'left' | 'right'): void {
    const table = cell.closest('table')
    const row = cell.closest('tr')
    if (!table || !row)
      return
    const cellIndex = Array.from(row.children).indexOf(cell)
    table.querySelectorAll('tr').forEach((tr) => {
      const ref = tr.children[cellIndex] as HTMLTableCellElement | undefined
      if (!ref)
        return
      const fresh = this.makeCell(this.editor.options.ownerDocument!)
      if (where === 'left')
        tr.insertBefore(fresh, ref)
      else
        ref.after(fresh)
    })
    this.notifyChange(table)
  }

  deleteRow(cell: HTMLTableCellElement): void {
    const row = cell.closest('tr')
    const table = cell.closest('table')
    if (!row || !table)
      return
    if (table.querySelectorAll('tr').length <= 1) {
      // Last row → delete the table.
      table.remove()
      this.notifyChange(table)
      return
    }
    row.remove()
    this.notifyChange(table)
  }

  deleteColumn(cell: HTMLTableCellElement): void {
    const table = cell.closest('table')
    const row = cell.closest('tr')
    if (!table || !row)
      return
    const cellIndex = Array.from(row.children).indexOf(cell)
    const rows = Array.from(table.querySelectorAll('tr'))
    if (!rows[0] || rows[0].children.length <= 1) {
      table.remove()
      this.notifyChange(table)
      return
    }
    rows.forEach((tr) => {
      tr.children[cellIndex]?.remove()
    })
    this.notifyChange(table)
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab')
      return

    const node = selection.getSelectionStart(this.editor.options.ownerDocument!)
    if (!node)
      return
    const cell = (node as HTMLElement).closest?.('td, th') as HTMLTableCellElement | null
      ?? node.parentElement?.closest('td, th') as HTMLTableCellElement | null
    if (!cell)
      return

    event.preventDefault()
    const next = event.shiftKey ? this.previousCell(cell) : this.nextCell(cell)
    if (next) {
      selection.moveCursor(this.editor.options.ownerDocument!, next, 0)
    }
    else if (!event.shiftKey) {
      // Tab from the last cell — append a fresh row and land in its first cell.
      this.insertRow(cell, 'below')
      const newRow = cell.closest('tr')!.nextElementSibling as HTMLElement | null
      const firstCell = newRow?.querySelector('td')
      if (firstCell)
        selection.moveCursor(this.editor.options.ownerDocument!, firstCell, 0)
    }
  }

  private nextCell(cell: HTMLTableCellElement): HTMLTableCellElement | null {
    const next = cell.nextElementSibling as HTMLTableCellElement | null
    if (next)
      return next
    const row = cell.closest('tr')
    const nextRow = row?.nextElementSibling as HTMLTableRowElement | null
    return (nextRow?.querySelector('td, th') as HTMLTableCellElement | null) ?? null
  }

  private previousCell(cell: HTMLTableCellElement): HTMLTableCellElement | null {
    const prev = cell.previousElementSibling as HTMLTableCellElement | null
    if (prev)
      return prev
    const row = cell.closest('tr')
    const prevRow = row?.previousElementSibling as HTMLTableRowElement | null
    if (!prevRow)
      return null
    const cells = prevRow.querySelectorAll('td, th')
    return (cells[cells.length - 1] as HTMLTableCellElement | undefined) ?? null
  }

  private makeTable(doc: Document, rows: number, cols: number): HTMLTableElement {
    const table = doc.createElement('table')
    table.className = this.tableClass
    const tbody = doc.createElement('tbody')
    for (let r = 0; r < rows; r++) {
      const tr = doc.createElement('tr')
      for (let c = 0; c < cols; c++) {
        tr.appendChild(this.makeCell(doc))
      }
      tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    return table
  }

  private makeCell(doc: Document): HTMLTableCellElement {
    const td = doc.createElement('td')
    td.appendChild(doc.createElement('br'))
    return td
  }

  private notifyChange(table: HTMLElement): void {
    const editable = util.getContainerEditorElement(table) as HTMLElement | null
    if (editable)
      this.editor.checkContentChanged(editable)
  }
}
