import type { CaretOffsets, SelectionState } from './types'
import { util } from './util'

function filterOnlyParentElements(node: Node): number {
  if (util.isBlockContainer(node as HTMLElement)) {
    return NodeFilter.FILTER_ACCEPT
  }
  else {
    return NodeFilter.FILTER_SKIP
  }
}

export const selection = {
  findMatchingSelectionParent(testElementFunction: (node: Node) => boolean, contentWindow: Window): HTMLElement | false {
    const selection = contentWindow.getSelection()

    if (!selection || selection.rangeCount === 0) {
      return false
    }

    const range = selection.getRangeAt(0)
    const current = range.commonAncestorContainer

    return util.traverseUp(current, testElementFunction) as HTMLElement | false
  },

  getSelectionElement(contentWindow: Window): HTMLElement | false {
    return this.findMatchingSelectionParent((node: Node) => {
      return util.isMediumEditorElement(node as HTMLElement)
    }, contentWindow)
  },

  exportSelection(root: HTMLElement, doc: Document): SelectionState | null {
    if (!root) {
      return null
    }

    let selectionState: SelectionState | null = null
    const selection = doc.getSelection()

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preSelectionRange = range.cloneRange()

      preSelectionRange.selectNodeContents(root)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      selectionState = {
        start,
        end: start + range.toString().length,
      }

      // Check if selection starts with images
      if (this.doesRangeStartWithImages(range, doc)) {
        selectionState.startsWithImage = true
      }

      // Check for trailing images
      const trailingImageCount = this.getTrailingImageCount(root, selectionState, range.endContainer, range.endOffset)
      if (trailingImageCount) {
        selectionState.trailingImageCount = trailingImageCount
      }

      // Handle empty blocks
      if (start !== 0) {
        const emptyBlocksIndex = this.getIndexRelativeToAdjacentEmptyBlocks(doc, root, range.startContainer, range.startOffset)
        if (emptyBlocksIndex !== -1) {
          selectionState.emptyBlocksIndex = emptyBlocksIndex
        }
      }
    }

    return selectionState
  },

  importSelection(selectionState: SelectionState, root: HTMLElement, doc: Document, favorLaterSelectionAnchor = false): void {
    if (!selectionState || !root) {
      return
    }

    const range = doc.createRange()
    range.setStart(root, 0)
    range.collapse(true)

    let node: Node | null = root
    const nodeStack: Node[] = []
    let charIndex = 0
    let foundStart = false
    let foundEnd = false
    let trailingImageCount = 0
    let stop = false
    let nextCharIndex: number
    let allowRangeToStartAtEndOfNode = false
    let lastTextNode: Text | null = null

    if (favorLaterSelectionAnchor || selectionState.startsWithImage || typeof selectionState.emptyBlocksIndex !== 'undefined') {
      allowRangeToStartAtEndOfNode = true
    }

    while (!stop && node) {
      if (node.nodeType > 3) {
        node = nodeStack.pop() || null
        continue
      }

      if (node.nodeType === 3 && !foundEnd) {
        const textNode = node as Text
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
            while (node.parentNode!.childNodes[endIndex] !== node) {
              endIndex++
            }
            range.setEnd(node.parentNode!, endIndex + 1)
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

    // Handle edge cases
    if (!foundStart && lastTextNode) {
      range.setStart(lastTextNode, lastTextNode.length)
    }

    // Move cursor past anchor if needed
    if (favorLaterSelectionAnchor) {
      this.importSelectionMoveCursorPastAnchor(selectionState, range)
    }

    // Handle empty blocks - only for collapsed selections (cursor placement)
    if (typeof selectionState.emptyBlocksIndex !== 'undefined' && selectionState.start === selectionState.end) {
      this.importSelectionMoveCursorPastBlocks(doc, root, selectionState.emptyBlocksIndex, range)
    }

    const selection = doc.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  },

  importSelectionMoveCursorPastAnchor(selectionState: SelectionState, range: Range): void {
    const nodeInsideAnchorTagFunction = (node: Node): boolean => {
      return node.nodeName.toLowerCase() === 'a'
    }

    if (selectionState.start === selectionState.end
      && range.startContainer.nodeType === 3
      && range.startOffset === (range.startContainer as Text).nodeValue!.length) {
      const nodeInsideAnchorTag = util.traverseUp(range.startContainer, nodeInsideAnchorTagFunction)
      if (nodeInsideAnchorTag) {
        const nextNode = nodeInsideAnchorTag.nextSibling
        if (nextNode && nextNode.nodeType === 3) {
          range.setStart(nextNode, 0)
          range.setEnd(nextNode, 0)
        }
        else if (nodeInsideAnchorTag.parentNode) {
          const parentNode = nodeInsideAnchorTag.parentNode
          const nodeIndex = Array.prototype.indexOf.call(parentNode.childNodes, nodeInsideAnchorTag)
          range.setStart(parentNode as Node, nodeIndex + 1)
          range.setEnd(parentNode as Node, nodeIndex + 1)
        }
      }
    }
  },

  importSelectionMoveCursorPastBlocks(doc: Document, root: HTMLElement, index: number, range: Range): void {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode: filterOnlyParentElements })
    let emptyBlockContainer: HTMLElement | null = null
    let currIndex = 0
    let node: HTMLElement | null

    // eslint-disable-next-line no-cond-assign, no-unmodified-loop-condition
    while ((node = walker.nextNode() as HTMLElement)) {
      if (node.textContent!.trim() === '') {
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

  getIndexRelativeToAdjacentEmptyBlocks(doc: Document, root: HTMLElement, cursorContainer: Node, cursorOffset: number): number {
    // If there is text in front of the cursor, that means there isn't only empty blocks before it
    if (cursorContainer.textContent && cursorContainer.textContent.length > 0 && cursorOffset > 0) {
      return -1
    }

    // Check if the block that contains the cursor has any other text in front of the cursor
    let node: Node | null = cursorContainer
    if (node.nodeType !== 3) {
      node = cursorContainer.childNodes[cursorOffset]
    }

    if (node) {
      // The element isn't at the beginning of a block, so it has content before it
      const isAtBeginning = util.isElementAtBeginningOfBlock(node)

      if (!isAtBeginning) {
        return -1
      }

      const previousSibling = util.findPreviousSibling(node)

      // If there is no previous sibling, this is the first text element in the editor
      if (!previousSibling) {
        // Don't return -1 here, continue to the empty blocks counting logic
      }
      // If the previous sibling has text, then there are no empty blocks before this
      else if ((previousSibling as any).nodeValue) {
        // Don't return -1 here either, let the empty blocks counting handle it
      }
    }

    // Walk over block elements, counting number of empty blocks between last piece of text
    // and the block the cursor is in
    const closestBlock = util.getClosestBlockContainer(cursorContainer)

    const treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterOnlyParentElements)
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

  doesRangeStartWithImages(range: Range, doc: Document): boolean {
    if (range.startContainer.nodeType !== 3) {
      return false
    }

    const textContent = (range.startContainer as Text).textContent!
    if (range.startOffset > 0 && textContent.substring(0, range.startOffset).trim() !== '') {
      return false
    }

    const walker = doc.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ALL,
      {
        acceptNode(node: Node): number {
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_SKIP
        },
      },
    )

    walker.currentNode = range.startContainer
    let node: Node | null
    // eslint-disable-next-line no-cond-assign
    while ((node = walker.previousNode())) {
      if (node.nodeName.toLowerCase() === 'img') {
        return true
      }
      if (node.nodeType === 3 && node.textContent!.trim() !== '') {
        return false
      }
    }

    return false
  },

  getTrailingImageCount(root: HTMLElement, selectionState: SelectionState, endContainer: Node, endOffset: number): number {
    let imageCount = 0

    // Handle case where endContainer is not a text node (e.g., element with selected image children)
    if (endContainer.nodeType !== 3) {
      // Check if the selection itself contains images
      if (endContainer.nodeType === 1) {
        const element = endContainer as Element
        // Count images that are selected within this element
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

    const textNode = endContainer as Text
    const textAfterSelection = textNode.textContent!.substring(endOffset)
    if (textAfterSelection.trim() !== '') {
      return 0
    }

    let node: Node | null = endContainer.nextSibling

    while (node) {
      if (node.nodeName.toLowerCase() === 'img') {
        imageCount++
      }
      else if (node.nodeType === 3 && node.textContent!.trim() !== '') {
        break
      }
      else if (node.nodeType === 1 && !(node as Element).querySelector('img')) {
        break
      }
      node = node.nextSibling
    }

    return imageCount
  },

  selectionContainsContent(doc: Document): boolean {
    const selection = doc.getSelection()
    if (!selection || selection.isCollapsed) {
      return false
    }

    const range = selection.getRangeAt(0)
    if (range.collapsed) {
      return false
    }

    const contents = range.cloneContents()
    const textContent = contents.textContent || ''
    const hasText = textContent.trim().length > 0
    const hasImages = contents.querySelector('img') !== null

    return hasText || hasImages
  },

  selectionInContentEditableFalse(contentWindow: Window): boolean {
    const selection = contentWindow.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return false
    }

    const range = selection.getRangeAt(0)
    let node: Node | null = range.commonAncestorContainer

    while (node && node.nodeType !== 1) {
      node = node.parentNode
    }

    if (node) {
      const element = node as HTMLElement
      return element.contentEditable === 'false'
    }

    return false
  },

  getSelectionHtml(doc: Document): string {
    const selection = doc.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return ''
    }

    const range = selection.getRangeAt(0)
    const contents = range.cloneContents()
    const div = doc.createElement('div')
    div.appendChild(contents)
    return div.innerHTML
  },

  getCaretOffsets(element: HTMLElement, range?: Range): CaretOffsets {
    if (!range) {
      const selection = element.ownerDocument.getSelection()
      if (!selection || selection.rangeCount === 0) {
        return { left: 0, right: 0 }
      }
      range = selection.getRangeAt(0)
    }

    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    const left = preCaretRange.toString().length

    const postCaretRange = range.cloneRange()
    postCaretRange.selectNodeContents(element)
    postCaretRange.setStart(range.endContainer, range.endOffset)
    const right = postCaretRange.toString().length

    return { left, right }
  },

  rangeSelectsSingleNode(range: Range): boolean {
    const startNode = range.startContainer
    const endNode = range.endContainer
    return startNode === endNode && range.startOffset + 1 === range.endOffset
  },

  getSelectedParentElement(range: Range): HTMLElement {
    if (range.startContainer === range.endContainer) {
      let element = range.startContainer as HTMLElement
      if (element.nodeType === 3) {
        element = element.parentElement!
      }
      return element
    }

    const commonAncestor = range.commonAncestorContainer as HTMLElement
    return commonAncestor.nodeType === 3 ? commonAncestor.parentElement! : commonAncestor
  },

  getSelectedElements(doc: Document): HTMLElement[] {
    const selection = doc.getSelection()
    const selectedElements: HTMLElement[] = []

    if (!selection || selection.rangeCount === 0) {
      return selectedElements
    }

    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(i)
      const element = this.getSelectedParentElement(range)
      if (!selectedElements.includes(element)) {
        selectedElements.push(element)
      }
    }

    return selectedElements
  },

  selectNode(node: Node, doc: Document): void {
    const range = doc.createRange()
    range.selectNodeContents(node)
    this.selectRange(doc, range)
  },

  select(doc: Document, startNode: Node, startOffset: number, endNode: Node, endOffset: number): void {
    const range = doc.createRange()
    range.setStart(startNode, startOffset)
    range.setEnd(endNode, endOffset)
    this.selectRange(doc, range)
  },

  clearSelection(doc: Document, moveCursorToStart = false): void {
    const selection = doc.getSelection()
    if (selection) {
      if (moveCursorToStart && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      else {
        selection.removeAllRanges()
      }
    }
  },

  moveCursor(doc: Document, node: Node, offset = 0): void {
    this.select(doc, node, offset, node, offset)
  },

  getSelectionRange(ownerDocument: Document): Range | null {
    const selection = ownerDocument.getSelection()
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0)
    }
    return null
  },

  selectRange(ownerDocument: Document, range: Range): void {
    const selection = ownerDocument.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  },

  getSelectionStart(ownerDocument: Document): Node | null {
    const selection = ownerDocument.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      return range.startContainer
    }
    return null
  },
}
