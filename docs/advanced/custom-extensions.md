# Custom Extensions

Custom extensions are the most powerful way to extend TypeScript Medium Editor's functionality. They allow you to add new features, modify existing behavior, and integrate with external systems while maintaining clean separation of concerns.

## Overview

Extensions in TypeScript Medium Editor follow a standardized pattern that makes them easy to create, test, and maintain. Each extension has access to the editor's core functionality and can subscribe to events, modify the DOM, and provide new APIs.

## Extension Base Class

All extensions inherit from the base `Extension` class:

```typescript
import { Extension, MediumEditor } from 'ts-medium-editor'

class MyExtension extends Extension {
  name = 'myExtension' // Unique identifier

  // Called when extension is initialized
  init() {
    console.log('Extension initialized')
  }

  // Called when extension is destroyed
  destroy() {
    console.log('Extension destroyed')
  }
}
```

## Basic Extension Structure

### Minimal Extension

```typescript
class SimpleExtension extends Extension {
  name = 'simpleExtension'

  init() {
    // Subscribe to events
    this.base.subscribe('editableInput', this.handleInput.bind(this))
  }

  private handleInput(event: Event, editable: HTMLElement) {
    console.log('Content changed:', editable.innerHTML)
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    simpleExtension: new SimpleExtension()
  }
})
```

### Extension with Configuration

```typescript
interface WordCounterOptions {
  displayWords: boolean
  displayCharacters: boolean
  position: 'top' | 'bottom' | 'custom'
  container?: HTMLElement
}

class WordCounter extends Extension {
  name = 'wordCounter'
  private options: WordCounterOptions
  private counterElement: HTMLElement | null = null

  constructor(options: Partial<WordCounterOptions> = {}) {
    super()
    this.options = {
      displayWords: true,
      displayCharacters: true,
      position: 'bottom',
      ...options
    }
  }

  init() {
    this.createCounterElement()
    this.base.subscribe('editableInput', this.updateCount.bind(this))
    this.updateCount() // Initial count
  }

  private createCounterElement() {
    this.counterElement = document.createElement('div')
    this.counterElement.className = 'word-counter'
    this.counterElement.style.cssText = this.getCounterStyles()

    if (this.options.container) {
      this.options.container.appendChild(this.counterElement)
    }
    else {
      document.body.appendChild(this.counterElement)
    }
  }

  private updateCount() {
    if (!this.counterElement)
      return

    const content = this.base.getContent()
    const text = this.stripHtml(content)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length

    const parts: string[] = []
    if (this.options.displayWords)
      parts.push(`${words} words`)
    if (this.options.displayCharacters)
      parts.push(`${characters} chars`)

    this.counterElement.textContent = parts.join(' • ')

    // Trigger custom event
    this.base.trigger('wordCount:updated', { words, characters })
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  private getCounterStyles(): string {
    const baseStyles = `
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    `

    switch (this.options.position) {
      case 'top':
        return `${baseStyles}position: fixed; top: 20px; right: 20px;`
      case 'bottom':
        return `${baseStyles}position: fixed; bottom: 20px; right: 20px;`
      default:
        return `${baseStyles}position: relative;`
    }
  }

  destroy() {
    if (this.counterElement) {
      this.counterElement.remove()
    }
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    wordCounter: new WordCounter({
      displayWords: true,
      displayCharacters: true,
      position: 'bottom'
    })
  }
})
```

## Advanced Extension Patterns

### Extension with Toolbar Integration

```typescript
class CustomButtons extends Extension {
  name = 'customButtons'

  init() {
    this.addCustomButtons()
  }

  private addCustomButtons() {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    // Add strikethrough button
    toolbar.addButton({
      name: 'strikethrough',
      aria: 'Strikethrough',
      tagNames: ['s', 'strike'],
      contentDefault: '<b>S</b>',
      action: (event) => {
        this.applyStrikethrough()
      }
    })

    // Add highlight button
    toolbar.addButton({
      name: 'highlight',
      aria: 'Highlight',
      tagNames: ['mark'],
      contentDefault: '<b>H</b>',
      action: (event) => {
        this.applyHighlight()
      }
    })
  }

  private applyStrikethrough() {
    this.wrapSelection('s')
  }

  private applyHighlight() {
    this.wrapSelection('mark')
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
      selection.removeAllRanges()
    }
  }
}
```

