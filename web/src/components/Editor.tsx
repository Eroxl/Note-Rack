/* eslint-disable react/no-children-prop */
/* eslint-disable no-underscore-dangle */
import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import type PageDataInterface from '../types/pageTypes';
import BaseBlock from './blocks/BaseBlock';
import PageThumbnail from './pageCustomization/PageThumbnail';
import Title from './blocks/Title';
import Icon from './blocks/Icon';

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
    <div className="w-full h-full mt-10 overflow-y-auto print:m-0 pl-52 print:p-0 overflow-x-clip no-scrollbar">
      <div className="flex flex-col items-center w-full h-max bg-amber-50 dark:bg-zinc-700 print:dark:bg-white print:bg-white">
        <PageThumbnail colour={pageData.message.style.colour} page={page as string} />
        <div className="flex flex-col w-full max-w-4xl gap-3 px-20 pb-56 mx-auto break-words print:p-0 text-zinc-700 dark:text-amber-50 print:dark:text-zinc-700 h-max editor">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
