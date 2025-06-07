# Text Formatting

`ts-medium-editor` provides comprehensive text formatting capabilities that allow users to create rich, styled content. The formatting system supports both user interactions through the toolbar and programmatic control via the API.

## Overview

The editor supports standard text formatting options including bold, italic, underline, headings, and blockquotes. All formatting is applied using semantic HTML elements for better accessibility and SEO.

## Basic Formatting

### Bold Text

Apply bold formatting to emphasize important text.

```typescript
// Programmatic bold formatting
editor.execAction('bold')

// Keyboard shortcut: Ctrl/Cmd + B
```

**HTML Output:**
- Primary: `<strong>bold text</strong>`
- Alternative: `<b>bold text</b>`

**Usage Example:**
```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold']
  }
})

// Apply bold to selected text
editor.subscribe('editableInput', () => {
  // Bold formatting is automatically applied when button is clicked
})
```

### Italic Text

Apply italic formatting for emphasis or stylistic purposes.

```typescript
// Programmatic italic formatting
editor.execAction('italic')

// Keyboard shortcut: Ctrl/Cmd + I
```

**HTML Output:**
- Primary: `<em>italic text</em>`
- Alternative: `<i>italic text</i>`

### Underline Text

Apply underline formatting for additional emphasis.

```typescript
// Programmatic underline formatting
editor.execAction('underline')

// Keyboard shortcut: Ctrl/Cmd + U
```

**HTML Output:**
- `<u>underlined text</u>`

## Heading Formatting

### Heading 2 (H2)

Convert text to a second-level heading.

```typescript
// Programmatic H2 formatting
editor.execAction('h2')
```

**HTML Output:**
- `<h2>Heading Text</h2>`

**Use Cases:**
- Section titles
- Major topic divisions
- Article subsections

### Heading 3 (H3)

Convert text to a third-level heading.

```typescript
// Programmatic H3 formatting
editor.execAction('h3')
```

**HTML Output:**
- `<h3>Heading Text</h3>`

**Use Cases:**
- Subsection titles
- Topic subdivisions
- Detailed breakdowns

## Blockquotes

Transform text into blockquotes for citations, emphasis, or highlighting important information.

```typescript
// Programmatic quote formatting
editor.execAction('quote')
```

**HTML Output:**
- `<blockquote><p>quoted text</p></blockquote>`

**Use Cases:**
- Citations and references
- Highlighting key points
- Pull quotes
- Testimonials

## Programmatic Formatting

### Applying Formatting

```typescript
const editor = new MediumEditor('.editable')

// Apply formatting to selected text
function applyFormatting(format: string) {
  const success = editor.execAction(format)
  if (success) {
    console.log(`${format} formatting applied successfully`)
  }
  else {
    console.log(`Failed to apply ${format} formatting`)
  }
}

// Usage examples
applyFormatting('bold')
applyFormatting('italic')
applyFormatting('underline')
applyFormatting('h2')
applyFormatting('h3')
applyFormatting('quote')
```

### Checking Format State

```typescript
// Check if formatting is currently active
function isFormatActive(format: string): boolean {
  return editor.queryCommandState(format)
}

// Usage
if (isFormatActive('bold')) {
  console.log('Bold formatting is currently active')
}
```

### Toggle Formatting

```typescript
// Toggle formatting on/off
function toggleFormat(format: string) {
  if (isFormatActive(format)) {
    // Remove formatting
    editor.execAction(format) // This will toggle it off
  }
  else {
    // Apply formatting
    editor.execAction(format)
  }
}
```

## Custom Formatting

### Creating Custom Format Actions

```typescript
class CustomFormatting extends Extension {
  name = 'customFormatting'

  init() {
    // Add custom formatting methods to the editor
    this.base.customFormat = {
      strikethrough: this.applyStrikethrough.bind(this),
      highlight: this.applyHighlight.bind(this),
      code: this.applyCode.bind(this)
    }
  }

  applyStrikethrough() {
    this.wrapSelection('s', 'strikethrough')
  }

  applyHighlight() {
    this.wrapSelection('mark', 'highlight')
  }

  applyCode() {
    this.wrapSelection('code', 'code')
  }

  private wrapSelection(tagName: string, className?: string) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return false

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    if (selectedText) {
      const wrapper = document.createElement(tagName)
      if (className) {
        wrapper.className = className
      }
      wrapper.textContent = selectedText

      range.deleteContents()
      range.insertNode(wrapper)
      selection.removeAllRanges()

      return true
    }

    return false
  }
}

// Usage
const editor = new MediumEditor('.editable', {
  extensions: {
    customFormatting: new CustomFormatting()
  }
})

// Apply custom formatting
editor.customFormat.strikethrough()
editor.customFormat.highlight()
editor.customFormat.code()
```

