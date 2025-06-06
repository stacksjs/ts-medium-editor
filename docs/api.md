# API Reference

This page provides a complete reference for all TypeScript Medium Editor APIs, including classes, methods, properties, and interfaces based on the actual implementation.

## MediumEditor Class

### Constructor

```typescript
constructor(elements?: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions)
```

**Parameters:**
- `elements`: CSS selector string, DOM element, NodeList, or array of elements (optional)
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

#### `id: number`
Unique identifier for the editor instance.

#### `elements: HTMLElement[]`
Array of DOM elements that the editor is attached to.

#### `options: MediumEditorOptions`
Current configuration options for the editor.

#### `events: Events`
Event handling system instance.

#### `selection: typeof selection`
Selection utility functions.

#### `util: typeof util`
Utility functions.

#### `version: VersionInfo`
Version information object.

#### `extensions: Record<string, MediumEditorExtension>`
Map of loaded extensions.

### Initialization Methods

#### `init(elements: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions): MediumEditor`
Initialize the editor with elements and options.

#### `setup(): MediumEditor`
Set up the editor (initializes extensions and event handlers).

#### `destroy(): void`
Destroy the editor and clean up all resources.

### Content Methods

#### `getContent(index?: number): string | null`
Get HTML content from editor elements.

**Parameters:**
- `index`: Optional index of specific element (returns all if omitted)

**Returns:** HTML string content or null

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

#### `serialize(): Record<string, string>`
Serialize all editor elements to a key-value object.

**Returns:** Object with element indices as keys and HTML content as values

#### `resetContent(element?: HTMLElement): void`
Reset content to original state.

**Parameters:**
- `element`: Optional specific element to reset

#### `checkContentChanged(editable?: HTMLElement): void`
Check if content has changed since initialization and trigger events.

**Parameters:**
- `editable`: Optional specific element to check

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

#### `saveSelection(): void`
Save current selection to internal state.

#### `restoreSelection(): void`
Restore previously saved selection.

#### `selectAllContents(): void`
Select all content in the currently focused element.

#### `selectElement(element: HTMLElement): void`
Select a specific element.

**Parameters:**
- `element`: Element to select

#### `getFocusedElement(): HTMLElement | null`
Get the currently focused editor element.

#### `getSelectedParentElement(range?: Range): HTMLElement`
Get the parent element of the current selection.

#### `stopSelectionUpdates(): void`
Temporarily stop selection update events.

#### `startSelectionUpdates(): void`
Resume selection update events.

#### `checkSelection(): void`
Manually trigger selection checking and toolbar updates.

### Action Methods

#### `execAction(action: string, opts?: any): boolean`
Execute a formatting action.

**Parameters:**
- `action`: Action name ('bold', 'italic', 'underline', etc.)
- `opts`: Optional action-specific options

**Returns:** Boolean indicating success

**Available Actions:**
- `bold`, `italic`, `underline`
- `h2`, `h3`
- `quote`
- `createLink`
- `unlink`

**Example:**
```typescript
editor.execAction('bold')
editor.execAction('createLink', { value: 'https://example.com' })
```

#### `queryCommandState(action: string): boolean`
Check if a formatting command is currently active.

**Parameters:**
- `action`: Command name to check

**Returns:** Boolean indicating if command is active

### Event Methods

#### `subscribe(event: string, listener: (data?: any, editable?: HTMLElement) => void): MediumEditor`
Subscribe to editor events.

**Parameters:**
- `event`: Event name
- `listener`: Event handler function

**Example:**
```typescript
editor.subscribe('editableInput', (data, editable) => {
  console.log('Content changed:', editable.innerHTML)
})
```

#### `unsubscribe(event: string, listener: (data?: any, editable?: HTMLElement) => void): MediumEditor`
Unsubscribe from editor events.

#### `trigger(name: string, data?: any, editable?: HTMLElement): MediumEditor`
Trigger a custom event.

#### `on(target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture?: boolean): MediumEditor`
Attach DOM event listener (for internal use).

#### `off(target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture?: boolean): MediumEditor`
Detach DOM event listener (for internal use).

