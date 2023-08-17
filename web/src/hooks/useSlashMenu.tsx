import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import SlashMenu from '../components/menus/SlashMenu';
import type BlockTypes from '../lib/constants/BlockTypes';

/**
 * A slash menu is a menu that appears when the user types a slash (/) in a
 * text input. It allows the user to select an option from a list of options.
 */
export type SlashMenuOption = {
  /**
   * Name of the option
   */
  name: string;
  /**
   * Short description of the option
   */
  description?: string;
  /**
   * Image to display next to the option
   */
  image: string;
  /**
   * Action to perform when the option is selected
   */
  action: () => void;
}

/**
 * A slash menu category is a group of slash menu options
 * @see SlashMenuOption
 * @see useSlashMenu
 * 
 * @example
 * const slashMenuCategories: SlashMenuCategory[] = [
 *  {
 *    name: 'Emojis',
 *    options: [
 *      {  
 *        name: 'Smile',  
 *        description: 'Insert a smile emoji',
 *        image: 'https://example.com/smile.png',
 *        action: () => {
 *          // Insert smile emoji
 *        },
 *      },
 *    ],
 *   },
 * ];
 */
export type SlashMenuCategory = {
  /**
   * Name of the category
   */
  name: string;
  /**
   * List of options in the category
   * @see SlashMenuOption
   * @see useSlashMenu
   */
  options: SlashMenuOption[];
}

/**
 * Hook to display a slash menu when the user types a slash (/) in a text input
 * @param slashMenuCategories Categories to display in the slash menu
 * @returns A tuple containing a ref to the editable element and a portal of the slash menu
 * 
 * @see SlashMenuCategory
 * 
 * @example
 * const slashMenuCategories: SlashMenuCategory[] = [...] // See SlashMenuCategory
 * 
 * const [editableRef, slashMenu] = useSlashMenu(slashMenuCategories);
 * 
 * return (
 *  <div
 *    ref={editableRef}
 *    contentEditable
 *    suppressContentEditableWarning
 *  >
 *    {slashMenu}
 *  </div>
 * );
 */
const useSlashMenu = (slashMenuCategories: SlashMenuCategory[], setText?: (text: string) => void) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const [slashMenu, setSlashMenu] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!editableRef.current) return;

    setSlashMenu(
      createPortal(
        <SlashMenu
          editableRef={editableRef}
          slashMenuCategories={slashMenuCategories}
          setText={setText}
        />,
        editableRef.current.parentElement as HTMLElement,
      )
    )
  }, [editableRef.current]);

  return [editableRef, slashMenu] as const;
};

/**
 * Create default slash menu categories
 * @returns Default slash menu categories
 */
export const createDefaultSlashMenuCategories = (
  changeBlockType: (
    type: keyof typeof BlockTypes,
  ) => void,
): SlashMenuCategory[] => ([
  {
    name: 'Headings',
    options: [
      {
        name: 'Heading 1',
        description: 'A large heading',
        image: '/blockExamples/H1 Icon.svg',
        action: () => {
          changeBlockType('h1');
        }
      },
      {
        name: 'Heading 2',
        description: 'A medium heading',
        image: '/blockExamples/H2 Icon.svg',
        action: () => {
          changeBlockType('h2');
        }
      },
      {
        name: 'Heading 3',
        description: 'A small heading',
        image: '/blockExamples/H3 Icon.svg',
        action: () => {
          changeBlockType('h3');
        }
      }
    ],
  },
  {
    name: 'Text',
    options: [
      {
        name: 'Callout',
        description: 'Emphasize important text',
        image: '/blockExamples/Call Out Icon.svg',
        action: () => {
          changeBlockType('callout');
        }
      },
      {
        name: 'Quote',
        description: 'Highlight a quote',
        image: '/blockExamples/Quote Icon.svg',
        action: () => {
          changeBlockType('quote');
        }
      },
    ],
  },
  {
    name: 'Other',
    options: [
      {
        name: 'Math',
        description: 'Write an equation',
        image: '/blockExamples/Math Icon.svg',
        action: () => {
          changeBlockType('math');
        }
      },
    ],
  }
]);

export default useSlashMenu;
