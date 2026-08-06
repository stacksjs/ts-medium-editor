import { describe, expect, it } from 'bun:test'
import { isEmptyHtml, toMarkdown } from '../src/markdown'

describe('toMarkdown', () => {
  it('converts headings', () => {
    expect(toMarkdown('<h1>One</h1>')).toBe('# One')
    expect(toMarkdown('<h3>Three</h3>')).toBe('### Three')
  })

  it('converts paragraphs, separated by a blank line', () => {
    expect(toMarkdown('<p>One.</p><p>Two.</p>')).toBe('One.\n\nTwo.')
  })

  it('converts bold and italic', () => {
    expect(toMarkdown('<p>A <strong>bold</strong> word</p>')).toBe('A **bold** word')
    expect(toMarkdown('<p>An <em>italic</em> word</p>')).toBe('An _italic_ word')
    expect(toMarkdown('<p><b>b</b> and <i>i</i></p>')).toBe('**b** and _i_')
  })

  it('does not emit empty emphasis marks', () => {
    // `****` would render as literal asterisks rather than as emphasis.
    expect(toMarkdown('<p><strong></strong>text</p>')).toBe('text')
  })

  it('converts links, and escapes parentheses that would close them early', () => {
    expect(toMarkdown('<p><a href="https://example.com">here</a></p>')).toBe('[here](https://example.com)')
    expect(toMarkdown('<p><a href="https://example.com/a(b)">x</a></p>')).toBe('[x](https://example.com/a%28b%29)')
  })

  it('drops the link syntax when there is no href to point at', () => {
    expect(toMarkdown('<p><a>plain</a></p>')).toBe('plain')
  })

  it('converts images', () => {
    expect(toMarkdown('<p><img src="/a.png" alt="A cat"></p>')).toBe('![A cat](/a.png)')
  })

  it('converts unordered and ordered lists', () => {
    expect(toMarkdown('<ul><li>one</li><li>two</li></ul>')).toBe('- one\n- two')
    expect(toMarkdown('<ol><li>one</li><li>two</li></ol>')).toBe('1. one\n2. two')
  })

  it('indents nested lists by two spaces per level', () => {
    // Four spaces would be read as a code block by some parsers.
    expect(toMarkdown('<ul><li>one<ul><li>deep</li></ul></li></ul>')).toContain('  - deep')
  })

  it('honours a configured bullet and emphasis character', () => {
    expect(toMarkdown('<ul><li>one</li></ul>', { bullet: '*' })).toBe('* one')
    expect(toMarkdown('<p><em>x</em></p>', { emphasis: '*' })).toBe('*x*')
  })

  it('converts blockquotes, prefixing every line', () => {
    expect(toMarkdown('<blockquote><p>One.</p><p>Two.</p></blockquote>')).toBe('> One.\n>\n> Two.')
  })

  it('converts inline code without escaping its contents', () => {
    // Inside backticks Markdown syntax is already literal; escaping would show
    // the backslashes to the reader.
    expect(toMarkdown('<p><code>a_b*c</code></p>')).toBe('`a_b*c`')
  })

  it('converts code blocks to fences', () => {
    expect(toMarkdown('<pre>const a = 1</pre>')).toBe('```\nconst a = 1\n```')
  })

  it('converts a horizontal rule', () => {
    expect(toMarkdown('<p>a</p><hr><p>b</p>')).toBe('a\n\n---\n\nb')
  })

  it('turns a line break into a portable hard break', () => {
    // Two trailing spaces. A bare newline is read as a soft wrap and vanishes.
    expect(toMarkdown('<p>one<br>two</p>')).toBe('one  \ntwo')
  })

  it('escapes characters that would otherwise be read as syntax', () => {
    expect(toMarkdown('<p>a * b _ c</p>')).toBe('a \\* b \\_ c')
    expect(toMarkdown('<p># not a heading</p>')).toBe('\\# not a heading')
  })

  it('escapes backslashes before adding its own', () => {
    expect(toMarkdown('<p>a \\ b</p>')).toBe('a \\\\ b')
  })

  it('keeps the text inside tags it does not know', () => {
    // A <span> wrapper should never cost the writer their sentence.
    expect(toMarkdown('<p><span class="x">kept</span></p>')).toBe('kept')
  })

  it('collapses runs of whitespace introduced by pretty-printed HTML', () => {
    expect(toMarkdown('<p>one   two\n  three</p>')).toBe('one two three')
  })

  it('returns an empty string for empty input', () => {
    expect(toMarkdown('')).toBe('')
    expect(toMarkdown('<p><br></p>')).toBe('')
    expect(toMarkdown('<p></p>')).toBe('')
  })

  it('accepts an element as well as a string', () => {
    const host = document.createElement('div')
    host.innerHTML = '<p>from an element</p>'
    expect(toMarkdown(host)).toBe('from an element')
  })

  it('never leaves more than one blank line between blocks', () => {
    const markdown = toMarkdown('<h2>T</h2><p>a</p><ul><li>b</li></ul><p>c</p>')
    expect(markdown).not.toContain('\n\n\n')
    expect(markdown).toBe('## T\n\na\n\n- b\n\nc')
  })

  it('leaves no trailing whitespace on any line', () => {
    const markdown = toMarkdown('<blockquote><p>a</p><p>b</p></blockquote>')
    expect(markdown.split('\n').every(line => line === line.trimEnd())).toBe(true)
  })
})

describe('isEmptyHtml', () => {
  it('recognises the shapes contenteditable leaves behind when cleared', () => {
    expect(isEmptyHtml('')).toBe(true)
    expect(isEmptyHtml('<p><br></p>')).toBe(true)
    expect(isEmptyHtml('<br>')).toBe(true)
    expect(isEmptyHtml('<p>&nbsp;</p>')).toBe(true)
    expect(isEmptyHtml('<div><p>  </p></div>')).toBe(true)
  })

  it('does not call real content empty', () => {
    expect(isEmptyHtml('<p>a</p>')).toBe(false)
    expect(isEmptyHtml('<p><img src="/a.png"></p>')).toBe(false)
  })
})
