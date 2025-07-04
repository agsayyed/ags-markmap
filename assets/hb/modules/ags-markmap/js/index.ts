/**
 * Markmap HBStack module
 * Renders an interactive mind map from page headings
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Only execute if ags_markmap is enabled for this page
  if (document.body.dataset.agsMarkmap !== 'true') {
    return
  }

  const markmapContainer = document.getElementById('ags-markmap-container')
  if (!markmapContainer) {
    console.warn('Markmap container not found')
    return
  }

  // Create the SVG element for markmap
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('id', 'ags-markmap-svg')
  svg.setAttribute(
    'style',
    'width: 100%; height: 400px; border: 1px solid #eee; border-radius: 5px;'
  )
  markmapContainer.appendChild(svg)

  // Load scripts dynamically
  loadScript('https://cdn.jsdelivr.net/npm/d3@6')
    .then(() => {
      return loadScript('https://cdn.jsdelivr.net/npm/markmap-view')
    })
    .then(() => {
      // Now that the scripts are loaded, initialize the markmap
      initializeMarkmap()
    })
    .catch((error) => {
      console.error('Error loading Markmap dependencies:', error)
    })

  // Function to load script dynamically
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Function to initialize the markmap
  function initializeMarkmap() {
    const { Markmap } = window.markmap

    // Extract headings from the page content
    const headings = extractHeadings()
    const markmapData = convertHeadingsToMarkmapData(headings)

    // Create the markmap
    const mm = Markmap.create(
      '#ags-markmap-svg',
      {
        autoFit: true,
        duration: 400
      },
      markmapData
    )

    // Add click handlers to navigate to the corresponding section
    addClickHandlers(mm)
  }

  // Extract headings from the page
  function extractHeadings() {
    const headings = []
    const content = document.querySelector('.content')

    if (!content) {
      return headings
    }

    // Get all headings
    const headingElements = content.querySelectorAll('h1, h2, h3, h4, h5, h6')

    headingElements.forEach((heading) => {
      const level = parseInt(heading.tagName.substr(1))
      const text = heading.textContent
      const id = heading.id

      headings.push({
        level,
        text,
        id
      })
    })

    return headings
  }

  // Convert headings to markmap data format
  function convertHeadingsToMarkmapData(headings) {
    if (headings.length === 0) {
      return { t: 'No headings found' }
    }

    // Create root node
    const root = {
      t: document.title,
      c: []
    }

    let currentLevel = 0
    let currentNode = root
    let parentStack = [root]

    headings.forEach((heading) => {
      const node = {
        t: heading.text,
        p: { id: heading.id }
      }

      if (heading.level > currentLevel) {
        // Going deeper
        if (!currentNode.c) {
          currentNode.c = []
        }
        currentNode.c.push(node)
        parentStack.push(currentNode)
        currentNode = node
      } else if (heading.level === currentLevel) {
        // Same level
        parentStack[parentStack.length - 1].c.push(node)
        currentNode = node
      } else {
        // Going back up
        const diff = currentLevel - heading.level
        parentStack = parentStack.slice(0, parentStack.length - diff)
        parentStack[parentStack.length - 1].c.push(node)
        currentNode = node
      }

      currentLevel = heading.level
    })

    return root
  }

  // Add click handlers to navigate to the corresponding section
  function addClickHandlers(mm) {
    mm.state.api.setOptions({
      nodeClick: (_, node) => {
        if (node.p && node.p.id) {
          // Find the element and scroll to it
          const el = document.getElementById(node.p.id)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }
        return false // Prevent default behavior
      }
    })
  }
})
