/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';

import focusElement from '../helpers/focusElement';
import findNextBlock from '../helpers/findNextBlock';
import type PageDataInterface from '../types/pageTypes';
import SaveManager from '../classes/SaveManager';
import BlockTypes from '../constants/BlockTypes';

const addBlockAtIndex = async (
  index: number,
  page: string,
  pageData: PageDataInterface['message'],
  setPageData: React.Dispatch<React.SetStateAction<PageDataInterface['message']>>,
  blockIDs?: string[],
  blockType?: keyof typeof BlockTypes,
  blockProperties?: Record<string, unknown>,
) => {
  // ~ Generate a random ID for the block
  const objectID = crypto.randomBytes(12).toString('hex');

  // ~ Save the change to the server
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

  // ~ Add the block to the page
  const tempPageData = pageData;

  tempPageData!.data.splice(index, 0, {
    _id: objectID,
    blockType: blockType || 'text',
    properties: blockProperties || {
      value: '\n',
    },
    children: [],
  });

  // ~ Update the page
  setPageData({
    style: tempPageData!.style,
    data: [...tempPageData!.data],
    userPermissions: tempPageData!.userPermissions,
    permissions: tempPageData!.permissions,
  });

  // ~ Wait for page to update before adding the block
  await new Promise((resolve) => setTimeout(resolve, 5));

  document.getElementById(`block-${objectID}`)?.focus();
};

const removeBlock = async (
  index: number,
  blockIDs: string[],
  page: string,
  pageData: PageDataInterface['message'],
  setPageData: React.Dispatch<React.SetStateAction<PageDataInterface['message']>>,
  moveFocusToPreviousBlock = false,
) => {
  // ~ Save the change to the server
  SaveManager.save(
    'deleteBlock',
    {
      'doc-ids': blockIDs,
    },
    page,
  );

  // ~ Remove the block from the page
  const tempPageData = pageData;
  tempPageData!.data.splice(index, 1);

  // ~ Update the page
  setPageData({
    style: tempPageData!.style,
    data: [...tempPageData!.data],
    userPermissions: tempPageData!.userPermissions,
    permissions: tempPageData!.permissions,
  });

  if (!moveFocusToPreviousBlock) return;

  const previousBlock = findNextBlock(document.getElementById(`block-${blockIDs[0]}`), (start) => start - 1, pageData);

  if (!previousBlock) return;

  await new Promise((resolve) => setTimeout(resolve, 5));

  focusElement(previousBlock, previousBlock?.textContent?.length || 0);
};

const editBlock = async (
  blockIDs: string[],
  blockType: string | undefined,
  properties: Record<string, unknown> | undefined,
  page: string,
) => {
  // ~ Save the change to the server
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
  pageData: PageDataInterface['message'],
  setPageData: React.Dispatch<React.SetStateAction<PageDataInterface['message']>>,
) => {
  // ~ Figure out if the block is being moved up or down
  const offset = currentIndex > newIndex ? 1 : 0;

  // -=- Save the change to the server -=-
  // ~ Delete the block at the old index
  SaveManager.save(
    'deleteBlock',
    {
      'doc-ids': blockIDs,
    },
    page,
  );

  // ~ Add the block at the new index
  SaveManager.save(
    'addBlock',
    {
      'doc-ids': blockIDs.length > 1 ? blockIDs : undefined,
      'new-block-index': newIndex + offset,
      'new-block-id': blockIDs[blockIDs.length - 1],
      'new-block-type': pageData!.data[currentIndex].blockType,
      'new-block-properties': pageData!.data[currentIndex].properties,
    },
    page,
  );

  // -=- Update page data -=-
  const pageDataCopy = { ...pageData! };

  pageDataCopy.data.splice(newIndex + 1, 0, pageData!.data[currentIndex]);
  pageDataCopy.data.splice(currentIndex + offset, 1);
  setPageData(pageDataCopy);
};

// -=- Exports -=-
export {
  addBlockAtIndex,
  removeBlock,
  editBlock,
  moveBlock,
};
