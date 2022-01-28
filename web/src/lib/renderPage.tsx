import React from 'react';

import Items from '../components/page/Items';

const RenderItem = (itemData: { blockType: string, properties: any, style: any }) => {
  const { blockType, properties, style } = itemData;

  switch (blockType) {
    case 'page-icon':
      return <Items.Icon icon={properties.value} />;
    case 'page-title':
      return <Items.Title titleString={properties.value} />;
    default:
      return <p className="">{properties.value}</p>;
  }
};

const RenderPage = (
  pageData: { blockType: string, properties: any, style: any }[],
) => pageData.map(RenderItem);

export default RenderPage;
