import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { MediumEditor } from '../src/core'
import { placeCursorInsideElement, selectElementContents, setupTestHelpers } from './helpers/test-utils'

describe('Selection', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', 'lorem ipsum')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('exposure', () => {
    it('is exposed on the MediumEditor ctor', () => {
      expect((MediumEditor as any).selection).toBeTruthy()
    })
  })

  describe('exportSelection', () => {
    it('should not export a position indicating the cursor is before an empty paragraph', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p><p>Whatever</p>'
      const span = el.querySelector('span')
      if (span) {
        placeCursorInsideElement(span, 1) // end of first span
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toBeUndefined()
      }
    })

    it('should export a position indicating the cursor is at the beginning of a paragraph', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><b>Whatever</b></p>'
      const boldElement = el.querySelector('b')
      if (boldElement) {
        placeCursorInsideElement(boldElement, 0) // beginning of <b> tag
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toEqual(0)
      }
    })

    it('should not export a position indicating the cursor is after an empty paragraph', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p>'
        + '<p class="target">Whatever</p>'
      const targetParagraph = el.querySelector('p.target')
      if (targetParagraph?.firstChild) {
        // After the 'W' in whatever
        placeCursorInsideElement(targetParagraph.firstChild as HTMLElement, 1)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toBeUndefined()
      }
    })

    it('should not export a position indicating the cursor is after an empty paragraph (in a complicated markup case)', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p>'
        + '<p>What<span class="target">ever</span></p>'
      const targetSpan = el.querySelector('span.target')
      if (targetSpan?.firstChild) {
        // Before the 'e' in whatever
        placeCursorInsideElement(targetSpan.firstChild as HTMLElement, 0)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toBeUndefined()
      }
    })

    it('should not export a position indicating the cursor is after an empty paragraph (in a complicated markup with selection on the element)', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p>'
        + '<p>What<span class="target">ever</span></p>'
      const targetSpan = el.querySelector('span.target')
      if (targetSpan) {
        // Before the 'e' in whatever
        placeCursorInsideElement(targetSpan, 0)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toBeUndefined()
      }
    })

    it('should export a position indicating the cursor is in an empty paragraph', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p><p>Whatever</p>'
      const paragraphs = el.getElementsByTagName('p')
      if (paragraphs[1]) {
        placeCursorInsideElement(paragraphs[1] as HTMLElement, 0)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toEqual(1)
      }
    })

    it('should export a position indicating the cursor is after an empty paragraph', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><p><br /></p><p>Whatever</p>'
      const paragraphs = el.getElementsByTagName('p')
      if (paragraphs[2]) {
        placeCursorInsideElement(paragraphs[2] as HTMLElement, 0)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toEqual(2)
      }
    })

    it('should export a position indicating the cursor is after an empty block element', () => {
      el.innerHTML = '<p><span>www.google.com</span></p><h1><br /></h1><h2><br /></h2><p>Whatever</p>'
      const h2Element = el.querySelector('h2')
      if (h2Element) {
        placeCursorInsideElement(h2Element, 0)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.emptyBlocksIndex).toEqual(2)
      }
    })

    it('should export a selection that specifies an image is the selection', () => {
      el.innerHTML = '<p>lorem ipsum <a href="#"><img src="../demo/img/medium-editor.jpg" /></a> dolor</p>'
      const anchor = el.querySelector('a')
      if (anchor) {
        selectElementContents(anchor)
        const exportedSelection = (MediumEditor as any).selection?.exportSelection(el, document)
        expect(exportedSelection?.start).toBe(12)
        expect(exportedSelection?.end).toBe(12)
        expect(exportedSelection?.trailingImageCount).toBe(1)
      }
    })
  })

  describe('importSelection', () => {
    it('should be able to import an exported selection', () => {
      el.innerHTML = 'lorem <i>ipsum</i> dolor'

      const italicElement = el.querySelector('i')
      if (italicElement && (MediumEditor as any).selection) {
        selectElementContents(italicElement)
        const exportedSelection = (MediumEditor as any).selection.exportSelection(el, document)
        expect(Object.keys(exportedSelection).sort()).toEqual(['end', 'start'])

        selectElementContents(el)
        expect(exportedSelection).not.toEqual((MediumEditor as any).selection.exportSelection(el, document))

        ;(MediumEditor as any).selection.importSelection(exportedSelection, el, document)
        expect(exportedSelection).toEqual((MediumEditor as any).selection.exportSelection(el, document))
      }
    })

    it('should be able to import an exported selection that contain nodeTypes > 3', () => {
      el.innerHTML = '<div><p>stuff here <!-- comment nodeType is 8 --> additional stuff here </p></div>'
      const paragraph = el.querySelector('p')
      if (paragraph && (MediumEditor as any).selection) {
        selectElementContents(paragraph)
        const exportedSelection = (MediumEditor as any).selection.exportSelection(el, document)
        expect(Object.keys(exportedSelection).sort()).toEqual(['end', 'start'])

        selectElementContents(el)
        expect(exportedSelection).toEqual((MediumEditor as any).selection.exportSelection(el, document))

        ;(MediumEditor as any).selection.importSelection(exportedSelection, el, document)
        expect(exportedSelection).toEqual((MediumEditor as any).selection.exportSelection(el, document))
      }
    })

    it('should import an exported selection outside any anchor tag', () => {
      // Clear any existing selection state from previous tests
      const existingSelection = window.getSelection()
      if (existingSelection) {
        existingSelection.removeAllRanges()
      }

      el.innerHTML = '<p id=1>Hello world: <a href="#">http://www.example.com</a></p><p id=2><br></p>'
      const link = el.getElementsByTagName('a')[0]
      const linkTextNode = link?.childNodes[0]

      if (link && linkTextNode && linkTextNode.nodeValue && (MediumEditor as any).selection) {
        placeCursorInsideElement(linkTextNode as HTMLElement, linkTextNode.nodeValue.length)

        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const currentRange = selection.getRangeAt(0)
          expect((MediumEditor as any).util?.isDescendant(link, currentRange.startContainer, true)).toBe(true)

          const exportedSelection = (MediumEditor as any).selection.exportSelection(el, document)
          ;(MediumEditor as any).selection.importSelection(exportedSelection, el, document, true)

          const range = window.getSelection()?.getRangeAt(0)
          if (range) {
            let node = range.startContainer

            // Safari specific check
            const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
            if (!isSafari) {
              expect((MediumEditor as any).util?.isDescendant(link, node, true)).toBe(false)
            }

            // Find the parent P tag
            while (node && node.nodeName.toLowerCase() !== 'p') {
              node = node.parentNode as Node
            }
            if (node) {
              expect(node.nodeName.toLowerCase()).toBe('p')
              expect((node as HTMLElement).getAttribute('id')).toBe('1')
            }
          }
        }
      }
    })

    // https://github.com/stacksjs/ts-medium-editor/issues/738
    it.skip('should import an exported non-collapsed selection after an empty paragraph', () => {
      el.innerHTML = '<p>This is <a href=\"#\">a link</a></p><p><br/></p><p>not a link</p>'
      const lastTextNode = el.childNodes[2]?.firstChild

      if (lastTextNode && (MediumEditor as any).selection) {
        ;(MediumEditor as any).selection.select(document, lastTextNode, 0, lastTextNode, 'not a link'.length)
        const exportedSelection = (MediumEditor as any).selection.exportSelection(el, document)
        expect(exportedSelection).toEqual({ start: 14, end: 24, emptyBlocksIndex: 2 })

        ;(MediumEditor as any).selection.importSelection(exportedSelection, el, document)
        const range = window.getSelection()?.getRangeAt(0)

        expect(range?.startContainer).toBe(lastTextNode)
        expect(range?.endContainer).toBe(lastTextNode)
      }
    })
  })
})
