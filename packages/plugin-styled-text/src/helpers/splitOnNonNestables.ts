import { Interval } from "./mergeIntervals";

const splitOnNonNestables = (
  start: number,
  end: number,
  styles: (Interval & { type: string[] })[],
  nestables: string[] = [],
) => {
  const sortedStyles = styles.sort((a, b) => a.start - b.start);

  const outputIntervals: (Partial<Interval>)[] = [{
    start,
  }];

  sortedStyles.forEach((style) => {
    if (
      style.end > end
      || style.start < start
    ) return;

    const areAllStylesNestable = style.type.every((type) => nestables.includes(type))

    if (areAllStylesNestable) return;

    outputIntervals.at(-1)!.end = style.start;
  
    outputIntervals.push({
      start: style.end,
    })
  });


  outputIntervals[outputIntervals.length - 1].end = end;

  return outputIntervals as typeof styles;
};

export default splitOnNonNestables;
