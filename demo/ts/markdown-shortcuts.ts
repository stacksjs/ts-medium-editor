import { MediumEditor } from '../../src/index.ts'

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new MediumEditor('.editable', {
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist'],
    },
    placeholder: { text: 'Try the Markdown shortcuts…' },
    markdownShortcuts: true,
  })
})
