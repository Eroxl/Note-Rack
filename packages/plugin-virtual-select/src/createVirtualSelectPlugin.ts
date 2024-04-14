import Plugin from "@note-rack/editor/types/Plugin";

import createWrapper from "./components/createWrapper";
import handleSelectAll from "./lib/keybinds/handleSelectAll";

const createVirtualSelectPlugin = (
  selectedBlockStyle?: React.CSSProperties,
  selectedBlockClassName?: string,
): Plugin => ({
  blockWrappers: [
    createWrapper(selectedBlockStyle, selectedBlockClassName)
  ],
  keybinds: [
    handleSelectAll,
  ],
});

export default createVirtualSelectPlugin;
