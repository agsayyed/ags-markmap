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
}
