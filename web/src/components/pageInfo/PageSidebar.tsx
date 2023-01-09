import React, { useState, useEffect } from 'react';

import type { PageSidebarItemProps } from './PageSidebarItemProps';
import PageSidebarItem from './PageSidebarItem';

const PageSidebar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageTree, setPageTree] = useState<PageSidebarItemProps[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const pageTreeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/get-page-tree`, {
        method: 'GET',
        credentials: 'include',
      });

      const pageTreeObject = await pageTreeResponse.json();

      setPageTree(pageTreeObject.message.subPages);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="absolute h-screen pt-12 pr-3 select-none print:h-max w-52 print:w-0 bg-amber-400/10 no-scrollbar dark:bg-white/10">
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
