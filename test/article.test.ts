import { describe, expect, it } from 'bun:test'
import { renderArticle } from '../src/article'
import { toMarkdown } from '../src/markdown'

const sizes: Record<string, { width: number, height: number }> = {
  '/land-a.jpg': { width: 1600, height: 1200 },
  '/land-b.jpg': { width: 1600, height: 1200 },
  '/tall.jpg': { width: 1200, height: 1600 },
  '/wide.jpg': { width: 1600, height: 800 },
}
const resolveImage = (src: string): { width: number, height: number } | null => sizes[src] ?? null

describe('renderArticle', () => {
  it('wraps a lone image in a figure, with its title as the caption', () => {
    const html = renderArticle('<p><img src="/land-a.jpg" alt="A ridge" title="Late light"></p>')
    expect(html).toContain('<figure class="me-figure"')
    expect(html).toContain('<figcaption>Late light</figcaption>')
    expect(html).not.toContain('title=')
    expect(html).not.toContain('<p>')
  })

  it('leaves images that sit inside prose alone', () => {
    const src = '<p>Look <img src="/land-a.jpg" alt="x"> here.</p>'
    expect(renderArticle(src)).toBe(src)
  })

  it('loads the first image eagerly and the rest lazily, and marks them zoomable', () => {
    const html = renderArticle('<p><img src="/land-a.jpg" alt="a"></p>\n<p>Text.</p>\n<p><img src="/land-b.jpg" alt="b"></p>')
    const [first, second] = html.match(/<img[^>]*>/g)!
    expect(first).toContain('loading="eager"')
    expect(second).toContain('loading="lazy"')
    expect(first).toContain('data-zoomable')
    expect(first).toContain('decoding="async"')
  })

  it('adds width and height when sizes are known', () => {
    const html = renderArticle('<p><img src="/tall.jpg" alt="t"></p>', { resolveImage })
    expect(html).toContain('width="1200"')
    expect(html).toContain('height="1600"')
  })

  it('puts two adjacent images side by side, columns in proportion to their shapes', () => {
    const html = renderArticle('<p><img src="/land-a.jpg" alt="a"></p>\n<p><img src="/tall.jpg" alt="t"></p>', { resolveImage })
    expect(html).toContain('me-grid--row me-grid--2')
    expect(html).toContain('--me-cols:1.333fr 0.75fr')
    expect(html.match(/<figure/g)!.length).toBe(2)
  })

  it('groups images that share one paragraph too', () => {
    const html = renderArticle('<p><img src="/land-a.jpg" alt="a">\n<img src="/land-b.jpg" alt="b"></p>')
    expect(html).toContain('me-grid--2')
  })

  it('lays out three with the tallest on the left and the others stacked right', () => {
    const html = renderArticle([
      '<p><img src="/land-a.jpg" alt="a"></p>',
      '<p><img src="/tall.jpg" alt="t"></p>',
      '<p><img src="/land-b.jpg" alt="b"></p>',
    ].join('\n'), { resolveImage })
    expect(html).toContain('me-grid--feature')
    const alts = [...html.matchAll(/alt="(\w)"/g)].map(m => m[1])
    expect(alts).toEqual(['t', 'a', 'b'])
    expect(html).toMatch(/<figure class="me-figure me-grid__feature"[^>]*><img[^>]*alt="t"/)
    // 0.75 * (1/1.333 + 1/1.333) = 1.125: the stacked pair matches its height.
    expect(html).toContain('--me-cols:1.125fr 1fr')
  })

  it('keeps source order for three when sizes are unknown', () => {
    const html = renderArticle('<p><img src="/x.jpg" alt="x"></p><p><img src="/y.jpg" alt="y"></p><p><img src="/z.jpg" alt="z"></p>')
    expect([...html.matchAll(/alt="(\w)"/g)].map(m => m[1])).toEqual(['x', 'y', 'z'])
    expect(html).toContain('--me-cols:1.2fr 1fr')
  })

  it('splits larger groups into rows that never leave one image alone', () => {
    const five = Array.from({ length: 5 }, (_, i) => `<p><img src="/${i}.jpg" alt="${i}"></p>`).join('')
    const html = renderArticle(five)
    expect(html).toContain('me-gallery')
    expect(html.match(/me-grid--3/g)!.length).toBe(1)
    expect(html.match(/me-grid--2/g)!.length).toBe(1)

    const four = Array.from({ length: 4 }, (_, i) => `<p><img src="/${i}.jpg" alt="${i}"></p>`).join('')
    expect(renderArticle(four).match(/me-grid--2/g)!.length).toBe(2)
  })

  it('does not group across a paragraph of text', () => {
    const html = renderArticle('<p><img src="/a.jpg" alt="a"></p><p>Words.</p><p><img src="/b.jpg" alt="b"></p>')
    expect(html).not.toContain('me-grid')
    expect(html.match(/me-figure/g)!.length).toBe(2)
  })

  it('keeps a linked image linked, and does not make it zoom', () => {
    const html = renderArticle('<p><a href="https://example.com"><img src="/a.jpg" alt="a"></a></p>')
    expect(html).toContain('<a href="https://example.com"><img')
    expect(html).not.toContain('data-zoomable')
  })

  it('turns a bare YouTube or HQ.training link into an embed', () => {
    const yt = renderArticle('<p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">https://www.youtube.com/watch?v=dQw4w9WgXcQ</a></p>')
    expect(yt).toContain('src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"')
    expect(yt).toContain('me-embed--ratio')

    const hq = renderArticle('<p><a href="https://hq.training/a/mount-hawkins">https://hq.training/a/mount-hawkins</a></p>')
    expect(hq).toContain('src="https://hq.training/a/mount-hawkins/embed"')
    expect(hq).toContain('data-embed-resize')
    expect(hq).toContain('me-embed--auto')
  })

  it('leaves a link with its own words alone, and unknown hosts alone', () => {
    const words = '<p><a href="https://hq.training/a/x">my hike</a></p>'
    expect(renderArticle(words)).toBe(words)
    const other = '<p><a href="https://example.com/a/x">https://example.com/a/x</a></p>'
    expect(renderArticle(other)).toBe(other)
  })

  it('is idempotent', () => {
    const once = renderArticle('<p><img src="/land-a.jpg" alt="a"></p><p><img src="/tall.jpg" alt="t"></p>', { resolveImage })
    expect(renderArticle(once, { resolveImage })).toBe(once)
  })

  it('can turn grids, zoom and embeds off', () => {
    const html = renderArticle('<p><img src="/a.jpg" alt="a"></p><p><img src="/b.jpg" alt="b"></p>', { grids: false, zoom: false })
    expect(html).not.toContain('me-grid')
    expect(html).not.toContain('data-zoomable')
    const link = '<p><a href="https://youtu.be/dQw4w9WgXcQ">https://youtu.be/dQw4w9WgXcQ</a></p>'
    expect(renderArticle(link, { embeds: [] })).toBe(link)
  })

  it('escapes what it writes back into attributes', () => {
    const html = renderArticle('<p><img src="/a.jpg" alt="a &quot;quoted&quot; &lt;tag&gt;" title="x &amp; y"></p>')
    expect(html).toContain('alt="a &quot;quoted&quot; &lt;tag&gt;"')
    expect(html).toContain('<figcaption>x &amp; y</figcaption>')
  })
})

describe('toMarkdown, on rendered articles', () => {
  it('carries a figure caption back as the image title', () => {
    const html = renderArticle('<p><img src="/a.jpg" alt="A ridge" title="Late light"></p>')
    expect(toMarkdown(html)).toBe('![A ridge](/a.jpg "Late light")')
  })

  it('turns an embed back into its bare link', () => {
    const html = renderArticle('<p><a href="https://hq.training/a/mount-hawkins">https://hq.training/a/mount-hawkins</a></p>')
    expect(toMarkdown(html)).toBe('https://hq.training/a/mount-hawkins')
  })
})
