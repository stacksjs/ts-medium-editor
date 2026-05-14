import type { MediumEditor, MediumEditorExtension, SlashCommand, SlashCommandsOptions } from '../types'
import { selection } from '../selection'
import { util } from '../util'

const DEFAULT_MAX_RESULTS = 8

function defaultCommands(): SlashCommand[] {
  return [
    {
      id: 'h1',
      label: 'Heading 1',
      description: 'Large section heading',
      keywords: ['title'],
      action: (_e, el) => formatBlock(el, 'h1'),
    },
    {
      id: 'h2',
      label: 'Heading 2',
      description: 'Medium section heading',
      keywords: ['subtitle'],
      action: (_e, el) => formatBlock(el, 'h2'),
    },
    {
      id: 'h3',
      label: 'Heading 3',
      description: 'Small section heading',
      action: (_e, el) => formatBlock(el, 'h3'),
    },
    {
      id: 'paragraph',
      label: 'Paragraph',
      description: 'Plain body text',
      keywords: ['text', 'body'],
      action: (_e, el) => formatBlock(el, 'p'),
    },
    {
      id: 'ul',
      label: 'Bulleted list',
      description: 'A simple bulleted list',
      keywords: ['unordered', 'list'],
      action: (_e, el) => execCommand(el, 'insertUnorderedList'),
    },
    {
      id: 'ol',
      label: 'Numbered list',
      description: 'A list with numbering',
      keywords: ['ordered', 'list'],
      action: (_e, el) => execCommand(el, 'insertOrderedList'),
    },
    {
      id: 'quote',
      label: 'Quote',
      description: 'Set apart a passage',
      keywords: ['blockquote'],
      action: (_e, el) => formatBlock(el, 'blockquote'),
    },
    {
      id: 'task-list',
      label: 'Task list',
      description: 'Track to-dos with checkboxes',
      keywords: ['todo', 'checklist', 'check'],
      action: (editor, el) => {
        const ext = editor.getExtensionByName('taskList') as { insert?: (el: HTMLElement) => void } | undefined
        if (ext?.insert)
          ext.insert(el)
      },
    },
    {
      id: 'table',
      label: 'Table',
      description: 'Insert a table',
      keywords: ['grid'],
      action: (editor, el) => {
        const ext = editor.getExtensionByName('tables') as { insert?: (el: HTMLElement) => void } | undefined
        if (ext?.insert)
          ext.insert(el)
      },
    },
    {
      id: 'code',
      label: 'Code block',
      description: 'A monospaced block for code',
      keywords: ['pre', 'snippet'],
      action: (_e, el) => formatBlock(el, 'pre'),
    },
    {
      id: 'divider',
      label: 'Divider',
      description: 'A horizontal rule',
      keywords: ['hr', 'rule', 'separator'],
      action: (_e, el) => insertDivider(el),
    },
  ]
}

function formatBlock(editable: HTMLElement, tag: string): void {
  util.execFormatBlock(editable.ownerDocument, tag)
}

function execCommand(editable: HTMLElement, command: string): void {
  editable.ownerDocument.execCommand(command, false)
}

function insertDivider(editable: HTMLElement): void {
  const doc = editable.ownerDocument
  const block = util.getClosestBlockContainer(
    selection.getSelectionStart(doc) || editable,
  )
  if (!block) {
    util.insertHTMLCommand(doc, '<hr>')
    return
  }
  const hr = doc.createElement('hr')
  block.replaceWith(hr)
  // Insert a fresh empty paragraph after the divider so the caret has
  // somewhere to land.
  const next = doc.createElement('p')
  next.appendChild(doc.createElement('br'))
  hr.after(next)
  selection.moveCursor(doc, next, 0)
}

export class SlashCommands implements MediumEditorExtension {
  name = 'slashCommands'

  private editor: MediumEditor
  private commands: SlashCommand[]
  private maxResults: number
  private menuClass: string

