import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import Title from '../../../components/blocks/Title';

describe('Title', () => {
  let expectedProps: {
    properties: { value: string },
    blockID: string,
    page: string,
    type: string,
    addBlockAtIndex: () => void,
  };

  beforeEach(() => {
    expectedProps = {
      properties: {
        value: 'Example text',
      },
      blockID: 'testingIconBlock',
      page: 'page',
      type: '',
      addBlockAtIndex: (): void => {
        throw new Error('Remove block function not implemented.');
      },
    };
  });

  test('Should render the title', async () => {
    const {
      properties,
      blockID,
      page,
      type,
      addBlockAtIndex,
    } = expectedProps;

    const { findByText } = render(
      <Title
        properties={properties}
        blockID={blockID}
        page={page}
        addBlockAtIndex={addBlockAtIndex}
        type={type}
      />,
    );

    const titleText = await findByText(properties.value);

    expect(titleText).toBeVisible();
    expect(titleText).toHaveAttribute('contentEditable', 'true');
  });
});
