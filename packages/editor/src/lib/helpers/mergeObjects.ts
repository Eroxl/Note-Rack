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

    if (!Array.isArray(obj1Value) || !Array.isArray(value)) return;
    
    merged[key] = [...obj1Value, ...value];
  });

  return merged as {
    [K in keyof (T & U)]: (T & U)[K];
  }
}

export default mergeObjects;
