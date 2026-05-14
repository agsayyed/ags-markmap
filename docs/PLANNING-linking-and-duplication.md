# Markmap — Linking, Shortcode & Architecture: Planning Document

**Date:** 2026-05-14
**Scope:** ags-markmap module + ags-courses module + ags-host + content modules
**Updated:** After `feature.md` spec — shortcode implementation

---

## 0. Architecture Decision (2026-05-14)

### Two Coexisting Paths

| Path | Trigger | Container ID | Data Source | Layout Support |
|------|---------|-------------|-------------|----------------|
| **Auto-detect** | `ags_markmap: true` in frontmatter | `#ags-markmap-container` (created by `head-end.html` hook) | DOM headings/lists | `type: docs` only |
| **Shortcode** | `{{< ags-markmap "path/to/data" >}}` | `#ags-markmap-shortcode-container` (created at shortcode position) | YAML data file | All layouts |

- **Neither is primary** — author chooses via presence/absence of shortcode
- **Both present** → shortcode wins, auto-detect skips (TS checks `__agsMarkmapData` first)
- **Shortcode is self-sufficient** — loads deps via shared `load-deps.html` partial, no `ags_markmap: true` needed
- **`ags_markmap: true`** remains the "I want auto-detect" signal only

### Shortcode Implementation Details (✅ DONE)

| File | Action | Purpose |
|------|--------|---------|
| `layouts/partials/.../load-deps.html` | NEW | Shared CSS+JS loader, idempotent via `.Page.Scratch` |
| `layouts/partials/.../hooks/body-begin.html` | MODIFIED | Now delegates to `load-deps.html` |
| `layouts/shortcodes/ags-markmap.html` | NEW | Reads YAML → sets `window.__agsMarkmapData` |
| `assets/.../js/data/dataTreeBuilder.ts` | NEW | Recursive YAML→MarkmapNode converter |
| `assets/.../js/core/agsMarkmap.ts` | MODIFIED | Checks `__agsMarkmapData` first; `createMarkmap(containerId?)` |
| `assets/.../js/markmapMain.ts` | MODIFIED | Two init paths: shortcode vs auto-detect |
| `data/course/devops-structure.yaml` | NEW | Sample data (in ags-host) |
| `content/.../with-layout/test-shortcode.md` | NEW | Test page: landing layout + shortcode |

### Shortcode Data Format
```yaml
title: "Course Title"
initialExpandLevel: 2       # optional override
children:
  - title: "Section 1"
    url: /courses/section-1/  # optional click navigation
    children: [...]
```

---

## 1. Problem Statement

### Problem A — Content Duplication

### 2.1 The Repos
```
ags-module-workspace/
├── ags-markmap/          ← Mind map rendering module (V0.3.2+, our work)
├── ags-courses/          ← Course catalog framework (shortcodes, partials)
├── ags-ibm-ml-pcert/     ← IBM ML course CONTENT (actual .md pages with headings)
├── ags-mcq/              ← Multiple-choice questions module
├── course-display/       ← WIP, not relevant yet
└── ags-host/             ← HBStack Hugo site that consumes all modules
```

### 2.2 How Courses Work
- **Course metadata** lives in YAML data files (`data/catalog/courses/*.yaml`) — used by `ags-courses` shortcodes to render catalog cards
- **Course content** lives in dedicated modules like `ags-ibm-ml-pcert/` under `content/courses/ibm/ibm-ml-pcert/...` — these are REAL Hugo `.md` pages with headings, subheadings, and lists
- The `ags-courses` module provides the `{{< course-catalog >}}` shortcode for listing pages, and partials like `card.html`, `metadata.html`, `syllabus.html` for course detail pages
- Individual course pages already have `ags_markmap: true` in frontmatter — markmap IS being used

### 2.3 Markmap Placement
- Markmap injects via the `body-begin.html` HugoPress hook — **at the very top of `<body>`, outside the content area**
- The TypeScript module then finds/moves its container into the DOM
- Content renders normally below — this is why duplication occurs
- The module does NOT control whether content is shown/hidden; it's a render-time add-on

### 2.4 Current Frontmatter Options
```yaml
ags_markmap: true               # Enable markmap
ags_markmap_debug: true         # Show debug panel
ags_markmap_opts:
  zoom: true
  initialExpandLevel: -1        # -1 = fully expanded
  includeListItems: true        # (NEW) show list items as child nodes
```

---

## 3. Issues Found

### Issue 1 — Wrong Option Key in Existing Course Pages
**Found in:** `ags-ibm-ml-pcert/content/courses/ibm/ibm-ml-pcert/.../index.md`
```yaml
ags_markmap: true
ags_opts:                    # ← WRONG! Should be ags_markmap_opts
  zoom: true
  initialExpandLevel: 2
```
The key `ags_opts` is never read by the module. These pages have been silently ignoring their options. Fix: rename to `ags_markmap_opts`.

