# Release Workflow for ags-markmap Module

This document outlines the standard workflow for releasing new versions of the `ags-markmap` Hugo module.

## Overview

- **Repository:** https://github.com/agsayyed/ags-markmap
- **Branch Strategy:** Single `main` branch (no dev branch)
- **Versioning:** [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (MAJOR.MINOR.PATCH)
- **Current Version:** Check `package.json` or latest git tag

## Version Numbering Guidelines

- **MAJOR** (x.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.x.0): New features, backwards-compatible
- **PATCH** (0.0.x): Bug fixes, minor improvements

## Pre-Release Checklist

Before creating a new release:

1. ✅ All changes are committed and tested
2. ✅ CHANGELOG.md is updated with new version entry
3. ✅ Features work in light, dark, and auto theme modes
4. ✅ No errors in browser console
5. ✅ Documentation is up to date

## Release Process

### Step 1: Update CHANGELOG.md

Add a new section for the version above the previous release:

```markdown
## [0.x.x] - YYYY-MM-DD

### Added
- New features

### Fixed
- Bug fixes

### Changed
- Changes to existing functionality
```

**Date format:** Use the current date (YYYY-MM-DD)

### Step 2: Run Release Script

The module includes an automated release script (`release.sh`) that handles:
- Updating package.json version
- Committing changes
- Creating git tag
- Pushing to GitHub
- Creating GitHub release

**Usage:**
```bash
cd /path/to/ags-markmap
./release.sh v0.x.x "Brief Description"
```

**Example:**
```bash
./release.sh v0.3.2 "Fix dark mode theme support"
```

### Step 3: Verify Release

1. Check GitHub releases: https://github.com/agsayyed/ags-markmap/releases
2. Verify the tag appears: `git tag -l`
3. Confirm version in package.json matches

## What the Script Does

The `release.sh` script automatically:

1. Extracts version number (removes 'v' prefix for package.json)
2. Updates `package.json` with new version
3. Stages all changes: `git add .`
4. Commits with message: `chore: release v0.x.x`
5. Creates annotated tag: `git tag v0.x.x -m "Release v0.x.x: Description"`
6. Pushes to origin: `git push origin main --tags`
7. Creates GitHub release with installation instructions

## Manual Release (Alternative)

If you prefer manual control or the script fails:

```bash
# 1. Update package.json version manually
vim package.json  # Change "version": "0.x.x"

# 2. Stage and commit
git add .
git commit -m "fix: description of changes"

# 3. Create tag
git tag v0.x.x -m "Release v0.x.x: Description"

# 4. Push
git push origin main --tags
```

## Post-Release

### Consuming Projects Update

After release, consuming projects can update by:

```yaml
# In consuming project's hugo.yaml or config.toml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
      version: v0.x.x  # Update to new version
```

Then run:
```bash
hugo mod get -u github.com/agsayyed/ags-markmap
hugo mod tidy
```

## Troubleshooting

### Script Permission Denied
```bash
chmod +x release.sh
```

### Tag Already Exists
```bash
# Delete local tag
git tag -d v0.x.x

# Delete remote tag
git push origin :refs/tags/v0.x.x
```

### Failed to Push
Check:
- GitHub authentication (SSH key or token)
- Branch protection rules
- Network connectivity

## Example Release History

```
v0.3.2 (2026-05-13) - Fix dark mode theme support
v0.3.1 (2025-11-23) - Fix asset mounting conflicts
v0.3.0 (2025-11-23) - Add diagnostic panel
v0.2.0 - Feature updates
v0.1.x - Initial releases
```

## Notes for AI Agents

When asked to create a release:

1. **Always update CHANGELOG.md first** with proper version section
2. **Use the release.sh script** - it's tested and handles everything
3. **Verify the version number** follows semantic versioning
4. **Check git status** before running script to ensure all changes are included
5. **Don't rush** - review CHANGELOG entry for completeness
6. **This module uses `main` branch directly** - no dev branch workflow

## Quick Reference

```bash
# Current version
cat package.json | grep version
git tag -l | tail -1

# Run release
./release.sh v0.x.x "Description"

# Check status
git log --oneline -1
git tag -l | tail -1
```
