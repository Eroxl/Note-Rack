import React, { useEffect, useState, useRef } from 'react';
import BaseModal from './BaseModal';

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpenSearchModal = () => {
      setIsOpen(!isOpen);

      if (inputRef.current && !isOpen) {
        inputRef.current.focus();
      }
    }

    document.addEventListener('openSearchModal', handleOpenSearchModal);

    return () => {
      document.removeEventListener('openSearchModal', handleOpenSearchModal);
    };
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="top-24 -translate-y-[0%]"
    >
      <div
        className={`
          flex flex-col justify-center w-screen h-16 max-w-2xl
          p-1 border-[20px] rounded-lg border-zinc-700
          before:rounded before:top-2 before:left-2
          before:bottom-2 before:right-2 before:absolute before:bg-zinc-600
        `}
      >
        <input
          className="z-20 text-xl text-white bg-transparent border-0 outline-none"
          placeholder='Search notes...'
          ref={inputRef}
        /> 
      </div>
    </BaseModal>
  );
}

export default SearchModal;
