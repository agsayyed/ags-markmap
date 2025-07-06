import { MarkmapNode, HeadingElement } from '../types/markmap.types';
import { NodeFactory } from './nodeFactory';
import { ContentParser } from './contentParser';
import log from '../utils/logger';

export class TreeBuilder {
  private nodeFactory: NodeFactory;
  private contentParser: ContentParser;

  constructor() {
    this.nodeFactory = new NodeFactory();
    this.contentParser = new ContentParser();
  }

  public buildTree(headings: HeadingElement[]): MarkmapNode {
    if (headings.length === 0) {
      log.warn('No headings found, creating empty tree');
      return this.nodeFactory.createEmptyNode('No headings found');
    }

    const cleanTitle = this.contentParser.getPageTitle();
    const rootNode = this.nodeFactory.createRootNode(cleanTitle);

    // Filter out first heading if it matches page title (avoid duplication)
    const filteredHeadings = this.filterDuplicateTitle(headings, cleanTitle);

    if (filteredHeadings.length === 0) {
      log.warn('All headings filtered out, creating simple tree');
      return rootNode;
    }

    // Build hierarchical structure
    this.buildHierarchy(rootNode, filteredHeadings);

    log.debug(`Built tree with ${this.countNodes(rootNode)} total nodes`);
    return rootNode;
  }

  private filterDuplicateTitle(
    headings: HeadingElement[],
    title: string
  ): HeadingElement[] {
    return headings.filter((heading, index) => {
      if (
        index === 0 &&
        heading.text.toLowerCase().trim() === title.toLowerCase().trim()
      ) {
        log.debug('Skipping first heading as it matches page title');
        return false;
      }
      return true;
    });
  }

  private buildHierarchy(
    rootNode: MarkmapNode,
    headings: HeadingElement[]
  ): void {
    const stack: { node: MarkmapNode; level: number }[] = [
      { node: rootNode, level: 0 },
    ];

    headings.forEach((heading, index) => {
      const newNode = this.nodeFactory.createHeadingNode(heading, index);

      // Find the correct parent level
      while (
        stack.length > 1 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      const parentEntry = stack[stack.length - 1];
      parentEntry.node.children = parentEntry.node.children || [];
      parentEntry.node.children.push(newNode);

      // Add to stack for potential children
      stack.push({ node: newNode, level: heading.level });
    });
  }

  private countNodes(node: MarkmapNode): number {
    let count = 1; // Count current node
    if (node.children) {
      count += node.children.reduce(
        (sum, child) => sum + this.countNodes(child),
        0
      );
    }
    return count;
  }
}
