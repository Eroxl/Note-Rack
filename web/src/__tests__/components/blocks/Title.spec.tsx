import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Title from '../../../components/blocks/Title';
import PageDataInterface from '../../../types/pageTypes';

describe('Title', () => {
  let expectedProps: {
    value: string,
    blockID: string,
    page: string,
    type: string,
    setPageData: () => void,
    pageData: PageDataInterface
  };

  beforeEach(() => {
    expectedProps = {
      value: 'Example text',
      blockID: 'testingIconBlock',
      page: 'page',
      type: '',
      setPageData: (): void => {
        throw new Error('Remove block function not implemented.');
      },
      pageData: {
        status: '',
        message: {
          style: {
            colour: {
              r: 1,
              g: 2,
              b: 3,
            },
            name: 'Page',
            icon: '🌳',
          },
          data: [],
        },
      },
    };
  });

  test('Should render the title', async () => {
    const {
      value,
      pageData,
      setPageData,
    } = expectedProps;

    const { findByText } = render(
      <DndProvider backend={HTML5Backend}>
        <Title
          index={2}
          page=""
          title={value}
          pageData={pageData}
          setPageData={setPageData}
        />
      </DndProvider>,
    );

    const titleText = await findByText(value);

    expect(titleText).toBeVisible();
    expect(titleText).toHaveAttribute('contentEditable', 'true');
  });
});
