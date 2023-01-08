const deletePage = async (page: string) => {
  const deletePageResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify-page/${page}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const deletePageRespJSON = await deletePageResp.json();

  if (deletePageResp.status === 200) return;

  throw new Error(`Couldn't delete page because: ${deletePageRespJSON.message}`);
};

export default deletePage;