### Extension with External API Integration

```typescript
interface AutoSaveOptions {
  delay: number
  saveCallback: (content: string) => Promise<void>
  showStatus: boolean
}

class AutoSave extends Extension {
  name = 'autoSave'
  private options: AutoSaveOptions
  private saveTimeout: number | null = null
  private isDirty = false
  private statusElement: HTMLElement | null = null

  constructor(options: AutoSaveOptions) {
    super()
    this.options = options
  }

  init() {
    this.base.subscribe('editableInput', this.handleContentChange.bind(this))
    this.base.subscribe('blur', this.handleBlur.bind(this))

    if (this.options.showStatus) {
      this.createStatusElement()
    }
  }

  private handleContentChange(event: Event, editable: HTMLElement) {
    this.isDirty = true
    this.scheduleAutoSave()
  }

  private handleBlur(event: FocusEvent, editable: HTMLElement) {
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

  private createStatusElement() {
    this.statusElement = document.createElement('div')
    this.statusElement.className = 'auto-save-status'
    this.statusElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      transition: opacity 0.3s ease;
      opacity: 0;
    `
    document.body.appendChild(this.statusElement)
  }

  private showSaveStatus(status: 'saving' | 'saved' | 'error') {
    if (!this.statusElement)
      return

    const statusConfig = {
      saving: { text: 'Saving...', color: '#f39c12', opacity: '1' },
      saved: { text: 'Saved', color: '#27ae60', opacity: '1' },
      error: { text: 'Save failed', color: '#e74c3c', opacity: '1' }
    }

    const config = statusConfig[status]
    this.statusElement.textContent = config.text
    this.statusElement.style.backgroundColor = config.color
    this.statusElement.style.color = 'white'
    this.statusElement.style.opacity = config.opacity

    if (status === 'saved') {
      setTimeout(() => {
        if (this.statusElement) {
          this.statusElement.style.opacity = '0'
        }
      }, 2000)
    }
  }

  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
    if (this.statusElement) {
      this.statusElement.remove()
    }
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    autoSave: new AutoSave({
      delay: 3000,
      saveCallback: async (content) => {
        const response = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        if (!response.ok)
          throw new Error('Save failed')
      },
      showStatus: true
    })
  }
})
```

## Extension Communication

### Inter-Extension Communication

```typescript
class ExtensionA extends Extension {
  name = 'extensionA'

  init() {
    // Expose public API
    this.base.extensionA = {
      getData: this.getData.bind(this),
      processData: this.processData.bind(this)
    }
  }

  getData(): any {
    return { message: 'Hello from Extension A' }
  }

  processData(data: any): void {
    console.log('Extension A processing:', data)
  }
}

class ExtensionB extends Extension {
  name = 'extensionB'

  init() {
    // Wait for other extensions to initialize
    setTimeout(() => {
      this.communicateWithExtensionA()
    }, 0)
  }

  private communicateWithExtensionA() {
    if (this.base.extensionA) {
      const data = this.base.extensionA.getData()
      console.log('Received from Extension A:', data)

      this.base.extensionA.processData({ from: 'Extension B' })
    }
  }
}
```

## Best Practices

### Performance Optimization

```typescript
class OptimizedExtension extends Extension {
  name = 'optimizedExtension'
  private debounceTimeout: number | null = null

  init() {
    // Use debounced event handlers for performance
    this.base.subscribe('editableInput', this.debouncedHandler.bind(this))
  }

  private debouncedHandler(event: Event, editable: HTMLElement) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }

    this.debounceTimeout = window.setTimeout(() => {
      this.handleInput(event, editable)
    }, 300)
  }

  private handleInput(event: Event, editable: HTMLElement) {
    // Actual processing logic
  }

  destroy() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }
  }
}
```

### Error Handling

```typescript
class RobustExtension extends Extension {
  name = 'robustExtension'

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

  private safeOperation(operation: () => void) {
    try {
      operation()
    }
    catch (error) {
      console.error('Operation failed:', error)
      // Handle error gracefully
    }
  }
}
```

## Next Steps

- Learn about [Multiple Editors](/advanced/multiple-editors) for managing multiple instances
- Explore [Real-time Collaboration](/advanced/collaboration) for collaborative editing
- Check out [Performance Optimization](/advanced/performance) for scaling extensions
- See [API Reference](/api) for complete extension APIs
