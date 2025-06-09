# Textarea Integration

Convert textareas to rich text editors while maintaining form compatibility.

## Basic Textarea Conversion

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Basic Textarea Conversion - The textarea becomes a rich text editor:</div>
  <form class="demo-textarea-form">
    <label for="demo-content">Article Content:</label>
    <textarea id="demo-content" name="content" rows="6" cols="50" placeholder="Write your article content here...">This textarea has been converted to a rich text editor. Try selecting text and using the toolbar that appears!</textarea>
    <button type="submit">Save Article</button>
    <div class="form-output" id="demo-form-output"></div>
  </form>
</div>

### HTML
```html
<form class="textarea-form">
  <label for="content">Article Content:</label>
  <textarea id="content" name="content" rows="10" cols="50">
    Write your article content here...
  </textarea>
  <button type="submit">Save Article</button>
</form>
```

### TypeScript
```typescript
const editor = new MediumEditor('textarea', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  disableReturn: false,
  disableDoubleReturn: false
})

// Handle form submission
document.querySelector('.textarea-form').addEventListener('submit', (event) => {
  event.preventDefault()

  // The textarea value is automatically updated by the editor
  const content = document.getElementById('content').value
  console.log('Submitting content:', content)
})
```

## Blog Post Form

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Complete Blog Post Form - Title input + rich text editor for content:</div>
  <form class="demo-blog-form">
    <div class="form-group">
      <label for="demo-blog-title">Title</label>
      <input type="text" id="demo-blog-title" name="title" placeholder="Enter blog post title..." required>
    </div>
    <div class="form-group">
      <label for="demo-blog-content">Content</label>
      <textarea id="demo-blog-content" name="content" rows="10" placeholder="Write your blog post...">Start writing your blog post here. You can use **bold**, *italic*, and other formatting options from the toolbar!</textarea>
    </div>
    <button type="submit">Publish Blog Post</button>
    <div class="form-output" id="demo-blog-output"></div>
  </form>
</div>

### HTML
```html
<form class="blog-form">
  <div class="form-group">
    <label for="blog-title">Title</label>
    <input type="text" id="blog-title" name="title" required>
  </div>

  <div class="form-group">
    <label for="blog-content">Content</label>
    <textarea id="blog-content" name="content" rows="15" placeholder="Write your blog post..."></textarea>
  </div>

  <button type="submit">Publish</button>
</form>
```

### TypeScript
```typescript
const contentEditor = new MediumEditor('#blog-content', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  buttonLabels: 'fontawesome'
})

document.querySelector('.blog-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const article = {
    title: formData.get('title'),
    content: formData.get('content')
  }

  console.log('Publishing article:', article)
})
```

## Next Steps

- Learn about [Event Handling](/examples/events) for form integration
- Explore [Clean Paste](/examples/paste) for textarea content processing
- Check out [Real-World Use Cases](/examples/real-world) for complete applications

<script>
// Simplified demo implementation for textarea integration
class DemoMediumEditor {
  constructor(selector, options = {}) {
    this.elements = typeof selector === 'string'
      ? Array.from(document.querySelectorAll(selector))
      : [selector]
    this.options = options
    this.listeners = new Map()
    this.originalElements = new Map()
    this.init()
  }

  init() {
    this.elements.forEach(element => {
      if (element.tagName === 'TEXTAREA') {
        this.convertTextarea(element)
      } else {
        this.initElement(element)
      }
    })
  }

  convertTextarea(textarea) {
    // Store original textarea
    this.originalElements.set(textarea, textarea)

    // Create contenteditable div
    const editor = document.createElement('div')
    editor.contentEditable = 'true'
    editor.classList.add('medium-editor-element', 'medium-editor-textarea')
    editor.innerHTML = textarea.value || textarea.textContent || ''

    // Style the editor to look like the textarea
    const textareaStyle = window.getComputedStyle(textarea)
    editor.style.minHeight = textareaStyle.height
    editor.style.width = textareaStyle.width
    editor.style.padding = '8px'
    editor.style.border = '1px solid #ccc'
    editor.style.borderRadius = '4px'
    editor.style.fontSize = '14px'
    editor.style.fontFamily = textareaStyle.fontFamily
    editor.style.lineHeight = '1.5'
    editor.style.backgroundColor = '#fff'

    // Hide original textarea but keep it in the form
    textarea.style.display = 'none'

    // Insert editor after textarea
    textarea.parentNode.insertBefore(editor, textarea.nextSibling)

    // Sync content back to textarea on input
    editor.addEventListener('input', () => {
      textarea.value = editor.innerHTML
      this.trigger('editableInput', null, editor)
    })

    // Add to elements array
    this.elements.push(editor)

    // Add simple toolbar on selection
    this.addSimpleToolbar(editor)
  }

