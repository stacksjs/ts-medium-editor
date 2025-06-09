# Real-World Use Cases

Complete implementations for common real-world scenarios with fully functional interactive demos.

## Blog Platform

A complete blog editing interface with multiple editors and features.

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Complete Blog Platform - Full-featured blog editor with auto-save, stats, and publishing:</div>
  <div class="blog-platform">
    <header class="blog-header">
      <h1>Blog Editor</h1>
      <div class="blog-actions">
        <button id="demo-save-draft">Save Draft</button>
        <button id="demo-publish-post">Publish</button>
      </div>
    </header>
    <main class="blog-content">
      <div class="blog-title-section">
        <div class="demo-blog-title" contenteditable="true" data-placeholder="Enter your blog title...">
          <h1>How to Build Amazing Web Applications</h1>
        </div>
      </div>
      <div class="blog-meta">
        <input type="text" id="demo-blog-tags" placeholder="Add tags (comma-separated)" value="javascript, web-development, tutorial">
        <select id="demo-blog-category">
          <option value="">Select category</option>
          <option value="tech" selected>Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
      </div>
      <div class="demo-blog-body" contenteditable="true" data-placeholder="Start writing your blog post...">
        <p>Creating engaging web applications requires the right tools and techniques. In this comprehensive guide, we'll explore modern development practices that will help you build better applications.</p>
        <blockquote>
          "The best way to predict the future is to create it." - Peter Drucker
        </blockquote>
        <p>Let's dive into the essential concepts and practical examples that will elevate your development skills.</p>
      </div>
    </main>
    <aside class="blog-sidebar">
      <div class="stats-panel">
        <div class="stat">
          <span class="stat-value" id="demo-word-count">0</span>
          <span class="stat-label">Words</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="demo-read-time">0</span>
          <span class="stat-label">Min read</span>
        </div>
      </div>
      <div class="save-status">
        <span id="demo-save-indicator">Ready</span>
      </div>
    </aside>
  </div>
</div>

### HTML
```html
<div class="blog-platform">
  <header class="blog-header">
    <h1>Blog Editor</h1>
    <div class="blog-actions">
      <button id="save-draft">Save Draft</button>
      <button id="publish-post">Publish</button>
    </div>
  </header>

  <main class="blog-content">
    <div class="blog-title-section">
      <div class="blog-title" data-placeholder="Enter your blog title...">
        <h1>How to Build Amazing Web Applications</h1>
      </div>
    </div>

    <div class="blog-meta">
      <input type="text" id="blog-tags" placeholder="Add tags (comma-separated)">
      <select id="blog-category">
        <option value="">Select category</option>
        <option value="tech">Technology</option>
        <option value="design">Design</option>
        <option value="business">Business</option>
      </select>
    </div>

    <div class="blog-body" data-placeholder="Start writing your blog post...">
      <p>Creating engaging web applications requires the right tools and techniques...</p>
      <blockquote>
        "The best way to predict the future is to create it." - Peter Drucker
      </blockquote>
      <p>In this article, we'll explore modern development practices.</p>
    </div>
  </main>

  <aside class="blog-sidebar">
    <div class="stats-panel">
      <div class="stat">
        <span class="stat-value" id="word-count">0</span>
        <span class="stat-label">Words</span>
      </div>
      <div class="stat">
        <span class="stat-value" id="read-time">0</span>
        <span class="stat-label">Min read</span>
      </div>
    </div>

    <div class="save-status">
      <span id="save-indicator">Ready</span>
    </div>
  </aside>
</div>
```

