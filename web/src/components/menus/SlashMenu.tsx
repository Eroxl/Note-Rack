import React, { useEffect } from 'react';

import type { SlashMenuCategory, SlashMenuOption } from '../../hooks/useSlashMenu';
import { getClosestTextNode } from '../../lib/helpers/focusHelpers';

interface SlashMenuProps {
  slashMenuCategories: SlashMenuCategory[];
  editableRef: React.RefObject<HTMLSpanElement>;
}

const SlashMenu = (props: SlashMenuProps) => {
  const {
    slashMenuCategories,
    editableRef,
  } = props;

  const slashMenuRef = React.useRef<HTMLDivElement>(null);

  const [isSlashMenuOpen, setIsSlashMenuOpen] = React.useState(false);
  const [slashMenuQuery, setSlashMenuQuery] = React.useState('');
  const [slashLocation, setSlashLocation] = React.useState(0);
  const [editableElementLength, setEditableElementLength] = React.useState(0);

  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  /**
   * Get the relevant slash menu options based on the slash menu query
   * @returns Relevant slash menu options
   */
  const getRelevantOptions = (): SlashMenuCategory[] => {
    let parsedSlashMenuQuery = slashMenuQuery.replace(/^\//, '').toLowerCase()

    console.log(parsedSlashMenuQuery);

    if (!parsedSlashMenuQuery) return slashMenuCategories;

    const relevantOptions: SlashMenuCategory[] = []

    for (let i = 0; i < slashMenuCategories.length; i++) {
      const category = slashMenuCategories[i];
      const categoryOptions: SlashMenuOption[] = [];

      for (let j = 0; j < category.options.length; j++) {
        const option = category.options[j];
        
        if (option.name.toLowerCase().includes(parsedSlashMenuQuery)) {
          categoryOptions.push(option);
        }
      }

      if (categoryOptions.length > 0) {
        relevantOptions.push({
          name: category.name,
          options: categoryOptions,
        });
      }
    }

    return relevantOptions;
  };

  /**
   * Get the x and y coordinates of a cursor at a given offset
   * @param offset Offset of the cursor
   * @returns X and y coordinates of the cursor
   */
  const getCursorCoordinates = (offset: number): { x: number, y: number } => {
    if (!editableRef.current) return { x: 0, y: 0 };

    const range = document.createRange();

    const textNodes = getClosestTextNode(editableRef.current);

    if (!textNodes) return { x: 0, y: 0 };

    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];

      if (!textNode) continue;

      if (textNode.textContent?.length! >= offset) {
        range.setStart(textNode, offset);
        range.collapse(true);
        break;
      }

      offset -= textNode.textContent?.length!;
    }

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
  const getCursorOffset = (element: HTMLElement): number => {
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
      if (isSlashMenuOpen) return;

      if (e.key === '/') {
        setIsSlashMenuOpen(true);

        if (!editableRef.current) return;

        const caretOffset = getCursorOffset(editableRef.current);

        setSlashLocation(caretOffset);
        setEditableElementLength(editableRef.current.innerText.length);
        setSlashMenuQuery('');
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
  }, [editableRef.current, isSlashMenuOpen]);

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
   * Handle rendering the slash menu when it is open
   */
  useEffect(() => {
    let { x, y } = getCursorCoordinates(slashLocation);

    if (x === 0 && y === 0) {
      const boundingRect = editableRef.current?.getBoundingClientRect();

      if (!boundingRect) return;

      x = boundingRect.left;
      y = boundingRect.top;
    }

    setX(x);
    setY(y + +(window.getComputedStyle(editableRef.current!).lineHeight.replace('px', '') || 0));
  }, [slashLocation, editableRef.current]);

  /**
   * Handle the slash menu query changing when the user types
   */
  useEffect(() => {
    if (!isSlashMenuOpen) return;

    const handleSlashMenuQuery = () => {
      if (!editableRef.current || !isSlashMenuOpen) return;

      const slashLengthChange = editableRef.current.innerText.length - editableElementLength ;

      const newQuery = editableRef.current.innerText.slice(slashLocation, slashLocation + slashMenuQuery.length + slashLengthChange);

      if (newQuery.length === 0 || newQuery[0] !== '/') {
        setIsSlashMenuOpen(false);
        return;
      }

      setSlashMenuQuery(newQuery);
      setEditableElementLength(editableRef.current.innerText.length);
    };

    editableRef.current?.addEventListener('input', handleSlashMenuQuery);

    return () => {
      editableRef.current?.removeEventListener('input', handleSlashMenuQuery);
    };
  }, [slashMenuQuery, slashLocation, editableRef.current, editableElementLength]);

  return (
    <>
    {isSlashMenuOpen && (
      <div
          ref={slashMenuRef}
          className="absolute z-50 bg-neutral-600 rounded-md shadow-md w-64 p-4 overflow-y-scroll max-h-[33.3%] border-black border border-opacity-5 no-scrollbar"
          style={{
            top: y,
            left: x,
          }}
        >
          {getRelevantOptions().map((category) => (
            <div className="flex flex-col pb-2">
              <div className="text-amber-50 text-lg font-medium">
                {category.name}
              </div>
              {category.options.map((option) => (
                <div
                  className="px-2 gap-2 py-1 text-gray-200 hover:bg-gray-700 hover:bg-opacity-10 cursor-pointer flex flex-row items-center"
                  onClick={() => {
                    if (!editableRef.current) return;

                    const textBeforeSlash = editableRef.current.innerText.slice(0, slashLocation);
                    const textAfterSlash = editableRef.current.innerText.slice(slashLocation + slashMenuQuery.length);

                    editableRef.current.innerText = textBeforeSlash + textAfterSlash;

                    setIsSlashMenuOpen(false);

                    editableRef.current.focus();

                    const newCaretOffset = textBeforeSlash.length;

                    setSlashLocation(newCaretOffset);

                    setEditableElementLength(editableRef.current.innerText.length);

                    const range = document.createRange();
                    const sel = window.getSelection()!;
                    
                    range.setStart(editableRef.current.childNodes[0], newCaretOffset);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);

                    editableRef.current.dispatchEvent(new Event('input'));
                    editableRef.current.dispatchEvent(new Event('change'));

                    option.action();
                  }}
                >
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-14 h-14 rounded-sm inline-block"
                  />
                  <div className="flex-col flex">
                    <div className="text-md font-medium h-1/2">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-400 h-1/2 w-full">
                      {option.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        ))}
        </div>
      )}
    </>
  )
};

export default SlashMenu;
