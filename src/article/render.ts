/**
 * Published-article rendering: the read side of the editor.
 *
 * The editor writes content; this turns that content (or any HTML a markdown
 * renderer produced) into what Medium shows a reader. It is a pure string
 * transform with no DOM, so it runs on the server, at build time, or in the
 * browser alike:
 *
 * - An image alone in its paragraph becomes a `<figure>`, and its title
 *   (`![alt](src "title")` in markdown) becomes the `<figcaption>`.
 * - Images in consecutive paragraphs, or together in one paragraph, become a
 *   grid: two sit side by side, three put the tallest on the left and stack
 *   the other two on its right, four make a 2x2, and more are split into rows
 *   of three and two. When dimensions are known the columns are sized so every
 *   image shows whole, at one shared height, with nothing cropped.
 * - Every image gets `loading="lazy"` and `decoding="async"`, its width and
 *   height when known (so nothing jumps as it loads), and `data-zoomable` for
 *   the click-to-zoom in `./zoom`.
 * - A link alone in its paragraph, pointing somewhere an embed provider
 *   recognizes, becomes an iframe, the way pasting a URL on its own line does
 *   in Medium.
 */

export interface ImageSize {
  width: number
  height: number
}

export interface EmbedProvider {
  /** A short name, used in the class (`me-embed--<name>`). */
  name: string
  /** Returns the iframe `src` for a URL this provider handles, or null. */
  match: (url: URL) => string | null
  /** Fixed aspect ratio (width / height) for players; omit for auto-height cards. */
  aspectRatio?: number
  /** Initial height in CSS px for auto-height embeds, before the frame reports its own. */
  height?: number
  /** The iframe's accessible title. */
  title?: string
}

export interface RenderArticleOptions {
  /**
   * Dimensions for an image `src`, when the caller can know them (reading the
   * file on disk, a manifest, an image CDN). Enables exact grid sizing and
   * width/height attributes. Returning null leaves that image unsized.
   */
  resolveImage?: (src: string) => ImageSize | null | undefined
  /** Group adjacent images into grids. Default true. */
  grids?: boolean
  /** Mark images for click-to-zoom. Default true. */
  zoom?: boolean
  /** Lazy-load images after the first `eagerImages`. Default true. */
  lazy?: boolean
  /** How many images at the top load eagerly (above the fold). Default 1. */
  eagerImages?: number
  /** Embed providers, checked in order. Default `defaultEmbedProviders`. Pass [] to disable. */
  embeds?: EmbedProvider[]
}

export const youtubeEmbed: EmbedProvider = {
  name: 'youtube',
  aspectRatio: 16 / 9,
  title: 'YouTube video',
  match(url) {
    const host = url.hostname.replace(/^www\./, '')
    let id = ''
    if (host === 'youtu.be')
      id = url.pathname.slice(1)
    else if (host === 'youtube.com' || host === 'm.youtube.com')
      id = url.pathname === '/watch' ? url.searchParams.get('v') || '' : (url.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)?.[1] || '')
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  },
}

export const vimeoEmbed: EmbedProvider = {
  name: 'vimeo',
  aspectRatio: 16 / 9,
  title: 'Vimeo video',
  match(url) {
    if (url.hostname.replace(/^www\./, '') !== 'vimeo.com')
      return null
    const id = url.pathname.match(/^\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null
  },
}

/** An HQ.training activity (`https://hq.training/a/<id>`), as its embeddable card. */
export const hqTrainingActivityEmbed: EmbedProvider = {
  name: 'hq-activity',
  height: 460,
  title: 'Activity on HQ.training',
  match(url) {
    if (url.hostname.replace(/^www\./, '') !== 'hq.training')
      return null
    const id = url.pathname.match(/^\/a\/([\w-]+)\/?$/)?.[1]
    if (!id)
      return null
    const theme = url.searchParams.get('theme')
    return `https://hq.training/a/${id}/embed${theme === 'light' || theme === 'dark' ? `?theme=${theme}` : ''}`
  },
}

export const defaultEmbedProviders: EmbedProvider[] = [youtubeEmbed, vimeoEmbed, hqTrainingActivityEmbed]

interface ArticleImage {
  attrs: Record<string, string>
  /** The `<a>` wrapping the image, if it was linked. */
  href?: string
  size?: ImageSize
}

// eslint-disable-next-line quotes
const ATTR = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
/** A linked image (`<a …><img …></a>`: groups 1, 2) or a bare one (group 3). */
const IMAGE_TOKEN = /<a\b([^>]*)>\s*<img\b([^>]*)>\s*<\/a>|<img\b([^>]*)>/gi

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const m of source.matchAll(ATTR)) {
    const name = m[1].toLowerCase()
    if (name === '/')
      continue
    attrs[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '')
  }
  return attrs
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function attrString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => (v === '' && (k.startsWith('data-') || k === 'allowfullscreen') ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('')
}

