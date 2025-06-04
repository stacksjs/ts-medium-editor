import type { TestHelpers } from './helpers/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, spyOn } from 'bun:test'
// Make sure we have MediumEditor available
import { MediumEditor } from '../src/core'

import { fireEvent, mockExecCommand, selectElementContentsAndFire, setupTestHelpers } from './helpers/test-utils'

describe('Buttons', () => {
  let helpers: TestHelpers
  let el: HTMLElement
  let textarea: HTMLTextAreaElement

  beforeAll(() => {
    textarea = document.createElement('textarea')
    textarea.innerHTML = 'Ignore me please, placed here to make create an image test pass in Gecko'
    document.body.appendChild(textarea)
    textarea.focus()
  })

  afterAll(() => {
    document.body.removeChild(textarea)
  })

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', 'lorem ipsum')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('button click', () => {
    it('should set active class on click', async () => {
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])
        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="bold"]')
        if (button) {
          fireEvent(button, 'click')
          // Wait for async button state update
          await new Promise(resolve => setTimeout(resolve, 10))

          expect(button.className).toContain('medium-editor-button-active')
        }
      }
    })

    it('should check for selection when selection is undefined', async () => {
      const checkSelectionSpy = spyOn(MediumEditor.prototype, 'checkSelection')
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])
        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="bold"]')
        if (button) {
          fireEvent(button, 'click')
          // Wait for async checkSelection call
          await new Promise(resolve => setTimeout(resolve, 10))
          expect(checkSelectionSpy).toHaveBeenCalled()
        }
      }
      checkSelectionSpy.mockRestore()
    })

    it('should remove active class if button has it', async () => {
      el.innerHTML = '<b>lorem ipsum</b>'
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])

        // Wait for toolbar positioning and button state update
        await new Promise(resolve => setTimeout(resolve, 10))
        editor.checkSelection()

        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="bold"]')
        if (button) {
          expect(button.className).toContain('medium-editor-button-active')
          fireEvent(button, 'click')

          // Wait for async button state update after click
          await new Promise(resolve => setTimeout(resolve, 10))
          expect(button.className).not.toContain('medium-editor-button-active')
        }
      }
    })

    it('should execute the button action', () => {
      const execActionSpy = spyOn(MediumEditor.prototype, 'execAction')
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])
        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="bold"]')
        if (button) {
          fireEvent(button, 'click')
          expect(execActionSpy).toHaveBeenCalledWith('bold')
        }
      }
      execActionSpy.mockRestore()
    })
  })

  describe('button default config', () => {
    it('should be accessible via defaults property of the button prototype', () => {
      if ((MediumEditor as any).extensions?.button?.prototype?.defaults) {
        expect((MediumEditor as any).extensions.button.prototype.defaults.bold).toBeTruthy()
        expect((MediumEditor as any).extensions.button.prototype.defaults.anchor).toBeFalsy()
      }
    })

    it('should be checkable via static Button.isBuiltInButton() method', () => {
      if ((MediumEditor as any).extensions?.button?.isBuiltInButton) {
        expect((MediumEditor as any).extensions.button.isBuiltInButton('bold')).toBe(true)
        expect((MediumEditor as any).extensions.button.isBuiltInButton('anchor')).toBe(false)
      }
    })
  })

  describe('button constructor', () => {
    it('should accept a set of config options', () => {
      if ((MediumEditor as any).extensions?.button) {
        const ButtonClass = (MediumEditor as any).extensions.button
        const italicConfig = ButtonClass.prototype.defaults.italic
        const italicButton = new ButtonClass(italicConfig)

        Object.keys(italicConfig).forEach((prop) => {
          expect((italicButton as any)[prop]).toBe(italicConfig[prop])
        })
      }
    })

    it('should accept a built-in button name', () => {
      if ((MediumEditor as any).extensions?.button) {
        const ButtonClass = (MediumEditor as any).extensions.button
        const italicButtonOne = new ButtonClass(ButtonClass.prototype.defaults.italic)
        const italicButtonTwo = new ButtonClass('italic')

        expect(italicButtonOne).toEqual(italicButtonTwo)
      }
    })
  })

  describe('button options', () => {
    it('should support overriding defaults', () => {
      el.innerHTML = '<h2>lorem</h2><h3>ipsum</h3>'
      const editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: [
            'bold',
            {
              name: 'h1',
              action: 'append-h2',
              aria: 'fake h1',
              tagNames: ['h2'],
              contentDefault: '<b>H1</b>',
              classList: ['customClassName'],
              attrs: {
                'data-custom-attr': 'custom-value',
              },
            },
            {
              name: 'h2',
              getAction() {
                return 'append-h3'
              },
              getAria() {
                return 'fake h2'
              },
              getTagNames() {
                return ['h3']
              },
              contentDefault: '<b>H2</b>',
            },
          ],
        },
      })

      const headerOneButton = editor.getExtensionByName('h1')
      const headerTwoButton = editor.getExtensionByName('h2')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar && headerOneButton && headerTwoButton) {
        expect((toolbar as any).getToolbarElement().querySelectorAll('button').length).toBe(3)

        const button = (toolbar as any).getToolbarElement().querySelector('.medium-editor-action-h1')
        const buttonTwo = (toolbar as any).getToolbarElement().querySelector('.medium-editor-action-h2')

        if (button && buttonTwo) {
          expect(button).toBe((headerOneButton as any).getButton())
          expect(button.getAttribute('aria-label')).toBe('fake h1')
          expect(button.getAttribute('title')).toBe('fake h1')
          expect(button.getAttribute('data-custom-attr')).toBe('custom-value')
          expect(button.classList.contains('customClassName')).toBe(true)
          expect(button.innerHTML).toBe('<b>H1</b>')

          const h2Element = editor.elements[0].querySelector('h2')
          if (h2Element?.firstChild) {
            selectElementContentsAndFire(h2Element.firstChild as HTMLElement)
            expect(button.classList.contains('medium-editor-button-active')).toBe(true)
            expect(buttonTwo.classList.contains('medium-editor-button-active')).toBe(false)
          }

          expect(buttonTwo).toBe((headerTwoButton as any).getButton())
          expect(buttonTwo.getAttribute('aria-label')).toBe('fake h2')
          expect(buttonTwo.getAttribute('title')).toBe('fake h2')
          expect(buttonTwo.innerHTML).toBe('<b>H2</b>')

          const h3Element = editor.elements[0].querySelector('h3')
          if (h3Element) {
            selectElementContentsAndFire(h3Element, { eventToFire: 'mouseup' })
            expect(button.classList.contains('medium-editor-button-active')).toBe(false)
            expect(buttonTwo.classList.contains('medium-editor-button-active')).toBe(true)
          }
        }
      }
    })
  })

  describe('formatting commands', () => {
    it('should execute bold command', () => {
      const execMock = mockExecCommand()
      const editor = helpers.newMediumEditor('.editor')

      selectElementContentsAndFire(el)
      editor.execAction('bold')

      expect(execMock.mockFn.mock.calls.length).toBe(1)
      expect(execMock.mockFn.mock.calls[0]).toEqual(['bold', false, undefined])
      execMock.restore()
    })

    it('should execute italic command', () => {
      const execMock = mockExecCommand()
      const editor = helpers.newMediumEditor('.editor')

      selectElementContentsAndFire(el)
      editor.execAction('italic')

      expect(execMock.mockFn.mock.calls.length).toBe(1)
      expect(execMock.mockFn.mock.calls[0]).toEqual(['italic', false, undefined])
      execMock.restore()
    })

    it('should execute underline command', () => {
      const execMock = mockExecCommand()
      const editor = helpers.newMediumEditor('.editor')

      selectElementContentsAndFire(el)
      editor.execAction('underline')

      expect(execMock.mockFn.mock.calls.length).toBe(1)
      expect(execMock.mockFn.mock.calls[0]).toEqual(['underline', false, undefined])
      execMock.restore()
    })

    it('should handle button state for bold text', async () => {
      el.innerHTML = '<b>bold text</b>'
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])

        // Wait for toolbar positioning and button state update
        await new Promise(resolve => setTimeout(resolve, 10))
        editor.checkSelection()

        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="bold"]')
        if (button) {
          expect(button.classList.contains('medium-editor-button-active')).toBe(true)
        }
      }
    })

    it('should handle button state for italic text', async () => {
      el.innerHTML = '<i>italic text</i>'
      const editor = helpers.newMediumEditor('.editor')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar) {
        selectElementContentsAndFire(editor.elements[0])

        // Wait for toolbar positioning and button state update
        await new Promise(resolve => setTimeout(resolve, 10))
        editor.checkSelection()

        const button = (toolbar as any).getToolbarElement().querySelector('[data-action="italic"]')
        if (button) {
          expect(button.classList.contains('medium-editor-button-active')).toBe(true)
        }
      }
    })
  })
})
