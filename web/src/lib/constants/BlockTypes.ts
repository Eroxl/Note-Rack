import Icon from '../../components/blocks/Icon';
import Title from '../../components/pageCustomization/Title';
import TextBlock from '../../components/blocks/TextBlock';
import PageBlock from '../../components/blocks/PageBlock';
import MathBlock from '../../components/blocks/MathBlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockTypes: {[key: string]: any} = {
  // -=- Page Components -=-
  'page-icon': Icon,
  'page-title': Title,

  // -=- Text Based Components -=-
  text: TextBlock,
  h1: TextBlock,
  h2: TextBlock,
  h3: TextBlock,
  h4: TextBlock,
  h5: TextBlock,

  // -=- Semi-Text Based Components -=-
  quote: TextBlock,
  callout: TextBlock,

  // -=- Inline Page Component -=-
  page: PageBlock,

  // -=- Other Components -=-
  math: MathBlock,
};

export default BlockTypes;
