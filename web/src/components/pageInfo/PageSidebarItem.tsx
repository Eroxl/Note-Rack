import React, { useState } from 'react';
import Link from 'next/link';

interface PageSidebarItemProps {
  _id: string,
  style: Record<string, unknown>,
  expanded: boolean,
  parentExpanded: boolean,
  subPages: PageSidebarItemProps[],
}

const PageSidebarItem = (props: PageSidebarItemProps) => {
  const {
    _id: pageID,
    expanded,
    style,
    parentExpanded,
    subPages,
  } = props;

  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={`pl-3 ${parentExpanded || 'hidden'}`}>
      <p className="flex flex-row items-center w-full gap-2 text-opacity-100 dark:text-amber-50/75 text-zinc-800/75">
        <button type="button" onClick={() => { setIsExpanded(!isExpanded); }}>
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
          prefetch={false}
        >
          <a className="truncate" href={`/note-rack/${pageID}`}>
            {`${style.icon || ''} ${style.name || 'Untitled'}`}
          </a>
        </Link>
      </p>
      {
        subPages.map((subPage) => {
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
            />
          );
        })
      }
    </div>
  );
};

export default PageSidebarItem;
