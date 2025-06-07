# Multiple Editors

Learn how to manage multiple Medium Editor instances on a single page, each with different configurations and purposes.

## Shared Editor Instance

One editor instance can manage multiple elements, sharing the same toolbar and configuration:

<div class="interactive-demo">
  <div class="demo-header">
    <div class="demo-title">
      <span class="demo-icon">🔗</span>
      <h4>Shared Editor Instance</h4>
      <span class="demo-badge minimal">ONE TOOLBAR, MULTIPLE ELEMENTS</span>
    </div>
    <div id="shared-demo-status" class="demo-status loading">
      <span class="status-icon">⏳</span>
      Loading interactive demo...
    </div>
  </div>

  <div class="demo-content">
    <div class="demo-editor-group">
      <div class="demo-element-card">
        <div class="demo-element-label">
          <span class="demo-element-icon">📝</span>
          <span>Title Element</span>
        </div>
        <div class="demo-title-element demo-editable" data-placeholder="Document Title" contenteditable="true">
          <h1>Document Title</h1>
        </div>
      </div>

      <div class="demo-element-card">
        <div class="demo-element-label">
          <span class="demo-element-icon">📄</span>
          <span>Content Element</span>
        </div>
        <div class="demo-content-element demo-editable" data-placeholder="Write your content here..." contenteditable="true">
          <p>This is the document content. Both elements share the same toolbar configuration.</p>
          <p>Select text in either element to see the <strong>shared toolbar</strong> in action.</p>
        </div>
      </div>
    </div>

    <div class="demo-shared-footer">
      <small>💡 Both editors share the same toolbar configuration and Medium Editor instance.</small>
    </div>
  </div>
</div>

## Different Editor Configurations

Multiple independent editors with unique configurations:

<div class="interactive-demo">
  <div class="demo-header">
    <div class="demo-title">
      <span class="demo-icon">⚙️</span>
      <h4>Different Editor Configurations</h4>
      <span class="demo-badge none">UNIQUE CONFIGURATIONS</span>
    </div>
    <div id="different-demo-status" class="demo-status loading">
      <span class="status-icon">⏳</span>
      Loading interactive demo...
    </div>
  </div>

  <div class="demo-content">
    <div class="demo-editors-grid">
      <div class="demo-editor-card comment-card">
        <div class="demo-card-header">
          <span class="demo-card-icon">💬</span>
          <h4>Comment Editor</h4>
          <span class="demo-card-badge minimal">Minimal</span>
        </div>
        <div class="demo-comment-editor demo-editable" data-placeholder="Write a comment..." contenteditable="true">
          <p>This editor has <em>minimal formatting</em> options, perfect for comments.</p>
        </div>
        <div class="demo-card-footer">
          <small>❤️ Bold, Italic & Links Only</small>
        </div>
      </div>

      <div class="demo-editor-card title-card">
        <div class="demo-card-header">
          <span class="demo-card-icon">📰</span>
          <h4>Title Editor</h4>
          <span class="demo-card-badge none">No Toolbar</span>
        </div>
        <div class="demo-title-only-editor demo-editable" data-placeholder="Enter title..." contenteditable="true">
          <h2>This editor is for titles only</h2>
        </div>
        <div class="demo-card-footer">
          <small>🚫 No Toolbar – Single Line Only</small>
        </div>
      </div>

      <div class="demo-editor-card full-card">
        <div class="demo-card-header">
          <span class="demo-card-icon">📝</span>
          <h4>Full Editor</h4>
          <span class="demo-card-badge full">Complete</span>
        </div>
        <div class="demo-full-editor demo-editable" data-placeholder="Write your article..." contenteditable="true">
          <p>This editor has <strong>all formatting options</strong> available for rich content creation.</p>
          <p>Perfect for <em>articles</em>, <u>blog posts</u>, and comprehensive content.</p>
        </div>
        <div class="demo-card-footer">
          <small>✨ Full Toolbar – All Features Available</small>
        </div>
      </div>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  await initializeMultipleEditorsDemo()
})

