import { beforeEach, describe, expect, it } from 'bun:test'
import { MediumEditor } from '../src'

describe('Toolbar Advanced Features', () => {
  let editor: MediumEditor
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('div')
    el.className = 'editable'
    el.innerHTML = '<p>Some initial content</p>'
    document.body.appendChild(el)
  })

  describe('allowMultiParagraphSelection', () => {
    it('should hide toolbar when multi-paragraph selection is disabled and selection spans multiple paragraphs', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          allowMultiParagraphSelection: false,
        },
      })

      // Create multi-paragraph content
      el.innerHTML = '<p>First paragraph</p><p>Second paragraph</p>'

      // Create a selection that spans both paragraphs
      const range = document.createRange()
      range.setStart(el.firstChild!.firstChild!, 0)
      range.setEnd(el.lastChild!.firstChild!, 6)

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any
      toolbar.positionToolbar()

      // Toolbar should be hidden
      expect(toolbar.toolbar.style.display).toBe('none')
    })

    it('should show toolbar when multi-paragraph selection is enabled and selection spans multiple paragraphs', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          allowMultiParagraphSelection: true,
        },
      })

      // Create multi-paragraph content
      el.innerHTML = '<p>First paragraph</p><p>Second paragraph</p>'

      // Create a selection that spans both paragraphs
      const range = document.createRange()
      range.setStart(el.firstChild!.firstChild!, 0)
      range.setEnd(el.lastChild!.firstChild!, 6)

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any
      toolbar.positionToolbar()

      // Toolbar should be visible
      expect(toolbar.toolbar.style.display).not.toBe('none')
    })
  })

  describe('standardizeSelectionStart', () => {
    it('should standardize selection to word boundaries when enabled', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          standardizeSelectionStart: true,
        },
      })

      el.innerHTML = '<p>Hello world test</p>'

      // Create a selection in the middle of "world"
      const range = document.createRange()
      const textNode = el.firstChild!.firstChild!
      range.setStart(textNode, 8) // Middle of "world"
      range.setEnd(textNode, 11) // End of "world"

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any
      toolbar.positionToolbar()

      // Selection should now start at beginning of "world"
      const newSelection = window.getSelection()!
      const newRange = newSelection.getRangeAt(0)
      expect(newRange.startOffset).toBe(6) // Start of "world"
      expect(newRange.endOffset).toBe(11) // End of "world"
    })
  })

  describe('firstButtonClass and lastButtonClass', () => {
    it('should apply first and last button classes', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline'],
          firstButtonClass: 'first-button',
          lastButtonClass: 'last-button',
        },
      })

      const toolbar = editor.getExtensionByName('toolbar') as any
      const buttons = toolbar.buttons

      expect(buttons[0].classList.contains('first-button')).toBe(true)
      expect(buttons[buttons.length - 1].classList.contains('last-button')).toBe(true)
      expect(buttons[1].classList.contains('first-button')).toBe(false)
      expect(buttons[1].classList.contains('last-button')).toBe(false)
    })
  })

  describe('diffLeft and diffTop', () => {
    it('should apply position offsets', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          diffLeft: 20,
          diffTop: -10,
        },
      })

      // Create a selection
      const range = document.createRange()
      range.selectNodeContents(el.firstChild!)

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any

      // Mock getBoundingClientRect to return predictable values
      const originalGetBoundingClientRect = range.getBoundingClientRect
      range.getBoundingClientRect = () => ({
        top: 100,
        left: 100,
        width: 100,
        height: 20,
        right: 200,
        bottom: 120,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect)

      toolbar.positionToolbar()

      // Check that offsets were applied
      const toolbarTop = Number.parseInt(toolbar.toolbar.style.top, 10)
      const toolbarLeft = Number.parseInt(toolbar.toolbar.style.left, 10)

      // The exact values depend on toolbar height and other calculations,
      // but we can verify the offsets were applied
      expect(toolbarLeft).toBeGreaterThan(100) // Should include diffLeft offset
      expect(toolbarTop).toBeLessThan(100) // Should include diffTop offset (negative)

      // Restore original function
      range.getBoundingClientRect = originalGetBoundingClientRect
    })
  })

  describe('toolbar alignment', () => {
    it('should align toolbar to the left when align is set to left', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          align: 'left',
        },
      })

      // Create a selection
      const range = document.createRange()
      range.selectNodeContents(el.firstChild!)

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any

      // Mock getBoundingClientRect
      const originalGetBoundingClientRect = range.getBoundingClientRect
      range.getBoundingClientRect = () => ({
        top: 100,
        left: 200,
        width: 100,
        height: 20,
        right: 300,
        bottom: 120,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect)

      toolbar.positionToolbar()

      const toolbarLeft = Number.parseInt(toolbar.toolbar.style.left, 10)
      expect(toolbarLeft).toBeGreaterThanOrEqual(200) // Should align to left edge

      // Restore original function
      range.getBoundingClientRect = originalGetBoundingClientRect
    })

    it('should align toolbar to the right when align is set to right', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
          align: 'right',
        },
      })

      // Create a selection
      const range = document.createRange()
      range.selectNodeContents(el.firstChild!)

      const selection = window.getSelection()!
      selection.removeAllRanges()
      selection.addRange(range)

      const toolbar = editor.getExtensionByName('toolbar') as any

      // Mock getBoundingClientRect and toolbar width
      const originalGetBoundingClientRect = range.getBoundingClientRect
      range.getBoundingClientRect = () => ({
        top: 100,
        left: 200,
        width: 100,
        height: 20,
        right: 300,
        bottom: 120,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect)

      Object.defineProperty(toolbar.toolbar, 'offsetWidth', {
        value: 150,
        configurable: true,
      })

      toolbar.positionToolbar()

      const toolbarLeft = Number.parseInt(toolbar.toolbar.style.left, 10)
      expect(toolbarLeft).toBeLessThanOrEqual(300) // Should align to right edge

      // Restore original function
      range.getBoundingClientRect = originalGetBoundingClientRect
    })
  })
})
