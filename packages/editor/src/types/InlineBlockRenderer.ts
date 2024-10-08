import type React from "react";

import { InBlockMutations } from "./BlockRenderer";

type InlineBlockRenderer<
  Props extends Record<string, unknown>,
> = React.FC<(
  {
    children: React.ReactNode | string,
    mutations: InBlockMutations,
    properties: Props & {
      blockID: string,
      blockStart: number,
      blockEnd: number,
    },
  }
)>;

export default InlineBlockRenderer;
