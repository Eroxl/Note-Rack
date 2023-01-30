/**
 * Edit a page's style
 * @param {Object} style The new style
 * @param {string} page The page to edit
 * @throws {Error} - If the page failed to edit.
 */
const editStyle = async (style: Record<string, unknown>, page: string) => {
  // -=- Fetch -=-
  // ~ Send a PATCH request to the API to update the page's style
  const styleUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify-page/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      style,
    }),
  });

  // -=- Response -=-
  // ~ If the response is not 200, throw an error
  const styleUpdateResponseJSON = await styleUpdateResponse.json();

  // ~ If the response is 200 (Ok), return
  if (styleUpdateResponse.status === 200) return;

  // -=- Error Handling -=-
  // ~ If the response is not 200 (Ok), throw an error
  throw new Error(`Couldn't update pages style because: ${styleUpdateResponseJSON.message}`);
};

export default editStyle;
