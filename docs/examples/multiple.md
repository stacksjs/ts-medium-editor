# Multiple Editors

Manage multiple editor instances with different configurations on the same page.

## Basic Multiple Elements

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Multiple elements managed by one editor instance:</div>
  <div class="demo-status" id="demo-status-multiple">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-editor-group">
    <div class="demo-title-element demo-editable" data-placeholder="Enter title..." contenteditable="true">
      <h1>Document Title</h1>
    </div>
    <div class="demo-content-element demo-editable" data-placeholder="Enter content..." contenteditable="true">
      <p>This is the document content. Both elements share the same toolbar configuration.</p>
    </div>
  </div>
</div>

Create one editor instance that manages multiple elements:

### HTML
```html
<div class="editor-group">
  <div class="title-editor editable" data-placeholder="Enter title...">
    <h1>Document Title</h1>
  </div>
  <div class="content-editor editable" data-placeholder="Enter content...">
    <p>This is the document content. Both elements share the same toolbar configuration.</p>
  </div>
</div>
```

### TypeScript
```typescript
// Single editor instance managing multiple elements
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  buttonLabels: 'fontawesome',
  placeholder: {
    text: 'Start typing...',
    hideOnClick: true
  }
})
```

## Different Editor Configurations

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Three different editors with unique configurations:</div>
  <div class="demo-status" id="demo-status-different">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-different-editors">
    <div class="demo-editor-section">
      <h4>Article Editor (Full Features)</h4>
      <div class="demo-article-editor" data-placeholder="Write your article..." contenteditable="true">
        <p>This editor has a full toolbar with all formatting options.</p>
      </div>
    </div>

    <div class="demo-editor-section">
      <h4>Comment Editor (Minimal)</h4>
      <div class="demo-comment-editor" data-placeholder="Write a comment..." contenteditable="true">
        <p>This editor has minimal formatting options for comments.</p>
      </div>
    </div>

    <div class="demo-editor-section">
      <h4>Title Editor (No Toolbar)</h4>
      <div class="demo-title-only-editor" data-placeholder="Enter title..." contenteditable="true">
        <h2>This editor is for titles only</h2>
      </div>
    </div>
  </div>
</div>

Create separate editor instances with different configurations:

### HTML
```html
<!-- Full-featured editor -->
<div class="main-content">
  <h3>Article Editor</h3>
  <div class="article-editor" data-placeholder="Write your article...">
    <p>This editor has a full toolbar with all formatting options.</p>
  </div>
</div>

<!-- Minimal editor -->
<div class="comment-section">
  <h3>Comment Editor</h3>
  <div class="comment-editor" data-placeholder="Write a comment...">
    <p>This editor has minimal formatting options for comments.</p>
  </div>
</div>

<!-- Title-only editor -->
<div class="title-section">
  <h3>Title Editor</h3>
  <div class="title-only-editor" data-placeholder="Enter title...">
    <h2>This editor is for titles only</h2>
  </div>
</div>
```

### TypeScript
```typescript
// Full-featured editor for articles
const articleEditor = new MediumEditor('.article-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'pre']
  },
  buttonLabels: 'fontawesome',
  autoLink: true,
  paste: {
    cleanPastedHTML: true
  }
})

// Minimal editor for comments
const commentEditor = new MediumEditor('.comment-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  disableReturn: false,
  disableDoubleReturn: true,
  paste: {
    forcePlainText: true
  }
})

// Title-only editor (no toolbar)
const titleEditor = new MediumEditor('.title-only-editor', {
  toolbar: false,
  disableReturn: true,
  disableDoubleReturn: true
})
```

## Blog Post Editor System

A complete blog post editing system with multiple specialized editors:

