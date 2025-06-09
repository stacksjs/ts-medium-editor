# Clean Paste

Control how pasted content is handled and cleaned to maintain consistent formatting.

## Interactive Demo

::: tip Try the Demos
Copy formatted text from different sources (Word, Google Docs, web pages) and paste into the editors below to see how different cleaning options work.
:::

<div class="demo-container">
  <div class="demo-label">Paste cleaning comparison - Try pasting formatted content:</div>
  <div class="demo-status" id="demo-status-paste">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-paste-grid">
    <div class="demo-paste-card">
      <h4>🧹 Clean Paste Editor</h4>
      <div class="demo-clean-editor" data-placeholder="Paste formatted content here..." contenteditable="true">
        <p>This editor cleans pasted HTML automatically.</p>
      </div>
      <div class="paste-info">Removes styles, classes, and unwanted tags</div>
    </div>
    <div class="demo-paste-card">
      <h4>📝 Plain Text Editor</h4>
      <div class="demo-plain-editor" data-placeholder="Paste here for plain text only..." contenteditable="true">
        <p>This editor forces all pasted content to plain text.</p>
      </div>
      <div class="paste-info">Strips all formatting, keeps only text</div>
    </div>
    <div class="demo-paste-card">
      <h4>🔧 Custom Clean Editor</h4>
      <div class="demo-custom-editor" data-placeholder="Paste here for custom cleaning..." contenteditable="true">
        <p>This editor applies custom cleaning rules.</p>
      </div>
      <div class="paste-info">Custom rules for Word, Google Docs, etc.</div>
    </div>
  </div>
  <div class="paste-log-container">
    <h4>📋 Paste Activity Log</h4>
    <div id="paste-activity-log" class="paste-activity-log">
      <div class="log-entry">Ready to log paste events...</div>
    </div>
    <button id="clear-log" class="clear-log-btn">Clear Log</button>
  </div>
</div>

## Basic Clean Paste

Enable basic paste cleaning:

```typescript
const editor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta', 'script', 'style']
  }
})
```

## Force Plain Text

Strip all formatting from pasted content:

### HTML
```html
<div class="plain-text-editor" data-placeholder="Paste formatted text here...">
  <p>All pasted content will be converted to plain text.</p>
</div>
```

### TypeScript
```typescript
const plainTextEditor = new MediumEditor('.plain-text-editor', {
  paste: {
    forcePlainText: true,
    cleanPastedHTML: false // Not needed when forcing plain text
  },
  toolbar: {
    buttons: ['bold', 'italic'] // Users can add formatting after pasting
  }
})
```

## Advanced HTML Cleaning

Clean specific HTML attributes and tags:

```typescript
const cleanEditor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,

    // Remove these attributes
    cleanAttrs: ['class', 'style', 'dir', 'id', 'data-*'],

    // Remove these tags completely
    cleanTags: ['meta', 'script', 'style', 'link', 'head', 'title'],

    // Custom cleaning patterns
    cleanReplacements: [
      // Remove inline styles
      [/\s*style\s*=\s*["'][^"']*["']/gi, ''],

      // Remove Word-specific tags
      [/<o:p\s*\/?>/gi, ''],
      [/<\/o:p>/gi, ''],

      // Remove empty paragraphs
      [/<p[^>]*>[\s&nbsp;]*<\/p>/gi, ''],

      // Clean up multiple spaces
      [/\s+/g, ' ']
    ]
  }
})
```

## Microsoft Word Paste Cleaning

Handle content pasted from Microsoft Word:

### HTML
```html
<div class="word-editor" data-placeholder="Paste content from Microsoft Word...">
  <p>This editor cleans up messy Word formatting automatically.</p>
</div>
```

