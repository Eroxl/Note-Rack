import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import PageSidebarItem from './PageSidebarItem';
import Brain from '../../public/icons/Brain.svg';
import Search from '../../public/icons/Search.svg';

export interface PageSidebarItemProps {
  _id: string,
  style: Record<string, unknown>,
  expanded: boolean,
  parentExpanded: boolean,
  subPages: PageSidebarItemProps[]
}

const PageSidebar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageTree, setPageTree] = useState<PageSidebarItemProps[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      // -=- Fetching -=-
      // ~ Fetch the page tree
      const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/get-page-tree`, {
        method: 'GET',
        credentials: 'include',
      });

      // -=- Parsing -=-
      // ~ Parse the page tree
      const pageTreeObject = await pageTreeResponse.json();

      // -=- Setting -=-
      // ~ Set the page tree, if it exists
      setPageTree(pageTreeObject.message.subPages || []);

      document.dispatchEvent(new CustomEvent('pageTreeLoaded', {
        detail: {
          pageTree: pageTreeObject.message.subPages,
        },
      }));

      // ~ Set the loading state to false
      setIsLoading(false);
    })();
  }, []);

  
  if (!pageTree?.length) {
    return (
      <div className="absolute h-screen p-3 pt-12 select-none print:h-max w-52 print:w-0 bg-amber-400/10 no-scrollbar dark:bg-white/10">
        <p className="text-white">
          Log in to see your pages
        </p>
      </div>
    );
  }

  return (
    <div className="absolute h-screen pt-12 pr-3 select-none print:h-max w-52 print:w-0 bg-amber-400/10 no-scrollbar dark:bg-white/10">
      <div className="flex flex-col w-full gap-2 pb-2 pl-3">
        <button
          className="flex flex-row gap-1 p-2 py-1 text-left text-white rounded hover:bg-white/20"
          onClick={() => {
            document.dispatchEvent(new CustomEvent('openSearchModal'));
          }}
        >
          <Image
            src={Search}
            alt="Search"
            width={24}
            height={24}
          />
          Search
        </button>
        <button
          className="flex flex-row gap-1 p-2 py-1 text-left text-white rounded hover:bg-white/20"
          onClick={() => {
            document.dispatchEvent(new CustomEvent('openChatPage'));
          }}
        >
          <Image
            src={Brain}
            alt="Chat"
            width={24}
            height={24}
          />
          Chat
        </button>
      </div>
      {/* ~ Render the page tree after it has been loaded */}
      {!isLoading && (
        (pageTree as PageSidebarItemProps[]).map((pageItem) => {
          const {
            expanded, _id, subPages, style,
          } = pageItem;

          return (
            <PageSidebarItem
              expanded={expanded}
              parentExpanded
              style={style}
              _id={_id}
              subPages={subPages}
              key={_id}
              pagePath={[]}
            />
          );
        })
      )}
    </div>
  );
};

export default PageSidebar;
