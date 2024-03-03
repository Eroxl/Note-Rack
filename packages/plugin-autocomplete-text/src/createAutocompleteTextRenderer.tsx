import React, { useState, useRef, useEffect } from 'react';
import createStyledTextRenderer from '@note-rack/plugin-styled-text';
import type { TextProperties } from '@note-rack/plugin-styled-text/createStyledTextRenderer';
import type InlineBlockRenderer from '@note-rack/plugin-styled-text/types/InlineBlockRenderer';
import type BlockRenderer from '@note-rack/editor/types/BlockRenderer';
import getCursorOffset from '@note-rack/editor/lib/helpers/caret/getCursorOffset';

/**
 * @see https://npmjs.com/package/@note-rack/plugin-styled-text
 * @see https://npmjs.com/package/@note-rack/editor
 */
const createAutocompleteTextRenderer = (
  generateAutocomplete: (editorText: string) => Promise<string>,
  autocompleteComponent: InlineBlockRenderer,
  style: React.CSSProperties,
  className: string,
  inlineBlocks: Record<string, InlineBlockRenderer>
) => {
  const TextRenderer = createStyledTextRenderer(
    undefined,
    undefined,
    inlineBlocks,
  );

  const AutocompleteTextRenderer: BlockRenderer<TextProperties> = (props) => {
    const {
      mutations,
      editorRef,
    } = props;

    const [autocomplete, setAutocomplete] = useState<string | null>(null);

    const editableElement = useRef<HTMLSpanElement>(null);

    const handleAutocomplete = async () => {
      const editorText = editorRef.current?.textContent || '';

      const autocomplete = await generateAutocomplete(editorText);

      setAutocomplete(autocomplete);
    };

    return (
      <span
        ref={editableElement}
      >
        <TextRenderer
          {...props}
          mutations={{
            ...mutations,
            editBlock: (blockId, updatedProperties, updatedType) => {
              if (!editableElement.current) return;

              const cursorOffset = getCursorOffset(editableElement.current);

              if (cursorOffset === (updatedProperties?.text as string || '').length - 1) {
                handleAutocomplete();
              } else {
                setAutocomplete(null);
              }

              mutations.editBlock(blockId, updatedProperties, updatedType);
            }
          }}
        />
        {autocomplete && (
          autocompleteComponent({
            children: autocomplete,
          })
        )}
      </span>
    )
  }

  return AutocompleteTextRenderer;
}

export default createAutocompleteTextRenderer;