import React, { useState } from 'react';

import mutations from '../mutations';
import type BlockState from '../types/BlockState';
import type BlockRenderer from '../types/BlockRenderer';

type EditorProps = {
  startingBlocks: BlockState[];

  renderers: {
    [type: string]: BlockRenderer<any>;
  }

  postMutations?: {
    [T in keyof typeof mutations]?: ((...args: Parameters<typeof mutations[T]>) => void)[]
  }
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
  );

  const renderBlock = (block: BlockState) => {
    const {
      id,
      properties,
      type
    } = block;

    const BlockRenderer = renderers[type];

    if (!BlockRenderer) return;

    return (
      <BlockRenderer
        key={id}
        id={id}
        properties={properties}

        // @ts-ignore
        mutations={editorMutations}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      { blocks.map(renderBlock) }
    </div>
  );
};

export default Editor;
