import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import type PageDataInterface from '../../lib/types/pageTypes';
import Editor from '../../components/Editor';
import LoadingPage from '../../components/LoadingPage';
import SaveManager from '../../lib/classes/SaveManager';
import PageContext from '../../contexts/PageContext';
import MenuBar from '../../components/MenuBar';
import Chat from '../../components/Chat';

const NoteRackPage = (props: {pageDataReq: Promise<PageDataInterface>}) => {
  const [pageData, setPageData] = useState<PageDataInterface['message']>();
  const { pageDataReq } = props;

  const session = useSessionContext();
  const isLoggedIn = session?.loading === false && session?.doesSessionExist === true;


  // TODO:EROXL: Add error handling here...
  useEffect(() => {
    // -=- Setup Page Data -=-
    // ~ Get the page data
    (async () => {
      setPageData((await pageDataReq)?.message);
    })();

    // -=- Setup Auto Saving -=-
    // ~ Every 2.5 seconds, send the page changes to the server
    setInterval(() => { SaveManager.sendToServer(); }, 2500);
  }, [pageDataReq]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();

        document.dispatchEvent(new Event('openSearchModal'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <>
      <Head>
        {
          !pageData
            ? (
              <title>Loading...</title>
            )
            : (
              <>
                <title>{pageData.style.name}</title>
                <link
                  rel="icon"
                  href={`
                    data:image/svg+xml,
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                      <text y="0.9em" font-size="90">
                        ${pageData.style.icon}
                      </text>
                    </svg>
                  `}
                  type="image/svg+xml"
                />
              </>
            )
        }
      </Head>
      <PageContext.Provider
        value={{
          pageData,
          setPageData,
        }}
      >
        <MenuBar>
          <div className={`flex ${isLoggedIn && 'pl-52'} print:pl-0 h-screen`}>
            <div className="w-1/2">
              <DndProvider backend={HTML5Backend}>
                {
                  !pageData
                    ? <LoadingPage />
                    : <Editor />
                }
              </DndProvider>
            </div>
            <div className="w-1 bg-black/10" />
            <div className="w-1/2">
              <Chat />
            </div>
          </div>
        </MenuBar>
      </PageContext.Provider>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // -=- Get Cookies -=-
  const { req, params } = context;
  const { page } = params as { page: string };
  const { cookies } = req;

  if (!page || page === 'chat') {
    return {
      props: (async () => ({}))()
    }
  }

  // -=- Get Page Data -=-
  // ~ Get the page data from the server, and return it to the client
  return ({
    props: (async () => ({
      pageDataReq: await (await fetch(`${process.env.LOCAL_API_URL}/page/get-page/${page}`, {
        headers: {
          Cookie: Object.keys(cookies).map((cookieKey) => `${cookieKey}=${cookies[cookieKey]}`).join('; '),
        },
      })).json(),
    }))(),
  });
};

export default NoteRackPage;
