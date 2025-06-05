/// <reference lib="dom" />

// Core interfaces for MediumEditor
export interface MediumEditorOptions {
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
  extensions?: Record<string, MediumEditorExtension | any>
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

export interface ToolbarOptions {
  allowMultiParagraphSelection?: boolean
  buttons?: Array<string | ToolbarButton>
  diffLeft?: number
  diffTop?: number
  firstButtonClass?: string
  lastButtonClass?: string
  relativeContainer?: HTMLElement | null
  standardizeSelectionStart?: boolean
  static?: boolean
  align?: 'left' | 'center' | 'right'
  sticky?: boolean
  updateOnEmptySelection?: boolean
}

export interface ToolbarButton {
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

export interface AnchorPreviewOptions {
  hideDelay?: number
  previewValueSelector?: string
  showWhenToolbarIsVisible?: boolean
  showOnEmptyLinks?: boolean
}

export interface PlaceholderOptions {
  text?: string
  hideOnClick?: boolean
  hideOnFocus?: boolean
}

export interface AnchorOptions {
  customClassOption?: string
  customClassOptionText?: string
  linkValidation?: boolean
  placeholderText?: string
  targetCheckbox?: boolean
  targetCheckboxText?: string
}

export interface PasteOptions {
  forcePlainText?: boolean
  cleanPastedHTML?: boolean
  preCleanReplacements?: Array<[RegExp, string]>
  cleanReplacements?: Array<[RegExp, string]>
  cleanAttrs?: string[]
  cleanTags?: string[]
  unwrapTags?: string[]
}

export interface KeyboardCommandsOptions {
  commands?: KeyboardCommand[]
}

export interface KeyboardCommand {
  command: string
  key: string
  meta?: boolean
  shift?: boolean
  alt?: boolean
}

export interface SelectionState {
  start: number
  end: number
  startsWithImage?: boolean
  trailingImageCount?: number
  emptyBlocksIndex?: number
}

export interface VersionInfo {
  major: number
  minor: number
  revision: number
  preRelease: string
  toString: () => string
}

export interface EventInfo {
  target: HTMLElement
  preventDefault: () => void
  stopPropagation: () => void
}

// Extension interfaces
export interface MediumEditorExtension {
  name?: string
  init?: () => void
  destroy?: () => void
  checkState?: (node: Node) => void
  isActive?: () => boolean
  isAlreadyApplied?: (node: Node) => boolean
  setActive?: () => void
  setInactive?: () => void
  queryCommandState?: () => boolean
  handleClick?: (event: Event) => void
  handleKeydown?: (event: KeyboardEvent) => void
  getInteractionElements?: () => HTMLElement | HTMLElement[]
}

export interface ButtonExtension extends MediumEditorExtension {
  button?: HTMLElement
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

// Utility types
export interface KeyCodes {
  BACKSPACE: number
  TAB: number
  ENTER: number
  ESCAPE: number
  SPACE: number
  DELETE: number
  K: number
  M: number
  V: number
}

export interface CaretOffsets {
  left: number
  right: number
}

export interface DOMMatch {
  start: number
  end: number
}

// Event listener types
export type MediumEditorEventListener = (data?: any, editable?: HTMLElement) => void
export type CustomEventName = string

// Main MediumEditor class interface
export interface MediumEditor {
  // Properties
  id: number
  elements: HTMLElement[]
  options: MediumEditorOptions
  events: Events
  selection: Selection
  util: Util
  version: VersionInfo

  // Core methods
  init: (elements: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions) => MediumEditor
  setup: () => MediumEditor
  destroy: () => void

  // Event methods
  on: (target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture?: boolean) => MediumEditor
  off: (target: HTMLElement | Document | Window, event: string, listener: EventListener, useCapture?: boolean) => MediumEditor
  subscribe: (event: CustomEventName, listener: MediumEditorEventListener) => MediumEditor
  unsubscribe: (event: CustomEventName, listener: MediumEditorEventListener) => MediumEditor
  trigger: (name: CustomEventName, data?: any, editable?: HTMLElement) => MediumEditor