### HTML
```html
<div class="blog-editor-system">
  <!-- Title Editor -->
  <div class="blog-title-section">
    <label>Title</label>
    <div class="blog-title" data-placeholder="Enter your blog post title...">
      <h1>Your Amazing Blog Post Title</h1>
    </div>
  </div>

  <!-- Subtitle Editor -->
  <div class="blog-subtitle-section">
    <label>Subtitle</label>
    <div class="blog-subtitle" data-placeholder="Enter a compelling subtitle...">
      <h2>A subtitle that draws readers in</h2>
    </div>
  </div>

  <!-- Main Content Editor -->
  <div class="blog-content-section">
    <label>Content</label>
    <div class="blog-content" data-placeholder="Write your blog post content...">
      <p>Start writing your amazing blog post here. You have access to all formatting tools.</p>
      <blockquote>You can add quotes, links, and various formatting options.</blockquote>
    </div>
  </div>

  <!-- Tags Editor -->
  <div class="blog-tags-section">
    <label>Tags</label>
    <div class="blog-tags" data-placeholder="Add tags separated by commas...">
      <p>typescript, medium-editor, blogging, web-development</p>
    </div>
  </div>
</div>
```

### TypeScript
```typescript
// Title editor - no toolbar, single line
const titleEditor = new MediumEditor('.blog-title', {
  toolbar: false,
  disableReturn: true,
  disableDoubleReturn: true,
  placeholder: {
    text: 'Enter your blog post title...'
  }
})

// Subtitle editor - no toolbar, single line
const subtitleEditor = new MediumEditor('.blog-subtitle', {
  toolbar: false,
  disableReturn: true,
  disableDoubleReturn: true,
  placeholder: {
    text: 'Enter a compelling subtitle...'
  }
})

// Main content editor - full toolbar
const contentEditor = new MediumEditor('.blog-content', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'pre']
  },
  buttonLabels: 'fontawesome',
  autoLink: true,
  placeholder: {
    text: 'Write your blog post content...'
  }
})

// Tags editor - minimal, plain text
const tagsEditor = new MediumEditor('.blog-tags', {
  toolbar: false,
  disableReturn: true,
  paste: {
    forcePlainText: true
  },
  placeholder: {
    text: 'Add tags separated by commas...'
  }
})
```

### CSS
```css
.blog-editor-system {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-title-section,
.blog-subtitle-section,
.blog-content-section,
.blog-tags-section {
  margin-bottom: 2rem;
}

.blog-title-section label,
.blog-subtitle-section label,
.blog-content-section label,
.blog-tags-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #495057;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: bold;
  border: 2px dashed #dee2e6;
  padding: 1rem;
  border-radius: 8px;
}

.blog-subtitle {
  font-size: 1.5rem;
  color: #6c757d;
  border: 2px dashed #dee2e6;
  padding: 1rem;
  border-radius: 8px;
}

.blog-content {
  min-height: 300px;
  border: 2px dashed #dee2e6;
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.6;
}

.blog-tags {
  border: 2px dashed #dee2e6;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  background: #f8f9fa;
}
```

## Form Integration

Integrate multiple editors with form submission:

### HTML
```html
<form id="article-form" class="article-form">
  <div class="form-group">
    <label for="article-title">Title</label>
    <div class="form-title-editor" data-placeholder="Article title...">
      <h1>Sample Article Title</h1>
    </div>
    <input type="hidden" id="article-title" name="title">
  </div>

  <div class="form-group">
    <label for="article-excerpt">Excerpt</label>
    <div class="form-excerpt-editor" data-placeholder="Brief excerpt...">
      <p>A brief excerpt of the article...</p>
    </div>
    <input type="hidden" id="article-excerpt" name="excerpt">
  </div>

  <div class="form-group">
    <label for="article-content">Content</label>
    <div class="form-content-editor" data-placeholder="Article content...">
      <p>Full article content goes here...</p>
    </div>
    <input type="hidden" id="article-content" name="content">
  </div>

  <button type="submit">Save Article</button>
</form>
```

