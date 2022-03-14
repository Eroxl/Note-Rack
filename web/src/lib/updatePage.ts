/* eslint-disable no-underscore-dangle */
import type PageDataInterface from '../types/pageTypes';

const addBlockAtIndex = async (
  index: number,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
  blockIDs?: string[],
) => {
  const generatedBlockResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify/${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'new-block-type': 'text',
      'new-block-index': index,
      'doc-ids': blockIDs,
    }),
    credentials: 'include',
  });
  const generatedBlockObject: {
    message: { blockID: string }
  } = await generatedBlockResponse.json();

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.data.splice(index, 0, {
    _id: generatedBlockObject.message.blockID as string,
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

  document.getElementById(generatedBlockObject.message.blockID as string)?.focus();
};

const removeBlock = async (
  index: number,
  blockIDs: string[],
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify/${page}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'doc-ids': blockIDs,
    }),
    credentials: 'include',
  });

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
  const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      'doc-ids': blockIDs,
      ...(blockType && { 'block-type': blockType }),
      ...(properties && { properties }),
    }),
  });

  const updateResponseJSON = await updateResponse.json();

  if (updateResponse.status === 200) return;

  throw new Error(`Addition to server failed because of: ${updateResponseJSON.message}`);
};

export { addBlockAtIndex, removeBlock, editBlock };
