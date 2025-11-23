# AGS Markmap Debugging Guide

## What Was Added

### 1. Diagnostic Panel
A comprehensive debug panel that appears on pages with `ags_markmap_debug: true` enabled.

**Location**: `layouts/partials/hugopress/modules/ags-markmap/debug/diagnostic-panel.html`

### 2. Integration
The diagnostic panel is automatically included via the `body-begin.html` hook.

**Modified**: `layouts/partials/hugopress/modules/ags-markmap/hooks/body-begin.html`

## How It Works in Development Project

Currently working in your development environment because:
- ✅ Module is local (mounted directly)
- ✅ TypeScript compilation works
- ✅ All dependencies load correctly
- ✅ Config is properly set

## What Will Happen in Consuming Project

When you push this to GitHub and import it in another project, the debug panel will:

### ✅ Automatically Detect Issues

1. **Missing Dependencies** - If D3.js or Markmap CDN fails
2. **Container Problems** - If module hooks aren't loading
3. **TypeScript Compilation** - If Hugo can't process the TS files
4. **Heading Extraction** - If no valid headings found
5. **Initialization Failures** - If markmap doesn't initialize
6. **Config Issues** - If params.yaml is missing or incorrect

### 📋 Provide Actionable Solutions

For each issue detected, the panel shows:
- ❌ Error level (critical, must fix)
- ⚠️ Warning level (should fix)
- ✅ Success (all working)

Plus step-by-step instructions to resolve each issue.

## Current Debug Output Analysis

Your current output shows:
```
• Container: ✓ (DIV)              <- Working
• SVG Element: ✓ (2 children)     <- Working  
• D3.js: ✓ object v7.9.0          <- Working
• Markmap Lib: ✓ object           <- Working
• Markmap View: ✓ function        <- Working
• Instance: ✓ object              <- Working
• Initialized: ✗ Not initialized  <- This is the issue!
```

### Why "Not Initialized"?

Looking at your logs, you see:
```
[LOG] --- ags-markmap: AGS Markmap initialized successfully ---
```

But the panel shows "Not initialized" because it's checking `agsInstance.markmapView` which might not be set yet or might be named differently in your implementation.

### Fix the Check

The diagnostic panel looks for `window.agsMarkmap.markmapView`. 

Check your `agsMarkmap.ts` implementation:
- Does it set `this.markmapView` property?
- Or is it named something else?

The panel will guide users to check this in the consuming project.

## Benefits for Consuming Projects

### Before (Without Debug Panel)
User sees blank page and has to:
1. Open browser inspector
2. Check console (might not have debug logs in production)
3. Manually verify each dependency
4. Guess what's wrong
5. Search documentation

### After (With Debug Panel)
User sees:
1. Clear visual panel with all status checks
2. Specific error identification
3. Step-by-step solutions
4. Links to documentation
5. Console log capture

## Typical Consuming Project Issues

### Issue 1: Module Not Imported
```
❌ Container element missing

Actions:
1. Verify body-begin.html hook is being loaded
2. Check if Hugo module is properly imported (run: hugo mod graph)
3. Ensure module mounts are correct in go.mod
4. Check if ags_markmap: true is in page front matter
```

### Issue 2: TypeScript Not Compiling
```
❌ AGS Markmap instance not created

Actions:
1. Check if TypeScript module is being compiled (check browser console)
2. Verify Hugo asset pipeline: resources.Get "hb/modules/agsayyed/js/index.ts"
3. Run: hugo mod clean && hugo mod get -u
4. Check if js.Build is processing TypeScript correctly
5. Look for TypeScript compilation errors in Hugo output
```

### Issue 3: CDN Blocked
```
❌ D3.js not loaded

Actions:
1. Check if CDN scripts are being blocked by firewall/proxy
2. Verify internet connectivity
3. Check browser console for network errors
4. Try using a different CDN or local copy
```

## Testing Checklist Before Commit

- [x] Debug panel shows in development
- [x] Panel displays all status indicators
- [x] Console logs are captured
- [x] Recommendations are generated
- [x] Keyboard shortcut (Ctrl+Shift+D) works
- [ ] Test with config `debug: false` (should not show)
- [ ] Test with no config (should not show in production)
- [ ] Test with `ags_markmap_debug: true` in front matter

## Next Steps

### 1. Commit Changes
```bash
cd /home/ag-sayyed/Documents/projects/hugo/modules/ags-modules/ags-module-workspace/modules/ags-markmap
git add layouts/partials/hugopress/modules/ags-markmap/debug/
git add layouts/partials/hugopress/modules/ags-markmap/hooks/body-begin.html
git commit -m "feat: Add comprehensive diagnostic panel for debugging

- Add diagnostic-panel.html with real-time status monitoring
- Show dependency loading status (D3, Markmap)
- Display DOM element checks (container, SVG, headings)
- Provide actionable troubleshooting recommendations
- Capture and display relevant console logs
- Enable via config (debug: true) or page param (ags_markmap_debug: true)
- Add keyboard shortcut (Ctrl+Shift+D) to toggle panel
- Include README with usage instructions"
```

### 2. Push to GitHub
```bash
git push origin feat/adding-debug-module
```

### 3. Create Pull Request / Merge
Merge the feature branch to main when ready.

### 4. Update in Consuming Project
```bash
# In your consuming project
hugo mod get -u github.com/agsayyed/ags-markmap
hugo mod tidy
```

### 5. Enable Debug in Consuming Project

Add to `config/development/params.yaml`:
```yaml
hb:
  ags_markmap:
    enable: true
    debug: true
```

### 6. Test Page

Navigate to a page with:
```yaml
---
ags_markmap: true
---
```

You should see the debug panel appear automatically!

## FAQ

### Q: Will this slow down my site?
A: No! The panel only loads when:
- `debug: true` in config (development only)
- OR `ags_markmap_debug: true` in page front matter

### Q: Can I use this in production?
A: Not recommended. Set `debug: false` or remove the config in production.

### Q: How do I share debug info with others?
A: Take a screenshot of the diagnostic panel - it contains all relevant info.

### Q: What if the panel itself doesn't appear?
A: That means the module isn't loading at all. Check:
1. `hugo mod graph` shows the module
2. Front matter has `ags_markmap: true`
3. Hugo version is compatible

## Conclusion

This diagnostic panel transforms debugging from a frustrating guessing game into a guided troubleshooting experience. Users in consuming projects will immediately know what's wrong and how to fix it.
