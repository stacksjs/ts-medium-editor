import { MediumEditor } from '../../src/index.ts'
import { highlightAllCodeBlocks } from './syntax-highlighter.ts'

// Example 1: Disable Context Menu Extension
class DisableContextMenuExtension {
  name = 'disable-context-menu'
  base?: any

  init(): void {
    if (!this.base)
      return

    this.base.elements.forEach((element: HTMLElement) => {
      this.base.on(element, 'contextmenu', this.handleContextmenu.bind(this))
    })
    this.base.subscribe('editableKeydown', this.handleKeydown.bind(this))
  }

  handleContextmenu(event: Event): void {
    const target = event.currentTarget as HTMLElement
    if (!target.getAttribute('data-allow-context-menu')) {
      event.preventDefault()
    }
  }

  handleKeydown(event: KeyboardEvent, editable: HTMLElement): void {
    // If the user hits escape, toggle the data-allow-context-menu attribute
    if (event.key === 'Escape') {
      if (editable.hasAttribute('data-allow-context-menu')) {
        editable.removeAttribute('data-allow-context-menu')
        showNotification('Context menu disabled. Press ESC to enable.', 'warning')
      }
      else {
        editable.setAttribute('data-allow-context-menu', 'true')
        showNotification('Context menu enabled. Press ESC to disable.', 'success')
      }
    }
  }
}

// Example 2: Word Count Extension
class WordCountExtension {
  name = 'word-count'
  base?: any
  private countElement?: HTMLElement

  init(): void {
    if (!this.base)
      return

    // Create word count display
    this.createWordCountDisplay()

    // Listen for content changes
    this.base.subscribe('editableInput', this.updateWordCount.bind(this))
    this.base.subscribe('editableKeyup', this.updateWordCount.bind(this))

    // Initial count
    this.updateWordCount()
  }

  private createWordCountDisplay() {
    this.countElement = document.createElement('div')
    this.countElement.className = 'word-count-display'
    this.countElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `
    document.body.appendChild(this.countElement)
  }

  private updateWordCount() {
    if (!this.base || !this.countElement)
      return

    let totalWords = 0
    let totalChars = 0

    this.base.elements.forEach((element: HTMLElement) => {
      const text = element.textContent || ''
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      totalWords += words.length
      totalChars += text.length
    })

    this.countElement.textContent = `${totalWords} words, ${totalChars} chars`
  }

  destroy(): void {
    if (this.countElement && this.countElement.parentNode) {
      this.countElement.parentNode.removeChild(this.countElement)
    }
  }
}

// Example 3: Auto-Save Extension
class AutoSaveExtension {
  name = 'auto-save'
  base?: any
  private saveTimeout?: number
  private lastSaved = new Date()

  init(): void {
    if (!this.base)
      return

    this.base.subscribe('editableInput', this.scheduleAutoSave.bind(this))
    this.createSaveIndicator()
  }

  private scheduleAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }

    this.saveTimeout = window.setTimeout(() => {
      this.performAutoSave()
    }, 2000) // Auto-save after 2 seconds of inactivity
  }

  private performAutoSave() {
    if (!this.base)
      return

    const content = this.base.serialize()

    // Simulate saving to localStorage
    localStorage.setItem('medium-editor-autosave', JSON.stringify({
      content,
      timestamp: new Date().toISOString(),
    }))

    this.lastSaved = new Date()
    this.updateSaveIndicator()
    showNotification('Content auto-saved!', 'success')
  }

  private createSaveIndicator() {
    const indicator = document.createElement('div')
    indicator.id = 'save-indicator'
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `
    indicator.textContent = 'Saved'
    document.body.appendChild(indicator)
    this.updateSaveIndicator()
  }

  private updateSaveIndicator() {
    const indicator = document.getElementById('save-indicator')
    if (indicator) {
      const timeAgo = Math.floor((Date.now() - this.lastSaved.getTime()) / 1000)
      if (timeAgo < 60) {
        indicator.textContent = `Saved ${timeAgo}s ago`
      }
      else {
        const minutesAgo = Math.floor(timeAgo / 60)
        indicator.textContent = `Saved ${minutesAgo}m ago`
      }
    }
  }
}

