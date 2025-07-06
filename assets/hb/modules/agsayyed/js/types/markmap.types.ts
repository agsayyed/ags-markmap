export interface MarkmapOptions {
  maxDepth?: number;
  colorFreezeLevel?: number;
  duration?: number;
  initialExpandLevel?: number;
  pan?: boolean;
  zoom?: boolean;
  [key: string]: any;
}

export interface MarkmapNode {
  content: string;
  children?: MarkmapNode[];
  payload?: {
    level: number;
    index: number;
  };
}

export interface HeadingElement {
  level: number;
  text: string;
  element: HTMLElement;
}

export interface MarkmapState {
  isInitialized: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  headingCount: number;
  treeDepth: number;
}

export interface Logger {
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, error?: any) => void;
  separator: (message: string) => void;
}

export interface DependencyStatus {
  d3: boolean;
  markmap: boolean;
  allLoaded: boolean;
}

export interface Configuration {
  isDevelopment: boolean;
  options: MarkmapOptions;
  containerId: string;
  maxAttempts: number;
  checkInterval: number;
}