async function initializeMultipleEditorsDemo() {
  try {
    // Update status
    updateStatus('shared-demo-status', 'loading', '⏳', 'Loading resources...')
    updateStatus('different-demo-status', 'loading', '⏳', 'Loading resources...')

    // Load FontAwesome
    await loadFontAwesome()

    // Load MediumEditor
    await loadMediumEditor()

    // Initialize shared editor
    updateStatus('shared-demo-status', 'loading', '⏳', 'Initializing shared editor...')
    const sharedEditor = new window.MediumEditor(['.demo-title-element', '.demo-content-element'], {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor']
      },
      placeholder: {
        text: 'Start writing...'
      }
    })

    // Initialize different editors
    updateStatus('different-demo-status', 'loading', '⏳', 'Initializing different editors...')

    const commentEditor = new window.MediumEditor('.demo-comment-editor', {
      toolbar: {
        buttons: ['bold', 'italic', 'anchor']
      },
      placeholder: {
        text: 'Write a comment...'
      }
    })

    const titleEditor = new window.MediumEditor('.demo-title-only-editor', {
      toolbar: false,
      placeholder: {
        text: 'Enter title...'
      },
      disableReturn: true,
      disableDoubleReturn: true
    })

    const fullEditor = new window.MediumEditor('.demo-full-editor', {
      toolbar: {
        buttons: [
          'bold', 'italic', 'underline', 'strikethrough',
          'subscript', 'superscript', 'anchor', 'image',
          'quote', 'pre', 'orderedlist', 'unorderedlist',
          'indent', 'outdent', 'justifyLeft', 'justifyCenter',
          'justifyRight', 'justifyFull', 'h1', 'h2', 'h3',
          'h4', 'h5', 'h6'
        ]
      }
    })

    // Success status
    updateStatus('shared-demo-status', 'success', '✅', 'Demo ready')
    updateStatus('different-demo-status', 'success', '✅', 'Demo ready')

  } catch (error) {
    console.error('Demo initialization failed:', error)
    updateStatus('shared-demo-status', 'error', '❌', 'Demo failed to load')
    updateStatus('different-demo-status', 'error', '❌', 'Demo failed to load')
  }
}

function updateStatus(elementId, className, icon, text) {
  const element = document.getElementById(elementId)
  if (element) {
    element.className = `demo-status ${className}`
    element.innerHTML = `<span class="status-icon">${icon}</span>${text}`
  }
}

function loadFontAwesome() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('link[href*="font-awesome"]')) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.onload = resolve
    link.onerror = () => {
      // Try alternative CDN
      const altLink = document.createElement('link')
      altLink.rel = 'stylesheet'
      altLink.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
      altLink.onload = resolve
      altLink.onerror = reject
      document.head.appendChild(altLink)
    }
    document.head.appendChild(link)
  })
}

function loadMediumEditor() {
  return new Promise((resolve, reject) => {
    if (window.MediumEditor) {
      resolve()
      return
    }

    // Load CSS
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
    document.head.appendChild(css)

    const themeCss = document.createElement('link')
    themeCss.rel = 'stylesheet'
    themeCss.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/themes/default.min.css'
    document.head.appendChild(themeCss)

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
</script>

<style>
.interactive-demo {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.demo-title h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1em;
  font-weight: 600;
}

.demo-icon {
  font-size: 1.2em;
}

.demo-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-badge.minimal {
  background: #dbeafe;
  color: #1e40af;
}

.demo-badge.none {
  background: #fee2e2;
  color: #dc2626;
}

.demo-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 500;
}

.demo-status.loading {
  background: #fef3c7;
  color: #92400e;
}

.demo-status.success {
  background: #d1fae5;
  color: #065f46;
}

.demo-status.error {
  background: #fee2e2;
  color: #dc2626;
}

.demo-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

/* Shared Editor Styles */
.demo-editor-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-element-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
}

.demo-element-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9em;
}

.demo-element-icon {
  font-size: 1.1em;
}

.demo-title-element, .demo-content-element {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 16px;
  min-height: 60px;
  transition: border-color 0.2s;
}

.demo-title-element:focus, .demo-content-element:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.demo-title-element h1 {
  margin: 0;
  font-size: 1.5em;
  color: #1f2937;
}

.demo-content-element p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: #374151;
}

.demo-content-element p:last-child {
  margin-bottom: 0;
}

.demo-shared-footer {
  margin-top: 16px;
  padding: 12px;
  background: #eff6ff;
  border-radius: 6px;
  text-align: center;
  color: #1e40af;
}

/* Different Editors Styles */
.demo-editors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 20px 0;
}

.demo-editor-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.demo-editor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comment-card {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
}

