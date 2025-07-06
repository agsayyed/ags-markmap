# Release Notes Template

## What's Changed in v[VERSION]

### ✨ New Features
- [Feature 1]: Description
- [Feature 2]: Description

### 🐛 Bug Fixes
- [Fix 1]: Description
- [Fix 2]: Description

### 📚 Documentation
- [Doc 1]: Description

### 🔧 Internal Changes
- [Change 1]: Description

---

**Full Changelog**: https://github.com/agsayyed/ags-markmap/compare/v[PREVIOUS_VERSION]...v[VERSION]

## Installation

```yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
      version: v[VERSION]
```

## Usage

Add to any page frontmatter:
```yaml
---
title: "My Page"
ags_markmap: true
---
```
