import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mockExecCommand, selectElementContents, setupTestHelpers } from './helpers/test-utils'

describe('Core API', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', 'lore ipsum')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('getFocusedElement', () => {
    it('should return the element which currently has a data-medium-focused attribute', () => {
      const elementOne = helpers.createElement('div', 'editor', 'lorem ipsum')
      const elementTwo = helpers.createElement('div', 'editor', 'lorem ipsum')
      elementTwo.setAttribute('data-medium-focused', 'true')

      const editor = helpers.newMediumEditor('.editor')
      const focused = editor.getFocusedElement()
      expect(focused).not.toBe(elementOne)
      expect(focused).toBe(elementTwo)
    })

    it('should return the element focused via call to selectElement', () => {
      const elementOne = helpers.createElement('div', 'editor', 'lorem ipsum')
      const elementTwo = helpers.createElement('div', 'editor', 'lorem ipsum')
      elementTwo.setAttribute('data-medium-focused', 'true')

      const editor = helpers.newMediumEditor('.editor')

      // Select elementOne directly
      editor.selectElement(elementOne)

      const focused = editor.getFocusedElement()
      expect(focused).toBe(elementOne)
    })
  })

  describe('setContent', () => {
    it('should set the content of the editor\'s element', () => {
      const newHTML = 'Lorem ipsum dolor'
      const otherHTML = 'something different'
      const elementOne = helpers.createElement('div', 'editor', 'lorem ipsum')
      const editor = helpers.newMediumEditor('.editor')

      editor.setContent(newHTML)
      expect(el.innerHTML).toEqual(newHTML)
      expect(elementOne.innerHTML).not.toEqual(newHTML)

      editor.setContent(otherHTML, 1)
      expect(elementOne.innerHTML).toEqual(otherHTML)
      expect(el.innerHTML).not.toEqual(otherHTML)
    })
  })

  describe('getContent', () => {
    it('should retrieve the content of the first element', () => {
      const editor = helpers.newMediumEditor('.editor')
      expect(editor.getContent()).toEqual('lore ipsum')
    })

    it('should retrieve the content of the element at the specified index', () => {
      const otherHTML = 'something different'
      helpers.createElement('div', 'editor', otherHTML)
      const editor = helpers.newMediumEditor('.editor')
      expect(editor.getContent(1)).toEqual(otherHTML)
    })

    it('should return null if no element exists', () => {
      const editor = helpers.newMediumEditor('.no-valid-selector')
      expect(editor.getContent()).toBeNull()
    })
  })

  describe('resetContent', () => {
    it('should reset the content of all editor elements to their initial values', () => {
      const initialOne = el.innerHTML
      const initialTwo = 'Lorem ipsum dolor'
      const elementTwo = helpers.createElement('div', 'editor', initialTwo)
      const editor = helpers.newMediumEditor('.editor')

      editor.setContent('<p>changed content</p>')
      expect(el.innerHTML).not.toEqual(initialOne)
      editor.setContent('<p>changed content</p>', 1)
      expect(elementTwo.innerHTML).not.toEqual(initialTwo)

      editor.resetContent()

      expect(el.innerHTML).toEqual(initialOne)
      expect(elementTwo.innerHTML).toEqual(initialTwo)
    })

    it('should reset the content of a specific element when provided', () => {
      const initialOne = el.innerHTML
      const initialTwo = 'Lorem ipsum dolor'
      const elementTwo = helpers.createElement('div', 'editor', initialTwo)
      const editor = helpers.newMediumEditor('.editor')

      editor.setContent('<p>changed content</p>')
      expect(el.innerHTML).not.toEqual(initialOne)
      editor.setContent('<p>changed content</p>', 1)
      expect(elementTwo.innerHTML).not.toEqual(initialTwo)

      editor.resetContent(elementTwo)

      expect(el.innerHTML).not.toEqual(initialOne)
      expect(elementTwo.innerHTML).toEqual(initialTwo)
    })

    it('should not reset anything if an invalid element is provided', () => {
      const initialOne = el.innerHTML
      const initialTwo = 'Lorem ipsum dolor'
      const elementTwo = helpers.createElement('div', 'editor', initialTwo)
      const dummyElement = helpers.createElement('div', 'not-editor', '<p>dummy element</p>')
      const editor = helpers.newMediumEditor('.editor')

      editor.setContent('<p>changed content</p>')
      expect(el.innerHTML).not.toEqual(initialOne)
      editor.setContent('<p>changed content</p>', 1)
      expect(elementTwo.innerHTML).not.toEqual(initialTwo)

      editor.resetContent(dummyElement)

      expect(el.innerHTML).not.toEqual(initialOne)
      expect(elementTwo.innerHTML).not.toEqual(initialTwo)
    })
  })

  describe('exportSelection', () => {
    it('should have an index in the exported selection when it is in the second contenteditable', () => {
      helpers.createElement('div', 'editor', 'lorem <i>ipsum</i> dolor')
      const editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: ['italic', 'underline', 'strikethrough'],
        },
      })

      const italicElement = editor.elements[1]?.querySelector('i')
      if (italicElement) {
        selectElementContents(italicElement)
        const exportedSelection = editor.exportSelection()
        if (exportedSelection) {
          expect(Object.keys(exportedSelection).sort()).toEqual(['editableElementIndex', 'end', 'start'])
          expect((exportedSelection as any).editableElementIndex).toEqual(1)
        }
      }
    })
  })

  describe('execAction', () => {
    it('should pass opt directly to document.execCommand', () => {
      const execMock = mockExecCommand()
      const editor = helpers.newMediumEditor('.editor')

      editor.execAction('foreColor', { value: 'red' })

      expect(execMock.mockFn.mock.calls.length).toBe(1)
      expect(execMock.mockFn.mock.calls[0]).toEqual(['foreColor', false, { value: 'red' }])
      execMock.restore()
    })
  })
})
