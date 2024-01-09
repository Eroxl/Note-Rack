import React, { useEffect, useRef, useState } from 'react';

import getEditorSelection from '../lib/getEditorSelection';
import handlePotentialBlockChange from '../lib/handlePotentialBlockChange';
import checkKeybind from '../lib/helpers/checkKeybind';
import focusAddedBlock from '../lib/postEditorMutations/focusAddedBlock';
import focusRemovedBlock from '../lib/postEditorMutations/focusRemovedBlock';
import mutations from '../mutations';
import type BlockRenderer from '../types/BlockRenderer';
import type { InBlockMutations } from '../types/BlockRenderer';
import type BlockState from '../types/BlockState';
import type KeybindHandler from '../types/KeybindHandler';
import type RichTextKeybindHandler from '../types/RichTextKeybindHandler';
import BlockWrapper from './BlockWrapper';

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

  const editorRef = useRef<HTMLDivElement>(null);

  const {
    renderers,
    postMutations,
    keybinds,
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
          if (name === 'editBlock' && richTextKeybinds && editorRef.current) {
            const didTypeChange = handlePotentialBlockChange(
              args,
              blocks,
              editorMutations,
              richTextKeybinds,
              editorRef.current,
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

  useEffect(() => {
    if (!keybinds) return;

    const keydownListners: ((event: KeyboardEvent) => void)[] = (
      keybinds.map(({ keybind, handler }) => {
        const listener = (event: KeyboardEvent) => {
          if (!checkKeybind(keybind, event) || !editorRef.current) return;

          event.preventDefault();
          event.stopPropagation();

          const currentSelection = getEditorSelection(editorRef.current);

          handler(editorMutations, blocks, currentSelection);
        }

        return listener;
      })
    )

    keydownListners.forEach((listener) => {
      document.addEventListener('keydown', listener)
    });


    return () => {
      keydownListners.forEach((listener) => {
        document.removeEventListener('keydown', listener)
      });
    }
  }, [editorMutations, blocks]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em"
      }}
      id="editor"
      ref={editorRef}
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
