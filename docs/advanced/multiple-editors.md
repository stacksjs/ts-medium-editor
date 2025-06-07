# Multiple Editors

`ts-medium-editor` supports managing multiple editor instances on a single page, each with independent configurations, content, and behavior. This is useful for complex applications with multiple content areas, forms, or collaborative editing scenarios.

## Overview

Multiple editor instances can be created and managed independently, allowing for:
- Different configurations per editor
- Independent content management
- Separate event handling
- Isolated extension systems
- Cross-editor communication when needed

## Basic Multiple Editors

### Creating Multiple Instances

```typescript
import { MediumEditor } from 'ts-medium-editor'

// Create multiple editors with different configurations
const titleEditor = new MediumEditor('#title', {
  toolbar: {
    buttons: ['bold', 'italic']
  },
  placeholder: {
    text: 'Enter your title...'
  }
})

const contentEditor = new MediumEditor('#content', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: 'Write your story...'
  }
})

const summaryEditor = new MediumEditor('#summary', {
  toolbar: {
    buttons: ['bold', 'italic']
  },
  placeholder: {
    text: 'Brief summary...'
  }
})
```

### HTML Structure

```html
<div class="article-form">
  <div id="title" class="title-editor" contenteditable="true"></div>
  <div id="content" class="content-editor" contenteditable="true"></div>
  <div id="summary" class="summary-editor" contenteditable="true"></div>
</div>
```

## Editor Manager Pattern

### Centralized Management

```typescript
class EditorManager {
  private editors = new Map<string, MediumEditor>()
  private configs = new Map<string, any>()

  constructor() {
    this.setupDefaultConfigs()
  }

  private setupDefaultConfigs() {
    this.configs.set('title', {
      toolbar: {
        buttons: ['bold', 'italic']
      },
      placeholder: {
        text: 'Enter title...'
      }
    })

    this.configs.set('content', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
      },
      placeholder: {
        text: 'Write your content...'
      }
    })

    this.configs.set('summary', {
      toolbar: {
        buttons: ['bold', 'italic']
      },
      placeholder: {
        text: 'Brief summary...'
      }
    })
  }

  createEditor(id: string, selector: string, customConfig?: any): MediumEditor {
    const config = {
      ...this.configs.get(id),
      ...customConfig
    }

    const editor = new MediumEditor(selector, config)
    this.editors.set(id, editor)

    // Set up cross-editor communication
    this.setupCommunication(id, editor)

    return editor
  }

  getEditor(id: string): MediumEditor | undefined {
    return this.editors.get(id)
  }

  getAllEditors(): Map<string, MediumEditor> {
    return new Map(this.editors)
  }

  destroyEditor(id: string): void {
    const editor = this.editors.get(id)
    if (editor) {
      editor.destroy()
      this.editors.delete(id)
    }
  }

  destroyAll(): void {
    this.editors.forEach(editor => editor.destroy())
    this.editors.clear()
  }

  private setupCommunication(id: string, editor: MediumEditor) {
    // Set up event forwarding for cross-editor communication
    editor.subscribe('editableInput', (event, editable) => {
      this.handleEditorChange(id, editor, event, editable)
    })
  }

  private handleEditorChange(id: string, editor: MediumEditor, event: Event, editable: HTMLElement) {
    // Broadcast change to other editors if needed
    this.broadcastChange(id, {
      editorId: id,
      content: editor.getContent(),
      event,
      editable
    })
  }

  private broadcastChange(sourceId: string, data: any) {
    this.editors.forEach((editor, id) => {
      if (id !== sourceId) {
        editor.trigger('crossEditorChange', data)
      }
    })
  }
}

// Usage
const editorManager = new EditorManager()

// Create editors
const titleEditor = editorManager.createEditor('title', '#title')
const contentEditor = editorManager.createEditor('content', '#content')
const summaryEditor = editorManager.createEditor('summary', '#summary')
```

## Cross-Editor Communication

### Shared State Management

