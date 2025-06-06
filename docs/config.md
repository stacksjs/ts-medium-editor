# Configuration

The TypeScript Medium Editor can be extensively configured to match your needs. This guide covers all available configuration options.

## Basic Configuration

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  // Core settings
  activeButtonClass: 'medium-editor-button-active',
  delay: 0,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  spellcheck: true,

  // Auto-features
  autoLink: true,
  targetBlank: false,
  imageDragging: true,
  fileDragging: true,

  // Button labels
  buttonLabels: false, // or 'fontawesome' or custom object

  // Extensions
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  },
  placeholder: {
    text: 'Type your text...'
  }
})
```

## Core Options

### Basic Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `activeButtonClass` | `string` | `'medium-editor-button-active'` | CSS class for active toolbar buttons |
| `delay` | `number` | `0` | Delay in milliseconds before showing toolbar |
| `disableReturn` | `boolean` | `false` | Disable the return key (no line breaks) |
| `disableDoubleReturn` | `boolean` | `false` | Disable double return key behavior |
| `disableExtraSpaces` | `boolean` | `false` | Prevent multiple consecutive spaces |
| `disableEditing` | `boolean` | `false` | Make editor read-only |
| `spellcheck` | `boolean` | `true` | Enable browser spellcheck |

### Auto-Features

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoLink` | `boolean` | `false` | Automatically convert URLs to links |
| `targetBlank` | `boolean` | `false` | Open links in new tab/window |
| `imageDragging` | `boolean` | `true` | Enable image drag and drop |
| `fileDragging` | `boolean` | `true` | Enable file drag and drop |

### DOM Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `elementsContainer` | `HTMLElement` | `null` | Container for editor elements |
| `contentWindow` | `Window` | `window` | Window context for the editor |
| `ownerDocument` | `Document` | `document` | Document context for the editor |

## Button Labels

Configure button labels and icons:

```typescript
// Boolean values
const editor1 = new MediumEditor('.editable', {
  buttonLabels: false // No labels (icons only)
})

const editor2 = new MediumEditor('.editable', {
  buttonLabels: true // Text labels
})

// FontAwesome icons
const editor3 = new MediumEditor('.editable', {
  buttonLabels: 'fontawesome'
})

// Custom labels
const editor4 = new MediumEditor('.editable', {
  buttonLabels: {
    bold: '<b>B</b>',
    italic: '<i>I</i>',
    underline: '<u>U</u>',
    anchor: '🔗',
    h2: 'H2',
    h3: 'H3',
    quote: '"',
    orderedlist: '1.',
    unorderedlist: '•'
  }
})
```

## Toolbar Configuration

The toolbar is highly configurable:

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    // Available buttons
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
      'h6',
      'removeFormat'
    ],

    // Positioning
    static: false, // Always visible toolbar
    sticky: false, // Stick to top when scrolling
    align: 'center', // 'left', 'center', 'right'
    relativeContainer: null, // Container to position relative to

    // Selection behavior
    allowMultiParagraphSelection: true,
    standardizeSelectionStart: false,
    updateOnEmptySelection: false,

    // Styling
    firstButtonClass: 'medium-editor-button-first',
    lastButtonClass: 'medium-editor-button-last',
    diffLeft: 0, // Horizontal offset
    diffTop: -10 // Vertical offset
  }
})
```

### Custom Buttons

Create custom toolbar buttons:

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
        contentDefault: '🖍️',
        classList: ['custom-highlight-button'],
        attrs: {
          'data-action': 'highlight'
        }
      }
    ]
  }
})
```

