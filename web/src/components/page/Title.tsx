/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';

import TitleBreaker from './TitleBreaker';
import updateServer from '../../lib/updateServer';

const Title = (props: { titleString: string, page: string, blockID: string }) => {
  const { titleString, page, blockID } = props;

  const onTitleChanged = (text: string) => {
    updateServer(blockID, undefined, { value: text !== '' ? text : 'Untitled' }, undefined, page);
  };

  return (
    <>
      <h1
        className="text-5xl font-bold outline-none"
        contentEditable
        role="textbox"
        onBlur={
          (e) => {
            onTitleChanged(e.currentTarget.innerText);
            if (e.currentTarget.textContent === '') {
              e.currentTarget.innerHTML = 'Untitled';
            }
          }
        }
        suppressContentEditableWarning
        onKeyDown={
          (e) => {
            if (e.code === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }
      }
      >
        {titleString}
      </h1>
      <TitleBreaker />
    </>
  );
};

export default Title;
