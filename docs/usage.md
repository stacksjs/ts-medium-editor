# Usage

This guide will walk you through the basic usage of `ts-medium-editor`, from creating your first editor instance to advanced customization options.

## Quick Start

### Basic Setup

First, create an HTML element that will become your editor:

```html
<div id="editor" class="editable">
  <p>Start typing here...</p>
</div>
```

Then initialize the editor:

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'

const editor = new MediumEditor('.editable')
```

That's it! You now have a fully functional rich text editor.

## Constructor Options

The `MediumEditor` constructor accepts two parameters:

```typescript
const editor = new MediumEditor(elements, options)
```

### Elements Parameter

The first parameter can be:
- **CSS Selector**: `'.editable'` or `'#editor'`
- **DOM Element**: `document.getElementById('editor')`
- **NodeList**: `document.querySelectorAll('.editable')`
- **Array**: `[element1, element2]`

```typescript
// CSS selector
const editor1 = new MediumEditor('.editable')

// DOM element
const element = document.getElementById('editor')
const editor2 = new MediumEditor(element)

// Multiple elements
const editor3 = new MediumEditor(['.editor1', '.editor2'])
```

### Options Parameter

The second parameter is an optional configuration object:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
    static: false,
    sticky: false,
    updateOnEmptySelection: false
  },
  placeholder: {
    text: 'Type your story...',
    hideOnClick: true
  },
  anchor: {
    linkValidation: true,
    placeholderText: 'Paste or type a link',
    targetCheckbox: false,
    targetCheckboxText: 'Open in new window'
  },
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta']
  },
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
      }
    ]
  },
  autoLink: true,
  imageDragging: true,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  elementsContainer: document.body,
  spellcheck: true,
  targetBlank: false,
  extensions: {}
})
```

## Toolbar Configuration

### Default Toolbar

By default, the toolbar includes common formatting options:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

### Available Buttons

- **`bold`**: Bold text formatting
- **`italic`**: Italic text formatting
- **`underline`**: Underline text formatting
- **`anchor`**: Link creation and editing
- **`h2`**: Heading 2 formatting
- **`h3`**: Heading 3 formatting
- **`quote`**: Blockquote formatting

### Custom Button Order

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['h2', 'h3', 'bold', 'italic', 'quote', 'anchor']
  }
})
```

### Static Toolbar

By default, the toolbar appears when text is selected. You can make it always visible:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    static: true,
    buttons: ['bold', 'italic', 'underline']
  }
})
```

### Disable Toolbar

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: false
})
```

## Placeholder Text

Add placeholder text that appears when the editor is empty:

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Tell your story...',
    hideOnClick: true
  }
})
```

## Event Handling

`ts-medium-editor` provides a comprehensive event system:

```typescript
const editor = new MediumEditor('.editable')

// Listen for content changes
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
})

// Listen for focus events
editor.subscribe('focus', (event, editable) => {
  console.log('Editor focused')
})

// Listen for blur events
editor.subscribe('blur', (event, editable) => {
  console.log('Editor blurred')
})

// Listen for toolbar events
editor.subscribe('showToolbar', (event, editable) => {
  console.log('Toolbar shown')
})

editor.subscribe('hideToolbar', (event, editable) => {
  console.log('Toolbar hidden')
})
```

### Available Events

- **`editableInput`**: Content has changed
- **`editableKeydown`**: Key pressed in editor
- **`editableKeyup`**: Key released in editor
- **`focus`**: Editor gained focus
- **`blur`**: Editor lost focus
- **`showToolbar`**: Toolbar became visible
- **`hideToolbar`**: Toolbar became hidden
- **`positionToolbar`**: Toolbar position changed

## API Methods

### Content Management

```typescript
// Get content
const content = editor.getContent()
const contentByIndex = editor.getContent(0) // First element

// Set content
editor.setContent('<p>New content</p>')
editor.setContent('<p>New content</p>', 0) // First element

// Check if content changed
const hasChanged = editor.checkContentChanged()

// Reset content to original
editor.resetContent()
```

### Selection Management

```typescript
// Get current selection
const selection = editor.exportSelection()

// Restore selection
editor.importSelection(selection)

// Save selection
editor.saveSelection()

// Restore saved selection
editor.restoreSelection()

// Get selected text
const selectedText = editor.getSelectedParentElement()
```

### Editor State

```typescript
// Check if editor is active
const isActive = editor.isActive()

// Activate editor
editor.activate()

// Deactivate editor
editor.deactivate()

// Destroy editor
editor.destroy()
```

### Programmatic Formatting

```typescript
// Execute formatting commands
editor.execAction('bold')
editor.execAction('italic')
editor.execAction('underline')

// Create links
editor.createLink({
  url: 'https://example.com',
  text: 'Example Link'
})
```

## Framework Integration

### React

```tsx
import React, { useEffect, useRef } from 'react'
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'

const EditorComponent: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const mediumEditor = useRef<MediumEditor | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      mediumEditor.current = new MediumEditor(editorRef.current, {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor']
        }
      })
    }

    return () => {
      if (mediumEditor.current) {
        mediumEditor.current.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={editorRef}
      className="editable"
      data-placeholder="Start writing..."
    />
  )
}
```

### Vue 3

```vue
<script setup lang="ts">
import { MediumEditor } from 'ts-medium-editor'
import { onMounted, onUnmounted, ref } from 'vue'
import 'ts-medium-editor/css/medium-editor.css'

const editorRef = ref<HTMLDivElement>()
let editor: MediumEditor | null = null

onMounted(() => {
  if (editorRef.value) {
    editor = new MediumEditor(editorRef.value, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor']
      }
    })
  }
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
})
</script>

<template>
  <div ref="editorRef" class="editable" data-placeholder="Start writing..." />
</template>
```

### Angular

```typescript
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'

@Component({
  selector: 'app-editor',
  template: `
    <div #editorElement class="editable" data-placeholder="Start writing..."></div>
  `
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorElement', { static: true }) editorElement!: ElementRef
  private editor!: MediumEditor

  ngOnInit() {
    this.editor = new MediumEditor(this.editorElement.nativeElement, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor']
      }
    })
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  }
}
```

## Next Steps

- Learn about [Toolbar](/features/toolbar) for advanced customization
- Explore [Text Formatting](/features/formatting) for detailed functionality guides
- Check out [Extensions](/extensions) for custom functionality
- See [Extensions](/extensions) for creating custom functionality
