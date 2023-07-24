import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import { Selectable, useSelectionCollector } from 'react-virtual-selection';

import BaseBlock from './blocks/BaseBlock';
import PageThumbnail from './pageCustomization/PageThumbnail';
import Title from './pageCustomization/Title';
import Icon from './blocks/Icon';
import { removeBlock } from '../lib/pages/updatePage';
import deletePage from '../lib/deletePage';
import PageContext from '../contexts/PageContext';
import isCaretAtBottom from '../lib/helpers/caret/isCaretAtBottom';
import isCaretAtTop from '../lib/helpers/caret/isCaretAtTop';
import focusElement from '../lib/helpers/focusElement';
import getLastLineLength from '../lib/helpers/getLastLineLength';
import getCursorOffset from '../lib/helpers/caret/getCursorOffset';
import findNextBlock, { getClosestBlock } from '../lib/helpers/findNextBlock';

const Editor = () => {
  const { pageData, setPageData } = useContext(PageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const isAllowedToEdit = pageData?.userPermissions.write;

  // -=- Setup Page Data -=-
  // ~ Get the page ID
  const { page } = useRouter().query;

  // -=- Setup Selection -=-
  const selectionData = useSelectionCollector('blocks');

  const generateAutocomplete = async (index: number) => {
    if (!editorRef.current) return;

    const textBefore = Array.from(editorRef.current.childNodes)
      .slice(Math.max(1, index - 10), index + 3)
      .map((node) => node.textContent)
      .join('\n');

    const completionEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/page/complete?context=${textBefore}`;

    const completionRequest = await fetch(completionEndpoint);

    const completion = await completionRequest.json();

    if (completion.message) {
      return completion.message;
    }
  };

  useEffect(() => {
    const handleCompletionRequest = (event: CustomEvent<{ index: number, eventID: string }>) => {
      generateAutocomplete(event.detail.index).then((completion) => {
        if (!completion) return;
          
        document.dispatchEvent(
          new CustomEvent('completion', { detail: {
            completion,
            blockID: pageData?.data[event.detail.index]._id,
            eventID: event.detail.eventID,
          } }),
        );
      });
    }

    document.addEventListener('completionRequest', handleCompletionRequest as EventListener);

    return () => {
      document.removeEventListener('completionRequest', handleCompletionRequest as EventListener);
    }
  }, [pageData]);

  useEffect(() => {
    const handleSelectionEvents = (event: KeyboardEvent) => {
      // ~ If the user is not pressing the backspace key, return
      if (event.key !== 'Backspace') return;

      // ~ Check if there is an element selected
      if (document.activeElement?.tagName === 'INPUT') return;

      // ~ Iterate over all the selected blocks
      for (let i = 0; i < selectionData.length; i += 1) {
        const {
          blockID,
          index,
          isBlockPage,
        } = selectionData[i] as {blockID: string, index: number, isBlockPage: boolean };

        // ~ If the block is a page, delete the page differently
        if (isBlockPage) {
          document.dispatchEvent(
            new CustomEvent('deletePage', { detail: { pageID: blockID } }),
          );
          deletePage(blockID);
        }

        // ~ Remove the block from the page
        removeBlock(index - i, [blockID], page as string, pageData, setPageData);

        document.removeEventListener('keydown', handleSelectionEvents);
      }
    };

    // ~ Add the event listener
    document.addEventListener('keydown', handleSelectionEvents);

    // ~ Remove the event listener, when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleSelectionEvents);
    };
  }, [selectionData]);

  /**
   * Handle the up and down arrow editor navigation.
   */
  useEffect(() => {
    const handleArrowNavigation = (event: KeyboardEvent) => {
      if (!isAllowedToEdit || !pageData) return;

      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

      event.preventDefault();

      const closestBlock = getClosestBlock(event.target as HTMLElement);

      if (!closestBlock) return;

      const blockIndex = parseInt(closestBlock.dataset.blockIndex);

      if (event.key === 'ArrowUp' && isCaretAtTop(closestBlock)) {
        if (blockIndex < 0) return;

        let previousBlock;

        // ~ If the block is the first block, focus the title
        previousBlock = findNextBlock(closestBlock, (start) => start - 1, pageData);

        if (!previousBlock) return;

        // ~ Get the offset of the caret in the previous block
        //   relative to the end of the block.
        const previousBlockOffset = (
          previousBlock.innerText.length
          - getLastLineLength(previousBlock)
          + getCursorOffset(closestBlock)
        );

        focusElement(
          previousBlock,
          previousBlockOffset,
        );
      } else if (event.key === 'ArrowDown' && isCaretAtBottom(closestBlock)) {
        // ~ If the block is the last block, do nothing.
        if (blockIndex === pageData.data.length - 1) return;

        let nextBlock = findNextBlock(closestBlock, (start) => start + 1, pageData);

        if (!nextBlock) return;

        // ~ Get the offset of the caret in the next block
        //   relative to the start of the block.
        const nextBlockOffset = (
          getCursorOffset(closestBlock)
          - closestBlock.innerText.length
          + getLastLineLength(closestBlock)
        );

        focusElement(
          nextBlock,
          nextBlockOffset,
        );
      };
    };

    document.addEventListener('keydown', handleArrowNavigation);

    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
    }
  }, [pageData]);

  if (!pageData) return null;

  // -=- Render -=-
  return (
    <Selectable
      accepts={isAllowedToEdit ? 'blocks' : ''}
      selectionClassName="bg-sky-300 opacity-20"
    >
      <div className="w-full h-full mt-10 overflow-y-auto print:m-0 print:p-0 overflow-x-clip no-scrollbar" id="main-editor">
        <div
          className="flex flex-col items-center w-full h-max bg-amber-50 dark:bg-zinc-700 print:dark:bg-white print:bg-white"
        >
          {/* ~ Render the page thumbnail */}
          <PageThumbnail colour={pageData.style.colour} page={page as string} />
          {/* ~ Render the main interactive editor */}
          <div
            className="flex flex-col w-full max-w-4xl gap-3 px-20 pb-56 mx-auto break-words select-none print:p-0 text-zinc-700 dark:text-amber-50 print:dark:text-zinc-700 h-max editor"
            ref={editorRef}
          >
            {/* ~ Render the page icon */}
            <Icon
              page={page as string}
              icon={pageData.style.icon}
            />
            {/* ~ Render the title */}
            <Title
              page={page as string}
              index={0}
              title={pageData.style.name}
            />

            {/* ~ Render the blocks */}
            {pageData.data.map((block, index) => (
              <BaseBlock
                blockType={block.blockType}
                blockID={block._id}
                index={index}
                key={`${block._id}-${page}`}
                page={page as string}
                properties={block.properties}
                children={block.children}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </Selectable>
  );
};

export default Editor;
