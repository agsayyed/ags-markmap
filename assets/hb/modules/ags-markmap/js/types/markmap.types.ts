export interface MarkmapOptions {
  maxDepth?: number;
  colorFreezeLevel?: number;
  duration?: number;
  initialExpandLevel?: number;
  pan?: boolean;
  zoom?: boolean;
  includeListItems?: boolean;
  containerId?: string;
  [key: string]: any;
}

export type NodeType = 'heading' | 'list-item';

export interface MarkmapNode {
  content: string;
  children?: MarkmapNode[];
  payload?: {
    level: number;
    index: number;
    nodeType?: NodeType;
    href?: string;
    fold?: number;
  };
}

export interface HeadingElement {
  level: number;
  text: string;
  element: HTMLElement;
}

export interface ContentElement {
  type: NodeType;
  level: number; // headings: 1-6; list-items: inherit parent heading level
  text: string;
  href?: string;
  ordered?: boolean;
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

export interface TableData {
  columns: string[];
  rows: string[][];
}

export interface LinkData {
  href: string;
  text: string;
  title?: string;
}

declare global {
  interface Window {
    HUGO_ENVIRONMENT?: 'development' | 'production' | 'testing';
    agsMarkmapOptions?: MarkmapOptions;
  }
}
