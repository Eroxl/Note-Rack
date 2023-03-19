/* eslint-disable react/no-children-prop */
/* eslint-disable no-underscore-dangle */
import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import { Selectable, useSelectionCollector } from 'react-virtual-selection';

import BaseBlock from './blocks/BaseBlock';
import PageThumbnail from './pageCustomization/PageThumbnail';
import Title from './blocks/Title';
import Icon from './blocks/Icon';
import { removeBlock } from '../lib/pages/updatePage';
import deletePage from '../lib/deletePage';
import PageContext from '../contexts/PageContext';

const Editor = () => {
  const { pageData, setPageData } = useContext(PageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAllowedToEdit = pageData?.userPermissions.write;

  // -=- Setup Page Data -=-
  // ~ Get the page ID
  const { page } = useRouter().query;

  // -=- Setup Selection -=-
  const selectionData = useSelectionCollector('blocks');
  

  useEffect(() => {
    const handleSelectionEvents = (event: KeyboardEvent) => {
      // ~ If the user is not pressing the backspace key, return
      if (event.key !== 'Backspace') return;
      
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
            new CustomEvent('deletePage', { detail: { pageID: blockID } })
          );
          deletePage(blockID);
        }

        // ~ Remove the block from the page
        removeBlock(index - i, [blockID], page as string, pageData, setPageData);
      }
    };

    // ~ Add the event listener
    document.addEventListener('keydown', handleSelectionEvents);

    // ~ Remove the event listener, when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleSelectionEvents);
    };
  }, [selectionData]);

  if (!pageData) return null;

  // -=- Render -=-
  return (
    <Selectable
      accepts={isAllowedToEdit ? "blocks" : ""}
      selectionClassName="bg-sky-300 opacity-20"
    >
      <div className="w-full h-full mt-10 overflow-y-auto print:m-0 pl-52 print:p-0 overflow-x-clip no-scrollbar" id="main-editor">
        <div
          className="flex flex-col items-center w-full h-max bg-amber-50 dark:bg-zinc-700 print:dark:bg-white print:bg-white bg-"
        >
          {/* ~ Render the page thumbnail */}
          <PageThumbnail colour={pageData.style.colour} page={page as string} />
          {/* ~ Render the main interactive editor */}
          <div
            className="flex flex-col w-full max-w-4xl gap-3 px-20 pb-56 mx-auto break-words select-none print:p-0 text-zinc-700 dark:text-amber-50 print:dark:text-zinc-700 h-max editor"
          >
            {/* ~ Render the page icon */}
            <Icon
              page={page as string}
              icon={pageData!.style.icon}
            />
            {/* ~ Render the title */}
            <Title
              page={page as string}
              index={0}
              title={pageData!.style.name}
            />

            {/* ~ Render the blocks */}
            {pageData.data.map((block, index) => (
              <BaseBlock
                blockType={block.blockType}
                blockID={block._id}
                index={index}
                key={block._id}
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
