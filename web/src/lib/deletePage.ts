const deletePage = async (page: string) => {
  // -=- Request -=-
  // ~ Send a DELETE request to the API
  const deletePageResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify-page/${page}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  // -=- Success Handling -=-
  // ~ Get the response as JSON
  const deletePageRespJSON = await deletePageResp.json();

  // ~ If the response is 200 (Ok), return
  if (deletePageResp.status === 200) return;

  // -=- Error Handling -=-
  // ~ If the response is not 200 (Ok), throw an error
  throw new Error(`Couldn't delete page because: ${deletePageRespJSON.message}`);
};

export default deletePage;
