# Real-World Use Cases

Complete implementations for common real-world scenarios.

## Blog Platform

A complete blog editing interface with multiple editors and features.

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
      } else {
        throw new Error('Failed to publish')
      }
    } catch (error) {
      alert('Failed to publish blog post. Please try again.')
      this.updateSaveStatus('saved')
    }
  }
}

// Initialize the blog platform
const blogPlatform = new BlogPlatform()
```

## Documentation System

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
    codeBlocks.forEach(block => {
      block.classList.add('language-javascript')
      // Add syntax highlighting here if using a library like Prism.js
    })
  }
}

const docsSystem = new DocumentationSystem()
```

## Comment System

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

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hours ago`
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