export type Interval = {
  start: number,
  end: number
}

export type ValueMerger = <T extends Interval & Record<string, unknown>>(intervalA: T, intervalB: T) => Record<string, unknown>;

const cloneInterval = (interval: Interval) => {
  return JSON.parse(JSON.stringify(interval));
}

const isIntervalContained = (interval1: Interval, interval2: Interval) => {
  return (
    interval2.start >= interval1.start && interval2.end < interval1.end ||
    interval2.start > interval1.start && interval2.end <= interval1.end
  );
}

const isIntervalIdentical = (interval1: Interval, interval2: Interval) => {
  return interval1.start === interval2.start && interval1.end === interval2.end;
}

const mergeIntervalValues = <T extends Interval & Record<string, unknown>>(
  intervalA: T,
  intervalB: T,
): Record<string, unknown> => {
  const newInterval: Record<string, unknown> = {};

  // ~ Merge the values of the intervals
  Object.keys(intervalB).forEach((key) => {
    if (key === 'start' || key === 'end') return;

    const currentIntervalValue = intervalA[key];
    const intervalToMergeValue = intervalB[key];

    if (!Array.isArray(currentIntervalValue) || !Array.isArray(intervalToMergeValue)) return;

    newInterval[key] = Array.from(new Set([...currentIntervalValue, ...intervalToMergeValue]))
    return;
  });

  return newInterval;
}

const mergeFullyOverlappingIntervals = <T extends Interval & Record<string, unknown>>(
  intervalA: T,
  intervalB: T,
  valueMerger: ValueMerger,
): T[] => {
  const before = cloneInterval(intervalA);
  const after = cloneInterval(intervalA);

  before.end = intervalB.start;
  after.start = intervalB.end;

  const middle = {
    start: intervalB.start,
    end: intervalB.end,
    ...valueMerger(intervalA, intervalB),
  } as T

  return [
    before,
    middle,
    after,
  ];
}

const mergePartiallyOverlappingIntervals = <T extends Interval & Record<string, unknown>>(
  intervalA: T,
  intervalB: T,
  valueMerger: ValueMerger,
): T[] => {
  const before = cloneInterval(intervalA);
  const after = cloneInterval(intervalB);

  before.end = intervalB.start;
  after.start = intervalA.end;

  const middle = {
    start: intervalB.start,
    end: intervalA.end,
    ...valueMerger(intervalA, intervalB),
  } as T

  return [
    before,
    middle,
    after,
  ]
};

const mergeIntervals = <T extends Interval & { [key: string]: unknown }>(
  intervals: T[],
  valueMerger: ValueMerger = mergeIntervalValues,
): T[] => {
  const sortedIntervals = intervals.sort((a, b) => a.start - b.start);

  let currentIndex = 0;

  while (true) {
    const currentInterval = sortedIntervals[currentIndex];
    const intervalToMerge = sortedIntervals[currentIndex + 1];

    if (!currentInterval || !intervalToMerge) break;

    if (currentInterval.end <= intervalToMerge.start) {
      currentIndex += 1;
      continue;
    }

    let newIntervals: T[];

    if (isIntervalIdentical(currentInterval, intervalToMerge)) {
      newIntervals = [{
        ...cloneInterval(currentInterval),
        ...valueMerger(currentInterval, intervalToMerge),
      }];
    } else if (isIntervalContained(currentInterval, intervalToMerge)) {
      newIntervals = mergeFullyOverlappingIntervals(currentInterval, intervalToMerge, valueMerger);
    } else {
      newIntervals = mergePartiallyOverlappingIntervals(currentInterval, intervalToMerge, valueMerger);
    }

    // ~ Remove the interval that was merged
    sortedIntervals.splice(currentIndex, 2, ...newIntervals);
    currentIndex += 1;
  }

  return sortedIntervals;
};

export default mergeIntervals;
