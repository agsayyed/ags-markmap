import { DependencyStatus } from '../types/markmap.types';
import { Configuration } from '../config/configuration';
import log from '../utils/logger';

export class DependencyLoader {
  private config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
  }

  public async loadDependencies(): Promise<boolean> {
    log.separator('Starting dependency loading');

    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkInterval = setInterval(() => {
        attempts++;
        log.debug(`Loading attempt ${attempts}/${this.config.maxAttempts}`);

        const status = this.checkDependencyStatus();
        this.logDependencyStatus(status);

        if (status.allLoaded) {
          clearInterval(checkInterval);
          log.debug('All dependencies loaded successfully!');
          resolve(true);
        } else if (attempts >= this.config.maxAttempts) {
          clearInterval(checkInterval);
          const errorMsg = `Dependencies not loaded after ${this.config.maxAttempts} attempts. D3: ${status.d3}, Markmap: ${status.markmap}`;
          log.error(errorMsg);
          reject(new Error(errorMsg));
        }
      }, this.config.checkInterval);
    });
  }

  private checkDependencyStatus(): DependencyStatus {
    const hasD3 = typeof (window as any).d3 !== 'undefined';
    const hasMarkmap =
      typeof (window as any).markmap !== 'undefined' &&
      (window as any).markmap.Markmap;
    const hasGlobalMarkmap = typeof (window as any).Markmap !== 'undefined';
    const hasMarkmapView = typeof (window as any).markmapView !== 'undefined';

    const markmapLoaded = hasMarkmap || hasGlobalMarkmap || hasMarkmapView;

    return {
      d3: hasD3,
      markmap: markmapLoaded,
      allLoaded: hasD3 && markmapLoaded,
    };
  }

  private logDependencyStatus(status: DependencyStatus): void {
    log.debug(`Load status: D3=${status.d3}, Markmap=${status.markmap}`);
    log.debug(`window.markmap: ${typeof (window as any).markmap}`);
    log.debug(`window.markmapView: ${typeof (window as any).markmapView}`);

    const globals = Object.keys(window).filter((k) =>
      k.toLowerCase().includes('mark')
    );
    if (globals.length > 0) {
      log.debug(`Available markmap globals: ${globals.join(', ')}`);
    }
  }

  public getMarkmapAPI(): any {
    const markmap =
      (window as any).markmap?.Markmap ||
      (window as any).Markmap ||
      (window as any).markmapView?.Markmap;

    if (!markmap) {
      throw new Error('Markmap API not available');
    }

    log.debug('Markmap API found and ready');
    return markmap;
  }
}
