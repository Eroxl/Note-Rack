import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { stylingLookupTable } from '../../../constants/textTypes';
import Title from '../../../components/blocks/Title';

describe('Title', () => {
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

  test('Should render the title', async () => {
    const {
      properties,
      blockID,
      page,
      addBlockAtIndex,
      removeBlock,
    } = expectedProps;

    const { findByText } = render(
      <Title
        properties={properties}
        blockID={blockID}
        page={page}
        addBlockAtIndex={addBlockAtIndex}
        removeBlock={removeBlock}
      />,
    );

    const iconText = await findByText(properties.value);

    expect(iconText).toBeVisible();
    expect(iconText).toHaveAttribute('contentEditable', 'true');
  });
});
