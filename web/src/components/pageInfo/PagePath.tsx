import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface PagePath {
  name: string;
  icon: string;
  pageID: string;
}

const PagePath = () => {
  const [pagePath, setPagePath] = useState<PagePath[]>([]);

  useEffect(() => {
    const handlePagePath = (event: CustomEvent<PagePath[]>) => {
      const { detail } = event;

      setPagePath(detail);
    };

    document.addEventListener('pagePath', handlePagePath as EventListener);

    return () => {
      document.removeEventListener('pagePath', handlePagePath as EventListener);
    };
  })

  return (
    <div className="flex items-center w-full gap-2 p-2 h-min dark:text-amber-50 text-zinc-800 print:hidden">
      {pagePath.map((page, index) => {
        if (index !== 0 && index < pagePath.length - 4) return null;

        if (index !== 0 && index === pagePath.length - 4) return (
          <span key={`page-path-${page.pageID}-ellipsis`} className="flex items-center gap-2">
            <span>
              ...
            </span>
            <span>
              /
            </span>
          </span>
        );

        return (
          <Link
            href={
              {
                pathname: '/note-rack/[page]',
                query: { page: page.pageID },
              }
            }
            prefetch={index !== pagePath.length - 1}
          >
            <a 
              href={`/note-rack/${page.pageID}`}
            >
              {page.icon}{' '}
              {page.name}{' '}
              {index !== pagePath.length - 1 &&  "/"}
            </a>
          </Link>
        )
      })}
    </div>
  );
};

export type { PagePath };

export default PagePath;
