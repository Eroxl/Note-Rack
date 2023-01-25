const editPageTree = async (page: string, expanded: boolean) => {
  // -=- Request -=-
  // ~ Send a PATCH request to the API to change the expansion state of the page
  const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/edit-page-tree/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      'new-expansion-state': expanded,
    }),
  });

  // -=- Success Handling -=-
  // ~ If the response is 200 (Ok), return
  if (pageTreeResponse.status === 200) return;

  // -=- Error Handling -=-
  // ~ If the response is not 200 (Ok), throw an error
  const pageTree = await pageTreeResponse.json();

  throw new Error(`Couldn't get page info because of: ${pageTree.message}`);
};

export default editPageTree;
