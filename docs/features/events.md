# Events

TypeScript Medium Editor provides a comprehensive event system that allows you to listen for and respond to various editor interactions. This enables you to create dynamic, responsive applications that react to user input and editor state changes.

## Overview

The event system is built on a publish-subscribe pattern, allowing you to subscribe to specific events and receive notifications when they occur. Events provide context about what happened and which editor element was affected.

## Basic Event Usage

### Subscribing to Events

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable')

// Subscribe to content changes
editor.subscribe('editableInput', (data, editable) => {
  console.log('Content changed in:', editable)
  console.log('New content:', editable.innerHTML)
})
```

### Unsubscribing from Events

```typescript
// Define handler function
function handleContentChange(data: any, editable: HTMLElement) {
  console.log('Content changed')
}

// Subscribe
editor.subscribe('editableInput', handleContentChange)

// Unsubscribe later
editor.unsubscribe('editableInput', handleContentChange)
```

### Triggering Custom Events

```typescript
// Trigger custom events
editor.trigger('customEvent', { data: 'custom data' })

// Listen for custom events
editor.subscribe('customEvent', (data) => {
  console.log('Custom event triggered with:', data)
})
```

## Content Events

### editableInput

Fired when the content of the editor changes.

```typescript
editor.subscribe('editableInput', (data, editable) => {
  console.log('Content changed')
  console.log('Element:', editable)
  console.log('New content:', editable.innerHTML)

  // Example: Auto-save functionality
  autoSave(editable.innerHTML)
})
```

**Use Cases:**
- Auto-save functionality
- Real-time content validation
- Character/word counting
- Content synchronization

### editableKeydown

Fired when a key is pressed down in the editor.

```typescript
editor.subscribe('editableKeydown', (data, editable) => {
  const keyEvent = data as KeyboardEvent
  console.log('Key pressed:', keyEvent.key)
  console.log('Key code:', keyEvent.keyCode)

  // Example: Custom keyboard shortcuts
  if (keyEvent.ctrlKey && keyEvent.key === 's') {
    keyEvent.preventDefault()
    saveContent()
  }
})
```

**Use Cases:**
- Custom keyboard shortcuts
- Input validation
- Character restrictions
- Special key handling

### editableKeyup

Fired when a key is released in the editor.

```typescript
editor.subscribe('editableKeyup', (data, editable) => {
  const keyEvent = data as KeyboardEvent

  // Example: Format detection after typing
  if (keyEvent.key === ' ') {
    detectMarkdownSyntax(editable)
  }
})
```

**Use Cases:**
- Markdown syntax detection
- Auto-formatting
- Delayed content processing
- Spell checking triggers

### editableKeypress

Fired when a key is pressed in the editor.

```typescript
editor.subscribe('editableKeypress', (data, editable) => {
  const keyEvent = data as KeyboardEvent
  console.log('Key pressed:', keyEvent.key)
})
```

### editableClick

Fired when the editor is clicked.

```typescript
editor.subscribe('editableClick', (data, editable) => {
  console.log('Editor clicked')
})
```

### editableBlur

Fired when the editor loses focus (element-specific).

```typescript
editor.subscribe('editableBlur', (data, editable) => {
  console.log('Editor element blurred:', editable)
})
```

### editablePaste

Fired when content is pasted into the editor.

```typescript
editor.subscribe('editablePaste', (data, editable) => {
  console.log('Content pasted into:', editable)
})
```

### editableDrag

Fired when content is dragged in the editor.

```typescript
editor.subscribe('editableDrag', (data, editable) => {
  console.log('Content dragged in:', editable)
})
```

### editableDrop

Fired when content is dropped into the editor.

```typescript
editor.subscribe('editableDrop', (data, editable) => {
  console.log('Content dropped into:', editable)
})
```

## Focus Events

### focus

Fired when the editor gains focus.

```typescript
editor.subscribe('focus', (data, editable) => {
  console.log('Editor focused')

  // Example: Show editing hints
  showEditingHints()

  // Example: Track user engagement
  trackEngagement('editor_focused')
})
```

**Use Cases:**
- UI state management
- User analytics
- Contextual help display
- Toolbar activation

### blur

Fired when the editor loses focus.

```typescript
editor.subscribe('blur', (data, editable) => {
  console.log('Editor blurred')

  // Example: Auto-save on blur
  if (hasUnsavedChanges()) {
    saveContent()
  }

  // Example: Hide editing UI
  hideEditingHints()
})
```

**Use Cases:**
- Auto-save triggers
- Content validation
- UI cleanup
- Form submission preparation

### externalInteraction

Fired when the user interacts with elements outside the editor.

```typescript
editor.subscribe('externalInteraction', (data) => {
  console.log('User clicked outside editor')

  // Example: Hide toolbar or save content
  hideCustomUI()
})
```

**Use Cases:**
- Hide floating UI elements
- Auto-save on external interaction
- Close popups or modals
- Update editor state

## Toolbar Events

### showToolbar

Fired when the toolbar becomes visible.

```typescript
editor.subscribe('showToolbar', (data, editable) => {
  console.log('Toolbar shown for element:', editable)

  // Example: Analytics tracking
  trackToolbarUsage('shown')

  // Example: Custom toolbar enhancements
  addCustomToolbarButtons()
})
```

### hideToolbar

Fired when the toolbar becomes hidden.

```typescript
editor.subscribe('hideToolbar', (data, editable) => {
  console.log('Toolbar hidden for element:', editable)

  // Example: Cleanup custom UI
  removeCustomToolbarButtons()
})
```

### positionToolbar

Fired when the toolbar position changes.

```typescript
editor.subscribe('positionToolbar', (data, editable) => {
  console.log('Toolbar repositioned for element:', editable)

  // Example: Adjust custom UI positioning
  adjustCustomUIPosition()
})
```

## Advanced Event Handling

### Event Delegation

```typescript
interface EventHandlerMap {
  [key: string]: ((data: any) => void)[]
}

