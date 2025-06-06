<p align="center"><img src=".github/art/cover.jpg" alt="TypeScript Medium Editor - A modern WYSIWYG editor"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ts-medium-editor"><img src="https://img.shields.io/npm/v/ts-medium-editor?style=flat-square" alt="npm version"></a>
  <a href="https://github.com/stacksjs/ts-medium-editor/actions?query=workflow%3Aci"><img src="https://img.shields.io/github/actions/workflow/status/stacksjs/ts-medium-editor/ci.yml?style=flat-square&branch=main" alt="GitHub Actions"></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"></a>
  <a href="https://github.com/stacksjs/ts-medium-editor/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/stacksjs/ts-medium-editor?style=flat-square" alt="License"></a>
  <a href="https://discord.gg/stacksjs"><img src="https://img.shields.io/discord/928731270204653568?style=flat-square&label=discord&color=5865F2" alt="Discord"></a>
</p>

<p align="center">
  <strong>A modern TypeScript port of the popular Medium.com-style WYSIWYG editor</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#demos">Live Demos</a> •
  <a href="#api-reference">API</a> •
  <a href="#examples">Examples</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

- 📝 **Medium-like Editor** - A modern TypeScript port of the popular Medium.com-style WYSIWYG editor
- 🔧 **Extensible Architecture** - Plugin system for custom functionality and toolbar buttons
- 📱 **Mobile Friendly** - Touch and mobile device support with responsive design
- 🎨 **Customizable Themes** - 7 built-in themes plus extensive styling options
- ⚡ **Lightweight** - Zero dependencies, small bundle size
- 🔒 **Type Safe** - Full TypeScript support with comprehensive type definitions
- 🎯 **Auto-Link Detection** - Automatically converts URLs to clickable links
- 📋 **Smart Paste** - Cleans up pasted content from Word, Google Docs, etc.
- 🔄 **Event System** - Comprehensive event handling for content changes
- 🎛️ **Flexible Toolbars** - Static, floating, or custom positioned toolbars

## 📦 Installation

Choose your preferred package manager:

```bash
# npm
npm install ts-medium-editor

# yarn
yarn add ts-medium-editor

# pnpm
pnpm add ts-medium-editor

# bun
bun add ts-medium-editor
```

## 🚀 Quick Start

### Basic Setup

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/dist/css/medium-editor.css'
import 'ts-medium-editor/dist/css/themes/default.css'

// Initialize editor
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
  <link rel="stylesheet" href="node_modules/ts-medium-editor/dist/css/medium-editor.css">
  <link rel="stylesheet" href="node_modules/ts-medium-editor/dist/css/themes/default.css">
</head>
<body>
  <div class="editable">
    <p>Start typing here...</p>
  </div>

  <script type="module">
    import { MediumEditor } from './node_modules/ts-medium-editor/dist/index.js'

    const editor = new MediumEditor('.editable', {
      placeholder: { text: 'Tell your story...' }
    })
  </script>
</body>
</html>
```

## 🎮 Live Demos

Explore our comprehensive demo collection to see all features in action:

### Core Features
- **[Basic Editor](demo/index.html)** - Simple setup with essential toolbar
- **[Auto-Link Detection](demo/auto-link.html)** - Automatic URL to link conversion
- **[Clean Paste](demo/clean-paste.html)** - Smart content cleaning from Word/Google Docs
- **[Textarea Support](demo/textarea.html)** - Enhance HTML textareas with rich editing

### Advanced Configurations
- **[Custom Toolbars](demo/custom-toolbar.html)** - 5 different toolbar configurations
- **[Static Toolbar](demo/static-toolbar.html)** - Always-visible toolbars with alignment options
- **[Button Examples](demo/button-example.html)** - Custom button creation with Rangy integration
- **[Extension Examples](demo/extension-example.html)** - 4 powerful extensions with Shiki syntax highlighting

### Multiple Editors
- **[Multi-Editor](demo/multi-editor.html)** - Multiple independent editor instances
- **[Single Instance](demo/multi-one-instance.html)** - Dynamic element addition to existing editors
- **[Nested Editable](demo/nested-editable.html)** - Complex nested contenteditable layouts

### Specialized Use Cases
- **[Multi-Paragraph](demo/multi-paragraph.html)** - Toolbar behavior with paragraph selection
- **[Relative Toolbar](demo/relative-toolbar.html)** - Constrained toolbar positioning
- **[Absolute Container](demo/absolute-container.html)** - Absolute positioned container examples
- **[Custom Extensions](demo/pass-instance.html)** - Instance-aware extension development
- **[Table Extension](demo/table-extension.html)** - Custom table insertion functionality

## 🛠️ TypeScript Configuration

For optimal TypeScript support, configure your `tsconfig.json`:

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

## 📚 API Reference

### Constructor Options

```typescript
interface MediumEditorOptions {
  // Core Settings
  activeButtonClass?: string // CSS class for active buttons
  buttonLabels?: boolean | string | ButtonLabels // Button label configuration
  delay?: number // Toolbar show delay (ms)
  disableReturn?: boolean // Disable return key
  disableDoubleReturn?: boolean // Disable double return
  disableExtraSpaces?: boolean // Prevent extra spaces
  disableEditing?: boolean // Make editor read-only
  spellcheck?: boolean // Enable spellcheck

