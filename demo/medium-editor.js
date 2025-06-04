// src/util.ts
const isIE = navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && new RegExp('Trident/.*rv:(\\d[.0-9]*)').exec(navigator.userAgent) !== null
const isEdge = /Edge\/\d+/.exec(navigator.userAgent) !== null
const isFF = navigator.userAgent.toLowerCase().includes('firefox')
const isMac = window.navigator.platform.toUpperCase().includes('MAC')
const keyCode = {
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
let nodeContainsWorksWithTextNodes = false
try {
  const testParent = document.createElement('div')
  const testText = document.createTextNode(' ')
  testParent.appendChild(testText)
  nodeContainsWorksWithTextNodes = testParent.contains(testText)
}
catch (exc) {}
function copyInto(overwrite, dest, ...sources) {
  dest = dest || {}
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    if (source) {
      for (const prop in source) {
        if (source.hasOwnProperty(prop) && typeof source[prop] !== 'undefined' && (overwrite || !dest.hasOwnProperty(prop) || typeof dest[prop] === 'undefined')) {
          dest[prop] = source[prop]
        }
      }
    }
  }
  return dest
}
function extend(...sources) {
  if (sources.length === 0)
    return {}
  const target = sources[0] || {}
  const extendSources = sources.slice(1)
  return copyInto(true, target, ...extendSources)
}
function defaults(...sources) {
  if (sources.length === 0)
    return {}
  const target = sources[0] || {}
  const defaultSources = sources.slice(1)
  return copyInto(false, target, ...defaultSources)
}
function isMetaCtrlKey(event) {
  return isMac && event.metaKey || !isMac && event.ctrlKey
}
function isKey(event, keys) {
  const keyCodeValue = getKeyCode(event)
  if (!Array.isArray(keys)) {
    return keyCodeValue === keys
  }
  return keys.includes(keyCodeValue)
}
function getKeyCode(event) {
  let keyCodeValue = event.which
  if (keyCodeValue === null) {
    keyCodeValue = event.charCode !== null ? event.charCode : event.keyCode
  }
  return keyCodeValue
}
function isElement(obj) {
  return obj != null && obj.nodeType === 1
}
function isDescendant(parent, child, checkEquality = false) {
  if (!parent || !child) {
    return false
  }
  if (parent === child) {
    return !!checkEquality
  }
  if (parent.nodeType !== 1) {
    return false
  }
  if (nodeContainsWorksWithTextNodes || child.nodeType !== 3) {
    return parent.contains(child)
  }
  let current = child.parentNode
  while (current) {
    if (current === parent) {
      return true
    }
    current = current.parentNode
  }
  return false
}
function traverseUp(current, testElementFunction) {
  if (!current) {
    return false
  }
  do {
    if (current.nodeType === 1 && testElementFunction(current)) {
      return current
    }
    current = current.parentNode
  } while (current)
  return false
}
function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function insertHTMLCommand(doc, html) {
  let hasVisualSelection = false
  let selection = null
  let range = null
  if (doc.getSelection) {
    selection = doc.getSelection()
    if (selection && selection.rangeCount) {
      const firstRange = selection.getRangeAt(0)
      const isCollapsed = firstRange.collapsed
      range = firstRange.cloneRange()
      hasVisualSelection = !isCollapsed
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
    let node
    let lastNode = null
    while (node = el.firstChild) {
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
function execFormatBlock(doc, tagName) {
  const ieVersion = getIEVersion()
  if (ieVersion && ieVersion <= 10) {
    doc.execCommand('formatBlock', false, `<${tagName}>`)
  }
  else {
    doc.execCommand('formatBlock', false, tagName)
  }
}
function getIEVersion() {
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
function setTargetBlank(el, anchorUrl) {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll('a')
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
  }
}
function removeTargetBlank(el, anchorUrl) {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll('a')
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    anchor.removeAttribute('target')
    if (anchor.rel === 'noopener noreferrer') {
      anchor.removeAttribute('rel')
    }
  }
}
function addClassToAnchors(el, buttonClass) {
  const anchors = el.querySelectorAll('a')
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    anchor.classList.add(buttonClass)
  }
}
function isListItem(node) {
  if (!node) {
    return false
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node
    if (element.nodeName.toLowerCase() === 'li') {
      return true
    }
  }
  let parentNode = node.parentNode
  let tagName = parentNode?.nodeName.toLowerCase()
  while (parentNode && (tagName === 'li' || !isBlockContainer(parentNode) && tagName !== 'div')) {
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
function cleanListDOM(ownerDocument, element) {
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
function findCommonRoot(inNode1, inNode2) {
  const node1Parents = []
  let current1 = inNode1
  while (current1) {
    node1Parents.push(current1)
    current1 = current1.parentNode
  }
  let current2 = inNode2
  while (current2) {
    if (node1Parents.includes(current2)) {
      return current2
    }
    current2 = current2.parentNode
  }
  return inNode1.ownerDocument.body
}
function isElementAtBeginningOfBlock(node) {
  const container = getClosestBlockContainer(node)
  if (!container) {
    return false
  }
  return getFirstSelectableLeafNode(container) === node
}
function isMediumEditorElement(element) {
  return element && element.getAttribute('data-medium-editor-element') === 'true'
}
function getContainerEditorElement(element) {
  return traverseUp(element, node => isMediumEditorElement(node))
}
function isBlockContainer(element) {
  return blockContainerElementNames.includes(element.tagName.toLowerCase())
}
function getClosestBlockContainer(node) {
  return traverseUp(node, testNode => isBlockContainer(testNode))
}
function getTopBlockContainer(element) {
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
function getFirstSelectableLeafNode(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return NodeFilter.FILTER_ACCEPT
      }
      const el = node
      if (emptyElementNames.includes(el.tagName.toLowerCase())) {
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_SKIP
    },
  }, false)
  return walker.nextNode()
}
function getFirstTextNode(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false)
  return walker.nextNode()
}
function ensureUrlHasProtocol(url) {
  if (!url.includes('://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    return `http://${url}`
  }
  return url
}
function warn(...args) {
  if (console && console.warn) {
    console.warn(...args)
  }
}
function deprecated(oldName, newName, version) {
  const message = `${oldName} is deprecated, please use ${newName} instead. ${oldName} will be removed in version ${version}`
  warn(message)
}
function deprecatedMethod(oldName, newName, args, version) {
  deprecated(oldName, newName, version)
}
function cleanupAttrs(el, attrs) {
  for (const attr of attrs) {
    el.removeAttribute(attr)
  }
}
function cleanupTags(el, tags) {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag)
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove()
    }
  }
}
function unwrapTags(el, tags) {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag)
    for (let i = 0; i < elements.length; i++) {
      unwrap(elements[i], el.ownerDocument)
    }
  }
}
function getClosestTag(el, tag) {
  return traverseUp(el, (node) => {
    const element = node
    return element.tagName && element.tagName.toLowerCase() === tag.toLowerCase()
  })
}
function unwrap(el, doc) {
  const parent = el.parentNode
  if (!parent)
    return
  const frag = doc.createDocumentFragment()
  while (el.firstChild) {
    frag.appendChild(el.firstChild)
  }
  parent.replaceChild(frag, el)
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}
function throttle(func, wait) {
  let timeout = null
  let previous = 0
  const throttled = function (...args) {
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
  return throttled
}
function findOrCreateMatchingTextNodes(document2, element, match) {
  const treeWalker = document2.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false)
  const matchedNodes = []
  let currentTextIndex = 0
  let startReached = false
  let currentNode = null
  while (currentNode = treeWalker.nextNode()) {
    const nextTextIndex = currentTextIndex + currentNode.textContent.length
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
        if (matchEndIndex < currentNode.textContent.length) {
          currentNode.splitText(matchEndIndex)
        }
        matchedNodes.push(currentNode)
        break
      }
      matchedNodes.push(currentNode)
    }
    currentTextIndex = nextTextIndex
  }
  return matchedNodes
}
function splitByBlockElements(element) {
  const blocks = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node2) {
      const el = node2
      if (isBlockContainer(el)) {
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_SKIP
    },
  }, false)
  let node
  while (node = walker.nextNode()) {
    blocks.push(node)
  }
  return blocks
}
function findAdjacentTextNodeWithContent(rootNode, targetNode, ownerDocument) {
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
    acceptNode(node2) {
      const textNode = node2
      if (textNode.textContent && textNode.textContent.trim().length > 0) {
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_SKIP
    },
  }, false)
  let node
  while (node = walker.nextNode()) {
    if (node === targetNode || isDescendant(targetNode, node)) {
      return walker.nextNode()
    }
  }
  return null
}
function findPreviousSibling(node) {
  let current = node.previousSibling
  while (current && current.nodeType === Node.TEXT_NODE && !current.textContent?.trim()) {
    current = current.previousSibling
  }
  return current
}
function createLink(document2, textNodes, href, target) {
  const anchor = document2.createElement('a')
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
function moveTextRangeIntoElement(startNode, endNode, newElement) {
  const range = document.createRange()
  range.setStartBefore(startNode)
  range.setEndAfter(endNode)
  const contents = range.extractContents()
  newElement.appendChild(contents)
  range.insertNode(newElement)
}
function splitOffDOMTree(rootNode, leafNode, splitLeft = false) {
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
        parent.parentNode.insertBefore(newParent, parent)
      }
      else {
        parent.parentNode.insertBefore(newParent, parent.nextSibling)
      }
    }
    current = parent
    parent = current.parentNode
  }
  return current
}
function depthOfNode(inNode) {
  let depth = 0
  let current = inNode
  while (current.parentNode) {
    depth++
    current = current.parentNode
  }
  return depth
}
const util = {
  isIE,
  isEdge,
  isFF,
  isMac,
  keyCode,
  blockContainerElementNames,
  emptyElementNames,
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

// src/events.ts
function isElementDescendantOfExtension(extensions, element) {
  if (!extensions) {
    return false
  }
  const extensionArray = Array.isArray(extensions) ? extensions : Object.values(extensions)
  return extensionArray.some((extension) => {
    if (typeof extension.getInteractionElements !== 'function') {
      return false
    }
    let extensionElements = extension.getInteractionElements()
    if (!extensionElements) {
      return false
    }
    if (!Array.isArray(extensionElements)) {
      extensionElements = [extensionElements]
    }
    return extensionElements.some((el) => {
      return util.isDescendant(el, element, true)
    })
  })
}

class Events {
  base
  options
  events = []
  disabledEvents = {}
  customEvents = {}
  listeners = {}
  contentCache = {}
  eventsCache = []
  execCommandListener
  lastMousedownTarget = null
  static InputEventOnContenteditableSupported = !util.isIE && !util.isEdge
  constructor(instance) {
    this.base = instance
    this.options = this.base.options
  }

  attachDOMEvent(targets, event, listener, useCapture = false) {
    let targetArray
    if (Array.isArray(targets)) {
      targetArray = targets
    }
    else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets)
    }
    else {
      targetArray = [targets]
    }
    targetArray.forEach((target) => {
      target.addEventListener(event, listener, useCapture)
      this.events.push({ target, event, listener, useCapture })
    })
  }

  detachDOMEvent(targets, event, listener, useCapture = false) {
    let targetArray
    if (Array.isArray(targets)) {
      targetArray = targets
    }
    else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets)
    }
    else {
      targetArray = [targets]
    }
    targetArray.forEach((target) => {
      const index = this.indexOfListener(target, event, listener, useCapture)
      if (index !== -1) {
        const eventRecord = this.events.splice(index, 1)[0]
        eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture)
      }
    })
  }

  indexOfListener(target, event, listener, useCapture) {
    for (let i = 0; i < this.events.length; i++) {
      const item = this.events[i]
      if (item.target === target && item.event === event && item.listener === listener && item.useCapture === useCapture) {
        return i
      }
    }
    return -1
  }

  detachAllDOMEvents() {
    let eventRecord = this.events.pop()
    while (eventRecord) {
      eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture)
      eventRecord = this.events.pop()
    }
  }

  detachAllEventsFromElement(element) {
    const filtered = this.events.filter((e) => {
      const target = e.target
      return target && target.getAttribute && target.getAttribute('medium-editor-index') === element.getAttribute('medium-editor-index')
    })
    filtered.forEach((eventRecord) => {
      this.detachDOMEvent(eventRecord.target, eventRecord.event, eventRecord.listener, eventRecord.useCapture)
    })
  }

  attachAllEventsToElement(element) {
    if (this.listeners.editableInput) {
      this.contentCache[element.getAttribute('medium-editor-index') || ''] = element.innerHTML
    }
    if (this.eventsCache) {
      this.eventsCache.forEach((e) => {
        this.attachDOMEvent(element, e.name, e.handler.bind(this))
      })
    }
  }

  enableCustomEvent(event) {
    if (this.disabledEvents[event] !== undefined) {
      delete this.disabledEvents[event]
    }
  }

  disableCustomEvent(event) {
    this.disabledEvents[event] = true
  }

  attachCustomEvent(event, listener) {
    if (!this.customEvents[event]) {
      this.customEvents[event] = []
    }
    this.customEvents[event].push(listener)
  }

  detachCustomEvent(event, listener) {
    const index = this.indexOfCustomListener(event, listener)
    if (index !== -1) {
      this.customEvents[event].splice(index, 1)
    }
  }

  indexOfCustomListener(event, listener) {
    if (!this.customEvents[event] || !this.customEvents[event].length) {
      return -1
    }
    return this.customEvents[event].indexOf(listener)
  }

  detachAllCustomEvents() {
    this.customEvents = {}
  }

  triggerCustomEvent(name, data, editable) {
    if (this.customEvents[name] && !this.disabledEvents[name]) {
      this.customEvents[name].forEach((listener) => {
        listener(data, editable)
      })
    }
  }

  setupListener(name) {
    if (this.listeners[name]) {
      return
    }
    switch (name) {
      case 'externalInteraction':
        this.attachDOMEvent(this.options.ownerDocument.body, 'mousedown', this.handleBodyMousedown.bind(this), true)
        this.attachDOMEvent(this.options.ownerDocument.body, 'click', this.handleBodyClick.bind(this), true)
        this.attachDOMEvent(this.options.ownerDocument.body, 'focus', this.handleBodyFocus.bind(this), true)
        this.listeners[name] = true
        break
      case 'blur':
        this.setupListener('externalInteraction')
        this.listeners[name] = true
        break
      case 'focus':
        this.setupListener('externalInteraction')
        this.attachToEachElement('focus', this.handleElementFocus.bind(this))
        this.listeners[name] = true
        break
      case 'editableInput':
        this.contentCache = {}
        this.base.elements.forEach((element) => {
          this.contentCache[element.getAttribute('medium-editor-index') || ''] = element.innerHTML
        })
        this.listeners[name] = this.handleInput.bind(this)
        this.attachToEachElement('input', this.listeners[name])
        break
      case 'editableClick':
        this.listeners[name] = this.handleClick.bind(this)
        this.attachToEachElement('click', this.listeners[name])
        break
      case 'editableBlur':
        this.listeners[name] = this.handleBlur.bind(this)
        this.attachToEachElement('blur', this.listeners[name])
        break
      case 'editableKeypress':
        this.listeners[name] = this.handleKeypress.bind(this)
        this.attachToEachElement('keypress', this.listeners[name])
        break
      case 'editableKeyup':
        this.listeners[name] = this.handleKeyup.bind(this)
        this.attachToEachElement('keyup', this.listeners[name])
        break
      case 'editableKeydown':
        this.listeners[name] = this.handleKeydown.bind(this)
        this.attachToEachElement('keydown', this.listeners[name])
        break
      case 'editablePaste':
        this.listeners[name] = this.handlePaste.bind(this)
        this.attachToEachElement('paste', this.listeners[name])
        break
      case 'editableDrag':
        this.listeners[name] = this.handleDrag.bind(this)
        this.attachToEachElement('dragstart', this.listeners[name])
        this.attachToEachElement('dragover', this.listeners[name])
        this.attachToEachElement('dragleave', this.listeners[name])
        break
      case 'editableDrop':
        this.listeners[name] = this.handleDrop.bind(this)
        this.attachToEachElement('drop', this.listeners[name])
        break
    }
  }

  attachToEachElement(name, handler) {
    this.base.elements.forEach((element) => {
      this.attachDOMEvent(element, name, handler.bind(this))
    })
    this.eventsCache.push({ name, handler })
  }

  handleInput(event) {
    if (event.target) {
      this.updateInput(event.target, event)
    }
  }

  handleClick(event) {
    this.triggerCustomEvent('editableClick', event, event.target)
  }

  handleBlur(event) {
    this.triggerCustomEvent('editableBlur', event, event.target)
  }

  handleKeypress(event) {
    this.triggerCustomEvent('editableKeypress', event, event.target)
  }

  handleKeyup(event) {
    this.triggerCustomEvent('editableKeyup', event, event.target)
  }

  handleKeydown(event) {
    this.triggerCustomEvent('editableKeydown', event, event.target)
  }

  handleElementFocus(event) {
    this.updateFocus(event.target, event)
  }

  handlePaste(event) {
    this.triggerCustomEvent('editablePaste', event, event.target)
  }

  handleDrag(event) {
    this.triggerCustomEvent('editableDrag', event, event.target)
  }

  handleDrop(event) {
    this.triggerCustomEvent('editableDrop', event, event.target)
  }

  updateInput(target, eventObj) {
    const index = target.getAttribute('medium-editor-index')
    if (index && this.contentCache[index] && this.contentCache[index] !== target.innerHTML) {
      this.triggerCustomEvent('editableInput', eventObj, target)
    }
    if (index) {
      this.contentCache[index] = target.innerHTML
    }
  }

  handleDocumentSelectionChange(event) {
    if (this.base.options.ownerDocument.getSelection) {
      const selection = this.base.options.ownerDocument.getSelection()
      if (selection && !selection.isCollapsed) {
        this.base.checkSelection()
      }
    }
  }

  handleDocumentExecCommand() {
    this.base.checkSelection()
  }

  handleBodyClick(event) {
    this.updateFocus(event.target, event)
  }

  handleBodyFocus(event) {
    this.updateFocus(event.target, event)
  }

  handleBodyMousedown(event) {
    this.lastMousedownTarget = event.target
  }

  updateFocus(target, eventObj) {
    const hadFocus = this.base.getFocusedElement()
    let toFocus = null
    if (hadFocus && eventObj.type === 'click' && this.lastMousedownTarget && (util.isDescendant(hadFocus, this.lastMousedownTarget, true) || isElementDescendantOfExtension(this.base.extensions, this.lastMousedownTarget))) {
      toFocus = hadFocus
    }
    if (!toFocus) {
      this.base.elements.some((element) => {
        if (!toFocus && util.isDescendant(element, target, true)) {
          toFocus = element
        }
        return !!toFocus
      })
    }
    const externalEvent = !util.isDescendant(hadFocus, target, true) && !isElementDescendantOfExtension(this.base.extensions, target)
    if (toFocus !== hadFocus) {
      if (hadFocus && externalEvent) {
        hadFocus.removeAttribute('data-medium-focused')
        this.triggerCustomEvent('blur', eventObj, hadFocus)
      }
      if (toFocus) {
        toFocus.setAttribute('data-medium-focused', 'true')
        this.triggerCustomEvent('focus', eventObj, toFocus)
      }
    }
    if (externalEvent) {
      this.triggerCustomEvent('externalInteraction', eventObj)
    }
  }

  focusElement(element) {
    element.focus()
    const focusEvent = new Event('focus')
    Object.defineProperty(focusEvent, 'target', { value: element, writable: false })
    this.updateFocus(element, focusEvent)
  }

  cleanupElement(element) {
    element.removeAttribute('data-medium-focused')
  }

  attachToExecCommand() {
    if (this.execCommandListener) {
      return
    }
    this.execCommandListener = (execInfo) => {
      this.handleDocumentExecCommand()
    }
    this.wrapExecCommand()
    const doc = this.options.ownerDocument
    if (!doc.execCommand.listeners) {
      doc.execCommand.listeners = []
    }
    doc.execCommand.listeners.push(this.execCommandListener)
  }

  detachExecCommand() {
    const doc = this.options.ownerDocument
    if (this.execCommandListener && doc.execCommand && doc.execCommand.listeners) {
      const index = doc.execCommand.listeners.indexOf(this.execCommandListener)
      if (index !== -1) {
        doc.execCommand.listeners.splice(index, 1)
      }
      if (doc.execCommand.listeners.length === 0) {
        this.unwrapExecCommand()
      }
    }
  }

  wrapExecCommand() {
    const doc = this.options.ownerDocument
    if (doc.execCommand.listeners) {
      return
    }
    const callListeners = (args, result) => {
      if (doc.execCommand.listeners) {
        doc.execCommand.listeners.forEach((listener) => {
          listener({ command: args[0], args, result })
        })
      }
    }
    const originalExecCommand = doc.execCommand
    const wrapper = function (...args) {
      const result = originalExecCommand.apply(doc, args)
      callListeners(args, result)
      return result
    }
    wrapper.listeners = []
    wrapper.original = originalExecCommand
    doc.execCommand = wrapper
  }

  unwrapExecCommand() {
    const doc = this.options.ownerDocument
    if (doc.execCommand.original) {
      doc.execCommand = doc.execCommand.original
    }
  }

  destroy() {
    this.detachAllDOMEvents()
    this.detachAllCustomEvents()
    this.detachExecCommand()
    if (this.base.elements) {
      this.base.elements.forEach((element) => {
        element.removeAttribute('data-medium-focused')
      })
    }
  }
}

