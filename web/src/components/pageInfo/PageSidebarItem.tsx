import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { PagePath } from './PagePath';
import type { PageSidebarItemProps } from './PageSidebar';
import editPageTree from '../../lib/pageTrees/editPageTree';

const PageSidebarItem = (props: PageSidebarItemProps & { pagePath: PagePath[] }) => {
  const {
    _id: pageID,
    expanded,
    style,
    parentExpanded,
    subPages,
    pagePath,
  } = props;

  const [currentSubPages, setCurrentSubPages] = useState(subPages);
  const [currentName, setCurrentName] = useState<string>(style?.name as string || 'Untitled');
  const [currentIcon, setCurrentIcon] = useState<string>(style?.icon as string || '📝');
  const [isExpanded, setIsExpanded] = useState(expanded);

  const router = useRouter();

  useEffect(() => {
    // -=- Handle the page title change event -=-
    const changeTitle = (event: CustomEvent) => {
      const { detail } = event;
      const { newTitle, newIcon } = detail;

      if (newIcon !== undefined) setCurrentIcon(newIcon);
      if (newTitle !== undefined) setCurrentName(newTitle);
    };

    // -=- Handle the add page event -=-
    const addChild = (event: CustomEvent) => {
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

    // -=- Handle the delete page event -=-
    const removeChild = (event: CustomEvent) => {
      const { detail } = event;
      const { deletedPageID } = detail;

      const currentSubPagesCopy = [...currentSubPages];

      const deletedPageIndex = currentSubPagesCopy.findIndex((page) => page._id === deletedPageID);
      currentSubPagesCopy.splice(deletedPageIndex, 1);

      setCurrentSubPages(currentSubPagesCopy);
    };

    // -=- Add the event listeners -=-
    if (router.query.page === pageID) {
      document.addEventListener('changePageTitle', changeTitle as EventListener);
      document.addEventListener('addPage', addChild as EventListener);
      document.addEventListener('deletePage', removeChild as EventListener);

      // -=- Update page path -=-
      document.dispatchEvent(new CustomEvent('pagePath', {
        detail: [...pagePath, {
          name: currentName,
          icon: currentIcon,
          pageID,
        }],
      }));
    }

    // -=- Cleanup -=-
    // ~ Remove the event listeners, on unmount
    return () => {
      document.removeEventListener('changePageTitle', changeTitle as EventListener);
      document.removeEventListener('addPage', addChild as EventListener);
      document.removeEventListener('deletePage', removeChild as EventListener);
    };
  }, []);

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
              pagePath={[
                ...pagePath,
                {
                  pageID,
                  icon: currentIcon,
                  name: currentName,
                },
              ]}
            />
          );
        })
      }
    </div>
  );
};

export default PageSidebarItem;
