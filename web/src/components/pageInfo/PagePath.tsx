import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export interface PagePath {
  name: string;
  icon: string;
  pageID: string;
}

const PagePath = () => {
  const [pagePath, setPagePath] = useState<PagePath[]>([]);

  useEffect(() => {
    // ~ Handle the page path event
    const handlePagePath = (event: CustomEvent<PagePath[]>) => {
      const { detail } = event;

      // ~ Set the page path state to re-render the component
      setPagePath(detail);
    };

    // ~ Add the event listener
    document.addEventListener('pagePath', handlePagePath as EventListener);

    // ~ Remove the event listener, when the component unmounts
    return () => {
      document.removeEventListener('pagePath', handlePagePath as EventListener);
    };
  });

  return (
    <div className="flex items-center w-full gap-2 p-2 h-min dark:text-amber-50 text-zinc-800 print:hidden">
      {pagePath.map((page, index) => {
        // ~ If the page is not the first page in the path, or the last 3 pages in the path, return null
        if (index !== 0 && index < pagePath.length - 4) return null;

        // ~ If the page path is longer than 4 pages, return an ellipsis
        if (index !== 0 && index === pagePath.length - 4) {
          return (
            <span key={`page-path-${page.pageID}-ellipsis`} className="flex items-center gap-2">
              <span>
                ...
              </span>
              <span>
                /
              </span>
            </span>
          );
        }

        // ~ Return the page path link
        return (
          <Link
            href={
              {
                pathname: '/note-rack/[page]',
                query: { page: page.pageID },
              }
            }
            prefetch={index !== pagePath.length - 1}
            key={`page-path-${page.pageID}`}
          >
            <a
              href={`/note-rack/${page.pageID}`}
            >
              {page.icon}
              {' '}
              {page.name}
              {' '}
              {index !== pagePath.length - 1 && '/'}
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default PagePath;
