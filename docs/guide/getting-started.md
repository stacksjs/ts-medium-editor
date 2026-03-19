# Getting Started

ts-medium-editor is a modern TypeScript port of the popular Medium.com-style WYSIWYG editor. It provides a clean, extensible rich text editing experience.

## Installation

Install using your preferred package manager:

```bash
# Using bun (recommended)
bun add ts-medium-editor

# Using npm
npm install ts-medium-editor

# Using pnpm
pnpm add ts-medium-editor

# Using yarn
yarn add ts-medium-editor
```

## Basic Setup

### Import and Initialize

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'
import 'ts-medium-editor/css/themes/default.css'

// Initialize editor on an element
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: 'Tell your story...'
  }
})
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Editor</title>
  <link rel="stylesheet" href="node_modules/ts-medium-editor/css/medium-editor.css">
  <link rel="stylesheet" href="node_modules/ts-medium-editor/css/themes/default.css">
</head>
<body>
  <div class="editable">
    <p>Start typing here...</p>
  </div>

  <script type="module">
    import { MediumEditor } from 'ts-medium-editor'

    const editor = new MediumEditor('.editable', {
      placeholder: { text: 'Tell your story...' }
    })
  </script>
</body>
</html>
```

## Core Concepts

### Element Selection

You can initialize the editor on various element types:

```typescript
// By CSS selector
const editor = new MediumEditor('.editable')

// By element reference
const element = document.getElementById('my-editor')
const editor = new MediumEditor(element)

// Multiple elements
const editor = new MediumEditor([element1, element2])

// NodeList
const editors = document.querySelectorAll('.editable')
const editor = new MediumEditor(editors)
```

### Content Management

```typescript
// Get content
const html = editor.getContent()

// Set content
editor.setContent('<p>New content</p>')

// Reset to original content
editor.resetContent()

// Serialize all editors
const serialized = editor.serialize()
// { 'element-0': '<p>Content...</p>', 'element-1': '<p>...</p>' }
```

### Selection Management

```typescript
// Save current selection
editor.saveSelection()

// Restore saved selection
editor.restoreSelection()

// Export selection state
const state = editor.exportSelection()

// Import selection state
editor.importSelection(state)

// Select all content
editor.selectAllContents()
```

## Configuration Options

### Core Settings

```typescript
const editor = new MediumEditor('.editable', {
  // Active button class
  activeButtonClass: 'medium-editor-button-active',

  // Button label configuration
  buttonLabels: false, // or 'fontawesome' for icon labels

  // Toolbar show delay (ms)
  delay: 0,

  // Disable return key
  disableReturn: false,

  // Disable double return
  disableDoubleReturn: false,

  // Prevent extra spaces
  disableExtraSpaces: false,

  // Make editor read-only
  disableEditing: false,

  // Enable spellcheck
  spellcheck: true,
})
```

### Auto Features

```typescript
const editor = new MediumEditor('.editable', {
  // Auto-convert URLs to links
  autoLink: true,

  // Open links in new tab
  targetBlank: true,

  // Enable image drag-and-drop
  imageDragging: true,

  // Enable file drag-and-drop
  fileDragging: true,
})
```

## Event Handling

### Subscribe to Events

```typescript
const editor = new MediumEditor('.editable')

// Content change events
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
})

// Selection change events
editor.subscribe('editableKeyup', (event, editable) => {
  const selection = editor.exportSelection()
  console.log('Cursor position:', selection)
})

// Focus events
editor.subscribe('focus', (event, editable) => {
  console.log('Editor focused')
})

editor.subscribe('blur', (event, editable) => {
  console.log('Editor blurred')
})
```

### Unsubscribe from Events

```typescript
const handler = (event, editable) => {
  console.log('Input received')
}

editor.subscribe('editableInput', handler)

// Later...
editor.unsubscribe('editableInput', handler)
```

## Editor Lifecycle

### Activate/Deactivate

```typescript
// Deactivate editor (make read-only)
editor.deactivate()

// Reactivate editor
editor.activate()

// Check if active
if (editor.isActive()) {
  // Editor is active
}
```

### Destroy

```typescript
// Clean up editor
editor.destroy()
```

## TypeScript Configuration

For optimal TypeScript support:

```json
{
  "compilerOptions": {
    "lib": ["esnext", "dom", "dom.iterable"],
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Available Themes

The library includes 7 built-in themes:

- **Default** - Clean, modern design
- **Beagle** - Friendly, rounded interface
- **Bootstrap** - Bootstrap-compatible styling
- **Flat** - Minimalist flat design
- **Mani** - Elegant, sophisticated look
- **Roman** - Classic, serif-inspired
- **Tim** - Bold, high-contrast theme

```html
<!-- Include your chosen theme -->
<link rel="stylesheet" href="dist/css/themes/default.css">
```

## Next Steps

- Learn about [Toolbar Configuration](/guide/toolbar) for customizing the formatting options
- Explore [Extensions](/guide/extensions) for adding custom functionality
- Check out the [API Reference](/api) for detailed method documentation
