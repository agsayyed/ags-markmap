function initMarkmap(retry = 0) {
  const el = document.getElementById('ags-markmap-container')
  if (!el) {
    if (retry < 30) {
      // Try for 3 seconds instead of 1
      console.warn(`[ags-markmap] Container not found. Retrying (${retry + 1})...`)
      setTimeout(() => initMarkmap(retry + 1), 100)
    } else {
      console.error('[ags-markmap] Container still not found after retries.')
    }
    return
  }

  if (!(window as any).markmap?.Markmap) {
    console.error('[ags-markmap] Markmap library is not loaded on window.')
    return
  }

  console.log('[ags-markmap] Container found. Extracting headings...')
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    t: h.textContent,
    href: `#${h.id}`
  }))

  const tree = {
    t: 'root',
    c: headings.map((h) => ({ t: h.t, payload: { href: h.href } }))
  }

  ;(window as any).markmap.Markmap.create(el, {}, tree)
  console.log('[ags-markmap] Markmap rendered.')
}

window.addEventListener('load', () => {
  console.log('[ags-markmap] Window fully loaded. Waiting for container...')
  setTimeout(() => initMarkmap(), 100)
})
