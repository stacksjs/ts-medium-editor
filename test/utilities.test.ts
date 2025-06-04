import { describe, expect, it } from 'bun:test'
import { util } from '../src/util'

describe('Utility Functions', () => {
  describe('extend', () => {
    it('should merge objects properly', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { b: 3, c: 4 }
      const obj3 = { d: 5 }

      const result = util.extend(obj1, obj2, obj3)

      expect(result.a).toBe(1)
      expect(result.b).toBe(3) // obj2 should overwrite obj1
      expect(result.c).toBe(4)
      expect(result.d).toBe(5)
    })

    it('should handle empty objects', () => {
      const result = util.extend({}, { a: 1 })
      expect(result.a).toBe(1)
    })
  })

  describe('defaults', () => {
    it('should provide default values without overwriting existing ones', () => {
      const target = { a: 1, b: undefined }
      const defaults = { a: 999, b: 2, c: 3 }

      const result = util.defaults(target, defaults)

      expect(result.a).toBe(1) // Should not overwrite existing value
      expect(result.b).toBe(2) // Should set undefined values
      expect(result.c).toBe(3) // Should add new properties
    })
  })

  describe('htmlEntities', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("test")</script>'
      const expected = '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;'

      expect(util.htmlEntities(input)).toBe(expected)
    })

    it('should handle ampersands', () => {
      expect(util.htmlEntities('Tom & Jerry')).toBe('Tom &amp; Jerry')
    })
  })

  describe('guid', () => {
    it('should generate unique identifiers', () => {
      const id1 = util.guid()
      const id2 = util.guid()

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })

    it('should generate IDs in expected format', () => {
      const id = util.guid()
      // Should be in format like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      expect(id).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)
    })
  })

  describe('warn', () => {
    it('should not throw when called', () => {
      expect(() => {
        util.warn('Test warning message')
      }).not.toThrow()
    })
  })

  describe('ensureUrlHasProtocol', () => {
    it('should add http protocol to URLs without protocol', () => {
      expect(util.ensureUrlHasProtocol('example.com')).toBe('http://example.com')
      expect(util.ensureUrlHasProtocol('www.example.com')).toBe('http://www.example.com')
    })

    it('should not modify URLs that already have a protocol', () => {
      expect(util.ensureUrlHasProtocol('https://example.com')).toBe('https://example.com')
      expect(util.ensureUrlHasProtocol('http://example.com')).toBe('http://example.com')
      expect(util.ensureUrlHasProtocol('ftp://example.com')).toBe('ftp://example.com')
    })

    it('should handle mailto and tel links', () => {
      expect(util.ensureUrlHasProtocol('mailto:test@example.com')).toBe('mailto:test@example.com')
      expect(util.ensureUrlHasProtocol('tel:+1234567890')).toBe('tel:+1234567890')
    })
  })

  describe('throttle', () => {
    it('should create a throttled function', () => {
      let callCount = 0
      const originalFn = () => {
        callCount++
      }

      const throttledFn = util.throttle(originalFn, 100)

      // Call multiple times rapidly
      throttledFn()
      throttledFn()
      throttledFn()

      // Should only execute once immediately
      expect(callCount).toBe(1)
    })
  })

  describe('isBlockContainer', () => {
    it('should identify block container elements', () => {
      // Create test elements
      const pElement = document.createElement('p')
      const divElement = document.createElement('div')
      const spanElement = document.createElement('span')
      const h1Element = document.createElement('h1')

      expect(util.isBlockContainer(pElement)).toBe(true)
      expect(util.isBlockContainer(divElement)).toBe(false) // div is not in the blockContainerElementNames list
      expect(util.isBlockContainer(spanElement)).toBe(false)
      expect(util.isBlockContainer(h1Element)).toBe(true)
    })
  })

  describe('deprecation helpers', () => {
    it('should handle deprecated method calls', () => {
      expect(() => {
        util.deprecated('oldMethod', 'newMethod', '2.0.0')
      }).not.toThrow()

      expect(() => {
        const result = util.deprecatedMethod('oldMethod', 'newMethod', [], '2.0.0')
        expect(result).toBeUndefined()
      }).not.toThrow()
    })
  })

  describe('DOM utilities', () => {
    it('should check if object is an element', () => {
      const element = document.createElement('div')
      const textNode = document.createTextNode('text')
      const notAnElement = { nodeType: 3 }

      expect(util.isElement(element)).toBe(true)
      expect(util.isElement(textNode)).toBe(false)
      expect(util.isElement(notAnElement)).toBe(false)
      expect(util.isElement(null)).toBe(false)
    })
  })
})
