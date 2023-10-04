import React, { useState, useRef, useEffect } from 'react';

interface DropDownProps {
  name?: string,
  options: {
    title: string,
    description?: string,
  }[],
  setSelectedDropdownOption: React.Dispatch<React.SetStateAction<number>>,
  selectedDropdownOption: number,
}

interface DropDownSelectorProps {
  title: string,
  description?: string,
  optionNumber: number,
  setSelectedDropdownOption: React.Dispatch<React.SetStateAction<number>>,
  selectedDropdownOption: number,
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const DropDownSelector: React.FC<DropDownSelectorProps> = (props) => {
  const {
    title,
    description,
    optionNumber,
    setSelectedDropdownOption,
    selectedDropdownOption,
    setIsDropdownOpen
  } = props;

  return (
    <li
      className="flex flex-row items-center justify-between w-full px-2 py-1 rounded cursor-pointer hover:bg-black/5 hover:dark:bg-white/5"
      onClick={() => {
        setSelectedDropdownOption(optionNumber);
        setIsDropdownOpen(false);
      }}
    >
      <div
        className="flex flex-col"
      >
        <div
          className="font-medium"
        >
          {title}
        </div>
        <div
          className="text-sm"
        >
          {description}
        </div>
      </div>
      {
        selectedDropdownOption === optionNumber && (
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
  )
};

const DropDown: React.FC<DropDownProps> = (props) => {
  const {
    name,
    options,
    selectedDropdownOption,
    setSelectedDropdownOption
  } = props;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <div className="flex flex-row items-center">
      {
        name && (
          <p className="w-full">
            {name}:
          </p>
        )
      }
      <div
        className="relative flex flex-row items-center justify-center px-2 py-1 my-1 rounded cursor-pointer select-none text-amber-50/70 w-max whitespace-nowrap hover:bg-black/5 hover:dark:bg-white/5"
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
        ref={dropdownRef}
      >
        {
          options[selectedDropdownOption].title
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
                  options.map((option, index) => (
                    <DropDownSelector
                      optionNumber={index}
                      title={option.title}
                      description={option.description}
                      selectedDropdownOption={selectedDropdownOption}
                      setSelectedDropdownOption={setSelectedDropdownOption}
                      setIsDropdownOpen={setIsDropdownOpen}
                    />
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default DropDown;
