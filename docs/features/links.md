# Links and Anchors

TypeScript Medium Editor provides comprehensive link creation and editing capabilities through the anchor button. Users can easily create, edit, and remove hyperlinks with a clean, intuitive interface.

## Overview

The anchor functionality allows users to:
- Create new links from selected text
- Edit existing links
- Remove links
- Validate URLs
- Handle different link types (external, internal, email, etc.)

## Basic Link Creation

### Using the Toolbar

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor']
  }
})
```

**User Workflow:**
1. Select text in the editor
2. Click the anchor button in the toolbar
3. Enter the URL in the prompt
4. Press Enter to create the link

### Programmatic Link Creation

```typescript
// Create a link programmatically using execAction
editor.execAction('createLink', { url: 'https://example.com' })

// Create link with the createLink method (actual implementation)
editor.createLink({
  value: 'https://example.com',
  target: '_blank',
  buttonClass: 'custom-link-class'
})
```

**Note**: The `createLink` method signature in the actual implementation is:
```typescript
createLink(opts: { value: string, target?: string, buttonClass?: string }): void
```

## Link Configuration

### Basic Anchor Configuration

```typescript
const editor = new MediumEditor('.editable', {
  anchor: {
    // Link validation
    linkValidation: true,

    // Placeholder text for URL input
    placeholderText: 'Paste or type a link',

    // Target window for links
    targetCheckbox: true,
    targetCheckboxText: 'Open in new window',

    // Custom link validation
    customClassOption: null,
    customClassOptionText: 'Button'
  }
})
```

### Advanced Anchor Options

```typescript
const editor = new MediumEditor('.editable', {
  anchor: {
    // URL validation pattern
    linkValidation: /^https?:\/\/.+/,

    // Custom placeholder
    placeholderText: 'Enter URL (https://...)',

    // Target options
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab',

    // Custom CSS class options
    customClassOption: 'btn btn-primary',
    customClassOptionText: 'Style as button',

    // URL preprocessing
    urlPreprocessor: (url: string) => {
      // Add protocol if missing
      if (!/^https?:\/\//.test(url)) {
        return `https://${url}`
      }
      return url
    }
  }
})
```

## Link Types and Validation

### URL Validation

```typescript
// Built-in validation patterns
const validationPatterns = {
  // Any URL
  any: true,

  // HTTP/HTTPS only
  web: /^https?:\/\/.+/,

  // Email addresses
  email: /^mailto:.[^\n\r@\u2028\u2029]*@.+\..+/,

  // Internal links only
  internal: /^\/[^/].*/,

  // Custom validation function
  custom: (url: string) => {
    return url.startsWith('https://') && url.includes('example.com')
  }
}

const editor = new MediumEditor('.editable', {
  anchor: {
    linkValidation: validationPatterns.web
  }
})
```

### Preprocessing URLs

```typescript
class LinkPreprocessor extends Extension {
  name = 'linkPreprocessor'

  init() {
    // Override the default URL preprocessing
    const originalCreateLink = this.base.createLink?.bind(this.base)

    this.base.createLink = (url: string, options: any = {}) => {
      const processedUrl = this.preprocessUrl(url)
      return originalCreateLink?.(processedUrl, options)
    }
  }

  private preprocessUrl(url: string): string {
    // Remove whitespace
    url = url.trim()

    // Add protocol if missing
    if (!/^https?:\/\//.test(url) && !url.startsWith('mailto:')) {
      // Check if it looks like an email
      if (url.includes('@') && url.includes('.')) {
        url = `mailto:${url}`
      }
      else {
        url = `https://${url}`
      }
    }

    // Convert to lowercase for consistency
    if (url.startsWith('http')) {
      const urlObj = new URL(url)
      urlObj.hostname = urlObj.hostname.toLowerCase()
      url = urlObj.toString()
    }

    return url
  }
}

const editor = new MediumEditor('.editable', {
  extensions: {
    linkPreprocessor: new LinkPreprocessor()
  }
})
```

## Link Editing and Management

### Editing Existing Links

```typescript
// Programmatically edit a link
function editLink(linkElement: HTMLAnchorElement, newUrl: string) {
  linkElement.href = newUrl
  linkElement.title = newUrl

  // Trigger update event
  editor.trigger('linkUpdated', { element: linkElement, url: newUrl })
}

