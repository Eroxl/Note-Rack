type BlockState<T = Record<string, unknown>> = {
  id: string;
  type: string;
  properties: T;
};

export default BlockState;
