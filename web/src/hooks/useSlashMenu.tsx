import { useState, useEffect, useRef, ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import getCaretCoordinates from '../lib/getCaretCoordinates';

const useSlashMenu = () => {
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenu, setSlashMenu] = useState<ReactPortal | null>(null);

  const slashMenuRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editableRef.current) return;

    const handleSlashMenu = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setIsSlashMenuOpen(true);
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

  useEffect(() => {
    if (!slashMenuRef.current) return;

    const handleSlashMenuClose = (e: MouseEvent) => {
      if (!slashMenuRef.current?.contains(e.target as Node)) {
        setIsSlashMenuOpen(false);
      }
    };

    document.addEventListener('click', handleSlashMenuClose);

    return () => {
      document.removeEventListener('click', handleSlashMenuClose);
    }
  }, [slashMenuRef.current]);

  useEffect(() => {
    if (isSlashMenuOpen) {
      const { x, y } = getCaretCoordinates() || { x: 0, y: 0 };

      const portal = createPortal(
        <div
          ref={slashMenuRef}
          className={`absolute bg-white border border-gray-300`}
          style={{
            top: y,
            left: x,
          }}
        >
          Test
        </div>,
        document.body,
      );

      setSlashMenu(portal);
    }

    return () => {
      setSlashMenu(null);
    }
  }, [isSlashMenuOpen]);

  return [editableRef, slashMenu] as const;
};

export default useSlashMenu;
