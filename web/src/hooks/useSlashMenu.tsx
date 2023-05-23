import { useState, useEffect, useRef, ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import getCaretCoordinates from '../lib/getCaretCoordinates';

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
 * @returns A tuple containing a ref to the editable element and the slash menu
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
const useSlashMenu = (slashMenuCategories: SlashMenuCategory[]) => {
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenu, setSlashMenu] = useState<ReactPortal | null>(null);
  const [editableElementLength, setEditableElementLength] = useState(0);
  const [slashMenuQuery, setSlashMenuQuery] = useState('');
  const [slashLocation, setSlashLocation] = useState(0);

  const slashMenuRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  /**
   * Get the x and y coordinates of a cursor at a given offset
   * @param offset Offset of the cursor
   * @returns X and y coordinates of the cursor
   */
  const getCursorCoordinates = (offset: number) => {
    if (!editableRef.current) return { x: 0, y: 0 };

    const range = document.createRange();

    range.setStart(editableRef.current.firstChild!, offset);
    range.collapse(true);

    const rect = range.getClientRects()[0];

    if (!rect) return { x: 0, y: 0 };

    return {
      x: rect.left,
      y: rect.top,
    };
  };
  
  /**
   * Get the number of characters between the start of the element and the
   * cursor
   * @param element Element to get the cursor offset for
   * @returns Number of characters between the start of the element and the
   */
  const getCursorOffset = (element: HTMLElement) => {
    // ~ Get the range and selection
    const selection = window.getSelection();

    if (!selection) return 0;

    const range = selection.getRangeAt(0);

    if (!range) return 0;

    // ~ Clone the range and select the contents of the element
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);

    // ~ Set the end of the range to the start of the selection
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    // ~ Return the length between the start of the element and the cursor
    return preCaretRange.toString().length;
  };

  /**
   * Handle the slash menu being opened and closed using
   * the '/' key and the 'Escape' key
   */
  useEffect(() => {
    if (!editableRef.current) return;

    const handleSlashMenu = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setIsSlashMenuOpen(true);

        if (!editableRef.current) return;

        const caretOffset = getCursorOffset(editableRef.current);

        setSlashLocation(caretOffset);
        setEditableElementLength(editableRef.current.innerText.length);
      }
    };

    const handleSlashMenuClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSlashMenuOpen(false);
      }
    }

    editableRef.current.addEventListener('keydown', handleSlashMenu);
    document.addEventListener('keydown', handleSlashMenuClose);

    return () => {
      editableRef.current?.removeEventListener('keydown', handleSlashMenu);
      document.removeEventListener('keydown', handleSlashMenuClose);
    }
  }, [editableRef.current]);

  /**
   * Handle the slash menu being closed when the user clicks outside of it
   * or when the user moves the cursor outside of it
   */
  useEffect(() => {
    if (!slashMenuRef.current) return;

    /**
     * Check if the current selection is in the slash menu's query
     * @returns Whether the current selection is in the slash menu
     */
    const isCurrentSelectionInSlashMenu = () => {
      const cursorOffset = getCursorOffset(editableRef.current!);

      return (
        (
          document.activeElement === editableRef.current
          || editableRef.current?.contains(document.activeElement!)
        )
        && cursorOffset >= slashLocation
        && cursorOffset <= slashLocation + slashMenuQuery.length
      );
    };
    
    const handleSlashMenuClose = (e: MouseEvent) => {
      if (slashMenuRef.current?.contains(e.target as Node)) return;

      if (isCurrentSelectionInSlashMenu()) return;

      setIsSlashMenuOpen(false);
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!e.key.startsWith('Arrow')) return;

      if (isCurrentSelectionInSlashMenu()) return;

      setIsSlashMenuOpen(false);
    };

    document.addEventListener('click', handleSlashMenuClose);
    document.addEventListener('keydown', handleArrowKeys);

    return () => {
      document.removeEventListener('click', handleSlashMenuClose);
      document.removeEventListener('keydown', handleArrowKeys);
    }
  }, [slashMenuRef.current, slashLocation, slashMenuQuery]);

  /**
   * Handle the slash menu query changing when the user types
   */
  useEffect(() => {
    if (!isSlashMenuOpen || !editableRef.current) return;

    const handleSlashMenuQuery = () => {
      if (!editableRef.current) return;

      console.log(editableElementLength);
      console.log(editableRef.current.innerText.length);

      const slashLengthChange = editableRef.current.innerText.length - editableElementLength;

      const newQuery = editableRef.current.innerText.slice(slashLocation, slashLocation + slashMenuQuery.length + slashLengthChange);

      if (newQuery.length === 0 || newQuery[0] !== '/') {
        setIsSlashMenuOpen(false);
        return;
      }

      setSlashMenuQuery(newQuery);
      setEditableElementLength(editableRef.current.innerText.length);
    };

    editableRef.current.addEventListener('input', handleSlashMenuQuery);

    return () => {
      editableRef.current?.removeEventListener('input', handleSlashMenuQuery);
    };
  }, [slashMenuQuery, slashLocation, editableRef.current, editableElementLength]);

  /**
   * Handle rendering the slash menu when it is open
   */
  useEffect(() => {
    if (!isSlashMenuOpen) {
      setSlashMenu(null);
      setSlashMenuQuery('');
      return;
    }

    let { x, y } = getCursorCoordinates(slashLocation);

    if (x === 0 && y === 0) {
      const boundingRect = editableRef.current?.getBoundingClientRect();

      if (!boundingRect) return;

      x = boundingRect.left;
      y = boundingRect.top;
    }

    const portal = createPortal(
      <div
        ref={slashMenuRef}
        className={`absolute bg-white/10 border border-gray-300`}
        style={{
          top: y,
          left: x,
        }}
      >
        {slashMenuQuery}
      </div>,
      document.body,
    );

    setSlashMenu(portal);
  }, [isSlashMenuOpen, editableRef.current, slashLocation, slashMenuQuery]);

  return [editableRef, slashMenu];
};

export default useSlashMenu;
