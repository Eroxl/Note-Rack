/**
 * A class to walk through the text nodes of an element in reverse
 */
export class ReverseTextTreeWalker {
  public currentNode: Node | null;
  private rootNode: Node;

  /**
   * Create a new `ReverseTextTreeWalker`
   * @param node The node to start the walk from
   */
  constructor(node: Node) {
    this.currentNode = node.lastChild;
    this.rootNode = node;
  }

  /**
   * Get the next text node in the tree
   * @returns The next text node in the tree or undefined if there are no more nodes
   */
  public nextNode() {
    while (true) {
      if (
        !this.currentNode
        || !this.currentNode.parentNode
        || this.currentNode === this.rootNode
      ) return undefined;
      
      if (this.currentNode.nodeType === Node.TEXT_NODE) {
        return this.currentNode;
      } else if (this.currentNode.childNodes.length > 0) {
        this.currentNode = this.currentNode.lastChild;
      } else if (this.currentNode === this.currentNode.parentNode.firstChild) {
        this.currentNode = this.currentNode.parentNode;
      } else {
        this.currentNode = this.currentNode.previousSibling;
      }
    }
  }
}

/**
 * Get the length of the last line of a contenteditable element
 * @param element The element to get the length of the last line from
 * @returns The length of the last line of the element
 */
const getLastLineLength = (element: HTMLElement) => {
  const walker = new ReverseTextTreeWalker(element);

  let length = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (!node) break;

    if (!node.textContent) continue;

    const range = document.createRange();

    range.selectNodeContents(node);

    // ~ If the node only spans one line, add its length to the total length
    if (range.getClientRects().length > 1) {
      length += node.textContent.length || 0;

      continue;
    }

    // ~ If the node spans multiple lines, find the length of the last line
    for (let i = node.textContent.length; i >= 0; i -= 1) {
      range.setEnd(node, i);

      if (range.getClientRects().length === 0) continue;

      length += i;
      break;
    }

    break;
  }

  return length;
}

export default getLastLineLength;
