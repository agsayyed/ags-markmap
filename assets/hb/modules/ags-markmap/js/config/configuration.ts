import { Configuration as IConfiguration, MarkmapOptions } from '../types/markmap.types';
import log from '../utils/logger';

export class Configuration implements IConfiguration {
  public isDevelopment: boolean;
  public options: MarkmapOptions;
  public containerId: string;
  public maxAttempts: number;
  public checkInterval: number;

  constructor(customOptions?: MarkmapOptions) {
    // Detect environment
    this.isDevelopment = window.HUGO_ENVIRONMENT === 'development';

    // Set container ID
    this.containerId = 'ags-markmap-container';

    // Set dependency loading parameters
    const hugoOpts = this.normalizeKeys(window.agsMarkmapOptions || {});
    const loadTimeout = hugoOpts.loadTimeout || customOptions?.loadTimeout;

    if (typeof loadTimeout === 'number' && loadTimeout > 0) {
      // User-configured timeout: calculate attempts from interval
      this.checkInterval = 500;
      this.maxAttempts = Math.ceil(loadTimeout / this.checkInterval);
    } else {
      // Default: 40 attempts = 20 seconds (handles first-load CDN latency)
      this.checkInterval = 500;
      this.maxAttempts = 40;
    }

    // Default markmap options
    const defaultOptions: MarkmapOptions = {
      maxDepth: 4,
      colorFreezeLevel: 6,
      duration: 750,
      initialExpandLevel: 2,
      pan: true,
      zoom: true,
      includeListItems: false,
      height: '400px'
    };

    // Merge with custom options from Hugo front matter.
    // Hugo's jsonify lowercases all keys, so normalize camelCase keys.
    // (hugoOpts already normalized above for loadTimeout — reuse it)
    const merged = { ...defaultOptions, ...hugoOpts, ...customOptions };

    // containerId can be overridden via options (used by shortcode path)
    if (merged.containerId) {
      this.containerId = merged.containerId;
    }

    this.options = merged;

    log.debug('Configuration initialized');
    log.debug(`Environment: ${this.isDevelopment ? 'development' : 'production'}`);
    log.debug(`Options: ${JSON.stringify(this.options)}`);
  }

  public updateOptions(newOptions: Partial<MarkmapOptions>): void {
    this.options = { ...this.options, ...newOptions };
    log.debug(`Options updated: ${JSON.stringify(this.options)}`);
  }

  public getContainer(): HTMLElement | null {
    return document.getElementById(this.containerId);
  }

  /**
   * Hugo's jsonify template function lowercases all YAML keys.
   * Map them back to the camelCase keys our TypeScript code expects.
   */
  private normalizeKeys(opts: Record<string, any>): Record<string, any> {
    const keyMap: Record<string, string> = {
      initialexpandlevel: 'initialExpandLevel',
      maxdepth: 'maxDepth',
      colorfreezelevel: 'colorFreezeLevel',
      includelistitems: 'includeListItems',
      containerid: 'containerId',
      height: 'height',
      loadtimeout: 'loadTimeout'
    };
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(opts)) {
      result[keyMap[key] || key] = value;
    }
    return result;
  }
}
