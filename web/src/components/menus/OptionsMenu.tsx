import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';

interface ShareMenuProps {
  page: string,
  buttonRef: React.RefObject<HTMLDivElement>,
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const ShareMenu = (props: ShareMenuProps) => {
  const {
    page,
    buttonRef,
    setIsMenuOpen
  } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current
        && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  return (
    <div
      className={`
        absolute -bottom-2 right-1 z-20
        flex flex-col w-72 gap-3 p-3
        translate-y-full
        border border-black rounded-md opacity-100 h-max
        text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5
        print:hidden
      `}
    >
      Hello World
    </div>
  );
}

export default ShareMenu;
