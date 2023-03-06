import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';

import ShareMenu from '../menus/ShareMenu';

const ShareButton = () => {
  const { page } = useRouter().query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);  

  return (
    <div
      ref={buttonRef}
    >
      <div className="flex flex-row h-full gap-1 p-2 select-none w-max">
        <div
          className="w-full h-full text-center rounded cursor-pointer text-zinc-700 dark:text-amber-50"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          Share
        </div>
      </div>
      {
        isMenuOpen && (
          <ShareMenu
            page={page as string}
            setIsMenuOpen={setIsMenuOpen}
            buttonRef={buttonRef}
          />
        )
      }
    </div>
  )
}


export default ShareButton;
