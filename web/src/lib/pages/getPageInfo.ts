const getPageInfo = async (page: string) => {
  // -=- Fetch -=-
  // ~ Send a GET request to the API to get the page's info
  const pageInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-page-info/${page}`, {
    method: 'GET',
    credentials: 'include',
  });

  // -=- Response -=-
  // ~ Get the response as JSON
  const pageInfo = await pageInfoResponse.json();

  // ~ If the response is 200 (Ok), return the page info
  if (pageInfoResponse.status === 200) return pageInfo.message;

  // -=- Error Handling -=-
  // ~ If the response is not 200 (Ok), throw an error
  throw new Error(`Couldn't get page info because of: ${pageInfo.message}`);
};

export default getPageInfo;
