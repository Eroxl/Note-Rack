/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';

import { focusBlockAtIndex } from '../helpers/focusHelpers';
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
  const tempPageData = pageData as PageDataInterface;
  tempPageData.message!.data.splice(index, 0, {
    _id: objectID,
    blockType: blockType || 'text',
    properties: blockProperties || {
      value: '\n',
    },
    children: [],
  });

  // ~ Update the page
  setPageData({
    status: 'Success',
    message: {
      style: tempPageData.message!.style,
      data: [...tempPageData.message!.data],
      userPermissions: tempPageData.message!.userPermissions,
      permissions: tempPageData.message!.permissions,
    },
  });

  // ~ Wait for page to update before adding the block
  await new Promise((resolve) => setTimeout(resolve, 5));
  document.getElementById(objectID)?.focus();
};

const removeBlock = async (
  index: number,
  blockIDs: string[],
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
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
  const tempPageData = pageData as PageDataInterface;
  tempPageData.message!.data.splice(index, 1);

  // ~ Update the page
  setPageData({
    status: 'Success',
    message: {
      style: tempPageData.message!.style,
      data: [...tempPageData.message!.data],
      userPermissions: tempPageData.message!.userPermissions,
      permissions: tempPageData.message!.permissions,
    },
  });

  if (!moveFocusToPreviousBlock) return;

  // ~ Wait for the page to update to focus the end of the previous block
  await new Promise((resolve) => setTimeout(resolve, 5));

  focusBlockAtIndex(index, tempPageData);
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
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
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
      'new-block-type': pageData.message!.data[currentIndex].blockType,
      'new-block-properties': pageData.message!.data[currentIndex].properties,
    },
    page,
  );

  // -=- Update page data -=-
  const pageDataCopy = { ...pageData };

  pageDataCopy.message!.data.splice(newIndex + 1, 0, pageData.message!.data[currentIndex]);
  pageDataCopy.message!.data.splice(currentIndex + offset, 1);
  setPageData(pageDataCopy);
};

// -=- Exports -=-
export {
  addBlockAtIndex,
  removeBlock,
  editBlock,
  moveBlock,
};