// src/extensions/placeholder.ts
class Placeholder {
  name = 'placeholder'
  text = 'Type your text'
  hideOnClick = true
  editor
  constructor(editor, options = {}) {
    this.editor = editor
    this.text = options.text || this.text
    this.hideOnClick = options.hideOnClick !== undefined ? options.hideOnClick : this.hideOnClick
  }

  init() {
    this.initPlaceholders()
    this.attachEventHandlers()
  }

  initPlaceholders() {
    this.editor.elements.forEach(el => this.initElement(el))
  }

  handleAddElement(_data, editable) {
    if (editable) {
      this.initElement(editable)
    }
  }

  initElement(el) {
    if (!el.getAttribute('data-placeholder')) {
      el.setAttribute('data-placeholder', this.text)
    }
    this.updatePlaceholder(el)
  }

  destroy() {
    this.editor.elements.forEach(el => this.cleanupElement(el))
  }

  handleRemoveElement(_event, editable) {
    this.cleanupElement(editable)
  }

  cleanupElement(el) {
    if (el.getAttribute('data-placeholder') === this.text) {
      el.removeAttribute('data-placeholder')
    }
  }

  showPlaceholder(el) {
    if (el) {
      if (this.isFirefox() && el.childNodes.length === 0) {
        el.classList.add('medium-editor-placeholder-relative')
        el.classList.remove('medium-editor-placeholder')
      }
      else {
        el.classList.add('medium-editor-placeholder')
        el.classList.remove('medium-editor-placeholder-relative')
      }
    }
  }

