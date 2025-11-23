# AGS Markmap Diagnostic Panel

This debug panel helps troubleshoot ags-markmap module issues in consuming projects. It provides real-time monitoring of dependencies, initialization status, and actionable recommendations when things go wrong.

## Enabling the Debug Panel

### Method 1: Global Config (Recommended for Development)

Add to your `config/development/params.yaml`:

```yaml
hb:
  ags_markmap:
    enable: true
    debug: true  # Shows debug panel in development environment
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

**Note**: The panel requires `ags_markmap: true` in the page front matter to be visible.

## Reading the Debug Panel

### Hugo Info

- **Environment**: Current build environment (`development`, `production`)
- **Version**: Hugo version being used
- **Module Path**: Version/commit of ags-markmap module (if available from go.mod)

### Page Info

- **Title**: Current page title
- **Param ags_markmap**: Should be `true` if markmap is enabled for this page
- **Type**: Page type (docs, blog, etc.)

### DOM Elements

- **Container**: ✓ if `ags-markmap-container` div exists
- **SVG Element**: ✓ if markmap SVG is rendered with child elements
- **Headings Found**: Number of valid headings on page (excludes navigation/sidebar headings)

### Dependencies

- **D3.js**: ✓ if D3 library loaded from CDN (shows version)
- **Markmap Lib**: ✓ if markmap object exists
- **Markmap View**: ✓ if Markmap constructor available

### AGS Markmap

- **Instance**: ✓ if `window.agsMarkmap` object created
- **Initialized**: ✓ if markmap state shows `isInitialized: true`
- **State Info**: Displays heading count and tree depth from markmap state

### Config

Shows whether module configuration is found in `params.hb.ags_markmap`:
- **Enable**: Module enabled status
- **Debug**: Debug mode status

### Console Logs

Captures all console logs containing "markmap" or "ags" keywords for the first 30 seconds after page load.

## Diagnostic Report

The panel provides **actionable recommendations** based on detected issues:

### ✅ Success (Green)

Everything working correctly! All dependencies loaded, markmap initialized and rendered.

### ⚠️ Warning (Yellow)

Non-critical issues that may affect functionality:
- No headings found on page
- Module config not found
- Markmap initialized but no SVG rendered

### ❌ Error (Red)

Critical issues preventing markmap from working. Fix these first:
- D3.js not loaded (CDN blocked or network issue)
- Markmap library not loaded
- Container element missing (module not properly imported)
- TypeScript module not compiled

## Common Issues & Solutions

### Container Missing

**Problem**: Debug panel shows "Container: ✗ Missing"

**Solutions**:
```bash
# Update module and clear cache
hugo mod clean
hugo mod get -u github.com/agsayyed/ags-markmap
hugo mod tidy

# Verify module is imported
hugo mod graph
```

Also check:
- Page front matter has `ags_markmap: true`
- Module hooks are properly mounted

### TypeScript Module Not Loading

**Problem**: "AGS Markmap instance not created"

**Solutions**:
```bash
# Check Hugo output for compilation errors
hugo server -D --verbose
```

Common causes:
- Hugo version too old (requires Hugo Extended with js.Build support)
- TypeScript compilation errors
- Asset pipeline not configured correctly

### No Headings Found

**Problem**: "No headings found on page"

**Solution**: Ensure your content has proper heading structure:
```markdown
# Main Heading

## Sub Heading

### Detail Level
```

The module needs at least one heading to generate the mindmap.

### CDN Scripts Blocked

**Problem**: "D3.js not loaded" or "Markmap library not loaded"

**Solutions**:
- Check firewall/proxy settings
- Verify unpkg.com is accessible
- Check browser Network tab for failed requests (Status 404, CORS errors)
- Try accessing https://unpkg.com/d3@7/dist/d3.min.js directly in browser

### Module Config Not Found

**Problem**: "No config found in params.hb.ags_markmap"

**Solution**: This is a warning, not an error. The module works without explicit config, but you can add it for customization:

```yaml
# config/_default/params.yaml
hb:
  ags_markmap:
    enable: true
    debug: false  # Set to true only in development
    height: "500px"  # Optional: customize height
    autofit: true    # Optional: auto-fit on render
```

## Keyboard Shortcuts

- **Ctrl+Shift+D**: Toggle debug panel visibility (hide/show)

## Disabling the Panel

### For Production

Remove `debug: true` from production config or set it to `false`:

```yaml
# config/production/params.yaml
hb:
  ags_markmap:
    enable: true
    debug: false  # Disable in production
```

### For Specific Pages

Remove `ags_markmap_debug: true` from page front matter.

## Performance Impact

The debug panel:
- Only loads when explicitly enabled
- Stops monitoring after 30 seconds
- Minimal performance overhead
- Should not be enabled in production

## Troubleshooting Workflow

1. **Enable debug panel** (via config or front matter)
2. **Refresh the page** (Ctrl+Shift+R for hard refresh)
3. **Read the Diagnostic Report** - it will tell you exactly what's wrong
4. **Follow the recommended actions** step by step
5. **Check browser console** for additional error details
6. **Use `hugo mod graph`** to verify module imports

## Need Help?

If the diagnostic report doesn't solve your issue, please provide:

1. Screenshot of the debug panel showing all sections
2. Browser console errors (F12 → Console tab)
3. Output of `hugo mod graph`
4. Hugo version (`hugo version`)
5. Your configuration files (params.yaml, go.mod)

## Technical Details

The diagnostic panel is automatically included when you enable markmap on a page. It:
- Monitors the DOM for required elements
- Checks dependency loading status
- Reads markmap state via `window.agsMarkmap.getState()`
- Provides context-aware troubleshooting recommendations
- Captures relevant console output for analysis

The panel is designed to be self-contained and requires no additional setup beyond enabling the debug flag.
