import type { ButtonExtension, MediumEditor, ToolbarButton } from '../types'

export class Button implements ButtonExtension {
  name: string
  action?: string
  aria?: string
  tagNames?: string[]
  style?: {
    prop: string
    value: string
  }

  useQueryState?: boolean
  contentDefault?: string
  contentFA?: string
  classList?: string[]
  attrs?: Record<string, string>
  button?: HTMLElement

  private editor: MediumEditor

  constructor(editor: MediumEditor, config: string | ToolbarButton) {
    this.editor = editor

    if (typeof config === 'string') {
      // Built-in button
      this.name = config
      this.initBuiltInButton(config)
    }
    else {
      // Custom button
      this.name = config.name
      this.action = config.action as string
      this.aria = config.aria
      this.tagNames = config.tagNames
      this.style = config.style
      this.useQueryState = config.useQueryState
      this.contentDefault = config.contentDefault
      this.contentFA = config.contentFA
      this.classList = config.classList
      this.attrs = config.attrs
    }
  }

  private initBuiltInButton(name: string): void {
    const builtInButtons: Record<string, Partial<ButtonExtension>> = {
      bold: {
        action: 'bold',
        aria: 'Bold',
        tagNames: ['b', 'strong'],
        contentDefault: '<b>B</b>',
        contentFA: '<i class="fa fa-bold"></i>',
        useQueryState: true,
      },
      italic: {
        action: 'italic',
        aria: 'Italic',
        tagNames: ['i', 'em'],
        contentDefault: '<i>I</i>',
        contentFA: '<i class="fa fa-italic"></i>',
        useQueryState: true,
      },
      underline: {
        action: 'underline',
        aria: 'Underline',
        tagNames: ['u'],
        contentDefault: '<u>U</u>',
        contentFA: '<i class="fa fa-underline"></i>',
        useQueryState: true,
      },
      strikethrough: {
        action: 'strikethrough',
        aria: 'Strikethrough',
        tagNames: ['strike', 's'],
        contentDefault: '<s>S</s>',
        contentFA: '<i class="fa fa-strikethrough"></i>',
        useQueryState: true,
      },
      anchor: {
        action: 'createLink',
        aria: 'Link',
        tagNames: ['a'],
        contentDefault: '<b>#</b>',
        contentFA: '<i class="fa fa-link"></i>',
      },
      h2: {
        action: 'append-h2',
        aria: 'Heading 2',
        tagNames: ['h2'],
        contentDefault: 'H2',
      },
      h3: {
        action: 'append-h3',
        aria: 'Heading 3',
        tagNames: ['h3'],
        contentDefault: 'H3',
      },
      quote: {
        action: 'append-blockquote',
        aria: 'Quote',
        tagNames: ['blockquote'],
        contentDefault: '&ldquo;&rdquo;',
        contentFA: '<i class="fa fa-quote-left"></i>',
      },
      orderedlist: {
        action: 'insertorderedlist',
        aria: 'Ordered List',
        tagNames: ['ol'],
        contentDefault: '1.',
        contentFA: '<i class="fa fa-list-ol"></i>',
      },
      unorderedlist: {
        action: 'insertunorderedlist',
        aria: 'Unordered List',
        tagNames: ['ul'],
        contentDefault: '&bull;',
        contentFA: '<i class="fa fa-list-ul"></i>',
      },
    }

    const config = builtInButtons[name]
    if (config) {
      Object.assign(this, config)
    }
  }

  init(): void {
    this.button = this.createButton()
    if (this.button) {
      this.button.addEventListener('click', this.handleClick.bind(this))
    }
  }

  destroy(): void {
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button)
    }
  }

  getButton(): HTMLElement | null {
    return this.button || null
  }

  private createButton(): HTMLElement {
    const button = document.createElement('button')
    const ariaLabel = this.getAria()
    const buttonLabels = this.editor.options.buttonLabels

    // Add classes
    button.classList.add('medium-editor-action')
    button.classList.add(`medium-editor-action-${this.name}`)

    if (this.classList) {
      this.classList.forEach((className) => {
        button.classList.add(className)
      })
    }

    // Set attributes
    button.setAttribute('data-action', this.getAction())
    if (ariaLabel) {
      button.setAttribute('title', ariaLabel)
      button.setAttribute('aria-label', ariaLabel)
    }

    if (this.attrs) {
      Object.entries(this.attrs).forEach(([key, value]) => {
        button.setAttribute(key, value)
      })
    }

    // Set content
    let content = this.contentDefault || ''
    if (buttonLabels === 'fontawesome' && this.contentFA) {
      content = this.contentFA
    }
    button.innerHTML = content

    return button
  }

  handleClick(event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    const action = this.getAction()
    if (action && this.editor.execAction) {
      this.editor.execAction(action)
    }
  }

  private getAction(): string {
    return this.action || ''
  }

  private getAria(): string {
    return this.aria || ''
  }

  isActive(): boolean {
    if (!this.button)
      return false
    const activeClass = this.editor.options.activeButtonClass || 'medium-editor-button-active'
    return this.button.classList.contains(activeClass)
  }

  setActive(): void {
    if (!this.button)
      return
    const activeClass = this.editor.options.activeButtonClass || 'medium-editor-button-active'
    this.button.classList.add(activeClass)
  }

  setInactive(): void {
    if (!this.button)
      return
    const activeClass = this.editor.options.activeButtonClass || 'medium-editor-button-active'
    this.button.classList.remove(activeClass)
  }

  queryCommandState(): boolean {
    if (this.useQueryState && this.action) {
      try {
        return document.queryCommandState(this.action)
      }
      catch {
        return false
      }
    }
    return false
  }

  isAlreadyApplied(node: Node): boolean {
    // Check tagNames
    if (this.tagNames) {
      let current: Node | null = node
      while (current && current !== document.body) {
        if (current.nodeType === Node.ELEMENT_NODE) {
          const element = current as HTMLElement
          if (this.tagNames.includes(element.tagName.toLowerCase())) {
            return true
          }
        }
        current = current.parentNode
      }
    }

    // Check style
    if (this.style && node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const computedStyle = window.getComputedStyle(element)
      const styleValue = computedStyle.getPropertyValue(this.style.prop)
      const expectedValues = this.style.value.split('|')
      return expectedValues.includes(styleValue)
    }

    return false
  }
}
