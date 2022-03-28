import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import Icon from '../../../components/blocks/Icon';

describe('Icon', () => {
  let expectedProps: {
    value: string,
    blockID: string,
    page: string,
  };

  beforeEach(() => {
    expectedProps = {
      value: '📘',
      blockID: 'testingIconBlock',
      page: 'page',
    };

    fetchMock.resetMocks();
  });

  test('Should render the "icon" block and not render the "picker menu"', async () => {
    const { value, page } = expectedProps;

    const { findByText, findByLabelText } = render(
      <Icon icon={value} page={page} />,
    );

    const iconText = await findByText(value);
    const emojiSelectorMenu = (await findByLabelText('Emoji Mart™')).closest('div');

    expect(iconText).toBeVisible();

    // EROXL: Couldn't figure out a way to load tailwind css into jest
    expect(emojiSelectorMenu).toHaveClass('hidden');
  });

  test('Emoji picker menu should be toggleable', async () => {
    const { value, page } = expectedProps;

    const { findByText, findByLabelText } = render(
      <Icon icon={value} page={page} />,
    );

    const iconButton = await findByText(value);
    const emojiSelectorMenu = (await findByLabelText('Emoji Mart™')).closest('div');

    expect(emojiSelectorMenu).toHaveClass('hidden');
    fireEvent.click(iconButton);
    expect(emojiSelectorMenu).not.toHaveClass('hidden');
  });

  test('Emoji picker menu should change the emoji', async () => {
    const { value, page } = expectedProps;

    fetchMock.mockOnce('{}');

    const { findByText, findByLabelText } = render(
      <Icon icon={value} page={page} />,
    );

    const iconButton = await findByText(value);
    fireEvent.click(iconButton);
    const emojiSelectionButton = await findByLabelText('😞, disappointed');
    fireEvent.click(emojiSelectionButton);

    expect(iconButton).toHaveTextContent('😞');
  });
});
