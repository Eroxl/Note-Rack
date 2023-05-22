import React from 'react';
import Link from 'next/link';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import PagePath from './pageInfo/PagePath';
import ShareButton from './pageCustomization/ShareButton';
import OptionsButton from './pageCustomization/OptionsButton';
import PageSidebar from './pageInfo/PageSidebar/PageSidebar';
import SearchModal from './modals/SearchModal';

interface MenuBarProps {
  children: React.ReactNode,
  forceLoading?: boolean,
}

const MenuBar = (props: MenuBarProps) => {
  const { children, forceLoading } = props;

  const session = useSessionContext();
  const isLoggedIn = (
    session?.loading === false
    && session?.doesSessionExist === true
    && forceLoading !== true
  );

  const isLoading = session?.loading === true || forceLoading === true;

  return (
    <div
      className="w-full h-full overflow-hidden print:h-max print:overflow-visible bg-amber-50 no-scrollbar dark:bg-zinc-700 print:dark:bg-white"
    >
      <div className="absolute">
        <div className="relative z-10 flex w-screen h-10 border-b-4 print:h-0 bg-amber-50 no-scrollbar dark:bg-zinc-700 print:dark:bg-white border-black/10 print:border-0">
          {isLoggedIn || isLoading
            ? (
              <>
                <PagePath />
                <ShareButton />
                <OptionsButton />
              </>
            )
            : (
              <Link href="/auth#">
                <a
                  href="/auth#"
                  className="px-2 my-auto ml-auto text-center rounded cursor-pointer text-zinc-700 dark:text-amber-50"
                >
                  Login
                </a>
              </Link>
            )}
        </div>
      </div>
      {isLoggedIn && (
        <PageSidebar />
      )}
      {isLoading && (
        <div className="absolute h-screen p-3 pt-12 select-none print:h-max w-52 print:w-0 bg-amber-400/10 no-scrollbar dark:bg-white/10" />
      )}
      {children}
      <SearchModal />
    </div>
  );
};

MenuBar.defaultProps = {
  forceLoading: false,
};

export default MenuBar;
