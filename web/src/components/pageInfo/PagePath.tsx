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
    <div className="flex items-center w-full h-full gap-2 p-2 dark:text-amber-50 text-zinc-800 print:hidden">
      {pagePath.map((page, index) => (
        <div className="flex items-center gap-2">
          <span key={`page-path-${page.pageID}-icon`}>
            {page.icon}
          </span>
          <span key={`page-path-${page.pageID}-name`}>
            {page.name}
          </span>
          {index !== pagePath.length - 1 && <span key={`page-path-${page.pageID}-slash`}> / </span>}
        </div>
      ))}
    </div>
  );
};

export type { PagePath };

export default PagePath;
