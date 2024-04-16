import InlineBlockRenderer from "./InlineBlockRenderer";

type InlineBlockSchema = {
  acceptsChildren: boolean;
  renderer: InlineBlockRenderer<Record<string, unknown | undefined>>
};

export default InlineBlockSchema;
