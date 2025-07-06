# AGS Markmap Module - Development Kanban

## Product Backlog

- Epic: AGS Markmap Interactive Mindmap Module for Hugo/HBStack

  - due: 2025-08-15
  - tags: [typescript, hugo, mindmap, interactive, module]
  - priority: critical
  - workload: Hard
  - defaultExpanded: true

    ```md
    Develop a comprehensive TypeScript module for Hugo/HBStack sites that generates
    interactive mindmaps from page content, enabling easy navigation and content understanding.

    Core Features:
    - Dynamic heading extraction and tree building
    - Interactive SVG mindmap rendering
    - Multi-level content depth support (up to 4 levels)
    - Markdown table integration
    - External linking capabilities
    - Modular, extensible architecture
    - Environment-aware logging and error handling
    ```

- Story: Implement External Link Navigation Support

  - due: 2025-07-25
  - tags: [linking, navigation, external, feature]
  - priority: high
  - workload: Normal

    ```md
    Add support for external links in mindmap nodes to enable navigation to other pages/sites.

    Acceptance Criteria:
    - Parse and detect external links in content
    - Render clickable nodes with external link indicators
    - Open external links in new tab/window
    - Visual distinction for external vs internal nodes
    - URL validation and error handling
    ```

- Story: Add Markdown Table Support

  - due: 2025-07-30
  - tags: [tables, markdown, parsing, feature]
  - priority: medium
  - workload: Hard

    ```md
    Extend content parsing to include markdown tables as mindmap nodes.

    Acceptance Criteria:
    - Detect and parse markdown tables in content
    - Convert table structure to mindmap sub-nodes
    - Maintain table data relationships in tree structure
    - Visual indicators for table-based nodes
    - Support for simple and complex table structures
    ```

- Story: Extend Content Depth to 4 Levels

  - due: 2025-08-05
  - tags: [depth, hierarchy, parsing, feature]
  - priority: medium
  - workload: Normal

    ```md
    Increase mindmap depth support from current 2 levels to 4 levels for better content representation.

    Acceptance Criteria:
    - Parse H1-H6 headings with proper hierarchy
    - Build 4-level deep tree structures
    - Maintain visual clarity with increased depth
    - Performance optimization for deep structures
    - Configurable depth limits
    ```

## Sprint Backlog (Sprint 1: Architecture Refactoring)

- Story: Design and Document Module Architecture

  - due: 2025-07-12
  - tags: [architecture, design-patterns, uml, documentation]
  - priority: critical
  - workload: Hard
  - defaultExpanded: true
  - steps:
    - [x] Research design patterns suitable for TypeScript modules
    - [ ] Create UML Component Diagram
    - [ ] Design class hierarchy and interfaces
    - [ ] Document pattern implementation strategy
    - [ ] Review and validate architecture design

    ```md
    Create comprehensive architectural design using modern design patterns and UML documentation.

    Design Patterns to Implement:
    - Module Pattern: Core encapsulation and namespace management
    - Factory Pattern: Node creation for different content types
    - Strategy Pattern: Content parsing strategies (headings, tables, links)
    - Observer Pattern: Event handling for user interactions
    - Adapter Pattern: External library integration (D3, markmap-view)

    Deliverables:
    - UML Component Diagram showing module structure
    - Class Diagram showing pattern relationships
    - Sequence Diagram for initialization flow
    - Architecture documentation with implementation guide
    ```

- Story: Refactor to TypeScript Module Pattern

  - due: 2025-07-15
  - tags: [refactoring, typescript, module-pattern, core]
  - priority: critical
  - workload: Extreme
  - steps:
    - [ ] Set up TypeScript build configuration
    - [ ] Define core interfaces and types
    - [ ] Create modular component structure
    - [ ] Implement dependency injection patterns
    - [ ] Add comprehensive error handling
    - [ ] Update Hugo template integration

    ```md
    Restructure current inline script code into proper TypeScript module with design patterns.

    Technical Requirements:
    - Convert inline script to TypeScript module
    - Implement proper interfaces and types
    - Create modular component structure
    - Establish dependency injection patterns
    - Add comprehensive error handling
    - Maintain backward compatibility with current Hugo integration
    ```

- Story: Implement Factory Pattern for Node Creation

  - due: 2025-07-18
  - tags: [factory-pattern, nodes, typescript, architecture]
  - priority: high
  - workload: Normal
  - steps:
    - [ ] Design BaseNode interface
    - [ ] Create HeadingNodeFactory
    - [ ] Create TableNodeFactory (preparation)
    - [ ] Create LinkNodeFactory (preparation)
    - [ ] Implement NodeFactory orchestrator
    - [ ] Add unit tests for factories

    ```md
    Create factory classes for different types of mindmap nodes to support extensibility.

    Components to Implement:
    - BaseNode interface with common properties
    - HeadingNodeFactory for text content nodes
    - TableNodeFactory for future table support
    - LinkNodeFactory for future link support
    - NodeFactory orchestrator for centralized creation
    - Type safety and validation for all node types
    ```

## In Progress

## Review/QA

- Story: Create UML Component Diagram

  - completed: 2025-07-06
  - tags: [uml, documentation, architecture, completed]
  - priority: high
  - workload: Normal
  - defaultExpanded: true
  - steps:
    - [x] Analyze current module dependencies
    - [x] Identify core components and relationships
    - [x] Create component diagram with Mermaid C4
    - [x] Document component interfaces and responsibilities
    - [x] Validate diagram syntax and preview
    - [ ] Review architecture design with stakeholders

    ```md
    ✅ Successfully created UML Component Diagram showing module architecture and dependencies.

    Completed Deliverables:
    - C4 Component Diagram using Mermaid syntax
    - Comprehensive documentation of 11 core components
    - Design pattern mapping (Module, Factory, Strategy, Observer, Adapter, Builder)
    - Component responsibility definitions
    - External dependency relationships (D3.js, markmap-view, Hugo)
    - Data flow documentation
    - Architecture extension points identified

    Technical Achievements:
    - Visual representation of modular architecture
    - Clear separation of concerns between components
    - External dependency isolation patterns
    - Future extensibility roadmap documented

    Location: /docs/architecture/component-diagram.md
    ```

## Done

- Story: MVP Release v0.1.2 - UI Polish

  - completed: 2025-07-06
  - tags: [mvp, ui, release, completed]
  - priority: high
  - workload: Easy

    ```md
    ✅ Successfully released minimum viable product with clean UI improvements.

    Completed Features:
    - Basic mindmap rendering from page headings
    - CDN-based dependency loading (D3, markmap-view)
    - Environment-aware debug logging (dev only)
    - Hugo/HBStack integration with proper hooks
    - Interactive zoom and pan functionality
    - Removed emoji from info box for cleaner appearance
    - Production-ready error handling and fallbacks

    Release Details:
    - Version: v0.1.2 released on GitHub
    - Semantic versioning implemented
    - CHANGELOG.md updated
    - Production config updated in test site
    ```
