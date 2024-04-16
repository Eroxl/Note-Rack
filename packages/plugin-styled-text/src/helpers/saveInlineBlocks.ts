import type { Interval } from '@note-rack/editor/lib/helpers/mergeIntervals';

/**
 * Walk up the tree to get the full text style of the node
 * @param node The node to get the full text style of
 * @param topNode The top node to stop at
 * @returns The full text style of the node
 */
const getFullTextMetaData = (node: Node, topNode: HTMLElement) => {
  let currentNode = node;
  const style: string[] = [];
  const properties: (Record<string, unknown> | undefined)[] = [];

  while (currentNode.parentElement && currentNode.parentElement !== topNode) {
    currentNode = currentNode.parentElement;

    const type = (currentNode as HTMLElement).getAttribute('data-type');
    const property = (currentNode as HTMLElement).getAttribute('data-properties')

    if (!type) continue;

    if (!property) properties.push(undefined);
    else properties.push(JSON.parse(property));
  
    style.push(type);
  }

  return {
    style,
    properties
  };
};

const saveInlineBlocks = (
  element: HTMLElement
): (Interval & { type: string[], properties: (Record<string, unknown> | undefined)[] })[] => {
  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  const style: (Interval & { type: string[], properties: (Record<string, unknown> | undefined)[] })[] = [];
  let length = 0;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (!node.textContent) continue;

    length += node.textContent.length;

    const {
      style: type,
      properties
    } = getFullTextMetaData(node, element);

    if (!type.length) continue;

    style.push({
      type,
      properties,
      start: length - node.textContent.length,
      end: length,
    });
  }

  return style;
};

export default saveInlineBlocks;
