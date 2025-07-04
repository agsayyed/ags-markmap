# ags-markmap

This module allows users to automatically render an interactive Markmap mind map at the top of any markdown page. It is activated when the frontmatter contains the field `ags_markmap: true`.

## Features

- **Automatic Mind Maps**: Generates an interactive mind map from your page's headings
- **Interactive Navigation**: Click on nodes to scroll to the corresponding section
- **Customizable**: Configure via Hugo parameters
- **Lightweight**: Uses CDN-loaded dependencies to minimize bundle size
- **Multiple Placement Options**: Use at the top of content or place manually with a shortcode

## Installation

### Prerequisites

- [Hugo](https://gohugo.io/) >= 0.110.0
- [Go](https://golang.org/) >= 1.18.0
- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 8.0.0

### Import the Module

1. Initialize Hugo Module (if not already done):

```bash
hugo mod init github.com/user/project
```

2. Import the module:

```bash
hugo mod get github.com/agsayyed/ags-markmap
```

3. Add the module to your site's configuration:

```yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
```

## Usage

### Automatic Placement

To enable Markmap on a page, add this to your frontmatter:

```yaml
---
title: "My Page with Markmap"
date: 2025-07-04
ags_markmap: true
---
```

This will automatically render a Markmap at the top of your content, below the featured image.

### Manual Placement with Shortcode

You can also place a Markmap anywhere in your content using the shortcode:

```markdown
{{< agsmarkmap >}}
```

## Configuration

You can configure the module in your site's `config.yaml` or equivalent:

```yaml
params:
  hb:
    ags_markmap:
      enable: true  # Enable or disable globally
      placement: top  # Default placement (top or shortcode)
      height: 400px  # Height of the Markmap
      autoFit: true  # Automatically fit the map to the container
      duration: 400  # Animation duration in milliseconds
```

## How It Works

The module:

1. Checks if the current page has `ags_markmap: true` in frontmatter
2. Uses HugoPress hooks to inject a container at the top of the content
3. Loads Markmap.js dependencies
4. Extracts headings from your page content
5. Renders an interactive SVG mind map
6. Adds click handlers to navigate to the corresponding sections

## Customization

### Styling

You can customize the appearance by overriding the SCSS variables:

```scss
$ags-markmap-height: 500px;
$ags-markmap-border-color: #ddd;
$ags-markmap-border-radius: 8px;
$ags-markmap-margin-bottom: 3rem;
$ags-markmap-mobile-height: 350px;
```

## License

[MIT](LICENSE)

2. Import the module:

```bash
hugo mod get github.com/agsayyed/ags-markmap
```

3. Add the module to your site's configuration:

```yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
```

## Usage

### Basic Usage

```markdown
{{< agsmarkmap >}}
```

## Configuration

Configuration options can be set in your site's configuration file:

```yaml
params:
  ags-markmap:
    # Configuration options here
```

## License

[MIT](LICENSE)
