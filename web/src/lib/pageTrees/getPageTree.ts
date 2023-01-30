/**
 * Make a GET request to the API to get the page tree of the user.
 * @return The page tree.
 */
const getPageTree = async () => {
  // -=- Request -=-
  // ~ Send a GET request to the API to get the page tree
  const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/get-page-tree`, {
    method: 'GET',
    credentials: 'include',
  });

  // -=- Success Handling -=-
  // ~ Get the response as JSON
  const pageTree = await pageTreeResponse.json();

  // ~ If the response is 200 (Ok), return the page tree
  if (pageTreeResponse.status === 200) return pageTree.message;

  // -=- Error Handling -=-
  // ~ If the response is not 200 (Ok), throw an error
  throw new Error(`Couldn't get page info because of: ${pageTree.message}`);
};

export default getPageTree;