```typescript
class SharedStateManager {
  private state = new Map<string, any>()
  private subscribers = new Map<string, Set<MediumEditor>>()

  setState(key: string, value: any): void {
    const oldValue = this.state.get(key)
    this.state.set(key, value)

    // Notify all subscribed editors
    const editorSet = this.subscribers.get(key)
    if (editorSet) {
      editorSet.forEach((editor) => {
        editor.trigger('sharedStateChange', {
          key,
          value,
          oldValue
        })
      })
    }
  }

  getState(key: string): any {
    return this.state.get(key)
  }

  subscribe(key: string, editor: MediumEditor): void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key)!.add(editor)
  }

  unsubscribe(key: string, editor: MediumEditor): void {
    const editorSet = this.subscribers.get(key)
    if (editorSet) {
      editorSet.delete(editor)
    }
  }
}

// Usage with multiple editors
const sharedState = new SharedStateManager()

// Subscribe editors to shared state
sharedState.subscribe('documentData', titleEditor)
sharedState.subscribe('documentData', contentEditor)
sharedState.subscribe('documentData', summaryEditor)

// Listen for state changes in each editor
titleEditor.subscribe('sharedStateChange', (event, data) => {
  if (data.key === 'documentData') {
    console.log('Document data changed:', data.value)
  }
})
```

### Content Synchronization

```typescript
class ContentSynchronizer {
  private editors: Map<string, MediumEditor>
  private syncRules: Map<string, SyncRule[]>

  constructor(editors: Map<string, MediumEditor>) {
    this.editors = editors
    this.syncRules = new Map()
    this.setupSynchronization()
  }

  addSyncRule(sourceEditor: string, rule: SyncRule): void {
    if (!this.syncRules.has(sourceEditor)) {
      this.syncRules.set(sourceEditor, [])
    }
    this.syncRules.get(sourceEditor)!.push(rule)
  }

  private setupSynchronization(): void {
    this.editors.forEach((editor, id) => {
      editor.subscribe('editableInput', (event, editable) => {
        this.handleContentChange(id, editor)
      })
    })
  }

  private handleContentChange(sourceId: string, sourceEditor: MediumEditor): void {
    const rules = this.syncRules.get(sourceId)
    if (!rules)
      return

    const sourceContent = sourceEditor.getContent()

    rules.forEach((rule) => {
      const targetEditor = this.editors.get(rule.targetEditor)
      if (targetEditor) {
        const transformedContent = rule.transform(sourceContent)
        if (transformedContent !== null) {
          targetEditor.setContent(transformedContent)
        }
      }
    })
  }
}

interface SyncRule {
  targetEditor: string
  transform: (content: string) => string | null
}

// Usage
const synchronizer = new ContentSynchronizer(editorManager.getAllEditors())

// Sync title to summary (first 100 characters)
synchronizer.addSyncRule('title', {
  targetEditor: 'summary',
  transform: (content: string) => {
    const text = content.replace(/<[^>]*>/g, '') // Strip HTML
    return text.length > 100 ? `${text.substring(0, 100)}...` : text
  }
})

// Sync content word count to a display element
synchronizer.addSyncRule('content', {
  targetEditor: 'wordCount',
  transform: (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
    return `${words} words`
  }
})
```

## Form Integration

### Multi-Editor Form

