import Icon from '../components/blocks/Icon';
import Title from '../components/blocks/Title';
import Text from '../components/blocks/Text';
import PageBlock from '../components/blocks/PageBlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockTypes: {[key: string]: any} = {
  // -=- Page Components -=-
  'page-icon': Icon,
  'page-title': Title,

  // -=- Text Based Components -=-
  text: Text,
  h1: Text,
  h2: Text,
  h3: Text,
  h4: Text,
  h5: Text,

  // -=- Semi-Text Based Components -=-
  quote: Text,
  callout: Text,

  // -=- Inline Page Component -=-
  page: PageBlock,
};

export default BlockTypes;
