import React, { useContext, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { addBlockAtIndex, moveBlock } from '../../lib/pages/updatePage';
import type { PermanentEditableText } from '../../lib/types/blockTypes';
import editStyle from '../../lib/pages/editStyle';
import PageContext from '../../contexts/PageContext';

interface TitleProps extends PermanentEditableText {
  title: string,
}

const Title = (props: TitleProps) => {
  const {
    page,
    index,
    title,
  } = props;

  const { pageData, setPageData } = useContext(PageContext);
  const titleRef = useRef<HTMLSpanElement>(null);

  const isAllowedToEdit = pageData?.userPermissions.admin;

  const onTitleChanged = (text: string) => {
    if (!isAllowedToEdit) return;

    editStyle({ name: text }, page);
  };

  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: async (item) => {
      const {
        index: itemIndex,
        blockID: itemBlockID,
      } = item as {
        index: number,
        blockID: string,
      };
      await moveBlock(
        [itemBlockID],
        itemIndex,
        index - 1,
        page,
        pageData,
        setPageData,
      );
    },
  }), [index]);

  return (
    <div
      ref={drop}
      className="relative flex flex-col" id="page-title">
      <span
        className="text-5xl font-bold outline-none empty:before:content-['Untitled'] empty:before:opacity-30 pb-3"
        contentEditable={isAllowedToEdit}
        role="textbox"
        tabIndex={0}
        ref={titleRef}
        suppressContentEditableWarning
        onKeyDown={
          (e) => {
            if (e.code === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
              addBlockAtIndex(index, page, pageData, setPageData);
            }

            setTimeout(() => {
              if (!titleRef.current) return;

              onTitleChanged(titleRef.current.innerText);
            }, 0);
          }
        }
        onInput={
          (e) => {
            document.dispatchEvent(new CustomEvent('changePageTitle', { detail: { newTitle: e.currentTarget.innerText } }));
          }
        }
        id="page-title-text"
        data-block-index={index-1}
      >
        {title}
      </span>
      <div className="
        w-full h-0.5 bg-black opacity-5 rounded-md
        dark:bg-white
        print:bg-opacity-0
        print:relative print:overflow-hidden
        print:before:border-[999px]
        print:before:border-black
        "
      />
      { hovered && <div className="absolute w-full h-0.5 bg-blue-400 -bottom-2 print:hidden" /> }
    </div>
  );
};

export default Title;
