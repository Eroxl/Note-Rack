import InlineTextStyles from "../constants/InlineTextStyles";
import type { EditableText } from "../types/blockTypes";

/**
 * Walk up the tree to get the full text style of the node
 * @param node The node to get the full text style of
 * @param topNode The top node to stop at
 * @returns The full text style of the node
 */
const getFullTextStyle = (node: Node, topNode: HTMLElement) => {
  let currentNode = node;
  let style: string[] = [];

  while (currentNode.parentElement && currentNode.parentElement !== topNode) {
    currentNode = currentNode.parentElement;

    const type = (currentNode as HTMLElement).getAttribute('data-inline-type');

    if (!type) continue;

    style.push(...JSON.parse(type));
  }

  return style as (keyof typeof InlineTextStyles)[];
};

/**
 * Get the representation of the block to save
 * @param element The element to save
 * @param completionText The completion text to remove
 * @returns The value and style of the block
 */
const saveBlock = (
  element: HTMLDivElement,
  completionText: string | null = null,
) => {
  const style: EditableText['properties']['style'] = [];

  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let length = 0;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (!node.textContent) continue;

    length += node.textContent.length;

    const type = getFullTextStyle(node, element);

    if (!type.length) continue;

    style.push({
      type,
      start: length - node.textContent.length,
      end: length,
    });
  }

  // ~ Remove the completion text from the end of the block
  const completionOffset =  completionText?.length || 0;
  const elementValue = element.innerText.substring(0, element.innerText.length - completionOffset);

  return {
    value: elementValue,
    style,
  };
};

export default saveBlock;
