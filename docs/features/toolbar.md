# Toolbar

The toolbar is the heart of TypeScript Medium Editor's user interface, providing an intuitive way for users to format their text. It appears contextually when text is selected and offers a clean, Medium.com-inspired design.

## Overview

The toolbar extension provides a floating toolbar that appears when users select text. It can be customized with different buttons, positioning options, and behaviors to match your application's needs.

## Basic Usage

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

## Configuration Options

### Available Buttons

The toolbar supports the following built-in buttons (as implemented in the source code):

- **`bold`**: Bold text formatting (`<b>`)
- **`italic`**: Italic text formatting (`<i>`)
- **`underline`**: Underline text formatting (`<u>`)
- **`anchor`**: Link creation and editing (`<a>`)
- **`h2`**: Heading 2 formatting (`<h2>`)
- **`h3`**: Heading 3 formatting (`<h3>`)
- **`quote`**: Blockquote formatting (`<blockquote>`)

**Note**: These are the only buttons currently implemented in the core toolbar extension. Additional buttons would need to be implemented as custom extensions.

### Button Configuration

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    // Specify which buttons to show
    buttons: ['bold', 'italic', 'underline'],

    // Custom button order
    buttons: ['h2', 'h3', 'quote', 'bold', 'italic', 'anchor']
  }
})
```

### Toolbar Behavior

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],

    // Show toolbar only when text is selected (default: false)
    static: false,

    // Toolbar alignment (default: 'center')
    align: 'center', // 'left', 'center', 'right'

    // Don't stick toolbar to top when scrolling (default: false)
    sticky: false,

    // Hide toolbar when selection is empty (default: false)
    updateOnEmptySelection: false
  }
})
```

The toolbar extension supports advanced selection handling through the `allowMultiParagraphSelection` option which controls whether the toolbar appears for selections spanning multiple paragraphs.

## Static Toolbar

For applications that need a persistent toolbar, you can enable static mode:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    static: true,
    buttons: ['bold', 'italic', 'underline', 'anchor']
  }
})
```

**Benefits of Static Toolbar:**
- Always visible to users
- Consistent positioning
- Better for mobile interfaces
- Familiar word processor experience

## Toolbar Positioning

### Alignment Options

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],

    // Toolbar alignment relative to selection
    align: 'center', // 'left', 'center', 'right'

    // Container for relative positioning
    relativeContainer: document.getElementById('editor-container')
  }
})
```

### Advanced Positioning

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],

    // Toolbar alignment
    align: 'center', // 'left', 'center', 'right'

    // Static positioning (toolbar always visible)
    static: true,

    // Advanced selection and positioning options
    allowMultiParagraphSelection: false, // Hide toolbar for multi-paragraph selections
    standardizeSelectionStart: true, // Snap selection to word boundaries
    relativeContainer: document.querySelector('.editor-container'), // Position relative to container
    diffLeft: 10, // Horizontal offset in pixels
    diffTop: -5 // Vertical offset in pixels
  }
})
```

## Disabling the Toolbar

To disable the toolbar completely:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: false
})
```

## Programmatic Control

### Accessing the Toolbar

```typescript
const editor = new MediumEditor('.editable')
const toolbar = editor.getExtensionByName('toolbar')

if (toolbar) {
  // Manually show toolbar
  toolbar.showToolbar()

  // Manually hide toolbar
  toolbar.hideToolbar()

  // Update button states
  toolbar.updateButtonStates()

  // Reposition toolbar
  toolbar.positionToolbar()

  // Get toolbar element
  const toolbarElement = toolbar.getToolbarElement()

  // Check toolbar state
  toolbar.checkState()
}
```

**Note**: These methods are available in the current toolbar implementation as verified in the source code.

### Toolbar Events

Listen for toolbar-related events:

```typescript
const editor = new MediumEditor('.editable')

// Toolbar becomes visible
editor.subscribe('showToolbar', (event, editable) => {
  console.log('Toolbar shown for element:', editable)
})

// Toolbar becomes hidden
editor.subscribe('hideToolbar', (event, editable) => {
  console.log('Toolbar hidden for element:', editable)
})

// Toolbar position changes
editor.subscribe('positionToolbar', (event, editable) => {
  console.log('Toolbar repositioned for element:', editable)
})
```

## Custom Buttons

### Adding Custom Buttons

```typescript
import { Extension } from 'ts-medium-editor'

class CustomToolbarButtons extends Extension {
  name = 'customToolbarButtons'

  init() {
    const toolbar = this.base.getExtensionByName('toolbar')
    if (!toolbar)
      return

    // Add strikethrough button
    toolbar.addButton({
      name: 'strikethrough',
      aria: 'Strikethrough',
      tagNames: ['s', 'strike'],
      contentDefault: '<b>S</b>',
      action: (event) => {
        this.base.execAction('strikethrough')
      }
    })

    // Add code button
    toolbar.addButton({
      name: 'code',
      aria: 'Code',
      tagNames: ['code'],
      contentDefault: '<b>&lt;/&gt;</b>',
      action: (event) => {
        this.wrapSelection('code')
      }
    })
  }

  private wrapSelection(tagName: string) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    if (selectedText) {
      const wrapper = document.createElement(tagName)
      wrapper.textContent = selectedText
      range.deleteContents()
      range.insertNode(wrapper)
      selection.removeAllRanges()
    }
  }
}

// Use the extension
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'strikethrough', 'code']
  },
  extensions: {
    customToolbarButtons: new CustomToolbarButtons()
  }
})
```

