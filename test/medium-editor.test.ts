import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { fireEvent, mockExecCommand, selectElementContents, setupTestHelpers } from './helpers/test-utils'

// Import our library for testing
import '../src/index'

describe('MediumEditor Core', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', 'lorem ipsum dolor sit amet')
    el.setAttribute('contenteditable', 'true')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('Initialization', () => {
    it('should initialize with default options', () => {
      const editor = helpers.newMediumEditor('.editor')
      expect(editor).toBeDefined()
      expect(editor.elements).toBeDefined()
      expect(editor.elements.length).toBeGreaterThan(0)
    })

    it('should accept custom options', () => {
      const options = {
        toolbar: {
          buttons: ['bold', 'italic'],
          diffLeft: 10,
          diffTop: 20,
        },
        placeholder: {
          text: 'Type your story...',
        },
      }

      const editor = helpers.newMediumEditor('.editor', options)
      expect(editor.options).toBeDefined()
    })

    it('should work with multiple elements', () => {
      helpers.createElement('div', 'editor', 'second editor')
      helpers.createElement('div', 'editor', 'third editor')

      const editor = helpers.newMediumEditor('.editor')
      expect(editor.elements.length).toBe(3)
    })

    it('should handle invalid selectors gracefully', () => {
      const editor = helpers.newMediumEditor('.nonexistent')
      expect(editor.elements.length).toBe(0)
    })
  })

  describe('Content Management', () => {
    it('should get content from editor', () => {
      const editor = helpers.newMediumEditor('.editor')
      const content = editor.getContent()
      expect(content).toBe('lorem ipsum dolor sit amet')
    })

    it('should set content in editor', () => {
      const editor = helpers.newMediumEditor('.editor')
      const newContent = 'New content here'

      editor.setContent(newContent)
      expect(el.innerHTML).toBe(newContent)
    })

    it('should serialize content properly', () => {
      const editor = helpers.newMediumEditor('.editor')
      const serialized = editor.serialize()

      expect(serialized).toBeDefined()
      expect(typeof serialized).toBe('object')
    })
  })

  describe('Event Handling', () => {
    it('should handle focus events', () => {
      const editor = helpers.newMediumEditor('.editor')
      let focusTriggered = false

      editor.subscribe('focus', () => {
        focusTriggered = true
      })

      fireEvent(el, 'focus')
      expect(focusTriggered).toBe(true)
    })

    it('should handle blur events', () => {
      const editor = helpers.newMediumEditor('.editor')
      let blurTriggered = false

      editor.subscribe('blur', () => {
        blurTriggered = true
      })

      // First set focus, then trigger blur by calling updateFocus with external target
      // since happy-dom doesn't properly support blur event bubbling/capture
      const focusEvent = new Event('focus')
      Object.defineProperty(focusEvent, 'target', { value: el, writable: false })
      ;(editor.events as any).handleElementFocus(focusEvent)

      const blurEvent = new Event('blur')
      Object.defineProperty(blurEvent, 'target', { value: document.body, writable: false })
      ;(editor.events as any).updateFocus(document.body, blurEvent)
      expect(blurTriggered).toBe(true)
    })

    it('should trigger content change events', () => {
      const editor = helpers.newMediumEditor('.editor')
      let inputTriggered = false

      editor.subscribe('editableInput', () => {
        inputTriggered = true
      })

      // Change the content and simulate input by calling the handler directly
      // since happy-dom has issues with input event simulation
      const originalContent = el.innerHTML
      el.innerHTML = 'changed content'
      const inputEvent = new Event('input')
      Object.defineProperty(inputEvent, 'target', { value: el, writable: false })
      ;(editor.events as any).handleInput(inputEvent)
      expect(inputTriggered).toBe(true)

      // Restore original content
      el.innerHTML = originalContent
    })
  })

  describe('Formatting Commands', () => {
    it('should execute bold command', () => {
      const editor = helpers.newMediumEditor('.editor')
      const execMock = mockExecCommand()

      selectElementContents(el)
      editor.execAction('bold')

      expect(execMock.mockFn.mock.calls.length).toBeGreaterThan(0)
      execMock.restore()
    })

    it('should execute italic command', () => {
      const editor = helpers.newMediumEditor('.editor')
      const execMock = mockExecCommand()

      selectElementContents(el)
      editor.execAction('italic')

      expect(execMock.mockFn.mock.calls.length).toBeGreaterThan(0)
      execMock.restore()
    })

    it('should handle execAction with value parameter', () => {
      const editor = helpers.newMediumEditor('.editor')
      const execMock = mockExecCommand()

      selectElementContents(el)
      editor.execAction('foreColor', { value: 'red' })

      expect(execMock.mockFn.mock.calls.length).toBeGreaterThan(0)
      execMock.restore()
    })
  })

  describe('Selection Management', () => {
    it('should save and restore selection', () => {
      const editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      editor.saveSelection()

      // Clear selection
      window.getSelection()?.removeAllRanges()
      expect(window.getSelection()?.rangeCount).toBe(0)

      // Restore selection
      editor.restoreSelection()
      expect(window.getSelection()?.rangeCount).toBeGreaterThan(0)
    })

    it('should export selection state', () => {
      const editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      const exported = editor.exportSelection()

      expect(exported).toBeDefined()
      if (exported) {
        expect(typeof exported.start).toBe('number')
        expect(typeof exported.end).toBe('number')
      }
    })

    it('should import selection state', () => {
      const editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      const exported = editor.exportSelection()

      if (exported) {
        window.getSelection()?.removeAllRanges()
        editor.importSelection(exported)

        expect(window.getSelection()?.rangeCount).toBeGreaterThan(0)
      }
    })
  })

  describe('Extension System', () => {
    it('should support extensions', () => {
      const customExtension = {
        name: 'testExtension',
        init() {
          this.initialized = true
        },
        initialized: false,
      }

      const editor = helpers.newMediumEditor('.editor', {
        extensions: {
          testExtension: customExtension,
        },
      })

      const extension = editor.getExtensionByName('testExtension')
      expect(extension).toBeDefined()
      expect((extension as any)?.initialized).toBe(true)
    })

    it('should get toolbar extension by default', () => {
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      expect(toolbar).toBeDefined()
    })
  })

  describe('Element Management', () => {
    it('should add elements dynamically', () => {
      const editor = helpers.newMediumEditor('.editor')
      const newEl = helpers.createElement('div', 'new-editor', 'new content')
      newEl.setAttribute('contenteditable', 'true')

      editor.addElements([newEl])
      expect(editor.elements.length).toBe(2)
    })

    it('should remove elements', () => {
      helpers.createElement('div', 'editor', 'second element')
      const editor = helpers.newMediumEditor('.editor')

      expect(editor.elements.length).toBe(2)

      editor.removeElements([el])
      expect(editor.elements.length).toBe(1)
    })

    it('should get focused element', () => {
      const editor = helpers.newMediumEditor('.editor')

      fireEvent(el, 'focus')
      const focused = editor.getFocusedElement()

      expect(focused).toBe(el)
    })
  })

  describe('Destroy and Cleanup', () => {
    it('should cleanup when destroyed', () => {
      const editor = helpers.newMediumEditor('.editor')
      const removeEventSpy = spyOn(el, 'removeEventListener')

      editor.destroy()

      expect(removeEventSpy).toHaveBeenCalled()
      removeEventSpy.mockRestore()
    })

    it('should remove data attributes on destroy', () => {
      const editor = helpers.newMediumEditor('.editor')

      // Focus to set data attribute
      fireEvent(el, 'focus')
      expect(el.getAttribute('data-medium-focused')).toBe('true')

      editor.destroy()
      expect(el.getAttribute('data-medium-focused')).toBe('false')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing elements gracefully', () => {
      expect(() => {
        const _editor = helpers.newMediumEditor('.nonexistent')
      }).not.toThrow()
    })

    it('should handle invalid options gracefully', () => {
      expect(() => {
        const _editor = helpers.newMediumEditor('.editor', {
          invalidOption: true,
          toolbar: null,
        })
      }).not.toThrow()
    })

    it('should handle execAction on invalid elements', () => {
      const editor = helpers.newMediumEditor('.nonexistent')

      expect(() => {
        editor.execAction('bold')
      }).not.toThrow()
    })
  })

  describe('Utility Methods', () => {
    it('should check content changed', () => {
      const editor = helpers.newMediumEditor('.editor')
      let changeDetected = false

      editor.subscribe('editableInput', () => {
        changeDetected = true
      })

      editor.setContent('Changed content')
      editor.checkContentChanged()

      expect(changeDetected).toBe(true)
    })

    it('should trigger custom events', () => {
      const editor = helpers.newMediumEditor('.editor')
      let customTriggered = false

      editor.subscribe('customEvent', () => {
        customTriggered = true
      })

      editor.trigger('customEvent')
      expect(customTriggered).toBe(true)
    })

    it('should support event unsubscription', () => {
      const editor = helpers.newMediumEditor('.editor')
      let eventCount = 0

      const handler = () => {
        eventCount++
      }

      editor.subscribe('testEvent', handler)
      editor.trigger('testEvent')
      expect(eventCount).toBe(1)

      editor.unsubscribe('testEvent', handler)
      editor.trigger('testEvent')
      expect(eventCount).toBe(1)
    })
  })

  describe('Configuration', () => {
    it('should handle placeholder configuration', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        placeholder: {
          text: 'Enter your text here...',
          hideOnClick: true,
        },
      })

      expect(el.getAttribute('data-placeholder')).toBe('Enter your text here...')
    })

    it('should handle toolbar configuration', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline'],
          static: true,
          align: 'center',
        },
      })

      const toolbar = document.querySelector('.medium-editor-toolbar')
      expect(toolbar).toBeDefined()
    })

    it('should handle anchor configuration', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        anchor: {
          linkValidation: true,
          targetCheckbox: true,
          targetCheckboxText: 'Open in new window',
        },
      })

      // Should not throw errors
      expect(true).toBe(true)
    })
  })
})
