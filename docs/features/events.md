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
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed in:', editable)
  console.log('New content:', editable.innerHTML)
})
```

### Unsubscribing from Events

```typescript
// Define handler function
function handleContentChange(event: Event, editable: HTMLElement) {
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
editor.subscribe('customEvent', (event, data) => {
  console.log('Custom event triggered with:', data)
})
```

## Content Events

### editableInput

Fired when the content of the editor changes.

```typescript
editor.subscribe('editableInput', (event, editable) => {
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
editor.subscribe('editableKeydown', (event, editable) => {
  const keyEvent = event as KeyboardEvent
  console.log('Key pressed:', keyEvent.key)
  console.log('Key code:', keyEvent.keyCode)

  // Example: Custom keyboard shortcuts
  if (keyEvent.ctrlKey && keyEvent.key === 's') {
    event.preventDefault()
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
editor.subscribe('editableKeyup', (event, editable) => {
  const keyEvent = event as KeyboardEvent

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
editor.subscribe('editableKeypress', (event, editable) => {
  const keyEvent = event as KeyboardEvent
  console.log('Key pressed:', keyEvent.key)
})
```

### editableClick

Fired when the editor is clicked.

```typescript
editor.subscribe('editableClick', (event, editable) => {
  console.log('Editor clicked')
})
```

### editableBlur

Fired when the editor loses focus (element-specific).

```typescript
editor.subscribe('editableBlur', (event, editable) => {
  console.log('Editor element blurred:', editable)
})
```

### editablePaste

Fired when content is pasted into the editor.

```typescript
editor.subscribe('editablePaste', (event, editable) => {
  console.log('Content pasted into:', editable)
})
```

### editableDrag

Fired when content is dragged in the editor.

```typescript
editor.subscribe('editableDrag', (event, editable) => {
  console.log('Content dragged in:', editable)
})
```

### editableDrop

Fired when content is dropped into the editor.

```typescript
editor.subscribe('editableDrop', (event, editable) => {
  console.log('Content dropped into:', editable)
})
```

## Focus Events

### focus

Fired when the editor gains focus.

```typescript
editor.subscribe('focus', (event, editable) => {
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
editor.subscribe('blur', (event, editable) => {
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
editor.subscribe('externalInteraction', (event) => {
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
editor.subscribe('showToolbar', (event, editable) => {
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
editor.subscribe('hideToolbar', (event, editable) => {
  console.log('Toolbar hidden for element:', editable)

  // Example: Cleanup custom UI
  removeCustomToolbarButtons()
})
```

### positionToolbar

Fired when the toolbar position changes.

```typescript
editor.subscribe('positionToolbar', (event, editable) => {
  console.log('Toolbar repositioned for element:', editable)

  // Example: Adjust custom UI positioning
  adjustCustomUIPosition()
})
```

## Advanced Event Handling

### Event Delegation

```typescript
class EventManager extends Extension {
  name = 'eventManager'
  private eventHandlers = new Map<string, Function[]>()

  init() {
    // Set up centralized event handling
    this.setupEventDelegation()
  }

  private setupEventDelegation() {
    // Content events
    this.base.subscribe('editableInput', this.handleContentChange.bind(this))
    this.base.subscribe('editableKeydown', this.handleKeydown.bind(this))
    this.base.subscribe('editableKeyup', this.handleKeyup.bind(this))

    // Focus events
    this.base.subscribe('focus', this.handleFocus.bind(this))
    this.base.subscribe('blur', this.handleBlur.bind(this))

    // Toolbar events
    this.base.subscribe('showToolbar', this.handleToolbarShow.bind(this))
    this.base.subscribe('hideToolbar', this.handleToolbarHide.bind(this))
  }

  private handleContentChange(event: Event, editable: HTMLElement) {
    this.notifyHandlers('content:change', { event, editable })
  }

  private handleKeydown(event: KeyboardEvent, editable: HTMLElement) {
    this.notifyHandlers('key:down', { event, editable })
  }

  private handleKeyup(event: KeyboardEvent, editable: HTMLElement) {
    this.notifyHandlers('key:up', { event, editable })
  }

  private handleFocus(event: FocusEvent, editable: HTMLElement) {
    this.notifyHandlers('editor:focus', { event, editable })
  }

  private handleBlur(event: FocusEvent, editable: HTMLElement) {
    this.notifyHandlers('editor:blur', { event, editable })
  }

  private handleToolbarShow(event: Event, editable: HTMLElement) {
    this.notifyHandlers('toolbar:show', { event, editable })
  }

  private handleToolbarHide(event: Event, editable: HTMLElement) {
    this.notifyHandlers('toolbar:hide', { event, editable })
  }

  // Public API for registering handlers
  on(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)!.push(handler)
  }

  off(eventType: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private notifyHandlers(eventType: string, data: any) {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    eventManager: new EventManager()
  }
})

const eventManager = editor.getExtensionByName('eventManager')
eventManager.on('content:change', ({ event, editable }) => {
  console.log('Content changed via event manager')
})
```

### Debounced Event Handling

```typescript
class DebouncedEventHandler extends Extension {
  name = 'debouncedEventHandler'
  private debounceTimeouts = new Map<string, number>()

  init() {
    this.base.subscribe('editableInput', this.debouncedContentChange.bind(this))
    this.base.subscribe('editableKeyup', this.debouncedKeyup.bind(this))
  }

  private debouncedContentChange(event: Event, editable: HTMLElement) {
    this.debounce('contentChange', () => {
      this.handleContentChange(event, editable)
    }, 300)
  }

  private debouncedKeyup(event: KeyboardEvent, editable: HTMLElement) {
    this.debounce('keyup', () => {
      this.handleKeyup(event, editable)
    }, 150)
  }

  private debounce(key: string, func: Function, delay: number) {
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

  private handleContentChange(event: Event, editable: HTMLElement) {
    // Debounced content change handling
    console.log('Debounced content change')
  }

  private handleKeyup(event: KeyboardEvent, editable: HTMLElement) {
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
class AutoSave extends Extension {
  name = 'autoSave'
  private saveTimeout: number | null = null
  private isDirty = false
  private lastSavedContent = ''

  init() {
    this.base.subscribe('editableInput', this.handleContentChange.bind(this))
    this.base.subscribe('blur', this.handleBlur.bind(this))

    // Save initial content
    this.lastSavedContent = this.base.getContent()
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
    }, 2000) // Save after 2 seconds of inactivity
  }

  private async saveNow() {
    const currentContent = this.base.getContent()

    if (currentContent === this.lastSavedContent) {
      this.isDirty = false
      return
    }

    try {
      await this.saveToServer(currentContent)
      this.lastSavedContent = currentContent
      this.isDirty = false
      this.showSaveStatus('saved')
    }
    catch (error) {
      this.showSaveStatus('error')
      console.error('Auto-save failed:', error)
    }
  }

  private async saveToServer(content: string) {
    // Implement server save logic
    return fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
  }

  private showSaveStatus(status: 'saving' | 'saved' | 'error') {
    // Update UI to show save status
    this.base.trigger('autoSave:status', status)
  }
}
```

### Word Counter

```typescript
class WordCounter extends Extension {
  name = 'wordCounter'
  private counterElement: HTMLElement | null = null

  init() {
    this.createCounterElement()
    this.base.subscribe('editableInput', this.updateCount.bind(this))
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

    const content = this.base.getContent()
    const text = this.stripHtml(content)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length

    this.counterElement.textContent = `${words} words • ${characters} chars`

    // Trigger custom event
    this.base.trigger('wordCount:updated', { words, characters })
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
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
class ContentValidator extends Extension {
  name = 'contentValidator'
  private validationRules: ValidationRule[] = []

  init() {
    this.base.subscribe('editableInput', this.validateContent.bind(this))
    this.base.subscribe('blur', this.validateContent.bind(this))

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

  private validateContent(event: Event, editable: HTMLElement) {
    const content = this.stripHtml(editable.innerHTML)
    const errors: string[] = []

    this.validationRules.forEach((rule) => {
      if (!rule.validate(content)) {
        errors.push(rule.message)
      }
    })

    if (errors.length > 0) {
      this.showValidationErrors(errors)
      this.base.trigger('validation:failed', { errors, content })
    }
    else {
      this.clearValidationErrors()
      this.base.trigger('validation:passed', { content })
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
    return div.textContent || div.innerText || ''
  }
}

interface ValidationRule {
  name: string
  validate: (content: string) => boolean
  message: string
}
```

## Event Performance Optimization

### Event Throttling

```typescript
class ThrottledEventHandler extends Extension {
  name = 'throttledEventHandler'
  private lastExecuted = new Map<string, number>()

  init() {
    this.base.subscribe('editableInput', this.throttledContentChange.bind(this))
  }

  private throttledContentChange(event: Event, editable: HTMLElement) {
    this.throttle('contentChange', () => {
      this.handleContentChange(event, editable)
    }, 100) // Throttle to once per 100ms
  }

  private throttle(key: string, func: Function, limit: number) {
    const now = Date.now()
    const lastExec = this.lastExecuted.get(key) || 0

    if (now - lastExec >= limit) {
      func()
      this.lastExecuted.set(key, now)
    }
  }

  private handleContentChange(event: Event, editable: HTMLElement) {
    // Throttled content change handling
    console.log('Throttled content change')
  }
}
```

### Memory-Efficient Event Handling

```typescript
class MemoryEfficientEvents extends Extension {
  name = 'memoryEfficientEvents'
  private eventListeners: Array<() => void> = []

  init() {
    // Use arrow functions to avoid binding issues
    const contentHandler = (event: Event, editable: HTMLElement) => {
      this.handleContentChange(event, editable)
    }

    const focusHandler = (event: FocusEvent, editable: HTMLElement) => {
      this.handleFocus(event, editable)
    }

    // Subscribe to events
    this.base.subscribe('editableInput', contentHandler)
    this.base.subscribe('focus', focusHandler)

    // Store cleanup functions
    this.eventListeners.push(
      () => this.base.unsubscribe('editableInput', contentHandler),
      () => this.base.unsubscribe('focus', focusHandler)
    )
  }

  private handleContentChange(event: Event, editable: HTMLElement) {
    // Handle content change
  }

  private handleFocus(event: FocusEvent, editable: HTMLElement) {
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
class EventLogger extends Extension {
  name = 'eventLogger'

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
      this.base.subscribe(eventName, (event, ...args) => {
        console.log(`Event: ${eventName}`, {
          event,
          args,
          timestamp: new Date().toISOString()
        })
      })
    })
  }
}

// Enable event logging
const editor = new MediumEditor('.editable', {
  extensions: {
    eventLogger: new EventLogger()
  }
})
```

### Event Performance Monitor

```typescript
class EventPerformanceMonitor extends Extension {
  name = 'eventPerformanceMonitor'
  private eventCounts = new Map<string, number>()
  private eventTimes = new Map<string, number[]>()

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
    this.base.subscribe(eventName, (event, ...args) => {
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
