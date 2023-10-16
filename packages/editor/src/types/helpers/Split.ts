type Split<T extends string, D extends string> = string extends T
  ? string[]
  : T extends ''
    ? []
    : T extends `${infer F}${D}${infer R}`
      ? [F, ...Split<R, D>]
      : [T];

export type { Split };