### Element Management

#### `addElements(selector: string | HTMLElement | HTMLElement[] | NodeList): MediumEditor`
Add elements to the editor.

#### `removeElements(selector: string | HTMLElement | HTMLElement[] | NodeList): MediumEditor`
Remove elements from the editor.

### State Methods

#### `activate(): MediumEditor`
Activate the editor.

#### `deactivate(): MediumEditor`
Deactivate the editor.

#### `isActive(): boolean`
Check if the editor is currently active.

### Extension Methods

#### `getExtensionByName(name: string): MediumEditorExtension | undefined`
Get an extension instance by name.

**Parameters:**
- `name`: Extension name

**Returns:** Extension instance or undefined

**Example:**
```typescript
const toolbar = editor.getExtensionByName('toolbar')
```

### Utility Methods

#### `delay(fn: () => void): void`
Execute a function with a delay (using the configured delay option).

#### `createLink(opts: { value: string, target?: string, buttonClass?: string }): void`
Create a link from the current selection.

#### `cleanPaste(text: string): string`
Clean pasted text content.

#### `pasteHTML(html: string, options?: { cleanAttrs?: string[], cleanTags?: string[], unwrapTags?: string[] }): void`
Paste HTML content into the editor.

## Events

### Content Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `editableInput` | `(data: any, editable: HTMLElement)` | Content changed |
| `editableKeydown` | `(data: KeyboardEvent, editable: HTMLElement)` | Key pressed down |
| `editableKeyup` | `(data: KeyboardEvent, editable: HTMLElement)` | Key released |
| `editableKeypress` | `(data: KeyboardEvent, editable: HTMLElement)` | Key pressed |
| `editableClick` | `(data: Event, editable: HTMLElement)` | Editor clicked |
| `editableBlur` | `(data: FocusEvent, editable: HTMLElement)` | Editor lost focus |
| `editablePaste` | `(data: ClipboardEvent, editable: HTMLElement)` | Content pasted |
| `editableDrag` | `(data: DragEvent, editable: HTMLElement)` | Content dragged |
| `editableDrop` | `(data: DragEvent, editable: HTMLElement)` | Content dropped |

### Focus Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `focus` | `(data: FocusEvent, editable: HTMLElement)` | Editor gained focus |
| `blur` | `(data: FocusEvent, editable: HTMLElement)` | Editor lost focus |
| `externalInteraction` | `(data: Event)` | User interacted outside editor |

### Toolbar Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `showToolbar` | `(data: any, editable: HTMLElement)` | Toolbar shown |
| `hideToolbar` | `(data: any, editable: HTMLElement)` | Toolbar hidden |
| `positionToolbar` | `(data: any, editable: HTMLElement)` | Toolbar repositioned |

## Configuration Interfaces

### MediumEditorOptions

```typescript
interface MediumEditorOptions {
  // Core Settings
  activeButtonClass?: string // CSS class for active buttons
  buttonLabels?: boolean | string | Record<string, string> // Button label configuration
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
  extensions?: Record<string, MediumEditorExtension> // Custom extensions

  // Built-in Features
  toolbar?: ToolbarOptions | false // Toolbar configuration
  anchorPreview?: AnchorPreviewOptions | false // Link preview
  placeholder?: PlaceholderOptions | false // Placeholder text
  anchor?: AnchorOptions | false // Link creation
  paste?: PasteOptions | false // Paste handling
  keyboardCommands?: KeyboardCommandsOptions | false // Keyboard shortcuts
}
```

### ToolbarOptions

```typescript
interface ToolbarOptions {
  // Button Configuration
  buttons?: Array<string | ToolbarButton> // Button list
  firstButtonClass?: string // CSS class for first button
  lastButtonClass?: string // CSS class for last button

  // Positioning
  static?: boolean // Always visible toolbar
  align?: 'left' | 'center' | 'right' // Toolbar alignment
  sticky?: boolean // Stick to viewport when scrolling
  relativeContainer?: HTMLElement | null // Position relative to container
  diffLeft?: number // Horizontal offset
  diffTop?: number // Vertical offset

  // Behavior
  allowMultiParagraphSelection?: boolean // Show for multi-paragraph selections
  standardizeSelectionStart?: boolean // Normalize selection start
  updateOnEmptySelection?: boolean // Update on empty selection
}
```