### TypeScript
```typescript
class BlogPlatform {
  constructor() {
    this.initializeEditors()
    this.setupAutoSave()
    this.setupEventListeners()
    this.loadDraft()
  }

  initializeEditors() {
    // Title editor
    this.titleEditor = new MediumEditor('.blog-title', {
      toolbar: false,
      disableReturn: true,
      placeholder: { text: 'Enter your blog title...' }
    })

    // Main content editor
    this.contentEditor = new MediumEditor('.blog-body', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist']
      },
      buttonLabels: 'fontawesome',
      placeholder: { text: 'Start writing your blog post...' },
      autoLink: true
    })

    // Setup real-time stats
    this.contentEditor.subscribe('editableInput', () => {
      this.updateStats()
      this.scheduleAutoSave()
    })

    this.titleEditor.subscribe('editableInput', () => {
      this.scheduleAutoSave()
    })
  }

  updateStats() {
    const content = document.querySelector('.blog-body').textContent.trim()
    const words = content ? content.split(/\s+/).length : 0
    const readTime = Math.ceil(words / 200)

    document.getElementById('word-count').textContent = words
    document.getElementById('read-time').textContent = readTime
  }

  setupAutoSave() {
    this.autoSaveTimeout = null
  }

  scheduleAutoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }

    this.updateSaveStatus('typing')

    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft()
    }, 2000)
  }

  saveDraft() {
    const draft = this.getBlogData()
    localStorage.setItem('blog-draft', JSON.stringify(draft))
    this.updateSaveStatus('saved')
  }

  getBlogData() {
    return {
      title: document.querySelector('.blog-title').textContent.trim(),
      content: document.querySelector('.blog-body').innerHTML,
      tags: document.getElementById('blog-tags').value,
      category: document.getElementById('blog-category').value,
      lastModified: new Date().toISOString()
    }
  }

  loadDraft() {
    const draft = localStorage.getItem('blog-draft')
    if (draft) {
      const data = JSON.parse(draft)
      document.querySelector('.blog-title').innerHTML = `<h1>${data.title}</h1>`
      document.querySelector('.blog-body').innerHTML = data.content
      document.getElementById('blog-tags').value = data.tags || ''
      document.getElementById('blog-category').value = data.category || ''
      this.updateStats()
      this.updateSaveStatus('loaded')
    }
  }

  updateSaveStatus(status) {
    const indicator = document.getElementById('save-indicator')
    const statusMap = {
      typing: { text: 'Typing...', class: 'typing' },
      saved: { text: 'Saved', class: 'saved' },
      loaded: { text: 'Draft loaded', class: 'loaded' },
      publishing: { text: 'Publishing...', class: 'publishing' }
    }

    const statusInfo = statusMap[status] || { text: 'Ready', class: '' }
    indicator.textContent = statusInfo.text
    indicator.className = statusInfo.class
  }

  setupEventListeners() {
    document.getElementById('save-draft').addEventListener('click', () => {
      this.saveDraft()
    })

    document.getElementById('publish-post').addEventListener('click', () => {
      this.publishPost()
    })

    document.getElementById('blog-tags').addEventListener('input', () => {
      this.scheduleAutoSave()
    })

    document.getElementById('blog-category').addEventListener('change', () => {
      this.scheduleAutoSave()
    })
  }

  async publishPost() {
    this.updateSaveStatus('publishing')

    const blogData = this.getBlogData()

    try {
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      })

      if (response.ok) {
        localStorage.removeItem('blog-draft')
        alert('Blog post published successfully!')
      }
      else {
        throw new Error('Failed to publish')
      }
    }
    catch (error) {
      alert('Failed to publish blog post. Please try again.')
      this.updateSaveStatus('saved')
    }
  }
}

// Initialize the blog platform
const blogPlatform = new BlogPlatform()
```

## Documentation System

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Documentation System - Auto-generating table of contents with code highlighting:</div>
  <div class="docs-system">
    <nav class="docs-nav">
      <h2>Documentation</h2>
      <div class="toc">
        <h3>Table of Contents</h3>
        <ul id="demo-toc-list"></ul>
      </div>
    </nav>
    <main class="docs-content">
      <div class="demo-docs-editor" contenteditable="true" data-placeholder="Write documentation...">
        <h1>Getting Started</h1>
        <p>Welcome to our documentation system. This editor supports advanced features for technical writing:</p>
        <h2>Installation</h2>
        <p>Install the library using your preferred package manager:</p>
        <pre><code>npm install ts-medium-editor
yarn add ts-medium-editor</code></pre>
        <h2>Basic Usage</h2>
        <p>Import and initialize the editor:</p>
        <pre><code>import { MediumEditor } from 'ts-medium-editor'
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})</code></pre>
        <h3>Configuration Options</h3>
        <p>The editor supports various configuration options:</p>
        <ul>
          <li>Toolbar customization</li>
          <li>Extension system</li>
          <li>Event handling</li>
          <li>Paste cleaning</li>
        </ul>
      </div>
    </main>
  </div>
</div>

### HTML
```html
<div class="docs-system">
  <nav class="docs-nav">
    <h2>Documentation</h2>
    <ul class="nav-list">
      <li><a href="#getting-started">Getting Started</a></li>
      <li><a href="#api-reference">API Reference</a></li>
      <li><a href="#examples">Examples</a></li>
    </ul>
  </nav>

  <main class="docs-content">
    <div class="docs-editor" data-placeholder="Write documentation...">
      <h1>Getting Started</h1>
      <p>Welcome to our documentation system. This editor supports:</p>
      <ul>
        <li>Code blocks with syntax highlighting</li>
        <li>Tables for structured data</li>
        <li>Links and cross-references</li>
      </ul>
      <pre><code>npm install awesome-library</code></pre>
    </div>
  </main>

  <aside class="docs-sidebar">
    <div class="toc">
      <h3>Table of Contents</h3>
      <ul id="toc-list"></ul>
    </div>
  </aside>
</div>
```

