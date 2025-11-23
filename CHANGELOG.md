# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2025-11-23

### Added

- Comprehensive diagnostic panel for debugging module issues
- Real-time status monitoring for all module components and dependencies
- Visual status indicators (✓/✗) for quick issue identification
- Actionable diagnostic reports with step-by-step troubleshooting solutions
- Color-coded severity levels (Error, Warning, Success) for recommendations
- Console log capture for markmap-related messages (30-second window)
- Site and page configuration detection and display
- Heading extraction and tree structure validation
- State information display (heading count, tree depth, initialization status)
- Keyboard shortcut (Ctrl+Shift+D) for toggling diagnostic panel
- User-facing documentation (debug/README.md)
- Developer documentation (docs/DEBUGGING_GUIDE.md)

### Changed

- Diagnostic panel positioned globally for availability across all pages
- Hugo template integration using index function for proper param access
- JavaScript state management improved to avoid scope conflicts

### Fixed

- Variable scope issues in diagnostic panel JavaScript
- Hugo template parameter access for keys with underscores
- Configuration detection now properly reads hb.ags_markmap settings
- AGS Markmap state checking now uses getState().isInitialized

### Improved

- Developer experience with self-service troubleshooting capabilities
- Debugging time reduced from hours to minutes
- Clear visibility into module state and dependencies
- Eliminates guesswork with targeted recommendations

## [0.2.0] - 2025-07-06

### Added

- Modular TypeScript architecture following MVC pattern
- Type definitions for all core interfaces (MarkMapConfig, MarkMapOptions, etc.)
- Model-View-Controller separation with dedicated classes
- Configuration validation and error handling
- Component-based architecture similar to MCQ module pattern
- Comprehensive architecture documentation with UML diagrams

### Changed

- **BREAKING**: Refactored from inline JavaScript to modular TypeScript
- Module now follows established project patterns and conventions
- Improved code organization with dedicated directories for types, models, views, controllers
- Enhanced maintainability and testability
- Hugo partial updated to use asset pipeline for TypeScript compilation
- Better separation of concerns and modularity

### Improved

- Code quality and maintainability significantly enhanced
- Better error handling and debugging capabilities
- Cleaner codebase following TypeScript best practices
- Documentation includes detailed component diagrams and architecture overview

## [0.1.2] - 2025-07-06

### Changed

- Removed emoji symbol from markmap info box for cleaner UI appearance
- Info box now shows clean text: "Interactive mindmap - zoom & pan enabled"

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

[Unreleased]: https://github.com/agsayyed/ags-markmap/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/agsayyed/ags-markmap/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/agsayyed/ags-markmap/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/agsayyed/ags-markmap/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/agsayyed/ags-markmap/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/agsayyed/ags-markmap/releases/tag/v0.1.0
