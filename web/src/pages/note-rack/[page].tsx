import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSessionContext } from 'supertokens-auth-react/recipe/session'; 
import Link from 'next/link';

import PagePath from '../../components/pageInfo/PagePath';
import type PageDataInterface from '../../lib/types/pageTypes';
import PageSidebar from '../../components/pageInfo/PageSidebar';
import Editor from '../../components/Editor';
import LoadingPage from '../../components/LoadingPage';
import SaveManager from '../../lib/classes/SaveManager';
import ShareButton from '../../components/pageCustomization/ShareButton';
import PageContext from '../../contexts/PageContext';
import SearchModal from '../../components/modals/SearchModal';

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
      setPageData((await pageDataReq).message);
    })();

    // -=- Setup Auto Saving -=-
    // ~ Every 2.5 seconds, send the page changes to the server
    setInterval(() => { SaveManager.sendToServer(); }, 2500);
  }, [pageDataReq]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();

        console.log('Open search modal');
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
        <div className="w-full h-full overflow-hidden print:h-max print:overflow-visible bg-amber-50 no-scrollbar dark:bg-zinc-700 print:dark:bg-white">
          <div className="absolute">
            <div className="relative z-10 flex w-screen h-10 print:h-0 bg-amber-50 no-scrollbar dark:bg-zinc-700 print:dark:bg-white">
              {isLoggedIn 
                ? (
                  <>
                    <PagePath />
                    <ShareButton />
                  </>
                )
                : (
                  <Link href="/auth#">
                    <a
                      href="/auth#"
                      className="px-2 my-auto ml-auto text-center rounded cursor-pointer text-zinc-700 dark:text-amber-50"
                    >Login</a>
                  </Link>
                )
              }
            </div>
          </div>
          {isLoggedIn && (
            <PageSidebar />
          )}
          <DndProvider backend={HTML5Backend}>
            {
              !pageData
                ? <LoadingPage />
                : <Editor />
            }
          </DndProvider>
          <SearchModal />
        </div>
      </PageContext.Provider>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // -=- Get Cookies -=-
  const { req, params } = context;
  const { page } = params as { page: string };
  const { cookies } = req;

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