  // Auto-features
  autoLink?: boolean // Auto-convert URLs to links
  targetBlank?: boolean // Open links in new tab
  imageDragging?: boolean // Enable image drag-and-drop
  fileDragging?: boolean // Enable file drag-and-drop

  // DOM Configuration
  elementsContainer?: HTMLElement // Container for editor elements
  contentWindow?: Window // Window context
  ownerDocument?: Document // Document context

  // Extensions
  extensions?: Record<string, Extension> // Custom extensions

  // Feature Modules
  toolbar?: ToolbarOptions | false // Toolbar configuration
  anchorPreview?: AnchorPreviewOptions | false // Link preview
  placeholder?: PlaceholderOptions | false // Placeholder text
  anchor?: AnchorOptions | false // Link creation
  paste?: PasteOptions | false // Paste handling
  keyboardCommands?: KeyboardOptions | false // Keyboard shortcuts
}
```

### Core Methods

```typescript
class MediumEditor {
  // Lifecycle
  constructor(elements: Elements, options?: MediumEditorOptions)
  setup(): MediumEditor
  destroy(): void

  // Content Management
  getContent(index?: number): string
  setContent(html: string, index?: number): void
  serialize(): Record<string, string>
  resetContent(element?: HTMLElement): void

  // Element Management
  addElements(elements: Elements): void
  removeElements(elements: Elements): void

  // Selection Management
  exportSelection(): SelectionState | null
  importSelection(state: SelectionState, favorLater?: boolean): void
  saveSelection(): void
  restoreSelection(): void
  selectAllContents(): void
  selectElement(element: HTMLElement): void

  // Event Handling
  subscribe(event: string, listener: EventListener): MediumEditor
  unsubscribe(event: string, listener: EventListener): MediumEditor
  trigger(event: string, data?: any, editable?: HTMLElement): MediumEditor

  // Actions
  execAction(action: string, opts?: any): boolean
  queryCommandState(action: string): boolean
}
```

## 💡 Examples

### 🎨 Custom Toolbar with FontAwesome

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

### 🔗 Auto-Link Configuration

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true,
  targetBlank: true,
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  },
  anchor: {
    placeholderText: 'Enter a URL',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab'
  }
})
```

### 📝 Multiple Editors with Different Configs

```typescript
// Title editor (no line breaks)
const titleEditor = new MediumEditor('.title', {
  disableReturn: true,
  disableExtraSpaces: true,
  toolbar: {
    buttons: ['bold', 'italic']
  },
  placeholder: {
    text: 'Enter title...'
  }
})

// Content editor (full features)
const contentEditor = new MediumEditor('.content', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'orderedlist', 'unorderedlist']
  },
  placeholder: {
    text: 'Tell your story...'
  }
})
```

### 📋 Smart Paste Configuration

```typescript
const editor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [
      [/\s*style\s*=\s*["'][^"']*["']/gi, ''], // Remove inline styles
      [/<o:p\s*\/?>|<\/o:p>/gi, ''], // Remove Word tags
      [/<xml>[\s\S]*?<\/xml>/gi, ''], // Remove XML
      [/<!--[\s\S]*?-->/g, ''] // Remove comments
    ],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta', 'style', 'script', 'object', 'embed']
  }
})
```

### 🎯 Event Handling

```typescript
const editor = new MediumEditor('.editable')

// Content change events
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
  // Auto-save logic here
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

### 🔌 Creating Custom Extensions

```typescript
import { MediumEditorExtension } from 'ts-medium-editor'

class EmojiExtension implements MediumEditorExtension {
  name = 'emoji'
  private button!: HTMLButtonElement
  private base: any

  init(): void {
    this.button = this.createButton()
  }

  getButton(): HTMLButtonElement {
    return this.button
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button')
    button.className = 'medium-editor-action'
    button.innerHTML = '😀'
    button.title = 'Insert Emoji'
    button.addEventListener('click', this.handleClick.bind(this))
    return button
  }

