# Placeholder

The placeholder feature provides helpful hint text that appears when the editor is empty, guiding users on what to write. It's similar to the placeholder attribute on input elements but designed specifically for rich text editors.

## Overview

The placeholder extension shows customizable text when the editor has no content, automatically hiding when the user starts typing. It provides a clean, professional way to guide users and improve the editing experience.

## Basic Usage

```typescript
import { MediumEditor } from 'ts-medium-editor'

const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Tell your story...'
  }
})
```

## Configuration Options

### Basic Configuration

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    // The text to display when editor is empty
    text: 'Start writing your article...',

    // Hide placeholder when editor is clicked (default: true)
    hideOnClick: true
  }
})
```

**Note**: The current implementation only supports `text` and `hideOnClick` options. The `hideOnFocus` option is not implemented in the source code.

## HTML Attribute Method

You can also set placeholder text using HTML data attributes:

```html
<div class="editable" data-placeholder="Write something amazing...">
</div>
```

```typescript
// The editor will automatically use the data-placeholder attribute
const editor = new MediumEditor('.editable')
```

## Multiple Editors with Different Placeholders

```html
<div class="editable" data-placeholder="Write your title..."></div>
<div class="editable" data-placeholder="Tell your story..."></div>
<div class="editable" data-placeholder="Add your conclusion..."></div>
```

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    hideOnClick: true
  }
})
```

## Behavior Options

### Hide on Click

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Click to start writing...',
    hideOnClick: true // Hide when user clicks in editor (default: true)
  }
})
```

### Always Show Placeholder

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Always visible placeholder...',
    hideOnClick: false // Placeholder remains visible even when clicked
  }
})
```

**Note**: The current implementation only supports the `hideOnClick` behavior. The placeholder automatically hides when content is added and shows when content is removed, regardless of focus state.

## Styling the Placeholder

### Default Styling

The placeholder uses CSS to style the text:

```css
.medium-editor-placeholder {
  position: relative;
}

.medium-editor-placeholder:after {
  content: attr(data-placeholder);
  font-style: italic;
  color: #999;
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  pointer-events: none;
}
```

### Custom Placeholder Styles

```css
/* Custom placeholder styling */
.medium-editor-placeholder:after {
  content: attr(data-placeholder);
  color: #666;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 1.4;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

/* Fade effect on focus */
.medium-editor-element:focus.medium-editor-placeholder:after {
  opacity: 0.3;
}
```

### Themed Placeholders

```css
/* Dark theme placeholder */
.dark-theme .medium-editor-placeholder:after {
  color: #888;
}

/* Light theme placeholder */
.light-theme .medium-editor-placeholder:after {
  color: #aaa;
}

/* Colorful placeholder */
.colorful-theme .medium-editor-placeholder:after {
  color: #4a90e2;
  font-weight: 400;
}
```

## Dynamic Placeholder Text

### Changing Placeholder Programmatically

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Initial placeholder...'
  }
})

// Change placeholder text dynamically
function updatePlaceholder(newText: string) {
  editor.elements.forEach((element) => {
    element.setAttribute('data-placeholder', newText)
  })
}

// Usage
updatePlaceholder('Write about your experience...')
```

### Context-Aware Placeholders

```typescript
class ContextualPlaceholder extends Extension {
  name = 'contextualPlaceholder'

  init() {
    this.updatePlaceholderBasedOnContext()
    this.base.subscribe('focus', this.updatePlaceholderBasedOnContext.bind(this))
  }

  private updatePlaceholderBasedOnContext() {
    const currentHour = new Date().getHours()
    let placeholderText = 'What\'s on your mind?'

    if (currentHour < 12) {
      placeholderText = 'Good morning! What would you like to write about?'
    }
    else if (currentHour < 18) {
      placeholderText = 'Good afternoon! Share your thoughts...'
    }
    else {
      placeholderText = 'Good evening! What\'s your story?'
    }

    this.base.elements.forEach((element) => {
      element.setAttribute('data-placeholder', placeholderText)
    })
  }
}

const editor = new MediumEditor('.editable', {
  extensions: {
    contextualPlaceholder: new ContextualPlaceholder()
  }
})
```

## Accessibility Considerations

### Screen Reader Support

```typescript
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Enter your article content here'
  }
})

