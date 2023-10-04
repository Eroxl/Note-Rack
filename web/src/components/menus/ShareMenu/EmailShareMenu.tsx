import React, {
  useState, useRef, useContext,
} from 'react';

import { dropdownInfo } from '../../../lib/constants/ShareOptions';
import PagePermissionContext from '../../../contexts/PagePermissionsContext';
import Button from '../Button';
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
        <Button
          label='Cancel'
          style='secondary'
          onClick={() => {
            setIsEditingEmails(false);
          }}
        />
        <Button
          label='Invite'
          style='primary'
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
        />
      </div>
    </>
  );
};

export default EmailShareMenu;
