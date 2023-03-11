import React, { useState, useRef, useEffect } from 'react';

interface ShareMenuProps {
  page: string,
  setIsEditingEmails: (isEditingEmails: boolean) => void,
}

enum DropdownOptions {
  FullAccess,
  EditOnly,
  ViewOnly,
}

const EmailShareMenu = (props: ShareMenuProps) => {
  const { page, setIsEditingEmails } = props;
  
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
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  const dropdownInfo: {
    [key: number]: {
      title: string,
      description: string,
      permissions: {
        admin: boolean,
        edit: boolean,
        read: boolean,
      }
    }
  } = {
    [DropdownOptions.FullAccess]: {
      title: 'Full access',
      description: 'Can edit, delete, and share',
      permissions: {
        admin: true,
        edit: true,
        read: true,
      }
    },
    [DropdownOptions.EditOnly]: {
      title: 'Edit only',
      description: 'Can edit, but not delete or share',
      permissions: {
        admin: false,
        edit: true,
        read: true,
      },
    },
    [DropdownOptions.ViewOnly]: {
      title: 'View only',
      description: 'Cannot edit, delete, or share',
      permissions: {
        admin: false,
        edit: false,
        read: true,
      }
    },
  }

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
              <div
                className="absolute right-0 z-10 mt-1 -translate-y-2 border rounded-md shadow-lg dark:border-neutral-600 border-stone-200 w-max top-full bg-stone-100 dark:bg-neutral-600"
              >
                <ul
                  className="flex flex-col w-full gap-1 p-1 text-zinc-700 dark:text-amber-50"
                >
                  {
                    Object.values(dropdownInfo).map((_, option) => (
                      <li
                        key={option}
                        className="flex flex-row items-center justify-between w-full px-2 py-1 rounded cursor-pointer hover:bg-black/5 hover:dark:bg-white/5"
                        onClick={() => {
                          setSelectedDropdownOption(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div
                          className="flex flex-col"
                        >
                          <div
                            className="font-medium"
                          >
                            {
                              dropdownInfo[option].title
                            }
                          </div>
                          <div
                            className="text-sm"
                          >
                            {
                              dropdownInfo[option].description
                            }
                          </div>
                        </div>
                        {
                          selectedDropdownOption === option && (
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
                          )
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
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
              await fetch(
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
                }
              )
            })();
          }}
        >
          Invite
        </button>
      </div>
    </>
  );
}

export default EmailShareMenu;
