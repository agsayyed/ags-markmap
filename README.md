# ags-markmap

A Hugo module that automatically renders an interactive Markmap mind map from your page's headings. It integrates seamlessly with Hugo and
HBStack framework.

## Features

- **Automatic Mind Maps**: Generates an interactive mind map from your page's headings
- **Data-Driven Shortcode**: Render mind maps from structured YAML data files — ideal for course catalogs, landing pages, and AI-generated content
- **Front Matter Activation**: Simply add `ags_markmap: true` to any page
- **List Items as Nodes**: Optionally render bullet/numbered list items as child nodes in the tree
- **Collapsible Levels**: Control initial expand depth via `initialExpandLevel`
- **Interactive Navigation**: Nodes with `url` fields become clickable links
- **HBStack Compatible**: Integrates perfectly with HugoPress hooks
- **CDN-Based**: Zero build dependencies — uses CDN-loaded libraries
- **Responsive**: Works on desktop and mobile devices

## Installation

### Prerequisites

- [Hugo](https://gohugo.io/) >= 0.110.0
- [Go](https://golang.org/) >= 1.18.0

### Import the Module

1. Initialize Hugo Module (if not already done):

```bash
hugo mod init github.com/user/project
```

1. Import the module:

```bash
hugo mod get github.com/agsayyed/ags-markmap
```

1. Add the module to your site's configuration:

```yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
```

## Usage

To enable Markmap on any page, add this to your front matter:

```yaml
---
title: 'My Page with Markmap'
date: 2025-07-04
ags_markmap: true
---
```

The mind map will automatically render at the top of your content, extracting headings from your page and creating an interactive
visualization.

## Configuration

Configure the module in your site's `config.yaml`:

```yaml
params:
  hb:
    ags_markmap:
      enable: true # Enable or disable globally
      placement: top # Placement location
      height: 400px # Height of the mind map
      autoFit: true # Auto-fit to container
      duration: 400 # Animation duration (ms)
```

### Page-level Options (Front Matter)

Add per-page options via `ags_markmap_opts`:

```yaml
ags_markmap_opts:
  zoom: true
  initialExpandLevel: -1   # -1 = fully expanded
  includeListItems: true   # show list items as child nodes
  maxDepth: 4
```

> **Note:** Hugo's `jsonify` template function lowercases all YAML keys when injecting them as `window.agsMarkmapOptions`. The module's `Configuration.normalizeKeys()` handles this internally — you should always write keys in **camelCase** in your front matter. If a new option isn't taking effect, check `configuration.ts` to ensure it's in the `keyMap`. See [DEBUGGING_GUIDE.md](docs/DEBUGGING_GUIDE.md#hugo-jsonify-lowercases-yaml-keys) for details.

## How It Works

The module has two modes:

### Auto-Detect Mode
1. Detects pages with `ags_markmap: true` in front matter
2. Uses HugoPress hooks to inject the mind map container
3. Walks the page DOM to extract headings (H1-H6) and optionally list items
4. Builds a hierarchical tree and renders an interactive SVG mind map

### Shortcode Mode (Data-Driven)
1. Place `{{< ags-markmap "path.to.data" >}}` anywhere in your markdown
2. Shortcode reads the YAML data file from Hugo's `data/` directory
3. Renders the mind map at the shortcode's position — ideal for landing pages
4. Self-sufficient — no `ags_markmap: true` needed

---

## Shortcode Usage (Data-Driven)

For `layout: landing` pages or when you want full control over the mind map structure, use the shortcode with a YAML data file.

### Step 1: Create a Data File

Place a YAML file in your site's `data/` directory:

```yaml
# data/course/my-course.yaml
title: "Course Title"
provider: "Provider Name"
url: "https://example.com/course"     # optional root link
initialExpandLevel: 1                 # optional, overrides frontmatter
children:
  - title: "Section 1"
    url: /courses/section-1/          # optional, makes node clickable
    children:
      - title: "Module A"
      - title: "Module B"
  - title: "Section 2"
    url: /courses/section-2/
    children:
      - title: "Module C"
      - title: "Module D"
```

### Step 2: Use the Shortcode

```markdown
---
layout: landing
title: 'My Course Overview'
ags_markmap_opts:
  zoom: true
  initialExpandLevel: 1
  height: 700px
---

{{< ags-markmap "course.my-course" >}}
```

The parameter uses **dot notation** to navigate Hugo's `site.Data`. `"course.my-course"` resolves to `data/course/my-course.yaml`.

> ⚠️ **Important:** The shortcode takes **exactly one argument** — the data path. Options like `zoom`, `initialExpandLevel`, and `height` go in `ags_markmap_opts` frontmatter (above), **not** in the shortcode.  
> ❌ `{{< ags-markmap "course.foo" zoom=true >}}` — WRONG  
> ✅ Options in frontmatter, path in shortcode — CORRECT

> **Tip:** You can nest data files in subdirectories. `"course.ibm.devops"` resolves to `data/course/ibm/devops.yaml`.

### Clickable Nodes (URL Navigation)

Add a `url:` field to any node in the YAML data to make it clickable. Hover shows a blue underline + pointer cursor, and clicking navigates the browser:

```yaml
children:
  - title: "Section 1"
    url: /courses/section-1/   # ← clickable — navigates here
    children:
      - title: "Module A"       # ← not clickable (no url:)
```

### Both Modes Together

If a page has both `ags_markmap: true` and the shortcode, the shortcode takes priority and auto-detect is skipped — no duplicate markmap.

---

## Page-Level Options

All options go under `ags_markmap_opts` in front matter, or at the root of YAML data files:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `zoom` | bool | `true` | Enable zoom on the mind map |
| `pan` | bool | `true` | Enable pan/drag on the mind map |
| `initialExpandLevel` | int | `2` | Initial expand depth. `-1` = all, `0` = root only, `1` = root + 1 level |
| `includeListItems` | bool | `false` | (Auto-detect only) Show list items as child nodes |
| `height` | string | `400px` | Mind map container height (CSS value) |
| `maxDepth` | int | `4` | Maximum tree depth to render |
| `duration` | int | `750` | Animation duration in milliseconds |
| `colorFreezeLevel` | int | `6` | Depth at which to freeze node colors |
| `loadTimeout` | int | — | Max time (ms) to wait for CDN scripts (default: 20000) |

## Debugging

Enable the diagnostic panel by adding to front matter:

```yaml
ags_markmap_debug: true
```

This shows a real-time status panel with dependency checks, heading counts, tree depth, and console logs. See [DEBUGGING_GUIDE.md](docs/DEBUGGING_GUIDE.md) for full details.

---

## Customization

### Styling

Customize the appearance by overriding SCSS variables:

```scss
$ags-markmap-height: 500px;
$ags-markmap-border-color: #ddd;
$ags-markmap-border-radius: 8px;
$ags-markmap-margin-bottom: 3rem;
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with SVG support

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
