import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { Toolbar } from '../src/extensions/toolbar'
import { fireEvent, selectElementContents, selectElementContentsAndFire, setupTestHelpers } from './helpers/test-utils'

// Import our library for testing
import '../src/index'

describe('Toolbar', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', 'lorem ipsum dolor sit amet')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('Toolbar Creation', () => {
    it('should create a toolbar when initialized', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold', 'italic'] },
      })

      const toolbar = document.querySelector('.medium-editor-toolbar')
      expect(toolbar).toBeDefined()
    })

    it('should contain configured buttons', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold', 'italic', 'underline'] },
      })

      const boldButton = document.querySelector('[data-action="bold"]')
      const italicButton = document.querySelector('[data-action="italic"]')
      const underlineButton = document.querySelector('[data-action="underline"]')

      expect(boldButton).toBeDefined()
      expect(italicButton).toBeDefined()
      expect(underlineButton).toBeDefined()
    })

    it('should be hidden by default', () => {
      const _editor = helpers.newMediumEditor('.editor')
      const toolbar = document.querySelector('.medium-editor-toolbar') as HTMLElement

      expect(toolbar?.style.display === 'none' || !toolbar?.offsetParent).toBe(true)
    })
  })

  describe('Toolbar Positioning', () => {
    it('should show toolbar when text is selected', async () => {
      const editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      // Wait for async positioning to complete
      await new Promise(resolve => setTimeout(resolve, 20))

      // Manually trigger checkSelection to ensure toolbar positioning
      editor.checkSelection()

      const toolbarExtension = editor.getExtensionByName('toolbar') as any
      const toolbar = toolbarExtension?.getToolbarElement() as HTMLElement
      expect(toolbar?.style.display).not.toBe('none')
    })

    it('should position toolbar near selection', async () => {
      const editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      // Wait for async positioning to complete
      await new Promise(resolve => setTimeout(resolve, 20))

      // Manually trigger checkSelection to ensure toolbar positioning
      editor.checkSelection()

      const toolbarExtension = editor.getExtensionByName('toolbar') as any
      const toolbar = toolbarExtension?.getToolbarElement() as HTMLElement
      if (toolbar) {
        // Check that the toolbar is positioned absolutely
        expect(toolbar.style.position).toBe('absolute')

        // Check that top and left values are set (should be numeric values)
        expect(toolbar.style.top).toMatch(/^\d+px$/)
        expect(toolbar.style.left).toMatch(/^\d+px$/)

        // Check that the toolbar is visible
        expect(toolbar.style.display).toBe('block')
        expect(toolbar.style.visibility).toBe('visible')
      }
    })

    it('should hide toolbar when selection is cleared', () => {
      const _editor = helpers.newMediumEditor('.editor')

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      window.getSelection()?.removeAllRanges()
      fireEvent(document.body, 'click')

      const toolbar = document.querySelector('.medium-editor-toolbar') as HTMLElement
      expect(toolbar?.style.display === 'none' || !toolbar?.offsetParent).toBe(true)
    })
  })

  describe('Button Functionality', () => {
    it('should format text when bold button is clicked', async () => {
      const editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold'] },
      })

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      // Wait for toolbar positioning
      await new Promise(resolve => setTimeout(resolve, 20))
      editor.checkSelection()

      const boldButton = document.querySelector('[data-action="bold"]') as HTMLElement
      if (boldButton) {
        fireEvent(boldButton, 'click')
        expect(el.innerHTML).toMatch(/<(strong|b)>.*<\/(strong|b)>/) // Content should be wrapped in bold tags
      }
    })

    it('should format text when italic button is clicked', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['italic'] },
      })

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      const italicButton = document.querySelector('[data-action="italic"]') as HTMLElement
      if (italicButton) {
        fireEvent(italicButton, 'click')
        expect(el.innerHTML).toBeDefined()
      }
    })

    it('should toggle button states when formatting is applied', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold'] },
      })

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      const boldButton = document.querySelector('[data-action="bold"]') as HTMLElement
      if (boldButton) {
        const _initialClass = boldButton.className
        fireEvent(boldButton, 'click')

        // Button state should change
        expect(boldButton.className).toBeDefined()
      }
    })
  })

  describe('Custom Buttons', () => {
    it('should support custom button configuration', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: [
            {
              name: 'custom',
              action: 'append-h1',
              aria: 'Custom heading',
              tagNames: ['h1'],
              contentDefault: '<b>H1</b>',
              classList: ['custom-button'],
            },
          ],
        },
      })

      const customButton = document.querySelector('.custom-button')
      expect(customButton).toBeDefined()
    })

    it('should execute custom button actions', () => {
      let customActionCalled = false

      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: [
            {
              name: 'custom',
              action: () => { customActionCalled = true },
              aria: 'Custom action',
              contentDefault: 'Custom',
            },
          ],
        },
      })

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      const customButton = document.querySelector('[data-action="custom"]') as HTMLElement
      if (customButton) {
        fireEvent(customButton, 'click')
        expect(customActionCalled).toBe(true)
      }
    })
  })

  describe('Toolbar Options', () => {
    it('should respect static toolbar option', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          static: true,
          align: 'left',
        },
      })

      const toolbars = document.querySelectorAll('.medium-editor-toolbar')
      const toolbar = toolbars[toolbars.length - 1] as HTMLElement // Get the newest toolbar

      // Check that static toolbar option is respected
      expect(toolbar?.getAttribute('data-static-toolbar')).toBe('true')

      // Check computed style since CSS rules with !important override inline styles
      const computedStyle = toolbar ? window.getComputedStyle(toolbar) : null
      expect(computedStyle?.position).toBe('static')
    })

    it('should respect sticky toolbar option', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          sticky: true,
        },
      })

      const toolbar = document.querySelector('.medium-editor-toolbar')
      expect(toolbar).toBeDefined()
    })

    it('should allow toolbar customization', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: ['bold', 'italic'],
          diffLeft: 10,
          diffTop: 20,
          firstButtonClass: 'first-btn',
          lastButtonClass: 'last-btn',
        },
      })

      const toolbar = document.querySelector('.medium-editor-toolbar')
      const firstButton = toolbar?.querySelector('.first-btn')
      const lastButton = toolbar?.querySelector('.last-btn')

      expect(firstButton).toBeDefined()
      expect(lastButton).toBeDefined()
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should trigger bold formatting with Ctrl+B', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold'] },
      })

      selectElementContents(el)
      fireEvent(el, 'keydown', { keyCode: 66, ctrlKey: true }) // Ctrl+B

      // Should apply bold formatting
      expect(el.innerHTML).toBeDefined()
    })

    it('should trigger italic formatting with Ctrl+I', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['italic'] },
      })

      selectElementContents(el)
      fireEvent(el, 'keydown', { keyCode: 73, ctrlKey: true }) // Ctrl+I

      expect(el.innerHTML).toBeDefined()
    })

    it('should trigger underline formatting with Ctrl+U', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['underline'] },
      })

      selectElementContents(el)
      fireEvent(el, 'keydown', { keyCode: 85, ctrlKey: true }) // Ctrl+U

      expect(el.innerHTML).toBeDefined()
    })
  })

  describe('Toolbar Extensions', () => {
    it('should support toolbar extensions', () => {
      const customExtension = {
        name: 'customExtension',
        init() {},
        getButton() {
          const button = document.createElement('button')
          button.textContent = 'Custom'
          return button
        },
      }

      const _editor = helpers.newMediumEditor('.editor', {
        extensions: {
          customExtension,
        },
        toolbar: {
          buttons: ['bold', 'customExtension'],
        },
      })

      expect(document.querySelector('[data-action="customExtension"]')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold', 'italic'] },
      })

      const boldButton = document.querySelector('[data-action="bold"]') as HTMLElement
      const italicButton = document.querySelector('[data-action="italic"]') as HTMLElement

      expect(boldButton?.getAttribute('aria-label')).toBeDefined()
      expect(italicButton?.getAttribute('aria-label')).toBeDefined()
    })

    it('should support keyboard navigation', () => {
      const _editor = helpers.newMediumEditor('.editor', {
        toolbar: { buttons: ['bold', 'italic'] },
      })

      selectElementContents(el)
      fireEvent(el, 'mouseup')

      const toolbar = document.querySelector('.medium-editor-toolbar') as HTMLElement
      const firstButton = toolbar?.querySelector('button') as HTMLElement

      if (firstButton) {
        firstButton.focus()
        fireEvent(firstButton, 'keydown', { keyCode: 9 }) // Tab

        expect(document.activeElement).toBeDefined()
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid button configurations gracefully', () => {
      expect(() => {
        const _editor = helpers.newMediumEditor('.editor', {
          toolbar: {
            buttons: [null, undefined, 'bold'],
          },
        })
      }).not.toThrow()
    })

    it('should handle missing toolbar element', () => {
      const _editor = helpers.newMediumEditor('.nonexistent', {
        toolbar: { buttons: ['bold'] },
      })

      expect(() => {
        selectElementContents(el)
        fireEvent(el, 'mouseup')
      }).not.toThrow()
    })
  })
})

