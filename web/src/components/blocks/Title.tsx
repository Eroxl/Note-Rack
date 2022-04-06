/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';
import { useDrop } from 'react-dnd';

import TitleBreaker from './TitleBreaker';
import { addBlockAtIndex } from '../../lib/pages/updatePage';
import type { PermanentEditableText } from '../../types/blockTypes';
import editStyle from '../../lib/pages/editStyle';

interface TitleProps extends PermanentEditableText {
  title: string,
}

const Title = (props: TitleProps) => {
  const {
    page,
    index,
    title,
    pageData,
    setPageData,
  } = props;

  const onTitleChanged = (text: string) => {
    editStyle({ name: text }, page);
  };

  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: (item) => {
      const { index: itemIndex } = item as { index: number };
      const pageDataCopy = { ...pageData };

      pageDataCopy.message.data.splice(index, 0, pageData.message.data[itemIndex]);
      pageDataCopy.message.data.splice(itemIndex + 1, 1);
      setPageData(pageDataCopy);
    },
  }), [index]);

  return (
    <div className="relative flex flex-col">
      <span
        className="text-5xl font-bold outline-none empty:before:content-['Untitled'] empty:before:opacity-30 pb-3"
        contentEditable
        role="textbox"
        tabIndex={0}
        ref={drop}
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
              addBlockAtIndex(index, page, pageData, setPageData);
            }
          }
        }
        onInput={
          (e) => {
            document.dispatchEvent(new CustomEvent('changePageTitle', { detail: { newTitle: e.currentTarget.innerText } }));
          }
        }
      >
        {title}
      </span>
      <TitleBreaker />
      { hovered && <div className="absolute w-full h-0.5 bg-blue-400 -bottom-2 print:hidden" /> }
    </div>
  );
};

export default Title;