class EventManager {
  name = 'eventManager'
  private eventHandlers: EventHandlerMap = {}
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.setupEventDelegation()
  }

  private setupEventDelegation() {
    // Content events
    this.editor.subscribe('editableInput', this.handleContentChange.bind(this))
    this.editor.subscribe('editableKeydown', this.handleKeydown.bind(this))
    this.editor.subscribe('editableKeyup', this.handleKeyup.bind(this))

    // Focus events
    this.editor.subscribe('focus', this.handleFocus.bind(this))
    this.editor.subscribe('blur', this.handleBlur.bind(this))

    // Toolbar events
    this.editor.subscribe('showToolbar', this.handleToolbarShow.bind(this))
    this.editor.subscribe('hideToolbar', this.handleToolbarHide.bind(this))
  }

  private handleContentChange(data: any, editable: HTMLElement) {
    this.notifyHandlers('content:change', { data, editable })
  }

  private handleKeydown(data: KeyboardEvent, editable: HTMLElement) {
    this.notifyHandlers('key:down', { data, editable })
  }

  private handleKeyup(data: KeyboardEvent, editable: HTMLElement) {
    this.notifyHandlers('key:up', { data, editable })
  }

  private handleFocus(data: FocusEvent, editable: HTMLElement) {
    this.notifyHandlers('editor:focus', { data, editable })
  }

  private handleBlur(data: FocusEvent, editable: HTMLElement) {
    this.notifyHandlers('editor:blur', { data, editable })
  }

  private handleToolbarShow(data: any, editable: HTMLElement) {
    this.notifyHandlers('toolbar:show', { data, editable })
  }

  private handleToolbarHide(data: any, editable: HTMLElement) {
    this.notifyHandlers('toolbar:hide', { data, editable })
  }

  // Public API for registering handlers
  on(eventType: string, handler: (data: any) => void) {
    if (!this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = []
    }
    this.eventHandlers[eventType].push(handler)
  }

  off(eventType: string, handler: (data: any) => void) {
    const handlers = this.eventHandlers[eventType]
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private notifyHandlers(eventType: string, data: any) {
    const handlers = this.eventHandlers[eventType]
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }
}

// Usage
const editor = new MediumEditor('.editable')
const eventManager = new EventManager(editor)

