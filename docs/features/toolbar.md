# Toolbar

The toolbar is the heart of `ts-medium-editor`'s user interface, providing an intuitive way for users to format their text. It appears contextually when text is selected and offers a clean, Medium.com-inspired design.

## Overview

The toolbar extension provides a floating toolbar that appears when users select text. It can be customized with different buttons, positioning options, and behaviors to match your application's needs.

## Basic Usage

### Simple Toolbar Setup

```html
<div class="editable" data-placeholder="Select text to see the toolbar...">
  <p>This is a <strong>basic editor</strong> with a <em>customizable toolbar</em>.</p>
  <p>Select any text to see the formatting options appear!</p>
</div>
```

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

### Real-World Blog Editor

```html
<article class="blog-post">
  <h1 class="post-title" data-placeholder="Enter your blog title...">
    How to Build Amazing Web Applications
  </h1>
  <div class="post-content" data-placeholder="Write your blog post...">
    <p>Creating engaging web applications requires the right tools and techniques...</p>
    <blockquote>
      "The best way to predict the future is to create it." - Peter Drucker
    </blockquote>
    <p>In this article, we'll explore modern development practices.</p>
  </div>
</article>
```

```typescript
// Blog post editor with comprehensive toolbar
const blogEditor = new MediumEditor(['.post-title', '.post-content'], {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'anchor',
      'h2',
      'h3',
      'quote',
      'unorderedlist',
      'orderedlist'
    ]
  },
  buttonLabels: 'fontawesome',
  placeholder: {
    text: 'Start writing your story...',
    hideOnClick: true
  }
})
```

## Configuration Options

### Available Buttons

The toolbar supports the following built-in buttons (as implemented in the source code):

#### Text Formatting
- **`bold`**: Bold text formatting
- **`italic`**: Italic text formatting
- **`underline`**: Underline text formatting
- **`strikethrough`**: Strikethrough text formatting

#### Structure and Layout
- **`h2`**: Heading 2 formatting
- **`h3`**: Heading 3 formatting
- **`quote`**: Blockquote formatting
- **`anchor`**: Link creation and editing

#### Lists and Layout
- **`orderedlist`**: Numbered list
- **`unorderedlist`**: Bullet list
- **`indent`**: Increase indentation
- **`outdent`**: Decrease indentation

#### Alignment
- **`justifyLeft`**: Align text left
- **`justifyCenter`**: Center text
- **`justifyRight`**: Align text right
- **`justifyFull`**: Justify text

#### Script and Code
- **`superscript`**: Superscript formatting
- **`subscript`**: Subscript formatting
- **`pre`**: Code block formatting
- **`html`**: HTML editing

#### Media and Utilities
- **`image`**: Image insertion
- **`removeFormat`**: Remove all formatting

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

### FontAwesome Icon Support

The toolbar automatically detects if you want to use FontAwesome icons:

```typescript
const editor = new MediumEditor('.editable', {
  buttonLabels: 'fontawesome', // Use FontAwesome icons
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor']
  }
})
```

When `buttonLabels` is set to `'fontawesome'`, the toolbar will use FontAwesome CSS classes instead of text labels.

### Toolbar Positioning and Behavior

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],

    // Static toolbar (always visible)
    static: false, // Default: false (floating toolbar)

    // Toolbar alignment
    align: 'center', // 'left', 'center', 'right' - Default: 'center'

    // Sticky toolbar behavior
    sticky: false, // Default: false

    // Update toolbar for empty selections
    updateOnEmptySelection: false, // Default: false

    // Multi-paragraph selection handling
    allowMultiParagraphSelection: true, // Default: true

    // Selection standardization
    standardizeSelectionStart: false, // Default: false

    // Container for relative positioning
    relativeContainer: null, // Default: null (document.body)

    // Position offsets
    diffLeft: 0, // Horizontal offset in pixels
    diffTop: 0, // Vertical offset in pixels

    // Button styling classes
    firstButtonClass: 'medium-editor-button-first',
    lastButtonClass: 'medium-editor-button-last'
  }
})
```

## Static Toolbar

For applications that need a persistent toolbar, you can enable static mode:

### Word Processor Style

```html
<div class="document-editor">
  <div class="toolbar-container">
    <!-- Toolbar will appear here -->
  </div>
  <div class="document-content" data-placeholder="Start typing your document...">
    <h2>Document Title</h2>
    <p>This editor has a static toolbar that's always visible, similar to traditional word processors like Microsoft Word or Google Docs.</p>
    <p>The toolbar stays in place while you scroll through your document.</p>
  </div>