## Keyboard Shortcuts

### Default Shortcuts

| Format | Windows/Linux | macOS | Action |
|--------|---------------|-------|---------|
| Bold | `Ctrl + B` | `Cmd + B` | `execAction('bold')` |
| Italic | `Ctrl + I` | `Cmd + I` | `execAction('italic')` |
| Underline | `Ctrl + U` | `Cmd + U` | `execAction('underline')` |

### Custom Keyboard Shortcuts

```typescript
const editor = new MediumEditor('.editable', {
  keyboardCommands: {
    commands: [
      {
        command: 'bold',
        key: 'B',
        meta: true,
        shift: false,
        alt: false
      },
      {
        command: 'italic',
        key: 'I',
        meta: true,
        shift: false,
        alt: false
      },
      {
        command: 'underline',
        key: 'U',
        meta: true,
        shift: false,
        alt: false
      },
      // Custom shortcut for H2
      {
        command: 'h2',
        key: '2',
        meta: true,
        shift: true,
        alt: false
      },
      // Custom shortcut for quote
      {
        command: 'quote',
        key: 'Q',
        meta: true,
        shift: true,
        alt: false
      }
    ]
  }
})
```

## Format Detection and State Management

### Automatic State Detection

```typescript
class FormatStateManager extends Extension {
  name = 'formatStateManager'

  init() {
    this.base.subscribe('editableInput', this.updateFormatStates.bind(this))
    this.base.subscribe('editableKeyup', this.updateFormatStates.bind(this))
  }

  private updateFormatStates() {
    const formats = ['bold', 'italic', 'underline']
    const states: { [key: string]: boolean } = {}

    formats.forEach((format) => {
      states[format] = this.base.queryCommandState(format)
    })

    // Update UI or trigger events based on format states
    this.base.trigger('formatStatesChanged', states)
  }
}

// Listen for format state changes
editor.subscribe('formatStatesChanged', (event, states) => {
  console.log('Current format states:', states)
  // Update custom UI elements
})
```

### Content-Based Format Detection

```typescript
class ContentFormatDetector extends Extension {
  name = 'contentFormatDetector'

  init() {
    this.base.subscribe('editableInput', this.detectFormats.bind(this))
  }

  private detectFormats() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer

    // Traverse up to find formatting elements
    let element = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as HTMLElement

    const formats = {
      bold: false,
      italic: false,
      underline: false,
      heading: null as string | null
    }

    while (element && element !== this.base.elements[0]) {
      const tagName = element.tagName?.toLowerCase()

      switch (tagName) {
        case 'strong':
        case 'b':
          formats.bold = true
          break
        case 'em':
        case 'i':
          formats.italic = true
          break
        case 'u':
          formats.underline = true
          break
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          formats.heading = tagName
          break
      }

      element = element.parentElement
    }

    this.base.trigger('formatsDetected', formats)
  }
}
```

## Styling Formatted Content

### Default Format Styles

```css
/* Bold formatting */
.medium-editor-element strong,
.medium-editor-element b {
  font-weight: 700;
}

/* Italic formatting */
.medium-editor-element em,
.medium-editor-element i {
  font-style: italic;
}

/* Underline formatting */
.medium-editor-element u {
  text-decoration: underline;
}

/* Headings */
.medium-editor-element h2 {
  font-size: 2em;
  font-weight: 600;
  margin: 0.83em 0;
  line-height: 1.2;
}

.medium-editor-element h3 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0;
  line-height: 1.3;
}

/* Blockquotes */
.medium-editor-element blockquote {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding: 0.5em 1em;
  font-style: italic;
  color: #666;
}
```

### Custom Format Styles

