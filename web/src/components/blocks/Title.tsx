/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';

import TitleBreaker from './TitleBreaker';
import { updateServer } from '../../lib/pageController';

const Title = (
  props: {
    properties: { value: string },
    blockID: string,
    page: string,
    index: number,
    addBlockAtIndex: (index: number) => null,
  },
) => {
  const {
    page,
    blockID,
    properties,
    index,
    addBlockAtIndex,
  } = props;
  const { value: titleString } = properties;

  const onTitleChanged = (text: string) => {
    updateServer(blockID, undefined, { value: text }, undefined, page);
  };

  return (
    <>
      <span
        className="text-5xl font-bold outline-none empty:before:content-['Untitled'] empty:before:opacity-30"
        contentEditable
        role="textbox"
        tabIndex={0}
        onBlur={
          (e) => {
            onTitleChanged(e.currentTarget.innerText);
          }
        }
        suppressContentEditableWarning
        onKeyDown={
          (e) => {
            if (e.code === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
              addBlockAtIndex(index + 1);
            }
          }
        }
      >
        {titleString}
      </span>
      <TitleBreaker />
    </>
  );
};

export default Title;
