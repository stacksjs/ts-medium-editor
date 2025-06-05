import type { DOMMatch, KeyCodes } from './types'

// Browser detection utilities
// eslint-disable-next-line prefer-regex-literals
const isIE = ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:(\\d[.0-9]*)').exec(navigator.userAgent) !== null)))

const isEdge = (/Edge\/\d+/).exec(navigator.userAgent) !== null
const isFF = navigator.userAgent.toLowerCase().includes('firefox')
const isMac = window.navigator.platform.toUpperCase().includes('MAC')

// Key codes constants
const keyCode: KeyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  DELETE: 46,
  K: 75,
  M: 77,
  V: 86,
}

const blockContainerElementNames = [
  // elements our editor generates
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'ul',
  'li',
  'ol',
  // all other known block elements
  'address',
  'article',
  'aside',
  'audio',
  'canvas',
  'dd',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'header',
  'hgroup',
  'main',
  'nav',
  'noscript',
  'output',
  'section',
  'video',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
]

const emptyElementNames = ['br', 'col', 'colgroup', 'hr', 'img', 'input', 'source', 'wbr']

// Check if Node.contains works with text nodes
let nodeContainsWorksWithTextNodes = false
try {
  const testParent = document.createElement('div')
  const testText = document.createTextNode(' ')
  testParent.appendChild(testText)
  nodeContainsWorksWithTextNodes = testParent.contains(testText)
}
catch {
  // Silent fail for older browsers
}

// Utility functions
function copyInto(overwrite: boolean, dest: any, ...sources: any[]): any {
  dest = dest || {}
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    if (source) {
      for (const prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)
          && typeof source[prop] !== 'undefined'
          && (overwrite || !Object.prototype.hasOwnProperty.call(dest, prop) || typeof dest[prop] === 'undefined')) {
          dest[prop] = source[prop]
        }
      }
    }
  }
  return dest
}

function extend(...sources: any[]): any {
  if (sources.length === 0)
    return {}
  const target = sources[0] || {}
  const extendSources = sources.slice(1)
  return copyInto(true, target, ...extendSources)
}

function defaults(...sources: any[]): any {
  if (sources.length === 0)
    return {}
  const target = sources[0] || {}
  const defaultSources = sources.slice(1)
  return copyInto(false, target, ...defaultSources)
}

function isMetaCtrlKey(event: KeyboardEvent): boolean {
  return (isMac && event.metaKey) || (!isMac && event.ctrlKey)
}

function isKey(event: KeyboardEvent, keys: number | number[]): boolean {
  const keyCodeValue = getKeyCode(event)

  if (!Array.isArray(keys)) {
    return keyCodeValue === keys
  }

  return keys.includes(keyCodeValue)
}

function getKeyCode(event: KeyboardEvent): number {
  let keyCodeValue = event.which

  if (keyCodeValue === null) {
    keyCodeValue = event.charCode !== null ? event.charCode : event.keyCode
  }

  return keyCodeValue
}

function isElement(obj: any): obj is Element {
  return obj != null && obj.nodeType === 1
}

function isDescendant(parent: Node, child: Node, checkEquality = false): boolean {
  if (!parent || !child) {
    return false
  }

  if (parent === child) {
    return !!checkEquality
  }

  // If parent is not an element, it can't have any descendants
  if (parent.nodeType !== 1) {
    return false
  }

  if (nodeContainsWorksWithTextNodes || child.nodeType !== 3) {
    return parent.contains(child)
  }

  // Fallback for browsers that don't support contains with text nodes
  let current = child.parentNode
  while (current) {
    if (current === parent) {
      return true
    }
    current = current.parentNode
  }

  return false
}

function traverseUp(current: Node, testElementFunction: (node: Node) => boolean): Node | false {
  if (!current) {
    return false
  }

  do {
    if (current.nodeType === 1 && testElementFunction(current)) {
      return current
    }
    current = current.parentNode!
  } while (current)

  return false
}

