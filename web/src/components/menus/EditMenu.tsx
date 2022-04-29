import React, {
  Dispatch, SetStateAction, useEffect,
} from 'react';

interface EditMenuProps {
  menuButton: React.RefObject<HTMLDivElement>,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setIsGlobalMenuOpen: Dispatch<SetStateAction<boolean>>,
}

const EditMenu = (props: EditMenuProps) => {
  const {
    isOpen, setIsOpen, menuButton, setIsGlobalMenuOpen,
  } = props;

  useEffect(() => {
    const handleClickOutside = (event: unknown) => {
      if (
        menuButton.current
        && !menuButton.current.contains((event as React.MouseEvent<HTMLElement>).target as Node)
        && isOpen
      ) {
        setIsOpen(false);
        setIsGlobalMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div
      className={`z-20 border-black border rounded-md w-40 h-max p-3 text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5 flex flex-col overflow-hidden gap-1 opacity-100 ${isOpen ? 'flex' : 'hidden'}`}
    />
  );
};

export default EditMenu;
