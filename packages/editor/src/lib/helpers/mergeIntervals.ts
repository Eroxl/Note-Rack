export type Interval = {
  start: number,
  end: number
}

const cloneInterval = (interval: Interval) => {
  return JSON.parse(JSON.stringify(interval));
}

/**
 * Checks if the intervals are completely merged (assumes the intervals are sorted)
 * 
 * @param intervals The sorted intervals to check
 * @returns Whether or not the intervals are completely merged
 */
const isCompletelyMerged = (intervals: Interval[]) => {
  let isCompletelyMerged = true;

  intervals.forEach((interval) => {
    if (interval.start !== interval.end) isCompletelyMerged = false;
  });

  return isCompletelyMerged;
}

const isIntervalContained = (interval1: Interval, interval2: Interval) => {
  return interval2.start >= interval1.start && interval2.end <= interval1.end;
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

    newInterval[key] = [...currentIntervalValue, ...intervalToMergeValue];
    return;
  });

  return newInterval;
}

const mergeFullyOverlappingIntervals = <T extends Interval & Record<string, unknown>>(intervalA: T, intervalB: T): T[] => {
  const before = cloneInterval(intervalA);
  const after = cloneInterval(intervalA);

  before.end = intervalB.start - 1;
  after.start = intervalB.end + 1;

  const middle = {
    start: intervalB.start,
    end: intervalB.end,
    ...mergeIntervalValues(intervalA, intervalB),
  } as T

  return [
    before,
    middle,
    after,
  ];
}

const mergePartiallyOverlappingIntervals = <T extends Interval & Record<string, unknown>>(intervalA: T, intervalB: T): T[] => {
  const before = cloneInterval(intervalA);
  const after = cloneInterval(intervalB);

  before.end = intervalB.start - 1
  after.start = intervalA.end + 1;

  const middle = {
    start: intervalB.start,
    end: intervalA.end,
    ...mergeIntervalValues(intervalA, intervalB),
  } as T

  return [
    before,
    middle,
    after,
  ]
};

const mergeIntervals = <T extends Interval & { [key: string]: unknown }>(intervals: T[]): T[] => {
  const sortedIntervals = intervals.sort((a, b) => a.start - b.start);

  // ~ If the intervals are completely merged, return them
  if (isCompletelyMerged(sortedIntervals)) return sortedIntervals;

  let currentIndex = 0;

  while (true) {
    const currentInterval = sortedIntervals[currentIndex];
    const intervalToMerge = sortedIntervals[currentIndex + 1];

    if (!currentInterval || !intervalToMerge) break;

    if (currentInterval.end < intervalToMerge.start) {
      currentIndex += 1;
      continue;
    }

    let newIntervals: T[];

    if (isIntervalIdentical(currentInterval, intervalToMerge)) {
      newIntervals = [{
        ...cloneInterval(currentInterval),
        ...mergeIntervalValues(currentInterval, intervalToMerge),
      }];
    } else if (isIntervalContained(currentInterval, intervalToMerge)) {
      newIntervals = mergeFullyOverlappingIntervals(currentInterval, intervalToMerge);
    } else {
      newIntervals = mergePartiallyOverlappingIntervals(currentInterval, intervalToMerge);
    }

    // ~ Remove the interval that was merged
    sortedIntervals.splice(currentIndex, 2, ...newIntervals);
    currentIndex += 1;
  }

  return sortedIntervals;
};

export default mergeIntervals;
