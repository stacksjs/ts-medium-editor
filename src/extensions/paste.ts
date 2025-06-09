import type { MediumEditor, MediumEditorExtension, PasteOptions } from '../types'

interface ClipboardData {
  'text/plain'?: string
  'text/html'?: string
}

export class Paste implements MediumEditorExtension {
  name = 'paste'

  // Paste Options
  forcePlainText = true
  cleanPastedHTML = false
  preCleanReplacements: Array<[RegExp, string]> = []
  cleanReplacements: Array<[RegExp, string]> = []
  cleanAttrs: string[] = ['class', 'style', 'dir']
  cleanTags: string[] = ['meta']
  unwrapTags: string[] = []

  private editor: MediumEditor

  constructor(editor: MediumEditor, options: PasteOptions = {}) {
    this.editor = editor
    this.forcePlainText = options.forcePlainText ?? this.forcePlainText
    this.cleanPastedHTML = options.cleanPastedHTML ?? this.cleanPastedHTML
    this.preCleanReplacements = options.preCleanReplacements || this.preCleanReplacements
    this.cleanReplacements = options.cleanReplacements || this.cleanReplacements
    this.cleanAttrs = options.cleanAttrs || this.cleanAttrs
    this.cleanTags = options.cleanTags || this.cleanTags
    this.unwrapTags = options.unwrapTags || this.unwrapTags
  }

  init(): void {
    if (this.forcePlainText || this.cleanPastedHTML) {
      this.editor.subscribe('editableKeydown', this.handleKeydown.bind(this))

      // Attach paste event listeners to all editor elements
      if (this.editor.elements) {
        this.editor.elements.forEach((element: HTMLElement) => {
          element.addEventListener('paste', this.handlePaste.bind(this))
        })
      }

      this.editor.subscribe('addElement', this.handleAddElement.bind(this))
    }
  }

  destroy(): void {
    // Remove event listeners
    if (this.editor.elements) {
      this.editor.elements.forEach((element: HTMLElement) => {
        element.removeEventListener('paste', this.handlePaste.bind(this))
      })
    }
  }

  private handleAddElement(_event: any, editable?: HTMLElement): void {
    if (editable) {
      editable.addEventListener('paste', this.handlePaste.bind(this))
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    // Handle Ctrl+V paste
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      // Let the paste event handle this

    }
  }

  private handlePaste(event: ClipboardEvent): void {
    if (event.defaultPrevented) {
      return
    }

    const clipboardContent = this.getClipboardContent(event)
    const pastedHTML = clipboardContent['text/html']
    const pastedPlain = clipboardContent['text/plain']

    if (pastedHTML || pastedPlain) {
      event.preventDefault()
      this.doPaste(pastedHTML, pastedPlain, event.target as HTMLElement)
    }
  }

  private getClipboardContent(event: ClipboardEvent): ClipboardData {
    const dataTransfer = event.clipboardData
    const data: ClipboardData = {}

    if (!dataTransfer) {
      return data
    }

    // Get plain text
    const plainText = dataTransfer.getData('text/plain')
    if (plainText && plainText.length > 0) {
      data['text/plain'] = plainText
    }

    // Get HTML
    const htmlText = dataTransfer.getData('text/html')
    if (htmlText && htmlText.length > 0) {
      data['text/html'] = htmlText
    }

    return data
  }

  private doPaste(pastedHTML?: string, pastedPlain?: string, editable?: HTMLElement): void {
    let content: string

    if (this.forcePlainText || !pastedHTML) {
      content = pastedPlain || ''
      // Convert plain text to HTML by escaping and adding line breaks
      content = this.htmlEntities(content)
      content = content.replace(/\n/g, '<br>')
    }
    else {
      content = pastedHTML

      if (this.cleanPastedHTML) {
        content = this.cleanPaste(content)
      }
    }

    if (content && editable) {
      this.pasteHTML(content, editable)
    }
  }

