import React, { useState, useEffect } from 'react';

import PageSidebarItem from './PageSidebarItem';

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