### Issue 2 — Headings AND Lists Duplicated with Content
When `includeListItems: true`, the markmap now shows headings + list items. But the full page content (with the same headings and same list items in prose form) still renders below. The more the markmap shows, the more duplication occurs.

### Issue 3 — No Anchor Links on Heading Nodes
Heading nodes in the markmap have no `href` in their payload. Clicking them could scroll to the corresponding `<h2 id="...">` element on the page, but this isn't implemented. Hugo generates IDs for all headings via Goldmark's `autoHeadingID`.

### Issue 4 — No Cross-Page Links for Section Indexes
On section index pages (like a course module listing), the markmap could show child page titles as clickable nodes that navigate to those pages. This would require `ContentParser` to understand Hugo's section/page structure, not just DOM headings.

### Issue 5 — List Item Links Limited to Explicit URLs
List item links work ONLY when the markdown contains an explicit `[text](url)`. Internal Hugo links via `relref` shortcodes are resolved to absolute URLs by Hugo at build time, so they work. But plain list items with no `<a>` tag get no link — there's no way to auto-link a list item to a sub-page.

### Issue 6 — Layout `landing` Requires Container Detection Fallback
Pages with `layout: landing` lack `main`/`article`/`.hb-docs-doc-content` elements. The LCA fallback in `getContentContainer()` handles this, but it's fragile — if the ancestor includes sidebar lists, they leak into the markmap.

---

## 4. Proposed Solutions

### Solution A — Content Duplication
**Option 1: Make markmap a TOC replacement (sidebar/panel)**
- Move markmap into the sidebar or a collapsible panel
- Content renders normally; markmap is a navigation aid, not a content replacement
- Pro: No duplication, clear separation of concerns
- Con: Major layout change, needs host-level template work

**Option 2: Conditional content visibility**
- Add frontmatter option: `ags_markmap_hide_content: true`
- When set, the page content below the markmap is hidden (or collapsed into the markmap)
- Pro: Simple to implement, opt-in, backward-compatible
- Con: Only works if the page is meant to be navigated purely via markmap

**Option 3: Markmap within content flow (replace first heading)**
- Inject markmap at the position of the first `<h1>`, replacing it
- Content below remains but the top-level heading isn't repeated
- Pro: Less invasive
- Con: Still partial duplication for sub-headings

**Decision needed.** Option 2 is simplest and most flexible. Let's discuss.

### Solution B — Anchor Links on Heading Nodes
- In `ContentParser.extractContentElements()`, extract the `id` attribute from heading elements (Hugo adds these automatically)
- Pass `id` through `ContentElement` → `MarkmapNode.payload.href` (as `#section-id`)
- Markmap's click handler or `markmap-view`'s built-in link support handles the rest
- **Repo:** `ags-markmap` only

### Solution C — Cross-Page Links for Section Indexes
- On section pages (`_index.md` with `ags_markmap: true`), instead of extracting headings from the current page DOM, generate nodes from Hugo's `.Pages` collection
- Each child page becomes a node with `href` pointing to its `.RelPermalink`
- Requires Hugo template logic (not just TypeScript) — a Hugo partial that serializes page structure as JSON
- More complex, **defer to Phase 2**

### Solution D — Fix Existing Course Pages
- Find all `ags_opts:` in `ags-ibm-ml-pcert` and rename to `ags_markmap_opts:`
- **Repo:** `ags-ibm-ml-pcert`

---

## 5. Implementation Plan

### Phase 1 — Immediate (this session)
| # | Task | Repo | Effort |
|---|---|---|---|
| 1 | Fix `ags_opts` → `ags_markmap_opts` in existing course pages | ags-ibm-ml-pcert | Small |
| 2 | Add anchor link extraction to `ContentParser` (heading `id` → `href`) | ags-markmap | Small |
| 3 | Update `ContentElement` + `MarkmapNode.payload` to carry `id`/`href` | ags-markmap | Small |
| 4 | Wire anchor links through `NodeFactory` → `TreeBuilder` → markmap render | ags-markmap | Medium |
| 5 | Add `ags_markmap_hide_content` frontmatter option (opt-in) | ags-markmap + ags-host | Small |
| 6 | Test on `without-layout/index.md` (docs layout) and `with-layout/test-minimal.md` (landing) | ags-host | Small |

### Phase 2 — Later
| # | Task | Repo |
|---|---|---|
| 7 | Cross-page link generation for section indexes (`.Pages` → nodes) | ags-markmap |
| 8 | Course module integration — auto-enable markmap on all course pages | ags-courses + ags-ibm-ml-pcert |
| 9 | Markmap as sidebar/TOC alternative layout | ags-host |

---

## 6. Open Questions

1. **Content duplication strategy** — Which solution (A1/A2/A3) do you prefer?
2. **Section index linking** — Is Phase 2, Task 7 important enough to prioritize?
3. **Course page consistency** — Should `ags_markmap: true` be added globally via `params.yaml` (like we already have `includeListItems: true`), or kept per-page?
4. **The `ags_opts` key** — Is this a one-off mistake in `ags-ibm-ml-pcert`, or is it used elsewhere too?
