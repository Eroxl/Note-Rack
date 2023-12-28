import { describe, expect, test } from '@jest/globals';

import mergeIntervals from '../../lib/helpers/mergeIntervals';

describe(
  'mergeIntervals',
  () => {
    test(
      'Merges overlapping intervals',
      () => {
        const intervals = [
          { start: 1, end: 4 },
          { start: 2, end: 3 },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 1, end: 2 },
          { start: 2, end: 3 },
          { start: 3, end: 4 },
        ]);
      }
    );

    test(
      'Merges overlapping intervals values',
      () => {
        const intervals = [
          { start: 1, end: 4, values: ['a'] },
          { start: 2, end: 3, values: ['b'] },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 1, end: 2, values: ['a'] },
          { start: 2, end: 3, values: ['a', 'b'] },
          { start: 3, end: 4, values: ['a'] },
        ]);
      }
    );

    test(
      'Merges partially overlapping intervals',
      () => {
        const intervals = [
          { start: 0, end: 3 },
          { start: 1, end: 4 },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 0, end: 1 },
          { start: 1, end: 3 },
          { start: 3, end: 4 },
        ]);
      }
    );

    test(
      'Merges partially overlapping intervals values',
      () => {
        const intervals = [
          { start: 0, end: 3, values: ['a'] },
          { start: 1, end: 4, values: ['b'] },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 0, end: 1, values: ['a'] },
          { start: 1, end: 3, values: ['a', 'b'] },
          { start: 3, end: 4, values: ['b'] },
        ]);
      }
    );

    test(
      'Merges identical intervals',
      () => {
        const intervals = [
          { start: 1, end: 2 },
          { start: 1, end: 2 },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 1, end: 2 },
        ]);
      }
    )

    test(
      'Merges identical intervals values',
      () => {
        const intervals = [
          { start: 1, end: 2, values: ['a'] },
          { start: 1, end: 2, values: ['b'] },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 1, end: 2, values: ['a', 'b'] },
        ]);
      }
    )

    test(
      'Doesn\'t merge non-overlapping intervals',
      () => {
        const intervals = [
          { start: 1, end: 2 },
          { start: 3, end: 4 },
        ];

        expect(mergeIntervals(intervals)).toEqual([
          { start: 1, end: 2 },
          { start: 3, end: 4 },
        ]);
      }
    )
  }
)