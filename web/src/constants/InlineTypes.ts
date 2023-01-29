import getNestableStyleBlock from '../components/inlineBlocks/getNestableStyleBlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockTypes: {[key: string]: any} = {
  // -=- Nestable Style Components -=-
  'bold': getNestableStyleBlock('font-bold'),
  'italic': getNestableStyleBlock('italic'),
  'strikethrough': getNestableStyleBlock('line-through'),
  'underline': getNestableStyleBlock('underline'),
};

export default BlockTypes;
