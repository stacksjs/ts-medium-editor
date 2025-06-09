# Keyboard Commands Extension

The keyboard commands extension provides customizable keyboard shortcuts for editor formatting actions. This extension allows users to perform common formatting tasks using familiar keyboard combinations.

## Features

- **Customizable shortcuts** - Define any key combination for any editor command
- **Cross-platform compatibility** - Automatic Ctrl/Cmd key detection
- **Modifier key support** - Support for Shift, Alt, and Meta keys
- **Default commands included** - Common shortcuts work out of the box
- **Command validation** - Only valid editor commands are executed

## Interactive Demo

<div class="demo-container">
  <div class="demo-label">Keyboard Commands Demo - Try the keyboard shortcuts below:</div>
  <div class="keyboard-demo">
    <div class="demo-editor" contenteditable="true" data-placeholder="Try typing and using keyboard shortcuts...">
      <p>Try these keyboard shortcuts:</p>
      <ul>
        <li><strong>Ctrl/Cmd + B</strong> - Make text bold</li>
        <li><strong>Ctrl/Cmd + I</strong> - Make text italic</li>
        <li><strong>Ctrl/Cmd + U</strong> - Underline text</li>
        <li><strong>Ctrl/Cmd + Shift + S</strong> - Strikethrough text</li>
        <li><strong>Ctrl/Cmd + Q</strong> - Create quote block</li>
        <li><strong>Ctrl/Cmd + K</strong> - Insert link</li>
      </ul>
      <p>Select some text and try the shortcuts above!</p>
    </div>

    <div class="shortcuts-panel">
      <h3>Available Shortcuts</h3>
      <div class="shortcut-list">
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>B</kbd>
          <span>Bold</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>I</kbd>
          <span>Italic</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>U</kbd>
          <span>Underline</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
          <span>Strikethrough</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>Q</kbd>
          <span>Quote Block</span>
        </div>
        <div class="shortcut-item">
          <kbd>Ctrl/Cmd</kbd> + <kbd>K</kbd>
          <span>Insert Link</span>
        </div>
      </div>
    </div>
  </div>
</div>

### Status Panel

<div class="demo-container">
  <div class="demo-label">Keyboard Event Monitor - See what happens when you press shortcuts:</div>
  <div class="status-panel">
    <div class="status-header">
      <h4>Last Command</h4>
      <button id="clear-status">Clear</button>
    </div>
    <div id="command-status" class="command-status">
      <div class="status-message">Press a keyboard shortcut in the editor above...</div>
    </div>
  </div>
</div>

## Installation

```bash
npm install ts-medium-editor
```

## Basic Usage

```typescript
import { KeyboardCommands, MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  extensions: {
    keyboardCommands: new KeyboardCommands(editor)
  }
})
```

The extension comes with default shortcuts:
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline

## Custom Configuration

### Adding Custom Shortcuts

```typescript
const keyboardCommands = new KeyboardCommands(editor, {
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
      command: 'quote',
      key: 'q',
      meta: true
    },
    {
      command: 'h2',
      key: '2',
      meta: true
    },
    {
      command: 'strikethrough',
      key: 's',
      meta: true,
      shift: true
    }
  ]
})
```

### Command Options

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `command` | string | Editor command to execute | Yes |
| `key` | string | Key to trigger the command | Yes |
| `meta` | boolean | Require Ctrl (PC) or Cmd (Mac) | No |
| `shift` | boolean | Require Shift key | No |
| `alt` | boolean | Require Alt key | No |

### Available Commands

The keyboard commands extension can trigger any valid editor command:

- `bold` - Toggle bold formatting
- `italic` - Toggle italic formatting
- `underline` - Toggle underline formatting
- `strikethrough` - Toggle strikethrough formatting
- `quote` - Convert to blockquote
- `h1`, `h2`, `h3` - Convert to heading
- `anchor` - Insert/edit link
- `unorderedlist` - Create bullet list
- `orderedlist` - Create numbered list
- `removeFormat` - Clear formatting

## Advanced Examples

### Complex Key Combinations

```typescript
const advancedCommands = new KeyboardCommands(editor, {
  commands: [
    // Ctrl/Cmd + Shift + L for ordered list
    {
      command: 'orderedlist',
      key: 'l',
      meta: true,
      shift: true
    },
    // Ctrl/Cmd + Alt + C for code formatting
    {
      command: 'code',
      key: 'c',
      meta: true,
      alt: true
    },
    // Ctrl/Cmd + Shift + X for remove formatting
    {
      command: 'removeFormat',
      key: 'x',
      meta: true,
      shift: true
    }
  ]
})
```