### Button Configuration Interface

```typescript
interface ButtonOptions {
  name: string // Unique button identifier
  aria: string // Accessibility label
  tagNames?: string[] // HTML tags this button creates
  contentDefault: string // Button content (HTML)
  contentFA?: string // FontAwesome icon (optional)
  action: (event: Event) => void // Click handler
}
```

## Styling the Toolbar

### CSS Classes

The toolbar uses these CSS classes for styling:

```css
/* Main toolbar container */
.medium-editor-toolbar {
  background: #242424;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 3px #ccc;
}

/* Individual buttons */
.medium-editor-button {
  background-color: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  margin: 0;
  padding: 15px;
  text-decoration: none;
  transition: background-color 0.2s ease-in;
}

/* Button hover state */
.medium-editor-button:hover {
  background-color: #57ad68;
  color: #fff;
}

/* Active button state */
.medium-editor-button-active {
  background-color: #57ad68;
  color: #fff;
}

/* Toolbar arrow */
.medium-toolbar-arrow-under:after {
  border-color: #242424 transparent transparent transparent;
  border-style: solid;
  border-width: 8px 8px 0 8px;
  content: "";
  display: block;
  height: 0;
  left: 50%;
  margin-left: -8px;
  position: absolute;
  top: 50px;
  width: 0;
}
```

### Custom Themes

Create custom toolbar themes:

```css
/* Dark theme */
.medium-editor-toolbar.dark-theme {
  background: #1a1a1a;
  border-color: #333;
}

.medium-editor-toolbar.dark-theme .medium-editor-button {
  color: #fff;
}

.medium-editor-toolbar.dark-theme .medium-editor-button:hover {
  background-color: #0066cc;
}

/* Light theme */
.medium-editor-toolbar.light-theme {
  background: #ffffff;
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.medium-editor-toolbar.light-theme .medium-editor-button {
  color: #333;
}

.medium-editor-toolbar.light-theme .medium-editor-button:hover {
  background-color: #f5f5f5;
}
```

## Mobile Optimization

### Touch-Friendly Configuration

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],

    // Better for mobile devices
    static: true,

    // Larger touch targets
    allowMultiParagraphSelection: false
  }
})
```

### Responsive Toolbar

```css
/* Mobile-specific toolbar styles */
@media (max-width: 768px) {
  .medium-editor-toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }

  .medium-editor-button {
    padding: 20px;
    font-size: 18px;
  }
}
```

## Accessibility

### ARIA Support

The toolbar includes built-in accessibility features:

```typescript
// Buttons automatically include ARIA attributes
toolbar.addButton({
  name: 'custom',
  aria: 'Apply custom formatting', // Screen reader label
  contentDefault: '<b>C</b>',
  action: (event) => {
    // Button action
  }
})
```

### Keyboard Navigation

- **Tab**: Navigate between toolbar buttons
- **Enter/Space**: Activate focused button
- **Escape**: Close toolbar and return focus to editor

## Performance Considerations

### Efficient Button Updates

```typescript
// Debounce button state updates for better performance
class OptimizedToolbar extends Extension {
  name = 'optimizedToolbar'
  private updateTimeout: number | null = null

  init() {
    this.base.subscribe('editableInput', this.scheduleUpdate.bind(this))
  }

  private scheduleUpdate() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    this.updateTimeout = window.setTimeout(() => {
      const toolbar = this.base.getExtensionByName('toolbar')
      toolbar?.updateButtonStates()
    }, 100)
  }
}
```

## Troubleshooting

### Common Issues

**Toolbar not appearing:**
```typescript
// Ensure toolbar is enabled
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic'] // Must have at least one button
  }
})

// Check for text selection
editor.subscribe('editableInput', () => {
  console.log('Selection:', window.getSelection()?.toString())
})
```

**Buttons not working:**
```typescript
// Verify button configuration
const toolbar = editor.getExtensionByName('toolbar')
if (toolbar) {
  console.log('Toolbar buttons:', toolbar.getButtons())
}
```

**Positioning issues:**
```typescript
// Use relative container for better positioning
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic'],
    relativeContainer: document.querySelector('.editor-container')
  }
})
```

## Next Steps

- Learn about [Placeholder](/features/placeholder) functionality
- Explore [Custom Extensions](/extensions) for advanced toolbar customization
- Check out [Custom Extensions](/advanced/custom-extensions) for complex toolbar scenarios
- See [API Reference](/api) for complete toolbar methods
