import React, { useState } from 'react';

import focusAddedBlock from '../lib/postEditorMutations/focusAddedBlock';
import focusRemovedBlock from '../lib/postEditorMutations/focusRemovedBlock';
import mutations from '../mutations';
import type BlockRenderer from '../types/BlockRenderer';
import type { InBlockMutations } from '../types/BlockRenderer';
import type BlockState from '../types/BlockState';
import type KeybindHandler from '../types/KeybindHandler';
import type RichTextKeybindHandler from '../types/RichTextKeybindHandler';
import BlockWrapper from './BlockWrapper';
import type RemoveFirstFromTuple from 'src/types/helpers/RemoveFirstFromTuple';
import getBlockById from 'src/lib/helpers/getBlockByID';
import focusElement from 'src/lib/helpers/focusElement';
import handlePotentialBlockChange from 'src/lib/handlePotentialBlockChange';

type EditorProps = {
  startingBlocks: BlockState[];

  renderers: {
    [type: string]: BlockRenderer<any>;
  }

  postMutations?: {
    [T in keyof typeof mutations]?: ((...args: Parameters<typeof mutations[T]>) => void)[]
  }

  keybinds?: KeybindHandler[]
  richTextKeybinds?: RichTextKeybindHandler[]
};

const Editor: React.FC<EditorProps> = (props) => {
  const { startingBlocks } = props;

  const [blocks, setBlocks] = useState(startingBlocks);

  const {
    renderers,
    postMutations,
    richTextKeybinds,
  } = props;

  const editorPostMutations: typeof postMutations = {
    addBlock: [focusAddedBlock],
    removeBlock: [focusRemovedBlock]
  }

  const editorMutations = Object.fromEntries(
    Object
      .entries(mutations)
      .map(([name, fn]) => {
        const mutation = (...args: any[]) => {
          // ~ Handle post mutations
          if (name === 'editBlock' && richTextKeybinds) {
            const didTypeChange = handlePotentialBlockChange(
              args,
              blocks,
              editorMutations,
              richTextKeybinds
            )

            if (didTypeChange) return;
          }

          setBlocks((blocks) => {
            // @ts-ignore
            return fn(blocks, ...args);
          })

          const mutationsToPerform = [
            ...postMutations?.[name as keyof typeof mutations] ?? [],
            ...editorPostMutations[name as keyof typeof mutations] ?? []
          ]

          mutationsToPerform?.forEach((mutation) => {
            // @ts-ignore
            mutation(blocks, ...args);
          });
        }

        return [name, mutation];
      })
  ) as InBlockMutations;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em"
      }}
    >
      {blocks.map((block) => {
        const { type, id } = block;

        const renderer = renderers[type];

        // ~ TODO: Throw an error here
        if (!renderer) return;

        return (
          <BlockWrapper
            block={block}
            mutations={editorMutations}
            key={id}
            blockRenderer={renderer}
          />
        )
      })}
    </div>
  );
};

export default Editor;
