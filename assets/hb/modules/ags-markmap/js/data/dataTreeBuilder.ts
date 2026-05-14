/**
 * Converts YAML data (via Hugo jsonify) to a MarkmapNode tree.
 * The YAML structure is a recursive tree with { title, url?, children? }.
 */

import { MarkmapNode } from '../types/markmap.types';
import log from '../utils/logger';

interface YamlNode {
  title: string;
  url?: string;
  initialExpandLevel?: number;
  children?: YamlNode[];
}

export function buildTreeFromYaml(data: YamlNode): MarkmapNode {
  log.debug('Building tree from YAML data');

  const convert = (node: YamlNode, level: number, index: { value: number }): MarkmapNode => {
    const markmapNode: MarkmapNode = {
      content: node.title,
      children: [],
      payload: {
        level,
        index: index.value++,
        nodeType: 'heading',
        href: node.url || undefined
      }
    };

    if (node.children && node.children.length > 0) {
      markmapNode.children = node.children.map((child) =>
        convert(child, level + 1, index)
      );
    }

    return markmapNode;
  };

  const idx = { value: 0 };
  const rootNode = convert(data, 0, idx);
  log.debug(`YAML tree built with ${countNodes(rootNode)} nodes`);
  return rootNode;
}

function countNodes(node: MarkmapNode): number {
  let count = 1;
  if (node.children) {
    count += node.children.reduce((sum, child) => sum + countNodes(child), 0);
  }
  return count;
}