// Listen for link edit events
editor.subscribe('linkUpdated', (event, data) => {
  console.log('Link updated:', data.url)
})
```

### Removing Links

```typescript
// Remove link formatting but keep text
function removeLink(linkElement: HTMLAnchorElement) {
  const parent = linkElement.parentNode
  const textNode = document.createTextNode(linkElement.textContent || '')

  if (parent) {
    parent.replaceChild(textNode, linkElement)
  }

  // Trigger remove event
  editor.trigger('linkRemoved', { text: linkElement.textContent })
}

// Programmatic link removal
editor.execAction('unlink')
```

### Link Detection and Auto-linking

```typescript
class AutoLinker extends Extension {
  name = 'autoLinker'

  init() {
    this.base.subscribe('editableInput', this.detectLinks.bind(this))
  }

  private detectLinks(event: Event, editable: HTMLElement) {
    const text = editable.textContent || ''
    const urlRegex = /https?:\/\/\S+/g

    let match
    const links: Array<{ url: string, start: number, end: number }> = []

    while ((match = urlRegex.exec(text)) !== null) {
      links.push({
        url: match[0],
        start: match.index,
        end: match.index + match[0].length
      })
    }

    // Convert detected URLs to links
    this.convertToLinks(editable, links)
  }

  private convertToLinks(editable: HTMLElement, links: Array<{ url: string, start: number, end: number }>) {
    // Implementation would traverse text nodes and replace URLs with links
    // This is a simplified version
    links.forEach((linkData) => {
      const linkElement = document.createElement('a')
      linkElement.href = linkData.url
      linkElement.textContent = linkData.url
      linkElement.target = '_blank'
      linkElement.rel = 'noopener noreferrer'

      // Replace text with link (simplified)
      // In practice, you'd need to handle text node traversal
    })
  }
}
```

## Link Styling and Appearance

### Default Link Styles

```css
/* Basic link styling */
.medium-editor-element a {
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
}

.medium-editor-element a:hover {
  color: #2980b9;
  text-decoration: none;
}

.medium-editor-element a:visited {
  color: #8e44ad;
}

/* Link being edited */
.medium-editor-element a.medium-editor-link-editing {
  background-color: #f39c12;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
}
```

### Custom Link Styles

```css
/* Button-style links */
.medium-editor-element a.btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.medium-editor-element a.btn:hover {
  background-color: #2980b9;
}

/* External link indicators */
.medium-editor-element a[target="_blank"]:after {
  content: " ↗";
  font-size: 0.8em;
  opacity: 0.7;
}

/* Email link styling */
.medium-editor-element a[href^="mailto:"]:before {
  content: "✉ ";
  opacity: 0.7;
}
```

## Advanced Link Features

### Link Analytics and Tracking

```typescript
class LinkTracker extends Extension {
  name = 'linkTracker'

  init() {
    this.base.subscribe('linkCreated', this.trackLinkCreation.bind(this))
    this.setupLinkClickTracking()
  }

  private trackLinkCreation(event: Event, data: any) {
    // Track link creation
    this.sendAnalytics('link_created', {
      url: data.url,
      text: data.text,
      timestamp: Date.now()
    })
  }

  private setupLinkClickTracking() {
    this.base.elements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (target.tagName === 'A') {
          const link = target as HTMLAnchorElement
          this.trackLinkClick(link)
        }
      })
    })
  }

  private trackLinkClick(link: HTMLAnchorElement) {
    this.sendAnalytics('link_clicked', {
      url: link.href,
      text: link.textContent,
      target: link.target,
      timestamp: Date.now()
    })
  }

  private sendAnalytics(event: string, data: any) {
    // Send to analytics service
    console.log('Analytics:', event, data)
  }
}
```

### Link Preview and Validation

```typescript
class LinkPreview extends Extension {
  name = 'linkPreview'
  private previewElement: HTMLElement | null = null

  init() {
    this.base.subscribe('linkCreated', this.showPreview.bind(this))
    this.createPreviewElement()
  }

