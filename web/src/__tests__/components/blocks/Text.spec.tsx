/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { act } from 'react-dom/test-utils';

import TextStyles from '../../../constants/TextStyles';
import textKeybinds from '../../../lib/textKeybinds';
import TextBlock from '../../../components/blocks/TextBlock';
import PageDataInterface from '../../../types/pageTypes';
import BaseBlock from '../../../components/blocks/BaseBlock';

describe('Text', () => {
  let expectedProps: {
    properties: { value: string },
    blockID: string,
    page: string,
    pageData: PageDataInterface
    setPageData: () => void,
    setCurrentBlockType: () => void,
  };

  beforeEach(() => {
    expectedProps = {
      properties: {
        value: 'Test text',
      },
      blockID: 'testingTextBlock',
      page: 'page',
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
      setPageData: (): void => {},
      setCurrentBlockType: () => {},
    };

    fetchMock.resetMocks();
  });

  ['h1', 'h2', 'h3', 'h4', 'h5', 'quote', 'callout'].forEach((textType) => {
    test(`Should render ${textType}`, async () => {
      const {
        properties,
        blockID,
        page,
        pageData,
        setPageData,
        setCurrentBlockType,
      } = expectedProps;

      const { findByText } = render(
        <TextBlock
          properties={properties}
          blockID={blockID}
          page={page}
          type={textType}
          pageData={pageData}
          setPageData={setPageData}
          index={0}
          setCurrentBlockType={setCurrentBlockType}
        />,
      );

      const textElement = await findByText(properties.value);

      expect(textElement).toBeVisible();
      expect(textElement).toHaveAttribute('contentEditable', 'true');
      expect(textElement).toHaveClass(TextStyles[textType]);
    });
  });

  textKeybinds.forEach((textObject) => {
    if (textObject.customFunc) return;
    test(`Should allow style change from normal text to ${textObject.type}`, async () => {
      const {
        properties,
        blockID,
        page,
        pageData,
        setPageData,
      } = expectedProps;
      fetchMock.mockOnce('{}');

      if (TextStyles[textObject.type]) {
        const { findByText } = render(
          <DndProvider backend={HTML5Backend}>
            <BaseBlock
              index={0}
              blockID={blockID}
              page={page}
              blockType="text"
              pageData={pageData}
              properties={properties}
              setPageData={setPageData}
              children={[]}
              isMenuOpen={false}
              setIsMenuOpen={(): void => {}}
            />
          </DndProvider>,
        );

        const textElement = await findByText(properties.value);

        expect(textElement).toBeVisible();
        expect(textElement).toHaveAttribute('contentEditable', 'true');

        await act(async () => {
          textElement.innerHTML = '';

          userEvent.type(textElement, `${textObject.plainTextKeybind}{space}`);

          // Wait 100ms for the change to be applied
          // eslint-disable-next-line no-promise-executor-return
          await new Promise((r) => setTimeout(r, 100));
        });

        expect(textElement).toBeEmptyDOMElement();

        expect(textElement).toHaveClass(TextStyles[textObject.type]);
      }
    });
  });
});
