# Extensions

TypeScript Medium Editor features a powerful extension system that allows you to add custom functionality, create new toolbar buttons, and extend the editor's capabilities. This guide covers everything you need to know about creating and using extensions.

## Built-in Extensions

### Toolbar Extension

The toolbar extension provides the floating toolbar functionality:

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
    static: false,
    sticky: false,
    updateOnEmptySelection: false
  }
})
```

**Features:**
- Contextual toolbar that appears on text selection
- Customizable button set
- Static toolbar option
- Positioning and styling options

### Placeholder Extension

The placeholder extension shows placeholder text when the editor is empty:

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Tell your story...',
    hideOnClick: true,
    hideOnFocus: false
  }
})
```

**Features:**
- Customizable placeholder text
- Hide on click or focus options
- Automatic show/hide based on content

## Creating Custom Extensions

### Extension Interface

All extensions implement the `MediumEditorExtension` interface:

```typescript
import { MediumEditor, MediumEditorExtension } from 'ts-medium-editor'

class CustomExtension implements MediumEditorExtension {
  name = 'customExtension'
  options: any

  constructor(options: any = {}) {
    this.options = { ...this.getDefaults(), ...options }
  }

  getDefaults() {
    return {
      // Default options
    }
  }

  init() {
    // Initialize extension
    this.setupEventListeners()
  }

  destroy() {
    // Cleanup when extension is destroyed
    this.removeEventListeners()
  }

  private setupEventListeners() {
    // Set up event listeners
  }

  private removeEventListeners() {
    // Remove event listeners
  }
}
```

**Note**: Extensions implement the `MediumEditorExtension` interface, not extend a base class. The interface provides the contract for extension methods.

### Extension Lifecycle

Extensions have a defined lifecycle:

1. **Constructor**: Initialize options and state
2. **init()**: Called when editor is initialized
3. **destroy()**: Called when editor is destroyed

### Accessing the Editor

Extensions need to receive the editor instance during initialization:

```typescript
class MyExtension implements MediumEditorExtension {
  name = 'myExtension'
  private editor: MediumEditor

  constructor(editor: MediumEditor, options: any = {}) {
    this.editor = editor
  }

  init() {
    // Access editor elements
    const elements = this.editor.elements

    // Access editor options
    const options = this.editor.options

    // Subscribe to events
    this.editor.subscribe('editableInput', this.handleInput.bind(this))

    // Get other extensions
    const toolbar = this.editor.getExtensionByName('toolbar')
  }

  handleInput(event: Event, editable: HTMLElement) {
    console.log('Content changed:', editable.innerHTML)
  }
}
```

**Note**: Unlike some documentation examples, extensions don't automatically have access to `this.base`. The editor instance must be passed to the extension during construction.

## Example Extensions

### Word Counter Extension

Create an extension that counts words and characters:

```typescript
class WordCounter extends Extension {
  name = 'wordCounter'
  private counterElement: HTMLElement | null = null

  getDefaults() {
    return {
      displayWords: true,
      displayCharacters: true,
      target: null // Element to display counter in
    }
  }

  init() {
    this.createCounterElement()
    this.base.subscribe('editableInput', this.updateCount.bind(this))
    this.updateCount()
  }

  destroy() {
    if (this.counterElement) {
      this.counterElement.remove()
    }
  }

  private createCounterElement() {
    this.counterElement = document.createElement('div')
    this.counterElement.className = 'medium-editor-word-counter'
    this.counterElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    `

    const target = this.options.target || document.body
    target.appendChild(this.counterElement)
  }

  private updateCount() {
    if (!this.counterElement)
      return

    const content = this.base.getContent()
    const text = this.stripHtml(content)

    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length

    const display = []
    if (this.options.displayWords) {
      display.push(`${words} words`)
    }
    if (this.options.displayCharacters) {
      display.push(`${characters} chars`)
    }

    this.counterElement.textContent = display.join(' • ')
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    wordCounter: new WordCounter({
      displayWords: true,
      displayCharacters: true
    })
  }
})
```

### Auto-Save Extension

Create an extension that automatically saves content:

```typescript
class AutoSave extends Extension {
  name = 'autoSave'
  private saveTimeout: number | null = null
  private isDirty = false

  getDefaults() {
    return {
      delay: 2000, // 2 seconds
      saveCallback: null,
      indicator: true
    }
  }