  private createPreviewElement() {
    this.previewElement = document.createElement('div')
    this.previewElement.className = 'link-preview'
    this.previewElement.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      max-width: 300px;
      display: none;
    `
    document.body.appendChild(this.previewElement)
  }

  private async showPreview(event: Event, data: { url: string, element: HTMLElement }) {
    if (!this.previewElement)
      return

    try {
      const preview = await this.fetchLinkPreview(data.url)
      this.displayPreview(preview, data.element)
    }
    catch (error) {
      console.error('Failed to fetch link preview:', error)
    }
  }

  private async fetchLinkPreview(url: string): Promise<LinkPreviewData> {
    // In a real implementation, this would call a backend service
    // that fetches and parses the URL for metadata
    const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
    return response.json()
  }

  private displayPreview(preview: LinkPreviewData, linkElement: HTMLElement) {
    if (!this.previewElement)
      return

    this.previewElement.innerHTML = `
      <div class="preview-title">${preview.title || 'No title'}</div>
      <div class="preview-description">${preview.description || ''}</div>
      <div class="preview-url">${preview.url}</div>
    `

    // Position near the link
    const rect = linkElement.getBoundingClientRect()
    this.previewElement.style.left = `${rect.left}px`
    this.previewElement.style.top = `${rect.bottom + 5}px`
    this.previewElement.style.display = 'block'

    // Hide after delay
    setTimeout(() => {
      if (this.previewElement) {
        this.previewElement.style.display = 'none'
      }
    }, 3000)
  }

  destroy() {
    if (this.previewElement) {
      this.previewElement.remove()
    }
  }
}

interface LinkPreviewData {
  title?: string
  description?: string
  url: string
  image?: string
}
```

## Accessibility and SEO

### Accessible Link Practices

```typescript
class AccessibleLinks extends Extension {
  name = 'accessibleLinks'

  init() {
    this.base.subscribe('linkCreated', this.enhanceAccessibility.bind(this))
  }

  private enhanceAccessibility(event: Event, data: { element: HTMLAnchorElement, url: string }) {
    const link = data.element

    // Add descriptive title if missing
    if (!link.title) {
      link.title = this.generateLinkTitle(data.url)
    }

    // Add rel attributes for external links
    if (this.isExternalLink(data.url)) {
      link.rel = 'noopener noreferrer'

      // Add screen reader text for external links
      const srText = document.createElement('span')
      srText.className = 'sr-only'
      srText.textContent = ' (opens in new tab)'
      link.appendChild(srText)
    }

    // Ensure sufficient color contrast
    this.ensureColorContrast(link)
  }

  private generateLinkTitle(url: string): string {
    try {
      const urlObj = new URL(url)
      return `Visit ${urlObj.hostname}`
    }
    catch {
      return 'External link'
    }
  }

  private isExternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname !== window.location.hostname
    }
    catch {
      return false
    }
  }

  private ensureColorContrast(link: HTMLAnchorElement) {
    // Add high-contrast class if needed
    const computedStyle = window.getComputedStyle(link)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor

    // Simple contrast check (in practice, use a proper contrast ratio calculation)
    if (this.hasLowContrast(color, backgroundColor)) {
      link.classList.add('high-contrast-link')
    }
  }

  private hasLowContrast(color: string, backgroundColor: string): boolean {
    // Simplified contrast check
    // In practice, implement proper WCAG contrast ratio calculation
    return false
  }
}
```

## Troubleshooting

### Common Link Issues

**Links not working:**
```typescript
// Check if anchor extension is enabled
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'anchor'] // Ensure 'anchor' is included
  }
})

// Verify link creation
editor.subscribe('linkCreated', (event, data) => {
  console.log('Link created:', data)
})
```

**URL validation failing:**
```typescript
// Debug URL validation
const editor = new MediumEditor('.editable', {
  anchor: {
    linkValidation: (url: string) => {
      console.log('Validating URL:', url)
      const isValid = /^https?:\/\/.+/.test(url)
      console.log('Is valid:', isValid)
      return isValid
    }
  }
})
```

**Link styling issues:**
```css
/* Ensure link styles are applied */
.medium-editor-element a {
  color: #3498db !important;
  text-decoration: underline !important;
}

/* Check for conflicting styles */
.medium-editor-element a:not([class]) {
  /* Styles for links without classes */
}
```

## Next Steps

- Learn about [Events](/features/events) for link interaction handling
- Explore [Extensions](/extensions) for advanced link features
- Check out [Text Formatting](/features/formatting) for link appearance customization
- See [API Reference](/api) for complete link methods