  hidePlaceholder(el) {
    if (el) {
      el.classList.remove('medium-editor-placeholder')
      el.classList.remove('medium-editor-placeholder-relative')
    }
  }

  updatePlaceholder(el, dontShow) {
    if (el.querySelector('img, blockquote, ul, ol, table') || el.textContent?.replace(/^\s+|\s+$/g, '') !== '') {
      return this.hidePlaceholder(el)
    }
    if (!dontShow) {
      this.showPlaceholder(el)
    }
  }

  attachEventHandlers() {
    if (this.hideOnClick) {
      this.editor.subscribe('focus', this.handleFocus.bind(this))
    }
    this.editor.subscribe('editableInput', this.handleInput.bind(this))
    this.editor.subscribe('blur', this.handleBlur.bind(this))
    this.editor.subscribe('addElement', this.handleAddElement.bind(this))
    this.editor.subscribe('removeElement', this.handleRemoveElement.bind(this))
  }

  handleInput(_event, element) {
    const dontShow = this.hideOnClick && element === this.editor.getFocusedElement()
    this.updatePlaceholder(element, dontShow)
  }

  handleFocus(_event, element) {
    this.hidePlaceholder(element)
  }

  handleBlur(_event, element) {
    this.updatePlaceholder(element)
  }

  isFirefox() {
    return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
  }
}