### TypeScript
```typescript
class DocumentationSystem {
  constructor() {
    this.initializeEditor()
    this.setupTableOfContents()
    this.setupCodeHighlighting()
  }

  initializeEditor() {
    this.editor = new MediumEditor('.docs-editor', {
      toolbar: {
        buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote', 'pre', 'unorderedlist', 'orderedlist']
      },
      buttonLabels: 'fontawesome'
    })

    this.editor.subscribe('editableInput', () => {
      this.updateTableOfContents()
      this.highlightCode()
    })
  }

  setupTableOfContents() {
    this.updateTableOfContents()
  }

  updateTableOfContents() {
    const headings = document.querySelectorAll('.docs-editor h1, .docs-editor h2, .docs-editor h3')
    const tocList = document.getElementById('toc-list')

    tocList.innerHTML = ''

    headings.forEach((heading, index) => {
      const id = `heading-${index}`
      heading.id = id

      const li = document.createElement('li')
      li.className = `toc-${heading.tagName.toLowerCase()}`

      const link = document.createElement('a')
      link.href = `#${id}`
      link.textContent = heading.textContent

      li.appendChild(link)
      tocList.appendChild(li)
    })
  }

  setupCodeHighlighting() {
    this.highlightCode()
  }

  highlightCode() {
    const codeBlocks = document.querySelectorAll('.docs-editor pre')
    codeBlocks.forEach((block) => {
      block.classList.add('language-javascript')
      // Add syntax highlighting here if using a library like Prism.js
    })
  }
}

const docsSystem = new DocumentationSystem()
```

## Comment System

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Comment System - Real-time commenting with rich text support:</div>
  <div class="comment-system">
    <div class="comments-list" id="demo-comments-list">
      <div class="comment">
        <div class="comment-avatar">👤</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">John Doe</span>
            <span class="comment-time">2 hours ago</span>
          </div>
          <div class="comment-body">
            This is a <strong>great article</strong>! Thanks for sharing your insights on modern web development.
          </div>
          <div class="comment-actions">
            <button class="reply-btn" data-comment-id="1">Reply</button>
            <button class="like-btn" data-comment-id="1">👍 3</button>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar">👩</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">Sarah Wilson</span>
            <span class="comment-time">1 hour ago</span>
          </div>
          <div class="comment-body">
            I particularly enjoyed the section on <em>TypeScript integration</em>. Very well explained!
          </div>
          <div class="comment-actions">
            <button class="reply-btn" data-comment-id="2">Reply</button>
            <button class="like-btn" data-comment-id="2">👍 1</button>
          </div>
        </div>
      </div>
    </div>
    <form class="comment-form" id="demo-comment-form">
      <div class="form-header">
        <h3>Leave a Comment</h3>
      </div>
      <div class="form-body">
        <div class="demo-comment-editor" contenteditable="true" data-placeholder="Write your comment...">
          <p>Share your thoughts on this article...</p>
        </div>
      </div>
      <div class="form-footer">
        <input type="text" id="demo-author-name" placeholder="Your name" required>
        <input type="email" id="demo-author-email" placeholder="Your email (optional)">
        <button type="submit">Post Comment</button>
      </div>
    </form>
  </div>
</div>

### HTML
```html
<div class="comment-system">
  <div class="comments-list" id="comments-list">
    <div class="comment">
      <div class="comment-avatar">👤</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">John Doe</span>
          <span class="comment-time">2 hours ago</span>
        </div>
        <div class="comment-body">
          This is a great article! Thanks for sharing your insights.
        </div>
        <div class="comment-actions">
          <button class="reply-btn" data-comment-id="1">Reply</button>
        </div>
      </div>
    </div>
  </div>

  <form class="comment-form" id="comment-form">
    <div class="form-header">
      <h3>Leave a Comment</h3>
    </div>

    <div class="form-body">
      <div class="comment-editor" data-placeholder="Write your comment...">
        <p>Share your thoughts...</p>
      </div>
    </div>

    <div class="form-footer">
      <input type="text" id="author-name" placeholder="Your name" required>
      <button type="submit">Post Comment</button>
    </div>
  </form>
</div>
```

### TypeScript
```typescript
class CommentSystem {
  constructor() {
    this.initializeEditor()
    this.setupEventListeners()
    this.comments = this.loadComments()
  }

  initializeEditor() {
    this.commentEditor = new MediumEditor('.comment-editor', {
      toolbar: {
        buttons: ['bold', 'italic', 'anchor']
      },
      placeholder: { text: 'Write your comment...' },
      disableDoubleReturn: true,
      paste: { forcePlainText: true }
    })
  }