### TypeScript
```typescript
const wordEditor = new MediumEditor('.word-editor', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanAttrs: ['class', 'style', 'dir', 'lang', 'xml:lang'],
    cleanTags: ['meta', 'link', 'style', 'script', 'o:p', 'xml'],
    cleanReplacements: [
      // Remove Word-specific namespaces
      [/<\/?w:[^>]*>/gi, ''],
      [/<\/?o:[^>]*>/gi, ''],
      [/<\/?v:[^>]*>/gi, ''],

      // Remove Word-specific attributes
      [/\s*mso-[^:]+:[^;"]+;?/gi, ''],
      [/\s*MARGIN[^:]+:[^;"]+;?/gi, ''],
      [/\s*FONT[^:]+:[^;"]+;?/gi, ''],
      [/\s*TEXT[^:]+:[^;"]+;?/gi, ''],

      // Clean up Word paragraph marks
      [/<p[^>]*class="MsoNormal"[^>]*>/gi, '<p>'],

      // Remove empty spans
      [/<span[^>]*>\s*<\/span>/gi, ''],

      // Remove Word comments
      [/<!--\[if [^>]*>.*?<!\[endif\]-->/gi, '']
    ]
  },
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  }
})
```

## Google Docs Paste Cleaning

Handle content from Google Docs:

```typescript
const googleDocsEditor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanAttrs: ['class', 'style', 'id'],
    cleanTags: ['meta', 'style', 'script'],
    cleanReplacements: [
      // Remove Google Docs specific classes
      [/\s*class="[^"]*docs-[^"]*"/gi, ''],

      // Clean up Google Docs spans
      [/<span[^>]*style="[^"]*font-weight:\s*normal[^"]*"[^>]*>/gi, '<span>'],
      [/<span[^>]*style="[^"]*font-style:\s*normal[^"]*"[^>]*>/gi, '<span>'],

      // Remove empty elements
      [/<(span|div)[^>]*>\s*<\/\1>/gi, ''],

      // Clean up line breaks
      [/<br[^>]*>\s*<br[^>]*>/gi, '</p><p>']
    ]
  }
})
```

## Custom Paste Processing

Add custom logic for paste processing:

### HTML
```html
<div class="custom-paste-editor" data-placeholder="Paste content to see custom processing...">
  <p>This editor applies custom processing to pasted content.</p>
</div>

<div id="paste-log" class="paste-log">
  <h4>Paste Log:</h4>
  <div id="paste-entries"></div>
</div>
```

### TypeScript
```typescript
const customPasteEditor = new MediumEditor('.custom-paste-editor', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true
  }
})

// Custom paste processing
customPasteEditor.subscribe('editablePaste', (event, editable) => {
  const clipboardData = event.clipboardData || window.clipboardData
  const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain')

  // Log the paste event
  logPasteEvent(pastedData)

  // Custom processing
  setTimeout(() => {
    processCustomPaste(editable)
  }, 10) // Small delay to let the paste complete
})

function logPasteEvent(data) {
  const logEntry = document.createElement('div')
  logEntry.className = 'paste-entry'
  logEntry.innerHTML = `
    <strong>Pasted at ${new Date().toLocaleTimeString()}:</strong>
    <pre>${data.substring(0, 200)}${data.length > 200 ? '...' : ''}</pre>
  `
  document.getElementById('paste-entries').appendChild(logEntry)
}

function processCustomPaste(editable) {
  // Convert all headings to h3
  const headings = editable.querySelectorAll('h1, h2, h4, h5, h6')
  headings.forEach((heading) => {
    const h3 = document.createElement('h3')
    h3.innerHTML = heading.innerHTML
    heading.parentNode.replaceChild(h3, heading)
  })

  // Wrap orphaned text in paragraphs
  const textNodes = []
  const walker = document.createTreeWalker(
    editable,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim() && node.parentNode === editable) {
      textNodes.push(node)
    }
  }

  textNodes.forEach((textNode) => {
    const p = document.createElement('p')
    textNode.parentNode.insertBefore(p, textNode)
    p.appendChild(textNode)
  })
}
```

