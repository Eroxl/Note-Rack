import type { EditorProps } from "../components/Editor";

type Plugin = (Partial<Omit<EditorProps, 'startingBlocks' | 'plugins'>>);

export default Plugin;