<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-medium-editor

> A modern TypeScript port of the popular Medium.com-style WYSIWYG editor.

## Features

- 🔧 **Extensible Architecture** - Plugin system for custom functionality
- 📱 **Mobile Friendly** - Touch and mobile device support
- 🎨 **Customizable** - Extensive theming and styling options
- ⚡ **Lightweight** - Dependency free
- 🔒 **Type Safe** - Catch errors at compile time

## Installation

```bash
npm install ts-medium-editor
```

Or with Bun:

```bash
bun add ts-medium-editor
```

## Quick Start

### Basic Usage

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/dist/css/medium-editor.css'

// Initialize editor on elements
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

### HTML Setup

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/medium-editor.css">
</head>
<body>
  <div class="editable">Start typing here...</div>

  <script type="module">
    import { MediumEditor } from './dist/index.js'

    const editor = new MediumEditor('.editable')
  </script>
</body>
</html>
```

## TypeScript Configuration

The library includes comprehensive TypeScript definitions. Your `tsconfig.json` should include:

```json
{
  "compilerOptions": {
    "lib": ["esnext", "dom"],
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## API Reference

### Constructor Options

```typescript
interface MediumEditorOptions {
  activeButtonClass?: string
  buttonLabels?: boolean | string | Record<string, string>
  delay?: number
  disableReturn?: boolean
  disableDoubleReturn?: boolean
  disableExtraSpaces?: boolean
  disableEditing?: boolean
  autoLink?: boolean
  elementsContainer?: HTMLElement | null
  contentWindow?: Window
  ownerDocument?: Document
  targetBlank?: boolean
  extensions?: Record<string, MediumEditorExtension>
  spellcheck?: boolean
  toolbar?: ToolbarOptions | false
  anchorPreview?: AnchorPreviewOptions | false
  placeholder?: PlaceholderOptions | false
  anchor?: AnchorOptions | false
  paste?: PasteOptions | false
  keyboardCommands?: KeyboardCommandsOptions | false
  imageDragging?: boolean
  fileDragging?: boolean
}
```

### Core Methods

```typescript
class MediumEditor {
  // Initialize
  init(elements: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions): MediumEditor
  setup(): MediumEditor
  destroy(): void

  // Content Management
  serialize(): Record<string, string>
  getContent(index?: number): string
  setContent(html: string, index?: number): void
  resetContent(element?: HTMLElement): void

  // Selection Management
  exportSelection(): SelectionState | null
  saveSelection(): void
  importSelection(selectionState: SelectionState, favorLaterSelectionAnchor?: boolean): void
  restoreSelection(): void
  selectAllContents(): void
  selectElement(element: HTMLElement): void

  // Event Handling
  on(target: HTMLElement | Document | Window, event: string, listener: EventListener): MediumEditor
  off(target: HTMLElement | Document | Window, event: string, listener: EventListener): MediumEditor
  subscribe(event: string, listener: MediumEditorEventListener): MediumEditor
  unsubscribe(event: string, listener: MediumEditorEventListener): MediumEditor
  trigger(name: string, data?: any, editable?: HTMLElement): MediumEditor

  // Actions
  execAction(action: string, opts?: any): boolean
  queryCommandState(action: string): boolean
}
```

### Usage Examples

#### Custom Toolbar Configuration

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      {
        name: 'h1',
        action: 'append-h1',
        aria: 'Header 1',
        tagNames: ['h1'],
        contentDefault: 'H1'
      }
    ],
    static: true,
    align: 'center'
  }
})
```

#### Event Handling

```typescript
const editor = new MediumEditor('.editable')

// Listen to content changes
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
})

// Listen to selection changes
editor.subscribe('editableKeyup', (event, editable) => {
  const selection = editor.exportSelection()
  console.log('Selection:', selection)
})
```

#### Working with Multiple Elements

```typescript
const editor = new MediumEditor(['.title', '.content'], {
  disableReturn: true, // No line breaks in title
  placeholder: {
    text: 'Enter your text...'
  }
})

// Get content from specific element
const titleContent = editor.getContent(0)
const contentBody = editor.getContent(1)
```

## Creating Extensions

Extensions allow you to add custom functionality to the editor:

```typescript
import { MediumEditorExtension } from 'ts-medium-editor'

class CustomExtension implements MediumEditorExtension {
  name = 'custom'

  init(): void {
    console.log('Extension initialized')
  }

  destroy(): void {
    console.log('Extension destroyed')
  }

  handleClick(event: Event): void {
    // Custom click handling
  }

  getInteractionElements(): HTMLElement[] {
    // Return elements that should not trigger blur
    return []
  }
}

// Use the extension
const editor = new MediumEditor('.editable', {
  extensions: {
    custom: new CustomExtension()
  }
})
```

## Styling

The library includes default CSS that you can customize:

```css
/* Override default styles */
.medium-editor-element {
  font-family: 'Georgia', serif;
  font-size: 18px;
  line-height: 1.8;
}

.medium-editor-toolbar {
  background: #333;
  border-radius: 8px;
}

.medium-editor-action {
  color: white;
}
```

## Changelog

Please see our [releases](https://github.com/stacksjs/stacks/releases) page for more information on what has changed recently.

## Contributing

Please see the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [Medium](https://medium.com) _for the pretty editor_
- [`medium-editor`](https://github.com/yabwe/medium-editor) _many thanks for the original JavaScript implementation_
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-medium-editor?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-medium-editor
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-medium-editor/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-medium-editor/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-medium-editor/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-medium-editor -->
