import React from 'react';

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
  );
};

export default PageBlock;
