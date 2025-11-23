# AGS Markmap Diagnostic Panel

This debug panel helps troubleshoot ags-markmap module issues in consuming projects.

## Enabling the Debug Panel

### Method 1: Global Config (Development Only)

Add to your `config/development/params.yaml`:

```yaml
hb:
  ags_markmap:
    enable: true
    debug: true  # Shows debug panel in development
```

### Method 2: Per-Page Front Matter

Add to your page's front matter:

```yaml
---
title: "My Page"
ags_markmap: true
ags_markmap_debug: true  # Enable debug panel for this page only
---
```

## Reading the Debug Panel

### Hugo Info
- **Environment**: Should match your build environment (`development`, `production`)
- **Version**: Hugo version being used
- **Module Path**: Version of ags-markmap module (from go.mod)

### Page Info
- **Param ags_markmap**: Should be `true` if enabled
- **Type**: Page type (docs, blog, etc.)

### DOM Elements
- **Container**: ✓ if `ags-markmap-container` div exists
- **SVG Element**: ✓ if markmap SVG is rendered
- **Headings Found**: Number of valid headings on page (excludes nav/sidebar)

### Dependencies
- **D3.js**: ✓ if D3 library loaded from CDN
- **Markmap Lib**: ✓ if markmap object exists
- **Markmap View**: ✓ if Markmap constructor available

### AGS Markmap
- **Instance**: ✓ if window.agsMarkmap object created
- **Initialized**: ✓ if markmapView has been created
- **Tree Nodes**: Number of nodes in the generated tree

### Console Logs
Captures all console logs containing "markmap" or "ags" keywords.

## Diagnostic Report

The panel provides **actionable recommendations** based on what's failing:

### ❌ Error (Red)
Critical issues preventing markmap from working. Fix these first.

### ⚠️ Warning (Yellow)
Non-critical issues that may affect functionality.

### ✅ Success (Green)
Everything working correctly!

## Common Issues & Solutions

### Container Missing
```bash
# Update module and clear cache
hugo mod clean
hugo mod get -u github.com/agsayyed/ags-markmap
hugo mod tidy
```

### TypeScript Module Not Loading
Check Hugo output for compilation errors:
```bash
hugo server -D --verbose
```

### No Headings Found
Ensure your content has proper heading structure:
```markdown
# Main Heading

## Sub Heading

### Detail
```

### CDN Scripts Blocked
- Check firewall/proxy settings
- Verify unpkg.com is accessible
- Check browser Network tab for failed requests

## Keyboard Shortcuts

- **Ctrl+Shift+D**: Toggle debug panel visibility

## Disabling the Panel

Remove `ags_markmap_debug: true` from front matter or set `debug: false` in config.

## Need Help?

If the diagnostic report doesn't solve your issue, include:
1. Screenshot of the debug panel
2. Browser console errors
3. Output of `hugo mod graph`
4. Hugo version and environment