// src/extensions/toolbar.ts
class Toolbar {
  name = 'toolbar'
  options
  toolbar
  buttons = []
  container
  editor
  constructor(options = {}, container = document.body, editor) {
    this.options = {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      static: false,
      align: 'center',
      sticky: false,
      updateOnEmptySelection: false,
      ...options,
    }
    this.container = container
    this.editor = editor
  }

  init() {
    this.createToolbar()
    this.attachEventListeners()
  }

  destroy() {
    if (this.toolbar) {
      this.toolbar.remove()
    }
    this.buttons = []
  }

  createToolbar() {
    this.toolbar = document.createElement('div')
    this.toolbar.className = 'medium-editor-toolbar'
    this.toolbar.setAttribute('data-static-toolbar', this.options.static ? 'true' : 'false')
    if (this.options.static) {
      this.toolbar.style.position = 'static'
      this.toolbar.style.display = 'block'
      this.toolbar.style.visibility = 'visible'
    }
    else {
      this.toolbar.style.display = 'none'
      this.toolbar.style.visibility = 'hidden'
      this.toolbar.style.position = 'absolute'
      this.toolbar.style.zIndex = '1000'
    }
    this.createButtons()
    this.container.appendChild(this.toolbar)
  }

  createButtons() {
    if (!this.options.buttons || !this.toolbar) {
      return
    }
    this.options.buttons.forEach((buttonConfig) => {
      if (!buttonConfig) {
        return
      }
      const buttonName = typeof buttonConfig === 'string' ? buttonConfig : buttonConfig.name
      const button = this.createButton(buttonName)
      if (button) {
        this.toolbar.appendChild(button)
        this.buttons.push(button)
      }
    })
  }

  createButton(name) {
    const button = document.createElement('button')
    button.className = `medium-editor-action medium-editor-action-${name}`
    button.setAttribute('data-action', name)
    switch (name) {
      case 'bold':
        button.innerHTML = '<b>B</b>'
        button.title = 'Bold'
        break
      case 'italic':
        button.innerHTML = '<i>I</i>'
        button.title = 'Italic'
        break
      case 'underline':
        button.innerHTML = '<u>U</u>'
        button.title = 'Underline'
        break
      case 'anchor':
        button.innerHTML = '\uD83D\uDD17'
        button.title = 'Link'
        break
      case 'h2':
        button.innerHTML = 'H2'
        button.title = 'Heading 2'
        break
      case 'h3':
        button.innerHTML = 'H3'
        button.title = 'Heading 3'
        break
      case 'quote':
        button.innerHTML = '""'
        button.title = 'Quote'
        break
      default:
        return null
    }
    return button
  }

  attachEventListeners() {
    if (!this.toolbar) {
      return
    }
    this.toolbar.addEventListener('click', (event) => {
      const target = event.target
      if (!target)
        return
      const action = target.getAttribute('data-action')
      if (action) {
        this.handleButtonClick(action, event)
      }
    })
  }

  handleButtonClick(action, event) {
    event.preventDefault()
    if (this.editor && typeof this.editor.execAction === 'function') {
      this.editor.execAction(action)
    }
    else {
      if (typeof document.execCommand !== 'function') {
        this.applyFormattingFallback(action)
      }
      else {
        switch (action) {
          case 'bold':
            document.execCommand('bold', false)
            break
          case 'italic':
            document.execCommand('italic', false)
            break
          case 'underline':
            document.execCommand('underline', false)
            break
          case 'h2':
            document.execCommand('formatBlock', false, 'h2')
            break
          case 'h3':
            document.execCommand('formatBlock', false, 'h3')
            break
          case 'quote':
            document.execCommand('formatBlock', false, 'blockquote')
            break
          case 'anchor':
            this.createLink()
            break
        }
      }
    }
    setTimeout(() => {
      if (this.editor && typeof this.editor.checkSelection === 'function') {
        this.editor.checkSelection()
      }
      else {
        this.updateButtonStates()
      }
    }, 0)
  }