function htmlEntities(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function insertHTMLCommand(doc: Document, html: string): void {
  let _hasVisualSelection = false
  let selection: globalThis.Selection | null = null
  let range: Range | null = null

  if (doc.getSelection) {
    selection = doc.getSelection()
    if (selection && selection.rangeCount) {
      const firstRange = selection.getRangeAt(0)
      const isCollapsed = firstRange.collapsed
      range = firstRange.cloneRange()
      _hasVisualSelection = !isCollapsed
    }
  }

  if (doc.queryCommandSupported && doc.queryCommandSupported('insertHTML')) {
    doc.execCommand('insertHTML', false, html)
  }
  else if (range) {
    range.deleteContents()
    const el = doc.createElement('div')
    el.innerHTML = html
    const frag = doc.createDocumentFragment()
    let node: Node | null
    let lastNode: Node | null = null

    // eslint-disable-next-line no-cond-assign
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node)
    }

    range.insertNode(frag)

    if (lastNode && selection) {
      range = range.cloneRange()
      range.setStartAfter(lastNode)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
  else {
    console.warn('insertHTMLCommand: unable to insert HTML')
  }
}

function execFormatBlock(doc: Document, tagName: string): void {
  const ieVersion = getIEVersion()

  if (ieVersion && ieVersion <= 10) {
    doc.execCommand('formatBlock', false, `<${tagName}>`)
  }
  else {
    doc.execCommand('formatBlock', false, tagName)
  }
}

function getIEVersion(): number | null {
  const match = navigator.userAgent.match(/MSIE (\d+)/)
  if (match) {
    return Number.parseInt(match[1], 10)
  }

  const tridentMatch = navigator.userAgent.match(/Trident\/.*rv:(\d+)/)
  if (tridentMatch) {
    return Number.parseInt(tridentMatch[1], 10)
  }

  return null
}

function setTargetBlank(el: HTMLElement, anchorUrl?: string): void {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll('a')

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i] as HTMLAnchorElement
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
  }
}

function removeTargetBlank(el: HTMLElement, anchorUrl?: string): void {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll('a')

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i] as HTMLAnchorElement
    anchor.removeAttribute('target')
    if (anchor.rel === 'noopener noreferrer') {
      anchor.removeAttribute('rel')
    }
  }
}

function addClassToAnchors(el: HTMLElement, buttonClass: string): void {
  const anchors = el.querySelectorAll('a')

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    anchor.classList.add(buttonClass)
  }
}

function isListItem(node: Node): boolean {
  if (!node) {
    return false
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    if (element.nodeName.toLowerCase() === 'li') {
      return true
    }
  }

  let parentNode = node.parentNode
  let tagName = parentNode?.nodeName.toLowerCase()

  while (parentNode && (tagName === 'li' || (!isBlockContainer(parentNode as HTMLElement) && tagName !== 'div'))) {
    if (tagName === 'li') {
      return true
    }
    parentNode = parentNode.parentNode
    if (parentNode) {
      tagName = parentNode.nodeName.toLowerCase()
    }
    else {
      return false
    }
  }

  return false
}

function cleanListDOM(ownerDocument: Document, element: HTMLElement): void {
  const listElements = element.querySelectorAll('ol, ul')

  for (let i = 0; i < listElements.length; i++) {
    const listElement = listElements[i]
    const listItems = listElement.children

    for (let j = listItems.length - 1; j >= 0; j--) {
      const listItem = listItems[j]

      if (listItem.tagName.toLowerCase() !== 'li') {
        const li = ownerDocument.createElement('li')
        li.innerHTML = listItem.innerHTML
        listElement.replaceChild(li, listItem)
      }
    }
  }
}

function findCommonRoot(inNode1: Node, inNode2: Node): Node {
  const node1Parents: Node[] = []
  let current1: Node | null = inNode1

  while (current1) {
    node1Parents.push(current1)
    current1 = current1.parentNode
  }

  let current2: Node | null = inNode2
  while (current2) {
    if (node1Parents.includes(current2)) {
      return current2
    }
    current2 = current2.parentNode
  }

  return inNode1.ownerDocument!.body
}

function isElementAtBeginningOfBlock(node: Node): boolean {
  const container = getClosestBlockContainer(node)
  if (!container) {
    return false
  }

  return getFirstSelectableLeafNode(container) === node
}

function isMediumEditorElement(element: HTMLElement): boolean {
  return element && element.getAttribute('data-medium-editor-element') === 'true'
}

function getContainerEditorElement(element: HTMLElement): HTMLElement | null {
  return traverseUp(element, node =>
    isMediumEditorElement(node as HTMLElement)) as HTMLElement | null
}