### Platform-Specific Shortcuts

```typescript
// The extension automatically handles platform differences
const editor = new MediumEditor('.editable', {
  extensions: {
    keyboardCommands: new KeyboardCommands(editor, {
      commands: [
        {
          command: 'bold',
          key: 'b',
          meta: true // Uses Cmd on Mac, Ctrl on Windows/Linux
        }
      ]
    })
  }
})
```

### Custom Command Handlers

```typescript
// For custom commands, you can extend the editor's command system
class CustomEditor extends MediumEditor {
  execAction(action: string) {
    if (action === 'highlight') {
      this.wrapSelection('mark')
    }
    else {
      super.execAction(action)
    }
  }

  private wrapSelection(tagName: string) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    if (selectedText) {
      const wrapper = document.createElement(tagName)
      wrapper.style.backgroundColor = 'yellow'
      wrapper.textContent = selectedText
      range.deleteContents()
      range.insertNode(wrapper)
      selection.removeAllRanges()
    }
  }
}

const editor = new CustomEditor('.editable', {
  extensions: {
    keyboardCommands: new KeyboardCommands(editor, {
      commands: [
        {
          command: 'highlight',
          key: 'h',
          meta: true
        }
      ]
    })
  }
})
```

## API Reference

### Constructor

```typescript
new KeyboardCommands(editor: MediumEditor, options?: KeyboardCommandsOptions)
```

**Parameters:**
- `editor` - The MediumEditor instance
- `options` - Configuration options

### KeyboardCommandsOptions

```typescript
interface KeyboardCommandsOptions {
  commands?: KeyboardCommand[]
}
```

### KeyboardCommand

```typescript
interface KeyboardCommand {
  command: string
  key: string
  meta?: boolean
  shift?: boolean
  alt?: boolean
}
```

### Methods

#### `init(): void`
Initializes the extension and sets up event listeners.

#### `destroy(): void`
Cleans up the extension (no cleanup needed for this extension).

#### `handleKeydown(event: KeyboardEvent): void`
Handles keydown events and executes matching commands.

## Tips and Best Practices

### 1. Use Standard Shortcuts
Stick to familiar keyboard shortcuts when possible:
- `Ctrl/Cmd + B` for bold
- `Ctrl/Cmd + I` for italic
- `Ctrl/Cmd + U` for underline

### 2. Avoid Conflicts
Be careful not to override browser shortcuts:
- Avoid `Ctrl/Cmd + S` (save)
- Avoid `Ctrl/Cmd + R` (refresh)
- Avoid `Ctrl/Cmd + T` (new tab)

### 3. Group Related Commands
Use modifier combinations logically:
- Base command: `Ctrl/Cmd + Key`
- Variant: `Ctrl/Cmd + Shift + Key`
- Alternative: `Ctrl/Cmd + Alt + Key`

### 4. Document Your Shortcuts
Always provide users with a way to discover available shortcuts:
- Help tooltips
- Keyboard shortcut reference
- Context menus

## Troubleshooting

### Shortcuts Not Working
1. Verify the command name is correct
2. Check for browser shortcut conflicts
3. Ensure the editor has focus
4. Verify modifier key combinations

### Commands Not Executing
1. Check that the editor supports the command
2. Ensure text is selected for formatting commands
3. Verify the command is spelled correctly

### Browser Compatibility
The extension works in all modern browsers that support:
- `KeyboardEvent` API
- `event.preventDefault()`
- `event.stopPropagation()`

## Next Steps

- Learn about [Custom Extensions](/extensions) for creating your own shortcuts
- Explore [Toolbar Configuration](/examples/toolbar) for visual formatting options
- Check out [Event Handling](/examples/events) for advanced interactions

<script>
// Demo implementation for keyboard commands
class DemoKeyboardCommands {
  constructor(editor, options = {}) {
    this.editor = editor
    this.commands = options.commands || this.getDefaultCommands()
    this.init()
  }

  init() {
    this.editor.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  getDefaultCommands() {
    return [
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
      },
      {
        command: 'strikethrough',
        key: 's',
        meta: true,
        shift: true
      },
      {
        command: 'quote',
        key: 'q',
        meta: true
      },
      {
        command: 'anchor',
        key: 'k',
        meta: true
      }
    ]
  }

  handleKeydown(event) {
    for (const command of this.commands) {
      if (this.matchesCommand(event, command)) {
        event.preventDefault()
        event.stopPropagation()

        this.executeCommand(command)
        this.logCommand(command, event)
        return
      }
    }
  }

