import React from 'react';

import parseInlineBlocks from './parseInlineBlocks';
import InlineTypes from '../../../constants/InlineTypes';

/** 
 * This function takes in a string and returns a list of react nodes that
 * represent the string. The string can contain inline blocks, which are
 * represented by a keybind.
 * 
 * @param text The text to parse.
 * @returns An array of react nodes.
 * 
 * @example 
 * const text = "Hello *world*!";
 * const nodes = renderInlineBlocks(text);
 * 
 * console.log(nodes);
 * // [
 * //  "Hello ",
 * //  <span className="italic">world</span>,
 * //  "!"
 * // ]
 */
const renderInlineBlocks = (text: string) => {
  const parsedText = parseInlineBlocks(text);

  const recursiveRender = (types: string[], value: string): React.ReactNode => {
    const blockType = types.shift();

    const Block = InlineTypes[blockType || ''] || React.Fragment;

    const children = types.length > 0
      ? recursiveRender(types, value)
      : value;

    return React.createElement(Block, {
      children,
    });
  };

  return parsedText.map((block) => recursiveRender(block.types, block.value));
};

export default renderInlineBlocks;
