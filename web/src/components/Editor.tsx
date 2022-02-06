import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { addBlockAtIndex, removeBlock } from '../lib/updatePage';
import BaseBlock from './blocks/BaseBlock';

interface pageDataInterface {
  status: string,
  message: {
    blockID: string,
    blockType: string,
    properties: Record<string, unknown>,
    style: Record<string, unknown>,
  }[],
}

const Editor = (
  props: {
    pageData: pageDataInterface,
    setPageData: Dispatch<SetStateAction<pageDataInterface | Record<string, unknown>>>
  },
) => {
  const { pageData, setPageData } = props;

  const router = useRouter();
  const { page } = router.query;

  return (
    <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
      <div className="h-max w-full bg-amber-50 flex flex-col items-center">
        <div className="bg-blue-300 h-72 w-full -mb-10" />
        <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24 editor">
          {(pageData as pageDataInterface).message.map((block, index) => (
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
                  pageData as pageDataInterface,
                  setPageData,
                );
              }}
              removeBlock={() => {
                removeBlock(
                  index,
                  block.blockID,
                  page as string,
                  pageData as pageDataInterface,
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
