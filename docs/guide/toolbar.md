# Toolbar Configuration

The toolbar is the primary interface for formatting text in ts-medium-editor. It can be configured to appear as a floating selection toolbar or a static toolbar.

## Basic Toolbar Setup

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

## Available Buttons

### Text Formatting

| Button | Action | Description |
|--------|--------|-------------|
| `bold` | Bold | Make text bold (`<strong>`) |
| `italic` | Italic | Make text italic (`<em>`) |
| `underline` | Underline | Underline text (`<u>`) |
| `strikethrough` | Strikethrough | Strike through text (`<del>`) |
| `subscript` | Subscript | Subscript text (`<sub>`) |
| `superscript` | Superscript | Superscript text (`<sup>`) |

### Block Formatting

| Button | Action | Description |
|--------|--------|-------------|
| `h1` | Heading 1 | Format as H1 |
| `h2` | Heading 2 | Format as H2 |
| `h3` | Heading 3 | Format as H3 |
| `h4` | Heading 4 | Format as H4 |
| `h5` | Heading 5 | Format as H5 |
| `h6` | Heading 6 | Format as H6 |
| `quote` | Blockquote | Format as blockquote |
| `pre` | Preformatted | Format as preformatted text |

### Lists

| Button | Action | Description |
|--------|--------|-------------|
| `orderedlist` | Ordered List | Create numbered list |
| `unorderedlist` | Unordered List | Create bullet list |
| `indent` | Indent | Increase indent |
| `outdent` | Outdent | Decrease indent |

### Links & Media

| Button | Action | Description |
|--------|--------|-------------|
| `anchor` | Link | Insert/edit link |
| `image` | Image | Insert image |

### Alignment

| Button | Action | Description |
|--------|--------|-------------|
| `justifyLeft` | Align Left | Left align text |
| `justifyCenter` | Align Center | Center align text |
| `justifyRight` | Align Right | Right align text |
| `justifyFull` | Justify | Justify text |

## Toolbar Options

### Full Configuration

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    // Buttons to display
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],

    // Allow multiple paragraph selection
    allowMultiParagraphSelection: true,

    // Position adjustments
    diffLeft: 0,
    diffTop: -10,

    // First/last button classes
    firstButtonClass: 'medium-editor-button-first',
    lastButtonClass: 'medium-editor-button-last',

    // Relative container for positioning
    relativeContainer: null,

    // Standardize selection start
    standardizeSelectionStart: false,

    // Static toolbar (always visible)
    static: false,

    // Toolbar alignment
    align: 'center', // 'left', 'center', 'right'

    // Sticky positioning
    sticky: false,

    // Update on empty selection
    updateOnEmptySelection: false,
  }
})
```

## Static Toolbar

Create an always-visible toolbar:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    static: true,
    sticky: true,
    align: 'center',
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

### Static Toolbar with Container

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    static: true,
    relativeContainer: document.getElementById('toolbar-container')
  }
})
```

## Custom Buttons

### Button Configuration Object

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      {
        name: 'highlight',
        action: 'highlight',
        aria: 'Highlight text',
        contentDefault: 'H',
        classList: ['custom-highlight-button'],
        attrs: {
          'data-action': 'highlight'
        }
      }
    ]
  }
})
```

### Button Properties

```typescript
interface ToolbarButton {
  name: string              // Unique button name
  action?: string | (() => void)  // Action to perform
  aria?: string             // Accessibility label
  tagNames?: string[]       // Tags to check for active state
  style?: {                 // Style to check for active state
    prop: string
    value: string
  }
  useQueryState?: boolean   // Use queryCommandState
  contentDefault?: string   // Default button content
  contentFA?: string        // FontAwesome icon class
  classList?: string[]      // Additional CSS classes
  attrs?: Record<string, string>  // Additional attributes
}
```

## FontAwesome Icons

Enable FontAwesome icons for buttons:

```typescript
const editor = new MediumEditor('.editable', {
  buttonLabels: 'fontawesome',
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'anchor',
      'h2',
      'h3',
      'quote',
      'orderedlist',
      'unorderedlist'
    ]
  }
})
```

Make sure to include FontAwesome CSS:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

## Comprehensive Toolbar Example

```typescript
const editor = new MediumEditor('.editable', {
  buttonLabels: 'fontawesome',
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      'anchor',
      'image',
      'quote',
      'pre',
      'orderedlist',
      'unorderedlist',
      'indent',
      'outdent',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyFull',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ],
    static: true,
    sticky: true,
    align: 'center'
  }
})
```

## Anchor (Link) Options

Configure the anchor/link button:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  anchor: {
    // Placeholder text in URL input
    placeholderText: 'Paste or type a link',

    // Show target checkbox
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab',

    // Validate links
    linkValidation: true,

    // Custom class option
    customClassOption: 'btn btn-link',
    customClassOptionText: 'Button Style'
  }
})
```

## Anchor Preview

Show link preview on hover:

```typescript
const editor = new MediumEditor('.editable', {
  anchorPreview: {
    // Hide delay (ms)
    hideDelay: 500,

    // Show when toolbar is visible
    showWhenToolbarIsVisible: false,

    // Show on empty links
    showOnEmptyLinks: false
  }
})
```

## Disable Toolbar

Disable the toolbar entirely:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: false
})
```

## Dynamic Toolbar Updates

Update toolbar at runtime:

```typescript
const editor = new MediumEditor('.editable')

// Check current selection state
editor.checkSelection()

// Get toolbar extension
const toolbar = editor.getExtensionByName('toolbar')

// Access toolbar element
if (toolbar && toolbar.getToolbarElement) {
  const toolbarEl = toolbar.getToolbarElement()
  // Manipulate toolbar
}
```

## Styling the Toolbar

### CSS Variables

```css
.medium-toolbar-arrow-under::after {
  border-top-color: #242424;
}

.medium-editor-toolbar {
  background-color: #242424;
  border-radius: 4px;
}

.medium-editor-toolbar li button {
  color: #fff;
  padding: 12px;
  min-width: 36px;
}

.medium-editor-toolbar li button:hover {
  background-color: #333;
}

.medium-editor-button-active {
  background-color: #555;
}
```

### Custom Theme

```css
/* Ocean theme */
.medium-editor-toolbar.ocean-theme {
  background: linear-gradient(135deg, #1a5276, #21618c);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.medium-editor-toolbar.ocean-theme li button {
  color: #ecf0f1;
}

.medium-editor-toolbar.ocean-theme li button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
```
