import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import { stylingLookupTable, textKeybinds } from '../../../constants/textTypes';
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
        throw new Error('Add block function not implemented.');
      },
      removeBlock: (): void => {
        throw new Error('Remove block function not implemented.');
      },
    };

    fetchMock.resetMocks();
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

  textKeybinds.forEach((textObject) => {
    test(`Should allow style change from normal text to ${textObject.type}`, async () => {
      const {
        properties,
        blockID,
        page,
        addBlockAtIndex,
        removeBlock,
      } = expectedProps;

      fetchMock.mockOnce('{}');

      const { findByText } = render(
        <Text
          properties={properties}
          blockID={blockID}
          page={page}
          type="text"
          addBlockAtIndex={addBlockAtIndex}
          removeBlock={removeBlock}
        />,
      );

      const textElement = await findByText(properties.value);

      expect(textElement).toBeVisible();
      expect(textElement).toHaveAttribute('contentEditable', 'true');

      fireEvent.input(textElement, {
        target: { innerText: `${textObject.plainTextKeybind} ` },
      });

      if (stylingLookupTable[textObject.type]) {
        expect(textElement).toHaveClass(stylingLookupTable[textObject.type]);
      }
    });
  });
});
