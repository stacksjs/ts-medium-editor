# Auto-Link Detection

Automatically convert URLs to clickable links as users type.

## Interactive Demo

::: tip Try the Auto-Link Features
Type or paste URLs, email addresses, and social media links in the editors below to see automatic link detection in action.
:::

<div class="demo-container">
  <div class="demo-label">Auto-link detection in action - Type URLs and emails:</div>
  <div class="demo-status" id="demo-status-autolink">
    <span class="loading">🔄 Loading interactive demo...</span>
  </div>
  <div class="demo-autolink-grid">
    <div class="demo-autolink-card">
      <h4>🔗 Basic Auto-Link</h4>
      <div class="demo-basic-autolink" data-placeholder="Type: https://example.com or user@email.com" contenteditable="true">
        <p>Try typing: https://github.com or contact@example.com</p>
        <p>Email test: support@company.org</p>
      </div>
      <div class="autolink-info">Detects URLs and email addresses automatically</div>
    </div>
    <div class="demo-autolink-card">
      <h4>🎨 Social Media Links</h4>
      <div class="demo-social-autolink" data-placeholder="Type social media URLs..." contenteditable="true">
        <p>Follow us: https://twitter.com/handle</p>
        <p>Connect: https://linkedin.com/company/name</p>
      </div>
      <div class="autolink-info">Auto-styles Twitter, LinkedIn, GitHub links</div>
    </div>
    <div class="demo-autolink-card">
      <h4>👁️ Link Preview</h4>
      <div class="demo-preview-autolink" data-placeholder="Type URLs to see previews..." contenteditable="true">
        <p>Hover over: https://docs.github.com</p>
      </div>
      <div class="autolink-info">Shows link previews on hover</div>
    </div>
  </div>
  <div class="link-stats-container">
    <h4>📊 Link Detection Stats</h4>
    <div class="link-stats">
      <div class="stat-item">
        <span class="stat-label">URLs Detected:</span>
        <span class="stat-value" id="url-count">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Emails Detected:</span>
        <span class="stat-value" id="email-count">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Social Links:</span>
        <span class="stat-value" id="social-count">0</span>
      </div>
    </div>
    <button id="reset-stats" class="reset-stats-btn">Reset Stats</button>
  </div>
</div>

<div id="link-preview-tooltip" class="link-preview-tooltip" style="display: none;">
  <div class="preview-header">
    <span class="preview-icon">🔗</span>
    <span class="preview-title">Link Preview</span>
  </div>
  <div class="preview-url"></div>
  <div class="preview-description">Click to visit this link</div>
</div>

## Basic Auto-Link

Enable automatic URL detection:

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})
```

### What Gets Auto-Linked

The editor automatically detects and converts:
- `https://example.com` → becomes a clickable link
- `http://example.com` → becomes a clickable link
- `www.example.com` → becomes a clickable link
- `example@email.com` → becomes a mailto link

## Advanced Link Configuration

Customize link behavior and validation:

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true,
  anchor: {
    linkValidation: true,
    placeholderText: 'Paste or type a link',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new window',
    customClassOption: 'custom-link',
    customClassOptionText: 'Custom Link Style'
  },
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})
```

## Email Auto-Link Example

### HTML
```html
<div class="email-editor" data-placeholder="Type email addresses...">
  <p>Contact us at support@example.com or sales@company.org</p>
  <p>You can also reach our team lead at john.doe@example.com</p>
</div>
```

### TypeScript
```typescript
const emailEditor = new MediumEditor('.email-editor', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic']
  },
  // Custom email validation
  anchor: {
    linkValidation(value) {
      // Custom validation for email links
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
      const urlRegex = /^https?:\/\/.+/
      return emailRegex.test(value) || urlRegex.test(value)
    }
  }
})
```

## Social Media Links

Automatically detect and style social media links:

### HTML
```html
<div class="social-editor" data-placeholder="Share your social links...">
  <p>Follow us on:</p>
  <ul>
    <li>Twitter: https://twitter.com/yourhandle</li>
    <li>LinkedIn: https://linkedin.com/company/yourcompany</li>
    <li>GitHub: https://github.com/yourusername</li>
  </ul>
