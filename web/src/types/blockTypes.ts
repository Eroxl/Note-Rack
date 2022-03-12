// -=- Used for the base block -=-
interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: Record<string, unknown>,
  children: unknown[]
  page: string,
  index: number,
  addBlockAtIndex: (index: number) => void,
  removeBlock: (blockID: string, index: number) => void,
}

// -=- Used for blocks that can't be deleted and are only controlled by the server -=-
interface PermanentBlock {
  properties: { value: string },
  blockID: string,
  page: string,
}

// -=- Used for for blocks that can't be deleted but can be edited -=-
interface PermanentEditableText extends PermanentBlock {
  type: string,
  addBlockAtIndex: () => void,
}

// -=- Used for p through h1 -=-
interface EditableText extends PermanentEditableText {
  removeBlock: () => void,
  setCurrentBlockType: (_type: string) => void,
}

// -=- Used for ol and ul elements -=-
interface EditableList extends EditableText {
  properties: {
    value: string,
    relationship: 'sibling' | 'child',
  },
  children: EditableList[]
}

// -=- Used for check list elements -=-
interface EditableCheckList extends EditableList {
  properties: {
    value: string,
    checked: boolean,
    relationship: 'sibling' | 'child',
  },
}

export type {
  BaseBlockProps,
  PermanentBlock,
  PermanentEditableText,
  EditableText,
  EditableList,
  EditableCheckList,
};