```typescript
class ArticleForm {
  private editorManager: EditorManager
  private formData = {
    title: '',
    content: '',
    summary: '',
    tags: []
  }

  constructor() {
    this.editorManager = new EditorManager()
    this.setupEditors()
    this.setupFormHandling()
  }

  private setupEditors(): void {
    // Create editors with form-specific configurations
    this.editorManager.createEditor('title', '#title', {
      toolbar: {
        buttons: ['bold', 'italic']
      },
      placeholder: {
        text: 'Article title...'
      }
    })

    this.editorManager.createEditor('content', '#content', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
      },
      placeholder: {
        text: 'Write your article...'
      }
    })

    this.editorManager.createEditor('summary', '#summary', {
      toolbar: {
        buttons: ['bold', 'italic']
      },
      placeholder: {
        text: 'Brief summary...'
      }
    })
  }

  private setupFormHandling(): void {
    // Listen for changes in all editors
    this.editorManager.getAllEditors().forEach((editor, id) => {
      editor.subscribe('editableInput', () => {
        this.updateFormData(id, editor.getContent())
      })
    })

    // Set up form submission
    const form = document.getElementById('article-form') as HTMLFormElement
    form.addEventListener('submit', this.handleSubmit.bind(this))
  }

  private updateFormData(field: string, content: string): void {
    if (field in this.formData) {
      (this.formData as any)[field] = content
    }

    // Validate form
    this.validateForm()
  }

  private validateForm(): void {
    const isValid = this.formData.title.trim().length > 0
      && this.formData.content.trim().length > 0

    const submitButton = document.getElementById('submit-button') as HTMLButtonElement
    submitButton.disabled = !isValid
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault()

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      })

      if (response.ok) {
        this.showSuccess('Article saved successfully!')
        this.resetForm()
      }
      else {
        this.showError('Failed to save article')
      }
    }
    catch (error) {
      this.showError('Network error occurred')
    }
  }

  private resetForm(): void {
    this.editorManager.getAllEditors().forEach((editor) => {
      editor.setContent('')
    })

    this.formData = {
      title: '',
      content: '',
      summary: '',
      tags: []
    }
  }

  private showSuccess(message: string): void {
    // Show success message
  }

  private showError(message: string): void {
    // Show error message
  }
}

// Initialize form
const articleForm = new ArticleForm()
```

## Performance Optimization

### Lazy Loading Editors

```typescript
class LazyEditorManager {
  private editorConfigs = new Map<string, any>()
  private loadedEditors = new Map<string, MediumEditor>()
  private observers = new Map<string, IntersectionObserver>()

  registerEditor(id: string, selector: string, config: any): void {
    this.editorConfigs.set(id, { selector, config })
    this.setupLazyLoading(id, selector)
  }

  private setupLazyLoading(id: string, selector: string): void {
    const element = document.querySelector(selector)
    if (!element)
      return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.loadedEditors.has(id)) {
          this.loadEditor(id)
          observer.disconnect()
        }
      })
    }, {
      rootMargin: '100px' // Load when element is 100px away from viewport
    })

    observer.observe(element)
    this.observers.set(id, observer)
  }

  private loadEditor(id: string): void {
    const config = this.editorConfigs.get(id)
    if (!config)
      return

    const editor = new MediumEditor(config.selector, config.config)
    this.loadedEditors.set(id, editor)

    console.log(`Editor ${id} loaded lazily`)
  }

  getEditor(id: string): MediumEditor | undefined {
    return this.loadedEditors.get(id)
  }

  forceLoad(id: string): MediumEditor | undefined {
    if (!this.loadedEditors.has(id)) {
      this.loadEditor(id)
    }
    return this.loadedEditors.get(id)
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.loadedEditors.forEach(editor => editor.destroy())
    this.observers.clear()
    this.loadedEditors.clear()
    this.editorConfigs.clear()
  }
}

// Usage
const lazyManager = new LazyEditorManager()

// Register editors that will be loaded when needed
lazyManager.registerEditor('comments', '#comments-editor', {
  toolbar: { buttons: ['bold', 'italic'] }
})

lazyManager.registerEditor('notes', '#notes-editor', {
  toolbar: { buttons: ['bold', 'italic', 'underline'] }
})
```

### Memory Management

