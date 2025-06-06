import type { MediumEditor, MediumEditorExtension } from '../types'

export class FileDragging implements MediumEditorExtension {
  name = 'fileDragging'

  private editor: MediumEditor
  private allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  constructor(editor: MediumEditor, options: { allowedTypes?: string[] } = {}) {
    this.editor = editor
    this.allowedTypes = options.allowedTypes || this.allowedTypes
  }

  init(): void {
    if (this.editor.elements) {
      this.editor.elements.forEach((element: HTMLElement) => {
        this.attachDragEvents(element)
      })
    }

    this.editor.subscribe('addElement', this.handleAddElement.bind(this))
  }

  destroy(): void {
    if (this.editor.elements) {
      this.editor.elements.forEach((element: HTMLElement) => {
        this.detachDragEvents(element)
      })
    }
  }

  private handleAddElement(_event: any, editable?: HTMLElement): void {
    if (editable) {
      this.attachDragEvents(editable)
    }
  }

  private attachDragEvents(element: HTMLElement): void {
    element.addEventListener('dragover', this.handleDragOver.bind(this))
    element.addEventListener('dragleave', this.handleDragLeave.bind(this))
    element.addEventListener('drop', this.handleDrop.bind(this))
  }

  private detachDragEvents(element: HTMLElement): void {
    element.removeEventListener('dragover', this.handleDragOver.bind(this))
    element.removeEventListener('dragleave', this.handleDragLeave.bind(this))
    element.removeEventListener('drop', this.handleDrop.bind(this))
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    if (this.hasValidFiles(event)) {
      const target = event.currentTarget as HTMLElement
      target.classList.add('medium-editor-dragover')
    }
  }

  private handleDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const target = event.currentTarget as HTMLElement
    target.classList.remove('medium-editor-dragover')
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const target = event.currentTarget as HTMLElement
    target.classList.remove('medium-editor-dragover')

    if (!event.dataTransfer) {
      return
    }

    const files = Array.from(event.dataTransfer.files)
    const validFiles = files.filter(file => this.isValidFileType(file))

    if (validFiles.length > 0) {
      this.handleFiles(validFiles, target)
    }
  }

  private hasValidFiles(event: DragEvent): boolean {
    if (!event.dataTransfer) {
      return false
    }

    const types = Array.from(event.dataTransfer.types)
    return types.includes('Files')
  }

  private isValidFileType(file: File): boolean {
    return this.allowedTypes.includes(file.type)
  }

  private handleFiles(files: File[], target: HTMLElement): void {
    files.forEach(file => {
      this.insertFile(file, target)
    })
  }

  private insertFile(file: File, target: HTMLElement): void {
    if (file.type.startsWith('image/')) {
      this.insertImage(file, target)
    }
  }

  private insertImage(file: File, target: HTMLElement): void {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const img = document.createElement('img')
        img.src = event.target.result
        img.alt = file.name
        img.style.maxWidth = '100%'
        img.style.height = 'auto'

        // Insert at cursor position or append to target
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)

          // Check if selection is within the target
          let container: Node | null = range.commonAncestorContainer
          while (container && container !== target && container !== document.body) {
            container = container.parentNode
          }

          if (container === target) {
            range.deleteContents()
            range.insertNode(img)
            range.setStartAfter(img)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            target.appendChild(img)
          }
        } else {
          target.appendChild(img)
        }

        // Trigger input event
        if (this.editor.trigger) {
          this.editor.trigger('editableInput', {}, target)
        }
      }
    }

    reader.readAsDataURL(file)
  }
}
