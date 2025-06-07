# Custom Toolbar

Customize the toolbar appearance and functionality to match your needs.

## FontAwesome Icons

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">FontAwesome icons toolbar - Select text to see professional icons:</div>
  <div class="demo-status" id="demo-status-fontawesome">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-fontawesome-editor" data-placeholder="Select text to see FontAwesome icons..." contenteditable="true">
    <p>This editor uses <strong>FontAwesome icons</strong> for a professional look.</p>
    <p>Try selecting this text to see the <em>beautiful icons</em> in action!</p>
  </div>
</div>

Use professional icons for all toolbar buttons:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  buttonLabels: 'fontawesome'
})
```

## Custom Button Labels

Define custom button content using text, HTML, or emojis:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: [
      {
        name: 'bold',
        contentDefault: '<strong>Bold</strong>'
      },
      {
        name: 'italic',
        contentDefault: '<em>Italic</em>'
      },
      {
        name: 'anchor',
        contentDefault: '🔗 Link'
      },
      {
        name: 'quote',
        contentDefault: '💬 Quote'
      },
      {
        name: 'h2',
        contentDefault: 'H2'
      }
    ]
  }
})
```

## Static Toolbar

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Static toolbar - Always visible, no need to select text:</div>
  <div class="demo-status" id="demo-status-static">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-static-container">
    <div class="demo-static-editor" data-placeholder="Toolbar is always visible above..." contenteditable="true">
      <p>The toolbar above is always visible, making it easy to access formatting options.</p>
      <p>You can start typing or click anywhere to begin editing!</p>
    </div>
  </div>
</div>

Make the toolbar always visible instead of appearing on text selection:

### HTML
```html
<div class="toolbar-container">
  <div class="static-editor" data-placeholder="Toolbar is always visible...">
    <p>The toolbar above is always visible, making it easy to access formatting options.</p>
  </div>
</div>
```

### TypeScript
```typescript
const editor = new MediumEditor('.static-editor', {
  toolbar: {
    static: true,
    sticky: true,
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3']
  }
})
```

### CSS
```css
.toolbar-container {
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.static-editor {
  min-height: 200px;
  padding: 1rem;
  border: none;
  outline: none;
}
```

## Minimal Toolbar

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">Minimal toolbar with only Bold and Italic:</div>
  <div class="demo-status" id="demo-status-minimal">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-minimal-toolbar-editor" data-placeholder="Select text for minimal toolbar..." contenteditable="true">
    <p>This editor has a <strong>minimal toolbar</strong> with only essential buttons.</p>
    <p>Perfect for <em>simple formatting</em> needs without clutter.</p>
  </div>
</div>

Create a simple toolbar with only essential buttons:

```typescript
const minimalEditor = new MediumEditor('.minimal-toolbar', {
  toolbar: {
    buttons: ['bold', 'italic']
  },
  buttonLabels: false // Use default labels
})
```

## Custom Button Styling

Style toolbar buttons with custom CSS:

### TypeScript
```typescript
const styledEditor = new MediumEditor('.styled-toolbar', {
  toolbar: {
    buttons: [
      {
        name: 'bold',
        contentDefault: '<b>B</b>',
        classList: ['custom-bold-btn']
      },
      {
        name: 'italic',
        contentDefault: '<i>I</i>',
        classList: ['custom-italic-btn']
      },
      {
        name: 'anchor',
        contentDefault: '🔗',
        classList: ['custom-link-btn']
      }
    ]
  }
})
```

### CSS
```css
.custom-bold-btn {
  background: #dc3545 !important;
  color: white !important;
  font-weight: bold;
  border-radius: 4px;
}

.custom-italic-btn {
  background: #28a745 !important;
  color: white !important;
  font-style: italic;
  border-radius: 4px;
}

.custom-link-btn {
  background: #007bff !important;
  color: white !important;
  border-radius: 4px;
}

.custom-bold-btn:hover,
.custom-italic-btn:hover,
.custom-link-btn:hover {
  opacity: 0.8;
  transform: scale(1.05);
  transition: all 0.2s ease;
}
```

## Toolbar Positioning

Control where the toolbar appears:

### Relative Container
```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor'],
    relativeContainer: document.querySelector('.editor-wrapper')
  }
})
```

### Disable Toolbar for Specific Elements
```html
<div class="editable">This element has a toolbar</div>
<div class="editable" data-disable-toolbar="true">
  This element has no toolbar
</div>
```

## Advanced Toolbar Configuration

Complete toolbar customization example:

