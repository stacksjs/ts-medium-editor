# API Reference

This page provides a complete reference for all TypeScript Medium Editor APIs, including classes, methods, properties, and interfaces.

## MediumEditor Class

### Constructor

```typescript
new MediumEditor(elements: ElementsType, options?: MediumEditorOptions)
```

**Parameters:**
- `elements`: CSS selector string, DOM element, NodeList, or array of elements
- `options`: Configuration options (optional)

**Example:**
```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  }
})
```

### Properties

#### `elements: HTMLElement[]`
Array of DOM elements that the editor is attached to.

#### `options: MediumEditorOptions`
Current configuration options for the editor.

#### `id: string`
Unique identifier for the editor instance.

### Content Methods

#### `getContent(index?: number): string`
Get HTML content from editor elements.

**Parameters:**
- `index`: Optional index of specific element (returns all if omitted)

**Returns:** HTML string content

**Example:**
```typescript
const content = editor.getContent()
const firstElementContent = editor.getContent(0)
```

#### `setContent(html: string, index?: number): void`
Set HTML content for editor elements.

**Parameters:**
- `html`: HTML string to set
- `index`: Optional index of specific element (sets all if omitted)

**Example:**
```typescript
editor.setContent('<p>New content</p>')
editor.setContent('<p>Specific content</p>', 0)
```

#### `checkContentChanged(editable?: HTMLElement): boolean`
Check if content has changed since initialization.

**Parameters:**
- `editable`: Optional specific element to check

**Returns:** Boolean indicating if content changed

#### `resetContent(editable?: HTMLElement): void`
Reset content to original state.

**Parameters:**
- `editable`: Optional specific element to reset

### Selection Methods

#### `exportSelection(): SelectionState | null`
Export current selection state.

**Returns:** Selection state object or null

**Example:**
```typescript
const selection = editor.exportSelection()
// Save selection for later restoration
```

#### `importSelection(selectionState: SelectionState, favorLaterSelectionAnchor?: boolean): void`
Restore a previously exported selection.

**Parameters:**
- `selectionState`: Previously exported selection state
- `favorLaterSelectionAnchor`: Optional preference for anchor position

**Example:**
```typescript
editor.importSelection(savedSelection)
```

#### `saveSelection(): void`
Save current selection to internal state.

#### `restoreSelection(): void`
Restore previously saved selection.

#### `selectAllContents(): void`
Select all content in the focused element.

#### `selectElement(element: HTMLElement): void`
Select a specific element.

**Parameters:**
- `element`: Element to select

#### `stopSelectionUpdates(): void`
Temporarily stop selection update events.

#### `startSelectionUpdates(): void`
Resume selection update events.

#### `checkSelection(): void`
Manually trigger selection checking and toolbar updates.

### Formatting Methods

#### `execAction(action: string, opts?: any): boolean`
Execute a formatting action.

**Parameters:**
- `action`: Action name ('bold', 'italic', 'underline', etc.)
- `opts`: Optional action-specific options

**Returns:** Boolean indicating success

**Example:**
```typescript
editor.execAction('bold')
editor.execAction('createLink', { url: 'https://example.com' })
```

#### `queryCommandState(action: string): boolean`
Check if a formatting command is currently active.

**Parameters:**
- `action`: Command name to check

**Returns:** Boolean indicating if command is active

### Event Methods

#### `subscribe(name: string, listener: EventListener): void`
Subscribe to editor events.

**Parameters:**
- `name`: Event name
- `listener`: Event handler function

**Example:**
```typescript
editor.subscribe('editableInput', (event, editable) => {
  console.log('Content changed:', editable.innerHTML)
})
```

#### `unsubscribe(name: string, listener: EventListener): void`
Unsubscribe from editor events.

**Parameters:**
- `name`: Event name
- `listener`: Event handler function to remove

#### `trigger(name: string, data?: any, editable?: HTMLElement): void`
Trigger a custom event.

**Parameters:**
- `name`: Event name
- `data`: Optional event data
- `editable`: Optional target element

### State Methods

#### `setup(): MediumEditor`
Initialize or re-initialize the editor.

**Returns:** The editor instance for chaining

#### `destroy(): void`
Destroy the editor and clean up resources.

**Note**: The `activate()`, `deactivate()`, and `isActive()` methods are not implemented in the current version.

### Extension Methods

#### `getExtensionByName(name: string): Extension | undefined`
Get an extension instance by name.

**Parameters:**
- `name`: Extension name

**Returns:** Extension instance or undefined

**Example:**
```typescript
const toolbar = editor.getExtensionByName('toolbar')
```

## Events

### Content Events

#### `editableInput`
Fired when content changes.

