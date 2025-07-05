# ags-markmap

A Hugo module that automatically renders an interactive Markmap mind map from your page's headings. It integrates seamlessly with Hugo and HBStack framework.

## Features

- **Automatic Mind Maps**: Generates an interactive mind map from your page's headings
- **Front Matter Activation**: Simply add `ags_markmap: true` to any page
- **Interactive Navigation**: Click on nodes to scroll to the corresponding section
- **HBStack Compatible**: Integrates perfectly with HugoPress hooks
- **CDN-Based**: Zero build dependencies - uses CDN-loaded libraries
- **Responsive**: Works on desktop and mobile devices

## Installation

### Prerequisites

- [Hugo](https://gohugo.io/) >= 0.110.0
- [Go](https://golang.org/) >= 1.18.0

### Import the Module

1. Initialize Hugo Module (if not already done):

```bash
hugo mod init github.com/user/project
```

1. Import the module:

```bash
hugo mod get github.com/agsayyed/ags-markmap
```

1. Add the module to your site's configuration:

```yaml
module:
  imports:
    - path: github.com/agsayyed/ags-markmap
```

## Usage

To enable Markmap on any page, add this to your front matter:

```yaml
---
title: "My Page with Markmap"
date: 2025-07-04
ags_markmap: true
---
```

The mind map will automatically render at the top of your content, extracting headings from your page and creating an interactive visualization.

## Configuration

Configure the module in your site's `config.yaml`:

```yaml
params:
  hb:
    ags_markmap:
      enable: true        # Enable or disable globally
      placement: top      # Placement location
      height: 400px       # Height of the mind map
      autoFit: true       # Auto-fit to container
      duration: 400       # Animation duration (ms)
```

## How It Works

The module:

1. Detects pages with `ags_markmap: true` in front matter
2. Uses HugoPress hooks to inject the mind map container
3. Loads Markmap.js and D3.js from CDN
4. Extracts headings (H1-H6) from your page content
5. Renders an interactive SVG mind map
6. Adds click handlers for navigation to sections

## Customization

### Styling

Customize the appearance by overriding SCSS variables:

```scss
$ags-markmap-height: 500px;
$ags-markmap-border-color: #ddd;
$ags-markmap-border-radius: 8px;
$ags-markmap-margin-bottom: 3rem;
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with SVG support

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