eventManager.on('content:change', ({ data, editable }) => {
  console.log('Content changed via event manager')
})
```

### Debounced Event Handling

```typescript
class DebouncedEventHandler {
  name = 'debouncedEventHandler'
  private debounceTimeouts = new Map<string, number>()
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.editor.subscribe('editableInput', this.debouncedContentChange.bind(this))
    this.editor.subscribe('editableKeyup', this.debouncedKeyup.bind(this))
  }

  private debouncedContentChange(data: any, editable: HTMLElement) {
    this.debounce('contentChange', () => {
      this.handleContentChange(data, editable)
    }, 300)
  }

  private debouncedKeyup(data: KeyboardEvent, editable: HTMLElement) {
    this.debounce('keyup', () => {
      this.handleKeyup(data, editable)
    }, 150)
  }

  private debounce(key: string, func: () => void, delay: number) {
    const existingTimeout = this.debounceTimeouts.get(key)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    const timeout = window.setTimeout(() => {
      func()
      this.debounceTimeouts.delete(key)
    }, delay)

    this.debounceTimeouts.set(key, timeout)
  }

  private handleContentChange(data: any, editable: HTMLElement) {
    // Debounced content change handling
    console.log('Debounced content change')
  }

  private handleKeyup(data: KeyboardEvent, editable: HTMLElement) {
    // Debounced keyup handling
    console.log('Debounced keyup')
  }

  destroy() {
    // Clear all timeouts
    this.debounceTimeouts.forEach(timeout => clearTimeout(timeout))
    this.debounceTimeouts.clear()
  }
}
```

## Real-World Event Examples

### Auto-Save Implementation

```typescript
interface AutoSaveOptions {
  delay: number
  saveCallback: (content: string) => Promise<void>
  showStatus: boolean
}

class AutoSave {
  name = 'autoSave'
  private options: AutoSaveOptions
  private saveTimeout: number | null = null
  private isDirty = false
  private lastSavedContent = ''
  private statusElement: HTMLElement | null = null
  private editor: MediumEditor

  constructor(editor: MediumEditor, options: AutoSaveOptions) {
    this.editor = editor
    this.options = options
    this.init()
  }

  init() {
    this.editor.subscribe('editableInput', this.handleContentChange.bind(this))
    this.editor.subscribe('blur', this.handleBlur.bind(this))

    // Save initial content
    this.lastSavedContent = this.editor.getContent() || ''

    if (this.options.showStatus) {
      this.createStatusElement()
    }
  }

  private handleContentChange(data: any, editable: HTMLElement) {
    this.isDirty = true
    this.scheduleAutoSave()
  }

  private handleBlur(data: FocusEvent, editable: HTMLElement) {
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
    const currentContent = this.editor.getContent() || ''

    if (currentContent === this.lastSavedContent) {
      this.isDirty = false
      return
    }

    try {
      this.showSaveStatus('saving')
      await this.options.saveCallback(currentContent)
      this.lastSavedContent = currentContent
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
}

// Usage
const editor = new MediumEditor('.editable')
const autoSave = new AutoSave(editor, {
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
```

### Word Counter

```typescript
class WordCounter {
  name = 'wordCounter'
  private counterElement: HTMLElement | null = null
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.init()
  }

  init() {
    this.createCounterElement()
    this.editor.subscribe('editableInput', this.updateCount.bind(this))
    this.updateCount() // Initial count
  }

  private createCounterElement() {
    this.counterElement = document.createElement('div')
    this.counterElement.className = 'word-counter'
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
    document.body.appendChild(this.counterElement)
  }

  private updateCount() {
    if (!this.counterElement)
      return

    const content = this.editor.getContent() || ''
    const text = this.stripHtml(content)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length

    this.counterElement.textContent = `${words} words • ${characters} chars`

    // Trigger custom event
    this.editor.trigger('wordCount:updated', { words, characters })
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || ''
  }

  destroy() {
    if (this.counterElement) {
      this.counterElement.remove()
    }
  }
}
```

### Content Validation

```typescript
interface ValidationRule {
  name: string
  validate: (content: string) => boolean
  message: string
}

class ContentValidator {
  name = 'contentValidator'
  private validationRules: ValidationRule[] = []
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.init()
  }

  init() {
    this.editor.subscribe('editableInput', this.validateContent.bind(this))
    this.editor.subscribe('blur', this.validateContent.bind(this))

    // Set up default validation rules
    this.addValidationRule({
      name: 'maxLength',
      validate: content => content.length <= 5000,
      message: 'Content must be 5000 characters or less'
    })

    this.addValidationRule({
      name: 'minLength',
      validate: content => content.length >= 10,
      message: 'Content must be at least 10 characters'
    })
  }

  private validateContent(data: any, editable: HTMLElement) {
    const content = this.stripHtml(editable.innerHTML)
    const errors: string[] = []

    this.validationRules.forEach((rule) => {
      if (!rule.validate(content)) {
        errors.push(rule.message)
      }
    })

    if (errors.length > 0) {
      this.showValidationErrors(errors)
      this.editor.trigger('validation:failed', { errors, content })
    }
    else {
      this.clearValidationErrors()
      this.editor.trigger('validation:passed', { content })
    }
  }

  addValidationRule(rule: ValidationRule) {
    this.validationRules.push(rule)
  }

  private showValidationErrors(errors: string[]) {
    // Display validation errors to user
    console.log('Validation errors:', errors)
  }

  private clearValidationErrors() {
    // Clear validation error display
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || ''
  }
}
```

## Event Performance Optimization

### Event Throttling

```typescript
class ThrottledEventHandler {
  name = 'throttledEventHandler'
  private lastExecuted = new Map<string, number>()
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.editor.subscribe('editableInput', this.throttledContentChange.bind(this))
  }

  private throttledContentChange(data: any, editable: HTMLElement) {
    this.throttle('contentChange', () => {
      this.handleContentChange(data, editable)
    }, 100) // Throttle to once per 100ms
  }

  private throttle(key: string, func: () => void, limit: number) {
    const now = Date.now()
    const lastExec = this.lastExecuted.get(key) || 0

    if (now - lastExec >= limit) {
      func()
      this.lastExecuted.set(key, now)
    }
  }

  private handleContentChange(data: any, editable: HTMLElement) {
    // Throttled content change handling
    console.log('Throttled content change')
  }
}
```

### Memory-Efficient Event Handling

```typescript
class MemoryEfficientEvents {
  name = 'memoryEfficientEvents'
  private eventListeners: Array<() => void> = []
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.init()
  }

