import type { BlockShortcut, InlineShortcut, ListShortcut, MarkdownShortcutsOptions, MediumEditor, MediumEditorExtension } from '../types'
import { selection } from '../selection'
import { util } from '../util'

const DEFAULT_BLOCKS: BlockShortcut[] = [
  { pattern: /^######\s$/, block: 'h6' },
  { pattern: /^#####\s$/, block: 'h5' },
  { pattern: /^####\s$/, block: 'h4' },
  { pattern: /^###\s$/, block: 'h3' },
  { pattern: /^##\s$/, block: 'h2' },
  { pattern: /^#\s$/, block: 'h1' },
  { pattern: /^>\s$/, block: 'blockquote' },
]

const DEFAULT_LISTS: ListShortcut[] = [
  { pattern: /^[-*]\s$/, list: 'ul' },
  { pattern: /^1\.\s$/, list: 'ol' },
]

const DEFAULT_INLINE: InlineShortcut[] = [
  { open: '**', close: '**', tag: 'b' },
  { open: '__', close: '__', tag: 'b' },
  { open: '*', close: '*', tag: 'i' },
  { open: '_', close: '_', tag: 'i' },
  { open: '~~', close: '~~', tag: 's' },
  { open: '`', close: '`', tag: 'code' },
]

export class MarkdownShortcuts implements MediumEditorExtension {
  name = 'markdownShortcuts'

  private editor: MediumEditor
  private blocks: BlockShortcut[]
  private lists: ListShortcut[]
  private inline: InlineShortcut[]
  private hrEnabled: boolean
  private codeBlockEnabled: boolean
  /**
   * True while the user is mid-IME-composition (Korean, Japanese, Chinese,
   * etc.). Markdown shortcuts must not trigger during composition — the
   * keyup events fire for partial syllables and would corrupt the buffer.
   */
  private composing = false
  private boundCompositionStart = (): void => { this.composing = true }
  private boundCompositionEnd = (): void => { this.composing = false }

  constructor(editor: MediumEditor, options: MarkdownShortcutsOptions = {}) {
    this.editor = editor
    this.blocks = options.blocks === false ? [] : (options.blocks || DEFAULT_BLOCKS)
    this.lists = options.lists === false ? [] : (options.lists || DEFAULT_LISTS)
    this.inline = options.inline === false ? [] : (options.inline || DEFAULT_INLINE)
    this.hrEnabled = options.hr !== false
    this.codeBlockEnabled = options.codeBlock !== false
  }

  init(): void {
    this.editor.subscribe('editableKeyup', this.handleKeyup.bind(this))
    this.editor.elements.forEach((el) => {
      el.addEventListener('compositionstart', this.boundCompositionStart)
      el.addEventListener('compositionend', this.boundCompositionEnd)
    })
  }

  destroy(): void {
    this.editor.elements.forEach((el) => {
      el.removeEventListener('compositionstart', this.boundCompositionStart)
      el.removeEventListener('compositionend', this.boundCompositionEnd)
    })
  }

  private handleKeyup(event: KeyboardEvent, editable?: HTMLElement): void {
    if (!editable || this.composing)
      return

    if (event.key === ' ') {
      this.tryBlockTransform(editable)
      this.tryInlineTransform(editable)
      return
    }

    if (event.key === 'Enter') {
      if (this.hrEnabled)
        this.tryHorizontalRule(editable)
      if (this.codeBlockEnabled)
        this.tryCodeBlock(editable)
    }
  }

  private tryCodeBlock(editable: HTMLElement): void {
    const block = this.getCurrentBlock(editable)
    if (!block)
      return
    // The "trigger" line is the previous block — Enter just split it from us.
    const prev = block.previousElementSibling as HTMLElement | null
    if (!prev)
      return
    const text = (prev.textContent || '').trim()
    if (text !== '```')
      return

    const doc = this.editor.options.ownerDocument!
    const pre = doc.createElement('pre')
    const code = doc.createElement('code')
    code.appendChild(doc.createElement('br'))
    pre.appendChild(code)
    prev.replaceWith(pre)
    // Move the caret into the (now empty) code block. The block we were in
    // before Enter is left alone — the user can keep typing there or delete it.
    selection.moveCursor(doc, code, 0)
    this.notifyChange(editable)
  }

  private tryBlockTransform(editable: HTMLElement): void {
    const block = this.getCurrentBlock(editable)
    if (!block)
      return

    const text = block.textContent || ''

    for (const rule of this.blocks) {
      if (rule.pattern.test(text)) {
        this.replaceBlockText(block, '')
        util.execFormatBlock(this.editor.options.ownerDocument!, rule.block)
        this.notifyChange(editable)
        return
      }
    }

    for (const rule of this.lists) {
      if (rule.pattern.test(text)) {
        this.replaceBlockText(block, '')
        const cmd = rule.list === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
        this.editor.options.ownerDocument!.execCommand(cmd, false)
        this.notifyChange(editable)
        return
      }
    }
  }

  private tryHorizontalRule(editable: HTMLElement): void {
    const block = this.getCurrentBlock(editable)
    if (!block)
      return

    const prev = block.previousElementSibling
    if (!prev)
      return

    const text = (prev.textContent || '').trim()
    if (text === '---' || text === '***' || text === '___') {
      prev.replaceWith(this.editor.options.ownerDocument!.createElement('hr'))
      this.notifyChange(editable)
    }
  }

  private tryInlineTransform(editable: HTMLElement): void {
    const node = selection.getSelectionStart(this.editor.options.ownerDocument!)
    if (!node || node.nodeType !== Node.TEXT_NODE)
      return

    const text = node.textContent || ''
    // Caret position within the text node — read from the live selection so
    // we only inspect the slice the user just typed into.
    const sel = this.editor.options.ownerDocument!.getSelection()
    if (!sel || sel.rangeCount === 0)
      return
    const range = sel.getRangeAt(0)
    if (range.startContainer !== node)
      return

    // The trailing space we just typed isn't part of the markdown — strip it
    // off when looking for a closing delimiter.
    const beforeSpace = text.slice(0, range.startOffset - 1)

    for (const rule of this.inline) {
      const closeIdx = beforeSpace.lastIndexOf(rule.close)
      if (closeIdx < 0)
        continue

      // Find an opener earlier in the same text node. The opener and closer
      // can't overlap, and there must be at least one character between them.
      const openIdx = beforeSpace.lastIndexOf(rule.open, closeIdx - 1)
      if (openIdx < 0 || openIdx + rule.open.length >= closeIdx)
        continue

      const inner = beforeSpace.slice(openIdx + rule.open.length, closeIdx)
      if (!inner)
        continue

      // Avoid catastrophic interactions with overlapping rules (e.g. `**`
      // matching as a single `*` italic + lone `*`). When the open/close are
      // a single char, require the surrounding chars not to be the same.
      if (rule.open.length === 1) {
        if (beforeSpace[openIdx - 1] === rule.open || beforeSpace[closeIdx + 1] === rule.close)
          continue
      }

      this.applyInline(node as Text, openIdx, closeIdx + rule.close.length, range.startOffset, inner, rule.tag)
      this.notifyChange(editable)
      return
    }
  }

  private applyInline(node: Text, start: number, end: number, caret: number, inner: string, tag: string): void {
    const doc = this.editor.options.ownerDocument!
    const before = node.textContent!.slice(0, start)
    const after = node.textContent!.slice(end, caret) + node.textContent!.slice(caret)

    const wrapper = doc.createElement(tag)
    wrapper.textContent = inner

    const parent = node.parentNode
    if (!parent)
      return

    const beforeText = doc.createTextNode(before)
    const afterText = doc.createTextNode(after)

    parent.insertBefore(beforeText, node)
    parent.insertBefore(wrapper, node)
    parent.insertBefore(afterText, node)
    parent.removeChild(node)

    // Place caret at the start of the trailing text node (right after the
    // wrapped content) so the user can keep typing without a stray formatted
    // run picking up new input.
    selection.moveCursor(doc, afterText, 0)
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

  private replaceBlockText(block: HTMLElement, text: string): void {
    block.textContent = text
    if (text === '') {
      // Empty contenteditable blocks need a placeholder break for the caret
      // to land somewhere useful before the formatBlock runs.
      block.appendChild(this.editor.options.ownerDocument!.createElement('br'))
    }
    selection.moveCursor(this.editor.options.ownerDocument!, block, 0)
  }

  private notifyChange(editable: HTMLElement): void {
    this.editor.checkContentChanged(editable)
  }
}
