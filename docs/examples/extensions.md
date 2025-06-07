# Extensions

Extend the editor with custom functionality using the extension system.

## Word Counter Extension

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