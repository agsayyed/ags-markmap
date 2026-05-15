# Code of Conduct — ags-markmap Development

## Release Policy

**No release shall be made without explicit permission from the project owner.**

Before any release:
- All changes must be tested and verified working on a live dev server
- The project owner must confirm the feature works as expected
- The `release.sh` script must not be run without explicit instruction

## Commit Policy

**No final commit shall be made unless clear testing has passed.**

Before any commit:
- Changes must be tested on the running dev server
- The project owner must verify the feature/fix behaves correctly
- No "test later" commits — test first, commit after

## Testing Checklist

- [ ] Dev server is running and serving the latest changes
- [ ] Affected pages load without errors (200 OK)
- [ ] The specific feature/fix behaves correctly in the browser
- [ ] Existing functionality is not broken (regression check)
- [ ] Project owner confirms the change

## Reasoning

Releasing untested code wastes time on broken releases, creates unnecessary version bumps, and erodes trust. Test first, release only when asked.
