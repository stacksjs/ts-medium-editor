# Basic Editor

The simplest way to get started with `ts-medium-editor`.

## Quick Start

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Try it yourself - Select text to see the toolbar:</div>
  <div class="demo-basic-editor" data-placeholder="Start typing here...">
    <p>This is a <strong>basic editor</strong> with <em>formatting capabilities</em>.</p>
    <p>You can create <a href="#">links</a>, format text, and more!</p>
  </div>
</div>

### HTML
```html
<div class="editable" data-placeholder="Start typing here...">
  <p>This is a <strong>basic editor</strong> with <em>formatting capabilities</em>.</p>
  <p>You can create <a href="#">links</a>, format text, and more!</p>
</div>
```

### TypeScript
```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/dist/css/medium-editor.css'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: 'Start typing here...',
    hideOnClick: true
  }
})
```

## Minimal Setup

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Minimal editor with default settings:</div>
  <div class="demo-minimal-editor" data-placeholder="Type here for minimal editor...">
    <p>This is the most basic setup with default options.</p>
  </div>
</div>

For the absolute minimum setup:

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/dist/css/medium-editor.css'

// Just pass a selector - uses all default options
const editor = new MediumEditor('.editable')
```

## Article Editor

A more complete setup for article writing:

### HTML
```html
<article class="article-editor">
  <h1 class="article-title" data-placeholder="Enter your title...">
    Your Article Title
  </h1>
  <div class="article-content" data-placeholder="Write your article...">
    <p>Write compelling content here. You can use various formatting options:</p>
    <ul>
      <li>Bold and italic text</li>
      <li>Headers for structure</li>
      <li>Links and quotes</li>
    </ul>
    <blockquote>
      "This is a blockquote example that demonstrates the quote feature."
    </blockquote>
    <p>Continue writing your amazing content!</p>
  </div>
</article>
```

### TypeScript
```typescript
const articleEditor = new MediumEditor(['.article-title', '.article-content'], {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: 'Start writing...',
    hideOnClick: true
  },
  buttonLabels: 'fontawesome'
})
```

### CSS
```css
.article-editor {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Georgia', serif;
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border: none;
  outline: none;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

.article-content:focus {
  outline: none;
  border-left: 3px solid #007bff;
  padding-left: 17px;
}
```

## Real-time Preview

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Live preview demo - Edit on the left, see changes on the right:</div>
  <div class="demo-preview-container">
    <div class="demo-editor-panel">
      <h4>Editor</h4>
      <div class="demo-preview-editor" data-placeholder="Type to see live preview...">
        <p>Edit this text and watch the preview update!</p>
      </div>
    </div>
    <div class="demo-preview-panel">
      <h4>Live Preview</h4>
      <div id="demo-live-preview"></div>
    </div>
  </div>
</div>

Show content updates in real-time:

### HTML
```html
<div class="editor-container">
  <div class="editor-panel">
    <h3>Editor</h3>
    <div class="editable-preview" data-placeholder="Type to see live preview...">
      <p>Edit this text and watch the preview update!</p>
    </div>
  </div>

  <div class="preview-panel">
    <h3>Live Preview</h3>
    <div id="live-preview"></div>
  </div>
</div>
```

### TypeScript
```typescript
const editor = new MediumEditor('.editable-preview', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'quote']
  }
})

// Update preview in real-time
editor.subscribe('editableInput', (event, editable) => {
  const preview = document.getElementById('live-preview')
  preview.innerHTML = editable.innerHTML
})

// Initialize preview
document.addEventListener('DOMContentLoaded', () => {
  const editable = document.querySelector('.editable-preview')
  const preview = document.getElementById('live-preview')
  preview.innerHTML = editable.innerHTML
})
```

### CSS
```css
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.editor-panel, .preview-panel {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

.editable-preview {
  min-height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
}

#live-preview {
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}
```

## Next Steps

- Learn about [Custom Toolbar](/examples/toolbar) options
- Explore [Multiple Editors](/examples/multiple) setup
- Check out [Event Handling](/examples/events) for interactivity

<script>
// Initialize demos when the page loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Load Medium Editor if not already loaded
    if (typeof window.MediumEditor === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = initializeDemos
      document.head.appendChild(script)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      document.head.appendChild(link)
    } else {
      initializeDemos()
    }
  })

  function initializeDemos() {
    // Basic editor demo
    if (document.querySelector('.demo-basic-editor')) {
      new MediumEditor('.demo-basic-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
        },
        placeholder: {
          text: 'Start typing here...',
          hideOnClick: true
        }
      })
    }

    // Minimal editor demo
    if (document.querySelector('.demo-minimal-editor')) {
      new MediumEditor('.demo-minimal-editor')
    }

    // Preview editor demo
    if (document.querySelector('.demo-preview-editor')) {
      const previewEditor = new MediumEditor('.demo-preview-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'quote']
        }
      })

      // Update preview in real-time
      previewEditor.subscribe('editableInput', (event, editable) => {
        const preview = document.getElementById('demo-live-preview')
        if (preview) {
          preview.innerHTML = editable.innerHTML
        }
      })

      // Initialize preview
      const editable = document.querySelector('.demo-preview-editor')
      const preview = document.getElementById('demo-live-preview')
      if (editable && preview) {
        preview.innerHTML = editable.innerHTML
      }
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

.demo-basic-editor,
.demo-minimal-editor,
.demo-preview-editor {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-height: 120px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.demo-basic-editor:focus,
.demo-minimal-editor:focus,
.demo-preview-editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.demo-preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.demo-editor-panel,
.demo-preview-panel {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.demo-editor-panel h4,
.demo-preview-panel h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

#demo-live-preview {
  min-height: 120px;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  border: 1px dashed #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .demo-preview-container {
    grid-template-columns: 1fr;
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