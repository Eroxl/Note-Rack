import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BaseModal from './BaseModal';

interface SearchResult {
  content: string,
  blockID: string,
  pageID: string,
}

interface PageStylingMapEvent extends CustomEvent {
  detail: { 
    pageTree: {
      _id: string,
      style: {
        name: string,
        icon: string,
      },
      subPages: PageStylingMapEvent['detail']['pageTree'],
    }[]
  },
}

interface NewPageEvent extends CustomEvent {
  detail: {
    newPageID: string,
    newPageStyle: PageStylingMapEvent['detail']['pageTree'][0]['style'],
  },
}

interface DeletePageEvent extends CustomEvent {
  detail: {
    deletedPageID: string,
  },
}

interface ChangePageEvent extends CustomEvent {
  detail: {
    newTitle: string,
    newIcon: string,
  },
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [pageStylingMap, setPageStylingMap] = useState<{ [key: string]: { name: string, icon: string } }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  let searchTimeout: NodeJS.Timeout;

  const { page } = useRouter().query;

  const updateSearchResults = async (searchTerm: string) => {
    const searchURL = `${process.env.NEXT_PUBLIC_API_URL}/account/search?filter=${searchTerm}`;

    const searchResults = await fetch(searchURL);

    if (!searchResults.ok) return;

    const searchResultsJSON = await searchResults.json() as { message: SearchResult[] };

    if (!searchResultsJSON.message) return;

    setSearchResults(searchResultsJSON.message);
  }

  const parseSearchResults = (results: SearchResult[]) => {
    const parsedResults = results.map((result) => {
      const { content, blockID, pageID } = result;

      // ~ Replace <em> tags with styled span elements
      const replaceHighlights = (content: string) => {
        const contentArray = content.split(/(<em>|<\/em>)/);

        let isNextHighlighted = false;

        const parsedContent = contentArray.map((contentPart) => {
          if (contentPart === '<em>') {
            isNextHighlighted = true;
            return;
          }

          if (contentPart === '</em>') {
            isNextHighlighted = false;
            return;
          }

          if (isNextHighlighted) {
            return (
              <span className="font-bold text-zinc-100">
                {contentPart}
              </span>
            );
          }

          return contentPart;
        });

        return parsedContent;
      }

      return (
        <Link
          href={`/note-rack/${result.pageID}#${result.blockID}`}
        >
          <a
            className={`
              flex flex-col justify-center p-2
              rounded text-xl text-white hover:bg-zinc-600 
            `}
            onClick={() => {
              setIsOpen(false)
              setSearchResults([]);

              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
            href={`/note-rack/${pageID}#${blockID}`}
          >
            <span>
              {pageStylingMap[result.pageID].icon}
              {' '}
              {pageStylingMap[result.pageID].name}
            </span>
            <span className="pl-2 text-sm text-zinc-300">
              {replaceHighlights(
                `${content}${content.length >= 100 ? '...' : ''}`
              )}
            </span>
          </a>
        </Link>
      )
    });

    return parsedResults;
  }

  useEffect(() => {
    const handleOpenSearchModal = () => {
      setIsOpen(!isOpen);

      if (inputRef.current && !isOpen) {
        inputRef.current.focus();
      }
    }

    document.addEventListener('openSearchModal', handleOpenSearchModal);

    return () => {
      document.removeEventListener('openSearchModal', handleOpenSearchModal);
    };
  }, [isOpen]);

  // NOTE:EROXL: (2023-4-1) Don't want to make a second request so this is piggybacking on the PageSidebar logic
  useEffect(() => {    
    const addPage = (event: NewPageEvent) => {
      const { newPageID, newPageStyle } = event.detail;

      pageStylingMap[newPageID] = {
        name: newPageStyle.name,
        icon: newPageStyle.icon,
      };

      setPageStylingMap(pageStylingMap);
    }

    const deletePage = (event: DeletePageEvent) => {
      const { deletedPageID } = event.detail;

      try {
        delete pageStylingMap[deletedPageID];
      } catch (error) {
        if (error instanceof TypeError) {
          console.error('Page not found in pageStylingMap');
          return;
        }
      }

      setPageStylingMap(pageStylingMap);
    }

    const handlePageStylingMap = (event: PageStylingMapEvent) => {
      const parsePageTree = (pageTree: PageStylingMapEvent['detail']['pageTree']) => {
        pageTree.forEach((page) => {
          pageStylingMap[page._id] = {
            name: page.style.name,
            icon: page.style.icon,
          };

          if (page.subPages.length > 0) {
            parsePageTree(page.subPages);
          }
        });
      }

      parsePageTree(event.detail.pageTree);

      setPageStylingMap(pageStylingMap);
    }

    document.addEventListener('pageTreeLoaded', handlePageStylingMap as EventListener);
    document.addEventListener('addPage', addPage as EventListener);
    document.addEventListener('deletePage', deletePage as EventListener);

    return () => {
      document.removeEventListener('pageTreeLoaded', handlePageStylingMap as EventListener);
      document.removeEventListener('addPage', addPage as EventListener);
      document.removeEventListener('deletePage', deletePage as EventListener);
    };
  }, []);

  useEffect(() => {
    const changePage = (event: ChangePageEvent) => {
      const { newTitle, newIcon } = event.detail;

      if (typeof page !== 'string') return;

      pageStylingMap[page] = {
        name: newTitle || pageStylingMap[page].name,
        icon: newIcon || pageStylingMap[page].icon,
      };

      setPageStylingMap(pageStylingMap);
    }

    document.addEventListener('changePageTitle', changePage as EventListener);

    return () => {
      document.removeEventListener('changePageTitle', changePage as EventListener);
    };
  }, [page]);


  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="top-24 translate-y-[0%] max-h-[calc(100vh-12rem)] rounded-md  h-min overflow-scroll justify-start items-start"
    >
      <div className="flex flex-col w-screen max-w-2xl gap-2 p-2 rounded-lg h-max bg-zinc-700">
        <div
          className={`
            flex flex-col justify-center h-12 max-w-2xl
            p-2 rounded bg-zinc-600
          `}
        >
          <input
            className="text-xl text-white bg-transparent border-0 outline-none"
            placeholder='Search notes...'
            ref={inputRef}
            onInput={(event) => {
              const searchQuery = (event.target as HTMLInputElement).value;

              clearTimeout(searchTimeout);
              
              searchTimeout = setTimeout(() => {
                if (searchQuery.length === 0) {
                  setSearchResults([]);
                  return;
                }

                updateSearchResults(searchQuery);
              }, 1000);
            }}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="flex flex-col gap-2">
            {parseSearchResults(searchResults)}
          </div>
        )}
      </div>
    </BaseModal>
  );
}

export default SearchModal;