### ToolbarButton

```typescript
interface ToolbarButton {
  name: string // Button identifier
  action?: string // Command action
  aria?: string // Accessibility label
  tagNames?: string[] // Associated HTML tags
  style?: { prop: string, value: string } // Inline style detection
  useQueryState?: boolean // Use queryCommandState
  contentDefault?: string // Button content (HTML)
  contentFA?: string // FontAwesome content
  classList?: string[] // CSS classes
  attrs?: Record<string, string> // HTML attributes
}
```

### PlaceholderOptions

```typescript
interface PlaceholderOptions {
  text?: string // Placeholder text
  hideOnClick?: boolean // Hide when clicked
  hideOnFocus?: boolean // Hide when focused
}
```

### AnchorOptions

```typescript
interface AnchorOptions {
  customClassOption?: string // Custom CSS class
  customClassOptionText?: string // Custom class label
  linkValidation?: boolean // Validate URLs
  placeholderText?: string // Input placeholder
  targetCheckbox?: boolean // Show target checkbox
  targetCheckboxText?: string // Target checkbox label
}
```

### PasteOptions

```typescript
interface PasteOptions {
  forcePlainText?: boolean // Force plain text paste
  cleanPastedHTML?: boolean // Clean HTML content
  preCleanReplacements?: Array<[RegExp, string]> // Pre-clean replacements
  cleanReplacements?: Array<[RegExp, string]> // Clean replacements
  cleanAttrs?: string[] // Attributes to clean
  cleanTags?: string[] // Tags to clean
  unwrapTags?: string[] // Tags to unwrap
}
```

### KeyboardCommandsOptions

```typescript
interface KeyboardCommandsOptions {
  commands?: KeyboardCommand[] // Keyboard command list
}

interface KeyboardCommand {
  command: string // Command name
  key: string // Key identifier
  meta?: boolean // Meta/Cmd key
  shift?: boolean // Shift key
  alt?: boolean // Alt key
}
```

### SelectionState

```typescript
interface SelectionState {
  start: number // Selection start offset
  end: number // Selection end offset
  startsWithImage?: boolean // Selection starts with image
  trailingImageCount?: number // Images at selection end
  emptyBlocksIndex?: number // Empty block position
}
```

## Extension Interfaces

### MediumEditorExtension

```typescript
interface MediumEditorExtension {
  name?: string // Extension identifier
  init?: () => void // Initialize extension
  destroy?: () => void // Cleanup extension
  checkState?: (node: Node) => void // Check state
  isActive?: () => boolean // Check if active
  isAlreadyApplied?: (node: Node) => boolean // Check if applied
  setActive?: () => void // Set active state
  setInactive?: () => void // Set inactive state
  queryCommandState?: () => boolean // Query command state
  handleClick?: (event: Event) => void // Handle click
  handleKeydown?: (event: KeyboardEvent) => void // Handle keydown
  getInteractionElements?: () => HTMLElement | HTMLElement[] // Get elements
}
```

### ButtonExtension

```typescript
interface ButtonExtension extends MediumEditorExtension {
  button?: HTMLElement // Button element
  action?: string // Button action
  aria?: string // Accessibility label
  tagNames?: string[] // Associated tags
  style?: { prop: string, value: string } // Style detection
  useQueryState?: boolean // Use query state
  contentDefault?: string // Default content
  contentFA?: string // FontAwesome content
  classList?: string[] // CSS classes
  attrs?: Record<string, string> // HTML attributes
}
```

## Toolbar Extension API

The toolbar extension provides additional methods beyond the base extension interface:

### Toolbar Class Methods

#### `createToolbar(): void`
Create the toolbar DOM element.

#### `createButtons(): void`
Create all toolbar buttons.

#### `createButton(name: string): HTMLElement | null`
Create a specific button by name.

