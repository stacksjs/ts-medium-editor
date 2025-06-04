import { beforeEach, describe, expect, it } from 'bun:test'
import { MediumEditor } from '../src'

describe('Editor State Methods', () => {
  let editor: MediumEditor
  let el: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('div')
    el.className = 'editable'
    el.innerHTML = '<p>Some initial content</p>'
    document.body.appendChild(el)
  })

  describe('isActive', () => {
    it('should return true by default', () => {
      editor = new MediumEditor('.editable')
      expect(editor.isActive()).toBe(true)
    })

    it('should return false after deactivation', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate()
      expect(editor.isActive()).toBe(false)
    })

    it('should return true after reactivation', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate()
      editor.activate()
      expect(editor.isActive()).toBe(true)
    })
  })

  describe('activate', () => {
    it('should set contentEditable to true on all elements', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate() // First deactivate
      editor.activate()

      editor.elements.forEach((element) => {
        expect(element.getAttribute('contentEditable')).toBe('true')
        expect(element.hasAttribute('disabled')).toBe(false)
      })
    })

    it('should trigger activate event', () => {
      editor = new MediumEditor('.editable')
      let eventTriggered = false

      editor.subscribe('activate', () => {
        eventTriggered = true
      })

      editor.deactivate()
      editor.activate()

      expect(eventTriggered).toBe(true)
    })

    it('should return the editor instance for chaining', () => {
      editor = new MediumEditor('.editable')
      const result = editor.activate()
      expect(result).toBe(editor)
    })

    it('should work with multiple elements', () => {
      const el2 = document.createElement('div')
      el2.className = 'editable'
      el2.innerHTML = '<p>Second element</p>'
      document.body.appendChild(el2)

      editor = new MediumEditor('.editable')
      editor.deactivate()
      editor.activate()

      editor.elements.forEach((element) => {
        expect(element.getAttribute('contentEditable')).toBe('true')
        expect(element.hasAttribute('disabled')).toBe(false)
      })
    })
  })

  describe('deactivate', () => {
    it('should set contentEditable to false on all elements', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate()

      editor.elements.forEach((element) => {
        expect(element.getAttribute('contentEditable')).toBe('false')
        expect(element.getAttribute('disabled')).toBe('true')
      })
    })

    it('should trigger deactivate event', () => {
      editor = new MediumEditor('.editable')
      let eventTriggered = false

      editor.subscribe('deactivate', () => {
        eventTriggered = true
      })

      editor.deactivate()

      expect(eventTriggered).toBe(true)
    })

    it('should return the editor instance for chaining', () => {
      editor = new MediumEditor('.editable')
      const result = editor.deactivate()
      expect(result).toBe(editor)
    })

    it('should work with multiple elements', () => {
      const el2 = document.createElement('div')
      el2.className = 'editable'
      el2.innerHTML = '<p>Second element</p>'
      document.body.appendChild(el2)

      editor = new MediumEditor('.editable')
      editor.deactivate()

      editor.elements.forEach((element) => {
        expect(element.getAttribute('contentEditable')).toBe('false')
        expect(element.getAttribute('disabled')).toBe('true')
      })
    })

    it('should prevent editing when deactivated', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate()

      // Try to set content - should still work programmatically
      editor.setContent('<p>New content</p>')
      expect(editor.getContent()).toBe('<p>New content</p>')

      // But the element should not be editable
      expect(el.getAttribute('contentEditable')).toBe('false')
    })
  })

  describe('state transitions', () => {
    it('should handle multiple activate/deactivate cycles', () => {
      editor = new MediumEditor('.editable')

      // Initial state
      expect(editor.isActive()).toBe(true)

      // Deactivate
      editor.deactivate()
      expect(editor.isActive()).toBe(false)
      expect(el.getAttribute('contentEditable')).toBe('false')

      // Activate
      editor.activate()
      expect(editor.isActive()).toBe(true)
      expect(el.getAttribute('contentEditable')).toBe('true')

      // Deactivate again
      editor.deactivate()
      expect(editor.isActive()).toBe(false)
      expect(el.getAttribute('contentEditable')).toBe('false')
    })

    it('should maintain state after destroy and recreate', () => {
      editor = new MediumEditor('.editable')
      editor.deactivate()
      editor.destroy()

      // Create new editor
      editor = new MediumEditor('.editable')
      expect(editor.isActive()).toBe(true) // New editor should be active by default
    })
  })

  describe('integration with other features', () => {
    it('should work with toolbar', () => {
      editor = new MediumEditor('.editable', {
        toolbar: {
          buttons: ['bold', 'italic'],
        },
      })

      const toolbar = editor.getExtensionByName('toolbar')
      expect(toolbar).toBeDefined()

      editor.deactivate()
      expect(editor.isActive()).toBe(false)

      editor.activate()
      expect(editor.isActive()).toBe(true)
    })

    it('should work with placeholder', () => {
      editor = new MediumEditor('.editable', {
        placeholder: {
          text: 'Type here...',
        },
      })

      const placeholder = editor.getExtensionByName('placeholder')
      expect(placeholder).toBeDefined()

      editor.deactivate()
      expect(editor.isActive()).toBe(false)

      editor.activate()
      expect(editor.isActive()).toBe(true)
    })
  })
})