</div>
```

```typescript
const documentEditor = new MediumEditor('.document-content', {
  toolbar: {
    static: true,
    sticky: true,
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'anchor',
      'h2',
      'h3',
      'quote',
      'unorderedlist',
      'orderedlist',
      'justifyLeft',
      'justifyCenter',
      'justifyRight'
    ]
  },
  buttonLabels: 'fontawesome'
})
```

```css
.document-editor {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.toolbar-container {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px;
}

.document-content {
  padding: 40px;
  min-height: 500px;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.6;
}
```

### Mobile-Optimized Static Toolbar

```html
<div class="mobile-editor">
  <div class="mobile-content" data-placeholder="Tap to start writing...">
    <p>This editor is optimized for mobile devices with a bottom-positioned static toolbar.</p>
  </div>
</div>
```

```typescript
const mobileEditor = new MediumEditor('.mobile-content', {
  toolbar: {
    static: true,
    buttons: ['bold', 'italic', 'anchor', 'quote']
  }
})
```

```css
@media (max-width: 768px) {
  .medium-editor-toolbar {
    position: fixed !important;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    z-index: 1000;
  }

  .medium-editor-action {
    padding: 16px;
    font-size: 18px;
    flex: 1;
    text-align: center;
  }

  .mobile-content {
    padding-bottom: 80px; /* Space for fixed toolbar */
  }
}
```

**Benefits of Static Toolbar:**
- Always visible to users
- Consistent positioning
- Better for mobile interfaces
- Familiar word processor experience
- No need to select text to access formatting

## Custom Button Creation

### Adding Custom Buttons

Create custom buttons for specialized formatting needs:

#### Highlight Button Example

```html
<div class="highlight-editor" data-placeholder="Select text and use the highlight button...">
  <p>This editor has a custom <mark>highlight button</mark> that you can use to emphasize important text.</p>
  <p>Try selecting some text and clicking the highlight button in the toolbar!</p>
</div>
```

```typescript
const highlightEditor = new MediumEditor('.highlight-editor', {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      {
        name: 'highlight',
        aria: 'Highlight text',
        tagNames: ['mark'],
        contentDefault: '<b>H</b>',
        contentFA: '<i class="fa fa-paint-brush"></i>',
        classList: ['custom-highlight-button'],
        attrs: {
          'data-action': 'highlight'
        }
      },
      'anchor'
    ]
  }
})
```

```css
.custom-highlight-button {
  background-color: #ffeb3b !important;
  color: #333 !important;
  font-weight: bold;
}

.custom-highlight-button:hover {
  background-color: #ffc107 !important;
}

mark {
  background-color: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
}
```

#### Multiple Custom Buttons

```html
<div class="advanced-editor" data-placeholder="Try the custom formatting options...">
  <p>This editor includes several custom buttons:</p>
  <ul>
    <li><mark>Highlight</mark> for important text</li>
    <li><span style="background: #e3f2fd; padding: 2px 4px; border-radius: 3px;">Info boxes</span> for notes</li>
    <li><span style="color: #d32f2f; font-weight: bold;">Warning text</span> for alerts</li>
  </ul>
</div>
```

```typescript
const advancedEditor = new MediumEditor('.advanced-editor', {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      {
        name: 'highlight',
        aria: 'Highlight text',
        tagNames: ['mark'],
        contentDefault: '🖍️',
        classList: ['btn-highlight']
      },
      {
        name: 'info',
        aria: 'Info box',
        tagNames: ['span'],
        style: {
          prop: 'background-color',
          value: '#e3f2fd'
        },
        contentDefault: 'ℹ️',
        classList: ['btn-info']
      },
      {
        name: 'warning',
        aria: 'Warning text',
        tagNames: ['span'],
        style: {
          prop: 'color',
          value: '#d32f2f'
        },
        contentDefault: '⚠️',
        classList: ['btn-warning']
      },
      'anchor'
    ]
  }
})
```

### Custom Button Interface

```typescript
interface ToolbarButton {
  name: string
  action?: string
  aria?: string
  tagNames?: string[]
  style?: {
    prop: string
    value: string
  }
  useQueryState?: boolean
  contentDefault?: string
  contentFA?: string
  classList?: string[]
  attrs?: Record<string, string>
}
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
const toolbar = editor.getExtensionByName('toolbar') as Toolbar

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

  // Check state
  toolbar.checkState()

  // Get interaction elements
  const elements = toolbar.getInteractionElements()
}
```

### Toolbar Events

Listen for toolbar-related events:

```typescript
const editor = new MediumEditor('.editable')

