import React, { useEffect } from 'react';

import useSelectionCollector from '../hooks/useSelectionCollector';
import Selectable from '../components/Selectable';
import ExampleSelectable from './components/ExampleSelectable';

const App = () => {
  const selectionData = useSelectionCollector('selectable-1');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(selectionData);
  }, [selectionData]);

  return (
    <Selectable accepts="selectable-1">
      <div className="w-screen h-screen bg-gray-700">
        <div className="grid w-full h-full grid-flow-row grid-cols-3 gap-10 p-10">
          <ExampleSelectable exampleData={{ test: 1 }} key="1" />
          <ExampleSelectable exampleData={{ test: 2 }} key="2" />
          <ExampleSelectable exampleData={{ test: 3 }} key="3" />
          <ExampleSelectable exampleData={{ test: 4 }} key="4" />
          <ExampleSelectable exampleData={{ test: 5 }} key="5" />
          <ExampleSelectable exampleData={{ test: 6 }} key="6" />
          <ExampleSelectable exampleData={{ test: 7 }} key="7" />
          <ExampleSelectable exampleData={{ test: 8 }} key="8" />
          <ExampleSelectable exampleData={{ test: 9 }} key="9" />
        </div>
      </div>
    </Selectable>
  );
};

export default App;
