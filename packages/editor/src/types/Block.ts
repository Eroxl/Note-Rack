import type { Keybind } from "./Keybind";

type BlockProps<T = Record<string, unknown>> = {
  id: string;
  properties: T;
};

type Block<T = Record<string, unknown>> = {
  type: string;
  component: React.FC<BlockProps<T>>;
  keybinds?: Keybind[];
  inputRules?: RegExp[];
};

export type { Block, BlockProps };