  init() {
    this.base.subscribe('editableInput', this.handleInput.bind(this))
    this.base.subscribe('blur', this.handleBlur.bind(this))

    if (this.options.indicator) {
      this.createSaveIndicator()
    }
  }

  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
  }

  private handleInput() {
    this.isDirty = true
    this.scheduleAutoSave()
  }

  private handleBlur() {
    if (this.isDirty) {
      this.saveNow()
    }
  }

  private scheduleAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }

    this.saveTimeout = window.setTimeout(() => {
      this.saveNow()
    }, this.options.delay)
  }

  private async saveNow() {
    if (!this.isDirty || !this.options.saveCallback)
      return

    try {
      this.showSaveStatus('saving')
      const content = this.base.getContent()
      await this.options.saveCallback(content)
      this.isDirty = false
      this.showSaveStatus('saved')
    }
    catch (error) {
      this.showSaveStatus('error')
      console.error('Auto-save failed:', error)
    }
  }

  private createSaveIndicator() {
    // Create save status indicator
  }

  private showSaveStatus(status: 'saving' | 'saved' | 'error') {
    // Update save status indicator
    console.log('Save status:', status)
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    autoSave: new AutoSave({
      delay: 3000,
      saveCallback: async (content) => {
        await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
      }
    })
  }
})
```

### Custom Toolbar Button Extension

Create custom toolbar buttons:

```typescript
class CustomButtons extends Extension {
  name = 'customButtons'

  init() {
    this.addStrikethroughButton()
    this.addCodeButton()
    this.addHighlightButton()
  }

  private addStrikethroughButton() {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    toolbar.addButton({
      name: 'strikethrough',
      aria: 'Strikethrough',
      tagNames: ['s', 'strike'],
      contentDefault: '<b>S</b>',
      action: (event: Event) => {
        this.base.execAction('strikethrough')
      }
    })
  }

  private addCodeButton() {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    toolbar.addButton({
      name: 'code',
      aria: 'Code',
      tagNames: ['code'],
      contentDefault: '<b>&lt;/&gt;</b>',
      action: (event: Event) => {
        this.wrapSelection('code')
      }
    })
  }

  private addHighlightButton() {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    toolbar.addButton({
      name: 'highlight',
      aria: 'Highlight',
      tagNames: ['mark'],
      contentDefault: '<b>H</b>',
      action: (event: Event) => {
        this.wrapSelection('mark')
      }
    })
  }

  private wrapSelection(tagName: string) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    if (selectedText) {
      const wrapper = document.createElement(tagName)
      wrapper.textContent = selectedText
      range.deleteContents()
      range.insertNode(wrapper)

      // Clear selection
      selection.removeAllRanges()
    }
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'highlight']
  },
  extensions: {
    customButtons: new CustomButtons()
  }
})
```

### Markdown Support Extension

Add markdown shortcuts:

```typescript
class MarkdownShortcuts extends Extension {
  name = 'markdownShortcuts'

  init() {
    this.base.subscribe('editableKeyup', this.handleKeyup.bind(this))
  }

  private handleKeyup(event: KeyboardEvent, editable: HTMLElement) {
    if (event.key === ' ') {
      this.checkForMarkdownSyntax(editable)
    }
  }

  private checkForMarkdownSyntax(editable: HTMLElement) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer

    if (textNode.nodeType !== Node.TEXT_NODE)
      return

    const text = textNode.textContent || ''
    const cursorPos = range.startOffset

    // Check for heading syntax
    const headingMatch = text.match(/^(#{1,3})\s/)
    if (headingMatch && cursorPos > headingMatch[0].length) {
      const level = headingMatch[1].length
      this.convertToHeading(textNode, level, headingMatch[0].length)
      return
    }

    // Check for bold syntax
    const boldMatch = text.match(/\*\*(.*?)\*\*\s$/)
    if (boldMatch) {
      this.convertToBold(textNode, boldMatch)
      return
    }

    // Check for italic syntax
    const italicMatch = text.match(/\*(.*?)\*\s$/)
    if (italicMatch) {
      this.convertToItalic(textNode, italicMatch)
    }
  }

  private convertToHeading(textNode: Node, level: number, prefixLength: number) {
    const parent = textNode.parentElement
    if (!parent)
      return

    const text = (textNode.textContent || '').substring(prefixLength)
    const heading = document.createElement(`h${level}`)
    heading.textContent = text.trim()

    parent.replaceChild(heading, textNode)

    // Position cursor at end of heading
    const range = document.createRange()
    range.selectNodeContents(heading)
    range.collapse(false)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  private convertToBold(textNode: Node, match: RegExpMatchArray) {
    this.wrapWithTag(textNode, match, 'strong')
  }

  private convertToItalic(textNode: Node, match: RegExpMatchArray) {
    this.wrapWithTag(textNode, match, 'em')
  }

  private wrapWithTag(textNode: Node, match: RegExpMatchArray, tagName: string) {
    const parent = textNode.parentElement
    if (!parent)
      return

    const fullText = textNode.textContent || ''
    const beforeText = fullText.substring(0, fullText.indexOf(match[0]))
    const afterText = fullText.substring(fullText.indexOf(match[0]) + match[0].length)

    // Create new elements
    const beforeNode = document.createTextNode(beforeText)
    const formattedNode = document.createElement(tagName)
    formattedNode.textContent = match[1]
    const afterNode = document.createTextNode(afterText)

    // Replace original text node
    parent.insertBefore(beforeNode, textNode)
    parent.insertBefore(formattedNode, textNode)
    parent.insertBefore(afterNode, textNode)
    parent.removeChild(textNode)

    // Position cursor after formatted text
    const range = document.createRange()
    range.setStartAfter(formattedNode)
    range.collapse(true)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    markdownShortcuts: new MarkdownShortcuts()
  }
})
```

## Extension Communication

### Inter-Extension Communication

Extensions can communicate with each other through the editor instance:

```typescript
class ExtensionA extends Extension {
  name = 'extensionA'

