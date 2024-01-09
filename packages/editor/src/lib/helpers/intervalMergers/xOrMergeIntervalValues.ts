import type { ValueMerger } from "../mergeIntervals";

const xOrMergeIntervalValues: ValueMerger = (a, b) => {
  const newInterval: Record<string, unknown> = {};

  // ~ Merge the values of the intervals
  Object.keys(b).forEach((key) => {
    if (key === 'start' || key === 'end') return;

    const currentIntervalValue = a[key];
    const intervalToMergeValue = b[key];

    if (!Array.isArray(currentIntervalValue) || !Array.isArray(intervalToMergeValue)) return;

    // ~ Remove the values that are in both intervals
    newInterval[key] = [
      ...currentIntervalValue.filter((value) => !intervalToMergeValue.includes(value)),
      ...intervalToMergeValue.filter((value) => !currentIntervalValue.includes(value)),
    ]
    return;
  });

  return newInterval;
}

export default xOrMergeIntervalValues
