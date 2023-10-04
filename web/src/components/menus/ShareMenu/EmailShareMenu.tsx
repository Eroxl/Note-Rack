import React, {
  useState, useRef, useEffect, useContext,
} from 'react';

import { dropdownInfo } from '../../../lib/constants/ShareOptions';
import ShareOptionsDropdown from './ShareOptionsDropdown';
import PagePermissionContext from '../../../contexts/PagePermissionsContext';
import DropDown from '../DropDown';

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
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);

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
        <DropDown
          options={dropdownInfo}
          selectedDropdownOption={selectedDropdownOption}
          setSelectedDropdownOption={setSelectedDropdownOption}
        />
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
