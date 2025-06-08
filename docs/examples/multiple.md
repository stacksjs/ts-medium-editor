# Multiple Editors

Manage multiple editor instances on a single page with different configurations.

## Basic Multiple Editors

Create multiple editors with different purposes:

### Interactive Demo

::: tip Try the Demo
Select text in any editor below to see different toolbar configurations for each editor type.
:::

<div class="demo-container">
  <div class="demo-label">Multiple editors with different configurations:</div>
  <div class="demo-status" id="demo-status-multiple">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-editors-grid">
    <div class="demo-editor-card">
      <h4>Title Editor</h4>
      <div class="demo-title-editor" data-placeholder="Enter your title..." contenteditable="true">
        <h1>Your Article Title</h1>
      </div>
    </div>
    <div class="demo-editor-card">
      <h4>Content Editor</h4>
      <div class="demo-content-editor" data-placeholder="Write your content..." contenteditable="true">
        <p>This is the main content area with full formatting options.</p>
      </div>
    </div>
    <div class="demo-editor-card">
      <h4>Summary Editor</h4>
      <div class="demo-summary-editor" data-placeholder="Brief summary..." contenteditable="true">
        <p>A brief summary with limited formatting.</p>
      </div>
    </div>
  </div>
</div>

### HTML
```html
<div class="editors-container">
  <!-- Title Editor -->
  <div class="editor-section">
    <h3>Title</h3>
    <div class="title-editor" data-placeholder="Enter your title...">
      <h1>Your Article Title</h1>
    </div>
  </div>

  <!-- Content Editor -->
  <div class="editor-section">
    <h3>Content</h3>
    <div class="content-editor" data-placeholder="Write your content...">
      <p>This is the main content area with full formatting options.</p>
    </div>
  </div>

  <!-- Summary Editor -->
  <div class="editor-section">
    <h3>Summary</h3>
    <div class="summary-editor" data-placeholder="Brief summary...">
      <p>A brief summary with limited formatting.</p>
    </div>
  </div>
</div>
```

### TypeScript
```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'

// Title editor - minimal formatting
const titleEditor = new MediumEditor('.title-editor', {
  toolbar: {
    buttons: ['bold', 'italic']
  },
  placeholder: {
    text: 'Enter your title...',
    hideOnClick: true
  },
  disableReturn: true, // Prevent line breaks in titles
  disableDoubleReturn: true
})

// Content editor - full formatting
const contentEditor = new MediumEditor('.content-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist']
  },
  placeholder: {
    text: 'Write your content...',
    hideOnClick: true
  }
})

// Summary editor - limited formatting
const summaryEditor = new MediumEditor('.summary-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  placeholder: {
    text: 'Brief summary...',
    hideOnClick: true
  }
})
```

## Blog Post Editor System

A complete blog post editing interface:

### HTML
```html
<form class="blog-post-form">
  <div class="form-group">
    <label for="post-title">Title</label>
    <div id="post-title" class="post-title-editor" data-placeholder="Enter post title...">
      <h1>How to Use Multiple Editors</h1>
    </div>
  </div>

  <div class="form-group">
    <label for="post-excerpt">Excerpt</label>
    <div id="post-excerpt" class="post-excerpt-editor" data-placeholder="Write a compelling excerpt...">
      <p>Learn how to implement multiple Medium Editor instances with different configurations for various content types.</p>
    </div>
  </div>

  <div class="form-group">
    <label for="post-content">Content</label>
    <div id="post-content" class="post-content-editor" data-placeholder="Write your blog post...">
      <p>Welcome to this comprehensive guide on using multiple editors...</p>
      <h2>Getting Started</h2>
      <p>First, let's understand the basic concepts...</p>
    </div>
  </div>

  <div class="form-group">
    <label for="post-tags">Tags</label>
    <div id="post-tags" class="post-tags-editor" data-placeholder="Add tags (comma separated)...">
      <p>typescript, medium-editor, tutorial, web-development</p>
    </div>
  </div>

  <button type="submit" class="submit-btn">Publish Post</button>
</form>
```

### TypeScript
```typescript
// Initialize all editors
const editors = {
  title: new MediumEditor('#post-title', {
    toolbar: {
      buttons: ['bold', 'italic']
    },
    disableReturn: true,
    disableDoubleReturn: true
  }),

  excerpt: new MediumEditor('#post-excerpt', {
    toolbar: {
      buttons: ['bold', 'italic', 'anchor']
    }
  }),

  content: new MediumEditor('#post-content', {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist']
    },
    anchor: {
      linkValidation: true,
      placeholderText: 'Paste or type a link'
    }
  }),

  tags: new MediumEditor('#post-tags', {
    toolbar: false, // No toolbar for tags
    disableReturn: true,
    disableDoubleReturn: true
  })
}

// Handle form submission
document.querySelector('.blog-post-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const postData = {
    title: document.getElementById('post-title').textContent.trim(),
    excerpt: document.getElementById('post-excerpt').innerHTML,
    content: document.getElementById('post-content').innerHTML,
    tags: document.getElementById('post-tags').textContent.split(',').map(tag => tag.trim())
  }

  console.log('Post data:', postData)
  // Submit to your backend
})
```

