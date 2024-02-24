type MergedObject<T, U> = (
  {
    [K in keyof (T & U)]: (T & U)[K];
  } & {
    [K in keyof T as T[K] extends any[] ? never : K]: T[K];
  } & {
    [K in keyof U as U[K] extends any[] ? never : K]: U[K];
  }
)

/**
 * Merge the arrays of two objects, preserving the keys of non-array values
 * @param obj1 
 * @param obj2 
 * @returns 
 */
const mergeObjects = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(obj1: T, obj2: U) => {
  const merged: Record<string, unknown> = {
    ...obj1,
  };

  Object.entries(obj2).forEach(([key, value]) => {
    if (merged[key] === undefined) {
      merged[key] = value;
      return;
    }

    const obj1Value = merged[key];

    if (typeof obj1Value === 'object' && typeof value === 'object') {
      merged[key] = {
        ...obj1Value,
        ...value,
      }
    }

    if (!Array.isArray(obj1Value) || !Array.isArray(value)) return;
    
    merged[key] = [...obj1Value, ...value];
  });

  return merged as MergedObject<T, U>;
}

export default mergeObjects;
