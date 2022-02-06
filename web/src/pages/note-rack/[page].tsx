import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import BaseBlock from '../../components/blocks/BaseBlock';
import Spinner from '../../components/Spinner';

interface pageDataInterface {
  status: string,
  message: {
    blockID: string,
    blockType: string,
    properties: Record<string, unknown>,
    style: Record<string, unknown>,
  }[],
}

const NoteRackPage = (props: {pageDataReq: Promise<pageDataInterface>}) => {
  const [pageData, setPageData] = useState<pageDataInterface | Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { pageDataReq } = props;
  const router = useRouter();
  const { page } = router.query;

  // TODO:EROXL: Add error handling here...
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setPageData(await pageDataReq);
      setIsLoading(false);
    })();
  }, []);

  const addBlockAtIndex = async (index: number) => {
    const generatedBlockResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
      method: 'PATCH',
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
      credentials: 'include',
    });
    const generatedBlockObject: {
      message: { blockID: string }
    } = await generatedBlockResponse.json();

    const tempPageData = pageData as pageDataInterface;
    tempPageData.message.splice(index, 0, {
      blockID: generatedBlockObject.message.blockID as string,
      blockType: 'text',
      properties: {
        value: '',
      },
      style: {},
    });

    setPageData({
      status: 'Success',
      message: [...tempPageData.message],
    });
  };

  const removeBlock = async (blockID: string, index: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        actionData: {
          blockID,
        },
      }),
      credentials: 'include',
    });

    const tempPageData = pageData as pageDataInterface;
    tempPageData.message.splice(index, 1);

    setPageData({
      status: 'Success',
      message: [...tempPageData.message],
    });
  };

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
                {(pageData as pageDataInterface).message.map((block, index) => (
                  <BaseBlock
                    blockType={block.blockType}
                    page={page as string}
                    blockID={block.blockID}
                    properties={block.properties}
                    style={block.style}
                    index={index}
                    addBlockAtIndex={addBlockAtIndex}
                    removeBlock={removeBlock}
                  />
                ))}
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
