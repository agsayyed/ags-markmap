import { MarkmapNode, MarkmapOptions } from '../types/markmap.types';
import { Configuration } from '../config/configuration';
import { DependencyLoader } from './dependencyLoader';
import log from '../utils/logger';

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
        throw new Error(
          `Container with ID '${this.config.containerId}' not found`
        );
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
    svg.style.width = '100%';
    svg.style.height = '400px';
    svg.style.border = '1px solid #ddd';
    svg.style.borderRadius = '4px';

    container.appendChild(svg);
    return svg;
  }

  private showLoadingState(container: HTMLElement): void {
    container.innerHTML = `
      <div style="padding: 20px; border: 2px solid #ffc107; background: #fff3cd; color: #856404; border-radius: 4px;">
        🔄 Initializing markmap...
      </div>
    `;
  }

  private showSuccessState(container: HTMLElement): void {
    // SVG is already in the container, just log success
    log.debug('Markmap initialization complete');
  }

  private showErrorState(error: Error): void {
    const container = this.config.getContainer();
    if (container) {
      container.innerHTML = `
        <div style="color: orange; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
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
