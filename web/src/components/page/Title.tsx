import React from 'react';

import TitleBreaker from './TitleBreaker';
import updateServer from '../../lib/updateServer';

const Title = (props: { titleString: string, page: string, blockID: string }) => {
  const { titleString, page, blockID } = props;

  const onTitleChanged = (text: string) => {
    updateServer(blockID, undefined, { value: text }, undefined, page);
  };

  return (
    <>
      <h1 className="text-5xl font-bold outline-none" contentEditable onBlur={(e) => onTitleChanged(e.currentTarget.innerText)} suppressContentEditableWarning>{titleString}</h1>
      <TitleBreaker />
    </>
  );
};

export default Title;
