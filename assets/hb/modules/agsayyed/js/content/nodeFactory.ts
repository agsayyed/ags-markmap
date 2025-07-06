import { MarkmapNode, HeadingElement } from '../types/markmap.types';
import log from '../utils/logger';

export class NodeFactory {
  public createHeadingNode(
    heading: HeadingElement,
    index: number
  ): MarkmapNode {
    return {
      content: heading.text,
      children: [],
      payload: {
        level: heading.level,
        index: index,
      },
    };
  }

  public createRootNode(title: string): MarkmapNode {
    return {
      content: title,
      children: [],
      payload: {
        level: 0,
        index: -1,
      },
    };
  }

  public createEmptyNode(message: string = 'No content found'): MarkmapNode {
    return {
      content: message,
      children: [],
      payload: {
        level: 1,
        index: 0,
      },
    };
  }
}

// Factory methods for future node types (extensibility)
export class TableNodeFactory extends NodeFactory {
  // Future implementation for table nodes
  public createTableNode(tableData: any): MarkmapNode {
    log.debug('Table node creation not yet implemented');
    return this.createEmptyNode('Table node (coming soon)');
  }
}

export class LinkNodeFactory extends NodeFactory {
  // Future implementation for link nodes
  public createLinkNode(linkData: any): MarkmapNode {
    log.debug('Link node creation not yet implemented');
    return this.createEmptyNode('Link node (coming soon)');
  }
}
