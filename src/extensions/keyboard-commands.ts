import type { KeyboardCommand, KeyboardCommandsOptions, MediumEditor, MediumEditorExtension } from '../types'

export class KeyboardCommands implements MediumEditorExtension {
  name = 'keyboardCommands'

  private editor: MediumEditor
  private commands: KeyboardCommand[]

  constructor(editor: MediumEditor, options: KeyboardCommandsOptions = {}) {
    this.editor = editor
    this.commands = options.commands || this.getDefaultCommands()
  }

  init(): void {
    this.editor.subscribe('editableKeydown', this.handleKeydown.bind(this))
  }

  destroy(): void {
    // No cleanup needed
  }

  handleKeydown(event: KeyboardEvent): void {
    // Check each command to see if it matches the current key combination
    for (const command of this.commands) {
      if (this.matchesCommand(event, command)) {
        event.preventDefault()
        event.stopPropagation()

        // Execute the command
        if (this.editor.execAction) {
          this.editor.execAction(command.command)
        }
        return
      }
    }
  }

  private matchesCommand(event: KeyboardEvent, command: KeyboardCommand): boolean {
    // Check if the key matches
    if (event.key.toLowerCase() !== command.key.toLowerCase()) {
      return false
    }

    // Check modifiers
    const hasCtrlMeta = event.ctrlKey || event.metaKey
    const needsCtrlMeta = command.meta ?? false

    if (needsCtrlMeta !== hasCtrlMeta) {
      return false
    }

    const hasShift = event.shiftKey
    const needsShift = command.shift ?? false

    if (needsShift !== hasShift) {
      return false
    }

    const hasAlt = event.altKey
    const needsAlt = command.alt ?? false

    if (needsAlt !== hasAlt) {
      return false
    }

    return true
  }

  private getDefaultCommands(): KeyboardCommand[] {
    return [
      {
        command: 'bold',
        key: 'b',
        meta: true,
      },
      {
        command: 'italic',
        key: 'i',
        meta: true,
      },
      {
        command: 'underline',
        key: 'u',
        meta: true,
      },
    ]
  }
}
