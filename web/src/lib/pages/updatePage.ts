/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';

import type PageDataInterface from '../../types/pageTypes';
import SaveManager from '../../classes/SaveManager';

const addBlockAtIndex = async (
  index: number,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
  blockIDs?: string[],
) => {
  const objectID = crypto.randomBytes(12).toString('hex');

  SaveManager.save(
    'addBlock',
    {
      'doc-ids': blockIDs,
      'new-block-type': 'text',
      'new-block-index': index,
      'new-block-properties': {},
      'new-block-id': objectID,
    },
    page,
  );

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.data.splice(index, 0, {
    _id: objectID,
    blockType: 'text',
    properties: {
      value: '\n',
    },
    children: [],
  });

  setPageData({
    status: 'Success',
    message: {
      style: tempPageData.message.style,
      data: [...tempPageData.message.data],
    },
  });

  document.getElementById(objectID)?.focus();
};

const removeBlock = async (
  index: number,
  blockIDs: string[],
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  SaveManager.save(
    'deleteBlock',
    {
      'doc-ids': blockIDs,
    },
    page,
  );

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.data.splice(index, 1);

  setPageData({
    status: 'Success',
    message: {
      style: tempPageData.message.style,
      data: [...tempPageData.message.data],
    },
  });
};

const editBlock = async (
  blockIDs: string[],
  blockType: string | undefined,
  properties: Record<string, unknown> | undefined,
  page: string,
) => {
  SaveManager.save(
    'editBlock',
    {
      'doc-ids': blockIDs,
      'block-type': blockType,
      'block-properties': properties,
    },
    page,
  );
};

export { addBlockAtIndex, removeBlock, editBlock };
