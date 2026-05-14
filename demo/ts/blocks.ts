import { MediumEditor } from '../../src/index.ts'

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new MediumEditor('.editable', {
    toolbar: { buttons: ['bold', 'italic', 'anchor'] },
    placeholder: { text: 'Type / for blocks, or ``` + Enter for a code block…' },
    markdownShortcuts: true,
    slashCommands: true,
    taskList: true,
    tables: true,
  })
})
