# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2025-07-06

### Added

- Environment-aware debug logging
- Smart development/production detection
- Conditional console logging that only shows in development

### Changed

- Debug messages now only appear in development environment
- Improved logging with `[AGS-Markmap Debug]` prefix
- Better developer experience with detailed debugging in dev mode

### Fixed

- Production console output is now clean without debug noise

## [0.1.0] - 2025-07-05

### Added

- Initial release of ags-markmap Hugo module
- Automatic mindmap generation from page headings
- Front matter activation with `ags_markmap: true`
- HBStack/HugoPress integration via hooks
- CDN-based dependencies (Markmap.js, D3.js)
- Interactive navigation (click to scroll to sections)
- Responsive design for mobile and desktop
- SCSS customization support
- Zero build dependencies

### Features

- Dynamic heading extraction (H1-H6)
- SVG-based interactive mind maps
- Click-to-navigate functionality
- Configurable height, autoFit, duration
- Compatible with Hugo >= 0.110.0

[Unreleased]: https://github.com/agsayyed/ags-markmap/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/agsayyed/ags-markmap/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/agsayyed/ags-markmap/releases/tag/v0.1.0