### TypeScript
```typescript
// Title editor
const formTitleEditor = new MediumEditor('.form-title-editor', {
  toolbar: false,
  disableReturn: true
})

// Excerpt editor
const formExcerptEditor = new MediumEditor('.form-excerpt-editor', {
  toolbar: {
    buttons: ['bold', 'italic']
  },
  disableDoubleReturn: true
})

// Content editor
const formContentEditor = new MediumEditor('.form-content-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  buttonLabels: 'fontawesome'
})

// Update hidden inputs on content change
formTitleEditor.subscribe('editableInput', () => {
  document.getElementById('article-title').value =
    document.querySelector('.form-title-editor').textContent.trim()
})

formExcerptEditor.subscribe('editableInput', () => {
  document.getElementById('article-excerpt').value =
    document.querySelector('.form-excerpt-editor').innerHTML
})

formContentEditor.subscribe('editableInput', () => {
  document.getElementById('article-content').value =
    document.querySelector('.form-content-editor').innerHTML
})

// Handle form submission
document.getElementById('article-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const articleData = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content')
  }

  console.log('Article data:', articleData)
  // Submit to your backend
})
```

## Conditional Editors

Show/hide editors based on user interaction:

### HTML
```html
<div class="conditional-editors">
  <div class="editor-controls">
    <button id="toggle-advanced" type="button">Toggle Advanced Editor</button>
    <button id="add-sidebar" type="button">Add Sidebar Content</button>
  </div>

  <div class="basic-editor-container">
    <h3>Basic Editor</h3>
    <div class="basic-editor" data-placeholder="Basic content...">
      <p>This editor is always visible.</p>
    </div>
  </div>

  <div class="advanced-editor-container" style="display: none;">
    <h3>Advanced Editor</h3>
    <div class="advanced-editor" data-placeholder="Advanced content...">
      <p>This editor appears when toggled.</p>
    </div>
  </div>

  <div class="sidebar-editor-container" style="display: none;">
    <h3>Sidebar Content</h3>
    <div class="sidebar-editor" data-placeholder="Sidebar content...">
      <p>Additional sidebar content.</p>
    </div>
  </div>
</div>
```

### TypeScript
```typescript
// Initialize basic editor immediately
const basicEditor = new MediumEditor('.basic-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})

// Advanced and sidebar editors (initialized when needed)
let advancedEditor = null
let sidebarEditor = null

// Toggle advanced editor
document.getElementById('toggle-advanced').addEventListener('click', () => {
  const container = document.querySelector('.advanced-editor-container')

  if (container.style.display === 'none') {
    container.style.display = 'block'

    // Initialize editor if not already done
    if (!advancedEditor) {
      advancedEditor = new MediumEditor('.advanced-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'pre']
        },
        buttonLabels: 'fontawesome'
      })
    }
  } else {
    container.style.display = 'none'
  }
})

// Add sidebar editor
document.getElementById('add-sidebar').addEventListener('click', () => {
  const container = document.querySelector('.sidebar-editor-container')

  if (container.style.display === 'none') {
    container.style.display = 'block'

    // Initialize editor if not already done
    if (!sidebarEditor) {
      sidebarEditor = new MediumEditor('.sidebar-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'quote']
        }
      })
    }
  }
})
```

## Cross-Editor Communication

Make editors communicate with each other:

### TypeScript
```typescript
// Create editors
const editor1 = new MediumEditor('.editor-1')
const editor2 = new MediumEditor('.editor-2')

// Shared state
const sharedState = {
  wordCount: 0,
  lastModified: null
}

// Update shared state when any editor changes
function updateSharedState() {
  const editor1Content = document.querySelector('.editor-1').textContent
  const editor2Content = document.querySelector('.editor-2').textContent

  sharedState.wordCount = (editor1Content + ' ' + editor2Content)
    .trim().split(/\s+/).length
  sharedState.lastModified = new Date()

  // Update UI
  document.getElementById('total-words').textContent = sharedState.wordCount
  document.getElementById('last-modified').textContent =
    sharedState.lastModified.toLocaleTimeString()
}

// Listen to both editors
editor1.subscribe('editableInput', updateSharedState)
editor2.subscribe('editableInput', updateSharedState)

// Sync formatting between editors
editor1.subscribe('editableInput', () => {
  // Copy formatting from editor1 to editor2 if needed
  // This is just an example - implement based on your needs
})
```

## Next Steps