## Comment System

Multiple editors for a comment system:

### HTML
```html
<div class="comment-system">
  <div class="new-comment">
    <h4>Add a Comment</h4>
    <div class="comment-editor" data-placeholder="Write your comment...">
      <p>Share your thoughts...</p>
    </div>
    <button class="post-comment-btn">Post Comment</button>
  </div>

  <div class="comments-list">
    <div class="comment">
      <div class="comment-header">
        <strong>John Doe</strong>
        <span class="comment-date">2 hours ago</span>
      </div>
      <div class="comment-content">
        <p>Great article! I especially liked the part about <strong>multiple configurations</strong>.</p>
      </div>
      <div class="comment-actions">
        <button class="reply-btn" data-comment-id="1">Reply</button>
      </div>
      <div class="reply-editor" id="reply-editor-1" style="display: none;" data-placeholder="Write a reply..."></div>
    </div>

    <div class="comment">
      <div class="comment-header">
        <strong>Jane Smith</strong>
        <span class="comment-date">1 hour ago</span>
      </div>
      <div class="comment-content">
        <p>Thanks for sharing! The <em>blog post example</em> is very helpful.</p>
      </div>
      <div class="comment-actions">
        <button class="reply-btn" data-comment-id="2">Reply</button>
      </div>
      <div class="reply-editor" id="reply-editor-2" style="display: none;" data-placeholder="Write a reply..."></div>
    </div>
  </div>
</div>
```

### TypeScript
```typescript
// Main comment editor
const commentEditor = new MediumEditor('.comment-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  placeholder: {
    text: 'Write your comment...',
    hideOnClick: true
  }
})

// Reply editors (created dynamically)
const replyEditors = new Map()

// Handle reply button clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('reply-btn')) {
    const commentId = e.target.getAttribute('data-comment-id')
    const replyEditor = document.getElementById(`reply-editor-${commentId}`)

    if (replyEditor.style.display === 'none') {
      // Show reply editor
      replyEditor.style.display = 'block'

      // Initialize editor if not already done
      if (!replyEditors.has(commentId)) {
        const editor = new MediumEditor(replyEditor, {
          toolbar: {
            buttons: ['bold', 'italic']
          },
          placeholder: {
            text: 'Write a reply...',
            hideOnClick: true
          }
        })
        replyEditors.set(commentId, editor)
      }

      // Focus the editor
      replyEditor.focus()
      e.target.textContent = 'Cancel'
    }
    else {
      // Hide reply editor
      replyEditor.style.display = 'none'
      e.target.textContent = 'Reply'
    }
  }
})

// Handle comment posting
document.querySelector('.post-comment-btn').addEventListener('click', () => {
  const content = document.querySelector('.comment-editor').innerHTML
  console.log('New comment:', content)

  // Clear editor after posting
  document.querySelector('.comment-editor').innerHTML = ''
})
```

## Editor Synchronization

Sync content between multiple editors:

### HTML
```html
<div class="sync-demo">
  <div class="sync-editors">
    <div class="editor-panel">
      <h4>Editor A</h4>
      <div class="sync-editor-a" data-placeholder="Type here...">
        <p>This content will sync to Editor B</p>
      </div>
    </div>

    <div class="editor-panel">
      <h4>Editor B (Read-only sync)</h4>
      <div class="sync-editor-b" data-placeholder="Synced content appears here...">
        <p>This content will sync to Editor B</p>
      </div>
    </div>
  </div>

  <div class="sync-controls">
    <button id="toggle-sync">Toggle Sync</button>
    <button id="clear-all">Clear All</button>
  </div>
</div>
```

### TypeScript
```typescript
let syncEnabled = true

const editorA = new MediumEditor('.sync-editor-a', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  }
})

const editorB = new MediumEditor('.sync-editor-b', {
  toolbar: false, // Read-only display
  disableEditing: true
})

// Sync content from A to B
editorA.subscribe('editableInput', (event, editable) => {
  if (syncEnabled) {
    const syncTarget = document.querySelector('.sync-editor-b')
    syncTarget.innerHTML = editable.innerHTML
  }
})

// Sync controls
document.getElementById('toggle-sync').addEventListener('click', () => {
  syncEnabled = !syncEnabled
  const button = document.getElementById('toggle-sync')
  button.textContent = syncEnabled ? 'Disable Sync' : 'Enable Sync'
  button.style.background = syncEnabled ? '#dc3545' : '#28a745'
})

document.getElementById('clear-all').addEventListener('click', () => {
  document.querySelector('.sync-editor-a').innerHTML = ''
  document.querySelector('.sync-editor-b').innerHTML = ''
})
```