```typescript
const advancedEditor = new MediumEditor('.advanced-toolbar', {
  toolbar: {
    // Button configuration
    buttons: [
      'bold',
      'italic',
      'underline',
      {
        name: 'anchor',
        contentDefault: '🔗 Link',
        classList: ['custom-link-button']
      },
      'h2',
      'h3',
      {
        name: 'quote',
        contentDefault: '❝ Quote',
        classList: ['custom-quote-button']
      }
    ],

    // Toolbar behavior
    static: false,
    sticky: false,
    updateOnEmptySelection: false,

    // Positioning
    relativeContainer: null,
    standardizeSelectionStart: false,

    // Appearance
    allowMultiParagraphSelection: true
  },

  // Button labels
  buttonLabels: false,

  // Disable return key in specific scenarios
  disableReturn: false,
  disableDoubleReturn: false
})
```

## Theme Integration

Combine toolbar customization with themes:

```typescript
// Import a theme
import 'ts-medium-editor/css/themes/flat.css'

const themedEditor = new MediumEditor('.themed-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'quote']
  },
  buttonLabels: 'fontawesome'
})
```

## Responsive Toolbar

Create a toolbar that adapts to screen size:

### CSS
```css
@media (max-width: 768px) {
  .medium-editor-toolbar {
    position: fixed !important;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto !important;
    border-radius: 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .medium-editor-toolbar-actions {
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }

  .medium-editor-button {
    flex: 1;
    margin: 0 2px;
    padding: 12px 8px;
    font-size: 16px;
  }
}
```

### TypeScript
```typescript
const responsiveEditor = new MediumEditor('.responsive-editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor'],
    static: window.innerWidth <= 768, // Static on mobile
    sticky: true
  }
})

// Update toolbar on resize
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    // Mobile: make toolbar static
    responsiveEditor.options.toolbar.static = true
  } else {
    // Desktop: make toolbar dynamic
    responsiveEditor.options.toolbar.static = false
  }
})
```

## Toolbar Events

Listen to toolbar-specific events:

```typescript
const editor = new MediumEditor('.editable')

// Toolbar shown
editor.subscribe('showToolbar', (event, editable) => {
  console.log('Toolbar shown for:', editable)
})

// Toolbar hidden
editor.subscribe('hideToolbar', (event, editable) => {
  console.log('Toolbar hidden for:', editable)
})

// Button clicked
editor.subscribe('editableClick', (event, editable) => {
  console.log('Editor clicked, toolbar may appear')
})
```

## Next Steps

- Learn about [Multiple Editors](/examples/multiple) with different toolbars
- Explore [Event Handling](/examples/events) for toolbar interactions
- Check out [Extensions](/examples/extensions) for custom toolbar buttons