**Handler signature:**
```typescript
(event: Event, editable: HTMLElement) => void
```

#### `editableKeydown`
Fired on keydown in editor.

**Handler signature:**
```typescript
(event: KeyboardEvent, editable: HTMLElement) => void
```

#### `editableKeyup`
Fired on keyup in editor.

**Handler signature:**
```typescript
(event: KeyboardEvent, editable: HTMLElement) => void
```

### Focus Events

#### `focus`
Fired when editor gains focus.

**Handler signature:**
```typescript
(event: FocusEvent, editable: HTMLElement) => void
```

#### `blur`
Fired when editor loses focus.

**Handler signature:**
```typescript
(event: FocusEvent, editable: HTMLElement) => void
```

### Toolbar Events

#### `showToolbar`
Fired when toolbar becomes visible.

**Handler signature:**
```typescript
(event: Event, editable: HTMLElement) => void
```

#### `hideToolbar`
Fired when toolbar becomes hidden.

**Handler signature:**
```typescript
(event: Event, editable: HTMLElement) => void
```

#### `positionToolbar`
Fired when toolbar position changes.

**Handler signature:**
```typescript
(event: Event, editable: HTMLElement) => void
```

## Configuration Interfaces

### MediumEditorOptions

```typescript
interface MediumEditorOptions {
  toolbar?: ToolbarOptions | false
  placeholder?: PlaceholderOptions
  anchor?: AnchorOptions
  paste?: PasteOptions
  keyboardCommands?: KeyboardCommandsOptions
  autoLink?: boolean
  imageDragging?: boolean
  disableReturn?: boolean
  disableDoubleReturn?: boolean
  disableExtraSpaces?: boolean
  disableEditing?: boolean
  elementsContainer?: HTMLElement
  spellcheck?: boolean
  targetBlank?: boolean
  extensions?: { [key: string]: Extension }
}
```

### ToolbarOptions

```typescript
interface ToolbarOptions {
  buttons?: string[] // Available buttons: 'bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'
  static?: boolean // Show toolbar always (default: false)
  sticky?: boolean // Stick to top when scrolling (default: false)
  updateOnEmptySelection?: boolean // Update on empty selection (default: false)
  align?: 'left' | 'center' | 'right' // Toolbar alignment (default: 'center')
}
```

### PlaceholderOptions

```typescript
interface PlaceholderOptions {
  text?: string
  hideOnClick?: boolean
  hideOnFocus?: boolean
}
```

### AnchorOptions

```typescript
interface AnchorOptions {
  linkValidation?: boolean
  placeholderText?: string
  targetCheckbox?: boolean
  targetCheckboxText?: string
  customClassOption?: string | null
  customClassOptionText?: string
  urlValidation?: boolean
}
```

### PasteOptions

```typescript
interface PasteOptions {
  forcePlainText?: boolean
  cleanPastedHTML?: boolean
  cleanReplacements?: Array<[RegExp, string]>
  cleanAttrs?: string[]
  cleanTags?: string[]
}
```

### KeyboardCommandsOptions

```typescript
interface KeyboardCommandsOptions {
  commands?: KeyboardCommand[]
}

interface KeyboardCommand {
  command: string
  key: string
  meta: boolean
  shift: boolean
  alt: boolean
}
```

### SelectionState

```typescript
interface SelectionState {
  start: number
  end: number
  emptyBlocksIndex?: number
}
```

## Extension Base Class

### Extension

```typescript
abstract class Extension {
  abstract name: string
  base?: MediumEditor
  options: any

  constructor(options?: any)
  abstract init(): void
  destroy?(): void
  getDefaults?(): any

  // Event methods
  subscribe(name: string, listener: EventListener): void
  unsubscribe(name: string, listener: EventListener): void
  trigger(name: string, data?: any): void
}
```

### Extension Lifecycle

1. **Constructor**: Initialize with options
2. **init()**: Called when editor initializes
3. **destroy()**: Called when editor is destroyed (optional)

### Creating Custom Extensions

```typescript
class MyExtension extends Extension {
  name = 'myExtension'

  getDefaults() {
    return {
      option1: 'default value',
      option2: true
    }
  }

  init() {
    // Extension initialization
    this.base?.subscribe('editableInput', this.handleInput.bind(this))
  }

  destroy() {
    // Cleanup
    this.base?.unsubscribe('editableInput', this.handleInput)
  }

  private handleInput(event: Event, editable: HTMLElement) {
    // Handle input events
  }
}
```

## Toolbar Extension API

### Toolbar Class

The toolbar extension provides additional methods:

#### `addButton(buttonOptions: ButtonOptions): void`
Add a custom button to the toolbar.

