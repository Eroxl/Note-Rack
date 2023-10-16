import type { Keybind } from "./Keybind";

type InlineBlockProps<T = Record<string, unknown>> = {
  properties: T;
};

type InlineBlock<T = Record<string, unknown>> = {
  type: string;
  component: React.FC<InlineBlockProps<T>>;
  keybinds?: Keybind[];
  inputRules?: RegExp[];
};

export type { InlineBlock, InlineBlockProps };
