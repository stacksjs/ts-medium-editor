import type { MediumEditor, MediumEditorExtension } from '../types'

export abstract class FormExtension implements MediumEditorExtension {
  abstract name: string

  // Default labels for form buttons
  protected formSaveLabel = '&#10003;'
  protected formCloseLabel = '&times;'

  // Active class for shown form
  protected activeClass = 'medium-editor-toolbar-form-active'

  // Form properties
  protected hasForm = true
  protected form?: HTMLElement
  protected editor: MediumEditor

  constructor(editor: MediumEditor) {
    this.editor = editor
  }

  abstract init(): void
  abstract destroy(): void

  // Abstract methods that must be implemented by subclasses
  abstract getForm(): HTMLElement
  abstract createForm(): HTMLElement

  // Form state methods
  isDisplayed(): boolean {
    if (this.hasForm && this.form) {
      return this.form.classList.contains(this.activeClass)
    }
    return false
  }

  showForm(): void {
    if (this.hasForm && this.form) {
      this.form.classList.add(this.activeClass)
    }
  }

  hideForm(): void {
    if (this.hasForm && this.form) {
      this.form.classList.remove(this.activeClass)
    }
  }

  // Helper methods for toolbar interaction
  protected showToolbarDefaultActions(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'showToolbarDefaultActions' in toolbar) {
      (toolbar as any).showToolbarDefaultActions()
    }
  }

  protected hideToolbarDefaultActions(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'hideToolbarDefaultActions' in toolbar) {
      (toolbar as any).hideToolbarDefaultActions()
    }
  }

  protected setToolbarPosition(): void {
    const toolbar = this.editor.getExtensionByName('toolbar')
    if (toolbar && 'setToolbarPosition' in toolbar) {
      (toolbar as any).setToolbarPosition()
    }
  }

  // Event handling helpers
  protected on(element: HTMLElement, event: string, handler: EventListener, useCapture?: boolean): void {
    element.addEventListener(event, handler, useCapture)
  }

  protected off(element: HTMLElement, event: string, handler: EventListener, useCapture?: boolean): void {
    element.removeEventListener(event, handler, useCapture)
  }

  // Editor helpers
  protected getEditorId(): number {
    return this.editor.id
  }

  protected getEditorOption(option: string): any {
    return (this.editor.options as any)[option]
  }

  protected execAction(action: string, opts?: any): boolean {
    if (this.editor.execAction) {
      return this.editor.execAction(action, opts)
    }
    return false
  }

  // Common form event handlers
  protected handleFormClick(event: Event): void {
    // Prevent form from hiding when clicking inside it
    event.stopPropagation()
  }

  protected handleSaveClick(event: Event): void {
    event.preventDefault()
    this.doFormSave()
  }

  protected handleCloseClick(event: Event): void {
    event.preventDefault()
    this.doFormCancel()
  }

  // Abstract form action methods
  protected abstract doFormSave(): void
  protected abstract doFormCancel(): void
}