## Performance Optimization

Optimize multiple editors for better performance:

```typescript
class MultipleEditorsManager {
  private editors: Map<string, MediumEditor> = new Map()
  private lazyEditors: Set<string> = new Set()

  // Initialize only visible editors
  initializeVisibleEditors() {
    const visibleEditors = document.querySelectorAll('.editor[data-lazy="false"]')

    visibleEditors.forEach((element, index) => {
      const id = element.id || `editor-${index}`
      this.createEditor(id, element as HTMLElement)
    })
  }

  // Lazy load editors when they come into view
  setupLazyLoading() {
    const lazyEditors = document.querySelectorAll('.editor[data-lazy="true"]')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const id = element.id

          if (!this.editors.has(id)) {
            this.createEditor(id, element)
            observer.unobserve(element)
          }
        }
      })
    })

    lazyEditors.forEach(editor => observer.observe(editor))
  }

  private createEditor(id: string, element: HTMLElement) {
    const config = this.getEditorConfig(element)
    const editor = new MediumEditor(element, config)
    this.editors.set(id, editor)

    console.log(`Editor ${id} initialized`)
  }

  private getEditorConfig(element: HTMLElement): any {
    const type = element.getAttribute('data-editor-type')

    switch (type) {
      case 'title':
        return {
          toolbar: { buttons: ['bold', 'italic'] },
          disableReturn: true
        }
      case 'content':
        return {
          toolbar: { buttons: ['bold', 'italic', 'anchor', 'h2', 'h3'] }
        }
      case 'comment':
        return {
          toolbar: { buttons: ['bold', 'italic'] }
        }
      default:
        return {}
    }
  }

  // Destroy editors to free memory
  destroyEditor(id: string) {
    const editor = this.editors.get(id)
    if (editor) {
      editor.destroy()
      this.editors.delete(id)
    }
  }

  // Get all editor contents
  getAllContent(): Record<string, string> {
    const content: Record<string, string> = {}

    this.editors.forEach((editor, id) => {
      const element = editor.elements[0]
      content[id] = element.innerHTML
    })

    return content
  }
}

// Usage
const manager = new MultipleEditorsManager()
manager.initializeVisibleEditors()
manager.setupLazyLoading()
```

## CSS Styling

Style multiple editors consistently:

```css
.editors-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-section {
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
}

.editor-section h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

/* Title Editor */
.title-editor {
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 60px;
}

.title-editor:focus {
  border-color: #007bff;
  outline: none;
}

/* Content Editor */
.content-editor {
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 200px;
  line-height: 1.6;
}

.content-editor:focus {
  border-color: #28a745;
  outline: none;
}

/* Summary Editor */
.summary-editor {
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 100px;
  background: #f8f9fa;
}

.summary-editor:focus {
  border-color: #ffc107;
  outline: none;
}

/* Comment System */
.comment-system {
  max-width: 600px;
  margin: 2rem auto;
}

.comment {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.comment-date {
  color: #6c757d;
}

.reply-editor {
  margin-top: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.75rem;
  background: #f8f9fa;
}

/* Sync Demo */
.sync-editors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.editor-panel {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
}

.sync-controls {
  text-align: center;
}

.sync-controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sync-editors {
    grid-template-columns: 1fr;
  }
}
```

## Next Steps

- Learn about [Event Handling](/examples/events) for editor communication
- Explore [Extensions](/examples/extensions) for shared functionality
- Check out [Real-World Use Cases](/examples/real-world) for complete applications