</div>
```

### TypeScript
```typescript
const socialEditor = new MediumEditor('.social-editor', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})

// Add custom styling for social links
socialEditor.subscribe('editableInput', (event, editable) => {
  const links = editable.querySelectorAll('a')

  links.forEach((link) => {
    const href = link.getAttribute('href')

    // Add social media classes
    if (href.includes('twitter.com')) {
      link.classList.add('twitter-link')
    }
    else if (href.includes('linkedin.com')) {
      link.classList.add('linkedin-link')
    }
    else if (href.includes('github.com')) {
      link.classList.add('github-link')
    }
  })
})
```

### CSS
```css
.twitter-link {
  color: #1da1f2;
  text-decoration: none;
  font-weight: bold;
}

.linkedin-link {
  color: #0077b5;
  text-decoration: none;
  font-weight: bold;
}

.github-link {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.email-link {
  color: #dc3545;
  text-decoration: none;
  font-weight: 500;
}

.email-link::before {
  content: "📧 ";
  font-size: 0.9em;
}

.twitter-link:hover,
.linkedin-link:hover,
.github-link:hover,
.email-link:hover {
  text-decoration: underline;
}
```

## Custom Link Processing

Process links after they're created:

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true,
  targetBlank: true // Open links in new window
})

// Custom link processing
editor.subscribe('editableInput', (event, editable) => {
  const links = editable.querySelectorAll('a')

  links.forEach((link) => {
    const href = link.getAttribute('href')

    // Add security attributes for external links
    if (href && (href.startsWith('http') || href.startsWith('https'))) {
      link.setAttribute('rel', 'noopener noreferrer')
      link.setAttribute('target', '_blank')
    }

    // Add tracking for analytics
    link.addEventListener('click', (e) => {
      console.log('Link clicked:', href)
      // Add your analytics tracking here
    })
  })
})
```

## Link Preview

Show link previews when hovering:

### HTML
```html
<div class="preview-editor" data-placeholder="Add links to see previews...">
  <p>Check out this article: https://example.com/great-article</p>
  <p>Or visit our homepage: https://yoursite.com</p>
</div>

<div id="link-preview" class="link-preview" style="display: none;">
  <div class="preview-content">
    <div class="preview-title"></div>
    <div class="preview-description"></div>
    <div class="preview-url"></div>
  </div>
</div>
```

### TypeScript
```typescript
const previewEditor = new MediumEditor('.preview-editor', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})

// Add link preview functionality
previewEditor.subscribe('editableInput', (event, editable) => {
  const links = editable.querySelectorAll('a')

  links.forEach((link) => {
    link.addEventListener('mouseenter', showLinkPreview)
    link.addEventListener('mouseleave', hideLinkPreview)
  })
})

function showLinkPreview(event) {
  const link = event.target
  const href = link.getAttribute('href')
  const preview = document.getElementById('link-preview')

  // Position preview near the link
  const rect = link.getBoundingClientRect()
  preview.style.left = `${rect.left}px`
  preview.style.top = `${rect.bottom + 10}px`

  // Update preview content
  document.querySelector('.preview-title').textContent = link.textContent
  document.querySelector('.preview-description').textContent = 'Click to visit this link'
  document.querySelector('.preview-url').textContent = href

  preview.style.display = 'block'
}

function hideLinkPreview() {
  document.getElementById('link-preview').style.display = 'none'
}
```

### CSS
```css
.link-preview {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  z-index: 1000;
}

.preview-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.preview-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.preview-url {
  color: #007bff;
  font-size: 12px;
  word-break: break-all;
}
```

## Disable Auto-Link for Specific Content

Selectively disable auto-linking:

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true,
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})

// Disable auto-link for code blocks
editor.subscribe('editableInput', (event, editable) => {
  const codeBlocks = editable.querySelectorAll('pre, code')

  codeBlocks.forEach((block) => {
    // Remove auto-generated links inside code blocks
    const links = block.querySelectorAll('a')
    links.forEach((link) => {
      const textNode = document.createTextNode(link.textContent)
      link.parentNode.replaceChild(textNode, link)
    })
  })
})
```

## Link Analytics

Track link creation and clicks:

```typescript
const editor = new MediumEditor('.editable', {
  autoLink: true
})

