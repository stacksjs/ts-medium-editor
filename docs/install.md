# Installation

`ts-medium-editor` can be installed via npm, yarn, pnpm, or bun. Choose your preferred package manager:

## Package Managers

::: code-group

```bash [npm]
npm install ts-medium-editor
```

```bash [yarn]
yarn add ts-medium-editor
```

```bash [pnpm]
pnpm add ts-medium-editor
```

```bash [bun]
bun add ts-medium-editor
```

:::

## CDN Installation

For quick prototyping or simple projects, you can use the CDN version:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/ts-medium-editor/css/medium-editor.css">

<!-- JavaScript -->
<script src="https://unpkg.com/ts-medium-editor/dist/index.js"></script>
```

## TypeScript Support

TypeScript definitions are included out of the box. No additional `@types` packages are needed.

```typescript
import { MediumEditor } from 'ts-medium-editor'
// Types are automatically available
```

## CSS Styles

Don't forget to include the CSS styles for the editor to display properly:

### ES Modules

```typescript
import 'ts-medium-editor/css/medium-editor.css'
```

### HTML Link Tag

```html
<link rel="stylesheet" href="node_modules/ts-medium-editor/css/medium-editor.css">
```

## Verification

To verify your installation, create a simple editor:

```typescript
import { MediumEditor } from 'ts-medium-editor'
import 'ts-medium-editor/css/medium-editor.css'

const editor = new MediumEditor('.editable', {
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  }
})

console.log('Editor initialized:', editor)
```

## Next Steps

Now that you have `ts-medium-editor` installed, head over to the [Usage Guide](/usage) to learn how to create your first editor instance.

## Requirements

- **Node.js**: 16+ (for development)
- **TypeScript**: 4.5+ (optional, but recommended)
- **Modern Browser**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## Bundle Size

`ts-medium-editor` is designed to be lightweight:

- **Minified**: ~76KB
- **Gzipped**: ~24KB
- **Tree-shakable**: Import only what you need

## Framework Integration

`ts-medium-editor` works with any framework or vanilla JavaScript:

- ✅ **React**: Full compatibility
- ✅ **Vue**: Full compatibility
- ✅ **Angular**: Full compatibility
- ✅ **Svelte**: Full compatibility
- ✅ **Vanilla JS**: Full compatibility
