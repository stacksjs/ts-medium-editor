import { MediumEditor } from '../../src/index.ts'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. FontAwesome Icons Editor
    const fontAwesomeEditor = new MediumEditor('.editable-fontawesome', {
      toolbar: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'quote',
          'anchor',
          'image',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
          'superscript',
          'subscript',
          'orderedlist',
          'unorderedlist',
          'pre',
          'removeFormat',
          'outdent',
          'indent',
          'h2',
          'h3',
          'html',
        ],
      },
      buttonLabels: 'fontawesome',
      anchor: {
        targetCheckbox: true,
        placeholderText: 'Paste or type a link',
        targetCheckboxText: 'Open in new window',
      },
      placeholder: {
        text: 'Click here to edit with FontAwesome icons...',
      },
    })

    // 2. Custom Text Labels Editor
    const customLabelsEditor = new MediumEditor('.editable-custom-labels', {
      toolbar: {
        buttons: [
          {
            name: 'bold',
            contentDefault: '<strong>Bold</strong>',
          },
          {
            name: 'italic',
            contentDefault: '<em>Italic</em>',
          },
          {
            name: 'underline',
            contentDefault: '<u>Underline</u>',
          },
          {
            name: 'strikethrough',
            contentDefault: '<s>Strike</s>',
          },
          {
            name: 'anchor',
            contentDefault: '🔗 Link',
          },
          {
            name: 'quote',
            contentDefault: '💬 Quote',
          },
          {
            name: 'h2',
            contentDefault: 'H2',
          },
          {
            name: 'h3',
            contentDefault: 'H3',
          },
        ],
      },
      placeholder: {
        text: 'Click here to edit with custom text labels...',
      },
    })

    // 3. Mixed Content Editor (Icons + Text + HTML)
    const mixedContentEditor = new MediumEditor('.editable-mixed', {
      toolbar: {
        buttons: [
          'bold', // Default FontAwesome
          'italic', // Default FontAwesome
          {
            name: 'underline',
            contentDefault: '📝 Underline',
          },
          {
            name: 'anchor',
            contentDefault: '<span style="color: #007bff;">🔗 Link</span>',
          },
          {
            name: 'quote',
            contentDefault: '❝',
          },
          {
            name: 'orderedlist',
            contentDefault: '1️⃣ List',
          },
          {
            name: 'unorderedlist',
            contentDefault: '• List',
          },
          'h2', // Default FontAwesome
          'h3', // Default FontAwesome
        ],
      },
      buttonLabels: 'fontawesome', // This affects buttons without custom content
      placeholder: {
        text: 'Click here to edit with mixed button styles...',
      },
    })

    // 4. Minimal Toolbar Editor
    const minimalEditor = new MediumEditor('.editable-minimal', {
      toolbar: {
        buttons: [
          {
            name: 'bold',
            contentDefault: 'B',
          },
          {
            name: 'italic',
            contentDefault: 'I',
          },
          {
            name: 'anchor',
            contentDefault: 'Link',
          },
        ],
      },
      placeholder: {
        text: 'Minimal toolbar with just the essentials...',
      },
    })

    // 5. Advanced Custom Toolbar with Styling
    const advancedEditor = new MediumEditor('.editable-advanced', {
      toolbar: {
        buttons: [
          {
            name: 'bold',
            contentDefault: '<span class="custom-btn-bold">𝐁</span>',
          },
          {
            name: 'italic',
            contentDefault: '<span class="custom-btn-italic">𝐼</span>',
          },
          {
            name: 'underline',
            contentDefault: '<span class="custom-btn-underline">U̲</span>',
          },
          {
            name: 'anchor',
            contentDefault: '<span class="custom-btn-link">🔗</span>',
          },
          {
            name: 'quote',
            contentDefault: '<span class="custom-btn-quote">❞</span>',
          },
          {
            name: 'h2',
            contentDefault: '<span class="custom-btn-heading">H2</span>',
          },
          {
            name: 'h3',
            contentDefault: '<span class="custom-btn-heading">H3</span>',
          },
        ],
      },
      placeholder: {
        text: 'Advanced styling with custom CSS classes...',
      },
    })

    // Store editors globally for debugging
    window.editors = {
      fontAwesome: fontAwesomeEditor,
      customLabels: customLabelsEditor,
      mixed: mixedContentEditor,
      minimal: minimalEditor,
      advanced: advancedEditor,
    }

    // Add dynamic theme switching
    const themeSelect = document.getElementById('theme-selector') as HTMLSelectElement
    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement
        if (themeLink) {
          themeLink.href = `../src/css/themes/${this.value}.css`
        }
      })
    }
  }
  catch (error) {
    console.error('Error initializing custom toolbar demo:', error)
  }
})

// Global type declarations
declare global {
  interface Window {
    editors: {
      fontAwesome: any
      customLabels: any
      mixed: any
      minimal: any
      advanced: any
    }
  }
}
