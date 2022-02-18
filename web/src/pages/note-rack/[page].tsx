import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';

import Editor from '../../components/Editor';
import LoadingPage from '../../components/LoadingPage';
import PageDataInterface from '../../lib/types/pageTypes';

const NoteRackPage = (props: {pageDataReq: Promise<PageDataInterface>}) => {
  const [pageData, setPageData] = useState<PageDataInterface | Record<string, unknown>>({});
  const { pageDataReq } = props;

  // TODO:EROXL: Add error handling here...
  useEffect(() => {
    (async () => {
      setPageData(await pageDataReq);
    })();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-amber-50 no-scrollbar">
      <div className="absolute z-10 w-screen h-10 bg-amber-50" />
      <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />
      {
        !pageData.message
          ? <LoadingPage />
          : <Editor pageData={pageData as PageDataInterface} setPageData={setPageData} />
      }
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, params } = context;
  const { page } = params as { page: string };
  const { cookies } = req;

  return ({
    props: (async () => ({
      pageDataReq: await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-page/${page}`, {
        headers: {
          Cookie: Object.keys(cookies).map((cookieKey) => `${cookieKey}=${cookies[cookieKey]}`).join('; '),
        },
      })).json(),
    }))(),
  });
};

export default NoteRackPage;
