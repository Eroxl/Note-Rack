/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';

import TitleBreaker from './TitleBreaker';
import { addBlockAtIndex } from '../../lib/updatePage';
import type { PermanentEditableText } from '../../types/blockTypes';
import editStyle from '../../lib/editStyle';

interface TitleProps extends PermanentEditableText {
  title: string,
}

const Title = (props: TitleProps) => {
  const {
    page,
    title,
    pageData,
    setPageData,
  } = props;

  const onTitleChanged = (text: string) => {
    // TODO:EROXL: Refactor this
    editStyle({ name: text }, page);
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
              addBlockAtIndex(2, page, pageData, setPageData);
            }
          }
        }
      >
        {title}
      </span>
      <TitleBreaker />
    </>
  );
};

export default Title;