  private handleClick(): void {
    const emoji = '🎉'
    const selection = window.getSelection()

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(emoji))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  destroy(): void {
    if (this.button) {
      this.button.removeEventListener('click', this.handleClick)
    }
  }
}

// Use the extension
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'emoji']
  },
  extensions: {
    emoji: new EmojiExtension()
  }
})
```

### 🎨 Theme Switching

```typescript
const themeSelector = document.getElementById('theme-select') as HTMLSelectElement
const themeLink = document.getElementById('theme-css') as HTMLLinkElement

const themes = [
  'default',
  'beagle',
  'bootstrap',
  'flat',
  'mani',
  'roman',
  'tim'
]

themeSelector.addEventListener('change', (event) => {
  const theme = (event.target as HTMLSelectElement).value
  themeLink.href = `./dist/css/themes/${theme}.css`
})
```

## 🎨 Available Themes

The library includes 7 beautiful themes:

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

## 🔧 Advanced Configuration

### Toolbar Positioning

```typescript
// Static toolbar (always visible)
const editor = new MediumEditor('.editable', {
  toolbar: {
    static: true,
    sticky: true,
    align: 'center'
  }
})

// Relative container
const editor = new MediumEditor('.editable', {
  toolbar: {
    relativeContainer: document.getElementById('toolbar-container')
  }
})
```

### Custom Button Configuration

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

## 🧪 Testing

Run the test suite:

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test --grep "toolbar"
```

## 🔨 Development

Get started with development:

```bash
# Clone the repository
git clone https://github.com/stacksjs/ts-medium-editor.git
cd ts-medium-editor

# Install dependencies
bun install

# Start development server
bun dev

# Build the project
bun run build

# Preview demos locally
bun run preview
```

### Project Structure

```
ts-medium-editor/
├── src/                    # Source TypeScript files
│   ├── core.ts            # Core editor functionality
│   ├── extensions/        # Built-in extensions
│   ├── css/               # Stylesheets and themes
│   └── index.ts           # Main entry point
├── demo/                  # Interactive demos
│   ├── ts/                # Demo TypeScript files
│   └── *.html             # Demo HTML files
├── test/                  # Test files
├── dist/                  # Built files
└── docs/                  # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/stacksjs/contributing) for details.

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/ts-medium-editor.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Install** dependencies: `bun install`
5. **Make** your changes
6. **Test** your changes: `bun test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Reporting Issues

Found a bug? Have a feature request? Please [open an issue](https://github.com/stacksjs/ts-medium-editor/issues/new) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and version information
- Code examples (if applicable)

## 🌍 Community

For help, discussion about best practices, or any other conversation:

- 💬 [GitHub Discussions](https://github.com/stacksjs/stacks/discussions)
- 🎮 [Discord Server](https://discord.gg/stacksjs)
- 🐛 [Issue Tracker](https://github.com/stacksjs/ts-medium-editor/issues)

## 📮 Postcardware

**ts-medium-editor** is postcardware! If you use it in production, we'd love to receive a postcard from your hometown showing where our software is being used.

**Our address:**
Stacks.js
12665 Village Ln #2306
Playa Vista, CA 90094
United States 🌎

## 💎 Sponsors

We extend our gratitude to our sponsors who make this project possible:

- [**JetBrains**](https://www.jetbrains.com/) - Professional development tools
- [**The Solana Foundation**](https://solana.com/) - Blockchain infrastructure

[Become a sponsor](https://github.com/sponsors/stacksjs) and support open source development.

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/stacksjs/ts-medium-editor?style=social)
![GitHub forks](https://img.shields.io/github/forks/stacksjs/ts-medium-editor?style=social)
![npm downloads](https://img.shields.io/npm/dm/ts-medium-editor)

## 🏆 Credits

- **[Medium](https://medium.com)** - For the beautiful editor design inspiration
- **[medium-editor](https://github.com/yabwe/medium-editor)** - The original JavaScript implementation that inspired this TypeScript port
- **[Chris Breuer](https://github.com/chrisbbreuer)** - Primary maintainer and TypeScript port author
- **[All Contributors](../../contributors)** - Everyone who has contributed to making this project better

## 📄 License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

---

<p align="center">
  Made with 💙 by the <a href="https://github.com/stacksjs">Stacks team</a>
</p>

<p align="center">
  <a href="https://github.com/stacksjs/ts-medium-editor">⭐ Star us on GitHub</a> •
  <a href="https://twitter.com/stacksjs">🐦 Follow on Twitter</a> •
  <a href="https://discord.gg/stacksjs">💬 Join Discord</a>
</p>
