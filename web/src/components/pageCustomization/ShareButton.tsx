import React, { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import type { Permissions, UserPermissions } from '../../lib/types/pageTypes';
import ShareMenu from '../menus/ShareMenu';
import PagePermissionsContext from '../../contexts/PagePermissionsContext';
import PageContext from '../../contexts/PageContext';

const ShareButton = () => {
  const {
    userPermissions: permissionsOnPage,
    permissions: pagePermissions
  } = useContext(PageContext).pageData || {};
  const { page } = useRouter().query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);  
  const [isPagePublic, setIsPagePublic] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<Permissions>({});

  useEffect(() => {
    if (pagePermissions && pagePermissions['*']?.read) {
      setIsPagePublic(true);
    } else {
      setIsPagePublic(false);
    }
  }, [pagePermissions]);

  useEffect(() => {
    if (pagePermissions) {
      setCurrentPermissions(pagePermissions);
    }
  }, [pagePermissions]);

  return (
    <PagePermissionsContext.Provider
      value={
        {
          pagePermissions,
          permissionsOnPage,
          isMenuOpen,
          setIsMenuOpen,
          isPagePublic,
          setIsPagePublic,
          currentPermissions,
          setCurrentPermissions,
        }
      }
    >
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
            <ShareMenu page={page as string} buttonRef={buttonRef} />
          )
        }
      </div>
    </PagePermissionsContext.Provider>
  )
}


export default ShareButton;