  init() {
    // Use arrow functions to avoid binding issues
    const contentHandler = (data: any, editable: HTMLElement) => {
      this.handleContentChange(data, editable)
    }

    const focusHandler = (data: FocusEvent, editable: HTMLElement) => {
      this.handleFocus(data, editable)
    }

    // Subscribe to events
    this.editor.subscribe('editableInput', contentHandler)
    this.editor.subscribe('focus', focusHandler)

    // Store cleanup functions
    this.eventListeners.push(
      () => this.editor.unsubscribe('editableInput', contentHandler),
      () => this.editor.unsubscribe('focus', focusHandler)
    )
  }

  private handleContentChange(data: any, editable: HTMLElement) {
    // Handle content change
  }

  private handleFocus(data: FocusEvent, editable: HTMLElement) {
    // Handle focus
  }

  destroy() {
    // Clean up all event listeners
    this.eventListeners.forEach(cleanup => cleanup())
    this.eventListeners = []
  }
}
```

## Debugging Events

### Event Logger

```typescript
class EventLogger {
  name = 'eventLogger'
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.init()
  }

  init() {
    // Log all events
    const events = [
      'editableInput',
      'editableKeydown',
      'editableKeyup',
      'focus',
      'blur',
      'showToolbar',
      'hideToolbar',
      'positionToolbar'
    ]

    events.forEach((eventName) => {
      this.editor.subscribe(eventName, (data, ...args) => {
        console.log(`Event: ${eventName}`, {
          data,
          args,
          timestamp: new Date().toISOString()
        })
      })
    })
  }
}

// Enable event logging
const editor = new MediumEditor('.editable')
const eventLogger = new EventLogger(editor)
```

### Event Performance Monitor

```typescript
class EventPerformanceMonitor {
  name = 'eventPerformanceMonitor'
  private eventCounts = new Map<string, number>()
  private eventTimes = new Map<string, number[]>()
  private editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
    this.init()
  }

  init() {
    this.monitorEvent('editableInput')
    this.monitorEvent('editableKeydown')
    this.monitorEvent('editableKeyup')

    // Report performance every 10 seconds
    setInterval(() => {
      this.reportPerformance()
    }, 10000)
  }

  private monitorEvent(eventName: string) {
    this.editor.subscribe(eventName, (data, ...args) => {
      const startTime = performance.now()

      // Count the event
      const count = this.eventCounts.get(eventName) || 0
      this.eventCounts.set(eventName, count + 1)

      // Measure execution time (simulate processing)
      setTimeout(() => {
        const endTime = performance.now()
        const duration = endTime - startTime

        if (!this.eventTimes.has(eventName)) {
          this.eventTimes.set(eventName, [])
        }
        this.eventTimes.get(eventName)!.push(duration)
      }, 0)
    })
  }

  private reportPerformance() {
    console.log('Event Performance Report:')

    this.eventCounts.forEach((count, eventName) => {
      const times = this.eventTimes.get(eventName) || []
      const avgTime = times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0

      console.log(`${eventName}: ${count} events, avg time: ${avgTime.toFixed(2)}ms`)
    })
  }
}
```

## Next Steps

- Learn about [Text Formatting](/features/formatting) for applying styles
- Explore [Custom Extensions](/extensions) for creating event-driven functionality
- Check out [Custom Extensions](/advanced/custom-extensions) for complex event scenarios
- See [API Reference](/api) for complete event methods