// Track when links are auto-created
let linkCount = 0

editor.subscribe('editableInput', (event, editable) => {
  const currentLinks = editable.querySelectorAll('a').length

  if (currentLinks > linkCount) {
    console.log('New link auto-created')
    // Send analytics event
    trackEvent('auto_link_created', {
      editor_id: 'main_editor',
      link_count: currentLinks
    })
  }

  linkCount = currentLinks
})

// Track link clicks
editor.subscribe('editableClick', (event) => {
  if (event.target.tagName === 'A') {
    const href = event.target.getAttribute('href')
    console.log('Link clicked:', href)

    trackEvent('link_clicked', {
      url: href,
      text: event.target.textContent
    })
  }
})

function trackEvent(eventName, data) {
  // Your analytics implementation
  console.log('Analytics:', eventName, data)
}
```

## Next Steps

- Learn about [Clean Paste](/examples/paste) for handling pasted links
- Explore [Event Handling](/examples/events) for link interactions
- Check out [Extensions](/examples/extensions) for custom link processing

<script>
// Initialize demos when the page loads
if (typeof window !== 'undefined') {
  let demoInitialized = false
  let linkStats = {
    urls: 0,
    emails: 0,
    social: 0
  }
  let emailProcessingTimeouts = new Map() // Store timeouts for each editor
  let urlProcessingTimeouts = new Map() // Store timeouts for URL processing

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

  function updateLinkStats() {
    document.getElementById('url-count').textContent = linkStats.urls
    document.getElementById('email-count').textContent = linkStats.emails
    document.getElementById('social-count').textContent = linkStats.social
  }

    function detectLinkType(href) {
    if (!href) return null

    // Check for mailto links (emails)
    if (href.startsWith('mailto:') || (href.includes('@') && !href.startsWith('http'))) {
      return 'emails'
    }

    // Check for social media links
    if (href.includes('twitter.com') || href.includes('linkedin.com') || href.includes('github.com')) {
      return 'social'
    }

    // Check for regular URLs
    if (href.startsWith('http') || href.startsWith('https') || href.startsWith('www.')) {
      return 'urls'
    }

    return null
  }

    function countLinks(editable) {
    const links = editable.querySelectorAll('a')
    const counts = { urls: 0, emails: 0, social: 0 }

    links.forEach((link) => {
      const href = link.getAttribute('href')
      const type = detectLinkType(href)
      if (type && counts[type] !== undefined) {
        counts[type]++
      }
    })

    return counts
  }

      function convertURLsToLinks(editable) {
    // URL regex pattern - require at least 3 characters in TLD to avoid premature matching
    const urlRegex = /\b(?:https?:\/\/|www\.)[A-Za-z0-9.-]+\.[A-Za-z]{3,}(?:\/[^\s]*)?/g

    // Get all text nodes that aren't already in links
    const walker = document.createTreeWalker(
      editable,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip if already inside a link or if parent is a link
          if (node.parentNode.tagName === 'A' || node.parentNode.closest('a')) {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        }
      },
      false
    )

    const textNodes = []
    let node
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) {
        textNodes.push(node)
      }
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent
      if (urlRegex.test(text)) {
        const newHTML = text.replace(urlRegex, (match) => {
          // Add protocol if missing
          const href = match.startsWith('www.') ? `https://${match}` : match
          return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`
        })
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = newHTML

        // Replace the text node with the new HTML
        const fragment = document.createDocumentFragment()
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild)
        }
        textNode.parentNode.replaceChild(fragment, textNode)
      }
    })
  }

  function convertEmailsToLinks(editable) {
    // Email regex pattern - require at least 3 characters in TLD to avoid premature matching
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{3,}\b/g

    // Get all text nodes that aren't already in links
    const walker = document.createTreeWalker(
      editable,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip if already inside a link or if parent is a link
          if (node.parentNode.tagName === 'A' || node.parentNode.closest('a')) {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        }
      },
      false
    )

    const textNodes = []
    let node
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) {
        textNodes.push(node)
      }
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent
      if (emailRegex.test(text)) {
        const newHTML = text.replace(emailRegex, '<a href="mailto:$&" class="email-link">$&</a>')
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = newHTML

        // Replace the text node with the new HTML
        const fragment = document.createDocumentFragment()
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild)
        }
        textNode.parentNode.replaceChild(fragment, textNode)
      }
    })
  }

    function forceAutoLinkProcessing(editable, editor) {
    // Force Medium Editor to process auto-links by triggering its internal mechanisms
    if (editor && editor.checkContentChanged) {
      editor.checkContentChanged()
    }

    // Save current selection
    const savedSelection = editor ? editor.exportSelection() : null

    // Method 1: Trigger input events
    const inputEvent = new Event('input', { bubbles: true, cancelable: true })
    editable.dispatchEvent(inputEvent)

    // Method 2: Trigger keyup events (which often trigger auto-link)
    const keyupEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: ' ',
      code: 'Space'
    })
    editable.dispatchEvent(keyupEvent)

    // Method 3: Simulate a small content change to trigger auto-link detection
    const textNode = document.createTextNode(' ')
    editable.appendChild(textNode)

    // Trigger events after adding content
    editable.dispatchEvent(new Event('input', { bubbles: true }))

    // Remove the temporary content
    editable.removeChild(textNode)

    // Method 4: Force Medium Editor's internal content processing
    if (editor && editor.trigger) {
      editor.trigger('editableInput', null, editable)
    }

    // Restore selection
    if (savedSelection && editor) {
      try {
        editor.importSelection(savedSelection)
      } catch (e) {
        // Selection restoration failed, ignore
      }
    }
  }

    function debouncedURLProcessing(editable, editor, delay = 600) {
    // Get a unique key for this editor
    const editorKey = editor ? editor.elements[0].id || 'url-editor' : 'url-default'

    // Clear existing timeout for this editor
    if (urlProcessingTimeouts.has(editorKey)) {
      clearTimeout(urlProcessingTimeouts.get(editorKey))
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      convertURLsToLinks(editable)
      applySocialStyling(editable)
      addLinkEventListeners(editable)

      // Update stats after URL processing
      const counts = countLinks(editable)
      linkStats.urls = counts.urls
      linkStats.emails = counts.emails
      linkStats.social = counts.social
      updateLinkStats()

      urlProcessingTimeouts.delete(editorKey)
    }, delay)

    urlProcessingTimeouts.set(editorKey, timeoutId)
  }

  function debouncedEmailProcessing(editable, editor, delay = 800) {
    // Get a unique key for this editor
    const editorKey = editor ? editor.elements[0].id || 'editor' : 'default'

    // Clear existing timeout for this editor
    if (emailProcessingTimeouts.has(editorKey)) {
      clearTimeout(emailProcessingTimeouts.get(editorKey))
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      convertEmailsToLinks(editable)

      // Update stats after email processing
      const counts = countLinks(editable)
      linkStats.urls = counts.urls
      linkStats.emails = counts.emails
      linkStats.social = counts.social
      updateLinkStats()

      emailProcessingTimeouts.delete(editorKey)
    }, delay)

    emailProcessingTimeouts.set(editorKey, timeoutId)
  }

  function cleanupLinkPreviews() {
    // Hide any visible previews
    hideLinkPreview()

    // Remove duplicate preview elements if they exist
    const existingPreviews = document.querySelectorAll('.link-preview-tooltip')
    if (existingPreviews.length > 1) {
      for (let i = 1; i < existingPreviews.length; i++) {
        existingPreviews[i].remove()
      }
    }
  }

  function processAllLinksImmediate(editable) {
    // Clean up any existing previews first
    cleanupLinkPreviews()

    // Process all content immediately without debouncing
    convertURLsToLinks(editable)
    convertEmailsToLinks(editable)
    applySocialStyling(editable)
    addLinkEventListeners(editable)
    updateLinkStats()
  }

    function processAllLinks(editable, editor = null, skipDebounce = false) {
    // Convert URLs and emails to links (with debouncing for real-time typing)
    if (skipDebounce) {
      // Immediate processing for page load
      convertURLsToLinks(editable)
      convertEmailsToLinks(editable)
      applySocialStyling(editable)
      addLinkEventListeners(editable)

      // Update all stats immediately
      const counts = countLinks(editable)
      linkStats.urls = counts.urls
      linkStats.emails = counts.emails
      linkStats.social = counts.social
      updateLinkStats()
    } else {
      // Debounced processing for real-time typing
      debouncedURLProcessing(editable, editor)
      debouncedEmailProcessing(editable, editor)
    }
  }

  function addLinkEventListeners(editable) {
    const links = editable.querySelectorAll('a')
    links.forEach((link) => {
      // Skip if already has our event listeners
      if (link.hasAttribute('data-preview-enabled')) {
        return
      }

      // Mark as having preview enabled
      link.setAttribute('data-preview-enabled', 'true')

      // Add event listeners
      link.addEventListener('mouseenter', showLinkPreview)
      link.addEventListener('mouseleave', hideLinkPreview)
    })
  }

  function applySocialStyling(editable) {
    const links = editable.querySelectorAll('a')

    links.forEach((link) => {
      const href = link.getAttribute('href')

      // Remove existing social classes
      link.classList.remove('twitter-link', 'linkedin-link', 'github-link')

      // Add appropriate social media classes
      if (href && href.includes('twitter.com')) {
        link.classList.add('twitter-link')
      } else if (href && href.includes('linkedin.com')) {
        link.classList.add('linkedin-link')
      } else if (href && href.includes('github.com')) {
        link.classList.add('github-link')
      }
    })
  }

    function showLinkPreview(event) {
    const link = event.target
    const href = link.getAttribute('href')
    const preview = document.getElementById('link-preview-tooltip')

    if (!preview || !href) return

    // Hide any existing previews first
    hideLinkPreview()

    // Position preview near the link with proper scroll offset
    const rect = link.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    // Calculate position relative to the document
    const left = rect.left + scrollLeft
    const top = rect.bottom + scrollTop + 10

    // Ensure tooltip doesn't go off-screen
    const previewWidth = 300 // max-width from CSS
    const viewportWidth = window.innerWidth

    let finalLeft = left
    if (left + previewWidth > viewportWidth) {
      finalLeft = viewportWidth - previewWidth - 20 // 20px margin
    }
    if (finalLeft < 10) {
      finalLeft = 10 // minimum 10px from left edge
    }

    preview.style.position = 'absolute'
    preview.style.left = `${finalLeft}px`
    preview.style.top = `${top}px`

    // Update preview content
    const urlElement = preview.querySelector('.preview-url')
    if (urlElement) {
      urlElement.textContent = href
    }

    // Store reference to current link for cleanup
    preview.setAttribute('data-current-link', link.href)

    // Show preview
    preview.style.display = 'block'
  }

  function hideLinkPreview() {
    const preview = document.getElementById('link-preview-tooltip')
    if (preview) {
      preview.style.display = 'none'
      preview.removeAttribute('data-current-link')
    }
  }

  function initializeDemos() {
    if (demoInitialized) return
    demoInitialized = true

    console.log('Initializing Auto-Link demos...')

    try {
      // Basic auto-link editor
      const basicEditor = document.querySelector('.demo-basic-autolink')
      if (basicEditor) {
        console.log('Initializing basic auto-link editor demo')
        updateDemoStatus('autolink', 'loading', '🔄 Initializing editors...')

        const editor1 = new MediumEditor(basicEditor, {
          autoLink: true,
          toolbar: {
            buttons: ['bold', 'italic', 'anchor']
          },
          anchor: {
            linkValidation: true
          }
        })

        // Process links on input (with debounced processing)
        editor1.subscribe('editableInput', (event, editable) => {
          // Use debounced processing to avoid cursor jumping
          setTimeout(() => {
            processAllLinks(editable, editor1, false) // Use debounced processing
          }, 150)
        })

        // Process on keyup for immediate detection
        editor1.subscribe('editableKeyup', (event, editable) => {
          setTimeout(() => {
            processAllLinks(editable, editor1, false) // Use debounced processing
          }, 100)
        })

        // Process on focus to handle initial content
        editor1.subscribe('focus', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Process on blur to ensure everything is finalized
        editor1.subscribe('blur', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Initial processing - multiple approaches
        setTimeout(() => {
          processAllLinksImmediate(basicEditor)
        }, 300)

        setTimeout(() => {
          // Force Medium Editor to process existing content
          if (editor1.checkContentChanged) {
            editor1.checkContentChanged()
          }
          processAllLinksImmediate(basicEditor)
        }, 600)

        setTimeout(() => {
          // Final processing to ensure everything is handled
          processAllLinksImmediate(basicEditor)
        }, 1200)

        console.log('Basic auto-link editor initialized:', editor1)
      }

      // Social media auto-link editor
      const socialEditor = document.querySelector('.demo-social-autolink')
      if (socialEditor) {
        console.log('Initializing social auto-link editor demo')

        const editor2 = new MediumEditor(socialEditor, {
          autoLink: true,
          toolbar: {
            buttons: ['bold', 'italic', 'anchor']
          },
          anchor: {
            linkValidation: true
          }
        })

        // Process links on input (with debounced processing)
        editor2.subscribe('editableInput', (event, editable) => {
          setTimeout(() => {
            processAllLinks(editable, editor2, false) // Use debounced processing
          }, 150)
        })

        // Process on keyup for immediate detection
        editor2.subscribe('editableKeyup', (event, editable) => {
          setTimeout(() => {
            processAllLinks(editable, editor2, false) // Use debounced processing
          }, 100)
        })

        // Process on focus to handle initial content
        editor2.subscribe('focus', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Process on blur to ensure everything is finalized
        editor2.subscribe('blur', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Initial processing - multiple approaches
        setTimeout(() => {
          processAllLinksImmediate(socialEditor)
        }, 300)

        setTimeout(() => {
          if (editor2.checkContentChanged) {
            editor2.checkContentChanged()
          }
          processAllLinksImmediate(socialEditor)
        }, 600)

        setTimeout(() => {
          processAllLinksImmediate(socialEditor)
        }, 1200)

        console.log('Social auto-link editor initialized:', editor2)
      }

      // Preview auto-link editor
      const previewEditor = document.querySelector('.demo-preview-autolink')
      if (previewEditor) {
        console.log('Initializing preview auto-link editor demo')

                const editor3 = new MediumEditor(previewEditor, {
          autoLink: true,
          toolbar: {
            buttons: ['bold', 'italic', 'anchor']
          },
          anchor: {
            linkValidation: true
          }
        })

        // Process links on input (with debounced processing)
        editor3.subscribe('editableInput', (event, editable) => {
          setTimeout(() => {
            processAllLinks(editable, editor3, false) // Use debounced processing
          }, 150)
        })

        // Process on keyup for immediate detection
        editor3.subscribe('editableKeyup', (event, editable) => {
          setTimeout(() => {
            processAllLinks(editable, editor3, false) // Use debounced processing
          }, 100)
        })

        // Process on focus to handle initial content
        editor3.subscribe('focus', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Process on blur to ensure everything is finalized
        editor3.subscribe('blur', (event, editable) => {
          setTimeout(() => {
            processAllLinksImmediate(editable)
          }, 50)
        })

        // Initial processing - multiple approaches
        setTimeout(() => {
          processAllLinksImmediate(previewEditor)
        }, 300)

        setTimeout(() => {
          if (editor3.checkContentChanged) {
            editor3.checkContentChanged()
          }
          processAllLinksImmediate(previewEditor)
        }, 600)

        setTimeout(() => {
          processAllLinksImmediate(previewEditor)
        }, 1200)

        updateDemoStatus('autolink', 'success', '✅ All auto-link editors ready! Start typing URLs and emails.')
        console.log('Preview auto-link editor initialized:', editor3)
      }

      // Reset stats button
      const resetStatsBtn = document.getElementById('reset-stats')
      if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
          linkStats = { urls: 0, emails: 0, social: 0 }
          updateLinkStats()

          // Clear all editors
          const editors = ['.demo-basic-autolink', '.demo-social-autolink', '.demo-preview-autolink']
          editors.forEach((selector) => {
            const editor = document.querySelector(selector)
            if (editor) {
              editor.innerHTML = '<p>Ready for new links...</p>'
            }
          })
        })
      }

      // Initialize stats display
      updateLinkStats()

      // Add global click handler to hide previews
      document.addEventListener('click', (event) => {
        const preview = document.getElementById('link-preview-tooltip')
        if (preview && preview.style.display === 'block') {
          // Hide preview if clicking outside of it and not on a link
          if (!event.target.closest('a') && !event.target.closest('#link-preview-tooltip')) {
            hideLinkPreview()
          }
        }
      })

      // Final initialization pass to ensure all links are processed
      setTimeout(() => {
        const allEditors = [
          { element: basicEditor, editor: editor1 },
          { element: socialEditor, editor: editor2 },
          { element: previewEditor, editor: editor3 }
        ]

        allEditors.forEach(({ element, editor }) => {
          if (element && editor) {
            // Force Medium Editor to process existing content
            if (editor.checkContentChanged) {
              editor.checkContentChanged()
            }
            processAllLinksImmediate(element) // Use immediate processing for final initialization
          }
        })

        console.log('Final auto-link processing completed')
      }, 1000)

      console.log('All auto-link demos initialized successfully')
    } catch (error) {
      console.error('Error initializing auto-link demos:', error)
      updateDemoStatus('autolink', 'error', '❌ Demo failed to load')
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

.demo-autolink-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.demo-autolink-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-autolink-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.demo-basic-autolink,
.demo-social-autolink,
.demo-preview-autolink {
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  min-height: 100px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  cursor: text;
  transition: all 0.3s ease;
}

.demo-basic-autolink {
  border-color: #007bff;
  background: #f8f9ff;
}

.demo-social-autolink {
  border-color: #e83e8c;
  background: #fdf2f8;
}

.demo-preview-autolink {
  border-color: #20c997;
  background: #f0fdf9;
}

.demo-basic-autolink:hover,
.demo-social-autolink:hover,
.demo-preview-autolink:hover {
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.demo-basic-autolink:focus,
.demo-social-autolink:focus,
.demo-preview-autolink:focus {
  outline: none;
  box-shadow: 0 0 0 0.3rem rgba(0, 123, 255, 0.25);
}

.autolink-info {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6c757d;
  background: #f8f9fa;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.link-stats-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.link-stats-container h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #495057;
  border-bottom: 2px solid #28a745;
  padding-bottom: 0.5rem;
}

.link-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #28a745;
}

.reset-stats-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.3s ease;
}

.reset-stats-btn:hover {
  background: #5a6268;
}

.link-preview-tooltip {
  position: absolute;
  background: #343a40;
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  max-width: 300px;
  font-size: 0.85rem;
  pointer-events: none;
  white-space: nowrap;
}

.link-preview-tooltip::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #343a40;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.preview-icon {
  font-size: 1rem;
}

.preview-url {
  color: #17a2b8;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
  margin-bottom: 0.25rem;
}

.preview-description {
  color: #adb5bd;
  font-size: 0.75rem;
}

/* General link styling for demo editors */
.demo-basic-autolink a,
.demo-social-autolink a,
.demo-preview-autolink a {
  color: #007bff !important;
  text-decoration: none;
  font-weight: 500;
}

.demo-basic-autolink a:hover,
.demo-social-autolink a:hover,
.demo-preview-autolink a:hover {
  text-decoration: underline !important;
}

/* Email link styling */
a[href^="mailto:"] {
  color: #dc3545 !important;
  text-decoration: none;
  font-weight: bold;
}

a[href^="mailto:"]:hover {
  text-decoration: underline !important;
}

a[href^="mailto:"]:before {
  content: "📧 ";
  font-size: 0.9em;
}

/* Social media link styling */
.twitter-link {
  color: #1da1f2 !important;
  text-decoration: none;
  font-weight: bold;
}

.linkedin-link {
  color: #0077b5 !important;
  text-decoration: none;
  font-weight: bold;
}

.github-link {
  color: #333 !important;
  text-decoration: none;
  font-weight: bold;
}

.twitter-link:hover,
.linkedin-link:hover,
.github-link:hover {
  text-decoration: underline !important;
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
  .demo-autolink-grid {
    grid-template-columns: 1fr;
  }

  .link-stats {
    grid-template-columns: 1fr;
  }
}
</style>
