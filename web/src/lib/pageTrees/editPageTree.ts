const editPageTree = async (page: string, expanded: boolean) => {
  const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/edit-page-tree/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      'new-expansion-state': expanded,
    }),
  });

  if (pageTreeResponse.status === 200) return;

  const pageTree = await pageTreeResponse.json();

  throw new Error(`Couldn't get page info because of: ${pageTree.message}`);
};

export default editPageTree;