  applyFormattingFallback(action) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return
    }
    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    if (!selectedText) {
      return
    }
    if (this.editor && this.editor.elements && this.editor.elements.length > 0) {
      const editorElement = this.editor.elements[0]
      const content = editorElement.innerHTML
      switch (action) {
        case 'bold':
          if (content === `<strong>${selectedText}</strong>`) {
            editorElement.innerHTML = selectedText
            return
          }
          if (content === `<b>${selectedText}</b>`) {
            editorElement.innerHTML = selectedText
            return
          }
          break
        case 'italic':
          if (content === `<em>${selectedText}</em>`) {
            editorElement.innerHTML = selectedText
            return
          }
          if (content === `<i>${selectedText}</i>`) {
            editorElement.innerHTML = selectedText
            return
          }
          break
        case 'underline':
          if (content === `<u>${selectedText}</u>`) {
            editorElement.innerHTML = selectedText
            return
          }
          break
      }
    }
    let wrappedContent = ''
    switch (action) {
      case 'bold':
        wrappedContent = `<strong>${selectedText}</strong>`
        break
      case 'italic':
        wrappedContent = `<em>${selectedText}</em>`
        break
      case 'underline':
        wrappedContent = `<u>${selectedText}</u>`
        break
      case 'h2':
        wrappedContent = `<h2>${selectedText}</h2>`
        break
      case 'h3':
        wrappedContent = `<h3>${selectedText}</h3>`
        break
      case 'quote':
        wrappedContent = `<blockquote>${selectedText}</blockquote>`
        break
      default:
        return
    }
    try {
      range.deleteContents()
      const fragment = document.createRange().createContextualFragment(wrappedContent)
      range.insertNode(fragment)
      if (fragment.firstChild) {
        const newRange = document.createRange()
        newRange.selectNodeContents(fragment.firstChild)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    catch {
      const container = range.commonAncestorContainer
      if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
        const parent = container.parentElement
        parent.innerHTML = parent.innerHTML.replace(selectedText, wrappedContent)
        try {
          const newRange = document.createRange()
          newRange.selectNodeContents(parent)
          selection.removeAllRanges()
          selection.addRange(newRange)
        }
        catch {}
      }
    }
  }

  createLink() {
    const url = window.prompt('Enter URL:')
    if (url) {
      document.execCommand('createLink', false, url)
    }
  }

  showToolbar() {
    if (this.toolbar) {
      this.toolbar.style.display = 'block'
      this.toolbar.style.visibility = 'visible'
      if (this.editor && typeof this.editor.trigger === 'function') {
        const selection = window.getSelection()
        let element = null
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          element = range.commonAncestorContainer
          if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement
          }
          while (element && this.editor.elements && !this.editor.elements.includes(element)) {
            element = element.parentElement
          }
        }
        this.editor.trigger('showToolbar', {}, element)
      }
    }
  }

  hideToolbar() {
    if (this.toolbar) {
      this.toolbar.style.display = 'none'
      this.toolbar.style.visibility = 'hidden'
      if (this.editor && typeof this.editor.trigger === 'function') {
        let element = null
        if (this.editor.elements && this.editor.elements.length > 0) {
          element = this.editor.elements[0]
        }
        this.editor.trigger('hideToolbar', {}, element)
      }
    }
  }

  getInteractionElements() {
    return this.toolbar ? [this.toolbar] : []
  }

  getToolbarElement() {
    return this.toolbar || null
  }

  checkState() {
    if (this.editor && this.editor.preventSelectionUpdates) {
      return
    }
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
      this.hideToolbar()
      return
    }
    this.updateButtonStates()
    this.positionToolbar()
  }

  positionToolbar() {
    if (!this.toolbar) {
      return
    }
    if (this.options.static) {
      return
    }
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return
    }
    this.showToolbar()
    try {
      const range = selection.getRangeAt(0)
      let rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) {
        const container = range.commonAncestorContainer
        if (container.nodeType === Node.ELEMENT_NODE) {
          rect = container.getBoundingClientRect()
        }
        else if (container.parentElement) {
          rect = container.parentElement.getBoundingClientRect()
        }
        if (rect.width === 0 && rect.height === 0) {
          rect = { top: 50, left: 50, width: 100, height: 20 }
        }
      }
      const toolbarHeight = this.toolbar.offsetHeight || 40
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0
      const top = Math.max(10, rect.top + scrollTop - toolbarHeight - 10)
      const left = Math.max(10, Math.min(rect.left + scrollLeft + rect.width / 2 - this.toolbar.offsetWidth / 2, window.innerWidth + scrollLeft - this.toolbar.offsetWidth - 10))
      this.toolbar.style.position = 'absolute'
      this.toolbar.style.top = `${top}px`
      this.toolbar.style.left = `${left}px`
      this.toolbar.style.zIndex = '1000'
      if (this.editor && typeof this.editor.trigger === 'function') {
        const selection2 = window.getSelection()
        let element = null
        if (selection2 && selection2.rangeCount > 0) {
          const range2 = selection2.getRangeAt(0)
          element = range2.commonAncestorContainer
          if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement
          }
          while (element && this.editor.elements && !this.editor.elements.includes(element)) {
            element = element.parentElement
          }
        }
        this.editor.trigger('positionToolbar', {}, element)
      }
    }
    catch {
      this.toolbar.style.position = 'absolute'
      this.toolbar.style.top = '50px'
      this.toolbar.style.left = '50px'
      this.toolbar.style.zIndex = '1000'
    }
  }

  updateButtonStates() {
    if (!this.toolbar) {
      return
    }
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      this.buttons.forEach((button) => {
        const action = button.getAttribute('data-action')
        if (action) {
          const isActive = this.isEditorContentFormatted(action)
          if (isActive) {
            button.classList.add('medium-editor-button-active')
          }
          else {
            button.classList.remove('medium-editor-button-active')
          }
        }
      })
      return
    }
    this.buttons.forEach((button) => {
      const action = button.getAttribute('data-action')
      if (action) {
        const isActive = this.isCommandActive(action)
        if (isActive) {
          button.classList.add('medium-editor-button-active')
        }
        else {
          button.classList.remove('medium-editor-button-active')
        }
      }
    })
  }

  isEditorContentFormatted(action) {
    if (!this.editor || !this.editor.elements || this.editor.elements.length === 0) {
      return false
    }
    const editorElement = this.editor.elements[0]
    const content = editorElement.innerHTML
    switch (action) {
      case 'bold':
        return content.includes('<strong>') || content.includes('<b>')
      case 'italic':
        return content.includes('<em>') || content.includes('<i>')
      case 'underline':
        return content.includes('<u>')
      default:
        return false
    }
  }

  isCommandActive(command) {
    try {
      if (typeof document.queryCommandState !== 'function') {
        return this.isCommandActiveBySelection(command)
      }
      switch (command) {
        case 'bold':
          return document.queryCommandState('bold')
        case 'italic':
          return document.queryCommandState('italic')
        case 'underline':
          return document.queryCommandState('underline')
        default:
          return false
      }
    }
    catch {
      return this.isCommandActiveBySelection(command)
    }
  }

  isCommandActiveBySelection(command) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return false
    }
    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    if (selectedText && this.editor && this.editor.elements && this.editor.elements.length > 0) {
      const editorElement = this.editor.elements[0]
      const content = editorElement.innerHTML
      switch (command) {
        case 'bold':
          if (content.includes('<strong>') && content.includes(selectedText) || content.includes('<b>') && content.includes(selectedText)) {
            if (content === `<strong>${selectedText}</strong>` || content === `<b>${selectedText}</b>`) {
              return true
            }
          }
          break
        case 'italic':
          if (content.includes('<em>') && content.includes(selectedText) || content.includes('<i>') && content.includes(selectedText)) {
            if (content === `<em>${selectedText}</em>` || content === `<i>${selectedText}</i>`) {
              return true
            }
          }
          break
        case 'underline':
          if (content.includes('<u>') && content.includes(selectedText)) {
            if (content === `<u>${selectedText}</u>`) {
              return true
            }
          }
          break
      }
    }
    const nodesToCheck = [
      range.commonAncestorContainer,
      range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer,
      range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentNode : range.endContainer,
    ]
    for (const startNode of nodesToCheck) {
      if (!startNode)
        continue
      let currentNode = startNode
      while (currentNode && currentNode !== document.body && currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode
        switch (command) {
          case 'bold':
            if (element.tagName === 'B' || element.tagName === 'STRONG' || element.style.fontWeight === 'bold' || element.style.fontWeight === '700') {
              return true
            }
            break
          case 'italic':
            if (element.tagName === 'I' || element.tagName === 'EM' || element.style.fontStyle === 'italic') {
              return true
            }
            break
          case 'underline':
            if (element.tagName === 'U' || element.style.textDecoration === 'underline') {
              return true
            }
            break
        }
        currentNode = currentNode.parentNode
      }
    }
    return false
  }
}

