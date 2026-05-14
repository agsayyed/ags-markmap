# Recommendations & Issues Found

## 1. CDN Race Condition — First Load Rendering

**Issue:** The `ags-markmap` shortcode doesn't render on first page visit. It only renders after a hard refresh (Ctrl+click refresh).

**Root Cause:** The module's `DependencyLoader` polls for CDN scripts (d3.js, markmap-view) loaded from `unpkg.com` with a timeout of ~10 seconds (20 attempts × 500ms). On first visit, the browser has no cached connection to `unpkg.com` — it must perform DNS lookup, TCP handshake, SSL negotiation, then download ~500KB+ of scripts. The poller can time out before scripts arrive.

**Fix Applied:** Added preconnect/dns-prefetch hints to `<head>`:

```html
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link rel="dns-prefetch" href="https://unpkg.com">
```

This establishes the CDN connection early, before the browser encounters the script tags.

**Recommendation for module (ags-markmap):**

- Increase `maxAttempts` default from 20 to 40 (20s total) for slow connections
- Or add a front matter option `ags_markmap_opts.loadTimeout` so users can configure it
- Or consider bundling d3.js locally instead of CDN

---

## 2. `display: none` SVG Length Error

**Issue:** When the markmap eventually loads, the browser console shows:

```
Uncaught NotSupportedError: Failed to read the 'value' property from 'SVGLength':
Could not resolve relative length.
```

**Root Cause:** An SVG with relative units (`width="1.5em"`, `height="1.5em"`) lives inside a search modal container that has `display: none`. When JavaScript tries to read `svgElement.width.baseVal.value`, the browser cannot resolve `em` to pixels because the element has no layout.

**Affected Element:**

- `<svg width="1.5em" height="1.5em">` inside `<button class="search-reset-button disabled">` inside `<div class="search-modal-container" style="display: none">`
- Likely in the HBstack search module's JavaScript.

**Suggested Fixes (in priority order):**

### A. Fix the search module JavaScript

In the script that reads SVG dimensions, add a visibility guard:

```js
// Before (throws error if hidden):
const width = svgElement.width.baseVal.value;

// After (safe):
let width;
if (svgElement.getBoundingClientRect().width > 0) {
    width = svgElement.width.baseVal.value;
} else {
    width = parseFloat(svgElement.getAttribute('width'));
}
```

### B. Use absolute units on SVG icons

Change from `width="1.5em"` to `width="24"` (pixels resolve even when hidden).

### C. Use `visibility: hidden` instead of `display: none`

If the parent container needs script-accessible dimensions while hidden:

```css
.search-modal-container.hidden {
    /* display: none;  — causes the error */
    visibility: hidden;
    position: absolute;
    left: -9999px;
}
```

> **Note:** When module is being built, it should read the `yaml` file from the module's `data/` directory, not the testing site's `data/` directory. The directory should be mapped/mounted in testing repo, like other assets. The shortcode should reference the module's data path (e.g. `{{< ags-markmap "course.my-course" >}}` for `data/course/my-course.yaml` within the module).