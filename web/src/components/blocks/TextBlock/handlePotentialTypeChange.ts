import textKeybinds from '../../../lib/textKeybinds';
import { editBlock } from '../../../lib/pages/updatePage';
  
const handlePotentialTypeChange = async (
  element: HTMLSpanElement,
  properties: Record<string, unknown>,
  blockID: string,
  page: string,
  setCurrentBlockType: (value: string) => void
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
