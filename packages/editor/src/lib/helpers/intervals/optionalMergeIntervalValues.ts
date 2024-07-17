import type { ValueMerger } from "./mergeIntervals";

/**
 * Merge interval values, and removes values that are prefixed with a dash.
 * 
 * @example
 * ```ts
 * optionalMergeIntervalValues(
 *  { start: 0, end: 10, type: ['bold', '-italic'] },
 *  { start: 0, end: 10, type: ['italic'] },
 * )
 * // => { start: 0, end: 10, type: ['bold'] }
 * 
 * optionalMergeIntervalValues(
 *  { start: 0, end: 10, type: ['bold'] },
 *  { start: 0, end: 10, type: ['italic'] },
 * )
 * // => { start: 0, end: 10, type: ['bold', 'italic'] }
 * ```
 */
const optionalMergeIntervalValues: ValueMerger = (a, b) => {
  const newInterval: Record<string, unknown> = {};

  Object.keys(b).forEach((key) => {
    if (key === 'start' || key === 'end') return;

    const currentIntervalValue = a[key];
    const intervalToMergeValue = b[key];

    if (!Array.isArray(currentIntervalValue) || !Array.isArray(intervalToMergeValue)) return;

    newInterval[key] = [
      ...intervalToMergeValue.filter((value) => (
        !currentIntervalValue.includes(`-${value}`)
        && !`${value}`.startsWith('-')
      )),
      ...currentIntervalValue.filter((value) => (
        !intervalToMergeValue.includes(`-${value}`)
        && !`${value}`.startsWith('-')
      )),
    ]
    return;
  });

  return newInterval;
}

export default optionalMergeIntervalValues
