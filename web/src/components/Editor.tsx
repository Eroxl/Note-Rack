import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { addBlockAtIndex, removeBlock } from '../lib/updatePage';
import PageDataInterface from '../types/pageTypes';
import BaseBlock from './blocks/BaseBlock';

const Editor = (
  props: {
    pageData: PageDataInterface,
    setPageData: Dispatch<SetStateAction<PageDataInterface | Record<string, unknown>>>
  },
) => {
  const { pageData, setPageData } = props;

  const router = useRouter();
  const { page } = router.query;

  const colourData = pageData.message.style.colour;
  const pageColourStyles = {
    backgroundColor: `#${colourData.r.toString(16)}${colourData.g.toString(16)}${colourData.b.toString(16)}`,
  };

  return (
    <div className="w-full h-full mt-10 overflow-y-auto pl-52 overflow-x-clip no-scrollbar">
      <div className="flex flex-col items-center w-full h-max bg-amber-50 dark:bg-zinc-700">
        <div className="w-full -mb-10 h-72" style={pageColourStyles} />
        <div className="flex flex-col w-full max-w-4xl gap-3 px-20 pb-56 mx-auto break-words text-zinc-700 dark:text-amber-50 h-max editor">
          {(pageData as PageDataInterface).message.data.map((block, index) => (
            <BaseBlock
              blockType={block.blockType}
              blockID={block.blockID}
              key={block.blockID}
              page={page as string}
              properties={block.properties}
              style={block.style}
              index={index}
              addBlockAtIndex={() => {
                addBlockAtIndex(
                  index + 1,
                  page as string,
                  pageData as PageDataInterface,
                  setPageData,
                );
              }}
              removeBlock={() => {
                removeBlock(
                  index,
                  block.blockID,
                  page as string,
                  pageData as PageDataInterface,
                  setPageData,
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
