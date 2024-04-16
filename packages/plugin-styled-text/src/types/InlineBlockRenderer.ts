import type React from "react"

type InlineBlockRenderer<
  Props extends Record<string, unknown>,
> = React.FC<(
  {
    children: React.ReactNode | string,
  } & Props
)>;

export default InlineBlockRenderer;
 