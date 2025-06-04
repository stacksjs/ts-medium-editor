import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { setupTestHelpers } from './helpers/test-utils'

// Import our library for testing
import '../src/index'

describe('MediumEditor Basic Functionality', () => {
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
      expect((editor.options.toolbar as any)?.buttons).toEqual(['bold', 'italic'])
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
      expect(serialized['element-0']).toBeDefined()
    })

    it('should reset content', () => {
      const editor = helpers.newMediumEditor('.editor')
      const originalContent = el.innerHTML

      editor.setContent('temporary content')
      expect(el.innerHTML).toBe('temporary content')

      editor.resetContent()
      expect(el.innerHTML).toBe(originalContent)
    })
  })

  describe('Element Management', () => {
    it('should add elements dynamically', () => {
      const editor = helpers.newMediumEditor('.editor')
      const newEl = helpers.createElement('div', 'new-editor', 'new content', true)

      expect(editor.elements.length).toBe(1)
      editor.addElements(newEl)
      expect(editor.elements.length).toBe(2)
    })

    it('should remove elements', () => {
      // Create a second element first
      const secondEl = helpers.createElement('div', 'editor', 'second element')
      const editor = helpers.newMediumEditor('.editor')

      expect(editor.elements.length).toBe(2)
      editor.removeElements(secondEl)
      expect(editor.elements.length).toBe(1)
    })
  })

  describe('Extension System', () => {
    it('should support extensions', () => {
      let extensionInitialized = false

      const TestExtension = {
        name: 'testExtension',
        init() {
          extensionInitialized = true
        },
      }

      const editor = helpers.newMediumEditor('.editor', {
        extensions: {
          testExtension: TestExtension,
        },
      })

      const extension = editor.getExtensionByName('testExtension')
      expect(extension).toBeDefined()
      expect(extensionInitialized).toBe(true)
    })
  })

  describe('Destroy and Cleanup', () => {
    it('should cleanup when destroyed', () => {
      const editor = helpers.newMediumEditor('.editor')

      expect(editor.elements.length).toBeGreaterThan(0)
      editor.destroy()

      // After destruction, the editor should be cleaned up
      expect(editor.getContent()).toBeNull()
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
  })

  describe('Configuration', () => {
    it('should handle toolbar configuration', () => {
      const editor = helpers.newMediumEditor('.editor', {
        toolbar: {
          buttons: ['bold', 'italic', 'underline'],
          diffLeft: 25,
          diffTop: -10,
        },
      })

      expect((editor.options.toolbar as any)?.buttons).toEqual(['bold', 'italic', 'underline'])
      expect((editor.options.toolbar as any)?.diffLeft).toBe(25)
      expect((editor.options.toolbar as any)?.diffTop).toBe(-10)
    })

    it('should handle anchor configuration', () => {
      const editor = helpers.newMediumEditor('.editor', {
        anchor: {
          linkValidation: true,
          placeholderText: 'Paste or type a link',
        },
      })

      expect((editor.options.anchor as any)?.linkValidation).toBe(true)
      expect((editor.options.anchor as any)?.placeholderText).toBe('Paste or type a link')
    })
  })
})