  private menu: HTMLElement | null = null
  private menuId = ''
  private query = ''
  private filtered: SlashCommand[] = []
  private highlightIndex = 0
  private activeEditable: HTMLElement | null = null
  /** Saved on open so the inserted `/` can be removed before running an action. */
  private slashOffset = -1
  private slashNode: Text | null = null
  private boundDocClick: ((event: MouseEvent) => void) | null = null
  private boundReposition: (() => void) | null = null

  constructor(editor: MediumEditor, options: SlashCommandsOptions = {}) {
    this.editor = editor
    const base = options.commands ?? defaultCommands()
    this.commands = options.extraCommands ? [...base, ...options.extraCommands] : base
    this.maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS
    this.menuClass = options.menuClass ?? 'medium-editor-slash-menu'
  }

  init(): void {
    this.editor.subscribe('editableKeydown', this.onKeydown.bind(this))
    this.editor.subscribe('editableInput', this.handleInput.bind(this))
    this.editor.subscribe('blur', this.handleBlur.bind(this))
  }

  destroy(): void {
    this.closeMenu()
  }

  private onKeydown(event: KeyboardEvent, editable?: HTMLElement): void {
    if (this.menu) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.moveHighlight(1)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.moveHighlight(-1)
        return
      }
      if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault()
        this.moveHighlight(-1)
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        this.commit()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        this.closeMenu()
        return
      }
      // Backspacing past the slash collapses the menu.
      if (event.key === 'Backspace' && this.query === '') {
        this.closeMenu()
        // fall through — let the actual backspace happen
      }
      return
    }

    if (event.key !== '/' || !editable)
      return

    // Only open at the start of an empty block — that's the Notion semantic
    // and avoids the menu clobbering "type a slash mid-sentence".
    const block = this.getCurrentBlock(editable)
    if (!block)
      return
    if ((block.textContent || '').trim() !== '')
      return

    // We don't preventDefault — we let the `/` get typed, then open the menu
    // anchored to the caret on the next tick.
    queueMicrotask(() => this.openMenu(editable))
  }

  private handleInput(_event: Event, editable?: HTMLElement): void {
    if (!this.menu || editable !== this.activeEditable)
      return

    const node = this.slashNode
    if (!node || !node.isConnected) {
      this.closeMenu()
      return
    }

    const text = node.textContent || ''
    const after = text.slice(this.slashOffset + 1)

    // Bail out if the slash itself was deleted, or whitespace was typed
    // after — both are signals the user no longer wants the menu.
    if (text[this.slashOffset] !== '/' || /\s/.test(after)) {
      this.closeMenu()
      return
    }

    this.query = after
    this.refilter()
  }

  private handleBlur(): void {
    // Close on focus loss — but defer so a click on a menu row still fires.
    setTimeout(() => {
      if (this.menu && this.editor.options.ownerDocument!.activeElement !== this.menu)
        this.closeMenu()
    }, 100)
  }

  private openMenu(editable: HTMLElement): void {
    const doc = this.editor.options.ownerDocument!
    const node = selection.getSelectionStart(doc)
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      // The `/` typed into an empty block lives in a text node by now; if it
      // doesn't, we can't anchor — bail.
      return
    }

    this.activeEditable = editable
    this.slashNode = node as Text
    // Caret sits right after the slash — the slash is the previous char.
    const sel = doc.getSelection()
    const offset = sel?.rangeCount ? sel.getRangeAt(0).startOffset - 1 : -1
    if (offset < 0 || (node.textContent || '')[offset] !== '/') {
      this.activeEditable = null
      this.slashNode = null
      return
    }
    this.slashOffset = offset
    this.query = ''
    this.refilter()
    this.renderMenu()
    this.positionMenu()

    this.boundDocClick = (event: MouseEvent) => {
      if (this.menu && !this.menu.contains(event.target as Node))
        this.closeMenu()
    }
    doc.addEventListener('mousedown', this.boundDocClick, true)

    this.boundReposition = () => this.positionMenu()
    window.addEventListener('scroll', this.boundReposition, true)
    window.addEventListener('resize', this.boundReposition)

    // Wire the editable's accessible-state to the open menu so screen readers
    // announce the highlighted row.
    editable.setAttribute('aria-controls', this.menuId)
    editable.setAttribute('aria-expanded', 'true')
    this.updateActiveDescendant()
  }

  private refilter(): void {
    const q = this.query.trim().toLowerCase()
    if (!q) {
      this.filtered = this.commands.slice(0, this.maxResults)
    }
    else {
      this.filtered = this.commands
        .filter((c) => {
          const haystack = [c.label, c.description, ...(c.keywords || [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
        .slice(0, this.maxResults)
    }
    this.highlightIndex = 0
    if (this.menu)
      this.paintMenu()
  }

  private renderMenu(): void {
    const doc = this.editor.options.ownerDocument!
    const menu = doc.createElement('div')
    this.menuId = `medium-editor-slash-menu-${util.guid()}`
    menu.id = this.menuId
    menu.className = this.menuClass
    menu.setAttribute('role', 'listbox')
    menu.setAttribute('aria-label', 'Insert block')
    menu.style.position = 'absolute'
    menu.style.zIndex = '10000'
    menu.style.minWidth = '220px'
    menu.style.background = '#fff'
    menu.style.border = '1px solid rgba(0, 0, 0, 0.1)'
    menu.style.borderRadius = '6px'
    menu.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.12)'
    menu.style.padding = '4px'
    menu.style.fontSize = '14px'
    menu.style.maxHeight = '320px'
    menu.style.overflowY = 'auto'
    doc.body.appendChild(menu)
    this.menu = menu
    this.paintMenu()
  }

  private paintMenu(): void {
    if (!this.menu)
      return
    const doc = this.editor.options.ownerDocument!
    this.menu.textContent = ''

    if (this.filtered.length === 0) {
      const empty = doc.createElement('div')
      empty.style.padding = '8px 10px'
      empty.style.color = 'rgba(0, 0, 0, 0.5)'
      empty.textContent = 'No matching blocks'
      this.menu.appendChild(empty)
      return
    }

    this.filtered.forEach((cmd, idx) => {
      const row = doc.createElement('div')
      row.id = `${this.menuId}-row-${idx}`
      row.setAttribute('role', 'option')
      row.dataset.id = cmd.id
      row.style.display = 'flex'
      row.style.alignItems = 'center'
      row.style.gap = '10px'
      row.style.padding = '6px 8px'
      row.style.borderRadius = '4px'
      row.style.cursor = 'pointer'
      if (idx === this.highlightIndex) {
        row.style.background = 'rgba(0, 0, 0, 0.06)'
        row.setAttribute('aria-selected', 'true')
      }
      else {
        row.setAttribute('aria-selected', 'false')
      }

      if (cmd.icon) {
        const icon = doc.createElement('span')
        icon.style.display = 'inline-flex'
        icon.style.width = '20px'
        icon.style.justifyContent = 'center'
        icon.innerHTML = cmd.icon
        row.appendChild(icon)
      }

      const text = doc.createElement('div')
      text.style.display = 'flex'
      text.style.flexDirection = 'column'
      text.style.lineHeight = '1.2'

      const label = doc.createElement('span')
      label.style.color = 'rgba(0, 0, 0, 0.85)'
      label.textContent = cmd.label
      text.appendChild(label)

      if (cmd.description) {
        const desc = doc.createElement('span')
        desc.style.color = 'rgba(0, 0, 0, 0.5)'
        desc.style.fontSize = '12px'
        desc.textContent = cmd.description
        text.appendChild(desc)
      }

      row.appendChild(text)

      // mousedown not click — click would fire after blur and the menu would
      // already be closed.
      row.addEventListener('mousedown', (event) => {
        event.preventDefault()
        this.highlightIndex = idx
        this.commit()
      })

      this.menu!.appendChild(row)
    })
  }

  private positionMenu(): void {
    if (!this.menu)
      return
    const doc = this.editor.options.ownerDocument!
    const sel = doc.getSelection()
    if (!sel || sel.rangeCount === 0)
      return
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true)
    const rect = range.getBoundingClientRect()
    // Fallback: if the caret rect is empty (some browsers in empty blocks),
    // anchor to the editable element.
    const anchor = (rect.width === 0 && rect.height === 0)
      ? (this.activeEditable?.getBoundingClientRect() || rect)
      : rect

    const top = anchor.bottom + window.scrollY + 4
    const left = anchor.left + window.scrollX
    this.menu.style.top = `${top}px`
    this.menu.style.left = `${left}px`
  }

  private moveHighlight(delta: number): void {
    if (this.filtered.length === 0)
      return
    const next = (this.highlightIndex + delta + this.filtered.length) % this.filtered.length
    this.highlightIndex = next
    this.paintMenu()
    this.scrollHighlightIntoView()
    this.updateActiveDescendant()
  }

  private scrollHighlightIntoView(): void {
    if (!this.menu)
      return
    const row = this.menu.children[this.highlightIndex] as HTMLElement | undefined
    if (!row)
      return
    const top = row.offsetTop
    const bottom = top + row.offsetHeight
    if (top < this.menu.scrollTop)
      this.menu.scrollTop = top
    else if (bottom > this.menu.scrollTop + this.menu.clientHeight)
      this.menu.scrollTop = bottom - this.menu.clientHeight
  }

  private updateActiveDescendant(): void {
    if (!this.activeEditable)
      return
    const row = this.menu?.children[this.highlightIndex] as HTMLElement | undefined
    if (row?.id)
      this.activeEditable.setAttribute('aria-activedescendant', row.id)
    else
      this.activeEditable.removeAttribute('aria-activedescendant')
  }

  private commit(): void {
    const cmd = this.filtered[this.highlightIndex]
    const editable = this.activeEditable
    if (!cmd || !editable) {
      this.closeMenu()
      return
    }

    this.removeSlashRun()
    this.closeMenu()
    cmd.action(this.editor, editable)
    this.editor.checkContentChanged(editable)
  }

  private removeSlashRun(): void {
    const node = this.slashNode
    if (!node || !node.isConnected)
      return
    const text = node.textContent || ''
    if (text[this.slashOffset] !== '/')
      return
    const before = text.slice(0, this.slashOffset)
    const after = text.slice(this.slashOffset + 1 + this.query.length)
    node.textContent = before + after
    selection.moveCursor(this.editor.options.ownerDocument!, node, before.length)
  }

  private closeMenu(): void {
    if (this.menu) {
      this.menu.remove()
      this.menu = null
    }
    if (this.boundDocClick) {
      this.editor.options.ownerDocument!.removeEventListener('mousedown', this.boundDocClick, true)
      this.boundDocClick = null
    }
    if (this.boundReposition) {
      window.removeEventListener('scroll', this.boundReposition, true)
      window.removeEventListener('resize', this.boundReposition)
      this.boundReposition = null
    }
    if (this.activeEditable) {
      this.activeEditable.removeAttribute('aria-controls')
      this.activeEditable.removeAttribute('aria-expanded')
      this.activeEditable.removeAttribute('aria-activedescendant')
    }
    this.menuId = ''
    this.query = ''
    this.filtered = []
    this.highlightIndex = 0
    this.activeEditable = null
    this.slashNode = null
    this.slashOffset = -1
  }

  private getCurrentBlock(editable: HTMLElement): HTMLElement | null {
    const node = selection.getSelectionStart(this.editor.options.ownerDocument!)
    if (!node)
      return null
    const block = util.getClosestBlockContainer(node)
    if (!block || !editable.contains(block))
      return null
    return block
  }
}
