# Extensions

Extend the editor with custom functionality using the extension system.

## Word Counter Extension

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Word Counter Extension - Start typing to see the word counter in the bottom right:</div>
  <div class="demo-word-counter-ext" contenteditable="true" data-placeholder="Try typing here to see the word counter extension...">
    <p>This editor has a word counter extension that shows in the bottom right corner. Try typing to see it update!</p>
  </div>
</div>

### Implementation
```typescript
class WordCounterExtension {
  name = 'word-counter'

  init() {
    this.setupWordCounter()
  }

  setupWordCounter() {
    // Create word count display
    const counter = document.createElement('div')
    counter.id = 'word-counter'
    counter.style.cssText = `
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
    document.body.appendChild(counter)

    // Update counter on input
    this.base.subscribe('editableInput', (event, editable) => {
      const text = editable.textContent.trim()
      const words = text ? text.split(/\s+/).length : 0
      const chars = text.length
      counter.textContent = `${words} words, ${chars} chars`
    })
  }
}

// Use the extension
const editor = new MediumEditor('.editable', {
  extensions: {
    'word-counter': new WordCounterExtension()
  }
})
```

## Auto-Save Extension

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Auto-Save Extension - Content saves automatically and shows notifications:</div>
  <div class="demo-auto-save-ext" contenteditable="true" data-placeholder="Type here to see auto-save notifications...">
    <p>This editor has an auto-save extension that saves content to localStorage after you stop typing. Look for green notifications in the top right!</p>
  </div>
</div>

### Implementation
```typescript
class AutoSaveExtension {
  name = 'auto-save'
  saveTimeout = null

  init() {
    this.setupAutoSave()
  }

  setupAutoSave() {
    this.base.subscribe('editableInput', (event, editable) => {
      // Clear existing timeout
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }

      // Set new timeout for auto-save
      this.saveTimeout = setTimeout(() => {
        this.saveContent(editable.innerHTML)
      }, 2000) // Save after 2 seconds of inactivity
    })
  }

  saveContent(content) {
    // Save to localStorage
    localStorage.setItem('editor-content', content)

    // Show save notification
    this.showNotification('Content auto-saved!')
  }

  showNotification(message) {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}
```

## Complete Extension Example

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Full-Featured Editor - Combines word counter and auto-save extensions:</div>
  <div class="demo-full-featured" contenteditable="true" data-placeholder="Try all the extensions...">
    <p>This editor includes multiple extensions:</p>
    <ul>
      <li>Word counter (bottom right)</li>
      <li>Auto-save (saves to localStorage)</li>
    </ul>
  </div>
</div>

### HTML
```html
<div class="full-featured-editor" data-placeholder="Try all the extensions...">
  <p>This editor includes multiple extensions:</p>
  <ul>
    <li>Word counter (bottom right)</li>
    <li>Auto-save (saves to localStorage)</li>
  </ul>
