# Extensions

ts-medium-editor uses an extension system that allows you to add custom functionality, buttons, and behaviors to the editor.

## Built-in Extensions

### Toolbar

The main formatting toolbar:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})
```

### Anchor

Link creation and editing:

```typescript
const editor = new MediumEditor('.editable', {
  anchor: {
    placeholderText: 'Paste or type a link',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab'
  }
})
```

### Anchor Preview

Link preview on hover:

```typescript
const editor = new MediumEditor('.editable', {
  anchorPreview: {
    hideDelay: 500,
    showWhenToolbarIsVisible: false
  }
})
```

### Placeholder

Placeholder text when editor is empty:

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Tell your story...',
    hideOnClick: true
  }
})
```

### Paste

Clean up pasted content:

```typescript
const editor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [
      [/\s*style\s*=\s*["'][^"']*["']/gi, ''],
      [/<o:p\s*\/?>|<\/o:p>/gi, ''],
    ],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta', 'style', 'script']
  }
})
```

### Keyboard Commands

Custom keyboard shortcuts:

```typescript
const editor = new MediumEditor('.editable', {
  keyboardCommands: {
    commands: [
      {
        command: 'bold',
        key: 'B',
        meta: true,
        shift: false
      },
      {
        command: 'italic',
        key: 'I',
        meta: true,
        shift: false
      }
    ]
  }
})
```

## Creating Custom Extensions

### Extension Interface

```typescript
interface MediumEditorExtension {
  name?: string                // Extension name
  init?: () => void            // Called during initialization
  destroy?: () => void         // Called during cleanup
  checkState?: (node: Node) => void  // Check active state
  isActive?: () => boolean     // Return active state
  isAlreadyApplied?: (node: Node) => boolean
  setActive?: () => void       // Set as active
  setInactive?: () => void     // Set as inactive
  queryCommandState?: () => boolean
  handleClick?: (event: Event) => void
  handleKeydown?: (event: KeyboardEvent) => void
  getInteractionElements?: () => HTMLElement | HTMLElement[]
}
```

### Basic Extension Example

```typescript
class CounterExtension implements MediumEditorExtension {
  name = 'counter'
  private editor: MediumEditor
  private counter: HTMLElement

  constructor(editor: MediumEditor) {
    this.editor = editor
  }

  init() {
    this.counter = document.createElement('div')
    this.counter.className = 'word-counter'
    document.body.appendChild(this.counter)

    this.editor.subscribe('editableInput', () => {
      this.updateCount()
    })

    this.updateCount()
  }

  private updateCount() {
    const content = this.editor.getContent() || ''
    const words = content.trim().split(/\s+/).filter(w => w.length > 0)
    this.counter.textContent = `${words.length} words`
  }

  destroy() {
    this.counter?.remove()
  }
}

// Use the extension
const editor = new MediumEditor('.editable', {
  extensions: {
    counter: new CounterExtension(editor)
  }
})
```

### Custom Button Extension

```typescript
class EmojiExtension implements MediumEditorExtension {
  name = 'emoji'
  private button: HTMLButtonElement
  private base: MediumEditor

  constructor(editor: MediumEditor) {
    this.base = editor
  }

  init() {
    this.button = this.createButton()
  }

  getButton(): HTMLButtonElement {
    return this.button
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button')
    button.className = 'medium-editor-action'
    button.innerHTML = '&#128512;'
    button.title = 'Insert Emoji'
    button.addEventListener('click', this.handleClick.bind(this))
    return button
  }

  private handleClick(): void {
    const emojis = ['&#128512;', '&#128513;', '&#128514;', '&#128515;']
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const span = document.createElement('span')
      span.innerHTML = emoji
      range.deleteContents()
      range.insertNode(span)
      range.collapse(false)
    }
  }

  destroy() {
    this.button?.removeEventListener('click', this.handleClick)
  }
}

// Register and use
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'emoji']
  },
  extensions: {
    emoji: new EmojiExtension(editor)
  }
})
```

### Code Highlighting Extension

