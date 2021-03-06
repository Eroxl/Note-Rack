import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { PageSidebarItemProps } from './PageSidebarItemProps';
import editPageTree from '../../lib/pageTrees/editPageTree';

const PageSidebarItem = (props: PageSidebarItemProps) => {
  const {
    _id: pageID,
    expanded,
    style,
    parentExpanded,
    subPages,
  } = props;

  const [currentSubPages, setCurrentSubPages] = useState(subPages);
  const [currentName, setCurrentName] = useState(style.name || 'Untitled');
  const [currentIcon, setCurrentIcon] = useState(style.icon || '📝');
  const [isExpanded, setIsExpanded] = useState(expanded);

  const router = useRouter();

  useEffect(() => {
    const changeTitle = (event: CustomEvent) => {
      const { detail } = event;
      const { newTitle, newIcon } = detail;

      if (newIcon !== undefined) setCurrentIcon(newIcon);
      if (newTitle !== undefined) setCurrentName(newTitle);
    };

    const changeChildren = (event: CustomEvent) => {
      const { detail } = event;
      const {
        newPageID,
        newPageStyle,
      } = detail;

      const currentSubPagesCopy = [...currentSubPages];
      currentSubPagesCopy.push({
        _id: newPageID,
        expanded: false,
        style: newPageStyle,
        parentExpanded: expanded,
        subPages: [],
      });

      setCurrentSubPages(currentSubPagesCopy);
    };

    if (router.query.page === pageID) {
      document.addEventListener('changePageTitle', changeTitle as EventListener);
      document.addEventListener('addPage', changeChildren as EventListener);
    }

    return () => {
      document.removeEventListener('changePageTitle', changeTitle as EventListener);
      document.removeEventListener('addPage', changeChildren as EventListener);
    };
  });

  return (
    <div className={`pl-3 ${parentExpanded || 'hidden'}`}>
      <p className={`flex flex-row items-center w-full gap-2 text-opacity-100 dark:text-amber-50/75 text-zinc-800/75 ${router.query.page === pageID && 'dark:text-white text-black'}`}>
        <button type="button" onClick={() => { setIsExpanded(!isExpanded); editPageTree(pageID, !isExpanded); }}>
          <svg viewBox="0 0 100 100" className={`w-3 h-3 ${isExpanded ? 'rotate-180' : 'rotate-90'} fill-current transition-transform`}>
            <polygon points="5.9,88.2 50,11.8 94.1,88.2 " />
          </svg>
        </button>
        <Link
          href={
            {
              pathname: '/note-rack/[page]',
              query: { page: pageID },
            }
          }
          prefetch={isExpanded && parentExpanded ? undefined : false}
        >
          <a className="truncate" href={`/note-rack/${pageID}`}>
            {`${currentIcon} ${currentName || 'Untitled'}`}
          </a>
        </Link>
      </p>
      {
        currentSubPages.map((subPage) => {
          const {
            expanded: subPageExpanded,
            _id: subPageID,
            subPages: subPageSubPages,
            style: subPageStyle,
          } = subPage;

          return (
            <PageSidebarItem
              expanded={subPageExpanded}
              _id={subPageID}
              subPages={subPageSubPages}
              style={subPageStyle}
              parentExpanded={parentExpanded && isExpanded}
              key={subPageID}
            />
          );
        })
      }
    </div>
  );
};

export default PageSidebarItem;
