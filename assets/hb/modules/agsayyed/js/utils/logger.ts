import { Logger as ILogger } from '../types/markmap.types';

export class Logger implements ILogger {
  private environment: string;
  private level: 'debug' | 'warn';

  constructor(environment: string) {
    this.environment = environment;
    this.level = 'debug';
  }

  debug(message: string) {
    if (this.environment === 'development' && this.level === 'debug') {
      console.debug(`[ags-markmap] ${message}`);
    }
  }

  warn(message: string) {
    if (this.environment !== 'production') {
      console.warn(`[ags-markmap] ${message}`);
    }
  }

  error(message: string, error?: unknown) {
    // Always show errors, even in production
    console.error(`[ags-markmap] ${message}`, error);
  }

  separator(message: string) {
    if (this.environment === 'development') {
      console.log(`--- ags-markmap: ${message} ---`);
    }
  }

  setLevel(level: 'debug' | 'warn') {
    this.level = level;
  }
}

// Get environment from Hugo or default to production
const environment: string = (window as any).HUGO_ENVIRONMENT || 'production';
if (environment === 'unknown') {
  console.info(
    '[ags-markmap] Environment is unknown, defaulting to production'
  );
} else if (environment === 'development') {
  console.debug(
    `[ags-markmap] Creating logger instance with environment: ${environment}`
  );
}

const log = new Logger(environment);
export default log;
