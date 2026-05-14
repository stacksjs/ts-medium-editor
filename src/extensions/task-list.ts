import type { MediumEditor, MediumEditorExtension, TaskListOptions } from '../types'
import { selection } from '../selection'
import { util } from '../util'

const LIST_CLASS = 'medium-editor-task-list'
const ITEM_CLASS = 'medium-editor-task-item'

export class TaskList implements MediumEditorExtension {
  name = 'taskList'

  private editor: MediumEditor
  private listClass: string
  private itemClass: string
  private boundClick: (event: Event) => void
  private boundKeydown: (event: KeyboardEvent) => void

  constructor(editor: MediumEditor, options: TaskListOptions = {}) {
    this.editor = editor
    this.listClass = options.listClass ?? LIST_CLASS
    this.itemClass = options.itemClass ?? ITEM_CLASS
    this.boundClick = (event: Event): void => this.onClick(event as MouseEvent)
    this.boundKeydown = (event: KeyboardEvent): void => this.onKeydown(event)
  }

  init(): void {
    this.editor.elements.forEach((el) => {
      el.addEventListener('click', this.boundClick)
      el.addEventListener('keydown', this.boundKeydown)
    })
  }

  destroy(): void {
    this.editor.elements.forEach((el) => {
      el.removeEventListener('click', this.boundClick)
      el.removeEventListener('keydown', this.boundKeydown)
    })
  }

  /**
   * Insert a fresh task list at the current selection. Replaces the current
   * empty block, mirroring how the existing slash-command block transforms
   * behave.
   */
  insert(editable: HTMLElement): void {
    const doc = this.editor.options.ownerDocument!
    const block = util.getClosestBlockContainer(
      selection.getSelectionStart(doc) || editable,
    )
    const list = this.makeList(doc)
    const item = this.makeItem(doc)
    list.appendChild(item)

    if (block && editable.contains(block) && (block.textContent || '').trim() === '') {
      block.replaceWith(list)
    }
    else {
      editable.appendChild(list)
    }

    const labelText = item.querySelector('.task-text')!
    selection.moveCursor(doc, labelText, 0)
    this.editor.checkContentChanged(editable)
  }

  private onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    if (!target)
      return
    const checkbox = target.closest(`.${this.itemClass} > input[type="checkbox"]`) as HTMLInputElement | null
    if (!checkbox)
      return
    const item = checkbox.parentElement
    if (!item)
      return
    // contenteditable lists swallow clicks before they hit the checkbox in
    // some browsers — explicitly toggle the data attribute and the input
    // checked state.
    const next = item.getAttribute('data-checked') !== 'true'
    item.setAttribute('data-checked', String(next))
    checkbox.checked = next
    const editable = util.getContainerEditorElement(item) as HTMLElement | null
    if (editable)
      this.editor.checkContentChanged(editable)
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter')
      return

    const node = selection.getSelectionStart(this.editor.options.ownerDocument!)
    if (!node)
      return
    const item = (node as HTMLElement).closest?.(`.${this.itemClass}`)
      || (node.parentElement?.closest(`.${this.itemClass}`))
    if (!item)
      return

    const text = (item as HTMLElement).querySelector('.task-text')?.textContent || ''
    if (text.trim() === '') {
      // Enter on an empty task item exits the list — same UX as native
      // contenteditable's behaviour for plain `<ul>`.
      event.preventDefault()
      this.exitList(item as HTMLElement)
      return
    }

    event.preventDefault()
    this.appendNewItem(item as HTMLElement)
  }

  private appendNewItem(after: HTMLElement): void {
    const doc = this.editor.options.ownerDocument!
    const item = this.makeItem(doc)
    after.after(item)
    const labelText = item.querySelector('.task-text')!
    selection.moveCursor(doc, labelText, 0)
    const editable = util.getContainerEditorElement(after) as HTMLElement | null
    if (editable)
      this.editor.checkContentChanged(editable)
  }

  private exitList(item: HTMLElement): void {
    const doc = this.editor.options.ownerDocument!
    const list = item.parentElement
    if (!list)
      return
    const p = doc.createElement('p')
    p.appendChild(doc.createElement('br'))
    list.after(p)
    item.remove()
    if (list.children.length === 0)
      list.remove()
    selection.moveCursor(doc, p, 0)
    const editable = util.getContainerEditorElement(p) as HTMLElement | null
    if (editable)
      this.editor.checkContentChanged(editable)
  }

  private makeList(doc: Document): HTMLUListElement {
    const list = doc.createElement('ul')
    list.className = this.listClass
    return list
  }

  private makeItem(doc: Document): HTMLLIElement {
    const item = doc.createElement('li')
    item.className = this.itemClass
    item.setAttribute('data-checked', 'false')

    const checkbox = doc.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.contentEditable = 'false'
    item.appendChild(checkbox)

    const text = doc.createElement('span')
    text.className = 'task-text'
    text.appendChild(doc.createElement('br'))
    item.appendChild(text)

    return item
  }
}
