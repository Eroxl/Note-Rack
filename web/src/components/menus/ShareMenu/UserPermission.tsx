import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import { useRouter } from 'next/router';

import { UserPermissions, Permissions } from '../../../lib/types/pageTypes';
import { DropdownOptions, dropdownInfo } from '../../../lib/constants/ShareOptions';
import ShareOptionsDropdown from './ShareOptionsDropdown';
import PagePermissionsContext from '../../../contexts/PagePermissionsContext';

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
    currentPermissions,
    setCurrentPermissions,
  } = useContext(PagePermissionsContext);

  useEffect(() => {
    const permissions = Object.entries(currentPermissions).find(([, value]) => value.email === email)?.[1];

    const defaultDropdownOption = Object.keys(dropdownInfo).find((uuid) => {
      const keyPermissions = dropdownInfo[+uuid].permissions;

      return Object.entries(keyPermissions).every(([key, value]) => {
        if (!permissions) return false;

        return permissions[key as keyof UserPermissions] === value;
      });
    }) as (DropdownOptions | undefined) || DropdownOptions.ViewOnly;

    setSelectedDropdownOption(defaultDropdownOption);
  }, [currentPermissions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const setSelectDropdownOption = (option: DropdownOptions) => {
    const key = Object.keys(currentPermissions).find((key) => currentPermissions[key].email === email) || email;

    setCurrentPermissions({
      ...currentPermissions,
      [key]: {
        ...dropdownInfo[option].permissions,
        email,
      },
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
            permissions: dropdownInfo[option].permissions,
          }),
        },
      );
    })();

    setSelectedDropdownOption(option);
  };

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
                    ...Object.fromEntries(Object.entries(currentPermissions).filter(([_, value]) => value.email !== email)),
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
                          },
                        }),
                      },
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
  );
};

export default UserPermission;
