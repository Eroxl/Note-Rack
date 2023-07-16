import React, { useEffect } from 'react';

import type { SlashMenuCategory, SlashMenuOption } from '../../hooks/useSlashMenu';
import getOffsetCoordinates from '../../lib/helpers/getOffsetCoordinates';
import getStringDistance from '../../lib/helpers/getStringDistance';
import getCursorOffset from '../../lib/helpers/caret/getCursorOffset';

interface SlashMenuProps {
  slashMenuCategories: SlashMenuCategory[];
  editableRef: React.RefObject<HTMLSpanElement>;
}

const SlashMenu = (props: SlashMenuProps) => {
  const {
    slashMenuCategories,
    editableRef,
  } = props;

  const slashMenuRef = React.useRef<HTMLDivElement>(null);

  const [relevantOptions, setRelevantOptions] = React.useState<SlashMenuCategory[]>([]);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = React.useState(false);
  const [slashMenuQuery, setSlashMenuQuery] = React.useState('');
  const [slashLocation, setSlashLocation] = React.useState(0);
  const [editableElementLength, setEditableElementLength] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState({
    categoryIndex: 0,
    optionIndex: 0,
  });

  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  /**
   * Run the action of the selected option and remove the slash menu
   * @param categoryIndex The index of the category of the selected option
   * @param optionIndex The index of the selected option
   */
  const selectOption = (categoryIndex: number, optionIndex: number) => {
    if (!editableRef.current) return;

    const textBeforeSlash = editableRef.current.innerText.slice(0, slashLocation);
    const textAfterSlash = editableRef.current.innerText.slice(slashLocation + slashMenuQuery.length);

    editableRef.current.innerText = textBeforeSlash + textAfterSlash;

    setIsSlashMenuOpen(false);

    editableRef.current.focus();

    const newCaretOffset = textBeforeSlash.length;

    const range = document.createRange();
    const sel = window.getSelection()!;

    range.setStart(editableRef.current.childNodes[0], newCaretOffset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    editableRef.current.dispatchEvent(new Event('input'));
    editableRef.current.dispatchEvent(new Event('change'));

    relevantOptions[categoryIndex].options[optionIndex].action();
  };

  /**
   * Handle the slash menu being opened and closed using
   * the '/' key and the 'Escape' key
   */
  useEffect(() => {
    if (!editableRef.current) return;

    const handleSlashMenu = (e: KeyboardEvent) => {
      if (isSlashMenuOpen) return;

      if (e.key === '/') {
        setIsSlashMenuOpen(true);

        if (!editableRef.current) return;

        const caretOffset = getCursorOffset(editableRef.current);

        setSlashLocation(caretOffset);
        setEditableElementLength(editableRef.current.innerText.length);
        setSlashMenuQuery('');
      }
    };

    const handleSlashMenuClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSlashMenuOpen(false);
      }
    };

    editableRef.current.addEventListener('keydown', handleSlashMenu);
    document.addEventListener('keydown', handleSlashMenuClose);

    return () => {
      editableRef.current?.removeEventListener('keydown', handleSlashMenu);
      document.removeEventListener('keydown', handleSlashMenuClose);
    };
  }, [editableRef.current, isSlashMenuOpen]);

  /**
   * Handle the slash menu being closed when the user clicks outside of it
   * or when the user moves the cursor outside of it
   */
  useEffect(() => {
    if (!slashMenuRef.current) return;

    /**
     * Check if the current selection is in the slash menu's query
     * @returns Whether the current selection is in the slash menu
     */
    const isCurrentSelectionInSlashMenu = () => {
      const cursorOffset = getCursorOffset(editableRef.current!);

      return (
        (
          document.activeElement === editableRef.current
          || editableRef.current?.contains(document.activeElement!)
        )
        && cursorOffset >= slashLocation
        && cursorOffset <= slashLocation + slashMenuQuery.length
      );
    };

    const handleSlashMenuClose = (e: MouseEvent) => {
      if (slashMenuRef.current?.contains(e.target as Node)) return;

      if (isCurrentSelectionInSlashMenu()) return;

      setIsSlashMenuOpen(false);
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!e.key.startsWith('Arrow')) return;

      if (isCurrentSelectionInSlashMenu()) return;

      setIsSlashMenuOpen(false);
    };

    document.addEventListener('click', handleSlashMenuClose);
    document.addEventListener('keydown', handleArrowKeys);

    return () => {
      document.removeEventListener('click', handleSlashMenuClose);
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [slashMenuRef.current, slashLocation, slashMenuQuery]);

  /**
   * Handle rendering the slash menu when it is open
   */
  useEffect(() => {
    if (!editableRef.current) return;

    let { x, y } = getOffsetCoordinates(editableRef.current, slashLocation);

    if (x === 0 && y === 0) {
      const boundingRect = editableRef.current?.getBoundingClientRect();

      if (!boundingRect) return;

      x = boundingRect.left;
      y = boundingRect.top;
    }

    const boundingRect = editableRef.current.parentElement?.getBoundingClientRect();

    if (boundingRect) {
      x -= boundingRect.left;
      y -= boundingRect.top;
    }

    setX(x);
    setY(y + +(window.getComputedStyle(editableRef.current!).lineHeight.replace('px', '') || 0));
  }, [slashLocation, editableRef.current]);

  /**
   * Handle the slash menu query changing when the user types
   */
  useEffect(() => {
    if (!isSlashMenuOpen) return;

    const handleSlashMenuQuery = () => {
      if (!editableRef.current || !isSlashMenuOpen) return;

      const slashLengthChange = editableRef.current.innerText.length - editableElementLength;

      const newQuery = editableRef.current.innerText.slice(slashLocation, slashLocation + slashMenuQuery.length + slashLengthChange);

      if (newQuery.length === 0 || newQuery[0] !== '/') {
        setIsSlashMenuOpen(false);
        return;
      }

      setSlashMenuQuery(newQuery);
      setEditableElementLength(editableRef.current.innerText.length);
    };

    editableRef.current?.addEventListener('input', handleSlashMenuQuery);

    return () => {
      editableRef.current?.removeEventListener('input', handleSlashMenuQuery);
    };
  }, [slashMenuQuery, slashLocation, editableRef.current, editableElementLength]);

  /**
   * Handle re-generating the slash menu options when the slash menu query changes
   * or when the slash menu options change
   */
  useEffect(() => {
    if (!isSlashMenuOpen) return;

    setSelectedOption({
      categoryIndex: 0,
      optionIndex: 0,
    });

    const parsedSlashMenuQuery = slashMenuQuery.replace(/^\//, '').toLowerCase();
    let minDistance = Infinity;

    if (!parsedSlashMenuQuery) {
      setRelevantOptions(slashMenuCategories);
      return;
    }

    const relevantOptions: SlashMenuCategory[] = [];

    for (let i = 0; i < slashMenuCategories.length; i++) {
      const category = slashMenuCategories[i];
      const categoryOptions: SlashMenuOption[] = [];

      for (let j = 0; j < category.options.length; j++) {
        const option = category.options[j];

        const distance = getStringDistance(parsedSlashMenuQuery, option.name.toLowerCase().slice(0, parsedSlashMenuQuery.length));

        if (distance <= 1) {
          categoryOptions.push(option);
        }

        if (distance < minDistance) {
          minDistance = distance;
        }
      }

      if (categoryOptions.length > 0) {
        relevantOptions.push({
          name: category.name,
          options: categoryOptions,
        });
      }
    }

    if (minDistance >= 4) {
      setIsSlashMenuOpen(false);
    }

    setRelevantOptions(relevantOptions);
  }, [slashMenuQuery, slashMenuCategories]);

  /**
   * Handle the selected slash menu option being changed
   */
  useEffect(() => {
    const handleSelectionChange = (e: KeyboardEvent) => {
      if (!isSlashMenuOpen) return;

      switch (e.key) {
        case 'ArrowUp':
          setSelectedOption((selectedOption) => {
            if (selectedOption.optionIndex === 0 && selectedOption.categoryIndex === 0) {
              return selectedOption;
            }

            if (selectedOption.optionIndex === 0) {
              return {
                categoryIndex: selectedOption.categoryIndex - 1,
                optionIndex: relevantOptions[selectedOption.categoryIndex - 1].options.length - 1,
              };
            }

            return {
              categoryIndex: selectedOption.categoryIndex,
              optionIndex: selectedOption.optionIndex - 1,
            };
          });

          e.preventDefault();
          e.stopPropagation();
          break;
        case 'ArrowDown':
          setSelectedOption((selectedOption) => {
            if (
              selectedOption.optionIndex === relevantOptions[selectedOption.categoryIndex].options.length - 1
              && selectedOption.categoryIndex === relevantOptions.length - 1
            ) {
              return selectedOption;
            }

            if (selectedOption.optionIndex === relevantOptions[selectedOption.categoryIndex].options.length - 1) {
              return {
                categoryIndex: selectedOption.categoryIndex + 1,
                optionIndex: 0,
              };
            }

            return {
              categoryIndex: selectedOption.categoryIndex,
              optionIndex: selectedOption.optionIndex + 1,
            };
          });

          e.preventDefault();
          e.stopPropagation();
          break;
        case 'Enter':
          selectOption(selectedOption.categoryIndex, selectedOption.optionIndex);

          e.preventDefault();
          e.stopPropagation();
          break;
      }
    };

    editableRef.current?.addEventListener('keydown', handleSelectionChange);

    return () => {
      editableRef.current?.removeEventListener('keydown', handleSelectionChange);
    };
  }, [relevantOptions, selectedOption, isSlashMenuOpen, editableRef.current]);

  return (
    <>
      {isSlashMenuOpen && (
        <div
          ref={slashMenuRef}
          className={`absolute z-50 bg-neutral-600 rounded-md shadow-md w-64 p-4 overflow-y-scroll max-h-[33vh] border-black border border-opacity-5 no-scrollbar ${relevantOptions.length === 0 ? 'hidden' : ''}`}
          style={{
            top: y,
            left: x,
          }}
        >
          {relevantOptions.map((category, categoryIndex) => (
            <div
              className="flex flex-col pb-2"
              key={category.name}
            >
              <div className="text-amber-50 text-lg font-medium">
                {category.name}
              </div>
              {category.options.map((option, optionIndex) => (
                <div
                  className={`
                    p-2 gap-2 text-gray-200 cursor-pointer flex flex-row items-center
                    ${selectedOption.categoryIndex === categoryIndex && selectedOption.optionIndex === optionIndex ? 'bg-white bg-opacity-10 rounded' : ''}
                  `}
                  key={option.name}
                  onMouseEnter={() => setSelectedOption({ categoryIndex, optionIndex })}
                  onClick={() => {
                    selectOption(categoryIndex, optionIndex);
                  }}
                >
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-14 h-14 rounded-sm inline-block"
                  />
                  <div className="flex-col flex">
                    <div className="text-md font-medium h-1/2">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-400 h-1/2 w-full">
                      {option.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SlashMenu;
