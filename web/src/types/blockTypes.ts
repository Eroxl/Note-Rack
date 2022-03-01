// -=- Used for blocks that can't be deleted and are only controlled by the server -=-
interface PermanentBlock {
  properties: { value: string },
  blockID: string,
  page: string,
}

// -=- Used for the base block -=-
interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: Record<string, unknown>,
  style: Record<string, unknown>,
  page: string,
  index: number,
  addBlockAtIndex: (index: number) => void,
  removeBlock: (blockID: string, index: number) => void,
}

// -=- Used for p through h1 -=-
interface EditableText {
  properties: {
    value: string
  },
  page: string,
  blockID: string,
  type: string,
  addBlockAtIndex: () => void,
  removeBlock: () => void,
}

// -=- Used for for blocks that can't be deleted but can be edited -=-
interface PermanentEditableText {
  properties: {
    value: string
  },
  page: string,
  blockID: string,
  type: string,
  addBlockAtIndex: () => void,
}

export type {
  PermanentBlock, BaseBlockProps, EditableText, PermanentEditableText,
};
