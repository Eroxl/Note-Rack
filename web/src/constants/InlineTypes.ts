import getNestableStyleBlock from '../components/inlineBlocks/getNestableStyleBlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InlineTypes: {[key: string]: any} = {
  // -=- Nestable Style Components -=-
  'bold': getNestableStyleBlock('font-bold', '**'),
  'italic': getNestableStyleBlock('italic', '*'),
  'strikethrough': getNestableStyleBlock('line-through', '--'),
  'underline': getNestableStyleBlock('underline', '__'),
};

export default InlineTypes;