  matchesCommand(event, command) {
    if (event.key.toLowerCase() !== command.key.toLowerCase()) {
      return false
    }

    const hasCtrlMeta = event.ctrlKey || event.metaKey
    const needsCtrlMeta = command.meta ?? false

    if (needsCtrlMeta !== hasCtrlMeta) {
      return false
    }

    const hasShift = event.shiftKey
    const needsShift = command.shift ?? false

    if (needsShift !== hasShift) {
      return false
    }

    const hasAlt = event.altKey
    const needsAlt = command.alt ?? false

    if (needsAlt !== hasAlt) {
      return false
    }

    return true
  }

  executeCommand(command) {
    const selection = window.getSelection()

    switch (command.command) {
      case 'bold':
        document.execCommand('bold', false, null)
        break
      case 'italic':
        document.execCommand('italic', false, null)
        break
      case 'underline':
        document.execCommand('underline', false, null)
        break
      case 'strikethrough':
        document.execCommand('strikeThrough', false, null)
        break
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote')
        break
      case 'anchor':
        const url = prompt('Enter URL:')
        if (url) {
          document.execCommand('createLink', false, url)
        }
        break
      default:
        document.execCommand(command.command, false, null)
    }
  }

  logCommand(command, event) {
    const statusEl = document.getElementById('command-status')
    if (!statusEl) return

    const modifiers = []
    if (event.ctrlKey) modifiers.push('Ctrl')
    if (event.metaKey) modifiers.push('Cmd')
    if (event.shiftKey) modifiers.push('Shift')
    if (event.altKey) modifiers.push('Alt')

    const keyCombo = modifiers.length > 0
      ? `${modifiers.join(' + ')} + ${event.key.toUpperCase()}`
      : event.key.toUpperCase()

    const timestamp = new Date().toLocaleTimeString()

    statusEl.innerHTML = `
      <div class="status-entry">
        <div class="status-time">${timestamp}</div>
        <div class="status-details">
          <strong>Command:</strong> ${command.command}<br>
          <strong>Shortcut:</strong> ${keyCombo}<br>
          <strong>Action:</strong> Executed successfully
        </div>
      </div>
    `
  }
}

// Demo MediumEditor implementation
class DemoMediumEditor {
  constructor(selector) {
    this.element = document.querySelector(selector)
    this.init()
  }

  init() {
    if (!this.element) return

    this.element.contentEditable = 'true'
    this.element.style.outline = 'none'

    // Add focus styling
    this.element.addEventListener('focus', () => {
      this.element.style.borderColor = '#007bff'
    })

    this.element.addEventListener('blur', () => {
      this.element.style.borderColor = '#e9ecef'
    })

    // Initialize keyboard commands
    this.keyboardCommands = new DemoKeyboardCommands(this.element)
  }

  addEventListener(event, handler) {
    this.element.addEventListener(event, handler)
  }
}

// Initialize demo
function initializeKeyboardDemo() {
  const editor = new DemoMediumEditor('.demo-editor')

  // Clear status button
  const clearBtn = document.getElementById('clear-status')
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const statusEl = document.getElementById('command-status')
      if (statusEl) {
        statusEl.innerHTML = '<div class="status-message">Press a keyboard shortcut in the editor above...</div>'
      }
    })
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeKeyboardDemo)
} else {
  initializeKeyboardDemo()
}
</script>

<style>
.demo-container {
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.demo-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.keyboard-demo {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-editor {
  min-height: 300px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  line-height: 1.6;
  color: #333;
  cursor: text;
  outline: none;
  transition: border-color 0.2s ease;
}

.demo-editor:focus {
  border-color: #007bff;
}

.demo-editor blockquote {
  border-left: 4px solid #007bff;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #666;
  background: #f8f9fa;
}

.shortcuts-panel {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.shortcuts-panel h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  font-size: 0.875rem;
}

.shortcut-item kbd {
  background: #343a40;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-family: monospace;
}

.shortcut-item span {
  font-weight: 500;
  color: #495057;
}

.status-panel {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.status-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.status-header button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.status-header button:hover {
  background: #5a6268;
}

.command-status {
  min-height: 100px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.status-message {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  line-height: 80px;
}

.status-entry {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.status-time {
  font-size: 0.75rem;
  color: #6c757d;
  white-space: nowrap;
  font-family: monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #dee2e6;
}

.status-details {
  flex: 1;
  line-height: 1.5;
  font-size: 0.875rem;
}

.status-details strong {
  color: #495057;
}

/* Placeholder styles */
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #6c757d;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 768px) {
  .keyboard-demo {
    grid-template-columns: 1fr;
  }

  .shortcuts-panel {
    order: -1;
  }
}
</style>