#### `showToolbar(): void`
Show the toolbar.

#### `hideToolbar(): void`
Hide the toolbar.

#### `positionToolbar(): void`
Position the toolbar relative to selection.

#### `updateButtonStates(): void`
Update active states of all buttons.

#### `checkState(): void`
Check and update toolbar state.

#### `getToolbarElement(): HTMLElement | null`
Get the toolbar DOM element.

#### `getInteractionElements(): HTMLElement[]`
Get elements that should prevent external interaction events.

## Utility Functions

### Selection Utilities

#### `selection.exportSelection(root: HTMLElement, doc: Document): SelectionState | null`
Export selection state from a root element.

#### `selection.importSelection(selectionState: SelectionState, root: HTMLElement, doc: Document, favorLaterSelectionAnchor?: boolean): void`
Import selection state to a root element.

#### `selection.getSelectionElement(contentWindow: Window): HTMLElement | false`
Get the editor element containing the current selection.

#### `selection.getCaretOffsets(element: HTMLElement, range?: Range): CaretOffsets`
Get caret position within an element.

### DOM Utilities

#### `util.isElement(obj: any): obj is Element`
Check if object is a DOM element.

#### `util.isDescendant(parent: Node, child: Node, checkEquality?: boolean): boolean`
Check if node is descendant of another.

#### `util.traverseUp(current: Node, testElementFunction: (node: Node) => boolean): Node | false`
Traverse up DOM tree with test function.

#### `util.getClosestBlockContainer(node: Node): HTMLElement | null`
Get closest block container element.

#### `util.insertHTMLCommand(doc: Document, html: string): void`
Insert HTML at current selection.

### String Utilities

#### `util.htmlEntities(str: string): string`
Encode HTML entities in string.

#### `util.ensureUrlHasProtocol(url: string): string`
Ensure URL has protocol prefix.

### Browser Detection

#### `util.isIE: boolean`
True if Internet Explorer.

#### `util.isEdge: boolean`
True if Microsoft Edge.

#### `util.isFF: boolean`
True if Firefox.

#### `util.isMac: boolean`
True if macOS.

## Version Information

### VersionInfo Interface

```typescript
interface VersionInfo {
  major: number
  minor: number
  revision: number
  preRelease: string
  toString: () => string
}
```

Access version information:

```typescript
console.log(MediumEditor.version.toString()) // "1.0.0"
console.log(editor.version.major) // 1
```

## Error Handling

### Common Error Scenarios

1. **Invalid Elements**: When constructor receives invalid elements
2. **Extension Not Found**: When accessing non-existent extension
3. **Selection Issues**: When selection operations fail

### Best Practices

Always check for extension existence:

```typescript
const toolbar = editor.getExtensionByName('toolbar')
if (toolbar) {
  // Safe to use toolbar methods
  toolbar.showToolbar()
}
```

Check editor state before operations:

```typescript
if (editor.isActive()) {
  editor.execAction('bold')
}
```

## Browser Compatibility

### Supported Features

- **Modern DOM APIs**: Selection, Range, MutationObserver
- **ES6+ Features**: Classes, arrow functions, template literals
- **TypeScript**: Full type safety and IntelliSense

### Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+ (Chromium-based)

### Feature Detection

The editor includes built-in feature detection for:

- contentEditable support
- Input event support
- Selection API availability

## Performance Considerations

### Memory Management

Always destroy editors when no longer needed:

```typescript
// Clean up when component unmounts
editor.destroy()
```

### Event Optimization

The editor uses efficient event handling:

- Event delegation where possible
- Debounced expensive operations
- Proper cleanup on destroy

### DOM Optimization

Use selection update controls for batch operations:

```typescript
// Batch DOM updates
editor.stopSelectionUpdates()
// Multiple DOM changes
editor.startSelectionUpdates()
```

## Next Steps

- Explore [Toolbar](/features/toolbar) for detailed toolbar functionality
- Check out [Events](/features/events) for comprehensive event handling
- See [Extensions](/extensions) for creating custom functionality
- Review [Extensions](/extensions) for advanced scenarios
