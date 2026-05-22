# Bug report — `ags_markmap_container_selector` produces invalid CSS + body-begin hook missing on non-docs layouts

**Module:** `github.com/agsayyed/ags-markmap`
**Version observed:** `v0.4.3`
**Host project:** Hugo + HBStack (`hbstack/blog@v0.24.2`, `hbstack/hb@v0.16.2`, `hugomods/hugopress@v0.5.2`)
**Reporter:** @agsayyed (downstream consumer)

---

## TL;DR

Two independent bugs make `ags_markmap: true` auto-detect unusable on `hbstack/blog` post pages:

1. **`head-end.html` hook produces invalid JS** when `ags_markmap_container_selector` is set in front matter. `jsonify` output is *re-escaped* by Go's contextual `html/template` engine inside the `<script>` block, producing a doubly-quoted string literal (e.g. `"\".hb-blog-post-content\""`). The resulting CSS selector is malformed and `querySelector()` throws `SyntaxError`.
2. **`body-begin.html` hook does not fire** in this project, so `load-deps.html` is never invoked from auto-detect mode. D3 + `markmap-view` are never loaded, and the renderer eventually errors with `Dependencies not loaded after 40 attempts. D3: false, Markmap: false`. Auto-detect therefore only ever worked when the page *also* contained the `{{</* ags-markmap */>}}` shortcode (which independently calls `load-deps`).

Together, these mean: on a blog post that *only* uses front-matter auto-detect with a custom container selector, nothing renders.

---

## Reproduction

Minimal blog post under `hbstack/blog` (no shortcode invocation):

```yaml
---
title: Example
ags_markmap: true
ags_markmap_container_selector: .hb-blog-post-content
ags_markmap_opts:
  zoom: true
  initialExpandLevel: 3
---

## Heading A
### Heading A.1
## Heading B
```

Run `hugo server` and load the page.

### Expected
- D3 + `markmap-view` script tags appear before `</body>`.
- `customSelector` in the rendered script equals the literal string `".hb-blog-post-content"`.
- A `<div class="ags-markmap-wrapper">` is injected inside the first `.hb-blog-post-content` element and a markmap renders inside it.

### Actual
- The page contains **no** `d3.min.js` or `markmap-view` `<script src>` tags.
- The rendered head script contains:
  ```js
  const customSelector = "\".hb-blog-post-content\"";
  ```
- Browser console:
  ```
  Uncaught SyntaxError: '".hb-blog-post-content"' is not a valid selector
  [ags-markmap] Dependencies not loaded after 40 attempts. D3: false, Markmap: false
  ```

---

## Bug 1 — Nested-quote escaping in `head-end.html`

### Location
`layouts/partials/hugopress/modules/ags-markmap/hooks/head-end.html` — currently line 72:

```go-html-template
const customSelector = {{ with .Page.Params.ags_markmap_container_selector }}{{ . | jsonify }}{{ else }}null{{ end }};
```

### Cause
Hugo's `html/template` engine applies **contextual auto-escaping** based on the surrounding HTML context. Inside a `<script>` block, any interpolated value goes through a JS-string-literal escape pass on top of whatever pipeline you ran. `jsonify` already produces a valid JS string literal (`"…"`); the second pass then escapes the existing quotes, yielding `"\"…\""`.

