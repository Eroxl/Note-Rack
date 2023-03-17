import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserPermissions, Permissions } from '../../lib/types/pageTypes';

import { DropdownOptions, dropdownInfo } from '../../lib/constants/ShareOptions';
import ShareOptionsDropdown from './ShareOptionsDropdown';
import { useRouter } from 'next/router';
import PagePermissionsContext from '../../contexts/PagePermissionsContext';

interface UserPermissionProps {
  email: string,
}

const UserPermission = (props: UserPermissionProps) => {
  const { email } = props;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<DropdownOptions>(DropdownOptions.ViewOnly);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const page = useRouter().query.page as string;

  const {
    pagePermissions,
    permissionsOnPage: permissions,
    setCurrentPermissions,
  } = useContext(PagePermissionsContext);

  useEffect(() => {
    const defaultDropdownOption = Object.keys(dropdownInfo).find((key) => {
      if (!permissions) {
        return false;
      }

      let keyPermissions = dropdownInfo[+key].permissions;
  
      return Object.entries(keyPermissions).every(([key, value]) => {
        return permissions[key as keyof UserPermissions] === value;
      });
    }) as (DropdownOptions | undefined) || DropdownOptions.ViewOnly;

    setSelectedDropdownOption(defaultDropdownOption);
  }, [permissions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  const setSelectDropdownOption = (option: DropdownOptions) => {
    let key = Object.keys(pagePermissions!).find((key) => pagePermissions![key].email === email) || email;

    setCurrentPermissions({
      ...pagePermissions,
      [key]: {
        ...dropdownInfo[option].permissions,
        email: email,
      }
    } as Permissions)
  }

  return (
    <div
      className={`
        relative flex w-full gap-2 p-2 px-2 rounded-sm hover:cursor-pointer
        ${isDropdownOpen
          ? 'bg-black/10 dark:bg-white/10'
          : 'dark:hover:bg-white/10 hover:bg-black/10'
        }
      `}
      onClick={() => {
        setIsDropdownOpen(!isDropdownOpen);
      }}
      ref={dropdownRef}
    >
      <p className="w-full my-auto overflow-hidden text-ellipsis">
        {email}
      </p>
      <div
        className="relative flex flex-row items-center justify-center px-2 py-1 my-1 rounded cursor-pointer select-none text-amber-50/70 w-max whitespace-nowrap hover:bg-black/5 hover:dark:bg-white/5"
      >
        {
          dropdownInfo[selectedDropdownOption].title
        }
        <svg
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {
          isDropdownOpen && (
            <ShareOptionsDropdown
              setIsDropdownOpen={setIsDropdownOpen}
              selectedDropdownOption={selectedDropdownOption}
              setSelectedDropdownOption={setSelectDropdownOption}
            >
              <p
                onClick={() => {
                  setCurrentPermissions({
                    ...Object.fromEntries(Object.entries(pagePermissions!).filter(([_, value]) => value.email !== email))
                  } as Permissions);

                  (async () => {
                    await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/page/update-permissions/${page}`, 
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email,
                          permissions: {
                            read: false,
                            write: false,
                            admin: false,
                          }
                        }),
                      }
                    );
                  })();
                }}
                className="flex flex-row items-center justify-between w-full p-2 px-2 py-1 font-bold text-center text-red-400 rounded cursor-pointer hover:bg-black/5 hover:dark:bg-white/5"
              >
                Remove
              </p>
            </ShareOptionsDropdown>
          )
        }
      </div>
    </div>
  )
};

export default UserPermission;
