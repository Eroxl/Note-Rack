import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

import BaseModal from './BaseModal';

interface SearchResult {
  content: string,
  blockID: string,
  pageID: string,
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  let searchTimeout: NodeJS.Timeout;

  const updateSearchResults = async (searchTerm: string) => {
    const searchURL = `${process.env.NEXT_PUBLIC_API_URL}/account/search?filter=${searchTerm}`;

    const searchResults = await fetch(searchURL);

    if (!searchResults.ok) return;

    const searchResultsJSON = await searchResults.json() as { message: SearchResult[] };

    if (!searchResultsJSON.message) return;

    setSearchResults(searchResultsJSON.message);
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

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="top-24 -translate-y-[0%]"
    >
      <div className="flex flex-col w-screen max-w-2xl gap-2 p-2 rounded-lg bg-zinc-700">
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
            {searchResults.map((result) => (
              <Link
                href={`/note-rack/${result.pageID}#${result.blockID}`}
              >
                <a
                  className={`
                    flex flex-col justify-center p-2
                    rounded bg-zinc-600 text-xl text-white
                  `}
                  onClick={() => {
                    setIsOpen(false)
                    setSearchResults([]);

                    if (inputRef.current) {
                      inputRef.current.value = '';
                    }
                  }}
                  href={`/note-rack/${result.pageID}#${result.blockID}`}
                >
                  {result.content.substring(0, 100)}
                  {result.content.length > 100 && '...'}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}

export default SearchModal;
