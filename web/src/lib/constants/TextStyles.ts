// ~ Styling lookup table for elements
const TextStyles: {[key: string]: string} = {
  text: '',
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  quote: 'border-l-4 pl-3 border-zinc-700 dark:border-amber-50 print:dark:border-zinc-700',
  callout: `
    p-3
    bg-black/5 dark:bg-white/5
    print:bg-transparent print:dark:bg-transparent
    print:before:content-['test']
    print:h-full print:w-full
    print:before:h-full print:before:w-full
    print:before:border-[999px] print:before:-mt-3 print:before:-ml-3 print:before:border-black/5
    relative print:overflow-hidden print:before:absolute
  `,
  
  // -=- Inline Components -=-
  bold: 'font-bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'line-through',
};

export default TextStyles;