// Example 4: Emoji Picker Extension
class EmojiPickerExtension {
  name = 'emoji-picker'
  base?: any
  private picker?: HTMLElement

  init(): void {
    if (!this.base)
      return
    this.createEmojiButton()
  }

  private createEmojiButton() {
    // Add emoji button to toolbar after it's created
    setTimeout(() => {
      const toolbar = this.base?.getExtensionByName('toolbar')
      if (toolbar && toolbar.toolbar) {
        const button = document.createElement('button')
        button.className = 'medium-editor-action medium-editor-action-emoji'
        button.innerHTML = '😀'
        button.title = 'Insert Emoji'
        button.addEventListener('click', this.toggleEmojiPicker.bind(this))

        toolbar.toolbar.appendChild(button)
        toolbar.buttons.push(button)
      }
    }, 100)
  }

  private toggleEmojiPicker(event: Event) {
    event.preventDefault()

    if (this.picker) {
      this.hideEmojiPicker()
    }
    else {
      this.showEmojiPicker()
    }
  }

  private showEmojiPicker() {
    this.picker = document.createElement('div')
    this.picker.className = 'emoji-picker'
    this.picker.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 10000;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      max-width: 320px;
    `

    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏']

    emojis.forEach((emoji) => {
      const button = document.createElement('button')
      button.textContent = emoji
      button.style.cssText = `
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      `
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#f0f0f0'
      })
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'transparent'
      })
      button.addEventListener('click', () => {
        this.insertEmoji(emoji)
        this.hideEmojiPicker()
      })
      this.picker!.appendChild(button)
    })

    document.body.appendChild(this.picker)

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick.bind(this))
    }, 0)
  }

  private hideEmojiPicker() {
    if (this.picker && this.picker.parentNode) {
      this.picker.parentNode.removeChild(this.picker)
      this.picker = undefined
      document.removeEventListener('click', this.handleOutsideClick.bind(this))
    }
  }

  private handleOutsideClick(event: Event) {
    if (this.picker && !this.picker.contains(event.target as Node)) {
      this.hideEmojiPicker()
    }
  }

  private insertEmoji(emoji: string) {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(emoji))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

// Utility function for notifications
function showNotification(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#dc3545'};
    color: ${type === 'warning' ? '#000' : '#fff'};
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10001;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
  `
  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1'
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create editor with multiple extensions
    const editor = new MediumEditor('.editable', {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Try the extensions: Right-click (disabled by default), press ESC to toggle, watch word count, auto-save, and emoji picker!',
      },
    })

    // Initialize extensions manually since they're not part of the core
    const disableContextMenu = new DisableContextMenuExtension()
    const wordCount = new WordCountExtension()
    const autoSave = new AutoSaveExtension()
    const emojiPicker = new EmojiPickerExtension()

    // Set base reference and initialize
    disableContextMenu.base = editor
    wordCount.base = editor
    autoSave.base = editor
    emojiPicker.base = editor

    disableContextMenu.init()
    wordCount.init()
    autoSave.init()
    emojiPicker.init()

    // Store extensions globally for debugging
    window.editor = editor
    window.extensions = {
      disableContextMenu,
      wordCount,
      autoSave,
      emojiPicker,
    }

    showNotification('Extensions loaded! Try typing, right-clicking, and pressing ESC.', 'success')

    // Apply syntax highlighting to code examples
    await highlightAllCodeBlocks()
    showNotification('🎨 Code syntax highlighting applied with Shiki!', 'success')
  }
  catch (error) {
    console.error('Error initializing extension demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    editor: any
    extensions: {
      disableContextMenu: DisableContextMenuExtension
      wordCount: WordCountExtension
      autoSave: AutoSaveExtension
      emojiPicker: EmojiPickerExtension
    }
  }
}
