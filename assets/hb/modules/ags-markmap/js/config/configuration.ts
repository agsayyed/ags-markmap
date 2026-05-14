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
    this.maxAttempts = 20; // 10 seconds total
    this.checkInterval = 500; // 500ms between checks

    // Default markmap options
    const defaultOptions: MarkmapOptions = {
      maxDepth: 4,
      colorFreezeLevel: 6,
      duration: 750,
      initialExpandLevel: 2,
      pan: true,
      zoom: true,
      includeListItems: false
    };

    // Merge with custom options from Hugo front matter.
    // Hugo's jsonify lowercases all keys, so normalize camelCase keys.
    const hugoOptions = this.normalizeKeys(window.agsMarkmapOptions || {});
    this.options = { ...defaultOptions, ...hugoOptions, ...customOptions };

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
      includelistitems: 'includeListItems'
    };
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(opts)) {
      result[keyMap[key] || key] = value;
    }
    return result;
  }
}
