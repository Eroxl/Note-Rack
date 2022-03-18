import type { Dispatch, SetStateAction } from 'react';

import type PageDataInterface from './pageTypes';

// -=- Used for the base block -=-
interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: Record<string, unknown>,
  children: unknown[]
  page: string,
  index: number,
  pageData: PageDataInterface,
  setPageData: Dispatch<SetStateAction<PageDataInterface | Record<string, unknown>>>,
}

// -=- Used for blocks that can't be deleted and are only controlled by the server -=-
interface PermanentBlock {
  page: string,
}

// -=- Used for for blocks that can't be deleted but can be edited -=-
interface PermanentEditableText extends PermanentBlock {
  index: number,
  pageData: PageDataInterface,
  setPageData: Dispatch<SetStateAction<PageDataInterface | Record<string, unknown>>>,
}

// -=- Used for p through h1 -=-
interface EditableText extends PermanentEditableText {
  setCurrentBlockType: (_type: string) => void,
}

// -=- Used for ol and ul elements -=-
interface EditableList {
  properties: {
    value: string,
    relationship: 'sibling' | 'child',
  },
  page: string,
  type: string,
  blockID: [string],
  children: EditableList[]
  setCurrentBlockType: (_type: string) => void,
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