  init() {
    // Trigger custom event
    this.base.trigger('extensionA:ready', { data: 'hello' })
  }

  public doSomething() {
    return 'Extension A did something'
  }
}

class ExtensionB extends Extension {
  name = 'extensionB'

  init() {
    // Listen for custom event
    this.base.subscribe('extensionA:ready', this.handleExtensionAReady.bind(this))
  }

  private handleExtensionAReady(event: Event, data: any) {
    console.log('Extension A is ready:', data)

    // Access other extension
    const extensionA = this.base.getExtensionByName('extensionA')
    if (extensionA) {
      const result = extensionA.doSomething()
      console.log(result)
    }
  }
}
```

### Shared State

Extensions can share state through the editor instance:

```typescript
class StateManager extends Extension {
  name = 'stateManager'
  private sharedState: Map<string, any> = new Map()

  init() {
    // Make state manager available globally
    this.base.stateManager = this
  }

  setState(key: string, value: any) {
    this.sharedState.set(key, value)
    this.base.trigger('stateChanged', { key, value })
  }

  getState(key: string) {
    return this.sharedState.get(key)
  }
}

class ConsumerExtension extends Extension {
  name = 'consumer'

  init() {
    this.base.subscribe('stateChanged', this.handleStateChange.bind(this))
  }

  private handleStateChange(event: Event, data: { key: string, value: any }) {
    console.log(`State changed: ${data.key} = ${data.value}`)
  }

  private updateState() {
    const stateManager = this.base.stateManager
    if (stateManager) {
      stateManager.setState('myKey', 'myValue')
    }
  }
}
```

## Extension Best Practices

### Performance Considerations

1. **Debounce expensive operations**:
```typescript
class PerformantExtension extends Extension {
  private debounceTimeout: number | null = null

  private handleInput() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    this.debounceTimeout = window.setTimeout(() => {
      this.expensiveOperation()
    }, 300)
  }

  private expensiveOperation() {
    // Expensive DOM manipulation or API calls
  }
}
```

2. **Clean up resources**:
```typescript
class CleanExtension extends Extension {
  private eventListeners: Array<() => void> = []

  init() {
    const handler = this.handleEvent.bind(this)
    document.addEventListener('click', handler)

    this.eventListeners.push(() => {
      document.removeEventListener('click', handler)
    })
  }

  destroy() {
    this.eventListeners.forEach(cleanup => cleanup())
    this.eventListeners = []
  }
}
```

### Error Handling

Always handle errors gracefully in extensions:

```typescript
class RobustExtension extends Extension {
  init() {
    try {
      this.setupFeature()
    }
    catch (error) {
      console.error('Extension initialization failed:', error)
      // Graceful degradation
    }
  }

  private setupFeature() {
    // Feature setup that might fail
  }
}
```

### TypeScript Support

Use proper TypeScript types for better development experience:

```typescript
interface MyExtensionOptions {
  enabled: boolean
  timeout: number
  callback?: (data: any) => void
}

class TypedExtension extends Extension {
  name = 'typedExtension'
  declare options: MyExtensionOptions

  getDefaults(): MyExtensionOptions {
    return {
      enabled: true,
      timeout: 1000
    }
  }

  init() {
    if (this.options.enabled) {
      this.setupFeature()
    }
  }

  private setupFeature() {
    setTimeout(() => {
      this.options.callback?.({ status: 'ready' })
    }, this.options.timeout)
  }
}
```

## Publishing Extensions

### NPM Package Structure

When publishing extensions as NPM packages:

```
my-medium-editor-extension/
├── src/
│   └── index.ts
├── dist/
│   ├── index.js
│   └── index.d.ts
├── package.json
├── README.md
└── tsconfig.json
```

### Package.json Example

```json
{
  "name": "medium-editor-my-extension",
  "version": "1.0.0",
  "description": "Custom extension for TypeScript Medium Editor",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "ts-medium-editor": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^4.5.0",
    "ts-medium-editor": "^1.0.0"
  }
}
```

## Next Steps

- Check out [Custom Extensions](/advanced/custom-extensions) for complex scenarios
- See [API Reference](/api) for complete method documentation
- Review [Usage Guide](/usage) for all available options
- Explore [Multiple Editors](/advanced/multiple-editors) for practical implementations
