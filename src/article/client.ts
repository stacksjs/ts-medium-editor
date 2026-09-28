/**
 * The reader's side of a published article, in the browser: Medium-style
 * click-to-zoom for images marked `data-zoomable`, and auto-height for embeds
 * marked `data-embed-resize` whose frame reports its size.
 *
 * `renderArticle` (in `./render`) adds both markers, so on a page it rendered
 * one call is all it takes:
 *
 *   const teardown = mountArticle()
 *
 * Nothing here is required: without it images and embeds still show, they
 * just do not zoom or resize.
 */

export interface MountArticleOptions {
  /** Where to look for zoomable images and embeds. Default `document`. */
  root?: ParentNode
  /** Space kept around a zoomed image, in CSS px. Default 24. */
  margin?: number
  /** Scrolling this far closes a zoomed image, in CSS px. Default 40. */
  scrollOffset?: number
}

interface EmbedHeightMessage {
  type: 'embed:height'
  height: number
}

function isHeightMessage(data: unknown): data is EmbedHeightMessage {
  return typeof data === 'object' && data !== null
    && (data as EmbedHeightMessage).type === 'embed:height'
    && Number.isFinite((data as EmbedHeightMessage).height)
}

export function mountArticle(options: MountArticleOptions = {}): () => void {
  if (typeof document === 'undefined')
    return () => {}

  const root = options.root ?? document
  const margin = options.margin ?? 24
  const scrollOffset = options.scrollOffset ?? 40
  const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  let open: { img: HTMLImageElement, overlay: HTMLDivElement, scrollY: number } | null = null

  function close(): void {
    if (!open)
      return
    const { img, overlay } = open
    open = null
    overlay.classList.remove('me-zoom-overlay--open')
    img.style.transform = ''
    const done = (): void => {
      img.classList.remove('me-zoom-image--open')
      overlay.remove()
    }
    if (reduceMotion)
      done()
    else
      img.addEventListener('transitionend', done, { once: true })
    // In case the transition never fires (display change, detached node).
    setTimeout(done, 400)
  }

  function zoom(img: HTMLImageElement): void {
    if (open) {
      close()
      return
    }
    const overlay = document.createElement('div')
    overlay.className = 'me-zoom-overlay'
    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)

    // A higher resolution source, if the page offers one, loads while the
    // zoom runs; the displayed image keeps its current pixels until then.
    const hi = img.getAttribute('data-zoom-src')
    if (hi && img.currentSrc !== hi) {
      const loader = new Image()
      loader.onload = () => {
        img.removeAttribute('srcset')
        img.src = hi
      }
      loader.src = hi
    }

    const rect = img.getBoundingClientRect()
    const naturalW = img.naturalWidth || rect.width
    const viewW = document.documentElement.clientWidth - margin * 2
    const viewH = window.innerHeight - margin * 2
    // Fit the image's own aspect ratio into the viewport, never past its
    // natural size (zooming a small image into mush helps nobody).
    const fit = Math.min(viewW / rect.width, viewH / rect.height, Math.max(naturalW / rect.width, 1))
    const scale = Math.max(fit, 1)
    const dx = margin + viewW / 2 - (rect.left + rect.width / 2)
    const dy = margin + viewH / 2 - (rect.top + rect.height / 2)

    img.classList.add('me-zoom-image--open')
    // Force the class to apply before the transform, so the transition runs.
    void img.offsetWidth
    img.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    requestAnimationFrame(() => overlay.classList.add('me-zoom-overlay--open'))
    open = { img, overlay, scrollY: window.scrollY }
  }

  function onClick(event: Event): void {
    const target = event.target as Element | null
    const img = target?.closest?.('img[data-zoomable]') as HTMLImageElement | null
    if (!img || !(root as Node).contains(img))
      return
    if (open && open.img !== img) {
      close()
      return
    }
    event.preventDefault()
    zoom(img)
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape')
      close()
    const img = (event.target as Element | null)?.closest?.('img[data-zoomable]') as HTMLImageElement | null
    if (img && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      zoom(img)
    }
  }

  function onScroll(): void {
    if (open && Math.abs(window.scrollY - open.scrollY) > scrollOffset)
      close()
  }

  function onMessage(event: MessageEvent): void {
    if (!isHeightMessage(event.data))
      return
    for (const frame of root.querySelectorAll<HTMLIFrameElement>('iframe[data-embed-resize]')) {
      if (frame.contentWindow === event.source) {
        const height = Math.min(Math.max(Math.round(event.data.height), 80), 4000)
        frame.style.height = `${height}px`
        frame.closest('.me-embed')?.classList.add('me-embed--sized')
      }
    }
  }

  // Zoomable images are keyboard reachable, the way a button would be.
  for (const img of root.querySelectorAll<HTMLImageElement>('img[data-zoomable]')) {
    if (!img.hasAttribute('tabindex'))
      img.tabIndex = 0
    if (!img.hasAttribute('role'))
      img.setAttribute('role', 'button')
    if (!img.hasAttribute('aria-label') && img.alt)
      img.setAttribute('aria-label', `Zoom image: ${img.alt}`)
  }

  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', close)
  window.addEventListener('message', onMessage)

  return () => {
    close()
    document.removeEventListener('click', onClick)
    document.removeEventListener('keydown', onKey)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', close)
    window.removeEventListener('message', onMessage)
  }
}