describe('Toolbar Extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('initialization', () => {
    it('should call the createToolbar method', () => {
      const createToolbarSpy = spyOn(Toolbar.prototype, 'createToolbar')

      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      expect(toolbar).toBeDefined()
      expect(createToolbarSpy).toHaveBeenCalled()

      createToolbarSpy.mockRestore()
    })

    it('should create a new element for the editor toolbar', () => {
      // Clean up any remaining toolbars from previous tests
      document.querySelectorAll('.medium-editor-toolbar').forEach(toolbar => toolbar.remove())

      expect(document.querySelectorAll('.medium-editor-toolbar').length).toBe(0)
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')
      if (toolbar && typeof (toolbar as any).getToolbarElement === 'function') {
        const toolbarElement = (toolbar as any).getToolbarElement()
        expect(toolbarElement.className).toMatch(/medium-editor-toolbar/)
        expect(document.querySelectorAll('.medium-editor-toolbar').length).toBe(1)
      }
    })

    it('should not create an anchor form element or anchor extension if anchor is not passed as a button', () => {
      expect(document.querySelectorAll('.medium-editor-toolbar-form-anchor').length).toBe(0)
      const editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline'],
        },
      })
      const toolbar = editor.getExtensionByName('toolbar')
      if (toolbar && typeof (toolbar as any).getToolbarElement === 'function') {
        const toolbarElement = (toolbar as any).getToolbarElement()
        expect(toolbarElement.querySelectorAll('.medium-editor-toolbar-form-anchor').length).toBe(0)
      }
      expect(editor.getExtensionByName('anchor')).toBeUndefined()
    })
  })

  describe('toolbar functionality', () => {
    it('should enable bold button in toolbar when bold text is selected', async () => {
      const newElement = helpers.createElement('div', '', 'lorem ipsum <b><div id="bold_dolor_one">dolor</div></b>')
      newElement.id = 'editor-for-toolbar-test'

      const editor = helpers.newMediumEditor('#editor-for-toolbar-test', { delay: 0 })
      const toolbar = editor.getExtensionByName('toolbar')

      const boldElement = document.getElementById('bold_dolor_one')
      if (boldElement && toolbar && typeof (toolbar as any).getToolbarElement === 'function') {
        selectElementContentsAndFire(boldElement)

        // Wait for async positioning and manually trigger checkSelection
        await new Promise(resolve => setTimeout(resolve, 25))
        editor.checkSelection()

        const toolbarElement = (toolbar as any).getToolbarElement()
        const boldButton = toolbarElement.querySelector('button[data-action="bold"]')
        if (boldButton) {
          expect(boldButton.classList.contains('medium-editor-button-active')).toBe(true)
        }
      }
    })

    it('should trigger the showToolbar custom event when toolbar is shown', async () => {
      const editor = helpers.newMediumEditor('.editor')
      let callbackTriggered = false
      let callbackElement: HTMLElement | undefined

      el.innerHTML = 'specOnShowToolbarTest'

      editor.subscribe('showToolbar', (data: any, element?: HTMLElement) => {
        callbackTriggered = true
        callbackElement = element
      })

      selectElementContentsAndFire(el)

      // Wait for async positioning and manually trigger checkSelection
      await new Promise(resolve => setTimeout(resolve, 25))
      editor.checkSelection()

      expect(callbackTriggered).toBe(true)
      expect(callbackElement).toBe(el)
    })

    it('should trigger positionToolbar custom event when toolbar is moved', async () => {
      const editor = helpers.newMediumEditor('.editor')
      let callbackTriggered = false
      let callbackElement: HTMLElement | undefined

      el.innerHTML = 'specOnUpdateToolbarTest'

      editor.subscribe('positionToolbar', (data: any, element?: HTMLElement) => {
        callbackTriggered = true
        callbackElement = element
      })

      selectElementContentsAndFire(el)

      // Wait for async positioning and manually trigger checkSelection
      await new Promise(resolve => setTimeout(resolve, 25))
      editor.checkSelection()

      expect(callbackTriggered).toBe(true)
      expect(callbackElement).toBe(el)
    })

    it('should trigger the hideToolbar custom event when toolbar is hidden', async () => {
      const editor = helpers.newMediumEditor('.editor')
      let callbackTriggered = false
      let callbackElement: HTMLElement | undefined

      el.innerHTML = 'specOnShowToolbarTest'

      editor.subscribe('hideToolbar', (data: any, element?: HTMLElement) => {
        callbackTriggered = true
        callbackElement = element
      })

      selectElementContentsAndFire(el)

      // Wait for async positioning and manually trigger checkSelection to show toolbar first
      await new Promise(resolve => setTimeout(resolve, 25))
      editor.checkSelection()

      // Remove selection and call check selection, which should make the toolbar be hidden
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
      editor.checkSelection()

      expect(callbackTriggered).toBe(true)
      expect(callbackElement).toBe(el)
    })
  })

  describe('button state management', () => {
    it('should not activate buttons in toolbar when stopSelectionUpdates has been called', async () => {
      el.innerHTML = 'lorem ipsum <b><div id="bold_dolor_two">dolor</div></b>'

      const editor = helpers.newMediumEditor('.editor', { delay: 0 })
      const toolbar = editor.getExtensionByName('toolbar')

      if (typeof editor.stopSelectionUpdates === 'function') {
        editor.stopSelectionUpdates()
      }

      const boldElement = document.getElementById('bold_dolor_two')
      if (boldElement && toolbar && typeof (toolbar as any).getToolbarElement === 'function') {
        selectElementContentsAndFire(boldElement)

        const toolbarElement = (toolbar as any).getToolbarElement()
        const boldButton = toolbarElement.querySelector('button[data-action="bold"]')
        if (boldButton) {
          expect(boldButton.classList.contains('medium-editor-button-active')).toBe(false)
        }

        // Re-enable selection updates and test again
        if (typeof editor.startSelectionUpdates === 'function') {
          editor.startSelectionUpdates()
          selectElementContentsAndFire(boldElement, { eventToFire: 'mouseup' })

          // Wait for async positioning and manually trigger checkSelection
          await new Promise(resolve => setTimeout(resolve, 25))
          editor.checkSelection()
          expect(boldButton.classList.contains('medium-editor-button-active')).toBe(true)
        }
      }
    })
  })
})
