# Auto-Link Detection

Automatically convert URLs to clickable links as users type.

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
    linkValidation: function(value) {
      // Custom validation for email links
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

  links.forEach(link => {
    const href = link.getAttribute('href')

    // Add social media classes
    if (href.includes('twitter.com')) {
      link.classList.add('twitter-link')
    } else if (href.includes('linkedin.com')) {
      link.classList.add('linkedin-link')
    } else if (href.includes('github.com')) {
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

.twitter-link:hover,
.linkedin-link:hover,
.github-link:hover {
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

  links.forEach(link => {
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

  links.forEach(link => {
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
  preview.style.left = rect.left + 'px'
  preview.style.top = (rect.bottom + 10) + 'px'

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

  codeBlocks.forEach(block => {
    // Remove auto-generated links inside code blocks
    const links = block.querySelectorAll('a')
    links.forEach(link => {
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