import type { AnchorPreviewOptions, MediumEditor, MediumEditorExtension } from '../types'

export class AnchorPreview implements MediumEditorExtension {
  name = 'anchor-preview'

  // Anchor Preview Options
  hideDelay = 500
  previewValueSelector = 'a'
  showWhenToolbarIsVisible = false
  showOnEmptyLinks = true

  private editor: MediumEditor
  private anchorPreview!: HTMLElement
  private activeAnchor: HTMLAnchorElement | null = null
  private hideTimeout?: number

  constructor(editor: MediumEditor, options: AnchorPreviewOptions = {}) {
    this.editor = editor
    this.hideDelay = options.hideDelay ?? this.hideDelay
    this.previewValueSelector = options.previewValueSelector || this.previewValueSelector
    this.showWhenToolbarIsVisible = options.showWhenToolbarIsVisible ?? this.showWhenToolbarIsVisible
    this.showOnEmptyLinks = options.showOnEmptyLinks ?? this.showOnEmptyLinks
  }

  init(): void {
    this.anchorPreview = this.createPreview()

    const container = this.editor.options.elementsContainer || document.body
    container.appendChild(this.anchorPreview)

    this.attachToEditables()
  }

  destroy(): void {
    if (this.anchorPreview && this.anchorPreview.parentNode) {
      this.anchorPreview.parentNode.removeChild(this.anchorPreview)
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }
  }

  getInteractionElements(): HTMLElement[] {
    return [this.anchorPreview]
  }

  private createPreview(): HTMLElement {
    const el = document.createElement('div')
    el.id = `medium-editor-anchor-preview-${this.editor.id}`
    el.className = 'medium-editor-anchor-preview'
    el.innerHTML = this.getTemplate()

    el.addEventListener('click', this.handleClick.bind(this))

    return el
  }

  private getTemplate(): string {
    return `<div class="medium-editor-toolbar-anchor-preview" id="medium-editor-toolbar-anchor-preview">
      <a class="medium-editor-toolbar-anchor-preview-inner"></a>
    </div>`
  }

  private hidePreview(): void {
    if (this.anchorPreview) {
      this.anchorPreview.classList.remove('medium-editor-anchor-preview-active')
    }
    this.activeAnchor = null
  }

  private showPreview(anchorEl: HTMLAnchorElement): this {
    if (this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')
      || anchorEl.getAttribute('data-disable-preview')) {
      return this
    }

    const href = anchorEl.getAttribute('href')
    if (!href)
      return this

    // Check if we should show on empty links
    if (!this.showOnEmptyLinks && (href === '' || href === '#' || href.startsWith('#'))) {
      return this
    }

    if (this.previewValueSelector) {
      const previewElement = this.anchorPreview.querySelector(this.previewValueSelector) as HTMLAnchorElement
      if (previewElement) {
        previewElement.textContent = href
        previewElement.href = href
      }
    }

    this.anchorPreview.classList.add('medium-toolbar-arrow-over')
    this.anchorPreview.classList.remove('medium-toolbar-arrow-under')

    if (!this.anchorPreview.classList.contains('medium-editor-anchor-preview-active')) {
      this.anchorPreview.classList.add('medium-editor-anchor-preview-active')
    }

    this.activeAnchor = anchorEl
    this.positionPreview()
    this.attachPreviewHandlers()

    return this
  }