// src/selection.ts
function filterOnlyParentElements(node) {
  if (util.isBlockContainer(node)) {
    return NodeFilter.FILTER_ACCEPT
  }
  else {
    return NodeFilter.FILTER_SKIP
  }
}
const selection = {
  findMatchingSelectionParent(testElementFunction, contentWindow) {
    const selection2 = contentWindow.getSelection()
    if (!selection2 || selection2.rangeCount === 0) {
      return false
    }
    const range = selection2.getRangeAt(0)
    const current = range.commonAncestorContainer
    return util.traverseUp(current, testElementFunction)
  },
  getSelectionElement(contentWindow) {
    return this.findMatchingSelectionParent((node) => {
      return util.isMediumEditorElement(node)
    }, contentWindow)
  },
  exportSelection(root, doc) {
    if (!root) {
      return null
    }
    let selectionState = null
    const selection2 = doc.getSelection()
    if (selection2 && selection2.rangeCount > 0) {
      const range = selection2.getRangeAt(0)
      const preSelectionRange = range.cloneRange()
      let start
      preSelectionRange.selectNodeContents(root)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      start = preSelectionRange.toString().length
      selectionState = {
        start,
        end: start + range.toString().length,
      }
      if (this.doesRangeStartWithImages(range, doc)) {
        selectionState.startsWithImage = true
      }
      const trailingImageCount = this.getTrailingImageCount(root, selectionState, range.endContainer, range.endOffset)
      if (trailingImageCount) {
        selectionState.trailingImageCount = trailingImageCount
      }
      if (start !== 0) {
        const emptyBlocksIndex = this.getIndexRelativeToAdjacentEmptyBlocks(doc, root, range.startContainer, range.startOffset)
        if (emptyBlocksIndex !== -1) {
          selectionState.emptyBlocksIndex = emptyBlocksIndex
        }
      }
    }
    return selectionState
  },
  importSelection(selectionState, root, doc, favorLaterSelectionAnchor = false) {
    if (!selectionState || !root) {
      return
    }
    const range = doc.createRange()
    range.setStart(root, 0)
    range.collapse(true)
    let node = root
    const nodeStack = []
    let charIndex = 0
    let foundStart = false
    let foundEnd = false
    let trailingImageCount = 0
    let stop = false
    let nextCharIndex
    let allowRangeToStartAtEndOfNode = false
    let lastTextNode = null
    if (favorLaterSelectionAnchor || selectionState.startsWithImage || typeof selectionState.emptyBlocksIndex !== 'undefined') {
      allowRangeToStartAtEndOfNode = true
    }
    while (!stop && node) {
      if (node.nodeType > 3) {
        node = nodeStack.pop() || null
        continue
      }
      if (node.nodeType === 3 && !foundEnd) {
        const textNode = node
        nextCharIndex = charIndex + textNode.length
        if (!foundStart && selectionState.start >= charIndex && selectionState.start <= nextCharIndex) {
          if (allowRangeToStartAtEndOfNode || selectionState.start < nextCharIndex) {
            range.setStart(node, selectionState.start - charIndex)
            foundStart = true
          }
          else {
            lastTextNode = textNode
          }
        }
        if (foundStart && selectionState.end >= charIndex && selectionState.end <= nextCharIndex) {
          if (!selectionState.trailingImageCount) {
            range.setEnd(node, selectionState.end - charIndex)
            stop = true
          }
          else {
            foundEnd = true
          }
        }
        charIndex = nextCharIndex
      }
      else {
        if (selectionState.trailingImageCount && foundEnd) {
          if (node.nodeName.toLowerCase() === 'img') {
            trailingImageCount++
          }
          if (trailingImageCount === selectionState.trailingImageCount) {
            let endIndex = 0
            while (node.parentNode.childNodes[endIndex] !== node) {
              endIndex++
            }
            range.setEnd(node.parentNode, endIndex + 1)
            stop = true
          }
        }
        if (!stop && node.nodeType === 1) {
          let i = node.childNodes.length - 1
          while (i >= 0) {
            nodeStack.push(node.childNodes[i])
            i -= 1
          }
        }
      }
      if (!stop) {
        node = nodeStack.pop() || null
      }
    }
    if (!foundStart && lastTextNode) {
      range.setStart(lastTextNode, lastTextNode.length)
    }
    if (favorLaterSelectionAnchor) {
      this.importSelectionMoveCursorPastAnchor(selectionState, range)
    }
    if (typeof selectionState.emptyBlocksIndex !== 'undefined' && selectionState.start === selectionState.end) {
      this.importSelectionMoveCursorPastBlocks(doc, root, selectionState.emptyBlocksIndex, range)
    }
    const selection2 = doc.getSelection()
    if (selection2) {
      selection2.removeAllRanges()
      selection2.addRange(range)
    }
  },
  importSelectionMoveCursorPastAnchor(selectionState, range) {
    const nodeInsideAnchorTagFunction = (node) => {
      return node.nodeName.toLowerCase() === 'a'
    }
    if (selectionState.start === selectionState.end && range.startContainer.nodeType === 3 && range.startOffset === range.startContainer.nodeValue.length) {
      const nodeInsideAnchorTag = util.traverseUp(range.startContainer, nodeInsideAnchorTagFunction)
      if (nodeInsideAnchorTag) {
        let nextNode = nodeInsideAnchorTag.nextSibling
        if (nextNode && nextNode.nodeType === 3) {
          range.setStart(nextNode, 0)
          range.setEnd(nextNode, 0)
        }
        else if (nodeInsideAnchorTag.parentNode) {
          nextNode = nodeInsideAnchorTag.parentNode
          const nodeIndex = Array.prototype.indexOf.call(nextNode.childNodes, nodeInsideAnchorTag)
          range.setStart(nextNode, nodeIndex + 1)
          range.setEnd(nextNode, nodeIndex + 1)
        }
      }
    }
  },
  importSelectionMoveCursorPastBlocks(doc, root, index, range) {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode: filterOnlyParentElements })
    let emptyBlockContainer = null
    let currIndex = 0
    let node
    while (node = walker.nextNode()) {
      if (node.textContent.trim() === '') {
        if (currIndex === index) {
          emptyBlockContainer = node
          break
        }
        currIndex++
      }
    }
    if (emptyBlockContainer) {
      range.setStart(emptyBlockContainer, 0)
      range.setEnd(emptyBlockContainer, 0)
    }
  },
  getIndexRelativeToAdjacentEmptyBlocks(doc, root, cursorContainer, cursorOffset) {
    if (cursorContainer.textContent && cursorContainer.textContent.length > 0 && cursorOffset > 0) {
      return -1
    }
    let node = cursorContainer
    if (node.nodeType !== 3) {
      node = cursorContainer.childNodes[cursorOffset]
    }
    if (node) {
      const isAtBeginning = util.isElementAtBeginningOfBlock(node)
      if (!isAtBeginning) {
        return -1
      }
      const previousSibling = util.findPreviousSibling(node)
      if (!previousSibling) {}
      else if (previousSibling.nodeValue) {}
    }
    const closestBlock = util.getClosestBlockContainer(cursorContainer)
    const treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterOnlyParentElements, false)
    let emptyBlocksCount = 0
    while (treeWalker.nextNode()) {
      const blockIsEmpty = treeWalker.currentNode.textContent === ''
      if (blockIsEmpty || emptyBlocksCount > 0) {
        emptyBlocksCount += 1
      }
      if (treeWalker.currentNode === closestBlock) {
        return emptyBlocksCount
      }
      if (!blockIsEmpty) {
        emptyBlocksCount = 0
      }
    }
    return emptyBlocksCount
  },
  doesRangeStartWithImages(range, doc) {
    if (range.startContainer.nodeType !== 3) {
      return false
    }
    const textContent = range.startContainer.textContent
    if (range.startOffset > 0 && textContent.substring(0, range.startOffset).trim() !== '') {
      return false
    }
    const walker = doc.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, {
      acceptNode(node2) {
        if (range.intersectsNode(node2)) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      },
    }, false)
    walker.currentNode = range.startContainer
    let node
    while (node = walker.previousNode()) {
      if (node.nodeName.toLowerCase() === 'img') {
        return true
      }
      if (node.nodeType === 3 && node.textContent.trim() !== '') {
        return false
      }
    }
    return false
  },
  getTrailingImageCount(root, selectionState, endContainer, endOffset) {
    let imageCount = 0
    if (endContainer.nodeType !== 3) {
      if (endContainer.nodeType === 1) {
        const element = endContainer
        for (let i = 0; i < endOffset; i++) {
          const child = element.childNodes[i]
          if (child && child.nodeName.toLowerCase() === 'img') {
            imageCount++
          }
        }
        return imageCount
      }
      return 0
    }
    const textNode = endContainer
    const textAfterSelection = textNode.textContent.substring(endOffset)
    if (textAfterSelection.trim() !== '') {
      return 0
    }
    let node = endContainer.nextSibling
    while (node) {
      if (node.nodeName.toLowerCase() === 'img') {
        imageCount++
      }
      else if (node.nodeType === 3 && node.textContent.trim() !== '') {
        break
      }
      else if (node.nodeType === 1 && !node.querySelector('img')) {
        break
      }
      node = node.nextSibling
    }
    return imageCount
  },
  selectionContainsContent(doc) {
    const selection2 = doc.getSelection()
    if (!selection2 || selection2.isCollapsed) {
      return false
    }
    const range = selection2.getRangeAt(0)
    if (range.collapsed) {
      return false
    }
    const contents = range.cloneContents()
    const textContent = contents.textContent || ''
    const hasText = textContent.trim().length > 0
    const hasImages = contents.querySelector('img') !== null
    return hasText || hasImages
  },
  selectionInContentEditableFalse(contentWindow) {
    const selection2 = contentWindow.getSelection()
    if (!selection2 || selection2.rangeCount === 0) {
      return false
    }
    const range = selection2.getRangeAt(0)
    let node = range.commonAncestorContainer
    while (node && node.nodeType !== 1) {
      node = node.parentNode
    }
    if (node) {
      const element = node
      return element.contentEditable === 'false'
    }
    return false
  },
  getSelectionHtml(doc) {
    const selection2 = doc.getSelection()
    if (!selection2 || selection2.rangeCount === 0) {
      return ''
    }
    const range = selection2.getRangeAt(0)
    const contents = range.cloneContents()
    const div = doc.createElement('div')
    div.appendChild(contents)
    return div.innerHTML
  },
  getCaretOffsets(element, range) {
    let preCaretRange
    let postCaretRange
    if (!range) {
      const selection2 = element.ownerDocument.getSelection()
      if (!selection2 || selection2.rangeCount === 0) {
        return { left: 0, right: 0 }
      }
      range = selection2.getRangeAt(0)
    }
    preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    const left = preCaretRange.toString().length
    postCaretRange = range.cloneRange()
    postCaretRange.selectNodeContents(element)
    postCaretRange.setStart(range.endContainer, range.endOffset)
    const right = postCaretRange.toString().length
    return { left, right }
  },
  rangeSelectsSingleNode(range) {
    const startNode = range.startContainer
    const endNode = range.endContainer
    return startNode === endNode && range.startOffset + 1 === range.endOffset
  },
  getSelectedParentElement(range) {
    if (range.startContainer === range.endContainer) {
      let element = range.startContainer
      if (element.nodeType === 3) {
        element = element.parentElement
      }
      return element
    }
    const commonAncestor = range.commonAncestorContainer
    return commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor
  },
  getSelectedElements(doc) {
    const selection2 = doc.getSelection()
    const selectedElements = []
    if (!selection2 || selection2.rangeCount === 0) {
      return selectedElements
    }
    for (let i = 0; i < selection2.rangeCount; i++) {
      const range = selection2.getRangeAt(i)
      const element = this.getSelectedParentElement(range)
      if (!selectedElements.includes(element)) {
        selectedElements.push(element)
      }
    }
    return selectedElements
  },
  selectNode(node, doc) {
    const range = doc.createRange()
    range.selectNodeContents(node)
    this.selectRange(doc, range)
  },
  select(doc, startNode, startOffset, endNode, endOffset) {
    const range = doc.createRange()
    range.setStart(startNode, startOffset)
    range.setEnd(endNode, endOffset)
    this.selectRange(doc, range)
  },
  clearSelection(doc, moveCursorToStart = false) {
    const selection2 = doc.getSelection()
    if (selection2) {
      if (moveCursorToStart && selection2.rangeCount > 0) {
        const range = selection2.getRangeAt(0)
        range.collapse(true)
        selection2.removeAllRanges()
        selection2.addRange(range)
      }
      else {
        selection2.removeAllRanges()
      }
    }
  },
  moveCursor(doc, node, offset = 0) {
    this.select(doc, node, offset, node, offset)
  },
  getSelectionRange(ownerDocument) {
    const selection2 = ownerDocument.getSelection()
    if (selection2 && selection2.rangeCount > 0) {
      return selection2.getRangeAt(0)
    }
    return null
  },
  selectRange(ownerDocument, range) {
    const selection2 = ownerDocument.getSelection()
    if (selection2) {
      selection2.removeAllRanges()
      selection2.addRange(range)
    }
  },
  getSelectionStart(ownerDocument) {
    const selection2 = ownerDocument.getSelection()
    if (selection2 && selection2.rangeCount > 0) {
      const range = selection2.getRangeAt(0)
      return range.startContainer
    }
    return null
  },
}