<script>
// Initialize demos when the page loads
if (typeof window !== 'undefined') {
  let demoInitialized = false

  function loadMediumEditor() {
    return new Promise((resolve, reject) => {
      if (typeof window.MediumEditor !== 'undefined') {
        resolve()
        return
      }

      // Load CSS first
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      document.head.appendChild(link)

      // Load theme CSS
      const themeLink = document.createElement('link')
      themeLink.rel = 'stylesheet'
      themeLink.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/themes/default.min.css'
      document.head.appendChild(themeLink)

      // Load JavaScript
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = () => {
        console.log('Medium Editor loaded successfully')
        resolve()
      }
      script.onerror = () => {
        console.error('Failed to load Medium Editor')
        reject(new Error('Failed to load Medium Editor'))
      }
      document.head.appendChild(script)
    })
  }

  function updateDemoStatus(demoId, status, message) {
    const statusEl = document.getElementById(`demo-status-${demoId}`)
    if (statusEl) {
      statusEl.innerHTML = `<span class="${status}">${message}</span>`
      if (status === 'success') {
        setTimeout(() => {
          statusEl.style.display = 'none'
        }, 2000)
      }
    }
  }

  function initializeDemos() {
    if (demoInitialized) return
    demoInitialized = true

    console.log('Initializing Multiple Editors demos...')

    try {
      // Title editor demo
      const titleEditor = document.querySelector('.demo-title-editor')
      if (titleEditor) {
        console.log('Initializing title editor demo')
        updateDemoStatus('multiple', 'loading', '🔄 Initializing editors...')

        const editor1 = new MediumEditor(titleEditor, {
          toolbar: {
            buttons: ['bold', 'italic']
          },
          placeholder: {
            text: 'Enter your title...',
            hideOnClick: true
          },
          disableReturn: true,
          disableDoubleReturn: true
        })

        console.log('Title editor initialized:', editor1)
      }

      // Content editor demo
      const contentEditor = document.querySelector('.demo-content-editor')
      if (contentEditor) {
        console.log('Initializing content editor demo')

        const editor2 = new MediumEditor(contentEditor, {
          toolbar: {
            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
          },
          placeholder: {
            text: 'Write your content...',
            hideOnClick: true
          }
        })

        console.log('Content editor initialized:', editor2)
      }

      // Summary editor demo
      const summaryEditor = document.querySelector('.demo-summary-editor')
      if (summaryEditor) {
        console.log('Initializing summary editor demo')

        const editor3 = new MediumEditor(summaryEditor, {
          toolbar: {
            buttons: ['bold', 'italic', 'anchor']
          },
          placeholder: {
            text: 'Brief summary...',
            hideOnClick: true
          }
        })

        updateDemoStatus('multiple', 'success', '✅ All editors ready! Select text to see different toolbars.')
        console.log('Summary editor initialized:', editor3)
      }

      console.log('All multiple editor demos initialized successfully')
    } catch (error) {
      console.error('Error initializing multiple editor demos:', error)
      updateDemoStatus('multiple', 'error', '❌ Demo failed to load')
    }
  }

  // Try multiple initialization strategies
  function attemptInitialization() {
    loadMediumEditor()
      .then(() => {
        // Wait a bit for DOM to be ready
        setTimeout(initializeDemos, 100)
      })
      .catch(error => {
        console.error('Failed to load Medium Editor:', error)
        // Fallback: show message to user
        const containers = document.querySelectorAll('.demo-container')
        containers.forEach(container => {
          const errorMsg = document.createElement('div')
          errorMsg.style.cssText = 'background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;'
          errorMsg.innerHTML = '⚠️ Interactive demo temporarily unavailable. Please refresh the page to try again.'
          container.appendChild(errorMsg)
        })
      })
  }

  // Multiple initialization triggers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInitialization)
  } else {
    attemptInitialization()
  }

  // Also try after a delay in case of timing issues
  setTimeout(attemptInitialization, 1000)

  // VitePress specific initialization
  if (typeof window.__VITEPRESS__ !== 'undefined') {
    // Wait for VitePress to be ready
    setTimeout(attemptInitialization, 2000)
  }
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

.demo-status {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.demo-status .loading {
  color: #0c5460;
  background: #d1ecf1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-status .success {
  color: #155724;
  background: #d4edda;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-status .error {
  color: #721c24;
  background: #f8d7da;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-editors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.demo-editor-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-editor-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.demo-title-editor,
.demo-content-editor,
.demo-summary-editor {
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  cursor: text;
  transition: all 0.3s ease;
}

.demo-title-editor {
  font-size: 1.2rem;
  font-weight: bold;
  border-color: #007bff;
  background: #f8f9ff;
}

.demo-content-editor {
  border-color: #28a745;
  background: #f8fff8;
  min-height: 120px;
}

.demo-summary-editor {
  border-color: #ffc107;
  background: #fffef8;
}

.demo-title-editor:hover,
.demo-content-editor:hover,
.demo-summary-editor:hover {
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.demo-title-editor:focus,
.demo-content-editor:focus,
.demo-summary-editor:focus {
  outline: none;
  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
}

/* Medium Editor theme adjustments for demos */
.demo-container .medium-editor-toolbar {
  background: #343a40;
  border: 1px solid #495057;
}

.demo-container .medium-editor-action {
  color: #fff;
}

.demo-container .medium-editor-action:hover {
  background: #007bff;
}

@media (max-width: 768px) {
  .demo-editors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
