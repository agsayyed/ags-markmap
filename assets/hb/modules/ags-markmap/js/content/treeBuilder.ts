import { MarkmapNode, HeadingElement, ContentElement } from '../types/markmap.types';
import log from '../utils/logger';
import { NodeFactory } from './nodeFactory';
import { ContentParser } from './contentParser';

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

    const filteredHeadings = this.filterDuplicateTitle(headings, cleanTitle);

    if (filteredHeadings.length === 0) {
      log.warn('All headings filtered out, creating simple tree');
      return rootNode;
    }

    this.buildHierarchy(rootNode, filteredHeadings);

    log.debug(`Built tree with ${this.countNodes(rootNode)} total nodes`);
    return rootNode;
  }

  public buildTreeFromElements(elements: ContentElement[]): MarkmapNode {
    if (elements.length === 0) {
      log.warn('No content elements found, creating empty tree');
      return this.nodeFactory.createEmptyNode('No content found');
    }

    const cleanTitle = this.contentParser.getPageTitle();
    const rootNode = this.nodeFactory.createRootNode(cleanTitle);

    // Filter first heading if it duplicates the page title
    const filtered = this.filterDuplicateElementTitle(elements, cleanTitle);

    if (filtered.length === 0) {
      return rootNode;
    }

    this.buildMixedHierarchy(rootNode, filtered);

    log.debug(`Built tree with ${this.countNodes(rootNode)} total nodes (headings + list items)`);
    return rootNode;
  }

  private buildMixedHierarchy(rootNode: MarkmapNode, elements: ContentElement[]): void {
    // Stack tracks heading nodes only — list items are always leaves
    const stack: { node: MarkmapNode; level: number }[] = [{ node: rootNode, level: 0 }];
    let elementIndex = 0;

    elements.forEach((el) => {
      const newNode = this.nodeFactory.createContentNode(el, elementIndex++);

      if (el.type === 'heading') {
        // Pop stack until we find the correct parent level
        while (stack.length > 1 && stack[stack.length - 1].level >= el.level) {
          stack.pop();
        }
        const parent = stack[stack.length - 1];
        parent.node.children = parent.node.children || [];
        parent.node.children.push(newNode);
        // Push heading onto stack so its children can be attached
        stack.push({ node: newNode, level: el.level });
      } else {
        // List items attach to the most recent heading (top of stack)
        const parent = stack[stack.length - 1];
        parent.node.children = parent.node.children || [];
        parent.node.children.push(newNode);
        // List items are leaves — NOT pushed onto the stack
      }
    });
  }

  private filterDuplicateTitle(headings: HeadingElement[], title: string): HeadingElement[] {
    return headings.filter((heading, index) => {
      if (index === 0 && heading.text.toLowerCase().trim() === title.toLowerCase().trim()) {
        log.debug('Skipping first heading as it matches page title');
        return false;
      }
      return true;
    });
  }

  private filterDuplicateElementTitle(elements: ContentElement[], title: string): ContentElement[] {
    return elements.filter((el, index) => {
      if (index === 0 && el.type === 'heading' && el.text.toLowerCase().trim() === title.toLowerCase().trim()) {
        log.debug('Skipping first heading as it matches page title');
        return false;
      }
      return true;
    });
  }

  private buildHierarchy(rootNode: MarkmapNode, headings: HeadingElement[]): void {
    const stack: { node: MarkmapNode; level: number }[] = [{ node: rootNode, level: 0 }];

    headings.forEach((heading, index) => {
      const newNode = this.nodeFactory.createHeadingNode(heading, index);

      while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      const parentEntry = stack[stack.length - 1];
      parentEntry.node.children = parentEntry.node.children || [];
      parentEntry.node.children.push(newNode);

      stack.push({ node: newNode, level: heading.level });
    });
  }

  private countNodes(node: MarkmapNode): number {
    let count = 1;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + this.countNodes(child), 0);
    }
    return count;
  }
}
