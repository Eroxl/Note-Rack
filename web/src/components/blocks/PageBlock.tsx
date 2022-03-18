import React from 'react';
import Link from 'next/link';

interface PageBlockProps {
  blockID: string;
  properties: {
    value: string,
  }
}

const PageBlock = (props: PageBlockProps) => {
  const { blockID, properties } = props;
  const { value } = properties;

  return (
    <Link href={
      {
        pathname: '/note-rack/[page]',
        query: { page: blockID },
      }
    }
    >
      <a
        className="min-h-[1.2em] outline-none font-bold text-left"
        tabIndex={0}
        id={blockID}
        href={`/note-rack/${blockID}`}
      >
        [[
        {' '}
        {value}
        {' '}
        ]]
      </a>
    </Link>
  );
};

export default PageBlock;
