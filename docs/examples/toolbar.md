# Custom Toolbar

Customize the toolbar appearance and functionality to match your needs.

## FontAwesome Icons

### Interactive Demo

<div class="demo-container">
  <div class="demo-label">FontAwesome icons toolbar - Select text to see professional icons:</div>
  <div class="demo-fontawesome-editor" data-placeholder="Select text to see FontAwesome icons...">
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
  <div class="demo-static-container">
    <div class="demo-static-editor" data-placeholder="Toolbar is always visible above...">
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
  <div class="demo-minimal-toolbar-editor" data-placeholder="Select text for minimal toolbar...">
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
import 'ts-medium-editor/dist/css/themes/flat.css'

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
  document.addEventListener('DOMContentLoaded', () => {
    // Load Medium Editor and FontAwesome if not already loaded
    if (typeof window.MediumEditor === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = initializeToolbarDemos
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
      initializeToolbarDemos()
    }
  })

  function initializeToolbarDemos() {
    // FontAwesome toolbar demo
    if (document.querySelector('.demo-fontawesome-editor')) {
      new MediumEditor('.demo-fontawesome-editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
        },
        buttonLabels: 'fontawesome'
      })
    }

    // Static toolbar demo
    if (document.querySelector('.demo-static-editor')) {
      new MediumEditor('.demo-static-editor', {
        toolbar: {
          static: true,
          sticky: true,
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3']
        }
      })
    }

    // Minimal toolbar demo
    if (document.querySelector('.demo-minimal-toolbar-editor')) {
      new MediumEditor('.demo-minimal-toolbar-editor', {
        toolbar: {
          buttons: ['bold', 'italic']
        },
        buttonLabels: false
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

.demo-fontawesome-editor,
.demo-static-editor,
.demo-minimal-toolbar-editor {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  min-height: 120px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.demo-fontawesome-editor:focus,
.demo-static-editor:focus,
.demo-minimal-toolbar-editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
</style>