</div>
```

### TypeScript
```typescript
const fullEditor = new MediumEditor('.full-featured-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor', 'quote']
  },
  extensions: {
    'word-counter': new WordCounterExtension(),
    'auto-save': new AutoSaveExtension()
  }
})
```

## Next Steps

- Check out [Real-World Use Cases](/examples/real-world) for complete applications
- Learn about [Event Handling](/examples/events) for extension communication
- Explore [Custom Toolbar](/examples/toolbar) integration

<script>
// Simplified demo implementation for documentation purposes
class DemoMediumEditor {
  constructor(selector, options = {}) {
    this.elements = typeof selector === 'string'
      ? Array.from(document.querySelectorAll(selector))
      : [selector]
    this.options = options
    this.listeners = new Map()
    this.extensions = {}
    this.init()
  }

  init() {
    this.elements.forEach(element => {
      if (!element.hasAttribute('contenteditable')) {
        element.contentEditable = 'true'
      }
      element.classList.add('medium-editor-element')

      element.addEventListener('input', (e) => {
        this.trigger('editableInput', e, element)
      })
    })

    // Initialize extensions
    if (this.options.extensions) {
      Object.keys(this.options.extensions).forEach(name => {
        const extension = this.options.extensions[name]
        extension.base = this // Give extension access to editor
        if (extension.init) {
          extension.init()
        }
        this.extensions[name] = extension
      })
    }
  }

  subscribe(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, [])
    }
    this.listeners.get(eventName).push(callback)
  }

  trigger(eventName, event, element) {
    const callbacks = this.listeners.get(eventName) || []
    callbacks.forEach(callback => callback(event, element))
  }
}

// Word Counter Extension
class WordCounterExtension {
  constructor(id = '') {
    this.name = 'word-counter'
    this.counter = null
    this.id = id // Unique identifier for this instance
  }

  init() {
    this.setupWordCounter()
  }

  setupWordCounter() {
    // Remove any existing counter for this instance
    const existingCounter = document.querySelector(`.demo-word-counter-display-${this.id}`)
    if (existingCounter) {
      existingCounter.remove()
    }

    // Create word count display
    this.counter = document.createElement('div')
    this.counter.className = `demo-word-counter-display demo-word-counter-display-${this.id}`

        // Position counters differently based on ID to avoid overlap
    let bottomPosition = '20px'
    let rightPosition = '20px'

    if (this.id === 'full') {
      bottomPosition = '80px' // Stack above other counter with gap
    }

    this.counter.style.cssText = `
      position: fixed;
      bottom: ${bottomPosition};
      right: ${rightPosition};
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `
    document.body.appendChild(this.counter)

    // Update counter on input - only for this extension's editor
    this.base.subscribe('editableInput', (event, editable) => {
      // Only update if the event is from our editor's elements
      if (this.base.elements.includes(editable)) {
        this.updateCounter(editable)
      }
    })

    // Initialize counter for existing content
    if (this.base.elements && this.base.elements[0]) {
      this.updateCounter(this.base.elements[0])
    }
  }

  updateCounter(editable) {
    if (!this.counter) return

    const text = editable.textContent?.trim() || ''
    const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0
    const chars = text.length
    this.counter.textContent = `${words} words, ${chars} chars`
  }

  destroy() {
    if (this.counter) {
      this.counter.remove()
    }
  }
}

// Auto-Save Extension
class AutoSaveExtension {
  constructor() {
    this.name = 'auto-save'
    this.saveTimeout = null
  }

  init() {
    this.setupAutoSave()
  }

  setupAutoSave() {
    this.base.subscribe('editableInput', (event, editable) => {
      // Clear existing timeout
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout)
      }

      // Set new timeout for auto-save
      this.saveTimeout = setTimeout(() => {
        this.saveContent(editable.innerHTML)
      }, 2000) // Save after 2 seconds of inactivity
    })
  }

  saveContent(content) {
    // Save to localStorage
    localStorage.setItem('extension-editor-content', content)

    // Show save notification
    this.showNotification('Content auto-saved!')
  }

  showNotification(message) {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease;
    `

    // Add animation styles if not already added
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style')
      style.id = 'notification-styles'
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 2700)
  }
}

// Initialize demos when page loads
let retryCount = 0
const maxRetries = 50

function waitForElements() {
  const wordCounterDemo = document.querySelector('.demo-word-counter-ext')
  const autoSaveDemo = document.querySelector('.demo-auto-save-ext')
  const fullFeaturedDemo = document.querySelector('.demo-full-featured')

  if (wordCounterDemo || autoSaveDemo || fullFeaturedDemo) {
    initializeExtensionDemos()
  } else if (retryCount < maxRetries) {
    retryCount++
    setTimeout(waitForElements, 100)
  }
}

function initializeExtensionDemos() {
  // Clean up any existing demo counters
  document.querySelectorAll('.demo-word-counter-display').forEach(el => el.remove())

  // Word Counter Extension Demo
  const wordCounterDemo = document.querySelector('.demo-word-counter-ext')
  if (wordCounterDemo) {
    const wordCounterEditor = new DemoMediumEditor(wordCounterDemo, {
      extensions: {
        'word-counter': new WordCounterExtension('single')
      }
    })
  }

  // Auto-Save Extension Demo
  const autoSaveDemo = document.querySelector('.demo-auto-save-ext')
  if (autoSaveDemo) {
    const autoSaveEditor = new DemoMediumEditor(autoSaveDemo, {
      extensions: {
        'auto-save': new AutoSaveExtension()
      }
    })
  }

  // Full-Featured Demo (both extensions)
  const fullFeaturedDemo = document.querySelector('.demo-full-featured')
  if (fullFeaturedDemo) {
    const fullEditor = new DemoMediumEditor(fullFeaturedDemo, {
      extensions: {
        'word-counter': new WordCounterExtension('full'),
        'auto-save': new AutoSaveExtension()
      }
    })
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForElements)
} else {
  waitForElements()
}
</script>

<style>
.demo-container {
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.demo-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.demo-word-counter-ext,
.demo-auto-save-ext,
.demo-full-featured {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-height: 120px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.demo-word-counter-ext[contenteditable="true"],
.demo-auto-save-ext[contenteditable="true"],
.demo-full-featured[contenteditable="true"] {
  cursor: text;
}

.demo-word-counter-ext:empty:before,
.demo-auto-save-ext:empty:before,
.demo-full-featured:empty:before {
  content: attr(data-placeholder);
  color: #6c757d;
  font-style: italic;
}

.demo-word-counter-ext:focus,
.demo-auto-save-ext:focus,
.demo-full-featured:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.demo-container .medium-editor-element {
  outline: none;
}

.demo-container .medium-editor-element p {
  margin: 0.5rem 0;
}

.demo-container .medium-editor-element:first-child {
  margin-top: 0;
}
</style>
