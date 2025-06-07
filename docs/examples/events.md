# Event Handling

Listen to editor events for real-time updates and custom functionality.

## Basic Event Listening

```typescript
const editor = new MediumEditor('.editable')

// Content change events
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
})

// Focus and blur events
editor.subscribe('focus', (event, editable) => {
  console.log('Editor focused')
})

editor.subscribe('blur', (event, editable) => {
  console.log('Editor blurred')
})
```

## Real-Time Word Counter

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Live word counter - Start typing to see real-time statistics:</div>
  <div class="demo-word-counter">
    <div class="demo-counter-editor" data-placeholder="Start typing to see the word count...">
      <p>Type here and watch the word count update in real-time!</p>
    </div>

    <div class="demo-stats-panel">
      <div class="demo-stat">
        <span class="demo-stat-label">Words:</span>
        <span id="demo-word-count">0</span>
      </div>
      <div class="demo-stat">
        <span class="demo-stat-label">Characters:</span>
        <span id="demo-char-count">0</span>
      </div>
      <div class="demo-stat">
        <span class="demo-stat-label">Reading time:</span>
        <span id="demo-reading-time">0 min</span>
      </div>
    </div>
  </div>
</div>

### HTML
```html
<div class="word-counter-demo">
  <div class="editor-with-counter" data-placeholder="Start typing to see the word count...">
    <p>Type here and watch the word count update in real-time!</p>
  </div>

  <div class="stats-panel">
    <div class="stat">
      <span class="stat-label">Words:</span>
      <span id="word-count">0</span>
    </div>
    <div class="stat">
      <span class="stat-label">Characters:</span>
      <span id="char-count">0</span>
    </div>
    <div class="stat">
      <span class="stat-label">Reading time:</span>
      <span id="reading-time">0 min</span>
    </div>
  </div>
</div>
```

### TypeScript
```typescript
const counterEditor = new MediumEditor('.editor-with-counter', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor', 'quote']
  }
})

// Update statistics in real-time
counterEditor.subscribe('editableInput', (event, editable) => {
  updateStats(editable)
})

function updateStats(editable) {
  const text = editable.textContent.trim()
  const words = text ? text.split(/\s+/).length : 0
  const chars = text.length
  const readingTime = Math.ceil(words / 200) // 200 words per minute

  document.getElementById('word-count').textContent = words
  document.getElementById('char-count').textContent = chars
  document.getElementById('reading-time').textContent = `${readingTime} min`
}

// Initialize stats
document.addEventListener('DOMContentLoaded', () => {
  const editable = document.querySelector('.editor-with-counter')
  updateStats(editable)
})
```

### CSS
```css
.word-counter-demo {
  max-width: 800px;
  margin: 0 auto;
}

.editor-with-counter {
  min-height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.stats-panel {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 4px;
}

.stat span:last-child {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}
```

## Auto-Save Implementation

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Auto-save demo - Content saves automatically after you stop typing:</div>
  <div class="demo-auto-save-editor" data-placeholder="Your content is automatically saved...">
    <p>This editor automatically saves your content to localStorage after you stop typing.</p>
  </div>

  <div id="demo-save-status" class="demo-save-status">
    <span class="demo-status-text">Ready</span>
  </div>
</div>

### HTML
```html
<div class="auto-save-editor" data-placeholder="Your content is automatically saved...">
  <p>This editor automatically saves your content to localStorage after you stop typing.</p>
</div>

<div id="save-status" class="save-status">
  <span class="status-text">Ready</span>
</div>
```

### TypeScript
```typescript
const autoSaveEditor = new MediumEditor('.auto-save-editor')

let saveTimeout = null
let lastSaved = null

// Auto-save functionality
autoSaveEditor.subscribe('editableInput', (event, editable) => {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // Show "typing" status
  updateSaveStatus('typing', 'Typing...')

  // Set new timeout for auto-save
  saveTimeout = setTimeout(() => {
    saveContent(editable.innerHTML)
  }, 2000) // Save after 2 seconds of inactivity
})

function saveContent(content) {
  // Simulate API call
  updateSaveStatus('saving', 'Saving...')

  setTimeout(() => {
    // Save to localStorage (replace with your API call)
    localStorage.setItem('editor-content', content)
    lastSaved = new Date()

    updateSaveStatus('saved', `Saved at ${lastSaved.toLocaleTimeString()}`)
  }, 500)
}

function updateSaveStatus(status, text) {
  const statusElement = document.getElementById('save-status')
  const textElement = statusElement.querySelector('.status-text')

  statusElement.className = `save-status ${status}`
  textElement.textContent = text
}

// Load saved content on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedContent = localStorage.getItem('editor-content')
  if (savedContent) {
    document.querySelector('.auto-save-editor').innerHTML = savedContent
    updateSaveStatus('loaded', 'Content loaded from previous session')
  }
})
```

