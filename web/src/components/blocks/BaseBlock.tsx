import React, { useState } from 'react';

interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: any,
  style: any,
  page: string,
}

const BaseBlock = (props: BaseBlockProps) => {
  const {
    blockType,
    blockID,
    properties,
    style,
    page,
  } = props;

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

};

export default BaseBlock;
