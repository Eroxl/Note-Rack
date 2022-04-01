const getPageInfo = async (page: string) => {
  const pageInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-page-info/${page}`, {
    method: 'GET',
    credentials: 'include',
  });

  const pageInfo = await pageInfoResponse.json();

  if (pageInfoResponse.status === 200) return pageInfo.message;

  throw new Error(`Couldn't get page info because of: ${pageInfo.message}`);
};

export default getPageInfo;
