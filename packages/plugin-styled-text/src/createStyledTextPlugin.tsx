import React, { useRef } from 'react';
import type Plugin from '@note-rack/editor/types/Plugin';

import type InlineBlockRenderer from './types/InlineBlockRenderer';
import createStyledTextRenderer from './createStyledTextRenderer';

export type TextProperties = {
  text: string;
  style?: {
    type: string[],
    start: number,
    end: number,
  }[],
};

/**
 * Create a styled text block plugin
 * @param type: The type of the block
 * @param style The style to apply to the text
 * @param className The class name to apply to the text
 * @param inlineBlocks The inline blocks that the text can contain
 * @returns The styled text block renderer plugin
 * 
 * @see https://npmjs.com/package/@note-rack/editor/
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * 
 * import { Editor } from '@note-rack/editor';
 * import { createStyledTextPlugin } from '@note-rack/plugin-styled-text';
 * 
 * const redTextPlugin = createStyledTextPlugin('red-text', { color: 'red' });
 * 
 * const RedTextExample: React.FC = () => (
 *  <Editor
 *    startingBlocks={[
 *      {
 *        id: 'example-block',
 *        type: 'red-text',
 *        properties: {
 *          text: 'Red text',
 *        }
 *      },
 *    ]}
 *    plugins={[
 *      redTextPlugin,
 *    ]}
 *  />
 * );
 * 
 * ReactDOM.render(
 *   <RedTextExample />,
 *   document.getElementById('root')
 * );
 * ```
 */
const createStyledTextPlugin = (
  type: string,
  style?: React.CSSProperties,
  className?: string,
  inlineBlocks?: {
    [type: string]: InlineBlockRenderer,
  },
): Plugin  => (
  {
    renderers: {
      [type]: createStyledTextRenderer(
        style,
        className,
        inlineBlocks
      ),
    }
  }
);

export default createStyledTextPlugin;
