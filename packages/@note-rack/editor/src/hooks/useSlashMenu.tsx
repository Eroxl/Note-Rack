import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import SlashMenu from '../components/SlashMenu';
import type SlashMenuCategory from '../types/SlashMenuCategory';

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
const useSlashMenu = (slashMenuCategories: SlashMenuCategory[]) => {
  const editableRef = useRef<HTMLSpanElement>(null);
  const [slashMenu, setSlashMenu] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!editableRef.current) return;

    setSlashMenu(
      createPortal(
        <SlashMenu
          editableRef={editableRef}
          slashMenuCategories={slashMenuCategories}
        />,
        editableRef.current.parentElement as HTMLElement,
      )
    )
  }, [editableRef.current]);

  return [editableRef, slashMenu] as const;
};

export default useSlashMenu;