  setupEventListeners() {
    document.getElementById('comment-form').addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitComment()
    })

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('reply-btn')) {
        this.showReplyForm(e.target.dataset.commentId)
      }
    })
  }

  submitComment() {
    const content = document.querySelector('.comment-editor').innerHTML
    const author = document.getElementById('author-name').value

    if (!content.trim() || !author.trim()) {
      alert('Please fill in all fields')
      return
    }

    const comment = {
      id: Date.now(),
      author,
      content,
      timestamp: new Date(),
      replies: []
    }

    this.addComment(comment)
    this.clearForm()
  }

  addComment(comment) {
    this.comments.push(comment)
    this.saveComments()
    this.renderComments()
  }

  renderComments() {
    const commentsList = document.getElementById('comments-list')
    commentsList.innerHTML = this.comments.map(comment =>
      this.renderComment(comment)
    ).join('')
  }

  renderComment(comment) {
    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-avatar">👤</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
          </div>
          <div class="comment-body">${comment.content}</div>
          <div class="comment-actions">
            <button class="reply-btn" data-comment-id="${comment.id}">Reply</button>
          </div>
        </div>
      </div>
    `
  }

  formatTime(timestamp) {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1)
      return 'Just now'
    if (hours < 24)
      return `${hours} hours ago`
    return new Date(timestamp).toLocaleDateString()
  }

  clearForm() {
    document.querySelector('.comment-editor').innerHTML = '<p>Share your thoughts...</p>'
    document.getElementById('author-name').value = ''
  }

  loadComments() {
    const saved = localStorage.getItem('comments')
    return saved ? JSON.parse(saved) : []
  }

  saveComments() {
    localStorage.setItem('comments', JSON.stringify(this.comments))
  }
}

const commentSystem = new CommentSystem()
```

### CSS
```css
.blog-platform {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.blog-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border: 2px dashed transparent;
  padding: 0.5rem;
  border-radius: 8px;
}

.blog-title:focus {
  border-color: #007bff;
  outline: none;
}

.blog-body {
  min-height: 400px;
  border: 2px dashed transparent;
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.6;
}

.blog-body:focus {
  border-color: #007bff;
  outline: none;
}

.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
}

.save-status {
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  font-size: 0.875rem;
}

.save-status.saved {
  background: #d4edda;
  color: #155724;
}

.save-status.typing {
  background: #fff3cd;
  color: #856404;
}
```

## Next Steps

- Explore the [API Reference](/api) for advanced customization
- Check out [Extensions](/examples/extensions) for adding custom functionality
- Learn about [Event Handling](/examples/events) for building interactive features

<script>
// Comprehensive demo implementation for real-world use cases
class DemoMediumEditor {
  constructor(selector, options = {}) {
    this.elements = typeof selector === 'string'
      ? Array.from(document.querySelectorAll(selector))
      : [selector]
    this.options = options
    this.listeners = new Map()

    console.log('DemoMediumEditor created with selector:', selector, 'found elements:', this.elements.length, this.elements)

    this.init()
  }

  init() {
    this.elements.forEach(element => {
      if (!element.hasAttribute('contenteditable')) {
        element.contentEditable = 'true'
      }
      element.classList.add('medium-editor-element')

      // Ensure the element is focusable and editable
      element.style.outline = 'none'
      element.style.userSelect = 'text'
      element.style.webkitUserSelect = 'text'
      element.style.mozUserSelect = 'text'
      element.style.msUserSelect = 'text'

      // Add visual feedback when focused
      element.addEventListener('focus', () => {
        element.style.borderColor = '#007bff'
      })

      element.addEventListener('blur', () => {
        element.style.borderColor = 'transparent'
      })

      element.addEventListener('input', (e) => {
        console.log('Input event triggered on:', element)
        this.trigger('editableInput', e, element)
      })

      element.addEventListener('click', (e) => {
        console.log('Click event on editor element:', element)
        element.focus()
      })

      if (!this.options.disableToolbar) {
        this.addToolbar(element)
      }

      // Debug log
      console.log('Initialized editor element:', element, 'contenteditable:', element.contentEditable)
    })
  }

  addToolbar(element) {
    let toolbar = null
    const toolbarId = 'toolbar-' + Math.random().toString(36).substr(2, 9)

    const showToolbar = () => {
      if (toolbar) {
        console.log('Toolbar already exists, skipping creation')
        return
      }

      console.log('Creating new toolbar with ID:', toolbarId)
      toolbar = document.createElement('div')
      toolbar.className = 'demo-toolbar'
      toolbar.id = toolbarId
      toolbar.innerHTML = `
        <button type="button" data-action="bold" title="Bold"><b>B</b></button>
        <button type="button" data-action="italic" title="Italic"><i>I</i></button>
        <button type="button" data-action="underline" title="Underline"><u>U</u></button>
        ${this.options.allowHeadings ? '<button type="button" data-action="h2" title="Heading">H2</button>' : ''}
        ${this.options.allowQuotes ? '<button type="button" data-action="blockquote" title="Quote">❝</button>' : ''}
        ${this.options.allowLinks ? '<button type="button" data-action="createLink" title="Link">🔗</button>' : ''}
      `

      toolbar.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px;
        border-radius: 6px;
        z-index: 9999;
        display: flex;
        gap: 4px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        border: 1px solid #555;
        visibility: hidden;
        pointer-events: auto;
      `

      toolbar.querySelectorAll('button').forEach(btn => {
        btn.style.cssText = `
          background: transparent;
          border: 1px solid #555;
          color: white;
          padding: 6px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
        `

        btn.addEventListener('mousedown', (e) => {
          e.preventDefault()
          const action = btn.dataset.action

          if (action === 'createLink') {
            const url = prompt('Enter URL:')
            if (url) {
              document.execCommand('createLink', false, url)
            }
          } else if (action === 'h2') {
            document.execCommand('formatBlock', false, 'h2')
          } else if (action === 'blockquote') {
            document.execCommand('formatBlock', false, 'blockquote')
          } else {
            document.execCommand(action, false, null)
          }
        })

        btn.addEventListener('mouseover', () => {
          btn.style.backgroundColor = '#555'
        })
        btn.addEventListener('mouseout', () => {
          btn.style.backgroundColor = 'transparent'
        })
      })

      document.body.appendChild(toolbar)
    }

    const hideToolbar = () => {
      if (toolbar) {
        toolbar.style.visibility = 'hidden'
        setTimeout(() => {
          if (toolbar) {
            toolbar.remove()
            toolbar = null
          }
        }, 100)
      }
    }

        const positionToolbar = () => {
      if (!toolbar) {
        console.log('No toolbar to position')
        return
      }

      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        console.log('Positioning toolbar at rect:', rect)

        if (rect.width > 0 && rect.height > 0) {
          // Ensure toolbar appears within viewport
          const left = Math.max(10, Math.min(rect.left + window.scrollX, window.innerWidth - 220))
          const top = Math.max(10, rect.top + window.scrollY - 45)

          console.log('Setting toolbar position:', { left, top })

          toolbar.style.left = `${left}px`
          toolbar.style.top = `${top}px`
          toolbar.style.visibility = 'visible'
        } else {
          console.log('Invalid rect dimensions:', rect)
        }
      } else {
        console.log('No selection range available')
      }
    }

    element.addEventListener('mouseup', (e) => {
      setTimeout(() => {
        const selection = window.getSelection()
        const selectionText = selection ? selection.toString().trim() : ''
        console.log('Mouseup on element:', element.className, 'Selection detected:', selectionText, 'length:', selectionText.length)

        // Check if the selection is within this element
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const isWithinElement = element.contains(range.commonAncestorContainer) ||
                                  element.contains(range.startContainer) ||
                                  element.contains(range.endContainer)

          console.log('Selection within element:', isWithinElement)

          if (selectionText.length > 0 && isWithinElement) {
            console.log('Showing toolbar for selection:', selectionText)
            showToolbar()
            positionToolbar()
          } else {
            console.log('Hiding toolbar - no valid selection within element')
            hideToolbar()
          }
        } else {
          console.log('Hiding toolbar - no selection')
          hideToolbar()
        }
      }, 50)
    })

    // Also listen for selection changes
    element.addEventListener('keyup', () => {
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim().length > 0) {
          if (toolbar) {
            positionToolbar()
          } else {
            showToolbar()
            positionToolbar()
          }
        } else {
          hideToolbar()
        }
      }, 50)
    })

    document.addEventListener('mousedown', (e) => {
      if (!element.contains(e.target) && (!toolbar || !toolbar.contains(e.target))) {
        console.log('Hiding toolbar due to outside click')
        hideToolbar()
      }
    })
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

// Blog Platform Implementation
class DemoBlogPlatform {
  constructor() {
    this.initializeEditors()
    this.setupAutoSave()
    this.setupEventListeners()
    this.loadDraft()
  }

  initializeEditors() {
    // Title editor
    this.titleEditor = new DemoMediumEditor('.demo-blog-title', {
      disableToolbar: true
    })

    // Main content editor
    this.contentEditor = new DemoMediumEditor('.demo-blog-body', {
      allowHeadings: true,
      allowQuotes: true,
      allowLinks: true
    })

    // Setup real-time stats
    this.contentEditor.subscribe('editableInput', () => {
      this.updateStats()
      this.scheduleAutoSave()
    })

    this.titleEditor.subscribe('editableInput', () => {
      this.scheduleAutoSave()
    })

    // Initial stats
    this.updateStats()
  }

  updateStats() {
    const content = document.querySelector('.demo-blog-body').textContent.trim()
    const words = content ? content.split(/\s+/).filter(word => word.length > 0).length : 0
    const readTime = Math.max(1, Math.ceil(words / 200))

    document.getElementById('demo-word-count').textContent = words
    document.getElementById('demo-read-time').textContent = readTime
  }

  setupAutoSave() {
    this.autoSaveTimeout = null
  }

  scheduleAutoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }

    this.updateSaveStatus('typing')

    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft()
    }, 2000)
  }

  saveDraft() {
    const draft = this.getBlogData()
    localStorage.setItem('demo-blog-draft', JSON.stringify(draft))
    this.updateSaveStatus('saved')
  }

  getBlogData() {
    return {
      title: document.querySelector('.demo-blog-title').textContent.trim(),
      content: document.querySelector('.demo-blog-body').innerHTML,
      tags: document.getElementById('demo-blog-tags').value,
      category: document.getElementById('demo-blog-category').value,
      lastModified: new Date().toISOString()
    }
  }

  loadDraft() {
    const draft = localStorage.getItem('demo-blog-draft')
    if (draft) {
      const data = JSON.parse(draft)
      if (data.title && data.title !== 'How to Build Amazing Web Applications') {
        document.querySelector('.demo-blog-title').innerHTML = `<h1>${data.title}</h1>`
      }
      if (data.content) {
        document.querySelector('.demo-blog-body').innerHTML = data.content
      }
      if (data.tags) {
        document.getElementById('demo-blog-tags').value = data.tags
      }
      if (data.category) {
        document.getElementById('demo-blog-category').value = data.category
      }
      this.updateStats()
      this.updateSaveStatus('loaded')
    }
  }

  updateSaveStatus(status) {
    const indicator = document.getElementById('demo-save-indicator')
    const statusMap = {
      typing: { text: 'Typing...', class: 'typing' },
      saved: { text: 'Draft Saved', class: 'saved' },
      loaded: { text: 'Draft Loaded', class: 'loaded' },
      publishing: { text: 'Publishing...', class: 'publishing' },
      published: { text: 'Published!', class: 'published' }
    }

    const statusInfo = statusMap[status] || { text: 'Ready', class: '' }
    indicator.textContent = statusInfo.text
    indicator.className = statusInfo.class
  }

  setupEventListeners() {
    document.getElementById('demo-save-draft').addEventListener('click', () => {
      this.saveDraft()
    })

    document.getElementById('demo-publish-post').addEventListener('click', () => {
      this.publishPost()
    })

    document.getElementById('demo-blog-tags').addEventListener('input', () => {
      this.scheduleAutoSave()
    })

    document.getElementById('demo-blog-category').addEventListener('change', () => {
      this.scheduleAutoSave()
    })
  }

  publishPost() {
    this.updateSaveStatus('publishing')

    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem('demo-blog-draft')
      this.updateSaveStatus('published')

      // Show success message
      const notification = document.createElement('div')
      notification.textContent = '🎉 Blog post published successfully!'
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.remove()
        this.updateSaveStatus('saved')
      }, 3000)
    }, 1000)
  }
}

// Documentation System Implementation
class DemoDocumentationSystem {
  constructor() {
    this.initializeEditor()
    this.setupTableOfContents()
  }

  initializeEditor() {
    this.editor = new DemoMediumEditor('.demo-docs-editor', {
      allowHeadings: true,
      allowQuotes: true,
      allowLinks: true
    })

    this.editor.subscribe('editableInput', () => {
      this.updateTableOfContents()
      this.highlightCode()
    })

    // Initial setup
    this.updateTableOfContents()
    this.highlightCode()
  }

  setupTableOfContents() {
    this.updateTableOfContents()
  }

  updateTableOfContents() {
    const headings = document.querySelectorAll('.demo-docs-editor h1, .demo-docs-editor h2, .demo-docs-editor h3')
    const tocList = document.getElementById('demo-toc-list')

    tocList.innerHTML = ''

    headings.forEach((heading, index) => {
      const id = `demo-heading-${index}`
      heading.id = id

      const li = document.createElement('li')
      li.className = `toc-${heading.tagName.toLowerCase()}`

      const link = document.createElement('a')
      link.href = `#${id}`
      link.textContent = heading.textContent
      link.addEventListener('click', (e) => {
        e.preventDefault()
        heading.scrollIntoView({ behavior: 'smooth' })
      })

      li.appendChild(link)
      tocList.appendChild(li)
    })
  }

  highlightCode() {
    const codeBlocks = document.querySelectorAll('.demo-docs-editor pre code')
    codeBlocks.forEach(block => {
      // Simple syntax highlighting
      let html = block.innerHTML
      html = html.replace(/\b(import|export|const|let|var|function|class|interface|type)\b/g, '<span class="keyword">$1</span>')
      html = html.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="string">$1$2$3</span>')
      html = html.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      block.innerHTML = html
    })
  }
}

