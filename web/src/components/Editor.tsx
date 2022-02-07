import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { addBlockAtIndex, removeBlock } from '../lib/updatePage';
import PageDataInterface from '../lib/types/pageTypes';
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

  return (
    <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
      <div className="h-max w-full bg-amber-50 flex flex-col items-center">
        <div className="bg-blue-300 h-72 w-full -mb-10" />
        <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-56 editor">
          {(pageData as PageDataInterface).message.map((block, index) => (
            <BaseBlock
              blockType={block.blockType}
              blockID={block.blockID}
              key={block.blockID}
              page={page as string}
              properties={block.properties}
              style={block.style}
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