/**
 * If a paragraph's inner HTML is nothing but images (optionally each wrapped
 * in a link, separated by whitespace or `<br>`), returns them. Otherwise null.
 */
function imagesOnly(inner: string): ArticleImage[] | null {
  const images: ArticleImage[] = []
  let rest = ''
  let last = 0
  for (const m of inner.matchAll(IMAGE_TOKEN)) {
    rest += inner.slice(last, m.index)
    last = m.index! + m[0].length
    images.push(m[1] !== undefined
      ? { attrs: parseAttrs(m[2]), href: parseAttrs(m[1]).href }
      : { attrs: parseAttrs(m[3]) })
  }
  rest += inner.slice(last)
  // Anything left besides whitespace and line breaks means the images sit
  // inside prose, which stays prose.
  if (images.length === 0 || rest.replace(/<br\s*\/?>/gi, '').trim() !== '')
    return null
  return images
}

const round = (n: number): number => Math.round(n * 1000) / 1000

function aspect(image: ArticleImage): number | null {
  return image.size && image.size.width > 0 && image.size.height > 0 ? image.size.width / image.size.height : null
}

interface Counter { n: number }

function renderImage(image: ArticleImage, options: Required<Pick<RenderArticleOptions, 'zoom' | 'lazy' | 'eagerImages'>>, seen: Counter): string {
  const { title, ...rest } = image.attrs
  const attrs: Record<string, string> = { ...rest }
  if (image.size && !attrs.width && !attrs.height) {
    attrs.width = String(image.size.width)
    attrs.height = String(image.size.height)
  }
  if (options.lazy && !attrs.loading)
    attrs.loading = seen.n >= options.eagerImages ? 'lazy' : 'eager'
  if (!attrs.decoding)
    attrs.decoding = 'async'
  if (options.zoom && !image.href)
    attrs['data-zoomable'] = ''
  seen.n++
  const img = `<img${attrString(attrs)}>`
  return image.href ? `<a href="${esc(image.href)}">${img}</a>` : img
}

function renderFigure(image: ArticleImage, options: Required<Pick<RenderArticleOptions, 'zoom' | 'lazy' | 'eagerImages'>>, seen: Counter, extraClass = ''): string {
  const caption = image.attrs.title
  const cls = `me-figure${extraClass ? ` ${extraClass}` : ''}`
  const a = aspect(image)
  const style = a ? ` style="--me-aspect:${round(a)}"` : ''
  return `<figure class="${cls}"${style}>${renderImage(image, options, seen)}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`
}

/**
 * Lays out one group of images. Column widths are expressed as `fr` values
 * derived from aspect ratios, so a row of images shares one height and each
 * shows whole. Without sizes the layout falls back to even columns and
 * `object-fit: cover`.
 */
function renderGroup(group: ArticleImage[], options: Required<Pick<RenderArticleOptions, 'zoom' | 'lazy' | 'eagerImages'>>, seen: Counter): string {
  if (group.length === 1)
    return renderFigure(group[0], options, seen)

  if (group.length === 3) {
    // The tallest image (lowest aspect ratio) anchors the left column; the
    // other two stack on the right, keeping their relative order. For their
    // stacked heights to equal the feature's height:
    //   W0 / a0 = W1 / a1 + W1 / a2  =>  W0 : W1 = a0 * (1/a1 + 1/a2) : 1
    const ratios = group.map(aspect)
    let feature = 0
    if (ratios.every(r => r !== null)) {
      feature = ratios.indexOf(Math.min(...(ratios as number[])))
    }
    const others = group.filter((_, i) => i !== feature)
    const [a0, a1, a2] = [ratios[feature], aspect(others[0]), aspect(others[1])]
    const left = a0 && a1 && a2 ? round(a0 * (1 / a1 + 1 / a2)) : 1.2
    const cells = [
      renderFigure(group[feature], options, seen, 'me-grid__feature'),
      ...others.map(image => renderFigure(image, options, seen)),
    ]
    return `<div class="me-grid me-grid--feature" style="--me-cols:${left}fr 1fr">${cells.join('')}</div>`
  }

  if (group.length === 2 || group.length > 4) {
    // Rows of at most three (a trailing single never stands alone: 4 is 2+2,
    // 5 is 3+2, 7 is 3+2+2).
    const rows: ArticleImage[][] = []
    let rest = group
    while (rest.length > 0) {
      const take = rest.length === 4 || rest.length === 2 ? 2 : Math.min(3, rest.length)
      rows.push(rest.slice(0, take))
      rest = rest.slice(take)
    }
    if (rows.length > 1)
      return `<div class="me-gallery">${rows.map(row => renderRow(row, options, seen)).join('')}</div>`
    return renderRow(rows[0], options, seen)
  }

  // Four: two rows of two.
  return `<div class="me-gallery">${renderRow(group.slice(0, 2), options, seen)}${renderRow(group.slice(2), options, seen)}</div>`
}

