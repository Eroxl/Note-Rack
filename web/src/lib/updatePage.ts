import PageDataInterface from '../types/pageTypes';

const addBlockAtIndex = async (
  index: number,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  const generatedBlockResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify/${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'new-block-type': 'text',
      'new-block-index': index,
    }),
    credentials: 'include',
  });
  const generatedBlockObject: {
    message: { blockID: string }
  } = await generatedBlockResponse.json();

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.data.splice(index, 0, {
    blockID: generatedBlockObject.message.blockID as string,
    blockType: 'text',
    properties: {
      value: '\n',
    },
    style: {},
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
  blockID: string,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      actionData: {
        blockID,
      },
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
  blockID: string,
  blockType: string | undefined,
  properties: Record<string, unknown> | undefined,
  style: Record<string, unknown> | undefined,
  page: string,
) => {
  const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      action: 'edit',
      actionData: {
        blockID,
        data: {
          ...(blockType && { blockType }),
          ...(properties && { properties }),
          ...(style && { style }),
        },
      },
    }),
  });

  const updateResponseJSON = await updateResponse.json();

  if (updateResponse.status === 200) return;

  throw new Error(`Addition to server failed because of: ${updateResponseJSON.message}`);
};

export { addBlockAtIndex, removeBlock, editBlock };
