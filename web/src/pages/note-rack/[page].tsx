import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSessionContext, attemptRefreshingSession,  } from 'supertokens-auth-react/recipe/session';

import type PageDataInterface from '../../lib/types/pageTypes';
import Editor from '../../components/Editor';
import LoadingPage from '../../components/LoadingPage';
import SaveManager from '../../lib/classes/SaveManager';
import PageContext from '../../contexts/PageContext';
import MenuBar from '../../components/MenuBar';
import Chat from '../../components/Chat';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NoteRackPage = () => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [error, setError] = useState<string | undefined>();
  const [pageData, setPageData] = useState<PageDataInterface['message']>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const router = useRouter();
  const { page } = router.query as { page: string };

  const session = useSessionContext();
  const isLoggedIn = session?.loading === false && session?.doesSessionExist === true;

  // TODO:EROXL: Add error handling here...
  useEffect(() => {
    if (!page) return;

    const loadPageData = async (shouldRefreshSession = true) => {
      let pageDataReq = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/page/get-page/${page}`,
        {
          credentials: 'include',
        },
      );

      const pageData = await pageDataReq.json();
     
      if (pageDataReq.status === 401 && pageData.message === 'try refresh token') {
        if (!shouldRefreshSession) {
          setError('You are not authorized to view this page.');
          setStatus('error');
          return;
        }

        await attemptRefreshingSession();
        loadPageData(false);
        return;
      }

      if (pageData.status === 'error') {
        setError(pageData.message as unknown as string);
        setStatus('error');
        return;
      }

      setPageData(pageData.message);
      setStatus('loaded');
    };

    // -=- Setup Page Data -=-
    // ~ Get the page data
    loadPageData();

    // -=- Setup Auto Saving -=-
    // ~ Every 2.5 seconds, send the page changes to the server
    setInterval(() => { SaveManager.sendToServer(); }, 2500);
  }, [page]);

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

  useEffect(() => {
    const handleChatToggle = () => {
      setIsChatOpen(!isChatOpen);
    };

    document.addEventListener('openChatPanel', handleChatToggle);

    return () => {
      document.removeEventListener('openChatPanel', handleChatToggle);
    }
  }, [isChatOpen]);

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
          <div className={`flex ${isLoggedIn && 'pl-52'} print:pl-0 h-screen print:h-full`}>
            <div className={`${isChatOpen ? 'w-1/2 print:w-full' : 'w-full'}`}>
              <DndProvider backend={HTML5Backend}>
                {
                  status === 'loading'
                    ? <LoadingPage />
                    : status === 'error'
                      ? (
                        <div className="w-full h-full mt-10 overflow-hidden">
                          <div className="flex flex-col items-center w-full h-screen bg-amber-50 dark:bg-zinc-700">
                            <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl px-20 break-words pb-36 text-zinc-700 dark:text-amber-50">
                              <p>
                                <p className="text-2xl text-center">
                                  There was an error loading the page.
                                </p>
                                <p className="text-2xl text-center text-red-400">
                                  {error}
                                </p>
                              </p>

                              <Link href="/note-rack/">
                                <a className="mt-10 text-xl text-center text-blue-400 hover:underline">
                                  Go back to your Note Rack
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                      : <Editor />
                }
              </DndProvider>
            </div>
            {
              isChatOpen && (
                <>
                  <div className="w-1 bg-black/10 print:hidden" />
                  <div className="w-1/2 h-screen print:hidden">
                    <Chat />
                  </div>
                </>
              )
            }
          </div>
        </MenuBar>
      </PageContext.Provider>
    </>
  );
};

export default NoteRackPage;