// src/core.ts
const editors = []
let globalId = 0
const DEFAULT_OPTIONS = {
  activeButtonClass: 'medium-editor-button-active',
  buttonLabels: false,
  delay: 0,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  autoLink: false,
  elementsContainer: document.body,
  contentWindow: window,
  ownerDocument: document,
  targetBlank: false,
  extensions: {},
  spellcheck: true,
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
  },
  placeholder: {
    text: 'Type your text',
    hideOnClick: true,
  },
}
const version = {
  major: 1,
  minor: 0,
  revision: 0,
  preRelease: '',
  toString() {
    return `${this.major}.${this.minor}.${this.revision}${this.preRelease ? `-${this.preRelease}` : ''}`
  },
}
function parseVersionString(release) {
  const split = release.split('-')
  const versionParts = split[0].split('.')
  const preRelease = split.length > 1 ? split[1] : ''
  return {
    major: Number.parseInt(versionParts[0], 10),
    minor: Number.parseInt(versionParts[1], 10),
    revision: Number.parseInt(versionParts[2], 10),
    preRelease,
    toString() {
      return [versionParts[0], versionParts[1], versionParts[2]].join('.') + (preRelease ? `-${preRelease}` : '')
    },
  }
}
function handleDisableExtraSpaces(event) {
  const node = selection.getSelectionStart(this.options.ownerDocument)
  if (!node)
    return
  const textContent = node.textContent || ''
  const caretOffsets = selection.getCaretOffsets(node)
  if (textContent[caretOffsets.left - 1] === undefined || textContent[caretOffsets.left - 1].trim() === '' || textContent[caretOffsets.left] !== undefined && textContent[caretOffsets.left].trim() === '') {
    event.preventDefault()
  }
}
function handleDisabledEnterKeydown(event, element) {
  if (this.options.disableReturn || element.getAttribute('data-disable-return')) {
    event.preventDefault()
  }
  else if (this.options.disableDoubleReturn || element.getAttribute('data-disable-double-return')) {
    const node = selection.getSelectionStart(this.options.ownerDocument)
    if (node && node.textContent?.trim() === '' && node.nodeName.toLowerCase() !== 'li') {
      const prev = node.previousElementSibling
      if (!prev || prev.nodeName.toLowerCase() !== 'br' && prev.textContent?.trim() === '') {
        event.preventDefault()
      }
    }
  }
}
function handleTabKeydown(event) {
  const node = selection.getSelectionStart(this.options.ownerDocument)
  const tag = node && node.nodeName?.toLowerCase()
  if (tag === 'pre') {
    event.preventDefault()
    util.insertHTMLCommand(this.options.ownerDocument, '    ')
  }
  if (util.isListItem(node)) {
    event.preventDefault()
    if (event.shiftKey) {
      this.options.ownerDocument.execCommand('outdent', false)
    }
    else {
      this.options.ownerDocument.execCommand('indent', false)
    }
  }
}
function createElementsArray(selector, doc, filterEditorElements) {
  let elements = []
  if (typeof selector === 'string') {
    const nodeList = doc.querySelectorAll(selector)
    elements = Array.from(nodeList).filter(node => node.nodeType === Node.ELEMENT_NODE && typeof node.setAttribute === 'function')
  }
  else if (selector && typeof selector === 'object' && 'length' in selector) {
    elements = Array.from(selector).filter(node => node && node.nodeType === Node.ELEMENT_NODE && typeof node.setAttribute === 'function')
  }
  else if (selector && typeof selector === 'object') {
    if (selector.nodeType === Node.ELEMENT_NODE && typeof selector.setAttribute === 'function') {
      elements = [selector]
    }
  }
  if (filterEditorElements) {
    elements = elements.filter(el => !util.isMediumEditorElement(el))
  }
  return elements
}
function initElement(element, editorId) {
  element.setAttribute('medium-editor-index', editorId.toString())
  element.setAttribute('contentEditable', 'true')
  element.setAttribute('data-medium-editor-element', 'true')
  element.classList.add('medium-editor-element')
}

class MediumEditor {
  id
  elements = []
  options
  events
  selection = selection
  util = util
  version = version
  extensions = {}
  preventSelectionUpdates = false
  savedSelection
  originalSelector
  originalContent = new Map()
  constructor(elements, options) {
    this.id = ++globalId
    this.options = util.defaults(options || {}, DEFAULT_OPTIONS)
    this.events = new Events(this)
    editors.push(this)
    if (elements) {
      this.originalSelector = elements
      this.init(elements, options)
    }
  }

  init(elements, options) {
    this.options = util.defaults(options || {}, this.options)
    this.originalSelector = elements
    this.elements = createElementsArray(elements, this.options.ownerDocument)
    if (this.elements.length === 0) {
      return this
    }
    this.setup()
    return this
  }

  setup() {
    if (this.elements.length === 0 && this.originalSelector) {
      this.elements = createElementsArray(this.originalSelector, this.options.ownerDocument)
    }
    this.elements.forEach((element, index) => {
      if (!this.originalContent.has(element)) {
        this.originalContent.set(element, element.innerHTML)
      }
      initElement(element, this.id + index)
    })
    this.initExtensions()
    this.attachHandlers()
    return this
  }

  destroy() {
    const focusedElements = this.elements.filter(el => el.getAttribute('data-medium-focused') === 'true')
    Object.values(this.extensions).forEach((extension) => {
      if (extension && typeof extension.destroy === 'function') {
        extension.destroy()
      }
    })
    this.events.destroy()
    this.elements.forEach((element) => {
      element.removeAttribute('medium-editor-index')
      element.removeAttribute('contentEditable')
      element.removeAttribute('data-medium-editor-element')
      element.classList.remove('medium-editor-element')
    })
    focusedElements.forEach((element) => {
      element.setAttribute('data-medium-focused', 'false')
    })
    this.elements = []
    const index = editors.indexOf(this)
    if (index !== -1) {
      editors.splice(index, 1)
    }
  }

  on(target, event, listener, useCapture = false) {
    this.events.attachDOMEvent(target, event, listener, useCapture)
    return this
  }

  off(target, event, listener, useCapture = false) {
    this.events.detachDOMEvent(target, event, listener, useCapture)
    return this
  }

  subscribe(event, listener) {
    this.events.attachCustomEvent(event, listener)
    return this
  }

  unsubscribe(event, listener) {
    this.events.detachCustomEvent(event, listener)
    return this
  }

  trigger(name, data, editable) {
    this.events.triggerCustomEvent(name, data, editable)
    return this
  }

