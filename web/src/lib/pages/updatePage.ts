/* eslint-disable no-promise-executor-return */
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
  blockType?: string,
  blockProperties?: Record<string, unknown>,
) => {
  const objectID = crypto.randomBytes(12).toString('hex');

  SaveManager.save(
    'addBlock',
    {
      'doc-ids': blockIDs,
      'new-block-type': blockType || 'text',
      'new-block-index': index,
      'new-block-properties': blockProperties || {},
      'new-block-id': objectID,
    },
    page,
  );

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.data.splice(index, 0, {
    _id: objectID,
    blockType: blockType || 'text',
    properties: blockProperties || {
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

  // ~ Wait for page to update before adding block
  await new Promise((resolve) => setTimeout(resolve, 5));
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

// TODO: Add support for children blocks / nested blocks
const moveBlock = async (
  blockIDs: string[],
  currentIndex: number,
  newIndex: number,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  const offset = currentIndex > newIndex ? 1 : 0;

  SaveManager.save(
    'deleteBlock',
    {
      'doc-ids': blockIDs,
    },
    page,
  );

  SaveManager.save(
    'addBlock',
    {
      'doc-ids': blockIDs.length > 1 ? blockIDs : undefined,
      'new-block-index': newIndex + offset,
      'new-block-id': blockIDs[blockIDs.length - 1],
      'new-block-type': pageData.message.data[currentIndex].blockType,
      'new-block-properties': pageData.message.data[currentIndex].properties,
    },
    page,
  );

  // -=- Update page data -=-
  const pageDataCopy = { ...pageData };

  pageDataCopy.message.data.splice(newIndex + 1, 0, pageData.message.data[currentIndex]);
  pageDataCopy.message.data.splice(currentIndex + offset, 1);
  setPageData(pageDataCopy);
};

export {
  addBlockAtIndex,
  removeBlock,
  editBlock,
  moveBlock,
};
