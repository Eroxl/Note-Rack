const getPageTree = async () => {
  const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/get-page-tree`, {
    method: 'GET',
    credentials: 'include',
  });

  const pageTree = await pageTreeResponse.json();

  if (pageTreeResponse.status === 200) return pageTree.message;

  throw new Error(`Couldn't get page info because of: ${pageTree.message}`);
};

export default getPageTree;