  initElement(element) {
    if (!element.hasAttribute('contenteditable')) {
      element.contentEditable = 'true'
    }
    element.classList.add('medium-editor-element')

    element.addEventListener('input', (e) => {
      this.trigger('editableInput', e, element)
    })

    this.addSimpleToolbar(element)
  }

  addSimpleToolbar(element) {
    let toolbar = null

    const showToolbar = () => {
      if (toolbar) return

      toolbar = document.createElement('div')
      toolbar.className = 'demo-simple-toolbar'
      toolbar.innerHTML = `
        <button type="button" data-action="bold"><b>B</b></button>
        <button type="button" data-action="italic"><i>I</i></button>
        <button type="button" data-action="underline"><u>U</u></button>
      `
      toolbar.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 4px;
        border-radius: 4px;
        z-index: 1000;
        display: flex;
        gap: 4px;
      `

      // Style buttons
      toolbar.querySelectorAll('button').forEach(btn => {
        btn.style.cssText = `
          background: transparent;
          border: 1px solid #555;
          color: white;
          padding: 4px 8px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 12px;
        `
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault()
          const action = btn.dataset.action
          document.execCommand(action, false, null)
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
        toolbar.remove()
        toolbar = null
      }
    }

    const positionToolbar = () => {
      if (!toolbar) return

      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        if (rect.width > 0) {
          toolbar.style.left = `${rect.left + window.scrollX}px`
          toolbar.style.top = `${rect.top + window.scrollY - 40}px`
        }
      }
    }

    element.addEventListener('mouseup', () => {
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection.toString().length > 0) {
          showToolbar()
          positionToolbar()
        } else {
          hideToolbar()
        }
      }, 10)
    })

    element.addEventListener('keyup', () => {
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection.toString().length > 0) {
          showToolbar()
          positionToolbar()
        } else {
          hideToolbar()
        }
      }, 10)
    })

    document.addEventListener('mousedown', (e) => {
      if (!element.contains(e.target) && (!toolbar || !toolbar.contains(e.target))) {
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

// Initialize demos when page loads
let retryCount = 0
const maxRetries = 50

function waitForElements() {
  const basicTextarea = document.getElementById('demo-content')
  const blogTextarea = document.getElementById('demo-blog-content')

  if (basicTextarea || blogTextarea) {
    initializeTextareaDemos()
  } else if (retryCount < maxRetries) {
    retryCount++
    setTimeout(waitForElements, 100)
  }
}

function initializeTextareaDemos() {
  // Basic textarea demo
  const basicTextarea = document.getElementById('demo-content')
  if (basicTextarea) {
    const basicEditor = new DemoMediumEditor(basicTextarea, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline']
      }
    })

    // Handle form submission
    const form = document.querySelector('.demo-textarea-form')
    const output = document.getElementById('demo-form-output')

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(form)
      const content = formData.get('content')

      output.innerHTML = `
        <h4>Form submitted with content:</h4>
        <div class="content-preview">${content}</div>
      `
      output.style.display = 'block'
    })
  }

  // Blog post demo
  const blogTextarea = document.getElementById('demo-blog-content')
  if (blogTextarea) {
    const blogEditor = new DemoMediumEditor(blogTextarea, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline']
      }
    })

    // Handle blog form submission
    const blogForm = document.querySelector('.demo-blog-form')
    const blogOutput = document.getElementById('demo-blog-output')

    blogForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(blogForm)
      const title = formData.get('title')
      const content = formData.get('content')

      if (!title.trim()) {
        alert('Please enter a title')
        return
      }

      blogOutput.innerHTML = `
        <h4>Blog post published:</h4>
        <div class="article-preview">
          <h3>${title}</h3>
          <div class="content">${content}</div>
        </div>
      `
      blogOutput.style.display = 'block'
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

.demo-textarea-form,
.demo-blog-form {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.demo-textarea-form textarea,
.demo-blog-form textarea {
  width: 100%;
  margin-bottom: 1rem;
  resize: vertical;
}

.demo-textarea-form button,
.demo-blog-form button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.demo-textarea-form button:hover,
.demo-blog-form button:hover {
  background: #0056b3;
}

.form-output {
  display: none;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.form-output h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 16px;
}

.content-preview,
.article-preview .content {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  margin-top: 0.5rem;
  line-height: 1.6;
}

.article-preview h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 20px;
}

.medium-editor-textarea {
  outline: none;
}

.medium-editor-textarea:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Toolbar styles */
.demo-simple-toolbar {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
