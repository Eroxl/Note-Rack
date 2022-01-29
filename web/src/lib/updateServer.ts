const updateServer = async (
  blockID: string,
  blockType: string | undefined,
  properties: any | undefined,
  style: any | undefined,
  page: string,
) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
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
};

export default updateServer;
