import KeybindHandler from "@note-rack/editor/types/KeybindHandler";
import { SelectionManager } from 'react-virtual-selection';

const handleSelectAll: KeybindHandler = {
  keybind: "Meta+A",
  handler: (_, __, ___, e) => {
    SelectionManager.Instance.highlightSelected({
      top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity,
    }, 'selectableBlock');

    e.preventDefault();
  },
}

export default handleSelectAll;
