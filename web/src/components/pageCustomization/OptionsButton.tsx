import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import More from '../../public/icons/More.svg';
import OptionsMenu from '../menus/OptionsMenu';

const ShareButton = () => {
  const { page } = useRouter().query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);  

  return (
    <div
      ref={buttonRef}
    >
      <div className="flex flex-row h-full gap-1 p-2 select-none w-max print:hidden">
        <div
          className="flex items-center justify-center w-full h-full text-center rounded cursor-pointer text-zinc-700 dark:text-amber-50"
          onMouseDown={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <Image
            src={More}
            alt="More"
            width={32}
            height={32}
          />
        </div>
      </div>
      {
        isMenuOpen && (
          <OptionsMenu
            page={page as string}
            buttonRef={buttonRef}
            setIsMenuOpen={setIsMenuOpen}
          />
        )
      }
    </div>
  )
}


export default ShareButton;
