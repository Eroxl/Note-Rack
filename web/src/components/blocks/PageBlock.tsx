import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import getPageInfo from '../../lib/pages/getPageInfo';

interface PageBlockProps {
  blockID: string;
  properties: {
    value: string,
  }
}

const PageBlock = (props: PageBlockProps) => {
  const { blockID, properties } = props;
  const { value } = properties;

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    (async () => {
      const { style } = await getPageInfo(blockID);
      const { icon, name } = style;

      setCurrentValue(`${icon} ${name}`);
    })();
  }, [value]);

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
        id={`block-${blockID}`}
        href={`/note-rack/${blockID}`}
      >
        [[
        {' '}
        <span className="underline">
          {currentValue}
        </span>
        {' '}
        ]]
      </a>
    </Link>
  );
};

export default PageBlock;
