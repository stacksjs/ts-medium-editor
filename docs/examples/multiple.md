# Multiple Editors

Manage multiple editor instances with different configurations on the same page.

## Basic Multiple Elements

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Multiple elements managed by one editor instance:</div>
  <div class="demo-editor-group">
    <div class="demo-title-element demo-editable" data-placeholder="Enter title...">
      <h1>Document Title</h1>
    </div>
    <div class="demo-content-element demo-editable" data-placeholder="Enter content...">
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
  document.addEventListener('DOMContentLoaded', () => {
    // Load Medium Editor if not already loaded
    if (typeof window.MediumEditor === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = initializeMultipleDemos
      document.head.appendChild(script)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      document.head.appendChild(link)

      // Load FontAwesome for icons
      const faLink = document.createElement('link')
      faLink.rel = 'stylesheet'
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
      document.head.appendChild(faLink)
    } else {
      initializeMultipleDemos()
    }
  })

  function initializeMultipleDemos() {
    // Multiple elements with single editor instance
    if (document.querySelector('.demo-editable')) {
      new MediumEditor('.demo-editable', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
        },
        buttonLabels: 'fontawesome',
        placeholder: {
          text: 'Start typing...',
          hideOnClick: true
        }
      })
    }
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

.demo-editor-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-title-element,
.demo-content-element {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.demo-title-element {
  min-height: 60px;
}

.demo-content-element {
  min-height: 120px;
}

.demo-title-element:focus,
.demo-content-element:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.demo-title-element h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
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