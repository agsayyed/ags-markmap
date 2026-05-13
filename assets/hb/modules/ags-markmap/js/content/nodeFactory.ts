import { MarkmapNode, HeadingElement, TableData, LinkData, ContentElement } from '../types/markmap.types';
import log from '../utils/logger';

export class NodeFactory {
  public createHeadingNode(heading: HeadingElement, index: number): MarkmapNode {
    return {
      content: heading.text,
      children: [],
      payload: {
        level: heading.level,
        index: index,
        nodeType: 'heading'
      }
    };
  }

  public createContentNode(element: ContentElement, index: number): MarkmapNode {
    if (element.type === 'list-item') {
      return this.createListItemNode(element, index);
    }
    return {
      content: element.text,
      children: [],
      payload: {
        level: element.level,
        index: index,
        nodeType: 'heading'
      }
    };
  }

  public createListItemNode(element: ContentElement, index: number): MarkmapNode {
    return {
      content: element.text,
      children: [],
      payload: {
        level: element.level + 1,
        index: index,
        nodeType: 'list-item',
        href: element.href
      }
    };
  }

  public createRootNode(title: string): MarkmapNode {
    return {
      content: title,
      children: [],
      payload: {
        level: 0,
        index: -1,
        nodeType: 'heading'
      }
    };
  }

  public createEmptyNode(message: string = 'No content found'): MarkmapNode {
    return {
      content: message,
      children: [],
      payload: {
        level: 1,
        index: 0,
        nodeType: 'heading'
      }
    };
  }
}

export class TableNodeFactory extends NodeFactory {
  public createTableNode(_tableData: TableData): MarkmapNode {
    log.debug('Table node creation not yet implemented');
    return this.createEmptyNode('Table node (coming soon)');
  }
}

export class LinkNodeFactory extends NodeFactory {
  public createLinkNode(_linkData: LinkData): MarkmapNode {
    log.debug('Link node creation not yet implemented');
    return this.createEmptyNode('Link node (coming soon)');
  }
}