```css
/* Custom bold style */
.custom-theme .medium-editor-element strong {
  font-weight: 800;
  color: #2c3e50;
}

/* Custom italic style */
.custom-theme .medium-editor-element em {
  font-style: italic;
  color: #7f8c8d;
}

/* Custom heading styles */
.custom-theme .medium-editor-element h2 {
  font-family: 'Georgia', serif;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.3em;
}

.custom-theme .medium-editor-element h3 {
  font-family: 'Georgia', serif;
  color: #34495e;
  margin-top: 1.5em;
}

/* Custom blockquote style */
.custom-theme .medium-editor-element blockquote {
  border-left: 4px solid #3498db;
  background: #ecf0f1;
  border-radius: 0 4px 4px 0;
  font-family: 'Georgia', serif;
  position: relative;
}

.custom-theme .medium-editor-element blockquote:before {
  content: '"';
  font-size: 4em;
  color: #3498db;
  position: absolute;
  left: 0.1em;
  top: -0.1em;
  opacity: 0.3;
}
```

## Accessibility and Semantic HTML

### Proper Semantic Structure

```typescript
// The editor automatically uses semantic HTML elements
const semanticOutput = {
  bold: '<strong>important text</strong>', // Not <b>
  italic: '<em>emphasized text</em>', // Not <i>
  headings: '<h2>Section Title</h2>', // Proper heading hierarchy
  quotes: '<blockquote><p>quoted text</p></blockquote>' // Structured quotes
}
```

### ARIA Support

```typescript
// Add ARIA attributes for better accessibility
class AccessibleFormatting extends Extension {
  name = 'accessibleFormatting'

  init() {
    this.base.subscribe('formatStatesChanged', this.updateAriaStates.bind(this))
  }

  private updateAriaStates(event: Event, states: any) {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    // Update ARIA pressed states for toolbar buttons
    Object.keys(states).forEach((format) => {
      const button = toolbar.getButton(format)
      if (button) {
        button.setAttribute('aria-pressed', states[format].toString())
      }
    })
  }
}
```

## Performance Optimization

### Efficient Format Application

```typescript
class OptimizedFormatting extends Extension {
  name = 'optimizedFormatting'
  private formatQueue: string[] = []
  private processTimeout: number | null = null

  init() {
    // Override execAction for batched processing
    const originalExecAction = this.base.execAction.bind(this.base)

    this.base.execAction = (action: string, opts?: any) => {
      this.queueFormat(action)
      return originalExecAction(action, opts)
    }
  }

  private queueFormat(format: string) {
    this.formatQueue.push(format)

    if (this.processTimeout) {
      clearTimeout(this.processTimeout)
    }

    this.processTimeout = window.setTimeout(() => {
      this.processFormatQueue()
    }, 50)
  }

  private processFormatQueue() {
    // Process multiple format changes efficiently
    const uniqueFormats = [...new Set(this.formatQueue)]
    this.formatQueue = []

    // Batch DOM updates
    this.base.stopSelectionUpdates()

    // Apply formats
    uniqueFormats.forEach((format) => {
      // Efficient format processing
    })

    this.base.startSelectionUpdates()
  }
}
```

## Troubleshooting

### Common Formatting Issues

**Formatting not applying:**
```typescript
// Check if text is selected
const selection = window.getSelection()
if (!selection || selection.toString().length === 0) {
  console.log('No text selected for formatting')
}

// Verify editor is active
if (!editor.isActive()) {
  console.log('Editor is not active')
}
```

**Inconsistent format detection:**
```typescript
// Use content-based detection as fallback
function detectFormatFallback(format: string): boolean {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return false

  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer

  // Check parent elements for format tags
  let element = container.nodeType === Node.TEXT_NODE
    ? container.parentElement
    : container as HTMLElement

  while (element) {
    if (element.tagName?.toLowerCase() === format.toLowerCase()) {
      return true
    }
    element = element.parentElement
  }

  return false
}
```

**Format state synchronization:**
```typescript
// Manually sync format states
function syncFormatStates() {
  const toolbar = editor.getExtensionByName('toolbar')
  if (toolbar) {
    toolbar.updateButtonStates()
  }
}

// Call after programmatic content changes
editor.setContent('<p><strong>Bold text</strong></p>')
syncFormatStates()
```

## Next Steps

- Learn about [Links and Anchors](/features/links) for hyperlink formatting
- Explore [Events](/features/events) for format change notifications
- Check out [Custom Extensions](/extensions) for advanced formatting
- See [API Reference](/api) for complete formatting methods
