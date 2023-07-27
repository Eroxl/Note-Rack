import { sanitize } from "dompurify";
import { renderToString } from 'react-dom/server';

import InlineTextStyles from "../../constants/InlineTextStyles";
import type { EditableText } from "../../types/blockTypes";

const END_OF_LINE_REGEX = /\n$/g;

/**
 * Render a single inline block to a HTML string
 * @param value The text value
 * @param style The style of the text
 * @returns The rendered inline block as a HTML string
 */
const renderInlineBlock = (
  value: string,
  style: (keyof typeof InlineTextStyles)[],
): string => {
  const styleString = style.map((type) => InlineTextStyles[type]).join(' ');
  const styleData = JSON.stringify(style);

  return renderToString(
    <span
      className={styleString}
      data-inline-type={styleData}
    >
      {value}
    </span>
  );
};

/**
 * Render the inline blocks of a text block
 * @param value The text value
 * @param style The style of the text
 * @returns The rendered inline blocks as a HTML string
 */
const renderInlineBlocks = (
  value: string,
  style: EditableText['properties']['style'],
  completion?: string | null,
): string => {
  if (!style) return sanitize(value);

  const blocks: (JSX.Element | string)[] = [];

  let start = 0;

  style.forEach((block) => {
    const inlineText = value.substring(block.start, block.end);

    if (start < block.start) {
      const preRegexText = value.substring(start, block.start);

      blocks.push(preRegexText);
    }

    blocks.push(
      renderInlineBlock(inlineText, block.type)
    );

    start = block.end;
  });

  // ~ If there is trailing text, add it to the end
  if (start < value.length) {
    const trailingText = value
      .substring(start)
      // ~ Ensure the trailing newline is after the completion
      .replace(END_OF_LINE_REGEX, '');

    blocks.push(trailingText);
  }

  if (completion) {
    const completionBlock = (
      <span
        className="text-amber-50/50"
        contentEditable={false}
      >
        {completion}
      </span>
    )
    
    blocks.push(
      renderToString(completionBlock)
    );
  }

  blocks.push('<br />')

  return sanitize(blocks.join(''), {
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class', 'data-inline-type', 'contenteditable'],
  });
};

export default renderInlineBlocks;