<script>
// Initialize toolbar demos when the page loads
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

  function initializeToolbarDemos() {
    if (demoInitialized) return
    demoInitialized = true

    console.log('Initializing Medium Editor toolbar demos...')

    try {
            // FontAwesome toolbar demo
      const fontawesomeEditor = document.querySelector('.demo-fontawesome-editor')
      if (fontawesomeEditor) {
        console.log('Initializing FontAwesome toolbar demo')
        updateDemoStatus('fontawesome', 'loading', '🔄 Initializing FontAwesome toolbar...')

        // Check if FontAwesome is available
        const isFontAwesomeLoaded = document.querySelector('link[href*="font-awesome"]') !== null

        let editorConfig = {
          toolbar: {
            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
          }
        }

        if (isFontAwesomeLoaded) {
          editorConfig.buttonLabels = 'fontawesome'
          console.log('FontAwesome detected, using FA icons')
        } else {
          // Fallback to custom HTML icons if FontAwesome fails
          console.log('FontAwesome not detected, using custom icons')
          editorConfig.toolbar.buttons = [
            {
              name: 'bold',
              contentDefault: '<b>B</b>',
              aria: 'Bold'
            },
            {
              name: 'italic',
              contentDefault: '<i>I</i>',
              aria: 'Italic'
            },
            {
              name: 'underline',
              contentDefault: '<u>U</u>',
              aria: 'Underline'
            },
            {
              name: 'anchor',
              contentDefault: '🔗',
              aria: 'Link'
            },
            {
              name: 'h2',
              contentDefault: 'H2',
              aria: 'Heading 2'
            },
            {
              name: 'h3',
              contentDefault: 'H3',
              aria: 'Heading 3'
            },
            {
              name: 'quote',
              contentDefault: '❝',
              aria: 'Quote'
            }
          ]
        }

        const editor1 = new MediumEditor(fontawesomeEditor, editorConfig)

        // Verify toolbar was created properly
        setTimeout(() => {
          const toolbar = document.querySelector('.medium-editor-toolbar')
          if (toolbar) {
            const buttons = toolbar.querySelectorAll('.medium-editor-action')
            console.log(`Toolbar created with ${buttons.length} buttons`)
            if (isFontAwesomeLoaded) {
              updateDemoStatus('fontawesome', 'success', '✅ FontAwesome toolbar ready! Select text to see FA icons.')
            } else {
              updateDemoStatus('fontawesome', 'success', '✅ Custom icon toolbar ready! Select text to see icons.')
            }
          } else {
            updateDemoStatus('fontawesome', 'error', '❌ Toolbar creation failed')
          }
        }, 100)

        console.log('FontAwesome toolbar initialized:', editor1)
      }

      // Static toolbar demo
      const staticEditor = document.querySelector('.demo-static-editor')
      if (staticEditor) {
        console.log('Initializing static toolbar demo')
        updateDemoStatus('static', 'loading', '🔄 Initializing static toolbar...')

        const editor2 = new MediumEditor(staticEditor, {
          toolbar: {
            static: true,
            sticky: true,
            buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3']
          }
        })

        updateDemoStatus('static', 'success', '✅ Static toolbar ready! Always visible above.')
        console.log('Static toolbar initialized:', editor2)
      }

      // Minimal toolbar demo
      const minimalEditor = document.querySelector('.demo-minimal-toolbar-editor')
      if (minimalEditor) {
        console.log('Initializing minimal toolbar demo')
        updateDemoStatus('minimal', 'loading', '🔄 Initializing minimal toolbar...')

        const editor3 = new MediumEditor(minimalEditor, {
          toolbar: {
            buttons: ['bold', 'italic']
          },
          buttonLabels: false
        })

        updateDemoStatus('minimal', 'success', '✅ Minimal toolbar ready! Select text for Bold/Italic.')
        console.log('Minimal toolbar initialized:', editor3)
      }

      console.log('All toolbar demos initialized successfully')
    } catch (error) {
      console.error('Error initializing toolbar demos:', error)
      // Update all status indicators with error
      updateDemoStatus('fontawesome', 'error', '❌ Demo failed to load')
      updateDemoStatus('static', 'error', '❌ Demo failed to load')
      updateDemoStatus('minimal', 'error', '❌ Demo failed to load')
    }
  }

  // Try multiple initialization strategies
  function attemptInitialization() {
    loadMediumEditor()
      .then(() => {
        // Wait a bit for DOM to be ready
        setTimeout(initializeToolbarDemos, 100)
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

.demo-fontawesome-editor,
.demo-static-editor,
.demo-minimal-toolbar-editor {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-height: 120px;
  border: 2px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  cursor: text;
  transition: all 0.3s ease;
}

.demo-fontawesome-editor:hover,
.demo-static-editor:hover,
.demo-minimal-toolbar-editor:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.demo-fontawesome-editor:focus,
.demo-static-editor:focus,
.demo-minimal-toolbar-editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
}

/* Make sure the editors are editable */
.demo-fontawesome-editor[contenteditable="true"],
.demo-static-editor[contenteditable="true"],
.demo-minimal-toolbar-editor[contenteditable="true"] {
  border-color: #28a745;
}

/* Add a subtle indicator when editor is ready */
.demo-fontawesome-editor::before,
.demo-static-editor::before,
.demo-minimal-toolbar-editor::before {
  content: "✏️ Click to edit or select text for toolbar";
  position: absolute;
  top: -25px;
  left: 0;
  font-size: 12px;
  color: #6c757d;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.demo-container:hover .demo-fontawesome-editor::before,
.demo-container:hover .demo-static-editor::before,
.demo-container:hover .demo-minimal-toolbar-editor::before {
  opacity: 1;
}

.demo-static-container {
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  overflow: hidden;
}

/* Static toolbar styling */
.demo-static-container .medium-editor-toolbar {
  position: static !important;
  display: block !important;
  background: #f8f9fa;
  border: none;
  border-bottom: 1px solid #dee2e6;
  border-radius: 0;
  box-shadow: none;
}

.demo-static-container .medium-editor-action {
  color: #495057;
  background: transparent;
}

.demo-static-container .medium-editor-action:hover {
  background: #e9ecef;
  color: #495057;
}

/* FontAwesome toolbar styling */
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

/* Minimal toolbar specific styling */
.demo-minimal-toolbar-editor + .medium-editor-toolbar .medium-editor-action {
  padding: 10px 15px;
  font-size: 14px;
}

/* Custom button styling for fallback icons */
.demo-container .medium-editor-action {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
}

.demo-container .medium-editor-action b,
.demo-container .medium-editor-action i,
.demo-container .medium-editor-action u {
  font-style: normal;
  text-decoration: none;
  font-weight: bold;
}

.demo-container .medium-editor-action i {
  font-style: italic;
  font-weight: normal;
}

.demo-container .medium-editor-action u {
  text-decoration: underline;
}

/* Ensure FontAwesome icons are visible when loaded */
.demo-container .medium-editor-action .fa,
.demo-container .medium-editor-action .fas,
.demo-container .medium-editor-action .far,
.demo-container .medium-editor-action .fab {
  font-size: 14px;
  color: inherit;
}

/* Better spacing for custom icons */
.demo-container .medium-editor-action:not([class*="fa-"]) {
  font-size: 14px;
  line-height: 1;
}
</style>