  delay(fn) {
    setTimeout(fn, this.options.delay || 0)
  }

  serialize() {
    const result = {}
    this.elements.forEach((element, index) => {
      const key = element.id || `element-${index}`
      result[key] = element.innerHTML.trim()
    })
    return result
  }

  getContent(index) {
    if (index !== undefined && this.elements[index]) {
      return this.elements[index].innerHTML.trim()
    }
    if (this.elements.length === 0) {
      return null
    }
    return this.elements.map(el => el.innerHTML.trim()).join('')
  }

  setContent(html, index) {
    let target
    if (index !== undefined && this.elements[index]) {
      target = this.elements[index]
      target.innerHTML = html
    }
    else if (this.elements[0]) {
      target = this.elements[0]
      target.innerHTML = html
    }
    if (target) {
      this.checkContentChanged(target)
    }
  }

  resetContent(element) {
    if (element) {
      const originalContent = this.originalContent.get(element)
      if (originalContent !== undefined) {
        element.innerHTML = originalContent
      }
    }
    else {
      this.elements.forEach((el) => {
        const originalContent = this.originalContent.get(el)
        if (originalContent !== undefined) {
          el.innerHTML = originalContent
        }
      })
    }
  }

  checkContentChanged(editable) {
    const elements = editable ? [editable] : this.elements
    elements.forEach((element) => {
      this.trigger('editableInput', null, element)
    })
  }

  exportSelection() {
    const selectionElement = this.selection.getSelectionElement(this.options.contentWindow)
    if (!selectionElement) {
      return null
    }
    const editableElementIndex = this.elements.indexOf(selectionElement)
    let selectionState = null
    if (editableElementIndex >= 0) {
      selectionState = this.selection.exportSelection(selectionElement, this.options.ownerDocument)
    }
    if (selectionState !== null && editableElementIndex !== 0) {
      selectionState.editableElementIndex = editableElementIndex
    }
    return selectionState
  }

  saveSelection() {
    this.savedSelection = this.exportSelection()
  }

  importSelection(selectionState, favorLaterSelectionAnchor = false) {
    if (!selectionState) {
      return
    }
    const editableElement = this.elements[selectionState.editableElementIndex || 0]
    if (!editableElement) {
      return
    }
    this.selection.importSelection(selectionState, editableElement, this.options.ownerDocument, favorLaterSelectionAnchor)
  }

  restoreSelection() {
    if (this.savedSelection) {
      this.importSelection(this.savedSelection)
    }
  }

  selectAllContents() {
    const focusedElement = this.getFocusedElement()
    if (focusedElement) {
      this.selection.selectNode(focusedElement, this.options.ownerDocument)
    }
  }

  selectElement(element) {
    this.selection.selectNode(element, this.options.ownerDocument)
    const selElement = this.selection.getSelectionElement(this.options.contentWindow)
    if (selElement) {
      this.events.focusElement(selElement)
    }
  }

  getFocusedElement() {
    return this.elements.find(el => el.getAttribute('data-medium-focused') === 'true') || null
  }

  getSelectedParentElement(range) {
    const selectionRange = range || this.selection.getSelectionRange(this.options.ownerDocument)
    if (selectionRange) {
      return this.selection.getSelectedParentElement(selectionRange)
    }
    return this.options.ownerDocument.body
  }

  stopSelectionUpdates() {
    this.preventSelectionUpdates = true
  }

  startSelectionUpdates() {
    this.preventSelectionUpdates = false
  }

  checkSelection() {
    const toolbar = this.getExtensionByName('toolbar')
    if (toolbar && typeof toolbar.checkState === 'function') {
      toolbar.checkState()
    }
  }

  execAction(action, opts) {
    if (!this.options.ownerDocument || typeof this.options.ownerDocument.execCommand !== 'function') {
      const toolbar = this.getExtensionByName('toolbar')
      if (toolbar && typeof toolbar.applyFormattingFallback === 'function') {
        toolbar.applyFormattingFallback(action)
        return true
      }
      return false
    }
    return this.options.ownerDocument.execCommand(action, false, opts)
  }

  queryCommandState(action) {
    return this.options.ownerDocument.queryCommandState(action)
  }

  getExtensionByName(name) {
    return this.extensions[name]
  }

  addBuiltInExtension(name, opts) {
    return this
  }

  addElements(selector) {
    const newElements = createElementsArray(selector, this.options.ownerDocument, true)
    newElements.forEach((element, index) => {
      initElement(element, this.id + this.elements.length + index)
      this.elements.push(element)
    })
    return this
  }

  removeElements(selector) {
    const elementsToRemove = createElementsArray(selector, this.options.ownerDocument)
    elementsToRemove.forEach((element) => {
      const index = this.elements.indexOf(element)
      if (index !== -1) {
        this.elements.splice(index, 1)
        element.removeAttribute('medium-editor-index')
        element.removeAttribute('contentEditable')
        element.removeAttribute('data-medium-editor-element')
        element.classList.remove('medium-editor-element')
      }
    })
    return this
  }

  createLink(opts) {
    const range = this.selection.getSelectionRange(this.options.ownerDocument)
    if (range) {
      const anchor = this.options.ownerDocument.createElement('a')
      anchor.href = opts.value
      if (opts.target) {
        anchor.target = opts.target
      }
      try {
        range.surroundContents(anchor)
      }
      catch (e) {
        const contents = range.extractContents()
        anchor.appendChild(contents)
        range.insertNode(anchor)
      }
    }
  }

  cleanPaste(text) {
    return text.replace(/[\x00-\x1F\x7F]/g, '')
  }

  pasteHTML(html, options) {
    const tempDiv = this.options.ownerDocument.createElement('div')
    tempDiv.innerHTML = html
    if (options?.cleanAttrs) {
      util.cleanupAttrs(tempDiv, options.cleanAttrs)
    }
    if (options?.cleanTags) {
      util.cleanupTags(tempDiv, options.cleanTags)
    }
    if (options?.unwrapTags) {
      util.unwrapTags(tempDiv, options.unwrapTags)
    }
    util.insertHTMLCommand(this.options.ownerDocument, tempDiv.innerHTML)
  }

  initExtensions() {
    if (this.options.toolbar) {
      const container = this.options.elementsContainer || document.body
      const toolbar = new Toolbar(this.options.toolbar, container, this)
      toolbar.init()
      this.extensions.toolbar = toolbar
    }
    if (this.options.placeholder) {
      const placeholder = new Placeholder(this, this.options.placeholder)
      placeholder.init()
      this.extensions.placeholder = placeholder
    }
    Object.keys(this.options.extensions || {}).forEach((name) => {
      const extension = this.options.extensions[name]
      if (extension && typeof extension.init === 'function') {
        extension.init()
        this.extensions[name] = extension
      }
    })
  }

  attachHandlers() {
    this.events.setupListener('focus')
    this.events.setupListener('blur')
    this.events.setupListener('editableKeydown')
    this.events.setupListener('editableKeyup')
    this.events.setupListener('editableInput')
    this.events.setupListener('editableClick')
    this.events.setupListener('editableBlur')
    this.events.setupListener('editablePaste')
    this.events.setupListener('editableDrag')
    this.events.setupListener('editableDrop')
    this.on(this.options.ownerDocument, 'mouseup', () => {
      setTimeout(() => {
        this.checkSelection()
      }, 0)
    })
    this.elements.forEach((element) => {
      this.on(element, 'keydown', (event) => {
        const keyEvent = event
        if (util.isKey(keyEvent, util.keyCode.SPACE) && this.options.disableExtraSpaces) {
          handleDisableExtraSpaces.call(this, keyEvent)
        }
        if (util.isKey(keyEvent, util.keyCode.ENTER)) {
          handleDisabledEnterKeydown.call(this, keyEvent, element)
        }
        if (util.isKey(keyEvent, util.keyCode.TAB)) {
          handleTabKeydown.call(this, keyEvent)
        }
      })
      this.on(element, 'mouseup', () => {
        setTimeout(() => {
          this.checkSelection()
        }, 10)
      })
    })
  }

  static parseVersionString = parseVersionString
  static version = version
  static util = util
  static selection = selection
}
export {
  MediumEditor as default,
  Events,
  MediumEditor,
  selection,
  util,
}
