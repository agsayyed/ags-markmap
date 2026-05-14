import { MarkmapOptions, MarkmapState, MarkmapNode } from '../types/markmap.types';
import { Configuration } from '../config/configuration';
import { ContentParser } from '../content/contentParser';
import { TreeBuilder } from '../content/treeBuilder';
import { buildTreeFromYaml } from '../data/dataTreeBuilder';
import { SVGRenderer } from '../rendering/svgRenderer';
import log from '../utils/logger';

export class AGSMarkmap {
  private config: Configuration;
  private parser: ContentParser;
  private treeBuilder: TreeBuilder;
  private renderer: SVGRenderer;
  private state: MarkmapState;

  constructor(options?: MarkmapOptions) {
    log.separator('AGS Markmap Initialization');

    this.config = new Configuration(options);
    this.parser = new ContentParser();
    this.treeBuilder = new TreeBuilder();
    this.renderer = new SVGRenderer(this.config);

    this.state = {
      isInitialized: false,
      isLoading: false,
      hasError: false,
      headingCount: 0,
      treeDepth: 0
    };

    log.debug('AGS Markmap instance created');
  }

  public async initialize(): Promise<void> {
    if (this.state.isInitialized) {
      log.warn('AGS Markmap already initialized');
      return;
    }

    try {
      this.state.isLoading = true;
      log.debug('Starting initialization');

      // Check if container exists
      const container = this.config.getContainer();
      if (!container) {
        throw new Error(`Container with ID '${this.config.containerId}' not found`);
      }

      // Apply configured height
      if (this.config.options.height) {
        container.style.height = String(this.config.options.height);
      }

      // Build tree: shortcode data takes priority over DOM auto-detect
      let tree: MarkmapNode;
      const yamlData = (window as any).__agsMarkmapData;

      if (yamlData) {
        log.debug('Building tree from shortcode YAML data');
        tree = buildTreeFromYaml(yamlData);
        // Override initialExpandLevel from YAML if present
        if (yamlData.initialExpandLevel !== undefined) {
          this.config.updateOptions({ initialExpandLevel: yamlData.initialExpandLevel });
        }
        this.state.headingCount = this.countTreeNodes(tree);
      } else if (this.config.options.includeListItems) {
        const elements = this.parser.extractContentElements();
        this.state.headingCount = elements.filter((e) => e.type === 'heading').length;
        const listItemCount = elements.length - this.state.headingCount;
        log.debug(`Found ${elements.length} total elements (${this.state.headingCount} headings, ${listItemCount} list items)`);
        if (elements.length === 0) log.warn('No content elements found on page');
        tree = this.treeBuilder.buildTreeFromElements(elements);
      } else {
        const headings = this.parser.extractHeadings();
        this.state.headingCount = headings.length;
        log.debug(`Found ${this.state.headingCount} headings (list items excluded — set includeListItems: true to enable)`);
        if (headings.length === 0) log.warn('No headings found on page');
        tree = this.treeBuilder.buildTree(headings);
      }
      this.state.treeDepth = this.calculateTreeDepth(tree);

      // Apply initialExpandLevel by pre-folding nodes in the tree.
      // markmap-view's option is unreliable, so we set payload.fold directly.
      const expandLevel = this.config.options.initialExpandLevel;
      if (expandLevel !== undefined && expandLevel >= 0) {
        log.debug(`Pre-folding tree: nodes at level >= ${expandLevel} will be collapsed`);
        this.foldTreeByDepth(tree, expandLevel);
      }

      // Render the mindmap
      await this.renderer.render(tree);

      this.state.isInitialized = true;
      this.state.isLoading = false;
      this.state.hasError = false;

      log.separator('AGS Markmap initialized successfully');
      log.debug(`Processed ${this.state.headingCount} headings, tree depth: ${this.state.treeDepth}`);
    } catch (error) {
      this.state.isLoading = false;
      this.state.hasError = true;
      this.state.errorMessage = (error as Error).message;

      log.error('Failed to initialize AGS Markmap', error);
      throw error;
    }
  }

  public destroy(): void {
    if (this.renderer) {
      this.renderer.destroy();
    }

    this.state.isInitialized = false;
    log.debug('AGS Markmap destroyed');
  }

  public getState(): MarkmapState {
    return { ...this.state };
  }

  public updateOptions(newOptions: Partial<MarkmapOptions>): void {
    this.config.updateOptions(newOptions);
    log.debug('Options updated, re-initialization required');
  }

  private foldTreeByDepth(node: MarkmapNode, threshold: number): void {
    if (node.payload && node.payload.level >= threshold) {
      node.payload = { ...node.payload, fold: 1 };
    }
    if (node.children) {
      node.children.forEach((child) => this.foldTreeByDepth(child, threshold));
    }
  }

  private countTreeNodes(node: MarkmapNode): number {
    let count = 1;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + this.countTreeNodes(child), 0);
    }
    return count;
  }

  private calculateTreeDepth(node: MarkmapNode, currentDepth: number = 0): number {
    if (!node.children || node.children.length === 0) {
      return currentDepth;
    }

    const childDepths = node.children.map((child: MarkmapNode) => this.calculateTreeDepth(child, currentDepth + 1));

    return Math.max(...childDepths);
  }
}

// Export singleton factory function for easy initialization
export function createMarkmap(containerId?: string, options?: MarkmapOptions): AGSMarkmap {
  const opts = { ...options };
  if (containerId) {
    opts.containerId = containerId;
  }
  return new AGSMarkmap(opts);
}
