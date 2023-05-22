import React, {
  useState, useRef, useEffect, useContext,
} from 'react';

import { DropdownOptions, dropdownInfo } from '../../../lib/constants/ShareOptions';
import ShareOptionsDropdown from './ShareOptionsDropdown';
import PagePermissionContext from '../../../contexts/PagePermissionsContext';

interface ShareMenuProps {
  page: string,
  setIsEditingEmails: (isEditingEmails: boolean) => void,
}

const EmailShareMenu = (props: ShareMenuProps) => {
  const { page, setIsEditingEmails } = props;

  const {
    currentPermissions,
    setCurrentPermissions,
  } = useContext(PagePermissionContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(DropdownOptions.FullAccess);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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
  };

  return (
    <>
      <div
        className="relative flex w-full gap-2 px-2 rounded outline-none dark:bg-white/10 bg-black/10"
      >
        <input
          className="w-full bg-transparent focus:outline-none placeholder:dark:text-amber-50/40 dark:text-amber-50 text-zinc-700 placeholder:text-zinc-700/40"
          placeholder="Add email"
          type="email"
          autoFocus
          ref={emailInputRef}
        />
        {/* Dropdown */}
        <div
          className="relative flex flex-row items-center justify-center px-2 py-1 my-1 rounded cursor-pointer select-none text-amber-50/70 w-max whitespace-nowrap hover:bg-black/5 hover:dark:bg-white/5"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
          }}
          ref={dropdownRef}
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
                selectedDropdownOption={selectedDropdownOption}
                setSelectedDropdownOption={setSelectedDropdownOption}
                setIsDropdownOpen={setIsDropdownOpen}
              />
            )
          }
        </div>
      </div>
      <div>
        <button
          className="px-2 mr-2 text-amber-50/70"
          onClick={() => {
            setIsEditingEmails(false);
          }}
        >
          Cancel
        </button>
        <button
          className="px-2 bg-blue-500 border border-blue-600 rounded text-amber-50"
          onClick={() => {
            setIsEditingEmails(false);
            const email = emailInputRef.current?.value;
            if (!email) return;

            (async () => {
              const status = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/page/update-permissions/${page}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email,
                    permissions: dropdownInfo[selectedDropdownOption].permissions,
                  }),
                },
              );

              if (status.ok) {
                addPermissions(email, dropdownInfo[selectedDropdownOption].permissions);
              }
            })();
          }}
        >
          Invite
        </button>
      </div>
    </>
  );
};

export default EmailShareMenu;
