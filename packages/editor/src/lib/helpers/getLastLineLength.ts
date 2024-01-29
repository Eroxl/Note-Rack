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
      ) return null;

      if (
        this.currentNode === this.rootNode
        || !this.rootNode.contains(this.currentNode)
      ) return null;

      if (this.currentNode.childNodes.length !== 0) {
        this.currentNode = this.currentNode.lastChild;

        continue;
      }

      const returnedNode = this.currentNode;

      if (this.currentNode === this.currentNode.parentNode.firstChild) {
        while (
          this.currentNode.parentNode
          && !this.currentNode.parentNode.previousSibling
        ) {
          this.currentNode = this.currentNode.parentNode;
        }

        if (!this.currentNode.parentNode) return null;

        this.currentNode = this.currentNode.parentNode.previousSibling;

        return returnedNode;
      }

      this.currentNode = this.currentNode.previousSibling;

      return returnedNode;
    }
  }
}

/**
 * Get the length of the last line of a contenteditable element
 * @param element The element to get the length of the last line from
 * @returns The length of the last line of the element
 */
const getLastLineLength = (element: HTMLElement) => {
  if (!element.textContent) return 0;

  const walker = new ReverseTextTreeWalker(element);

  let length = 0;

  let node;

  while (true) {
    node = walker.nextNode();

    if (!node) break;

    if (!node.textContent) continue;

    const range = document.createRange();

    range.selectNodeContents(node);

    // ~ If the node only spans one line, add its length to the total length
    if (range.getClientRects().length <= 1) {
      length += node.textContent.length || 0;

      continue;
    }

    range.setEnd(node, node.textContent.length - 1);

    // ~ If the node spans multiple lines, find the length of the last line
    for (let i = node.textContent.length; i >= 0; i -= 1) {
      range.setStart(node, i);

      if (range.getClientRects().length <= 1) continue;

      length += i;

      break;
    }
  }

  if (element.textContent.length === length) return length;

  return element.textContent.length - (length + 1);
}

export default getLastLineLength;
