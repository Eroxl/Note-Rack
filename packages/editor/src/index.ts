import Editor from "./components/Editor";
import Text from "./components/Text";
import mutations from "./mutations";

import checkKeybind from "./helpers/checkKeybind";

const helpers = {
  checkKeybind,
};

import type BlockRenderer from "./types/BlockRenderer";
import type BlockState from "./types/BlockState";
import type Keybind from "./types/Keybind";

export type { BlockRenderer, BlockState, Keybind };

export { mutations, helpers, Text };

export default Editor;