// Add ARIA label for better accessibility
editor.elements.forEach((element) => {
  element.setAttribute('aria-label', 'Article content editor')
  element.setAttribute('role', 'textbox')
  element.setAttribute('aria-multiline', 'true')
})
```

### Keyboard Navigation

The placeholder doesn't interfere with keyboard navigation:

- **Tab**: Moves focus to the editor
- **Enter**: Starts editing and hides placeholder
- **Escape**: Can be used to blur the editor

## Placeholder with Rich Content

### HTML in Placeholder

While placeholders are typically plain text, you can create rich placeholder effects:

```css
.rich-placeholder .medium-editor-placeholder:after {
  content: "✍️ Start writing your masterpiece...";
  font-size: 16px;
  color: #666;
}
```

### Animated Placeholders

```css
@keyframes placeholderPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.4; }
}

.animated-placeholder .medium-editor-placeholder:after {
  animation: placeholderPulse 2s infinite;
}
```

## Integration with Other Features

### Placeholder with Toolbar

```typescript
const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  },
  placeholder: {
    text: 'Select text to see formatting options...',
    hideOnClick: true
  }
})
```

### Placeholder with Auto-Save

```typescript
class PlaceholderWithAutoSave extends Extension {
  name = 'placeholderWithAutoSave'

  init() {
    this.base.subscribe('editableInput', this.handleInput.bind(this))
  }

  private handleInput() {
    const hasContent = this.base.elements.some(el =>
      el.textContent && el.textContent.trim().length > 0
    )

    if (hasContent) {
      // Content exists, hide placeholder and enable auto-save
      this.enableAutoSave()
    }
    else {
      // No content, show placeholder and disable auto-save
      this.disableAutoSave()
    }
  }

  private enableAutoSave() {
    // Auto-save logic
  }

  private disableAutoSave() {
    // Disable auto-save logic
  }
}
```

## Troubleshooting

### Common Issues

**Placeholder not showing:**
```typescript
// Ensure the editor element is empty
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Your placeholder text'
  }
})

// Check if element has content
console.log('Element content:', editor.elements[0].innerHTML)
```

**Placeholder not hiding:**
```typescript
// Check hideOnClick and hideOnFocus settings
const editor = new MediumEditor('.editable', {
  placeholder: {
    text: 'Placeholder text',
    hideOnClick: true,
    hideOnFocus: true
  }
})
```

**Styling issues:**
```css
/* Ensure placeholder CSS is loaded */
.medium-editor-placeholder:after {
  content: attr(data-placeholder) !important;
  display: block !important;
}
```

### Debugging Placeholder State

```typescript
// Check placeholder state
function debugPlaceholder(editor: MediumEditor) {
  editor.elements.forEach((element, index) => {
    console.log(`Element ${index}:`)
    console.log('- Content:', element.innerHTML)
    console.log('- Placeholder:', element.getAttribute('data-placeholder'))
    console.log('- Has placeholder class:', element.classList.contains('medium-editor-placeholder'))
  })
}

// Usage
debugPlaceholder(editor)
```

## Best Practices

### Writing Effective Placeholders

1. **Be specific and helpful:**
   ```typescript
   // Good
   placeholder: {
     text: 'Describe your experience with the product...'
   }

   // Avoid
   placeholder: {
     text: 'Type here...'
   }
   ```

2. **Match your content type:**
   ```typescript
   // For blog posts
   placeholder: {
     text: 'Share your story, insights, or experiences...'
   }

   // For comments
   placeholder: {
     text: 'Add your thoughts to the discussion...'
   }

   // For titles
   placeholder: {
     text: 'Enter a compelling headline...'
   }
   ```

3. **Keep it concise:**
   ```typescript
   // Good
   placeholder: {
     text: 'What\'s your main point?'
   }

   // Too long
   placeholder: {
     text: 'Please enter your detailed thoughts and opinions about this topic here...'
   }
   ```

### Performance Optimization

```typescript
// Efficient placeholder updates
class OptimizedPlaceholder extends Extension {
  name = 'optimizedPlaceholder'
  private updateTimeout: number | null = null

  init() {
    this.base.subscribe('editableInput', this.scheduleUpdate.bind(this))
  }

  private scheduleUpdate() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    this.updateTimeout = window.setTimeout(() => {
      this.updatePlaceholderVisibility()
    }, 100)
  }

  private updatePlaceholderVisibility() {
    // Update placeholder state efficiently
  }
}
```

## Next Steps

- Learn about [Text Formatting](/features/formatting) options
- Explore [Events](/features/events) for placeholder interactions
- Check out [Text Formatting](/features/formatting) for advanced placeholder designs
- See [API Reference](/api) for placeholder methods
