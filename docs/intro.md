<p align="center"><img src="https://github.com/stacksjs/rpx/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# Introduction

TypeScript Medium Editor is a modern, type-safe WYSIWYG (What You See Is What You Get) rich text editor inspired by Medium.com's clean and intuitive editing experience. Built from the ground up with TypeScript, it provides developers with a robust, extensible, and lightweight solution for rich text editing in web applications.

## Why TypeScript Medium Editor?

### 🎯 **Type Safety First**
Unlike many JavaScript-based editors, TypeScript Medium Editor is built with TypeScript from day one. This means:
- Complete type definitions for all APIs
- Enhanced IDE support with autocomplete and error detection
- Reduced runtime errors through compile-time checking
- Better refactoring capabilities

### 🚀 **Modern Architecture**
- **ES Modules**: Native support for modern module systems
- **Zero Dependencies**: No jQuery or other heavy frameworks required
- **Tree Shakable**: Import only what you need for optimal bundle size
- **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript

### 🔧 **Extensible Design**
The editor follows a plugin-based architecture that allows you to:
- Create custom toolbar buttons
- Add new formatting options
- Implement custom extensions
- Override default behaviors

### ⚡ **Performance Focused**
- Lightweight core (~76KB minified)
- Efficient DOM manipulation
- Optimized for mobile devices
- Minimal memory footprint

## Key Features

### Rich Text Editing
- **Bold, Italic, Underline**: Standard text formatting options
- **Headers**: H1, H2, H3 support for document structure
- **Links**: Easy link creation and editing
- **Quotes**: Blockquote formatting for citations
- **Lists**: Ordered and unordered list support

### Toolbar System
- **Contextual Toolbar**: Appears when text is selected
- **Customizable Buttons**: Add, remove, or modify toolbar buttons
- **Keyboard Shortcuts**: Standard shortcuts (Ctrl/Cmd + B, I, U)
- **Mobile Optimized**: Touch-friendly interface

### Developer Experience
- **TypeScript Support**: Full type definitions included
- **Comprehensive API**: Programmatic control over editor content
- **Event System**: Subscribe to editor events for custom behavior
- **Extensible**: Plugin system for custom functionality

### Accessibility
- **ARIA Support**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML structure
- **Focus Management**: Proper focus handling

## Browser Support

TypeScript Medium Editor supports all modern browsers:

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Getting Started

Ready to start using TypeScript Medium Editor? Head over to the [Installation Guide](/install) to get up and running in minutes.

## Community & Support

- **GitHub**: [Report issues and contribute](https://github.com/stacksjs/ts-medium-editor)
- **Documentation**: Comprehensive guides and API reference
- **Examples**: Live demos and code samples
- **TypeScript**: Full type definitions included

## License

TypeScript Medium Editor is released under the [MIT License](/license), making it free for both personal and commercial use.

# ts-medium-editor

This is an opinionated TypeScript Starter kit to help kick-start development of your next Bun package.

## Get Started

It's rather simple to get your package development started:

```bash
# you may use this GitHub template or the following command:
bunx degit stacksjs/ts-medium-editor my-pkg
cd my-pkg

 # if you don't have pnpm installed, run `npm i -g pnpm`
bun i # install all deps
bun run build # builds the library for production-ready use

# after you have successfully committed, you may create a "release"
bun run release # automates git commits, versioning, and changelog generations
```

_Check out the package.json scripts for more commands._

### Developer Experience (DX)

This Starter Kit comes pre-configured with the following:

- [Powerful Build Process](https://github.com/oven-sh/bun) - via Bun
- [Fully Typed APIs](https://www.typescriptlang.org/) - via TypeScript
- [Documentation-ready](https://vitepress.dev/) - via VitePress
- [CLI & Binary](https://www.npmjs.com/package/bunx) - via Bun & CAC
- [Be a Good Commitizen](https://www.npmjs.com/package/git-cz) - pre-configured Commitizen & git-cz setup to simplify semantic git commits, versioning, and changelog generations
- [Built With Testing In Mind](https://bun.sh/docs/cli/test) - pre-configured unit-testing powered by [Bun](https://bun.sh/docs/cli/test)
- [Renovate](https://renovatebot.com/) - optimized & automated PR dependency updates
- [ESLint](https://eslint.org/) - for code linting _(and formatting)_
- [GitHub Actions](https://github.com/features/actions) - runs your CI _(fixes code style issues, tags releases & creates its changelogs, runs the test suite, etc.)_

## Changelog

Please see our [releases](https://github.com/stacksjs/stacks/releases) page for more information on what has changed recently.

## Stargazers

[![Stargazers](https://starchart.cc/stacksjs/ts-medium-editor.svg?variant=adaptive)](https://starchart.cc/stacksjs/ts-medium-editor)

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

Two things are true: Stacks OSS will always stay open-source, and we do love to receive postcards from wherever Stacks is used! 🌍 _We also publish them on our website. And thank you, Spatie_

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/rpx/graphs/contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/ts-medium-editor/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/rpx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/rpx -->
