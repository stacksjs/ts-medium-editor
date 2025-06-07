# Textarea Integration

Convert textareas to rich text editors while maintaining form compatibility.

## Basic Textarea Conversion

### HTML
```html
<form class="textarea-form">
  <label for="content">Article Content:</label>
  <textarea id="content" name="content" rows="10" cols="50">
    Write your article content here...
  </textarea>
  <button type="submit">Save Article</button>
</form>
```

### TypeScript
```typescript
const editor = new MediumEditor('textarea', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  disableReturn: false,
  disableDoubleReturn: false
})

// Handle form submission
document.querySelector('.textarea-form').addEventListener('submit', (event) => {
  event.preventDefault()

  // The textarea value is automatically updated by the editor
  const content = document.getElementById('content').value
  console.log('Submitting content:', content)
})
```

## Blog Post Form

### HTML
```html
<form class="blog-form">
  <div class="form-group">
    <label for="blog-title">Title</label>
    <input type="text" id="blog-title" name="title" required>
  </div>

  <div class="form-group">
    <label for="blog-content">Content</label>
    <textarea id="blog-content" name="content" rows="15" placeholder="Write your blog post..."></textarea>
  </div>

  <button type="submit">Publish</button>
</form>
```

### TypeScript
```typescript
const contentEditor = new MediumEditor('#blog-content', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  buttonLabels: 'fontawesome'
})

document.querySelector('.blog-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const article = {
    title: formData.get('title'),
    content: formData.get('content')
  }

  console.log('Publishing article:', article)
})
```

## Next Steps

- Learn about [Event Handling](/examples/events) for form integration
- Explore [Clean Paste](/examples/paste) for textarea content processing
- Check out [Real-World Use Cases](/examples/real-world) for complete applications