/**
 * Helper type to convert a string to a union of its characters.
 */
type StringToUnion<T extends string> = T extends `${infer F}${infer R}`
  ? F | StringToUnion<R>
  : never;

export type { StringToUnion };