**Parameters:**
- `buttonOptions`: Button configuration object

```typescript
interface ButtonOptions {
  name: string
  aria: string
  tagNames?: string[]
  contentDefault: string
  contentFA?: string
  action: (event: Event) => void
}
```

**Example:**
```typescript
const toolbar = editor.getExtensionByName('toolbar')
toolbar?.addButton({
  name: 'custom',
  aria: 'Custom Action',
  contentDefault: '<b>C</b>',
  action: (event) => {
    // Custom button action
  }
})
```

#### `removeButton(name: string): void`
Remove a button from the toolbar.

**Parameters:**
- `name`: Button name to remove

#### `updateButtonStates(): void`
Update the active state of all toolbar buttons.

#### `showToolbar(): void`
Manually show the toolbar.

#### `hideToolbar(): void`
Manually hide the toolbar.

#### `positionToolbar(): void`
Recalculate and update toolbar position.

## Utility Functions

### DOM Utilities

#### `getSelectionElement(selection?: Selection): HTMLElement | null`
Get the element containing the current selection.

#### `getSelectionStart(selection?: Selection): HTMLElement | null`
Get the start element of the selection.

#### `isDescendant(parent: HTMLElement, child: Node): boolean`
Check if a node is a descendant of another element.

#### `isElement(node: Node): node is HTMLElement`
Type guard to check if a node is an HTMLElement.

### Selection Utilities

#### `getCaretOffsets(element: HTMLElement, range?: Range): { start: number; end: number }`
Get caret position offsets within an element.

#### `moveToSelectionEnd(selection: Selection): void`
Move selection to the end of the current range.

#### `selectNode(node: Node, selection?: Selection): void`
Select a specific node.

### Content Utilities

#### `getContentEditableContainer(element: HTMLElement): HTMLElement | null`
Find the contenteditable container for an element.

#### `isBlockContainer(element: HTMLElement): boolean`
Check if an element is a block-level container.

#### `unwrap(element: HTMLElement): void`
Remove an element while preserving its contents.

#### `insertHTMLCommand(html: string): boolean`
Insert HTML at the current selection.

## Type Definitions

### ElementsType

```typescript
type ElementsType =
  | string
  | HTMLElement
  | HTMLElement[]
  | NodeList
  | HTMLCollection
```

### EventListener

```typescript
type EventListener = (event: Event, ...args: any[]) => void
```

### ButtonAction

```typescript
type ButtonAction = (event: Event) => void
```

## Error Handling

### Common Errors

#### `EditorNotInitializedError`
Thrown when attempting to use editor methods before initialization.

#### `InvalidElementError`
Thrown when invalid elements are passed to the constructor.

#### `ExtensionNotFoundError`
Thrown when attempting to access a non-existent extension.

### Error Prevention

Always check if the editor is initialized:

```typescript
if (editor.isActive()) {
  editor.execAction('bold')
}
```

Check for extension existence:

```typescript
const toolbar = editor.getExtensionByName('toolbar')
if (toolbar) {
  toolbar.showToolbar()
}
```

## Browser Compatibility

### Supported Features

- **ES6 Modules**: Full support
- **TypeScript**: Native support
- **Modern DOM APIs**: Selection, Range, MutationObserver
- **CSS Custom Properties**: For theming

### Polyfills

For older browser support, include these polyfills:

```html
<!-- For IE11 support -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

### Feature Detection

The editor includes built-in feature detection:

```typescript
// Check for contenteditable support
if (!document.queryCommandSupported('contentEditable')) {
  console.warn('contentEditable not supported')
}

// Check for Selection API
if (!window.getSelection) {
  console.warn('Selection API not supported')
}
```

## Performance Considerations

### Memory Management

Always destroy editors when no longer needed:

```typescript
// Clean up when component unmounts
editor.destroy()
```

### Event Optimization

Use event delegation for better performance:

```typescript
// Good: Single event listener
document.addEventListener('click', (event) => {
  if (event.target.matches('.editor-button')) {
    // Handle click
  }
})

// Avoid: Multiple event listeners
buttons.forEach((button) => {
  button.addEventListener('click', handler)
})
```

### DOM Optimization

Batch DOM updates when possible:

```typescript
// Good: Batch updates
editor.stopSelectionUpdates()
// Multiple DOM changes
editor.startSelectionUpdates()

// Avoid: Individual updates
// Multiple separate DOM modifications
```

## Next Steps

- Explore [Toolbar](/features/toolbar) for detailed functionality guides
- Check out [Extensions](/extensions) for creating custom functionality
- See [Custom Extensions](/advanced/custom-extensions) for complex scenarios
- Review [Usage Guide](/usage) for practical implementations
