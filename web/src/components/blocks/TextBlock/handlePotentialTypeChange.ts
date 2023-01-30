import textKeybinds from '../../../lib/textKeybinds';
import { editBlock } from '../../../lib/pages/updatePage';
  

/**
 * This function is used to check if the text content of a block element
 * matches one of the keybinds in the textKeybinds array. If it does, it
 * calls the edit block function to update the block type to the type
 * specified in the keybind.
 * @param {HTMLSpanElement} element - The block element to check
 * @param {Record<string, unknown>} properties - The properties of the block
 * @param {string} blockID - The ID of the block
 * @param {string} page - The current page
 * @param {React.Dispatch<React.SetStateAction<string>>} setCurrentBlockType - The function to set the current block type
 */

const handlePotentialTypeChange = async (
  element: HTMLSpanElement,
  properties: Record<string, unknown>,
  blockID: string,
  page: string,
  setCurrentBlockType: (_type: string) => void,
) => {
  textKeybinds.forEach(async (bind) => {
    const regexSearch = bind.keybind.exec(element.textContent || '');

    if (!regexSearch) return;

    element.textContent = regexSearch[1] ?? '';

    let newBlockProperties;

    if (bind.customFunc) {
      newBlockProperties = await bind.customFunc(
        {
          ...properties,
          value: element.textContent,
        },
        blockID,
        page,
        element,
      );
    }

    await editBlock([blockID], bind.type, newBlockProperties, page);
    setCurrentBlockType(bind.type);
  });
};

export default handlePotentialTypeChange;
