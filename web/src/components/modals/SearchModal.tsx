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
      <div className="flex flex-col w-screen max-w-2xl gap-2 p-2 rounded-lg bg-zinc-700">
        <div
          className={`
            flex flex-col justify-center h-12 max-w-2xl
            p-2 rounded bg-zinc-600
          `}
        >
          <input
            className="text-xl text-white bg-transparent border-0 outline-none"
            placeholder='Search notes...'
            ref={inputRef}
          /> 
        </div>
      </div>
    </BaseModal>
  );
}

export default SearchModal;
