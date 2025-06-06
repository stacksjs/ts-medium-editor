import type { MediumEditor, MediumEditorExtension } from '../types'

const KNOWN_TLDS = 'com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|' +
  'xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|' +
  'bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|' +
  'fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|' +
  'is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|' +
  'mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|' +
  'pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|' +
  'tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw'

// Simplified URL regex for basic auto-linking
const URL_REGEX = new RegExp(
  `(https?://[^\\s]+)|` + // http/https URLs
  `(www\\.[a-z0-9.-]+\\.[a-z]{2,}[^\\s]*)|` + // www URLs
  `([a-z0-9.-]+\\.(${KNOWN_TLDS})(?:[^\\s]*))`, // domain.tld URLs
  'gi'
)

export class AutoLink implements MediumEditorExtension {
  name = 'autoLink'

  private editor: MediumEditor
  private disableEventHandling = false
  private performLinkingTimeout?: number

  constructor(editor: MediumEditor) {
    this.editor = editor
  }

  init(): void {
    this.disableEventHandling = false
    this.editor.subscribe('editableKeypress', this.onKeypress.bind(this))
    this.editor.subscribe('editableBlur', this.onBlur.bind(this))

    // Disable browser's auto URL detection
    try {
      document.execCommand('AutoUrlDetect', false, 'false')
    } catch (e) {
      // Ignore errors in environments where execCommand is not supported
    }
  }

  destroy(): void {
    if (this.performLinkingTimeout) {
      clearTimeout(this.performLinkingTimeout)
    }

    // Re-enable browser's auto URL detection
    try {
      document.execCommand('AutoUrlDetect', false, 'true')
    } catch (e) {
      // Ignore errors
    }
  }

  private onBlur(_event: Event, editable?: HTMLElement): void {
    if (editable) {
      this.performLinking(editable)
    }
  }

  private onKeypress(event: KeyboardEvent): void {
    if (this.disableEventHandling) {
      return
    }

    if (event.key === ' ' || event.key === 'Enter') {
      if (this.performLinkingTimeout) {
        clearTimeout(this.performLinkingTimeout)
      }

      this.performLinkingTimeout = window.setTimeout(() => {
        try {
          const target = event.target as HTMLElement
          if (target && this.performLinking(target)) {
            // Trigger input event
            if (this.editor.trigger) {
              this.editor.trigger('editableInput', {}, target)
            }
          }
        } catch (e) {
          console.error('Failed to perform auto-linking', e)
          this.disableEventHandling = true
        }
      }, 0)
    }
  }

  private performLinking(element: HTMLElement): boolean {
    let documentModified = false

    // Get all text nodes in the element
    const textNodes = this.getTextNodes(element)

    for (const textNode of textNodes) {
      if (this.isInsideLink(textNode)) {
        continue // Skip text nodes that are already inside links
      }

      const text = textNode.textContent || ''
      const matches = this.findURLs(text)

      if (matches.length > 0) {
        this.createLinksInTextNode(textNode, matches)
        documentModified = true
      }
    }

    return documentModified
  }

  private getTextNodes(element: HTMLElement): Text[] {
    const textNodes: Text[] = []
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node: Node | null = walker.nextNode()
    while (node) {
      textNodes.push(node as Text)
      node = walker.nextNode()
    }

    return textNodes
  }

  private isInsideLink(node: Node): boolean {
    let current: Node | null = node
    while (current && current !== document.body) {
      if (current.nodeType === Node.ELEMENT_NODE &&
          (current as HTMLElement).tagName.toLowerCase() === 'a') {
        return true
      }
      current = current.parentNode
    }
    return false
  }

  private findURLs(text: string): Array<{ url: string; start: number; end: number }> {
    const matches: Array<{ url: string; start: number; end: number }> = []
    let match: RegExpExecArray | null

    URL_REGEX.lastIndex = 0 // Reset regex state

    while ((match = URL_REGEX.exec(text)) !== null) {
      let url = match[0]

      // Add protocol if missing
      if (!url.match(/^https?:\/\//)) {
        url = 'http://' + url
      }

      matches.push({
        url,
        start: match.index,
        end: match.index + match[0].length
      })
    }

    return matches
  }

  private createLinksInTextNode(textNode: Text, matches: Array<{ url: string; start: number; end: number }>): void {
    const text = textNode.textContent || ''
    const parent = textNode.parentNode

    if (!parent) return

    // Process matches in reverse order to maintain correct indices
    const sortedMatches = matches.sort((a, b) => b.start - a.start)

    let currentNode = textNode

    for (const match of sortedMatches) {
      const beforeText = text.substring(0, match.start)
      const linkText = text.substring(match.start, match.end)
      const afterText = text.substring(match.end)

      // Create link element
      const link = document.createElement('a')
      link.href = match.url
      link.textContent = linkText
      link.setAttribute('data-auto-link', 'true')

      // Split the text node and insert the link
      if (beforeText) {
        const beforeNode = document.createTextNode(beforeText)
        parent.insertBefore(beforeNode, currentNode)
      }

      parent.insertBefore(link, currentNode)

      if (afterText) {
        const afterNode = document.createTextNode(afterText)
        parent.insertBefore(afterNode, currentNode)
        currentNode = afterNode
      }

      // Remove the original text node
      parent.removeChild(currentNode)

      // Update current node for next iteration
      if (afterText) {
        currentNode = parent.lastChild as Text
      }
    }
  }
}