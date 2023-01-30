/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';

import type PageDataInterface from '../../types/pageTypes';
import SaveManager from '../../classes/SaveManager';

/**
 * This function is used to  add a block to the page at the specified index
 * @param index The index to add the block at
 * @param page The page to add the block to
 * @param pageData The page data
 * @param setPageData The function to set the page data
 * @param blockIDs The IDs of the path to the block
 * @param blockType The type of the block
 * @param blockProperties The properties of the block
 */
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
  tempPageData.message.data.splice(index, 0, {
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
      style: tempPageData.message.style,
      data: [...tempPageData.message.data],
    },
  });

  // ~ Wait for page to update before adding the block
  await new Promise((resolve) => setTimeout(resolve, 5));
  document.getElementById(objectID)?.focus();
};

/**
 * This function is used to remove a block from a page.
 * @param index The index of the block to remove
 * @param blockIDs The IDs of the blocks to remove
 * @param page The page to remove the block from
 * @param pageData The current data of the page
 * @param setPageData A function to set the page data
 */
const removeBlock = async (
  index: number,
  blockIDs: string[],
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
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
  tempPageData.message.data.splice(index, 1);

  // ~ Update the page
  setPageData({
    status: 'Success',
    message: {
      style: tempPageData.message.style,
      data: [...tempPageData.message.data],
    },
  });
};

/** 
 * Edit a block on the page
 * @param blockIDs The IDs of the blocks to edit
 * @param blockType The type of the block
 * @param properties The properties of the block
 * @param page The page to edit the block on
 */
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
/**
 * This function moves a block from one index to another. It does so by first
 * saving the change to the server, and then updating the page data.
 *
 * @param blockIDs The IDs of the blocks to move
 * @param currentIndex The index to move the block from
 * @param newIndex The index to move the block to
 * @param page The page that the block is on
 * @param pageData The page data for the page the block is on
 * @param setPageData The function to update the page data
 */
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

// -=- Exports -=-
export {
  addBlockAtIndex,
  removeBlock,
  editBlock,
  moveBlock,
};
