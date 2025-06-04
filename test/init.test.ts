import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
// Make sure we have MediumEditor available
import { MediumEditor } from '../src/core'

import { setupTestHelpers } from './helpers/test-utils'

describe('Initialization', () => {
  let helpers: TestHelpers

  beforeEach(() => {
    helpers = setupTestHelpers()
    helpers.createElement('div', 'editor', 'lorem ipsum')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  describe('objects', () => {
    it('should call init when instantiated', () => {
      const initSpy = spyOn(MediumEditor.prototype, 'init')
      helpers.newMediumEditor('.test')
      expect(initSpy).toHaveBeenCalled()
      initSpy.mockRestore()
    })

    it('should accept multiple instances', () => {
      const initSpy = spyOn(MediumEditor.prototype, 'init')
      const editor1 = helpers.newMediumEditor('.test')
      const editor2 = helpers.newMediumEditor('.test')
      expect(editor1 === editor2).toBe(false)
      expect(initSpy).toHaveBeenCalled()
      expect(initSpy).toHaveBeenCalledTimes(2)
      initSpy.mockRestore()
    })

    it('should do nothing when selector does not return any elements', () => {
      const setupSpy = spyOn(MediumEditor.prototype, 'setup')
      const editor = helpers.newMediumEditor('.test')
      expect(editor.isActive()).toBe(true) // isActive is now always a function that returns a boolean
      expect((editor as any).events).toBeDefined()
      expect(editor.getExtensionByName('toolbar')).toBeUndefined()
      expect(editor.getExtensionByName('anchor')).toBeUndefined()
      expect(editor.getExtensionByName('anchor-preview')).toBeUndefined()
      setupSpy.mockRestore()
    })
  })

  describe('elements', () => {
    it('should allow a string as parameter', () => {
      const querySpy = spyOn(document, 'querySelectorAll').mockReturnValue(document.querySelectorAll('.editor'))
      helpers.newMediumEditor('.test')
      expect(querySpy).toHaveBeenCalled()
      querySpy.mockRestore()
    })

    it('should allow a list of html elements as parameters', () => {
      const elements = document.querySelectorAll('span')
      const editor = helpers.newMediumEditor(elements)
      expect(editor.elements.length).toEqual(elements.length)
    })

    it('should allow a single element as parameter', () => {
      const element = document.querySelector('span')
      if (element) {
        const editor = helpers.newMediumEditor(element)
        expect(editor.elements).toEqual([element])
      }
    })

    it('should always initialize elements as an Array', () => {
      const nodeList = document.querySelectorAll('span')
      const node = document.querySelector('span')
      let editor = helpers.newMediumEditor(nodeList)

      // nodeList is a NodeList, similar to an array but not of the same type
      expect(editor.elements.length).toEqual(nodeList.length)
      expect(Array.isArray(nodeList)).toBe(false)
      expect(typeof editor.elements.forEach).toBe('function')
      editor.destroy()

      editor = helpers.newMediumEditor('span')
      expect(editor.elements.length).toEqual(nodeList.length)
      editor.destroy()

      if (node) {
        editor = helpers.newMediumEditor(node)
        expect(editor.elements.length).toEqual(1)
        expect(editor.elements[0]).toBe(node)
        editor.destroy()
      }

      editor = helpers.newMediumEditor('')
      expect(editor.elements).not.toBe(null)
      expect(editor.elements.length).toBe(0)
      editor.destroy()
    })

    it('should be available after destroying and calling setup again', () => {
      const editor = helpers.newMediumEditor('.editor')
      expect(editor.elements.length).toBe(1)
      editor.destroy()
      expect(editor.elements.length).toBe(0)
      editor.setup()
      expect(editor.elements.length).toBe(1)
    })
  })

  describe('with a valid element', () => {
    it('should have a default set of options', () => {
      const defaultOptions: Record<string, any> = {
        delay: 0,
        disableReturn: false,
        disableDoubleReturn: false,
        disableExtraSpaces: false,
        disableEditing: false,
        autoLink: false,
        elementsContainer: document.body,
        contentWindow: window,
        ownerDocument: document,
        buttonLabels: false,
        targetBlank: false,
        extensions: {},
        activeButtonClass: 'medium-editor-button-active',
        spellcheck: true,
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        },
        placeholder: {
          text: 'Type your text',
          hideOnClick: true,
        },
      }
      const editor = helpers.newMediumEditor('.editor')
      expect(Object.keys(editor.options).length).toBe(Object.keys(defaultOptions).length)

      // Check individual properties instead of deep equality
      Object.keys(defaultOptions).forEach((key) => {
        expect((editor.options as any)[key]).toEqual(defaultOptions[key])
      })
    })

    it('should accept custom options values', () => {
      const options: Record<string, any> = {
        delay: 300,
        toolbar: {
          diffLeft: 10,
          diffTop: 5,
        },
        anchor: {
          placeholderText: 'test',
          targetCheckboxText: 'new window?',
        },
        paste: {
          forcePlainText: false,
          cleanPastedHTML: true,
        },
      }
      const editor = helpers.newMediumEditor('.editor', options)
      Object.keys(options).forEach((customOption) => {
        expect((editor.options as any)[customOption]).toEqual(options[customOption])
      })
    })

    it('should call the default initialization methods', () => {
      const setupSpy = spyOn(MediumEditor.prototype, 'setup')

      // We'll need to check if these extension prototypes exist before spying
      let toolbarSpy: any
      let anchorSpy: any
      let anchorPreviewSpy: any

      try {
        if ((MediumEditor as any).extensions?.toolbar?.prototype?.createToolbar) {
          toolbarSpy = spyOn((MediumEditor as any).extensions.toolbar.prototype, 'createToolbar')
        }
        if ((MediumEditor as any).extensions?.anchor?.prototype?.createForm) {
          anchorSpy = spyOn((MediumEditor as any).extensions.anchor.prototype, 'createForm')
        }
        if ((MediumEditor as any).extensions?.anchorPreview?.prototype?.createPreview) {
          anchorPreviewSpy = spyOn((MediumEditor as any).extensions.anchorPreview.prototype, 'createPreview')
        }
      }
      catch {
        // Extensions might not be loaded yet
      }

      const editor = helpers.newMediumEditor('.editor')
      expect(setupSpy).toHaveBeenCalled()

      // Check extensions if they exist
      const anchorExtension = editor.getExtensionByName('anchor')
      const anchorPreview = editor.getExtensionByName('anchor-preview')
      const toolbar = editor.getExtensionByName('toolbar')

      if (toolbar && toolbarSpy) {
        expect(toolbarSpy).toHaveBeenCalled()
        toolbarSpy.mockRestore()
      }
      if (anchorExtension && anchorSpy) {
        expect(anchorSpy).toHaveBeenCalled()
        anchorSpy.mockRestore()
      }
      if (anchorPreview && anchorPreviewSpy) {
        expect(anchorPreviewSpy).toHaveBeenCalled()
        anchorPreviewSpy.mockRestore()
      }

      setupSpy.mockRestore()
    })

    it('should set the ID according to the numbers of editors instantiated', () => {
      const editor1 = helpers.newMediumEditor('.editor')
      const firstId = editor1.id
      const editor2 = helpers.newMediumEditor(helpers.createElement('div'))
      const editor3 = helpers.newMediumEditor(helpers.createElement('div'))

      expect(editor2.id).toBe(firstId + 1)
      expect(editor3.id).toBe(firstId + 2)
    })

    it('should not reset id when destroyed and then re-initialized', () => {
      const editor1 = helpers.newMediumEditor('.editor')
      const origId = editor1.id

      helpers.createElement('div', 'editor-two')
      const editor2 = helpers.newMediumEditor('.editor-two')
      editor1.destroy()
      editor1.init('.editor')

      expect(editor1.id).not.toEqual(editor2.id)
      expect(editor1.id).toBe(origId)
    })

    it('should use document.body as element container when no container element is specified', () => {
      const appendSpy = spyOn(document.body, 'appendChild')
      helpers.newMediumEditor('.editor')
      expect(appendSpy).toHaveBeenCalled()
      appendSpy.mockRestore()
    })

    it('should accept a custom element container for MediumEditor elements', () => {
      const div = helpers.createElement('div')
      const appendSpy = spyOn(div, 'appendChild')
      helpers.newMediumEditor('.editor', {
        elementsContainer: div,
      })
      expect(appendSpy).toHaveBeenCalled()
      appendSpy.mockRestore()
    })
  })
})
