## 📘 Prompt: Build `ags-markmap` Hugo Module for HBStack

### 🔗 Reference Technologies & Docs

* **Markmap.js** → [https://markmap.js.org/docs/markmap](https://markmap.js.org/docs/markmap)
* **Hugo** → [https://gohugo.io/](https://gohugo.io/)
* **HBStack** → [https://hbstack.dev/](https://hbstack.dev/)
* **HugoMods** → [https://hugomods.com/](https://hugomods.com/)

---

### 🎯 Goal

Build a reusable **Hugo module** named `ags-markmap`, compatible with **HBStack**, to render an interactive [Markmap.js](https://markmap.js.org) mind map for any content page with the front matter:

```yaml
ags_markmap: true
```

The Markmap should:

* Render just **below the featured image/hero**, before page content.
* Auto-generate from that page’s headings (`.TableOfContents` or parsed from `.Content`).
* Be interactive: clickable nodes scroll to corresponding heading anchors.
* Be configurable via `params.hb.ags_markmap` configuration.

---

### 🏗️ Correct Directory Structure for HB Modules

According to [HBStack module guidelines](https://hbstack.dev/modules/hb/module/), your `ags-markmap` module must follow this structure:

```bash
ags-markmap/
├── go.mod
├── assets/
│   └── hb/
│       └── modules/
│           └── ags-markmap/
│               ├── js/
│               │   └── index.ts
│               └── scss/
│                   ├── variables.tmpl.scss
│                   └── index.scss
├── layouts/
│   └── partials/
│       └── hugopress/
│           └── modules/
│               └── ags-markmap/
│                   ├── hooks/
│                   │   └── content-top.html
│                   └── attributes/
│                       └── page.html (optional)
```

---

### 🧪 Testing the Module

1. **Local setup**

   ```bash
   hugo mod init github.com/agsayyed/ags-markmap
   ```

2. **Import in your HBStack site**

   ```toml
   [[module.imports]]
     path = "github.com/agsayyed/ags-markmap"
   ```

3. **Or use local replace during development**

   ```go
   replace github.com/agsayyed/ags-markmap => ../local/path/to/ags-markmap
   ```

4. **Usage**
   In any `.md` file:

   ```yaml
   ---
   title: "Example Page"
   ags_markmap: true
   featured_image: "banner.jpg"
   ---
   ```

---

### 🔧 Optional Enhancements

* Allow placement config: `params.hb.ags_markmap.placement = "top" | "shortcode"`
* Add a shortcode `{{< agsmarkmap >}}` for manual placement
* Automatically inject `<svg>` and Markmap init script via `hugopress` hooks
* Minimize load by checking `ags_markmap` per page

---
