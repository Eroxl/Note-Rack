const editStyle = async (style: Record<string, unknown>, page: string) => {
  const styleUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      action: 'style',
      actionData: {
        ...style,
      },
    }),
  });

  const styleUpdateResponseJSON = await styleUpdateResponse.json();

  if (styleUpdateResponse.status === 200) return;

  throw new Error(`Addition to server failed because of: ${styleUpdateResponseJSON.message}`);
};

export default editStyle;