```typescript
class CodeHighlightExtension implements MediumEditorExtension {
  name = 'code-highlight'
  private button: HTMLButtonElement
  private base: MediumEditor

  constructor(editor: MediumEditor) {
    this.base = editor
  }

  init() {
    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action'
    this.button.innerHTML = '<i class="fa fa-code"></i>'
    this.button.title = 'Code Block'
    this.button.addEventListener('click', () => this.insertCodeBlock())
  }

  getButton(): HTMLButtonElement {
    return this.button
  }

  private insertCodeBlock() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.textContent = selectedText || 'Enter code here'
    pre.appendChild(code)

    range.deleteContents()
    range.insertNode(pre)

    // Move cursor after the code block
    range.setStartAfter(pre)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  destroy() {
    // Cleanup
  }
}
```

## Accessing Built-in Extensions

```typescript
const editor = new MediumEditor('.editable')

// Get toolbar extension
const toolbar = editor.getExtensionByName('toolbar')

// Get anchor extension
const anchor = editor.getExtensionByName('anchor')

// Get placeholder extension
const placeholder = editor.getExtensionByName('placeholder')
```

## Adding Built-in Extensions Dynamically

```typescript
const editor = new MediumEditor('.editable')

// Add anchor extension
editor.addBuiltInExtension('anchor', {
  placeholderText: 'Enter URL',
  targetCheckbox: true
})

// Add paste extension
editor.addBuiltInExtension('paste', {
  cleanPastedHTML: true
})
```

## Extension Events

Extensions can listen to editor events:

```typescript
class AutoSaveExtension implements MediumEditorExtension {
  name = 'autosave'
  private editor: MediumEditor
  private timeout: Timer | null = null

  constructor(editor: MediumEditor) {
    this.editor = editor
  }

  init() {
    this.editor.subscribe('editableInput', () => {
      this.scheduleAutoSave()
    })
  }

  private scheduleAutoSave() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.save()
    }, 2000)
  }

  private save() {
    const content = this.editor.serialize()
    localStorage.setItem('editor-content', JSON.stringify(content))
    console.log('Auto-saved')
  }

  destroy() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}
```

## Table Extension Example

```typescript
class TableExtension implements MediumEditorExtension {
  name = 'table'
  private button: HTMLButtonElement
  private base: MediumEditor

  constructor(editor: MediumEditor) {
    this.base = editor
  }

  init() {
    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action'
    this.button.innerHTML = '<i class="fa fa-table"></i>'
    this.button.title = 'Insert Table'
    this.button.addEventListener('click', () => this.showDialog())
  }

  getButton(): HTMLButtonElement {
    return this.button
  }

  private showDialog() {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')

    if (rows && cols) {
      this.insertTable(parseInt(rows), parseInt(cols))
    }
  }

  private insertTable(rows: number, cols: number) {
    const table = document.createElement('table')
    table.className = 'editor-table'

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr')
      for (let j = 0; j < cols; j++) {
        const cell = i === 0
          ? document.createElement('th')
          : document.createElement('td')
        cell.textContent = i === 0 ? `Header ${j + 1}` : ''
        tr.appendChild(cell)
      }
      table.appendChild(tr)
    }

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(table)
    }
  }

  destroy() {
    // Cleanup
  }
}
```

## Extension Patterns

### State Management

```typescript
class StatefulExtension implements MediumEditorExtension {
  name = 'stateful'
  private isActivated = false

  isActive(): boolean {
    return this.isActivated
  }

  setActive() {
    this.isActivated = true
    this.button?.classList.add('active')
  }

  setInactive() {
    this.isActivated = false
    this.button?.classList.remove('active')
  }

  checkState(node: Node) {
    // Check if the current node matches the extension's state
    if (node.nodeName === 'MARK') {
      this.setActive()
    } else {
      this.setInactive()
    }
  }
}
```

### Interaction Elements

```typescript
class DropdownExtension implements MediumEditorExtension {
  private dropdown: HTMLElement

  getInteractionElements(): HTMLElement[] {
    // Return elements that should not close the toolbar when clicked
    return [this.dropdown]
  }
}
```