```typescript
class MemoryEfficientEditorManager {
  private activeEditors = new Map<string, MediumEditor>()
  private editorPool: MediumEditor[] = []
  private maxPoolSize = 5
  private maxActiveEditors = 3

  getEditor(id: string, selector: string, config: any): MediumEditor {
    // Check if editor is already active
    if (this.activeEditors.has(id)) {
      return this.activeEditors.get(id)!
    }

    // If we have too many active editors, deactivate the oldest
    if (this.activeEditors.size >= this.maxActiveEditors) {
      this.deactivateOldestEditor()
    }

    // Try to reuse an editor from the pool
    let editor = this.editorPool.pop()
    if (editor) {
      this.reconfigureEditor(editor, selector, config)
    }
    else {
      editor = new MediumEditor(selector, config)
    }

    this.activeEditors.set(id, editor)
    return editor
  }

  private deactivateOldestEditor(): void {
    const [oldestId, oldestEditor] = this.activeEditors.entries().next().value

    // Save editor state if needed
    this.saveEditorState(oldestId, oldestEditor)

    // Move to pool if there's space
    if (this.editorPool.length < this.maxPoolSize) {
      this.editorPool.push(oldestEditor)
    }
    else {
      oldestEditor.destroy()
    }

    this.activeEditors.delete(oldestId)
  }

  private reconfigureEditor(editor: MediumEditor, selector: string, config: any): void {
    // Reconfigure existing editor for new use
    // This is a simplified version - actual implementation would be more complex
    editor.setup(selector, config)
  }

  private saveEditorState(id: string, editor: MediumEditor): void {
    // Save editor content and state for later restoration
    const state = {
      content: editor.getContent(),
      selection: editor.exportSelection()
    }
    localStorage.setItem(`editor-state-${id}`, JSON.stringify(state))
  }

  restoreEditorState(id: string, editor: MediumEditor): void {
    const stateJson = localStorage.getItem(`editor-state-${id}`)
    if (stateJson) {
      const state = JSON.parse(stateJson)
      editor.setContent(state.content)
      if (state.selection) {
        editor.importSelection(state.selection)
      }
    }
  }

  destroy(): void {
    this.activeEditors.forEach(editor => editor.destroy())
    this.editorPool.forEach(editor => editor.destroy())
    this.activeEditors.clear()
    this.editorPool.length = 0
  }
}
```

## Testing Multiple Editors

### Test Setup

```typescript
// multiple-editors.test.ts
describe('Multiple Editors', () => {
  let container: HTMLElement
  let editorManager: EditorManager

  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `
      <div id="title" contenteditable="true"></div>
      <div id="content" contenteditable="true"></div>
      <div id="summary" contenteditable="true"></div>
    `
    document.body.appendChild(container)

    editorManager = new EditorManager()
  })

  afterEach(() => {
    editorManager.destroyAll()
    document.body.removeChild(container)
  })

  test('should create multiple independent editors', () => {
    const titleEditor = editorManager.createEditor('title', '#title')
    const contentEditor = editorManager.createEditor('content', '#content')

    expect(titleEditor).toBeDefined()
    expect(contentEditor).toBeDefined()
    expect(titleEditor).not.toBe(contentEditor)
  })

  test('should maintain independent content', () => {
    const titleEditor = editorManager.createEditor('title', '#title')
    const contentEditor = editorManager.createEditor('content', '#content')

    titleEditor.setContent('Title Content')
    contentEditor.setContent('Content Body')

    expect(titleEditor.getContent()).toBe('Title Content')
    expect(contentEditor.getContent()).toBe('Content Body')
  })

  test('should handle cross-editor communication', (done) => {
    const titleEditor = editorManager.createEditor('title', '#title')
    const contentEditor = editorManager.createEditor('content', '#content')

    contentEditor.subscribe('crossEditorChange', (event, data) => {
      expect(data.editorId).toBe('title')
      expect(data.content).toBe('New Title')
      done()
    })

    titleEditor.setContent('New Title')
    // Trigger input event to simulate user input
    const inputEvent = new Event('input')
    titleEditor.elements[0].dispatchEvent(inputEvent)
  })
})
```

## Next Steps

- Explore [Extensions](/extensions) for adding custom functionality
- Check out [Configuration](/config) for detailed setup options
- See [API Reference](/api) for complete multi-editor APIs
- Review [Events](/features/events) for inter-editor communication
