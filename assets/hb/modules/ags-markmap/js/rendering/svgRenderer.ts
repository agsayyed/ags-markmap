import { MarkmapNode } from '../types/markmap.types';
import { Configuration } from '../config/configuration';
import log from '../utils/logger';
import { DependencyLoader } from './dependencyLoader';

export class SVGRenderer {
  private config: Configuration;
  private dependencyLoader: DependencyLoader;
  private markmapInstance: any;

  constructor(config: Configuration) {
    this.config = config;
    this.dependencyLoader = new DependencyLoader(config);
  }

  public async render(tree: MarkmapNode): Promise<void> {
    try {
      await this.dependencyLoader.loadDependencies();
      const container = this.config.getContainer();

      if (!container) {
        throw new Error(`Container with ID '${this.config.containerId}' not found`);
      }

      this.showLoadingState(container);
      const markmapAPI = this.dependencyLoader.getMarkmapAPI();

      // Create SVG element
      const svg = this.createSVGElement(container);

      // Create and render markmap
      this.markmapInstance = markmapAPI.create(svg, this.config.options, tree);

      // Fit the view
      this.markmapInstance.fit();

      // Post-render: use D3 to attach click handlers to nodes with URLs.
      // markmap-view v0.15.8 has no onClick option, so we traverse the
      // d3 data-bound SVG elements directly via markmapInstance.g.
      this.attachUrlClickHandlers(tree);

      log.debug('Markmap rendered successfully');
      this.showSuccessState(container);
    } catch (error) {
      log.error('Failed to render markmap', error);
      this.showErrorState(error as Error);
    }
  }

  private createSVGElement(container: HTMLElement): SVGElement {
    // Clear container
    container.innerHTML = '';

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'ags-markmap-svg';
    svg.style.width = '100%';
    svg.style.height = String(this.config.options.height || '400px');
    // Border styling moved to CSS for theme-awareness

    container.appendChild(svg);
    return svg;
  }

  private showLoadingState(container: HTMLElement): void {
    container.innerHTML = `
      <div class="ags-markmap-loading">
        🔄 Initializing markmap...
      </div>
    `;
  }

  private showSuccessState(_container: HTMLElement): void {
    // SVG is already in the container, just log success
    log.debug('Markmap initialization complete');
  }

  private showErrorState(error: Error): void {
    const container = this.config.getContainer();
    if (container) {
      container.innerHTML = `
        <div class="ags-markmap-error">
          <strong>⚠️ Warning:</strong> ${error.message}<br>
          <small>Check network connectivity and CDN availability</small>
        </div>
      `;
    }
  }

  public destroy(): void {
    if (this.markmapInstance && this.markmapInstance.destroy) {
      this.markmapInstance.destroy();
      this.markmapInstance = null;
      log.debug('Markmap instance destroyed');
    }
  }

  /**
   * Attach click handlers to markmap nodes that have URLs.
   * Uses two strategies:
   * 1. immediate: find visible foreignObject elements, match text to tree data
   * 2. delegated: single click listener on SVG catches clicks on any node,
   *    including those created later when user expands a collapsed node.
   */
  private attachUrlClickHandlers(tree: MarkmapNode): void {
    const container = this.config.getContainer();
    const svg = container?.querySelector('svg');
    if (!svg) return;

    // Build text→URL map from the tree data (all nodes, even collapsed)
    const urlMap = new Map<string, string>();
    const walk = (node: MarkmapNode) => {
      if (node.payload?.href) {
        urlMap.set(node.content.trim(), node.payload.href);
      }
      node.children?.forEach(walk);
    };
    walk(tree);

    if (urlMap.size === 0) return;

    // Strategy 1: attach to currently visible foreignObject elements
    const attachToVisible = () => {
      svg.querySelectorAll('foreignObject').forEach((fo) => {
        if ((fo as any).__agsUrlBound) return;
        const text = (fo.textContent || '').trim();
        const url = urlMap.get(text);
        if (url) {
          (fo as any).__agsUrlBound = true;
          const g = fo.closest('g');
          if (g) {
            g.setAttribute('data-url', url);
            g.style.cursor = 'pointer';
          }
          (fo as HTMLElement).style.cursor = 'pointer';
          fo.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = url;
          });
        }
      });
    };

    // Strategy 2: delegated listener on SVG for nodes created later
    svg.addEventListener('click', (e) => {
      const target = e.target as Element;
      const fo = target.closest('foreignObject');
      if (fo) {
        const text = (fo.textContent || '').trim();
        const url = urlMap.get(text);
        if (url) {
          e.stopPropagation();
          window.location.href = url;
        }
      }
    });

    // Attach to currently visible nodes
    attachToVisible();

    // Also observe for new nodes being added (when user expands collapsed branches)
    const observer = new MutationObserver(() => attachToVisible());
    observer.observe(svg, { childList: true, subtree: true });

    log.debug(`URL click handlers ready for ${urlMap.size} nodes`);
    (window as any).__agsMarkmapUrlNodeCount = urlMap.size;
  }
}