- Learn about [Event Handling](/examples/events) for editor communication
- Explore [Extensions](/examples/extensions) for shared functionality
- Check out [Real-World Use Cases](/examples/real-world) for complete applications

<script>
// Initialize multiple editors demos when the page loads
if (typeof window !== 'undefined') {
  let demoInitialized = false

  function loadMediumEditor() {
    return new Promise((resolve, reject) => {
      if (typeof window.MediumEditor !== 'undefined') {
        resolve()
        return
      }

      let loadedCount = 0
      const totalResources = 4

      function checkAllLoaded() {
        loadedCount++
        if (loadedCount === totalResources) {
          console.log('All Medium Editor resources loaded successfully')
          // Wait a bit more for FontAwesome to be ready
          setTimeout(resolve, 500)
        }
      }

      // Load Medium Editor CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      link.onload = checkAllLoaded
      link.onerror = () => {
        console.error('Failed to load Medium Editor CSS')
        checkAllLoaded() // Continue anyway
      }
      document.head.appendChild(link)

      // Load theme CSS
      const themeLink = document.createElement('link')
      themeLink.rel = 'stylesheet'
      themeLink.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/themes/default.min.css'
      themeLink.onload = checkAllLoaded
      themeLink.onerror = () => {
        console.error('Failed to load Medium Editor theme CSS')
        checkAllLoaded() // Continue anyway
      }
      document.head.appendChild(themeLink)

      // Load FontAwesome for icons - try multiple CDNs
      const faLink = document.createElement('link')
      faLink.rel = 'stylesheet'
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      faLink.onload = () => {
        console.log('FontAwesome loaded successfully')
        checkAllLoaded()
      }
      faLink.onerror = () => {
        console.warn('Primary FontAwesome CDN failed, trying backup...')
        // Try backup CDN
        const faBackup = document.createElement('link')
        faBackup.rel = 'stylesheet'
        faBackup.href = 'https://use.fontawesome.com/releases/v6.4.0/css/all.css'
        faBackup.onload = () => {
          console.log('FontAwesome backup loaded successfully')
          checkAllLoaded()
        }
        faBackup.onerror = () => {
          console.error('All FontAwesome CDNs failed')
          checkAllLoaded() // Continue anyway
        }
        document.head.appendChild(faBackup)
      }
      document.head.appendChild(faLink)

      // Load Medium Editor JavaScript
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = () => {
        console.log('Medium Editor JavaScript loaded successfully')
        checkAllLoaded()
      }
      script.onerror = () => {
        console.error('Failed to load Medium Editor JavaScript')
        reject(new Error('Failed to load Medium Editor'))
      }
      document.head.appendChild(script)

      // Timeout fallback
      setTimeout(() => {
        if (loadedCount < totalResources) {
          console.warn('Some resources may not have loaded, proceeding anyway...')
          resolve()
        }
      }, 10000)
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

  function initializeMultipleDemos() {
    if (demoInitialized) return
    demoInitialized = true

    console.log('Initializing Multiple Editors demos...')

    try {
      // Multiple elements with single editor instance
      const multipleElements = document.querySelectorAll('.demo-editable')
      if (multipleElements.length > 0) {
        console.log('Initializing multiple elements demo')
        updateDemoStatus('multiple', 'loading', '🔄 Initializing shared editor...')

        const editor1 = new MediumEditor('.demo-editable', {
          toolbar: {
            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
          },
          buttonLabels: 'fontawesome',
          placeholder: {
            text: 'Start typing...',
            hideOnClick: true
          }
        })

        updateDemoStatus('multiple', 'success', '✅ Shared editor ready! Both elements use same toolbar.')
        console.log('Multiple elements editor initialized:', editor1)
      }

      // Different editor configurations
      const articleEditor = document.querySelector('.demo-article-editor')
      const commentEditor = document.querySelector('.demo-comment-editor')
      const titleOnlyEditor = document.querySelector('.demo-title-only-editor')

      if (articleEditor || commentEditor || titleOnlyEditor) {
        console.log('Initializing different editors demo')
        updateDemoStatus('different', 'loading', '🔄 Initializing different editors...')

        // Article editor - full features
        if (articleEditor) {
          const editor2 = new MediumEditor(articleEditor, {
            toolbar: {
              buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'pre']
            },
            buttonLabels: 'fontawesome',
            autoLink: true,
            paste: {
              cleanPastedHTML: true
            }
          })
          console.log('Article editor initialized:', editor2)
        }

        // Comment editor - minimal
        if (commentEditor) {
          const editor3 = new MediumEditor(commentEditor, {
            toolbar: {
              buttons: ['bold', 'italic', 'anchor']
            },
            disableReturn: false,
            disableDoubleReturn: true,
            paste: {
              forcePlainText: true
            }
          })
          console.log('Comment editor initialized:', editor3)
        }

        // Title-only editor - no toolbar
        if (titleOnlyEditor) {
          const editor4 = new MediumEditor(titleOnlyEditor, {
            toolbar: false,
            disableReturn: true,
            disableDoubleReturn: true
          })
          console.log('Title-only editor initialized:', editor4)
        }

        updateDemoStatus('different', 'success', '✅ All different editors ready! Try each one.')
      }

      console.log('All multiple editor demos initialized successfully')
    } catch (error) {
      console.error('Error initializing multiple editor demos:', error)
      // Update all status indicators with error
      updateDemoStatus('multiple', 'error', '❌ Demo failed to load')
      updateDemoStatus('different', 'error', '❌ Demo failed to load')
    }
  }

  // Try multiple initialization strategies
  function attemptInitialization() {
    loadMediumEditor()
      .then(() => {
        // Wait a bit for DOM to be ready
        setTimeout(initializeMultipleDemos, 100)
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

.demo-editor-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-title-element,
.demo-content-element,
.demo-article-editor,
.demo-comment-editor,
.demo-title-only-editor {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  cursor: text;
  transition: all 0.3s ease;
}

.demo-title-element {
  min-height: 60px;
}

.demo-content-element,
.demo-article-editor,
.demo-comment-editor {
  min-height: 120px;
}

.demo-title-only-editor {
  min-height: 80px;
}

.demo-title-element:hover,
.demo-content-element:hover,
.demo-article-editor:hover,
.demo-comment-editor:hover,
.demo-title-only-editor:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.demo-title-element:focus,
.demo-content-element:focus,
.demo-article-editor:focus,
.demo-comment-editor:focus,
.demo-title-only-editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
}

/* Make sure the editors are editable */
.demo-title-element[contenteditable="true"],
.demo-content-element[contenteditable="true"],
.demo-article-editor[contenteditable="true"],
.demo-comment-editor[contenteditable="true"],
.demo-title-only-editor[contenteditable="true"] {
  border-color: #28a745;
}

/* Add subtle indicators when editors are ready */
.demo-title-element::before,
.demo-content-element::before,
.demo-article-editor::before,
.demo-comment-editor::before,
.demo-title-only-editor::before {
  content: "✏️ Click to edit";
  position: absolute;
  top: -25px;
  left: 0;
  font-size: 12px;
  color: #6c757d;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.demo-container:hover .demo-title-element::before,
.demo-container:hover .demo-content-element::before,
.demo-container:hover .demo-article-editor::before,
.demo-container:hover .demo-comment-editor::before,
.demo-container:hover .demo-title-only-editor::before {
  opacity: 1;
}

.demo-title-element h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
}

.demo-different-editors {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.demo-editor-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.demo-editor-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-editor-section h4::before {
  content: "📝";
  font-size: 0.875rem;
}

.demo-article-editor {
  border-color: #28a745;
  border-style: solid;
}

.demo-comment-editor {
  border-color: #ffc107;
  border-style: solid;
}

.demo-title-only-editor {
  border-color: #6c757d;
  border-style: solid;
}

.demo-title-only-editor h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #495057;
}

@media (min-width: 768px) {
  .demo-different-editors {
    grid-template-columns: 1fr 1fr 1fr;
  }
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
</style>