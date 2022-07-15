/* eslint-disable react/no-children-prop */
/* eslint-disable no-underscore-dangle */
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { Selectable, useSelectionCollector } from 'react-virtual-selection';

import type PageDataInterface from '../types/pageTypes';
import BaseBlock from './blocks/BaseBlock';
import PageThumbnail from './pageCustomization/PageThumbnail';
import Title from './blocks/Title';
import Icon from './blocks/Icon';
import { removeBlock } from '../lib/pages/updatePage';

interface EditorProps {
  pageData: PageDataInterface,
  setPageData: Dispatch<SetStateAction<PageDataInterface | Record<string, unknown>>>
}

const Editor = (props: EditorProps) => {
  const { pageData, setPageData } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { page } = useRouter().query;

  const selectionData = useSelectionCollector('blocks');

  useEffect(() => {
    const handleSelectionEvents = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        for (let i = 0; i < selectionData.length; i += 1) {
          const {
            blockID,
            index,
            isBlockPage,
          } = selectionData[i] as {blockID: string, index: number, isBlockPage: boolean };

          if (!isBlockPage) {
            removeBlock(index - i, [blockID], page as string, pageData, setPageData);
          } else {
            // TODO: Remove the page and subpages
          }
        }
      }
    };

    document.addEventListener('keydown', handleSelectionEvents);

    return () => {
      document.removeEventListener('keydown', handleSelectionEvents);
    };
  }, [selectionData]);

  return (
    <Selectable
      accepts="blocks"
      selectionClassName="bg-sky-300 opacity-20"
    >
      <div className="w-full h-full mt-10 overflow-y-auto print:m-0 pl-52 print:p-0 overflow-x-clip no-scrollbar" id="main-editor">
        <div
          className="flex flex-col items-center w-full h-max bg-amber-50 dark:bg-zinc-700 print:dark:bg-white print:bg-white bg-"
        >
          <PageThumbnail colour={pageData.message.style.colour} page={page as string} />
          <div
            className="flex flex-col w-full max-w-4xl gap-3 px-20 pb-56 mx-auto break-words select-none print:p-0 text-zinc-700 dark:text-amber-50 print:dark:text-zinc-700 h-max editor"
          >
            <Icon
              page={page as string}
              icon={pageData.message.style.icon}
            />
            <Title
              page={page as string}
              pageData={pageData}
              index={0}
              setPageData={setPageData}
              title={pageData.message.style.name}
            />

            {(pageData as PageDataInterface).message.data.map((block, index) => (
              <BaseBlock
                blockType={block.blockType}
                blockID={block._id}
                index={index}
                key={block._id}
                page={page as string}
                properties={block.properties}
                children={block.children}
                pageData={pageData}
                setPageData={setPageData}
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