  private cleanPaste(text: string): string {
    let cleaned = text

    // Apply pre-clean replacements
    this.preCleanReplacements.forEach(([regex, replacement]) => {
      cleaned = cleaned.replace(regex, replacement)
    })

    // Apply built-in clean replacements
    const builtInReplacements = this.createReplacements()
    builtInReplacements.forEach(([regex, replacement]) => {
      cleaned = cleaned.replace(regex, replacement)
    })

    // Apply custom clean replacements
    this.cleanReplacements.forEach(([regex, replacement]) => {
      cleaned = cleaned.replace(regex, replacement)
    })

    // Clean attributes and tags
    if (this.cleanAttrs.length > 0 || this.cleanTags.length > 0 || this.unwrapTags.length > 0) {
      cleaned = this.cleanHTML(cleaned)
    }

    return cleaned
  }

  private createReplacements(): Array<[RegExp, string]> {
    return [
      // Remove anything but the contents within the BODY element
      [/^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/g, ''],

      // cleanup comments added by Chrome when pasting html
      [/<!--StartFragment-->|<!--EndFragment-->/g, ''],

      // Trailing BR elements
      [/<br>$/i, ''],

      // replace two bogus tags that begin pastes from google docs
      [/<[^>]*docs-internal-guid[^>]*>/gi, ''],
      [/<\/b>(<br[^>]*>)?$/gi, ''],

      // un-html spaces and newlines inserted by OS X
      [/<span class="Apple-converted-space">\s+<\/span>/g, ' '],
      [/<br class="Apple-interchange-newline">/g, '<br>'],

      // replace google docs italics+bold with a span to be replaced once the html is inserted
      [/<span[^>]*(font-style:italic;font-weight:(bold|700)|font-weight:(bold|700);font-style:italic)[^>]*>/gi, '<span class="replace-with italic bold">'],

      // replace google docs italics with a span to be replaced once the html is inserted
      [/<span[^>]*font-style:italic[^>]*>/gi, '<span class="replace-with italic">'],

      // replace google docs bolds with a span to be replaced once the html is inserted
      [/<span[^>]*font-weight:(bold|700)[^>]*>/gi, '<span class="replace-with bold">'],

      // replace manually entered b/i/a tags with real ones
      [/&lt;(\/?)([iba])&gt;/gi, '<$1$2>'],

      // Newlines between paragraphs in html have no syntactic value
      [/<\/p>\n+/gi, '</p>'],
      [/\n+<p/gi, '<p'],

      // Microsoft Word makes these odd tags, like <o:p></o:p>
      [/<\/?o:[a-z]*>/gi, ''],

      // Microsoft Word adds some special elements around list items
      [/<!\[if !supportLists\]>(((?!<!).)*)<!\[endif\]>/gi, '$1'],
    ]
  }

  private cleanHTML(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html

    // Remove unwanted tags
    this.cleanTags.forEach((tagName) => {
      const elements = div.querySelectorAll(tagName)
      elements.forEach(el => el.remove())
    })

    // Unwrap specified tags
    this.unwrapTags.forEach((tagName) => {
      const elements = div.querySelectorAll(tagName)
      elements.forEach(el => this.unwrap(el as HTMLElement))
    })

    // Clean attributes
    if (this.cleanAttrs.length > 0) {
      const allElements = div.querySelectorAll('*')
      allElements.forEach((el) => {
        this.cleanAttrs.forEach((attr) => {
          el.removeAttribute(attr)
        })
      })
    }

    return div.innerHTML
  }

  private unwrap(element: HTMLElement): void {
    const parent = element.parentNode
    if (!parent)
      return

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element)
    }
    parent.removeChild(element)
  }

  private htmlEntities(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  private pasteHTML(html: string, editable: HTMLElement): void {
    // Insert HTML at current cursor position
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // No selection, append to the end
      editable.innerHTML += html
      return
    }

    const range = selection.getRangeAt(0)
    range.deleteContents()

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    // Insert each child node
    const fragment = document.createDocumentFragment()
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }

    range.insertNode(fragment)

    // Move cursor to end of inserted content
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)

    // Trigger input event
    if (this.editor.trigger) {
      this.editor.trigger('editableInput', {}, editable)
    }
  }
}