function renderRow(row: ArticleImage[], options: Required<Pick<RenderArticleOptions, 'zoom' | 'lazy' | 'eagerImages'>>, seen: Counter): string {
  const ratios = row.map(aspect)
  const cols = ratios.every(r => r !== null) ? ratios.map(r => `${round(r as number)}fr`).join(' ') : `repeat(${row.length}, 1fr)`
  return `<div class="me-grid me-grid--row me-grid--${row.length}" style="--me-cols:${cols}">${row.map(image => renderFigure(image, options, seen)).join('')}</div>`
}

function renderEmbed(provider: EmbedProvider, src: string, href: string): string {
  const title = provider.title || `${provider.name} embed`
  const sizing = provider.aspectRatio
    ? ` style="--me-aspect:${round(provider.aspectRatio)}"`
    : ` style="--me-embed-height:${provider.height ?? 400}px"`
  const kind = provider.aspectRatio ? 'me-embed--ratio' : 'me-embed--auto'
  return `<figure class="me-embed ${kind} me-embed--${provider.name}" data-href="${esc(href)}"${sizing}>`
    + `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen data-embed-resize></iframe>`
    + `<noscript><a href="${esc(href)}">${esc(href)}</a></noscript>`
    + `</figure>`
}

const PARAGRAPH = /<p>([\s\S]*?)<\/p>/g
const BARE_LINK = /^\s*<a\b([^>]*)>([\s\S]*?)<\/a>\s*$/i

/**
 * Turns article HTML into its published form: figures, image grids, lazy
 * loading, zoom markers and embeds. Idempotent on its own output.
 */
export function renderArticle(html: string, options: RenderArticleOptions = {}): string {
  const opts = {
    grids: options.grids ?? true,
    zoom: options.zoom ?? true,
    lazy: options.lazy ?? true,
    eagerImages: options.eagerImages ?? 1,
    embeds: options.embeds ?? defaultEmbedProviders,
  }
  const seen: Counter = { n: 0 }

  // Split into paragraphs and everything between them, so runs of image-only
  // paragraphs separated only by whitespace can be grouped.
  type Part = { kind: 'images', images: ArticleImage[] } | { kind: 'html', html: string }
  const parts: Part[] = []
  let last = 0
  for (const m of html.matchAll(PARAGRAPH)) {
    if (m.index! > last)
      parts.push({ kind: 'html', html: html.slice(last, m.index) })
    last = m.index! + m[0].length

    const images = imagesOnly(m[1])
    if (images) {
      for (const image of images) {
        const src = image.attrs.src
        const size = src && options.resolveImage ? options.resolveImage(src) : null
        if (size)
          image.size = size
      }
      parts.push({ kind: 'images', images })
      continue
    }

    const link = m[1].match(BARE_LINK)
    if (link && opts.embeds.length > 0) {
      const href = parseAttrs(link[1]).href
      // Only a link whose text is its own URL is an embed request; a link
      // with words in it is a sentence that happens to be one link long.
      const text = link[2].replace(/<[^>]+>/g, '').trim()
      if (href && (text === href || decodeEntities(text) === href)) {
        let url: URL | null = null
        try {
          url = new URL(href)
        }
        catch {}
        const provider = url ? opts.embeds.find(p => p.match(url!)) : undefined
        if (url && provider) {
          parts.push({ kind: 'html', html: renderEmbed(provider, provider.match(url)!, href) })
          continue
        }
      }
    }
    parts.push({ kind: 'html', html: m[0] })
  }
  if (last < html.length)
    parts.push({ kind: 'html', html: html.slice(last) })

  let out = ''
  let run: ArticleImage[] = []
  const flush = (): void => {
    if (run.length === 0)
      return
    if (opts.grids)
      out += renderGroup(run, opts, seen)
    else
      out += run.map(image => renderFigure(image, opts, seen)).join('\n')
    run = []
  }
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.kind === 'images') {
      run.push(...part.images)
      continue
    }
    // Whitespace between two image paragraphs does not break the run.
    if (run.length > 0 && part.html.trim() === '' && parts[i + 1]?.kind === 'images')
      continue
    flush()
    out += part.html
  }
  flush()
  return out
}
