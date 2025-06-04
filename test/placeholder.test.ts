import type { TestHelpers } from './helpers/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { MediumEditor } from '../src/core'
import { fireEvent, selectElementContentsAndFire, setupTestHelpers } from './helpers/test-utils'

describe('Placeholder Extension', () => {
  let helpers: TestHelpers
  let el: HTMLElement

  beforeEach(() => {
    helpers = setupTestHelpers()
    el = helpers.createElement('div', 'editor', '')
  })

  afterEach(() => {
    helpers.cleanupTest()
  })

  it('should set placeholder for empty elements', () => {
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).toContain('medium-editor-placeholder')
  })

  it('should not set a placeholder for elements with text content', () => {
    el.innerHTML = 'some text'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).not.toContain('medium-editor-placeholder')
  })

  it('should not set a placeholder for elements with images only', () => {
    el.innerHTML = '<img src="../demo/img/roman.jpg">'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).not.toContain('medium-editor-placeholder')
  })

  it('should not set a placeholder for elements with unorderedlist', () => {
    el.innerHTML = '<ul><li></li></ul>'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).not.toContain('medium-editor-placeholder')
  })

  it('should not set a placeholder for elements with orderedlist', () => {
    el.innerHTML = '<ol><li></li></ol>'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).not.toContain('medium-editor-placeholder')
  })

  it('should not set a placeholder for elements with table', () => {
    el.innerHTML = '<table></table>'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).not.toContain('medium-editor-placeholder')
  })

  it('should set placeholder for elements with empty children', () => {
    el.innerHTML = '<p><br></p><div class="empty"></div>'
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements[0]?.className).toContain('medium-editor-placeholder')
  })

  it('should remove the placeholder on focus', () => {
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement) {
      expect(firstElement.className).toContain('medium-editor-placeholder')
      selectElementContentsAndFire(firstElement)
      expect(firstElement.className).not.toContain('medium-editor-placeholder')
    }
  })

  it('should remove the placeholder on click', () => {
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement) {
      expect(firstElement.className).toContain('medium-editor-placeholder')
      fireEvent(firstElement, 'click')
      expect(firstElement.className).not.toContain('medium-editor-placeholder')

      fireEvent(document.body, 'mousedown')
      fireEvent(document.body, 'mouseup')
      fireEvent(document.body, 'click')
      expect(firstElement.className).toContain('medium-editor-placeholder')

      el.innerHTML = '<p>lorem</p><p id="target">ipsum</p><p>dolor</p>'
      const targetElement = document.getElementById('target')
      if (targetElement) {
        fireEvent(targetElement, 'click')
        expect(firstElement.className).not.toContain('medium-editor-placeholder')
      }
    }
  })

  it('should remove the placeholder on input, and NOT on click', () => {
    const editor = helpers.newMediumEditor('.editor', { placeholder: { hideOnClick: false } })
    const firstElement = editor.elements[0]
    if (firstElement) {
      expect(firstElement.className).toContain('medium-editor-placeholder')
      fireEvent(firstElement, 'click')
      expect(firstElement.className).toContain('medium-editor-placeholder')

      fireEvent(document.body, 'mousedown')
      fireEvent(document.body, 'mouseup')
      fireEvent(document.body, 'click')
      expect(firstElement.className).toContain('medium-editor-placeholder')

      el.innerHTML = '<p>lorem</p><p id="target">ipsum</p><p>dolor</p>'
      editor.trigger('editableInput', {}, firstElement)
      expect(firstElement.className).not.toContain('medium-editor-placeholder')

      el.innerHTML = ''
      editor.trigger('editableInput', {}, firstElement)
      expect(firstElement.className).toContain('medium-editor-placeholder')
    }
  })

  it('should add a placeholder to empty elements on blur', () => {
    el.innerHTML = 'some text'
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement) {
      firstElement.focus()
      fireEvent(firstElement, 'focus')
      expect(firstElement.className).not.toContain('medium-editor-placeholder')

      firstElement.innerHTML = ''
      fireEvent(document.body, 'mousedown')
      fireEvent(document.body, 'mouseup')
      fireEvent(document.body, 'click')
      expect(firstElement.className).toContain('medium-editor-placeholder')
    }
  })

  it('should not add a placeholder to elements with text on blur', () => {
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement) {
      expect(firstElement.className).toContain('medium-editor-placeholder')
      firstElement.innerHTML = 'some text'

      const firstChild = el.firstChild
      if (firstChild) {
        editor.selectElement(firstChild as HTMLElement)
        fireEvent(document.body, 'mousedown')
        fireEvent(document.body, 'mouseup')
        fireEvent(document.body, 'click')
        expect(firstElement.className).not.toContain('medium-editor-placeholder')
      }
    }
  })

  // https://github.com/yabwe/medium-editor/issues/768
  it('should remove the placeholder when the content is updated manually', () => {
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement) {
      expect(firstElement.className).toContain('medium-editor-placeholder')
      editor.setContent('<p>lorem ipsum</p>')
      expect(firstElement.className).not.toContain('medium-editor-placeholder')
    }
  })

  function validatePlaceholderContent(element: HTMLElement, expectedValue: string): void {
    const placeholder = window.getComputedStyle(element, ':after').getPropertyValue('content')
    const regex = /^attr\(([^)]+)\)$/g
    const match = regex.exec(placeholder)
    if (match) {
      // In firefox, getComputedStyle().getPropertyValue('content') can return attr() instead of what attr() evaluates to
      expect(match[1]).toBe('data-placeholder')
    }
    // When these tests run in firefox in saucelabs, for some reason the content property of the
    // placeholder is 'none'. Just skip the assertion in this case
    else if (placeholder !== 'none') {
      expect(placeholder).toMatch(new RegExp(`^['"]${expectedValue}['"]$`))
    }
  }

  it('should add the default placeholder text when data-placeholder is not present', () => {
    const editor = helpers.newMediumEditor('.editor')
    const firstElement = editor.elements[0]
    if (firstElement && (MediumEditor as any).extensions?.placeholder?.prototype?.text) {
      validatePlaceholderContent(firstElement, (MediumEditor as any).extensions.placeholder.prototype.text)
    }
  })

  it('should add the default placeholder text when data-placeholder is not present on dynamically added elements', () => {
    const editor = helpers.newMediumEditor('.editor')
    expect(editor.elements.length).toBe(1)

    const newEl = helpers.createElement('div', 'other-element')
    if (typeof editor.addElements === 'function') {
      editor.addElements(newEl)
      if ((MediumEditor as any).extensions?.placeholder?.prototype?.text) {
        validatePlaceholderContent(newEl, (MediumEditor as any).extensions.placeholder.prototype.text)
      }
    }
  })

  it('should remove the added data-placeholder attribute when destroyed', () => {
    expect(el.hasAttribute('data-placeholder')).toBe(false)

    const editor = helpers.newMediumEditor('.editor')
    if ((MediumEditor as any).extensions?.placeholder?.prototype?.text) {
      expect(el.getAttribute('data-placeholder')).toBe((MediumEditor as any).extensions.placeholder.prototype.text)
    }

    editor.destroy()
    expect(el.hasAttribute('data-placeholder')).toBe(false)
  })

  it('should not remove custom data-placeholder attribute when destroyed', () => {
    const placeholderText = 'Custom placeholder'
    el.setAttribute('data-placeholder', placeholderText)

    const editor = helpers.newMediumEditor('.editor')
    expect(el.getAttribute('data-placeholder')).toBe(placeholderText)

    editor.destroy()
    expect(el.getAttribute('data-placeholder')).toBe(placeholderText)
  })
})
