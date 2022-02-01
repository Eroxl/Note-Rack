import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import Spinner from '../../components/Spinner';
import RenderPage from '../../lib/renderPage';

interface pageDataInterface {
  status: string,
  message: {
    blockID: string,
    blockType: string,
    properties: any,
    style: any,
  }[],
}

const NoteRackPage = (props: {pageDataReq: Promise<pageDataInterface>}) => {
  const [pageData, setPageData] = useState<pageDataInterface | {}>({});
  const [isLoading, setIsLoading] = useState(true);
  const { pageDataReq } = props;
  const router = useRouter();
  const { page } = router.query;

  const createNewBlock = async (index: number) => {
    const createNewBlockRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        actionData: {
          blockType: 'text',
          index,
        },
      }),
    });
    if (createNewBlockRequest.status !== 200) {
      return;
    }
    const createNewBlockResult = await createNewBlockRequest.json();

    const tempPageData = (pageData as pageDataInterface).message;
    tempPageData.splice(index, 0, {
      blockID: createNewBlockResult.message.blockID,
      blockType: 'text',
      properties: {},
      style: {},
    });
    setPageData({
      status: '',
      message: tempPageData,
    });
  };

  // TODO: Add error handling here...
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setPageData(await pageDataReq);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-amber-50">
      <div className="absolute w-screen h-10 bg-amber-50 z-10" />
      <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />

      {/* Editor Screen */}
      {
        isLoading || (
          <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
            <div className="h-max w-full bg-amber-50 flex flex-col items-center">
              <div className="bg-blue-300 h-72 w-full -mb-10" />
              <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24 editor">
                { RenderPage((pageData as unknown as any).message, page as string)}
                <div
                  className="w-full h-48"
                  onDoubleClick={
                    () => {
                      createNewBlock((pageData as unknown as any).message.length);
                    }
                  }
                />
              </div>
            </div>
          </div>
        )
      }

      {/* Loading Screen */}
      {
        !isLoading || (
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
      pageDataReq: await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-page/${page}`, {
        headers: {
          Cookie: Object.keys(cookies).map((cookieKey) => `${cookieKey}=${cookies[cookieKey]}`).join('; '),
        },
      })).json(),
    }))(),
  });
};

export default NoteRackPage;
