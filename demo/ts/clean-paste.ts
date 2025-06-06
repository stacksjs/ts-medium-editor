import { MediumEditor } from '../../src/index.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Get comparison display elements
    const rawHtmlDisplay = document.getElementById('raw-html')
    const cleanHtmlDisplay = document.getElementById('clean-html')

    // Create editor with clean paste functionality
    const editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      paste: {
        cleanPastedHTML: true,
        forcePlainText: false,
        cleanReplacements: [
          // Remove common unwanted elements
          [/<o:p\s*\/?>|<\/o:p>/gi, ''], // Remove Word's <o:p> tags
          [/<span\s+style\s*=\s*["'][^"']*mso-[^"']*["'][^>]*>/gi, '<span>'], // Remove Word styles
          [/<(\w+)\s+class\s*=\s*["'][^"']*Mso[^"']*["'][^>]*>/gi, '<$1>'], // Remove Word classes
          [/<!--\[if [^>]*>.*?<!\[endif\]-->/gi, ''], // Remove Word conditionals
          [/<style[^>]*>[\s\S]*?<\/style>/gi, ''], // Remove style blocks
          [/<script[^>]*>[\s\S]*?<\/script>/gi, ''], // Remove script blocks
        ],
        cleanAttrs: ['class', 'style', 'dir', 'lang'], // Remove these attributes
        cleanTags: ['meta', 'link', 'style', 'script'], // Remove these tags completely
        unwrapTags: ['div', 'span'], // Unwrap content from these tags
      },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      placeholder: {
        text: 'Try pasting content from Word, Google Docs, or other rich text sources...',
      },
    })

    // Add paste event listener for demonstration
    const editableElement = document.querySelector('.editable')
    if (editableElement) {
      editableElement.addEventListener('paste', (event) => {
        // Capture the raw HTML from clipboard
        const clipboardData = (event as ClipboardEvent).clipboardData
        if (clipboardData) {
          const rawHtml = clipboardData.getData('text/html')
          if (rawHtml && rawHtmlDisplay) {
            // Display the raw HTML
            rawHtmlDisplay.textContent = formatHtml(rawHtml)
          }
        }

        // Show a temporary notification
        showPasteNotification()

        // Update cleaned HTML after a short delay to allow processing
        setTimeout(() => {
          updateCleanHtml(editableElement, cleanHtmlDisplay)
        }, 100)
      })

      // Also update on any content changes
      editor.subscribe('editableInput', () => {
        updateCleanHtml(editableElement, cleanHtmlDisplay)
      })
    }

    // Make editor globally available for debugging
    window.editor = editor
  }
  catch (error) {
    console.error('Error initializing clean paste demo:', error)
  }
})

function updateCleanHtml(editableElement: Element, cleanHtmlDisplay: HTMLElement | null) {
  if (cleanHtmlDisplay) {
    const cleanHtml = editableElement.innerHTML
    cleanHtmlDisplay.textContent = formatHtml(cleanHtml)
  }
}

function formatHtml(html: string): string {
  // Simple HTML formatting for better readability
  return html
    .replace(/></g, '>\n<') // Add line breaks between tags
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
}

function showPasteNotification() {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = 'paste-notification'
  notification.textContent = 'Content cleaned and pasted!'
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1'
    notification.style.transform = 'translateX(0)'
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0'
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Global type declaration for debugging
declare global {
  interface Window {
    editor: any
  }
}
