import React, { useEffect, useState } from 'react';

import type Block from '../types/Block';
import type EditorState from '../types/EditorState';
import type EditorEvent from '../types/EditorEvent';
import type EditorEventEmitters from '../types/EditorEventEmitters';
import createChangeBlockDataHandler from '../lib/editorEventEmitters/createChangeBlockDataHandler';
import createChangeBlockTypeHandler from '../lib/editorEventEmitters/createChangeBlockTypeHandler';
import createRemoveBlockHandler from '../lib/editorEventEmitters/createRemoveBlockHandler';
import createInsertBlock from '../lib/editorEventEmitters/createInsertBlock';
import isCaretAtBottom from '../helpers/caret/isCaretAtBottom';
import isCaretAtTop from '../helpers/caret/isCaretAtTop';
import getCaretOffset from '../helpers/caret/getCaretOffset';
import getLastLineLength from '../helpers/getLastLineLength';
import focusElement from '../helpers/focusElement';

/**
 * The editor component.
 * @param props The editor's props.
 * @returns The rendered editor.
 */
const Editor = (props: EditorState) => {
  const {
    blockTypes,
    data,
    readOnly,
    onChange,
  } = props;

  const [currentData, setCurrentData] = useState<Block[]>([]);

  const editorRef = React.useRef<HTMLDivElement>(null);

  /**
   * Handle the up and down arrow editor navigation.
   */
  useEffect(() => {
    const getClosestBlock = (
      element: HTMLElement | null
    ): (HTMLElement & { dataset: { blockIndex: string, blockId: String } }) | null => {
      if (!element) return null;

      if (element.dataset.blockId && element.dataset.blockIndex) {
        return element as (HTMLElement & { dataset: { blockIndex: string, blockId: String } });
      }

      return getClosestBlock(element.parentElement);
    };

    const findNextBlock = (
      element: HTMLElement | null,
      iterator: (start: number) => number,
    ): HTMLElement | undefined => {
      if (!element || !editorRef.current) return;

      const block = getClosestBlock(element);

      if (!block) return;

      const blockIndex = parseInt(block.dataset.blockIndex);

      const nextBlockID = currentData[iterator(blockIndex)]?._id;

      const nextBlock = editorRef.current.querySelector(`[data-block-id="${nextBlockID}"]`) as HTMLElement;

      if (!nextBlock) return;

      if (!nextBlock.dataset.blockIndex) return findNextBlock(nextBlock, iterator);

      return nextBlock;
    }

    const handleArrowNavigation = (event: KeyboardEvent) => {
      if (readOnly) return;

      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

      event.preventDefault();

      const closestBlock = getClosestBlock(event.target as HTMLElement);

      if (!closestBlock) return;

      const blockIndex = parseInt(closestBlock.dataset.blockIndex);

      if (event.key === 'ArrowUp' && isCaretAtTop(closestBlock)) {
        // ~ If the block is the first block, do nothing.
        if (blockIndex === 0) return;

        let previousBlock = findNextBlock(closestBlock, (start) => start - 1);

        if (!previousBlock) return;

        // ~ Get the offset of the caret in the previous block
        //   relative to the end of the block.
        const previousBlockOffset = (
          previousBlock.innerText.length
          - getLastLineLength(previousBlock)
          + getCaretOffset(closestBlock)
        );

        focusElement(
          previousBlock,
          previousBlockOffset,
        );
      } else if (event.key === 'ArrowDown' && isCaretAtBottom(closestBlock)) {
        // ~ If the block is the last block, do nothing.
        if (blockIndex === currentData.length - 1) return;

        let nextBlock = findNextBlock(closestBlock, (start) => start + 1);

        if (!nextBlock) return;

        // ~ Get the offset of the caret in the next block
        //   relative to the start of the block.
        const nextBlockOffset = (
          getCaretOffset(closestBlock)
          - closestBlock.innerText.length
          + getLastLineLength(closestBlock)
        );

        focusElement(
          nextBlock,
          nextBlockOffset,
        );
      };
    };

    document.addEventListener('keydown', handleArrowNavigation);

    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
    }
  }, [currentData]);

  /**
   * Set the editor's data to the given data.
   */
  useEffect(() => {
    if (!data) return;

    setCurrentData(data);
  }, [data]);

  /**
   * Setup event listeners for handling editor events from external sources.
   */
  useEffect(() => {
    /**
     * Handle an editor event from an external source.
     * @param event The event to handle.
     */
    const handleExternalEvent = ((event: CustomEvent<EditorEvent[]>) => {
      event.stopPropagation();

      handleEditorEvent(event.detail);
    }) as EventListener;

    document.body.addEventListener('editorEvent', handleExternalEvent);

    return () => {
      document.body.removeEventListener('editorEvent', handleExternalEvent);
    }
  }, []);

  const editorEventEmitters: EditorEventEmitters = {
    insertBlock: createInsertBlock(setCurrentData),
    removeBlock: createRemoveBlockHandler(setCurrentData),
    changeBlockType: createChangeBlockTypeHandler(setCurrentData),
    changeBlockData: createChangeBlockDataHandler(setCurrentData),
  };

  /**
   * Handle an editor event and mutate the editor's state.
   * @param events The events to handle.
   * 
   * @throws Error if any of the events are invalid
   *  @see insertBlock
   *  @see removeBlock
   *  @see changeBlockType
   *  @see changeBlockData
   */
  const handleEditorEvent = (events: EditorEvent[]) => {
    events.forEach((event) => {
      switch (event.type) {
        case 'addition':
          editorEventEmitters.insertBlock(event.block, event.index);
          break;

        case 'deletion':
          editorEventEmitters.removeBlock(event.index, event.blockID);
          break;

        case 'blockTypeChange':
          editorEventEmitters.changeBlockType(event.index, event.newBlockType, event.blockID);
          break;

        case 'blockDataChange':
          editorEventEmitters.changeBlockData(event.index, event.events, event.blockID);
          break;

      }
    });

    if (onChange) {
      onChange(events);
    }
  };

  /**
   * Render a given block into a React node.
   * @param block The block to render.
   * @returns The rendered block.
   */
  const renderBlock = (block: Block, index: number): React.ReactNode => {
    const BlockComponent = blockTypes?.[block.blockType].component;

    if (!BlockComponent) {
      console.error(`Block type "${block.blockType}" not found.`);
      return null;
    }

    return (
      <BlockComponent
        key={block._id}
        block={block}
        index={index}
        readOnly={readOnly}
        onChange={handleEditorEvent}
        editorEventEmitters={editorEventEmitters}
      />
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',

        width: '100%',
        maxWidth: '56rem',

        height: 'max-content',

        gap: '0.75rem',
        
        paddingLeft: '5rem',
        paddingRight: '5rem',
        paddingBottom: '14rem',

        marginLeft: 'auto',
        marginRight: 'auto',

        overflowWrap: 'break-word',
        userSelect: 'none',

        color: '#3f3f46',
        backgroundColor: '#f9fafb',

        wordBreak: 'break-word',
      }}
      ref={editorRef}
    >
      { currentData.map(renderBlock) }
    </div>
  );
};

export default Editor;
