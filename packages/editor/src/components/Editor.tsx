import React, { useState } from 'react';

import mutations from '../mutations';
import type BlockState from '../types/BlockState';
import type BlockRenderer from '../types/BlockRenderer';
import type Keybind from '../types/Keybind';
import type { InBlockMutations } from '../types/BlockRenderer';
import BlockWrapper from './BlockWrapper';

type BindHandler = (
  mutations: InBlockMutations,
) => void;

type EditorProps = {
  startingBlocks: BlockState[];

  renderers: {
    [type: string]: BlockRenderer<any>;
  }

  postMutations?: {
    [T in keyof typeof mutations]?: ((...args: Parameters<typeof mutations[T]>) => void)[]
  }

  keybinds?: {
    keybind: Keybind,
    activeBlock: BlockState,
    handler: BindHandler
  }[]

  richTextKeybinds?: {
    regex: RegExp,
    activeBlock: BlockState,
    handler: BindHandler
  }[]
};

const Editor: React.FC<EditorProps> = (props) => {
  const { startingBlocks } = props;

  const [blocks, setBlocks] = useState(startingBlocks);

  const { renderers, postMutations } = props;

  const editorMutations = Object.fromEntries(
    Object
      .entries(mutations)
      .map(([name, fn]) => {
        const mutation = (...args: any[]) => {

          setBlocks((blocks) => {
            // @ts-ignore
            return fn(blocks, ...args);
          })

          const mutationsToPerform = postMutations?.[name as keyof typeof mutations];

          mutationsToPerform?.forEach((mutation) => {
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
      { blocks.map(renderBlock) }
    </div>
  );
};

export default Editor;
