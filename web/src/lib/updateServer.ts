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

export default updateServer;
