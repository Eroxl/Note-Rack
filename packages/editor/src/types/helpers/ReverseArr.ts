type ReverseArr<T extends any[]> = T extends [infer F, ...infer R]
  ? [...ReverseArr<R>, F]
  : T;

export type { ReverseArr };
