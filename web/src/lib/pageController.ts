const updateServer = async (
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

const addToServer = async (blockType: string, index: number, page: string): Promise<number> => {
  const addResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      action: 'add',
      actionData: {
        data: {
          blockType,
          index,
        },
      },
    }),
  });

  const addResponseJSON = await addResponse.json();

  if (addResponse.status === 200) return (addResponseJSON.message);

  throw new Error(`Addition to server failed because of: ${addResponseJSON.message}`);
};

const removeFromServer = async (blockID: number, page: string) => {
  const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      action: 'delete',
      actionData: {
        data: {
          blockID,
        },
      },
    }),
  });

  const deleteResponseJSON = await deleteResponse.json();

  if (deleteResponse.status === 200) return;

  throw new Error(`Deletion to server failed because of: ${deleteResponseJSON.message}`);
};

export { updateServer, addToServer, removeFromServer };
