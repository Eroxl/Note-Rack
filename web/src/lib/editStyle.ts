const editStyle = async (style: Record<string, unknown>, page: string) => {
  const styleUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      style,
    }),
  });

  const styleUpdateResponseJSON = await styleUpdateResponse.json();

  if (styleUpdateResponse.status === 200) return;

  throw new Error(`Couldn't update pages style because: ${styleUpdateResponseJSON.message}`);
};

export default editStyle;
