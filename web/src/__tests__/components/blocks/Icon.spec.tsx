import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import Icon from '../../../components/blocks/Icon';

describe('Icon', () => {
  let expectedProps: {
    properties: { value: string },
    blockID: string,
    page: string,
  };

  beforeEach(() => {
    expectedProps = {
      properties: {
        value: '📘',
      },
      blockID: 'testingIconBlock',
      page: 'page',
    };

    fetchMock.resetMocks();
  });

  test('Should render the "icon" block and not render the "picker menu"', async () => {
    const { properties, blockID, page } = expectedProps;

    const { findByText, findByLabelText } = render(
      <Icon properties={properties} blockID={blockID} page={page} />,
    );

    const iconText = await findByText(properties.value);
    const emojiSelectorMenu = (await findByLabelText('Emoji Mart™')).closest('div');

    expect(iconText).toBeVisible();

    // EROXL: Couldn't figure out a way to load tailwind css into jest
    expect(emojiSelectorMenu).toHaveClass('hidden');
  });

  test('Emoji picker menu should be toggleable', async () => {
    const { properties, blockID, page } = expectedProps;

    const { findByText, findByLabelText } = render(
      <Icon properties={properties} blockID={blockID} page={page} />,
    );

    const iconButton = await findByText(properties.value);
    const emojiSelectorMenu = (await findByLabelText('Emoji Mart™')).closest('div');

    expect(emojiSelectorMenu).toHaveClass('hidden');
    fireEvent.click(iconButton);
    expect(emojiSelectorMenu).not.toHaveClass('hidden');
  });

  test('Emoji picker menu should change the emoji', async () => {
    const { properties, blockID, page } = expectedProps;
    const requestURL = `${process.env.NEXT_PUBLIC_API_URL}/page/update-page/${page}`;

    fetchMock.mockOnceIf(requestURL, '{}');

    const { findByText, findByLabelText } = render(
      <Icon properties={properties} blockID={blockID} page={page} />,
    );

    const iconButton = await findByText(properties.value);
    fireEvent.click(iconButton);
    const emojiSelectionButton = await findByLabelText('😞, disappointed');
    fireEvent.click(emojiSelectionButton);

    expect(iconButton).toHaveTextContent('😞');
  });
});
