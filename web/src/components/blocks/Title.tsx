/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';

import TitleBreaker from './TitleBreaker';
import { addBlockAtIndex, moveBlock } from '../../lib/pages/updatePage';
import type { PermanentEditableText } from '../../lib/types/blockTypes';
import editStyle from '../../lib/pages/editStyle';
import { isCaretAtBottom, isCaretAtTop } from '../../lib/helpers/caretHelpers';
import handleKeyDown from '../../lib/blockNavigation/handleKeyDown';
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
    <div className="relative flex flex-col" id="page-title">
      <span
        className="text-5xl font-bold outline-none empty:before:content-['Untitled'] empty:before:opacity-30 pb-3"
        contentEditable={isAllowedToEdit}
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
            } else if (e.code === 'ArrowDown' && isCaretAtBottom(e.currentTarget)) {
              handleKeyDown(
                e,
                index-1,
                pageData,
              )
            } else if (e.code === 'ArrowUp' && isCaretAtTop(e.currentTarget)) {
              e.preventDefault();
            }
          }
        }
        onInput={
          (e) => {
            document.dispatchEvent(new CustomEvent('changePageTitle', { detail: { newTitle: e.currentTarget.innerText } }));
          }
        }
        data-cy="page-title"
      >
        {title}
      </span>
      <TitleBreaker />
      { hovered && <div className="absolute w-full h-0.5 bg-blue-400 -bottom-2 print:hidden" /> }
    </div>
  );
};

export default Title;