### CSS
```css
.paste-log {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.paste-entry {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.paste-entry pre {
  margin: 0.5rem 0 0 0;
  font-size: 12px;
  background: #f1f3f4;
  padding: 0.5rem;
  border-radius: 3px;
  overflow-x: auto;
}
```

## Selective Paste Cleaning

Apply different cleaning rules based on content source:

```typescript
const selectiveEditor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true
  }
})

selectiveEditor.subscribe('editablePaste', (event, editable) => {
  const clipboardData = event.clipboardData || window.clipboardData
  const htmlData = clipboardData.getData('text/html')

  // Detect source and apply appropriate cleaning
  if (htmlData.includes('docs.google.com')) {
    // Google Docs content
    applyGoogleDocsCleanup(editable)
  }
  else if (htmlData.includes('urn:schemas-microsoft-com')) {
    // Microsoft Word content
    applyWordCleanup(editable)
  }
  else if (htmlData.includes('notion.so')) {
    // Notion content
    applyNotionCleanup(editable)
  }
  else {
    // Generic web content
    applyGenericCleanup(editable)
  }
})

function applyGoogleDocsCleanup(editable) {
  // Remove Google Docs specific elements
  const googleElements = editable.querySelectorAll('[class*="docs-"]')
  googleElements.forEach(el => el.removeAttribute('class'))
}

function applyWordCleanup(editable) {
  // Remove Word-specific formatting
  const wordElements = editable.querySelectorAll('[class*="Mso"]')
  wordElements.forEach(el => el.remove())
}

function applyNotionCleanup(editable) {
  // Handle Notion-specific formatting
  const notionBlocks = editable.querySelectorAll('[data-block-id]')
  notionBlocks.forEach(el => el.removeAttribute('data-block-id'))
}

function applyGenericCleanup(editable) {
  // Basic cleanup for web content
  const elements = editable.querySelectorAll('*')
  elements.forEach((el) => {
    el.removeAttribute('style')
    el.removeAttribute('class')
  })
}
```

## Paste Validation

Validate and sanitize pasted content:

```typescript
const validatedEditor = new MediumEditor('.editable', {
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true
  }
})

validatedEditor.subscribe('editablePaste', (event, editable) => {
  setTimeout(() => {
    validatePastedContent(editable)
  }, 10)
})

function validatePastedContent(editable) {
  // Check for malicious content
  const scripts = editable.querySelectorAll('script')
  scripts.forEach(script => script.remove())

  // Validate links
  const links = editable.querySelectorAll('a')
  links.forEach((link) => {
    const href = link.getAttribute('href')
    if (href && !isValidUrl(href)) {
      link.removeAttribute('href')
      link.style.color = 'red'
      link.title = 'Invalid URL removed'
    }
  })

  // Limit nesting depth
  limitNestingDepth(editable, 5)

  // Check content length
  if (editable.textContent.length > 10000) {
    alert('Pasted content is too long. Please paste smaller sections.')
    // Optionally truncate or reject the paste
  }
}

function isValidUrl(url) {
  try {
    const urlObj = new URL(url)
    return !!urlObj
  }
  catch {
    return false
  }
}

function limitNestingDepth(element, maxDepth, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    // Flatten deeply nested content
    while (element.firstChild) {
      element.parentNode.insertBefore(element.firstChild, element)
    }
    element.remove()
    return
  }

  Array.from(element.children).forEach((child) => {
    limitNestingDepth(child, maxDepth, currentDepth + 1)
  })
}
```

## Paste Analytics

Track paste behavior for insights:

```typescript
const analyticsEditor = new MediumEditor('.editable')

const pasteStats = {
  totalPastes: 0,
  plainTextPastes: 0,
  htmlPastes: 0,
  sources: {}
}

analyticsEditor.subscribe('editablePaste', (event, editable) => {
  const clipboardData = event.clipboardData || window.clipboardData
  const htmlData = clipboardData.getData('text/html')
  const textData = clipboardData.getData('text/plain')

  // Update statistics
  pasteStats.totalPastes++

  if (htmlData) {
    pasteStats.htmlPastes++

    // Detect source
    let source = 'unknown'
    if (htmlData.includes('docs.google.com'))
      source = 'google-docs'
    else if (htmlData.includes('urn:schemas-microsoft-com'))
      source = 'microsoft-word'
    else if (htmlData.includes('notion.so'))
      source = 'notion'
    else if (htmlData.includes('<meta'))
      source = 'web-page'

    pasteStats.sources[source] = (pasteStats.sources[source] || 0) + 1
  }
  else {
    pasteStats.plainTextPastes++
  }

  // Log analytics
  console.log('Paste Analytics:', pasteStats)

  // Send to analytics service
  sendAnalytics('paste_event', {
    hasHtml: !!htmlData,
    textLength: textData.length,
    source: detectSource(htmlData)
  })
})

function detectSource(htmlData) {
  if (!htmlData)
    return 'plain-text'
  if (htmlData.includes('docs.google.com'))
    return 'google-docs'
  if (htmlData.includes('urn:schemas-microsoft-com'))
    return 'microsoft-word'
  if (htmlData.includes('notion.so'))
    return 'notion'
  return 'web-content'
}

function sendAnalytics(event, data) {
  // Your analytics implementation
  console.log('Analytics Event:', event, data)
}
```

## Next Steps

- Learn about [Event Handling](/examples/events) for paste events
- Explore [Extensions](/examples/extensions) for custom paste processing
- Check out [Real-World Use Cases](/examples/real-world) for complete implementations