// Comment System Implementation
class DemoCommentSystem {
  constructor() {
    this.initializeEditor()
    this.setupEventListeners()
    this.comments = this.loadComments()
  }

  initializeEditor() {
    this.commentEditor = new DemoMediumEditor('.demo-comment-editor', {
      allowLinks: true
    })
  }

  setupEventListeners() {
    document.getElementById('demo-comment-form').addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitComment()
    })

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('reply-btn')) {
        this.handleReply(e.target.dataset.commentId)
      }
      if (e.target.classList.contains('like-btn')) {
        this.handleLike(e.target.dataset.commentId)
      }
    })
  }

  submitComment() {
    const content = document.querySelector('.demo-comment-editor').innerHTML.trim()
    const author = document.getElementById('demo-author-name').value.trim()
    const email = document.getElementById('demo-author-email').value.trim()

    if (!content || content === '<p>Share your thoughts on this article...</p>' || !author) {
      alert('Please fill in your name and write a comment')
      return
    }

    const comment = {
      id: Date.now(),
      author,
      email,
      content,
      timestamp: new Date(),
      likes: 0
    }

    this.addComment(comment)
    this.clearForm()
  }

  addComment(comment) {
    this.comments.push(comment)
    this.saveComments()
    this.renderNewComment(comment)
  }

  renderNewComment(comment) {
    const commentsList = document.getElementById('demo-comments-list')
    const commentHtml = this.renderComment(comment)
    commentsList.insertAdjacentHTML('beforeend', commentHtml)

    // Animate in
    const newComment = commentsList.lastElementChild
    newComment.style.opacity = '0'
    newComment.style.transform = 'translateY(20px)'

    setTimeout(() => {
      newComment.style.transition = 'all 0.3s ease'
      newComment.style.opacity = '1'
      newComment.style.transform = 'translateY(0)'
    }, 100)
  }

  renderComment(comment) {
    const avatar = this.getAvatar(comment.author)
    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-avatar">${avatar}</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
          </div>
          <div class="comment-body">${comment.content}</div>
          <div class="comment-actions">
            <button class="reply-btn" data-comment-id="${comment.id}">Reply</button>
            <button class="like-btn" data-comment-id="${comment.id}">👍 ${comment.likes || 0}</button>
          </div>
        </div>
      </div>
    `
  }

  getAvatar(name) {
    const avatars = ['👤', '👩', '👨', '🧑', '👩‍💻', '👨‍💻', '🙋‍♀️', '🙋‍♂️']
    const index = name.length % avatars.length
    return avatars[index]
  }

  formatTime(timestamp) {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return new Date(timestamp).toLocaleDateString()
  }

  handleReply(commentId) {
    alert(`Reply functionality would be implemented here for comment ${commentId}`)
  }

  handleLike(commentId) {
    const comment = this.comments.find(c => c.id == commentId)
    if (comment) {
      comment.likes = (comment.likes || 0) + 1
      this.saveComments()

      // Update the button
      const button = document.querySelector(`[data-comment-id="${commentId}"].like-btn`)
      if (button) {
        button.textContent = `👍 ${comment.likes}`
      }
    }
  }

  clearForm() {
    document.querySelector('.demo-comment-editor').innerHTML = '<p>Share your thoughts on this article...</p>'
    document.getElementById('demo-author-name').value = ''
    document.getElementById('demo-author-email').value = ''
  }

  loadComments() {
    const saved = localStorage.getItem('demo-comments')
    return saved ? JSON.parse(saved) : []
  }

  saveComments() {
    localStorage.setItem('demo-comments', JSON.stringify(this.comments))
  }
}

// Initialize all demos
let retryCount = 0
const maxRetries = 50

function waitForElements() {
  const blogDemo = document.querySelector('.demo-blog-title')
  const docsDemo = document.querySelector('.demo-docs-editor')
  const commentsDemo = document.querySelector('.demo-comment-editor')

  if (blogDemo || docsDemo || commentsDemo) {
    initializeRealWorldDemos()
  } else if (retryCount < maxRetries) {
    retryCount++
    setTimeout(waitForElements, 100)
  }
}

function initializeRealWorldDemos() {
  // Blog Platform Demo
  if (document.querySelector('.demo-blog-title')) {
    new DemoBlogPlatform()
  }

  // Documentation System Demo
  if (document.querySelector('.demo-docs-editor')) {
    new DemoDocumentationSystem()
  }

  // Comment System Demo
  if (document.querySelector('.demo-comment-editor')) {
    new DemoCommentSystem()
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
  margin: 2rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.demo-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
}

/* Blog Platform Styles */
.blog-platform {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.blog-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.blog-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.blog-actions {
  display: flex;
  gap: 0.5rem;
}

.blog-actions button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.blog-actions button:hover {
  background: #0056b3;
}

.demo-blog-title {
  outline: none;
  border: 2px dashed transparent;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
  cursor: text !important;
}

.demo-blog-title:focus {
  border-color: #007bff;
}

.demo-blog-title h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.blog-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.blog-meta input,
.blog-meta select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.demo-blog-body {
  min-height: 300px;
  outline: none;
  border: 2px dashed transparent;
  padding: 1rem;
  border-radius: 6px;
  line-height: 1.6;
  color: #333;
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  pointer-events: auto !important;
  cursor: text !important;
}

.demo-blog-body:focus {
  border-color: #007bff;
}

.demo-blog-body blockquote {
  border-left: 4px solid #007bff;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #666;
}

.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-panel {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.stat {
  text-align: center;
  margin-bottom: 1rem;
}

.stat:last-child {
  margin-bottom: 0;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.save-status {
  padding: 0.75rem;
  text-align: center;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #e9ecef;
  color: #6c757d;
}

.save-status.saved {
  background: #d4edda;
  color: #155724;
}

.save-status.typing {
  background: #fff3cd;
  color: #856404;
}

.save-status.loaded {
  background: #d1ecf1;
  color: #0c5460;
}

.save-status.published {
  background: #d4edda;
  color: #155724;
}

/* Documentation System Styles */
.docs-system {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 400px;
}

.docs-nav {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.docs-nav h2 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.toc h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin-bottom: 0.25rem;
}

.toc a {
  color: #007bff;
  text-decoration: none;
  font-size: 0.875rem;
  display: block;
  padding: 0.25rem 0;
}

.toc a:hover {
  text-decoration: underline;
}

.toc .toc-h1 a {
  font-weight: bold;
}

.toc .toc-h3 a {
  padding-left: 1rem;
  color: #666;
}

.demo-docs-editor {
  outline: none;
  border: 2px dashed transparent;
  padding: 1rem;
  border-radius: 6px;
  line-height: 1.6;
  color: #333;
}

.demo-docs-editor:focus {
  border-color: #007bff;
}

.demo-docs-editor h1,
.demo-docs-editor h2,
.demo-docs-editor h3 {
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.demo-docs-editor h1 {
  font-size: 2rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.demo-docs-editor h2 {
  font-size: 1.5rem;
}

.demo-docs-editor h3 {
  font-size: 1.25rem;
}

.demo-docs-editor pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.demo-docs-editor code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.demo-docs-editor .keyword {
  color: #d73a49;
  font-weight: bold;
}

.demo-docs-editor .string {
  color: #032f62;
}

.demo-docs-editor .comment {
  color: #6a737d;
  font-style: italic;
}

/* Comment System Styles */
.comment-system {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.comments-list {
  margin-bottom: 2rem;
}

.comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.comment-avatar {
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  border: 2px solid #dee2e6;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-time {
  color: #6c757d;
  font-size: 0.875rem;
}

.comment-body {
  margin-bottom: 0.75rem;
  line-height: 1.5;
  color: #333;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.comment-actions button {
  background: transparent;
  border: 1px solid #dee2e6;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6c757d;
}

.comment-actions button:hover {
  background: #e9ecef;
}

.comment-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.form-header h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.demo-comment-editor {
  background: white;
  border: 2px dashed transparent;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 100px;
  outline: none;
  line-height: 1.5;
}

.demo-comment-editor:focus {
  border-color: #007bff;
}

.form-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.form-footer input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-footer button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.form-footer button:hover {
  background: #0056b3;
}

/* Toolbar Styles */
.demo-toolbar {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: absolute !important;
  z-index: 9999 !important;
  pointer-events: auto !important;
}

.demo-toolbar button {
  background: transparent !important;
  border: 1px solid #555 !important;
  color: white !important;
  padding: 6px 10px !important;
  border-radius: 3px !important;
  cursor: pointer !important;
  font-size: 12px !important;
  font-weight: bold !important;
  margin: 0 !important;
}

.demo-toolbar button:hover {
  background-color: #555 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog-platform {
    grid-template-columns: 1fr;
  }

  .blog-sidebar {
    order: -1;
  }

  .docs-system {
    grid-template-columns: 1fr;
  }

  .docs-nav {
    order: -1;
  }

  .blog-meta {
    flex-direction: column;
  }

  .form-footer {
    flex-direction: column;
  }

  .form-footer input {
    width: 100%;
  }
}

/* Placeholder styles */
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #6c757d;
  font-style: italic;
}
</style>