Reference: [Go contextual auto-escaping](https://pkg.go.dev/html/template#hdr-Contexts) and Hugo's [`safeJS`](https://gohugo.io/functions/safejs/) function.

### Fix
Pipe through `safeJS` to opt out of the second escape pass:

```diff
-    const customSelector = {{ with .Page.Params.ags_markmap_container_selector }}{{ . | jsonify }}{{ else }}null{{ end }};
+    const customSelector = {{ with .Page.Params.ags_markmap_container_selector }}{{ . | jsonify | safeJS }}{{ else }}null{{ end }};
```

The same pattern is already used elsewhere in the module — see `load-deps.html`:
```go-html-template
window.agsMarkmapOptions = {{ $opts | safeJS }};
```
and `layouts/shortcodes/ags-markmap.html`:
```go-html-template
window.__agsMarkmapData = {{ $data | jsonify | safeJS }};
```
So `head-end.html` line 72 is the lone outlier.

### Verification
After the patch, rendered output is:
```js
const customSelector = ".hb-blog-post-content";
```
and `querySelector(customSelector)` succeeds.

---

## Bug 2 — `body-begin.html` hook does not fire in `hbstack/blog` posts

### Symptom
Even when `ags_markmap: true` is set, the rendered HTML contains **none** of the output of `load-deps.html` (no `d3.min.js`, no `markmap-view/dist/browser/index.js`, no `window.agsMarkmapOptions`, no compiled TS bundle). The only deps that ever load are via the shortcode path.

This was confirmed by `curl`-ing the rendered page and grepping for `d3|markmap-view|agsMarkmapOptions` — zero hits even though the head-end hook output (preconnect, styles, container-creation script) IS present.

### Module registration (`config.toml` of ags-markmap)
```toml
[params.hugopress.modules.ags-markmap.hooks.head-end]
weight = 10

[params.hugopress.modules.ags-markmap.hooks.body-begin]
weight = 10
```

The `head-end` hook fires correctly. The `body-begin` hook does not. Both are registered the same way.

### Root cause (confirmed)

The hugopress dispatcher (`hugomods/hugopress@v0.5.2/layouts/partials/hugopress/functions/settings.html`) probes each registered hook with **`partialCached`**:

```go-html-template
{{- if not (partialCached "hugopress/functions/partial-exists" $partial $partial) }}
  {{- warnf "[hugopress] [%s] hook does't exist: layouts/partials/%s.html" $moduleName $partial }}
  {{- continue }}
{{- end }}
```

`partialCached` memoises the result for the lifetime of the Hugo process. So once `partial-exists` returns `false` for a given partial path, that **negative** result is locked in until restart. There is no invalidation tied to `hugo server`'s file-watcher when new layout files are added or when a downstream consumer drops in an override mid-session.

For `ags-markmap` specifically, in this hbstack stack:
- `head-end.html` is probed and *exists* at startup → cached positive → hook fires forever.
- `body-begin.html` is probed and *does not exist* at startup (likely a mount-order or filesystem-walk race in Hugo when many module mounts are involved — both files live in the same directory, yet only one is seen during the first dispatch). The negative result is cached and the hook is permanently skipped for the lifetime of that server process.

This was confirmed empirically:

1. With no project override → `body-begin` never fires → no D3/markmap scripts loaded.
2. Add project override at `layouts/partials/hugopress/modules/ags-markmap/hooks/body-begin.html` while the dev server is still running → still no D3/markmap scripts (the cached negative result blocks dispatch).
3. **Restart the Hugo server** → next request probes the path fresh, sees the project file, caches positive, hook fires, D3 + markmap-view + the TS bundle all load.

The bug is therefore the combination of:
- A racy / inconsistent first probe by Hugo for the module's `body-begin.html` partial in deeply-nested module stacks.
- `partialCached` indefinitely memoising the negative result.

A minimal upstream test (bare Hugo site with only `ags-markmap` + `hugopress`) does not exhibit the bug, which is why it surfaces only inside the hbstack stack.

### Note: `cacheable` is orthogonal to this bug

Downstream consumers sometimes try `cacheable: true|false` on a hook as a fix. It will not help here.

In `hugopress@v0.5.2/layouts/partials/hugopress/functions/render-hooks.html` the `cacheable` flag only chooses between `partialCached` and `partial` for the hook's **rendered output** — it runs *after* dispatch already decided to run the hook:

```go-html-template
{{- if .cacheable }}
  {{- partialCached .partial $ctx ... }}
{{- else }}
  {{- partial .partial $ctx }}
{{- end }}
```

The `partial-exists` probe in `settings.html` is `partialCached` unconditionally and is not affected by any per-hook flag. Hook authors cannot opt out of it.

For `ags-markmap` specifically, both hooks read per-page state (`.Page.Params`, `.Page.Scratch`), so the default `cacheable: false` is the safe choice. Setting `cacheable: true` without a correct `cache_param_key` / `cache_store_key` would actively introduce a different bug ("scripts only load on the first page rendered in the build").

### Workaround (currently applied in the downstream project)
Create a project-level mirror of the hook so Hugo's layout lookup resolves it from the project, not the module:

`layouts/partials/hugopress/modules/ags-markmap/hooks/body-begin.html`
```go-html-template
{{- partial "hugopress/modules/ags-markmap/debug/diagnostic-panel.html" . -}}

{{- if or .Page.Params.ags_markmap .Page.Params.ags_markmap_debug -}}
  {{- partial "hugopress/modules/ags-markmap/load-deps.html" . -}}
{{- end -}}
```

This file is byte-for-byte equivalent to the upstream `body-begin.html` minus comments. With it in place **and after a full Hugo server restart**, `load-deps.html` is invoked and D3 / markmap-view / the TS bundle all load.

> ⚠️ **Restart is mandatory.** Adding the override while `hugo server` is already running has no effect because the negative `partial-exists` result is already cached. Stop the server and start it again.

### Possible upstream remediation paths
1. **Move dep loading into the `head-end` hook** (which is known to fire reliably). Loading scripts at end-of-head is safe — they're not `defer`/`async` so they execute before the markmap container's logic runs. This eliminates the dependency on a second hook entirely.
2. **Stop relying on the cached `partial-exists` probe**: register `body-begin` with an explicit `partial:` key in `config.toml` pointing at an unambiguous path. Looking at `hugopress@v0.5.2/layouts/partials/hugopress/functions/settings.html`, the `direct=true` branch (when `partial:` is explicit) is structured differently and may sidestep the lookup race entirely. Worth filing a parallel issue on `hugomods/hugopress` to make `partial-exists` non-cached or invalidate on file-watch events.
3. **Document the restart-required workaround** in the README so hbstack consumers don't lose hours debugging.

---

## Bonus observation — `.hb-blog-post-content` is not in the default selector list

`hbstack/blog@v0.24.2/layouts/partials/hb/modules/blog/single.html` wraps the post body in `<div class="hb-blog-post-content hb-module">`. The default `contentSelectors` array in `head-end.html` does not include this class, so without `ags_markmap_container_selector`, the script falls through and matches `.container` near the footer — placing the markmap below the post body.

Suggest adding `.hb-blog-post-content` (and possibly `.hb-blog-post`) to the default selector list:

```diff
     const contentSelectors = customSelector ? [customSelector] : [
       // Specific HBStack/docs layouts
       '.hb-docs-doc-content',
       '.hb-docs-content',
       '.docs-content',
+      '.hb-blog-post-content',
+      '.hb-blog-post',
       ...
```

This would make auto-detect work on hbstack blog posts with zero per-page configuration.

---

## Summary of recommended changes

| # | File | Change | Required for |
|---|------|--------|--------------|
| 1 | `layouts/partials/hugopress/modules/ags-markmap/hooks/head-end.html` (line 72) | Add `\| safeJS` after `jsonify` | All users of `ags_markmap_container_selector` |
| 2 | `layouts/partials/hugopress/modules/ags-markmap/hooks/body-begin.html` *or* `head-end.html` | Ensure `load-deps` runs in a hook that reliably fires under hugopress in deeper module stacks | hbstack downstreams using auto-detect mode |
| 3 | `layouts/partials/hugopress/modules/ags-markmap/hooks/head-end.html` `contentSelectors` array | Add `.hb-blog-post-content`, `.hb-blog-post` | UX — removes per-page `ags_markmap_container_selector` need |

---

## Environment

| Item | Value |
|------|-------|
| Hugo | extended, >= 0.110.0 |
| `hugomods/hugopress` | v0.5.2 |
| `hbstack/hb` | v0.16.2 |
| `hbstack/blog` | v0.24.2 |
| `agsayyed/ags-markmap` | v0.4.3 |
| Browser | Chromium (any) |
| OS | Linux |

## Evidence (rendered output before fix)

```
$ curl -s http://localhost:1281/posts/js/01-history/ | grep -nE 'd3\.min|markmap-view|customSelector ='
161:    const customSelector = "\".hb-blog-post-content\"";
# (no d3 or markmap-view script tags)
```

## Evidence (rendered output after both project overrides)

```
$ curl -s http://localhost:1281/posts/js/01-history/ | grep -nE 'd3\.min|markmap-view|customSelector ='
164:    const customSelector = ".hb-blog-post-content";
416:<link rel="stylesheet" href="/ags-markmap.min.css"><script src="https://unpkg.com/d3@7/dist/d3.min.js"></script>
417:  <script src="https://unpkg.com/markmap-view@0.15.8/dist/browser/index.js"></script><script>
419:    window.agsMarkmapOptions = {"initialexpandlevel":3,"zoom":true};
```

Browser console after the fix:
```
[ags-markmap] AGS Markmap initialized successfully
[ags-markmap] Processed 12 headings, tree depth: 3
[ags-markmap] AGS Markmap ready for use
```