function isBlockContainer(element: HTMLElement): boolean {
  return blockContainerElementNames.includes(element.tagName.toLowerCase())
}

function getClosestBlockContainer(node: Node): HTMLElement | null {
  return traverseUp(node, testNode =>
    isBlockContainer(testNode as HTMLElement)) as HTMLElement | null
}

function getTopBlockContainer(element: HTMLElement): HTMLElement {
  let topContainer = element

  while (topContainer.parentElement && !isMediumEditorElement(topContainer.parentElement)) {
    const parent = topContainer.parentElement
    if (isBlockContainer(parent)) {
      topContainer = parent
    }
    else {
      break
    }
  }

  return topContainer
}

function getFirstSelectableLeafNode(element: HTMLElement): Node | null {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node: Node): number {
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT
        }

        const el = node as Element
        if (emptyElementNames.includes(el.tagName.toLowerCase())) {
          return NodeFilter.FILTER_ACCEPT
        }

        return NodeFilter.FILTER_SKIP
      },
    },
  )

  return walker.nextNode()
}

function getFirstTextNode(element: HTMLElement): Text | null {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
  )

  return walker.nextNode() as Text | null
}

function ensureUrlHasProtocol(url: string): string {
  if (!url.includes('://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    return `http://${url}`
  }
  return url
}

function warn(...args: any[]): void {
  if (console && console.warn) {
    console.warn(...args)
  }
}

function deprecated(oldName: string, newName: string, version: string): void {
  const message = `${oldName} is deprecated, please use ${newName} instead. ${oldName} will be removed in version ${version}`
  warn(message)
}

function deprecatedMethod(oldName: string, newName: string, args: any[], version: string): any {
  deprecated(oldName, newName, version)
  // Return undefined as we're not implementing the old method
  return undefined
}

function cleanupAttrs(el: HTMLElement, attrs: string[]): void {
  for (const attr of attrs) {
    el.removeAttribute(attr)
  }
}

function cleanupTags(el: HTMLElement, tags: string[]): void {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag)
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove()
    }
  }
}

function unwrapTags(el: HTMLElement, tags: string[]): void {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag)
    for (let i = 0; i < elements.length; i++) {
      unwrap(elements[i] as HTMLElement, el.ownerDocument)
    }
  }
}

function getClosestTag(el: HTMLElement, tag: string): HTMLElement | false {
  return traverseUp(el, (node) => {
    const element = node as HTMLElement
    return !!(element.tagName && element.tagName.toLowerCase() === tag.toLowerCase())
  }) as HTMLElement | false
}

function unwrap(el: HTMLElement, doc: Document): void {
  const parent = el.parentNode
  if (!parent)
    return

  const frag = doc.createDocumentFragment()
  while (el.firstChild) {
    frag.appendChild(el.firstChild)
  }

  parent.replaceChild(frag, el)
}

function guid(): string {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      return func.apply(this, args)
    }
    else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        return func.apply(this, args)
      }, remaining)
    }
  }

  return throttled as T
}

// Advanced DOM manipulation functions
function findOrCreateMatchingTextNodes(document: Document, element: HTMLElement, match: DOMMatch): Text[] {
  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
  )

  const matchedNodes: Text[] = []
  let currentTextIndex = 0
  let startReached = false
  let currentNode: Text | null = treeWalker.nextNode() as Text | null

  while (currentNode) {
    const nextTextIndex = currentTextIndex + currentNode.textContent!.length

    if (!startReached && match.start >= currentTextIndex && match.start < nextTextIndex) {
      const matchStartIndex = match.start - currentTextIndex
      if (matchStartIndex > 0) {
        currentNode = currentNode.splitText(matchStartIndex)
        currentTextIndex += matchStartIndex
      }
      startReached = true
    }

    if (startReached) {
      if (match.end <= nextTextIndex) {
        const matchEndIndex = match.end - currentTextIndex
        if (matchEndIndex < currentNode.textContent!.length) {
          currentNode.splitText(matchEndIndex)
        }
        matchedNodes.push(currentNode)
        break
      }
      matchedNodes.push(currentNode)
    }

    currentTextIndex = nextTextIndex
    currentNode = treeWalker.nextNode() as Text | null
  }

  return matchedNodes
}

