import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { stylingLookupTable } from '../../../constants/textTypes';
import Text from '../../../components/blocks/Text';

describe('Text', () => {
  let expectedProps: {
    properties: { value: string },
    blockID: string,
    page: string,
    addBlockAtIndex: () => void,
    removeBlock: () => void,

  };

  beforeEach(() => {
    expectedProps = {
      properties: {
        value: 'Example text',
      },
      blockID: 'testingIconBlock',
      page: 'page',
      addBlockAtIndex: (): void => {
        throw new Error('Remove block function not implemented.');
      },
      removeBlock: (): void => {
        throw new Error('Remove block function not implemented.');
      },
    };
  });

  ['h1', 'h2', 'h3', 'h4', 'h5', 'quote', 'callout'].forEach((textType) => {
    test(`Should render ${textType}`, async () => {
      const {
        properties,
        blockID,
        page,
        addBlockAtIndex,
        removeBlock,
      } = expectedProps;

      const { findByText } = render(
        <Text
          properties={properties}
          blockID={blockID}
          page={page}
          type={textType}
          addBlockAtIndex={addBlockAtIndex}
          removeBlock={removeBlock}
        />,
      );

      const iconText = await findByText(properties.value);

      expect(iconText).toBeVisible();
      expect(iconText).toHaveAttribute('contentEditable', 'true');
      expect(iconText).toHaveClass(stylingLookupTable[textType]);
    });
  });
});
