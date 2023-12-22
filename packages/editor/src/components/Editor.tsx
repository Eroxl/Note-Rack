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
          if (name === 'editBlock') {
            const [
              blockId,
              updatedProperties,
            ] = args as RemoveFirstFromTuple<Parameters<typeof mutations.editBlock>>;

            if(updatedProperties && typeof updatedProperties.text === 'string') {

              const block = blocks.find((block) => block.id === blockId);

              let found = false;

              richTextKeybinds?.forEach((keybind) => {
                const {
                  regex,
                  handler
                } = keybind;

                const {
                  text
                } = updatedProperties as { text: string };

                const regexSearch = regex.exec(text);

                if (!regexSearch || !block) return;

                found = true;

                handler(editorMutations, block, regexSearch);
              });

              if (found) return;
            }
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

  const renderBlock = (block: BlockState) => {
    const {
      id,
      properties,
      type
    } = block;

    const BlockRenderer = renderers[type];

    if (!BlockRenderer) return;

    return (
      <BlockWrapper
        key={id}
        id={id}
        type={type}
        properties={properties}

        mutations={editorMutations}
      >
        <BlockRenderer
          id={id}
          type={type}
          properties={properties}

          mutations={editorMutations}
        />
      </BlockWrapper>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em"
      }}
    >
      {blocks.map(renderBlock)}
    </div>
  );
};

export default Editor;
