import React from 'react';

import { DropdownOptions, dropdownInfo } from '../../../lib/constants/ShareOptions';

interface ShareOptionsDropdownProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedDropdownOption: DropdownOptions,
  setSelectedDropdownOption: (option: DropdownOptions) => void,
  children?: React.ReactNode,
}

const ShareOptionsDropdown = (props: ShareOptionsDropdownProps) => {
  const {
    children,
    setIsDropdownOpen,
    selectedDropdownOption,
    setSelectedDropdownOption,
  } = props;

  return (
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
                +selectedDropdownOption.toString() === option && (
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
        {
          children
        }
      </ul>
    </div>
  );
};

export default ShareOptionsDropdown;