### CSS
```css
.auto-save-editor {
  min-height: 150px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.save-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  transition: all 0.3s ease;
}

.save-status.typing {
  background: #fff3cd;
  color: #856404;
}

.save-status.saving {
  background: #d1ecf1;
  color: #0c5460;
}

.save-status.saved {
  background: #d4edda;
  color: #155724;
}

.save-status.loaded {
  background: #e2e3e5;
  color: #383d41;
}
```

## Form Validation

### HTML
```html
<form class="validated-form">
  <div class="form-group">
    <label for="title">Title (required)</label>
    <div class="title-editor" data-placeholder="Enter article title...">
      <h2>Sample Article Title</h2>
    </div>
    <div class="validation-message" id="title-error"></div>
  </div>

  <div class="form-group">
    <label for="content">Content (minimum 50 words)</label>
    <div class="content-editor" data-placeholder="Write your article content...">
      <p>Start writing your article content here...</p>
    </div>
    <div class="validation-message" id="content-error"></div>
  </div>

  <button type="submit" id="submit-btn" disabled>Publish Article</button>
</form>
```

### TypeScript
```typescript
const titleEditor = new MediumEditor('.title-editor', {
  toolbar: false,
  disableReturn: true
})

const contentEditor = new MediumEditor('.content-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor', 'quote']
  }
})

// Validation state
const validation = {
  title: false,
  content: false
}

// Validate title
titleEditor.subscribe('editableInput', (event, editable) => {
  validateTitle(editable)
  updateSubmitButton()
})

// Validate content
contentEditor.subscribe('editableInput', (event, editable) => {
  validateContent(editable)
  updateSubmitButton()
})

function validateTitle(editable) {
  const title = editable.textContent.trim()
  const errorElement = document.getElementById('title-error')

  if (title.length === 0) {
    showError(errorElement, 'Title is required')
    validation.title = false
  } else if (title.length < 5) {
    showError(errorElement, 'Title must be at least 5 characters')
    validation.title = false
  } else if (title.length > 100) {
    showError(errorElement, 'Title must be less than 100 characters')
    validation.title = false
  } else {
    hideError(errorElement)
    validation.title = true
  }
}

function validateContent(editable) {
  const text = editable.textContent.trim()
  const words = text ? text.split(/\s+/).length : 0
  const errorElement = document.getElementById('content-error')

  if (words === 0) {
    showError(errorElement, 'Content is required')
    validation.content = false
  } else if (words < 50) {
    showError(errorElement, `Content must be at least 50 words (currently ${words})`)
    validation.content = false
  } else {
    hideError(errorElement)
    validation.content = true
  }
}

function showError(element, message) {
  element.textContent = message
  element.style.display = 'block'
}

function hideError(element) {
  element.style.display = 'none'
}

function updateSubmitButton() {
  const submitBtn = document.getElementById('submit-btn')
  const isValid = validation.title && validation.content

  submitBtn.disabled = !isValid
  submitBtn.textContent = isValid ? 'Publish Article' : 'Please complete all fields'
}

// Handle form submission
document.querySelector('.validated-form').addEventListener('submit', (event) => {
  event.preventDefault()

  if (validation.title && validation.content) {
    alert('Article published successfully!')
  }
})
```

## Collaborative Editing Simulation

### HTML
```html
<div class="collaborative-demo">
  <div class="user-info">
    <span>You are: <strong id="current-user">User 1</strong></span>
    <button id="switch-user">Switch to User 2</button>
  </div>

  <div class="collaborative-editor" data-placeholder="Start collaborative editing...">
    <p>This simulates collaborative editing. Switch users to see different cursors and edits.</p>
  </div>

  <div class="activity-log">
    <h4>Activity Log</h4>
    <div id="activity-list"></div>
  </div>
</div>
```

### TypeScript
```typescript
const collaborativeEditor = new MediumEditor('.collaborative-editor')

let currentUser = 'User 1'
let activityLog = []

// Track all editing activity
collaborativeEditor.subscribe('editableInput', (event, editable) => {
  logActivity('edited content', currentUser)
})

collaborativeEditor.subscribe('focus', (event, editable) => {
  logActivity('started editing', currentUser)
})

collaborativeEditor.subscribe('blur', (event, editable) => {
  logActivity('stopped editing', currentUser)
})

// User switching
document.getElementById('switch-user').addEventListener('click', () => {
  currentUser = currentUser === 'User 1' ? 'User 2' : 'User 1'
  document.getElementById('current-user').textContent = currentUser

  // Simulate user joining
  logActivity('joined the document', currentUser)
})

function logActivity(action, user) {
  const timestamp = new Date().toLocaleTimeString()
  const activity = {
    user,
    action,
    timestamp
  }

  activityLog.unshift(activity)

  // Keep only last 10 activities
  if (activityLog.length > 10) {
    activityLog = activityLog.slice(0, 10)
  }

  updateActivityLog()
}

function updateActivityLog() {
  const listElement = document.getElementById('activity-list')

  listElement.innerHTML = activityLog.map(activity => `
    <div class="activity-item ${activity.user.toLowerCase().replace(' ', '-')}">
      <span class="user">${activity.user}</span>
      <span class="action">${activity.action}</span>
      <span class="time">${activity.timestamp}</span>
    </div>
  `).join('')
}
```

