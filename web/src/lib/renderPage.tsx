import React from 'react';

import Items from '../components/page/Items';
import updateServer from './updateServer';

const RenderItem = (itemData: {
    blockType: string,
    properties: any,
    style: any,
    blockID: string,
  }, page: string) => {
  const {
    blockType,
    properties,
    blockID,
  } = itemData;

  switch (blockType) {
    case 'page-icon':
      return <Items.Icon icon={properties.value} page={page} blockID={blockID} />;
    case 'page-title':
      return <Items.Title titleString={properties.value} page={page} blockID={blockID} />;
    default:
      return (
        <p
          className="min-h-[1.2em] outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={
            (e) => {
              updateServer(
                blockID,
                undefined,
                { value: e.currentTarget.innerText },
                undefined,
                page,
              );
            }
          }
        >
          {properties.value}
        </p>
      );
  }
};

const RenderPage = (
  pageData: { blockType: string, properties: any, style: any, blockID: string }[],
  page: string,
) => pageData.map((item) => RenderItem(item, page));

export default RenderPage;
