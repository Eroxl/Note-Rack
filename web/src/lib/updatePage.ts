interface PageDataInterface {
  status: string,
  message: {
    blockID: string,
    blockType: string,
    properties: Record<string, unknown>,
    style: Record<string, unknown>,
  }[],
}

const addBlockAtIndex = async (
  index: number,
  page: string,
  pageData: PageDataInterface,
  setPageData: (value: Record<string, unknown>) => void,
) => {
  const generatedBlockResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'add',
      actionData: {
        blockType: 'text',
        index,
      },
    }),
    credentials: 'include',
  });
  const generatedBlockObject: {
    message: { blockID: string }
  } = await generatedBlockResponse.json();

  const tempPageData = pageData as PageDataInterface;
  tempPageData.message.splice(index, 0, {
    blockID: generatedBlockObject.message.blockID as string,
    blockType: 'text',
    properties: {
      value: '\n',
    },
    style: {},
  });

  setPageData({
    status: 'Success',
    message: [...tempPageData.message],
  });
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
  tempPageData.message.splice(index, 1);

  setPageData({
    status: 'Success',
    message: [...tempPageData.message],
  });
};

export { addBlockAtIndex, removeBlock };
