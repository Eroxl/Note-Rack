import Plugin from '@note-rack/editor/types/Plugin';

import createHandle from './components/createHandle';
import createWrapper from './components/createWrapper';

const createDnDPlugin = (
  wrapperStyle: {
    style?: React.CSSProperties,
    className?: string,
    hoveredStyle?: React.CSSProperties,
    hoveredClass?: string,
  } = {},
  handleIcon?: React.ReactNode,
  handleStyle: {
    style?: React.CSSProperties,
    className?: string,
  } = {},
): Plugin => {
  return {
    blockWrappers: [
      createWrapper(
        createHandle(
          handleIcon,
          handleStyle.style,
          handleStyle.className,
        ),
        wrapperStyle.style,
        wrapperStyle.className,
        wrapperStyle.hoveredStyle,
        wrapperStyle.hoveredClass,
      ),
    ],
  }
};

export default createDnDPlugin;