function splitByBlockElements(element: HTMLElement): HTMLElement[] {
  const blocks: HTMLElement[] = []
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node: Node): number {
        const el = node as Element
        if (isBlockContainer(el as HTMLElement)) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      },
    },
  )

  let node: HTMLElement | null = walker.nextNode() as HTMLElement | null
  while (node) {
    blocks.push(node)
    node = walker.nextNode() as HTMLElement | null
  }

  return blocks
}

function findAdjacentTextNodeWithContent(rootNode: HTMLElement, targetNode: Node, _ownerDocument: Document): Text | null {
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node: Node): number {
        const textNode = node as Text
        if (textNode.textContent && textNode.textContent.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      },
    },
  )

  let node: Text | null = walker.nextNode() as Text | null
  while (node) {
    if (node === targetNode || isDescendant(targetNode, node)) {
      return walker.nextNode() as Text | null
    }
    node = walker.nextNode() as Text | null
  }

  return null
}

function findPreviousSibling(node: Node): Node | null {
  let current = node.previousSibling
  while (current && current.nodeType === Node.TEXT_NODE && !current.textContent?.trim()) {
    current = current.previousSibling
  }
  return current
}

function createLink(document: Document, textNodes: Text[], href: string, target?: string): HTMLAnchorElement {
  const anchor = document.createElement('a')
  moveTextRangeIntoElement(textNodes[0], textNodes[textNodes.length - 1], anchor)
  anchor.setAttribute('href', href)

  if (target) {
    if (target === '_blank') {
      anchor.setAttribute('rel', 'noopener noreferrer')
    }
    anchor.setAttribute('target', target)
  }

  return anchor
}

function moveTextRangeIntoElement(startNode: Node, endNode: Node, newElement: HTMLElement): void {
  const range = document.createRange()
  range.setStartBefore(startNode)
  range.setEndAfter(endNode)

  const contents = range.extractContents()
  newElement.appendChild(contents)
  range.insertNode(newElement)
}

function splitOffDOMTree(rootNode: Node, leafNode: Node, splitLeft = false): Node {
  let current = leafNode
  let parent = current.parentNode

  while (parent && parent !== rootNode) {
    const newParent = parent.cloneNode(false)

    if (splitLeft) {
      while (current.previousSibling) {
        newParent.insertBefore(current.previousSibling, newParent.firstChild)
      }
    }
    else {
      while (current.nextSibling) {
        newParent.appendChild(current.nextSibling)
      }
    }

    if (newParent.hasChildNodes()) {
      if (splitLeft) {
        parent.parentNode!.insertBefore(newParent, parent)
      }
      else {
        parent.parentNode!.insertBefore(newParent, parent.nextSibling)
      }
    }

    current = parent
    parent = current.parentNode
  }

  return current
}

function depthOfNode(inNode: Node): number {
  let depth = 0
  let current: Node | null = inNode

  while (current.parentNode) {
    depth++
    current = current.parentNode
  }

  return depth
}

// Export all utility functions
export const util: import('./types').Util = {
  // Browser detection
  isIE,
  isEdge,
  isFF,
  isMac,

  // Constants
  keyCode,
  blockContainerElementNames,
  emptyElementNames,

  // Core utilities
  extend,
  defaults,
  copyInto,
  isMetaCtrlKey,
  isKey,
  getKeyCode,
  isElement,
  isDescendant,
  traverseUp,
  htmlEntities,
  insertHTMLCommand,
  execFormatBlock,
  setTargetBlank,
  removeTargetBlank,
  addClassToAnchors,
  isListItem,
  cleanListDOM,
  findCommonRoot,
  isElementAtBeginningOfBlock,
  isMediumEditorElement,
  getContainerEditorElement,
  isBlockContainer,
  getClosestBlockContainer,
  getTopBlockContainer,
  getFirstSelectableLeafNode,
  getFirstTextNode,
  ensureUrlHasProtocol,
  warn,
  deprecated,
  deprecatedMethod,
  cleanupAttrs,
  cleanupTags,
  unwrapTags,
  getClosestTag,
  unwrap,
  guid,
  throttle,
  findOrCreateMatchingTextNodes,
  splitByBlockElements,
  findAdjacentTextNodeWithContent,
  findPreviousSibling,
  createLink,
  moveTextRangeIntoElement,
  splitOffDOMTree,
  depthOfNode,
}

export default util