  // Content methods
  serialize: () => Record<string, string>
  getContent: (index?: number) => string
  setContent: (html: string, index?: number) => void
  resetContent: (element?: HTMLElement) => void
  checkContentChanged: (editable?: HTMLElement) => void

  // Selection methods
  exportSelection: () => SelectionState | null
  saveSelection: () => void
  importSelection: (selectionState: SelectionState, favorLaterSelectionAnchor?: boolean) => void
  restoreSelection: () => void
  selectAllContents: () => void
  selectElement: (element: HTMLElement) => void
  getFocusedElement: () => HTMLElement | null
  getSelectedParentElement: (range?: Range) => HTMLElement
  stopSelectionUpdates: () => void
  startSelectionUpdates: () => void
  checkSelection: () => void

  // Action methods
  execAction: (action: string, opts?: any) => boolean
  queryCommandState: (action: string) => boolean

  // Extension methods
  getExtensionByName: (name: string) => MediumEditorExtension | undefined
  addBuiltInExtension: (name: string, opts?: any) => MediumEditor

  // Element management
  addElements: (selector: string | HTMLElement | HTMLElement[] | NodeList) => MediumEditor
  removeElements: (selector: string | HTMLElement | HTMLElement[] | NodeList) => MediumEditor

  // Utility methods
  delay: (fn: () => void) => void
  createLink: (opts: { value: string, target?: string, buttonClass?: string }) => void
  cleanPaste: (text: string) => string
  pasteHTML: (html: string, options?: { cleanAttrs?: string[], cleanTags?: string[], unwrapTags?: string[] }) => void

  // State methods
  activate: () => MediumEditor
  deactivate: () => MediumEditor
  isActive: () => boolean
}

// Static utility interfaces
export interface Util {
  // Browser detection
  isIE: boolean
  isEdge: boolean
  isFF: boolean
  isMac: boolean

  // Key codes
  keyCode: KeyCodes

