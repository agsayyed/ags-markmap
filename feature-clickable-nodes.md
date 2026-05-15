# Feature Request: Clickable Nodes with URL Navigation

## Summary

When a YAML data node includes a `url:` field, clicking that node in the rendered markmap should navigate the browser to that URL.

## Current Behavior

The `url:` field is accepted in the YAML data file and passed through to `window.__agsMarkmapData`, but clicking a node does nothing. The node renders as static text in the SVG.

## Desired Behavior

- Nodes with a `url:` field should be clickable
- Clicking navigates to the URL (in the same tab or optionally a new tab)
- Clickable nodes should have visual feedback — e.g., pointer cursor, underline on hover, or distinct color
- Non-clickable nodes (no URL) remain static

## Use Case

On a course landing page, the markmap shows all courses with their modules. Each course node has a `url` pointing to the course page:

```yaml
- title: '01. Introduction to DevOps'
  url: /courses/ibm/devops-content/devops-pcert/01-introduction-to-devops/
  children:
    - title: 'Module 1: Overview'
```

Users explore the mind map and click a course to navigate there.

## Technical Notes

### Data Flow

The module already handles this correctly:

1. YAML data file has `url` field per node
2. `shortcode/ags-markmap.html` reads it and sets `window.__agsMarkmapData`
3. `markmapMain.ts` detects shortcode data and initializes
4. `buildTreeFromYaml()` in `dataTreeBuilder.ts` preserves the `url` field
5. `SVGRenderer.render()` calls `markmapAPI.create(svg, options, tree)`

The `url` data is already in the `MarkmapNode` tree object passed to `markmapAPI.create()`. The missing piece is an event handler that reads `url` from the clicked node and navigates.

### Suggested Implementation

**Option A — markmap-view onClick option (Recommended)**
The markmap-view library supports an `onClick` handler in its options. This is the cleanest approach:

```typescript
// In SVGRenderer.render(), pass onClick in options:
const renderOptions = {
  ...this.config.options,
  onClick: (node: any) => {
    const url = node?.data?.url;
    if (url) {
      window.location.href = url;
    }
  }
};
this.markmapInstance = markmapAPI.create(svg, renderOptions, tree);
```

Markmap-view's node data structure has a `data` property on each node that corresponds to the `MarkmapNode` fields, including `url`.

**Option B — Post-render DOM traversal**
After `markmapAPI.create()`, traverse the SVG `<g>` elements, match text content to the URL lookup, and attach click handlers. More fragile and slower.

### Styling for Clickable Nodes

```css
/* Add cursor pointer to nodes with URLs */
.ags-markmap-container svg g[data-url] {
  cursor: pointer;
}
.ags-markmap-container svg g[data-url]:hover text {
  text-decoration: underline;
  fill: #0066cc;
}
```

The `data-url` attribute can be set during build in `buildTreeFromYaml()` or during post-render DOM traversal.

## Priority

**P1** — This is the core navigation feature. Without it, the markmap is "look but don't touch".

## Related

- YAML data format already supports `url:` per the README
- Shortcode path works correctly (module v0.4.1)
- See `data/course/ibm-devops/devops-structure.yaml` for example data with URLs