// Toolbar becomes visible
editor.subscribe('showToolbar', (data, editable) => {
  console.log('Toolbar shown for element:', editable)
})

// Toolbar becomes hidden
editor.subscribe('hideToolbar', (data, editable) => {
  console.log('Toolbar hidden for element:', editable)
})

// Toolbar position changes
editor.subscribe('positionToolbar', (data, editable) => {
  console.log('Toolbar repositioned for element:', editable)
})
```

## Advanced Features

### Selection Handling

The toolbar includes sophisticated selection handling:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    // Allow toolbar for multi-paragraph selections
    allowMultiParagraphSelection: true,

    // Standardize selection to word boundaries
    standardizeSelectionStart: false,

    // Update toolbar even when selection is empty
    updateOnEmptySelection: false
  }
})
```

### Relative Container Positioning

Position the toolbar relative to a specific container:

```typescript
const container = document.getElementById('editor-container')
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],
    relativeContainer: container,
    diffLeft: 10, // 10px offset from left
    diffTop: -5 // 5px offset up
  }
})
```

## Button State Management

### Automatic State Updates

The toolbar automatically updates button states based on the current selection:

```typescript
// Bold button will appear active when cursor is in bold text
// Italic button will appear active when cursor is in italic text
// etc.
```

### Manual State Updates

```typescript
const toolbar = editor.getExtensionByName('toolbar') as Toolbar
toolbar.updateButtonStates()
```

## Styling the Toolbar

### CSS Classes

The toolbar uses these CSS classes:

```css
/* Main toolbar container */
.medium-editor-toolbar {
  background: #242424;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 3px #ccc;
  position: absolute;
  z-index: 1000;
}

/* Static toolbar */
.medium-editor-toolbar[data-static-toolbar="true"] {
  position: static;
  display: block;
}

/* Individual buttons */
.medium-editor-action {
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
.medium-editor-action:hover {
  background-color: #57ad68;
  color: #fff;
}

/* Active button state */
.medium-editor-button-active {
  background-color: #57ad68;
  color: #fff;
}

/* First and last button styling */
.medium-editor-button-first {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.medium-editor-button-last {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
```

### Custom Themes

```css
/* Dark theme */
.dark-theme .medium-editor-toolbar {
  background: #1a1a1a;
  border-color: #333;
}

.dark-theme .medium-editor-action {
  color: #fff;
}

.dark-theme .medium-editor-action:hover {
  background-color: #0066cc;
}

/* Light theme */
.light-theme .medium-editor-toolbar {
  background: #ffffff;
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.light-theme .medium-editor-action {
  color: #333;
}

.light-theme .medium-editor-action:hover {
  background-color: #f5f5f5;
}
```

## Mobile Optimization

### Touch-Friendly Configuration

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline'],
    static: true, // Better for mobile devices
    allowMultiParagraphSelection: false
  }
})
```

### Responsive Toolbar

```css
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

  .medium-editor-action {
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
// Title attributes for screen readers
// Proper button semantics
```

### Keyboard Navigation

- **Tab**: Navigate between toolbar buttons
- **Enter/Space**: Activate focused button
- **Escape**: Close toolbar and return focus to editor

## Troubleshooting

### Common Issues

**Toolbar not appearing:**
```typescript
// Ensure toolbar is enabled and has buttons
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic'] // Must have at least one button
  }
})
```

**Buttons not working:**
```typescript
// Verify toolbar extension is loaded
const toolbar = editor.getExtensionByName('toolbar')
if (toolbar) {
  console.log('Toolbar loaded successfully')
}
else {
  console.log('Toolbar extension not found')
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

## Best Practices

1. **Keep button sets focused**: Don't overwhelm users with too many options
2. **Use consistent button ordering**: Group related functions together
3. **Consider your audience**: Use FontAwesome icons for familiar interfaces
4. **Test on mobile**: Ensure touch targets are appropriately sized
5. **Provide feedback**: Use active states to show current formatting

## Next Steps

- Learn about [Placeholder](/features/placeholder) functionality
- Explore [Links and Anchors](/features/links) for hyperlink creation
- Check out [Extensions](/extensions) for advanced toolbar customization
- See [API Reference](/api) for complete toolbar methods