.title-card {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.full-card {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.demo-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.demo-card-header h4 {
  margin: 0;
  flex: 1;
  color: #1f2937;
  font-size: 1.1em;
}

.demo-card-icon {
  font-size: 1.3em;
}

.demo-card-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-card-badge.minimal {
  background: #d1fae5;
  color: #065f46;
}

.demo-card-badge.none {
  background: #fed7aa;
  color: #9a3412;
}

.demo-card-badge.full {
  background: #dbeafe;
  color: #1e40af;
}

.demo-comment-editor, .demo-title-only-editor, .demo-full-editor {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 16px;
  min-height: 80px;
  transition: border-color 0.2s;
  margin-bottom: 12px;
}

.demo-comment-editor:focus, .demo-title-only-editor:focus, .demo-full-editor:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.demo-title-only-editor {
  min-height: 60px;
}

.demo-title-only-editor h2 {
  margin: 0;
  font-size: 1.3em;
  color: #1f2937;
}

.demo-comment-editor p, .demo-full-editor p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: #374151;
}

.demo-comment-editor p:last-child, .demo-full-editor p:last-child {
  margin-bottom: 0;
}

.demo-card-footer {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  text-align: center;
  font-size: 0.85em;
  color: #6b7280;
}

/* Dark mode support */
.dark .interactive-demo {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #374151;
}

.dark .demo-title h4 {
  color: #f1f5f9;
}

.dark .demo-content {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .demo-element-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .demo-editor-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .demo-title-element, .dark .demo-content-element,
.dark .demo-comment-editor, .dark .demo-title-only-editor, .dark .demo-full-editor {
  background: #1f2937;
  border-color: #4b5563;
  color: #f9fafb;
}

/* Responsive design */
@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .interactive-demo {
    padding: 16px;
  }

  .demo-editors-grid {
    grid-template-columns: 1fr;
  }

  .demo-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

## Code Examples

### Basic Multiple Elements Setup

```typescript{4}
import { MediumEditor } from 'ts-medium-editor'

// Single editor managing multiple elements
const sharedEditor = new MediumEditor(['.title', '.content'], {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor']
  },
  placeholder: {
    text: 'Start writing...'
  }
})
```

### Different Editor Configurations

```typescript{1,8,15}
// Comment editor - minimal toolbar
const commentEditor = new MediumEditor('.comment-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  placeholder: {
    text: 'Write a comment...'
  }
})

// Title editor - no toolbar
const titleEditor = new MediumEditor('.title-editor', {
  toolbar: false,
  placeholder: {
    text: 'Enter title...'
  }
})

// Full editor - all options
const fullEditor = new MediumEditor('.full-editor', {
  toolbar: {
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough',
      'subscript', 'superscript', 'anchor', 'image',
      'quote', 'pre', 'orderedlist', 'unorderedlist',
      'indent', 'outdent', 'justifyLeft', 'justifyCenter',
      'justifyRight', 'justifyFull', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6'
    ]
  }
})
```

## Real-World Applications

### Blog Post Editor System

```typescript{5,12,19}
class BlogPostEditor {
  private titleEditor: MediumEditor
  private contentEditor: MediumEditor
  private excerptEditor: MediumEditor

  constructor() {
    this.initializeEditors()
    this.setupEventHandlers()
  }

  private initializeEditors() {
    // Title editor - single line, no toolbar
    this.titleEditor = new MediumEditor('.post-title', {
      toolbar: false,
      placeholder: { text: 'Enter post title...' },
      disableReturn: true,
      disableDoubleReturn: true
    })

    // Excerpt editor - basic formatting
    this.excerptEditor = new MediumEditor('.post-excerpt', {
      toolbar: {
        buttons: ['bold', 'italic']
      },
      placeholder: { text: 'Write a brief excerpt...' }
    })

    // Content editor - full features
    this.contentEditor = new MediumEditor('.post-content', {
      toolbar: {
        buttons: [
          'bold', 'italic', 'underline', 'anchor',
          'h2', 'h3', 'quote', 'unorderedlist',
          'orderedlist'
        ]
      },
      placeholder: { text: 'Write your post content...' }
    })
  }

  private setupEventHandlers() {
    // Auto-save functionality
    [this.titleEditor, this.excerptEditor, this.contentEditor].forEach(editor => {
      editor.subscribe('editableInput', () => {
        this.autoSave()
      })
    })
  }

  private autoSave() {
    const postData = {
      title: this.titleEditor.getContent(),
      excerpt: this.excerptEditor.getContent(),
      content: this.contentEditor.getContent(),
      lastModified: new Date().toISOString()
    }

    localStorage.setItem('blog-post-draft', JSON.stringify(postData))
    console.log('Post auto-saved')
  }

  public getPostData() {
    return {
      title: this.titleEditor.getContent(),
      excerpt: this.excerptEditor.getContent(),
      content: this.contentEditor.getContent()
    }
  }
}

// Initialize the blog post editor
const blogEditor = new BlogPostEditor()
```

### Form Integration

```html{4,9}
<form id="article-form">
  <div class="form-group">
    <label for="article-title">Title</label>
    <div class="title-editor" data-name="title"></div>
  </div>

  <div class="form-group">
    <label for="article-content">Content</label>
    <div class="content-editor" data-name="content"></div>
  </div>

  <button type="submit">Save Article</button>
</form>
```

```typescript{2,7}
// Form handling with multiple editors
const formEditors = {
  title: new MediumEditor('.title-editor', {
    toolbar: false,
    disableReturn: true
  }),
  content: new MediumEditor('.content-editor', {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3']
    }
  })
}

document.getElementById('article-form')?.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = {
    title: formEditors.title.getContent(),
    content: formEditors.content.getContent()
  }

  console.log('Form submitted:', formData)
  // Send to server...
})
```

## Conditional Editors

```typescript{4,18,35}
class ConditionalEditorManager {
  private editors: Map<string, MediumEditor> = new Map()

  createEditor(elementId: string, type: 'basic' | 'advanced' | 'minimal') {
    const element = document.getElementById(elementId)
    if (!element) return

    const configs = {
      basic: {
        toolbar: { buttons: ['bold', 'italic', 'anchor'] }
      },
      advanced: {
        toolbar: {
          buttons: [
            'bold', 'italic', 'underline', 'anchor',
            'h1', 'h2', 'h3', 'quote', 'unorderedlist'
          ]
        }
      },
      minimal: {
        toolbar: { buttons: ['bold', 'italic'] }
      }
    }

    const editor = new MediumEditor(element, configs[type])
    this.editors.set(elementId, editor)

    return editor
  }

  destroyEditor(elementId: string) {
    const editor = this.editors.get(elementId)
    if (editor) {
      editor.destroy()
      this.editors.delete(elementId)
    }
  }

  switchEditorType(elementId: string, newType: 'basic' | 'advanced' | 'minimal') {
    const content = this.editors.get(elementId)?.getContent()
    this.destroyEditor(elementId)

    const newEditor = this.createEditor(elementId, newType)
    if (newEditor && content) {
      newEditor.setContent(content)
    }
  }
}

// Usage
const manager = new ConditionalEditorManager()

// Create different editors based on user role
const userRole = 'admin' // or 'user', 'guest'
const editorType = userRole === 'admin' ? 'advanced' : 'basic'

manager.createEditor('main-editor', editorType)
```

## Cross-Editor Communication

```typescript{4,8,21}
class EditorCommunicationHub {
  private editors: MediumEditor[] = []
  private eventBus = new EventTarget()

  addEditor(editor: MediumEditor, name: string) {
    this.editors.push(editor)

    editor.subscribe('editableInput', () => {
      this.eventBus.dispatchEvent(new CustomEvent('editorChanged', {
        detail: { name, content: editor.getContent() }
      }))
    })
  }

  onEditorChange(callback: (data: { name: string, content: string }) => void) {
    this.eventBus.addEventListener('editorChanged', (e: any) => {
      callback(e.detail)
    })
  }

  syncContent(fromEditor: string, toEditor: string) {
    // Implementation for syncing content between editors
  }
}

// Usage
const hub = new EditorCommunicationHub()

const titleEditor = new MediumEditor('.title')
const summaryEditor = new MediumEditor('.summary')

hub.addEditor(titleEditor, 'title')
hub.addEditor(summaryEditor, 'summary')

hub.onEditorChange(({ name, content }) => {
  console.log(`${name} editor changed:`, content)
  // Update word count, save draft, etc.
})
```

## Next Steps

- Learn about [Event Handling](/examples/events) for editor interactions
- Explore [Extensions](/examples/extensions) for custom functionality
- Check out [Real-World Use Cases](/examples/real-world) for complete implementations