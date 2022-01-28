import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';

import Spinner from '../../components/Spinner';

const NoteRackPage = (props: {pageData: Promise<{}>}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { pageData: pageDataPromise } = props;
  let pageData;

  useEffect(() => {
    (async () => {
      setIsLoaded(false);
      pageData = await pageDataPromise;
      setIsLoaded(true);
    })();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-amber-50">
      <div className="absolute w-screen h-10 bg-amber-50 z-10" />
      <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />

      {/* Editor Screen */}
      {
        !isLoaded || (
          <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
            <div className="h-max w-full bg-amber-50 flex flex-col items-center">
              <div className="bg-blue-300 h-72 w-full -mb-10" />
              <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24 editor" />
            </div>
          </div>
        )
      }

      {/* Loading Screen */}
      {
        isLoaded || (
          <div className="pl-52 h-full w-full overflow-hidden mt-10">
            <div className="h-screen w-full bg-amber-50 flex flex-col items-center">
              <div className="bg-blue-300 h-72 w-full -mb-10" />
              <div className="max-w-4xl w-full pb-36 text-zinc-700 break-words h-full px-20 flex flex-col justify-center items-center">
                <Spinner />
              </div>
            </div>
          </div>
        )
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
      pageData: await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-page/${page}`, {
        headers: {
          Cookie: Object.keys(cookies).map((cookieKey) => `${cookieKey}=${cookies[cookieKey]}`).join('; '),
        },
      })).json(),
    }))(),
  });
};

export default NoteRackPage;