  private positionPreview(activeAnchor?: HTMLAnchorElement): void {
    activeAnchor = activeAnchor || this.activeAnchor || undefined
    if (!activeAnchor)
      return

    const containerWidth = window.innerWidth
    const buttonHeight = this.anchorPreview.offsetHeight
    const boundary = activeAnchor.getBoundingClientRect()
    let diffLeft = 0
    let diffTop = 0

    const elementsContainer = this.editor.options.elementsContainer || document.body
    const elementsContainerAbsolute = ['absolute', 'fixed'].includes(
      window.getComputedStyle(elementsContainer).getPropertyValue('position'),
    )

    let relativeBoundary: DOMRect = boundary
    const halfOffsetWidth = this.anchorPreview.offsetWidth / 2

    // Get toolbar diff values if available
    const toolbarExtension = this.editor.getExtensionByName('toolbar')
    if (toolbarExtension && 'diffLeft' in toolbarExtension && 'diffTop' in toolbarExtension) {
      diffLeft = (toolbarExtension as any).diffLeft
      diffTop = (toolbarExtension as any).diffTop
    }

    const defaultLeft = diffLeft - halfOffsetWidth
    let top: number

    // Handle relative container positioning
    if (elementsContainerAbsolute) {
      const elementsContainerBoundary = elementsContainer.getBoundingClientRect()
      const adjustedBoundary = {
        top: boundary.top - elementsContainerBoundary.top,
        left: boundary.left - elementsContainerBoundary.left,
        width: boundary.width,
        height: boundary.height,
        right: boundary.right - elementsContainerBoundary.left,
        bottom: boundary.bottom - elementsContainerBoundary.top,
        x: boundary.x - elementsContainerBoundary.x,
        y: boundary.y - elementsContainerBoundary.y,
        toJSON: boundary.toJSON,
      } as DOMRect

      relativeBoundary = adjustedBoundary
      top = (elementsContainer as HTMLElement).scrollTop
    }
    else {
      top = window.pageYOffset
    }

    const middleBoundary = relativeBoundary.left + relativeBoundary.width / 2
    top += buttonHeight + relativeBoundary.top + relativeBoundary.height - diffTop - this.anchorPreview.offsetHeight

    this.anchorPreview.style.top = `${Math.round(top)}px`
    this.anchorPreview.style.right = 'initial'

    if (middleBoundary < halfOffsetWidth) {
      this.anchorPreview.style.left = `${defaultLeft + halfOffsetWidth}px`
      this.anchorPreview.style.right = 'initial'
    }
    else if ((containerWidth - middleBoundary) < halfOffsetWidth) {
      this.anchorPreview.style.left = 'auto'
      this.anchorPreview.style.right = '0px'
    }
    else {
      this.anchorPreview.style.left = `${defaultLeft + middleBoundary}px`
      this.anchorPreview.style.right = 'initial'
    }
  }

  private attachToEditables(): void {
    this.editor.subscribe('editableMouseover', this.handleEditableMouseover.bind(this))
    this.editor.subscribe('positionedToolbar', this.handlePositionedToolbar.bind(this))
  }

  private handlePositionedToolbar(): void {
    if (!this.showWhenToolbarIsVisible) {
      this.hidePreview()
    }
  }

  handleClick(event: Event): void {
    const anchorExtension = this.editor.getExtensionByName('anchor')
    const activeAnchor = this.activeAnchor

    if (anchorExtension && activeAnchor) {
      event.preventDefault()

      if (this.editor.selectElement) {
        this.editor.selectElement(activeAnchor)
      }

      // Using delay because we may be displaying the anchor form
      if (this.editor.delay) {
        this.editor.delay(() => {
          if (activeAnchor && 'showForm' in anchorExtension) {
            const opts = {
              value: activeAnchor.getAttribute('href') || '',
              target: activeAnchor.getAttribute('target') || '',
              buttonClass: activeAnchor.getAttribute('class') || '',
            }
            ;(anchorExtension as any).showForm(opts)
          }
        })
      }
    }

    this.hidePreview()
  }

  private handleEditableMouseover(event: Event): void {
    const target = event.target as HTMLElement

    if (target.tagName.toLowerCase() === 'a') {
      const anchorEl = target as HTMLAnchorElement

      // Clear any existing hide timeout
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout)
        this.hideTimeout = undefined
      }

      // Show preview after a small delay
      setTimeout(() => {
        this.showPreview(anchorEl)
      }, 100)
    }
    else if (this.activeAnchor) {
      // Mouse left an anchor, hide after delay
      this.hideTimeout = window.setTimeout(() => {
        this.hidePreview()
      }, this.hideDelay)
    }
  }

  private attachPreviewHandlers(): void {
    // Add mouseenter/mouseleave handlers to the preview element
    this.anchorPreview.addEventListener('mouseenter', () => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout)
        this.hideTimeout = undefined
      }
    })

    this.anchorPreview.addEventListener('mouseleave', () => {
      this.hideTimeout = window.setTimeout(() => {
        this.hidePreview()
      }, this.hideDelay)
    })
  }
}
