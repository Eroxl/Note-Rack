import React, { useEffect, useRef } from 'react';

interface BaseModalProps {
  children: React.ReactNode,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  className?: string,
}

const BaseModal = (props: BaseModalProps) => {
  const { children, isOpen, setIsOpen, className } = props;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current
        && !modalRef.current.contains(event.target as Node)
        && isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`${className} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${isOpen ? 'flex print:hidden' : 'hidden'}`}
        ref={modalRef}
      >
        {children}
      </div>
      <div 
        className={`absolute top-0 left-0 z-40 w-screen h-screen bg-black/50 ${isOpen ? 'block print:hidden' : 'hidden'}`}
      />
    </>
  );
};

export default BaseModal;
