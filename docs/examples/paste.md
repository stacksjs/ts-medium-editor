# Clean Paste

Control how pasted content is handled and cleaned to maintain consistent formatting.

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
      [/<p[^>]*class="?MsoNormal"?[^>]*>/gi, '<p>'],

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
  headings.forEach(heading => {
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
  while (node = walker.nextNode()) {
    if (node.nodeValue.trim() && node.parentNode === editable) {
      textNodes.push(node)
    }
  }

  textNodes.forEach(textNode => {
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
  } else if (htmlData.includes('urn:schemas-microsoft-com')) {
    // Microsoft Word content
    applyWordCleanup(editable)
  } else if (htmlData.includes('notion.so')) {
    // Notion content
    applyNotionCleanup(editable)
  } else {
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
  elements.forEach(el => {
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
  links.forEach(link => {
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
    new URL(url)
    return true
  } catch {
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

  Array.from(element.children).forEach(child => {
    limitNestingDepth(child, maxDepth, currentDepth + 1)
  })
}
```

## Paste Analytics

Track paste behavior for insights:

```typescript
const analyticsEditor = new MediumEditor('.editable')

let pasteStats = {
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
    if (htmlData.includes('docs.google.com')) source = 'google-docs'
    else if (htmlData.includes('urn:schemas-microsoft-com')) source = 'microsoft-word'
    else if (htmlData.includes('notion.so')) source = 'notion'
    else if (htmlData.includes('<meta')) source = 'web-page'

    pasteStats.sources[source] = (pasteStats.sources[source] || 0) + 1
  } else {
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
  if (!htmlData) return 'plain-text'
  if (htmlData.includes('docs.google.com')) return 'google-docs'
  if (htmlData.includes('urn:schemas-microsoft-com')) return 'microsoft-word'
  if (htmlData.includes('notion.so')) return 'notion'
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