import blockRegexFactory from "./blockRegexFactory";
import inlineBlockRegexFactory from "./inlineBlockRegexFactory";

import inlineBlockKeybindFactory from "./inlineBlockKeybindFactory";

const regexFactories = {
  block: blockRegexFactory,
  inlineBlock: inlineBlockRegexFactory,
};

const keybindFactories = {
  inlineBlock: inlineBlockKeybindFactory,
};

const factories = {
  regex: regexFactories,
  keybind: keybindFactories,
};

export default factories;
