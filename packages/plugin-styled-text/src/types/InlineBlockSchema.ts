import InlineBlockRenderer from "./InlineBlockRenderer";

type InlineBlockSchema = {
  renderer: InlineBlockRenderer<Record<string, unknown | undefined>>
  accepts?: string[],
};

export default InlineBlockSchema;
