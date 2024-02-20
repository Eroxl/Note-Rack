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
import mergeObjects from '../lib/helpers/mergeObjects';
import handleDownArrowNavigation from '../lib/keybinds/handleDownArrowNavigation';
import handleUpArrowNavigation from '../lib/keybinds/handleUpArrowNavigation';
import type Plugin from '../types/Plugin';

export type EditorProps = {
  startingBlocks: BlockState[];

  renderers: {
    [type: string]: BlockRenderer<any>;
  }

  postMutations?: {
    [T in keyof typeof mutations]?: ((...args: Parameters<typeof mutations[T]>) => void)[]
  }

  keybinds?: KeybindHandler[]
  richTextKeybinds?: RichTextKeybindHandler[]

  blockWrappers?: React.FC<{
    mutations: InBlockMutations;
    block: BlockState;
    children: React.ReactNode;
  }>[];

  plugins?: Plugin[]
};

const getDefaultProps = (): Partial<Omit<EditorProps, 'startingBlocks' | 'plugins'>> => ({
  postMutations: {
    addBlock: [focusAddedBlock],
    removeBlock: [focusRemovedBlock]
  },
  keybinds: [
    {
      keybind: 'ArrowDown',
      handler: handleDownArrowNavigation,
    },
    {
      keybind: 'ArrowUp',
      handler: handleUpArrowNavigation,
    }
  ],
  richTextKeybinds: [],
  blockWrappers: [
    BlockWrapper
  ]
});

const Editor: React.FC<EditorProps> = (props) => {
  const {
    startingBlocks,
    plugins
  } = props;

  const [blocks, setBlocks] = useState(startingBlocks);

  const editorRef = useRef<HTMLDivElement>(null);

  const defaultProps = getDefaultProps();

  const mergedProps = mergeObjects(
    (plugins || []).reduce(
      (acc, plugin) => mergeObjects(acc, plugin),
      props
    ),
    defaultProps,
  ) as EditorProps;

  const {
    renderers,
    postMutations,
    keybinds,
    richTextKeybinds,
    blockWrappers,
  } = mergedProps;

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

          const mutationsToPerform = postMutations?.[name as keyof typeof mutations] ?? []

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

          const currentSelection = getEditorSelection(editorRef.current);

          handler(editorMutations, blocks, currentSelection, event);
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

        const Renderer = renderers[type];

        if (!Renderer) return;

        const initialChild = (
          <Renderer
            id={block.id}
            mutations={editorMutations}
            properties={block.properties}
            type={block.type}
            key={id}
          />
        )

        return (blockWrappers || [])
          .slice(-(blockWrappers?.length || 0))
          .reduce(
            (child, Wrapper) => (
              <Wrapper
                block={block}
                mutations={editorMutations}
              >
                {child}
              </Wrapper>
            ),
            initialChild
          )
      })}
    </div>
  );
};

export default Editor;