## Placeholder Configuration

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Tell your story...',
    hideOnClick: true,
    hideOnFocus: false
  }
})
```

## Anchor (Link) Configuration

```typescript
const editor = new MediumEditor('.editable', {
  anchor: {
    customClassOption: 'custom-link',
    customClassOptionText: 'Make it special',
    linkValidation: true,
    placeholderText: 'Paste or type a link',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new window'
  }
})
```

## Paste Configuration

Control how pasted content is handled:

```typescript
const editor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,

    // Pre-clean replacements (before HTML parsing)
    preCleanReplacements: [
      [/\u00A0/g, ' '] // Replace non-breaking spaces
    ],

    // Clean replacements (after HTML parsing)
    cleanReplacements: [
      [/\s*style\s*=\s*["'][^"']*["']/gi, ''], // Remove inline styles
      [/<o:p\s*\/?>|<\/o:p>/gi, ''], // Remove Word tags
      [/<xml>[\s\S]*?<\/xml>/gi, ''], // Remove XML
      [/<!--[\s\S]*?-->/g, ''] // Remove comments
    ],

    // Attributes to remove
    cleanAttrs: ['class', 'style', 'dir', 'id'],

    // Tags to remove completely
    cleanTags: ['meta', 'style', 'script', 'object', 'embed', 'title'],

    // Tags to unwrap (remove tag, keep content)
    unwrapTags: ['div', 'span']
  }
})
```

## Keyboard Commands

Configure keyboard shortcuts:

```typescript
const editor = new MediumEditor('.editable', {
  keyboardCommands: {
    commands: [
      {
        command: 'bold',
        key: 'b',
        meta: true
      },
      {
        command: 'italic',
        key: 'i',
        meta: true
      },
      {
        command: 'underline',
        key: 'u',
        meta: true
      }
    ]
  }
})
```

## Extensions

Disable built-in extensions or add custom ones:

```typescript
// Disable extensions
const editor1 = new MediumEditor('.editable', {
  toolbar: false,
  placeholder: false,
  anchorPreview: false
})

// Configure extensions
const editor2 = new MediumEditor('.editable', {
  extensions: {
    customExtension: new MyCustomExtension()
  }
});
```

## Complete Example

```typescript
const editor = new MediumEditor('.editable', {
  // Core settings
  activeButtonClass: 'active-button',
  delay: 500,
  disableReturn: false,
  disableDoubleReturn: true,
  disableExtraSpaces: true,
  autoLink: true,
  targetBlank: true,
  spellcheck: true,

  // Button labels
  buttonLabels: 'fontawesome',

  // Toolbar
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
      'unorderedlist',
      'justifyLeft',
      'justifyCenter',
      'justifyRight'
    ],
    static: true,
    sticky: true,
    align: 'center'
  },

  // Placeholder
  placeholder: {
    text: 'Write something amazing...',
    hideOnClick: true
  },

  // Anchor configuration
  anchor: {
    linkValidation: true,
    placeholderText: 'Enter URL',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab'
  },

  // Paste handling
  paste: {
    cleanPastedHTML: true,
    cleanAttrs: ['class', 'style', 'id'],
    cleanTags: ['script', 'style', 'meta']
  },

  // Keyboard shortcuts
  keyboardCommands: {
    commands: [
      { command: 'bold', key: 'b', meta: true },
      { command: 'italic', key: 'i', meta: true }
    ]
  }
})
```

## Environment-Specific Configuration

### Development

```typescript
const isDev = process.env.NODE_ENV === 'development'

const editor = new MediumEditor('.editable', {
  // Enable debugging in development
  spellcheck: isDev,

  // More verbose toolbar in development
  toolbar: {
    buttons: isDev
      ? ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'pre', 'html']
      : ['bold', 'italic', 'anchor']
  }
})
```

### Mobile Optimization

```typescript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

const editor = new MediumEditor('.editable', {
  toolbar: {
    // Simplified toolbar for mobile
    buttons: isMobile
      ? ['bold', 'italic', 'anchor']
      : ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],

    // Static toolbar on mobile for better UX
    static: isMobile,
    sticky: isMobile
  },

  // Disable some features on mobile
  imageDragging: !isMobile,
  fileDragging: !isMobile
})
```

## TypeScript Configuration

For optimal TypeScript support in your project:

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

## Next Steps

- [Toolbar Features](./features/toolbar.md) - Detailed toolbar configuration
- [Events](./features/events.md) - Event handling and custom events
- [Extensions](./extensions.md) - Creating custom extensions
- [API Reference](./api.md) - Complete API documentation