  // Utility functions
  extend: (...sources: any[]) => any
  defaults: (...sources: any[]) => any
  copyInto: (overwrite: boolean, dest: any, ...sources: any[]) => any
  isMetaCtrlKey: (event: KeyboardEvent) => boolean
  isKey: (event: KeyboardEvent, keys: number | number[]) => boolean
  getKeyCode: (event: KeyboardEvent) => number
  isElement: (obj: any) => boolean
  isDescendant: (parent: Node, child: Node, checkEquality?: boolean) => boolean
  traverseUp: (current: Node, testElementFunction: (node: Node) => boolean) => Node | false
  htmlEntities: (str: string) => string
  insertHTMLCommand: (doc: Document, html: string) => void
  execFormatBlock: (doc: Document, tagName: string) => void
  setTargetBlank: (el: HTMLElement, anchorUrl?: string) => void
  removeTargetBlank: (el: HTMLElement, anchorUrl?: string) => void
  addClassToAnchors: (el: HTMLElement, buttonClass: string) => void
  isListItem: (node: Node) => boolean
  cleanListDOM: (ownerDocument: Document, element: HTMLElement) => void
  splitOffDOMTree: (rootNode: Node, leafNode: Node, splitLeft?: boolean) => Node
  moveTextRangeIntoElement: (startNode: Node, endNode: Node, newElement: HTMLElement) => void
  findCommonRoot: (inNode1: Node, inNode2: Node) => Node
  isElementAtBeginningOfBlock: (node: Node) => boolean
  isMediumEditorElement: (element: HTMLElement) => boolean
  getContainerEditorElement: (element: HTMLElement) => HTMLElement | null
  isBlockContainer: (element: HTMLElement) => boolean
  getClosestBlockContainer: (node: Node) => HTMLElement | null
  getTopBlockContainer: (element: HTMLElement) => HTMLElement
  getFirstSelectableLeafNode: (element: HTMLElement) => Node | null
  getFirstTextNode: (element: HTMLElement) => Text | null
  ensureUrlHasProtocol: (url: string) => string
  warn: (...args: any[]) => void
  deprecated: (oldName: string, newName: string, version: string) => void
  deprecatedMethod: (oldName: string, newName: string, args: any[], version: string) => any
  cleanupAttrs: (el: HTMLElement, attrs: string[]) => void
  cleanupTags: (el: HTMLElement, tags: string[]) => void
  unwrapTags: (el: HTMLElement, tags: string[]) => void
  getClosestTag: (el: HTMLElement, tag: string) => HTMLElement | false
  unwrap: (el: HTMLElement, doc: Document) => void
  guid: () => string
  throttle: <T extends (...args: any[]) => any>(func: T, wait: number) => T
  findOrCreateMatchingTextNodes: (document: Document, element: HTMLElement, match: DOMMatch) => Text[]
  splitByBlockElements: (element: HTMLElement) => HTMLElement[]
  findAdjacentTextNodeWithContent: (rootNode: HTMLElement, targetNode: Node, ownerDocument: Document) => Text | null
  findPreviousSibling: (node: Node) => Node | null
  createLink: (document: Document, textNodes: Text[], href: string, target?: string) => HTMLAnchorElement
  depthOfNode: (inNode: Node) => number
  blockContainerElementNames: string[]
  emptyElementNames: string[]
}

export interface Selection {
  findMatchingSelectionParent: (testElementFunction: (el: HTMLElement) => boolean, contentWindow: Window) => HTMLElement | false
  getSelectionElement: (contentWindow: Window) => HTMLElement | false
  exportSelection: (root: HTMLElement, doc: Document) => SelectionState | null
  importSelection: (selectionState: SelectionState, root: HTMLElement, doc: Document, favorLaterSelectionAnchor?: boolean) => void
  selectionContainsContent: (doc: Document) => boolean
  selectionInContentEditableFalse: (contentWindow: Window) => boolean
  getSelectionHtml: (doc: Document) => string
  getCaretOffsets: (element: HTMLElement, range?: Range) => CaretOffsets
  rangeSelectsSingleNode: (range: Range) => boolean
  getSelectedParentElement: (range: Range) => HTMLElement
  getSelectedElements: (doc: Document) => HTMLElement[]
  selectNode: (node: Node, doc: Document) => void
  select: (doc: Document, startNode: Node, startOffset: number, endNode: Node, endOffset: number) => void
  clearSelection: (doc: Document, moveCursorToStart?: boolean) => void
  moveCursor: (doc: Document, node: Node, offset?: number) => void
  getSelectionRange: (ownerDocument: Document) => Range | null
  selectRange: (ownerDocument: Document, range: Range) => void
  getSelectionStart: (ownerDocument: Document) => Node | null
  doesRangeStartWithImages: (range: Range, doc: Document) => boolean
  getTrailingImageCount: (root: HTMLElement, selectionState: SelectionState, endContainer: Node, endOffset: number) => number
  getIndexRelativeToAdjacentEmptyBlocks: (doc: Document, root: HTMLElement, cursorContainer: Node, cursorOffset: number) => number
}

export interface Events {
  InputEventOnContenteditableSupported: boolean
  attachDOMEvent: (targets: HTMLElement | HTMLElement[] | Window | Document, event: string, listener: EventListener, useCapture?: boolean) => void
  detachDOMEvent: (targets: HTMLElement | HTMLElement[] | Window | Document, event: string, listener: EventListener, useCapture?: boolean) => void
  detachAllDOMEvents: () => void
  detachAllEventsFromElement: (element: HTMLElement) => void
  attachAllEventsToElement: (element: HTMLElement) => void
  enableCustomEvent: (event: string) => void
  disableCustomEvent: (event: string) => void
  attachCustomEvent: (event: string, listener: MediumEditorEventListener) => void
  detachCustomEvent: (event: string, listener: MediumEditorEventListener) => void
  detachAllCustomEvents: () => void
  triggerCustomEvent: (name: string, data?: any, editable?: HTMLElement) => void
  destroy: () => void
}

// Global declaration for the library
declare global {
  interface Window {
    MediumEditor: MediumEditor & {
      new (elements: string | HTMLElement | HTMLElement[] | NodeList, options?: MediumEditorOptions): MediumEditor
      version: VersionInfo
      util: Util
      selection: Selection
      parseVersionString: (release: string) => VersionInfo
      extensions: Record<string, any>
    }
  }
}
