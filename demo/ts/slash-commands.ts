import { MediumEditor } from '../../src/index.ts'

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new MediumEditor('.editable:not(#custom-editor)', {
    toolbar: { buttons: ['bold', 'italic', 'anchor'] },
    placeholder: { text: 'Type / to insert a block…' },
    slashCommands: true,
  })

  // eslint-disable-next-line no-new
  new MediumEditor('#custom-editor', {
    toolbar: { buttons: ['bold', 'italic', 'anchor'] },
    placeholder: { text: 'Type /mention to try the custom command…' },
    slashCommands: {
      extraCommands: [{
        id: 'mention',
        label: 'Mention',
        description: 'Insert an @-mention',
        keywords: ['user', 'tag'],
        action: (_editor, editable) => {
          const span = editable.ownerDocument.createElement('span')
          span.style.color = '#0d6efd'
          span.textContent = '@someone'
          editable.ownerDocument.execCommand('insertHTML', false, `${span.outerHTML} `)
        },
      }],
    },
  })
})