### CSS
```css
.collaborative-demo {
  max-width: 800px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.collaborative-editor {
  min-height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.activity-log {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 14px;
}

.activity-item.user-1 {
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.activity-item.user-2 {
  background: #f3e5f5;
  border-left: 3px solid #9c27b0;
}

.user {
  font-weight: bold;
}

.time {
  color: #6c757d;
  font-size: 12px;
}
```

## Next Steps

- Explore [Extensions](/examples/extensions) for advanced event handling
- Check out [Real-World Use Cases](/examples/real-world) for complete implementations
- Learn about [Custom Toolbar](/examples/toolbar) event integration

<script>
// Initialize events demos when the page loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Load Medium Editor if not already loaded
    if (typeof window.MediumEditor === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = initializeEventsDemos
      document.head.appendChild(script)

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      document.head.appendChild(link)
    } else {
      initializeEventsDemos()
    }
  })

  function initializeEventsDemos() {
    // Word counter demo
    if (document.querySelector('.demo-counter-editor')) {
      const counterEditor = new MediumEditor('.demo-counter-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'anchor', 'quote']
        }
      })

      // Update statistics in real-time
      counterEditor.subscribe('editableInput', (event, editable) => {
        updateDemoStats(editable)
      })

      // Initialize stats
      updateDemoStats(document.querySelector('.demo-counter-editor'))
    }

    // Auto-save demo
    if (document.querySelector('.demo-auto-save-editor')) {
      const autoSaveEditor = new MediumEditor('.demo-auto-save-editor')
      let demoSaveTimeout = null

      autoSaveEditor.subscribe('editableInput', (event, editable) => {
        // Clear existing timeout
        if (demoSaveTimeout) {
          clearTimeout(demoSaveTimeout)
        }

        // Show "typing" status
        updateDemoSaveStatus('typing', 'Typing...')

        // Set new timeout for auto-save
        demoSaveTimeout = setTimeout(() => {
          saveDemoContent(editable.innerHTML)
        }, 2000)
      })
    }
  }

  function updateDemoStats(editable) {
    const text = editable.textContent.trim()
    const words = text ? text.split(/\s+/).length : 0
    const chars = text.length
    const readingTime = Math.ceil(words / 200)

    const wordCountEl = document.getElementById('demo-word-count')
    const charCountEl = document.getElementById('demo-char-count')
    const readingTimeEl = document.getElementById('demo-reading-time')

    if (wordCountEl) wordCountEl.textContent = words
    if (charCountEl) charCountEl.textContent = chars
    if (readingTimeEl) readingTimeEl.textContent = `${readingTime} min`
  }

  function saveDemoContent(content) {
    updateDemoSaveStatus('saving', 'Saving...')

    setTimeout(() => {
      localStorage.setItem('demo-editor-content', content)
      const now = new Date()
      updateDemoSaveStatus('saved', `Saved at ${now.toLocaleTimeString()}`)
    }, 500)
  }

  function updateDemoSaveStatus(status, text) {
    const statusElement = document.getElementById('demo-save-status')
    const textElement = statusElement.querySelector('.demo-status-text')

    if (statusElement && textElement) {
      statusElement.className = `demo-save-status ${status}`
      textElement.textContent = text
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

.demo-counter-editor,
.demo-auto-save-editor {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-height: 120px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.demo-counter-editor:focus,
.demo-auto-save-editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.demo-word-counter {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
}

.demo-stats-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  min-width: 150px;
}

.demo-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.demo-stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.demo-stat span:last-child {
  font-weight: bold;
  color: #007bff;
}

.demo-save-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  transition: all 0.3s ease;
  background: #e2e3e5;
  color: #383d41;
}

.demo-save-status.typing {
  background: #fff3cd;
  color: #856404;
}

.demo-save-status.saving {
  background: #d1ecf1;
  color: #0c5460;
}

.demo-save-status.saved {
  background: #d4edda;
  color: #155724;
}

@media (max-width: 768px) {
  .demo-word-counter {
    grid-template-columns: 1fr;
  }

  .demo-stats-panel {
    flex-direction: row;
    justify-content: space-around;
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