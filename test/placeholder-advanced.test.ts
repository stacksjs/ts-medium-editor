import { beforeEach, describe, expect, it } from 'bun:test'
import { MediumEditor } from '../src'

describe('Placeholder Advanced Features', () => {
  let editor: MediumEditor
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('div')
    el.className = 'editable'
    el.innerHTML = ''
    document.body.appendChild(el)
  })

  describe('hideOnFocus option', () => {
    it('should hide placeholder when hideOnFocus is true and editor gains focus', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: true,
          hideOnClick: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder).toBeDefined()
      expect(placeholder.hideOnFocus).toBe(true)

      // Initially, placeholder should be visible (element is empty)
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event
      placeholder.handleFocus({}, el)

      // Placeholder should be hidden
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)
    })

    it('should show placeholder when hideOnFocus is true and editor loses focus', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: true,
          hideOnClick: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any

      // Hide placeholder first (simulate focus)
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)

      // Simulate blur event
      placeholder.handleBlur({}, el)

      // Placeholder should be visible again (element is still empty)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)
    })

    it('should not hide placeholder on focus when hideOnFocus is false', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: false,
          hideOnClick: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnFocus).toBe(false)

      // Initially, placeholder should be visible
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event
      placeholder.handleFocus({}, el)

      // Placeholder should still be visible since hideOnFocus is false
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)
    })

    it('should work with both hideOnFocus and hideOnClick enabled', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: true,
          hideOnClick: true,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnFocus).toBe(true)
      expect(placeholder.hideOnClick).toBe(true)

      // Initially, placeholder should be visible
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event (should hide due to hideOnFocus)
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)
    })

    it('should respect hideOnFocus in handleInput method', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: true,
          hideOnClick: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any

      // Mock getFocusedElement to return our element
      editor.getFocusedElement = () => el

      // Simulate input event while element has focus
      placeholder.handleInput({}, el)

      // Placeholder should not be shown because element has focus and hideOnFocus is true
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)
    })

    it('should show placeholder in handleInput when element does not have focus', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnFocus: true,
          hideOnClick: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any

      // Mock getFocusedElement to return null (no focus)
      editor.getFocusedElement = () => null

      // Simulate input event while element does not have focus
      placeholder.handleInput({}, el)

      // Placeholder should be shown because element doesn't have focus
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)
    })
  })

  describe('hideOnClick vs hideOnFocus behavior', () => {
    it('should only hide on click when hideOnClick is true and hideOnFocus is false', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnClick: true,
          hideOnFocus: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnClick).toBe(true)
      expect(placeholder.hideOnFocus).toBe(false)

      // Initially, placeholder should be visible
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event (should not hide since hideOnFocus is false)
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)
    })

    it('should hide on both click and focus when both options are true', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnClick: true,
          hideOnFocus: true,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnClick).toBe(true)
      expect(placeholder.hideOnFocus).toBe(true)

      // Initially, placeholder should be visible
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event (should hide since hideOnFocus is true)
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)
    })

    it('should not hide on either click or focus when both options are false', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnClick: false,
          hideOnFocus: false,
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnClick).toBe(false)
      expect(placeholder.hideOnFocus).toBe(false)

      // Initially, placeholder should be visible
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Simulate focus event (should not hide since hideOnFocus is false)
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)
    })
  })

  describe('default behavior', () => {
    it('should default hideOnFocus to false when hideOnClick is also false', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnClick: false,
          // hideOnFocus not specified, should default to false
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnFocus).toBe(false)
    })

    it('should maintain backward compatibility with existing hideOnClick behavior', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
          hideOnClick: true,
          // hideOnFocus not specified, should inherit from hideOnClick
        },
      })

      const placeholder = editor.getExtensionByName('placeholder') as any
      expect(placeholder.hideOnClick).toBe(true)
      expect(placeholder.hideOnFocus).toBe(true) // Should inherit from hideOnClick for backward compatibility

      // Should behave the same as before - hideOnClick implies hideOnFocus
      placeholder.updatePlaceholder(el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(true)

      // Focus should hide placeholder because hideOnFocus inherited from hideOnClick
      placeholder.handleFocus({}, el)
      expect(el.classList.contains('medium-editor-placeholder')).toBe(false)
    })
  })
})
