import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import EmailShareMenu from './EmailShareMenu';
import Globe from '../../public/Globe.svg';
import type { Permissions, UserPermissions } from '../../lib/types/pageTypes';

interface ShareMenuProps {
  page: string,
  setIsMenuOpen: (isMenuOpen: boolean) => void,
  buttonRef: React.RefObject<HTMLDivElement>,
  pagePermissions?: Permissions,
  permissionsOnPage?: UserPermissions
}

const ShareMenu = (props: ShareMenuProps) => {
  const {
    page,
    setIsMenuOpen,
    buttonRef,
    pagePermissions,
    permissionsOnPage,
  } = props;
  const [isPagePublic, setIsPagePublic] = useState(false);
  const [isEditingEmails, setIsEditingEmails] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<typeof pagePermissions>({});

  useEffect(() => {
    if (pagePermissions) {
      setCurrentPermissions(pagePermissions);
    }
  }, [pagePermissions]);

  useEffect(() => {
    if (currentPermissions && currentPermissions['*']?.read) {
      setIsPagePublic(true);
    }
  }, [currentPermissions, isPagePublic]);

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

  const addPermissions = (email: string, newPermissions: any) => {
    if (!currentPermissions) {
      setCurrentPermissions({
        [email]: {
          ...newPermissions,
        },
      });
      return;
    }

    const key = Object.entries(currentPermissions).find(([, value]) => value.email === email)?.[0] || email;

    setCurrentPermissions({
      ...currentPermissions,
      [key]: {
        ...newPermissions,
        email,
      },
    });
  }

  return (
    <div
      className={`
        absolute -bottom-1 right-1 z-20
        flex flex-col w-[362px] gap-3 p-3
        translate-y-full
        border border-black rounded-md opacity-100 h-max
        text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5
      `}
    >
      {isEditingEmails
        ? (
          <EmailShareMenu
            page={page}
            setIsEditingEmails={setIsEditingEmails}
            addPermissions={addPermissions}
          />
        )
        : (
          <>
            <div
              className="flex flex-row gap-2"
              onClick={() => {
                if (!permissionsOnPage?.admin) return;
                
                setIsEditingEmails(true);
              }}
              >
              <div
                className={`
                  flex flex-col justify-center w-full px-2 py-2 rounded
                  ${permissionsOnPage?.admin
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                  }
                  dark:bg-white/10 bg-black/10 dark:text-amber-50/40 text-zinc-700/40
                `}
              >
                Add email
              </div>
              <div
                className={`
                  flex flex-col items-center justify-center px-2 py-2 text-sm font-bold text-center border
                  ${permissionsOnPage?.admin
                    ? 'bg-blue-500 border-blue-600 cursor-pointer'
                    : 'bg-gray-300 border-gray-400 cursor-not-allowed'
                  } rounded text-zinc-700 dark:text-amber-50
                `}
              >
                Invite
              </div>
            </div>
            {
              permissionsOnPage?.admin && (
                <>
                  {
                    (currentPermissions && !isPagePublic) && (
                      <div>
                        <span className="font-bold">Shared with</span>
                        {
                          Object.values(currentPermissions).map((permission) => (
                            <div
                              className="p-2 rounded-sm hover:cursor-pointer dark:hover:bg-white/10 hover:bg-black/10"
                            >
                              {permission.email}
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                  <div>
                    <div
                      className="flex flex-row w-full gap-5 p-2 text-left rounded-sm cursor-pointer select-none dark:hover:bg-white/10 hover:bg-black/10"
                      onClick={() => {
                        setIsPagePublic(!isPagePublic);
                      }}
                    >
                      <Image
                        src={Globe}
                        alt="Globe"
                        height={48}
                        width={48}
                        className="select-none" />
                      <div className="w-52">
                        <span className="font-bold">Share to Web</span>
                        <span className="block text-sm text-zinc-700 dark:text-amber-50">
                          {isPagePublic
                            ? 'Anyone with the link can view this page.'
                            : 'Only people you share the link with can view this page.'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        role="switch"
                        className={`
                        relative w-10 h-5 rounded-full
                        bg-zinc-200 dark:bg-slate-400
                        outline-none appearance-none
                        cursor-pointer transition-colors
                        before:content-[attr(data-content)]
                        before:absolute before:top-1/2
                        before:-translate-y-1/2
                        before:ease-linear
                        before:bg-white
                        before:rounded-full
                        before:h-3/4 before:aspect-square
                        my-auto border
                        ${isPagePublic
                            ? 'bg-zinc-500 dark:bg-blue-500 border-blue-600 before:right-0 before:-translate-x-1/4'
                            : 'before:left-0 before:translate-x-1/4 border-zinc-400 dark:border-slate-500'}
                      `} />
                    </div>
                  </div>
                  <div
                    className="flex flex-row items-center justify-center ml-auto text-sm text-center cursor-pointer select-none"
                    onClick={() => {
                      navigator.clipboard.writeText(document.location.href);
                    }}
                  >
                    Copy Link
                  </div>
                </>
              )
            }
          </>
        )
      }
    </div>
  );
}

export default ShareMenu;