<script>
// Initialize demos when the page loads
if (typeof window !== 'undefined') {
  let demoInitialized = false

  function loadMediumEditor() {
    return new Promise((resolve, reject) => {
      if (typeof window.MediumEditor !== 'undefined') {
        resolve()
        return
      }

      // Load CSS first
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/medium-editor.min.css'
      document.head.appendChild(link)

      // Load theme CSS
      const themeLink = document.createElement('link')
      themeLink.rel = 'stylesheet'
      themeLink.href = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/css/themes/default.min.css'
      document.head.appendChild(themeLink)

      // Load JavaScript
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
      script.onload = () => {
        console.log('Medium Editor loaded successfully')
        resolve()
      }
      script.onerror = () => {
        console.error('Failed to load Medium Editor')
        reject(new Error('Failed to load Medium Editor'))
      }
      document.head.appendChild(script)
    })
  }

  function updateDemoStatus(demoId, status, message) {
    const statusEl = document.getElementById(`demo-status-${demoId}`)
    if (statusEl) {
      statusEl.innerHTML = `<span class="${status}">${message}</span>`
      if (status === 'success') {
        setTimeout(() => {
          statusEl.style.display = 'none'
        }, 2000)
      }
    }
  }

  function logPasteEvent(editorType, sourceType, originalLength, cleanedLength) {
    const logContainer = document.getElementById('paste-activity-log')
    if (!logContainer) return

    const logEntry = document.createElement('div')
    logEntry.className = 'log-entry'
    logEntry.innerHTML = `
      <div class="log-header">
        <span class="log-time">${new Date().toLocaleTimeString()}</span>
        <span class="log-editor">${editorType}</span>
      </div>
      <div class="log-details">
        Source: <strong>${sourceType}</strong> |
        Original: ${originalLength} chars |
        Cleaned: ${cleanedLength} chars
        ${originalLength !== cleanedLength ? `<span class="cleaned-indicator">✨ Cleaned</span>` : ''}
      </div>
    `

    // Add to top of log
    const firstChild = logContainer.firstChild
    if (firstChild && firstChild.textContent.includes('Ready to log')) {
      logContainer.removeChild(firstChild)
    }
    logContainer.insertBefore(logEntry, logContainer.firstChild)

    // Limit log entries
    while (logContainer.children.length > 10) {
      logContainer.removeChild(logContainer.lastChild)
    }
  }

  function detectPasteSource(htmlData) {
    if (!htmlData) return 'Plain Text'
    if (htmlData.includes('docs.google.com')) return 'Google Docs'
    if (htmlData.includes('urn:schemas-microsoft-com')) return 'Microsoft Word'
    if (htmlData.includes('notion.so')) return 'Notion'
    if (htmlData.includes('<meta')) return 'Web Page'
    return 'Rich Text'
  }

  function initializeDemos() {
    if (demoInitialized) return
    demoInitialized = true

    console.log('Initializing Paste demos...')

    try {
      // Clean paste editor
      const cleanEditor = document.querySelector('.demo-clean-editor')
      if (cleanEditor) {
        console.log('Initializing clean paste editor demo')
        updateDemoStatus('paste', 'loading', '🔄 Initializing editors...')

        const editor1 = new MediumEditor(cleanEditor, {
          paste: {
            forcePlainText: false,
            cleanPastedHTML: true,
            cleanAttrs: ['class', 'style', 'dir', 'id'],
            cleanTags: ['meta', 'script', 'style', 'link']
          },
          toolbar: {
            buttons: ['bold', 'italic', 'anchor']
          }
        })

        editor1.subscribe('editablePaste', (event, editable) => {
          const clipboardData = event.clipboardData || window.clipboardData
          const htmlData = clipboardData.getData('text/html')
          const textData = clipboardData.getData('text/plain')

          setTimeout(() => {
            const cleanedLength = editable.textContent.length
            logPasteEvent('Clean Editor', detectPasteSource(htmlData), textData.length, cleanedLength)
          }, 100)
        })

        console.log('Clean paste editor initialized:', editor1)
      }

      // Plain text editor
      const plainEditor = document.querySelector('.demo-plain-editor')
      if (plainEditor) {
        console.log('Initializing plain text editor demo')

        const editor2 = new MediumEditor(plainEditor, {
          paste: {
            forcePlainText: true
          },
          toolbar: {
            buttons: ['bold', 'italic']
          }
        })

        editor2.subscribe('editablePaste', (event, editable) => {
          const clipboardData = event.clipboardData || window.clipboardData
          const htmlData = clipboardData.getData('text/html')
          const textData = clipboardData.getData('text/plain')

          setTimeout(() => {
            const cleanedLength = editable.textContent.length
            logPasteEvent('Plain Text Editor', detectPasteSource(htmlData), textData.length, cleanedLength)
          }, 100)
        })

        console.log('Plain text editor initialized:', editor2)
      }

      // Custom clean editor
      const customEditor = document.querySelector('.demo-custom-editor')
      if (customEditor) {
        console.log('Initializing custom clean editor demo')

        const editor3 = new MediumEditor(customEditor, {
          paste: {
            forcePlainText: false,
            cleanPastedHTML: true,
            cleanAttrs: ['class', 'style', 'dir', 'lang', 'xml:lang'],
            cleanTags: ['meta', 'link', 'style', 'script', 'o:p', 'xml'],
            cleanReplacements: [
              // Remove Word-specific content
              [/<\/?w:[^>]*>/gi, ''],
              [/<\/?o:[^>]*>/gi, ''],
              [/\s*mso-[^:]+:[^;"]+;?/gi, ''],
              // Remove Google Docs classes
              [/\s*class="[^"]*docs-[^"]*"/gi, ''],
              // Clean up empty elements
              [/<(span|div)[^>]*>\s*<\/\1>/gi, '']
            ]
          },
          toolbar: {
            buttons: ['bold', 'italic', 'anchor', 'h3']
          }
        })

        editor3.subscribe('editablePaste', (event, editable) => {
          const clipboardData = event.clipboardData || window.clipboardData
          const htmlData = clipboardData.getData('text/html')
          const textData = clipboardData.getData('text/plain')

          setTimeout(() => {
            const cleanedLength = editable.textContent.length
            logPasteEvent('Custom Clean Editor', detectPasteSource(htmlData), textData.length, cleanedLength)
          }, 100)
        })

        updateDemoStatus('paste', 'success', '✅ All paste editors ready! Try pasting formatted content.')
        console.log('Custom clean editor initialized:', editor3)
      }

      // Clear log button
      const clearLogBtn = document.getElementById('clear-log')
      if (clearLogBtn) {
        clearLogBtn.addEventListener('click', () => {
          const logContainer = document.getElementById('paste-activity-log')
          if (logContainer) {
            logContainer.innerHTML = '<div class="log-entry">Log cleared - ready for new paste events...</div>'
          }
        })
      }

      console.log('All paste demos initialized successfully')
    } catch (error) {
      console.error('Error initializing paste demos:', error)
      updateDemoStatus('paste', 'error', '❌ Demo failed to load')
    }
  }

  // Try multiple initialization strategies
  function attemptInitialization() {
    loadMediumEditor()
      .then(() => {
        // Wait a bit for DOM to be ready
        setTimeout(initializeDemos, 100)
      })
      .catch(error => {
        console.error('Failed to load Medium Editor:', error)
        // Fallback: show message to user
        const containers = document.querySelectorAll('.demo-container')
        containers.forEach(container => {
          const errorMsg = document.createElement('div')
          errorMsg.style.cssText = 'background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;'
          errorMsg.innerHTML = '⚠️ Interactive demo temporarily unavailable. Please refresh the page to try again.'
          container.appendChild(errorMsg)
        })
      })
  }

  // Multiple initialization triggers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInitialization)
  } else {
    attemptInitialization()
  }

  // Also try after a delay in case of timing issues
  setTimeout(attemptInitialization, 1000)

  // VitePress specific initialization
  if (typeof window.__VITEPRESS__ !== 'undefined') {
    // Wait for VitePress to be ready
    setTimeout(attemptInitialization, 2000)
  }
}
</script>

<style>
.demo-container {
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.demo-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.demo-status {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.demo-status .loading {
  color: #0c5460;
  background: #d1ecf1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-status .success {
  color: #155724;
  background: #d4edda;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-status .error {
  color: #721c24;
  background: #f8d7da;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.demo-paste-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.demo-paste-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-paste-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.demo-clean-editor,
.demo-plain-editor,
.demo-custom-editor {
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 100px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  cursor: text;
  transition: all 0.3s ease;
}

.demo-clean-editor {
  border-color: #28a745;
  background: #f8fff8;
}

.demo-plain-editor {
  border-color: #6c757d;
  background: #f8f9fa;
}

.demo-custom-editor {
  border-color: #fd7e14;
  background: #fff8f0;
}

.demo-clean-editor:hover,
.demo-plain-editor:hover,
.demo-custom-editor:hover {
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.demo-clean-editor:focus,
.demo-plain-editor:focus,
.demo-custom-editor:focus {
  outline: none;
  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
}

.paste-info {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6c757d;
  background: #f8f9fa;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.paste-log-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.paste-log-container h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 2px solid #17a2b8;
  padding-bottom: 0.5rem;
}

.paste-activity-log {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 0.5rem;
  background: #f8f9fa;
  margin-bottom: 1rem;
}

.log-entry {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #17a2b8;
  font-size: 0.85rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.log-time {
  color: #6c757d;
  font-size: 0.8rem;
}

.log-editor {
  background: #e9ecef;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.log-details {
  color: #495057;
  font-size: 0.8rem;
}

.cleaned-indicator {
  color: #28a745;
  font-weight: 600;
  margin-left: 0.5rem;
}

.clear-log-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.3s ease;
}

.clear-log-btn:hover {
  background: #5a6268;
}

/* Medium Editor theme adjustments for demos */
.demo-container .medium-editor-toolbar {
  background: #343a40;
  border: 1px solid #495057;
}

.demo-container .medium-editor-action {
  color: #fff;
}

.demo-container .medium-editor-action:hover {
  background: #007bff;
}

@media (max-width: 768px) {
  .demo-paste-grid {
    grid-template-columns: 1fr;
  }
}
</style>
