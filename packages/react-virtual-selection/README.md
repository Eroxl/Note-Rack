<p align="center">
  <img src="https://raw.githubusercontent.com/Eroxl/Note-Rack/main/packages/react-virtual-selection/images/Example.gif" width="450"/>
</p>

# React Virtual Selection
Select elements using a native OS like selector

## Installation
```bash
npm install react-virtual-selection
```
or
```bash
yarn add react-virtual-selection
```

## Usage

#### `useSelectable`

`useSelectable` accepts a type and a item function
* `type` is a string with the selection type
* `item` is a function for when the element is selected so that the selecting element can get data about the element

`usSelection` also returns `isSelected` and `selectableElement`
* `isSelected` is a boolean that can be used to detect if the element is selected
* `selectableElement` is the ref for the draggable element

```javascript
import { useSelectable } from 'react-virtual-selection';

const ExampleSelectable = (props) => {
  const { exampleData } = props;

  const [isSelected, selectableElement] = useSelectable(
    'selectable-1',
    () => ({ exampleData }),
  );

  return (
    <div
      draggable={false}
      className={`w-full h-full bg-gray-600 ${isSelected && 'outline outline-green-300'}`}
      ref={selectableElement}
    />
  );
};
```

#### `useSelectionCollector`

`useSelectionCollector` accepts a type
* `type` is a string with the selection type and should match the one provided to `useSelectable` of the items you want to select

`usSelection` returns `selectionData` which is a list of data collected from the selected elements `item` function

```javascript
import React, { useEffect } from 'react';

import useSelectionCollector from '../hooks/useSelectionCollector';
import Selectable from '../components/Selectable';
import ExampleSelectable from './components/ExampleSelectable';

const App = () => {
  const selectionData = useSelectionCollector('selectable-1');

  useEffect(() => {
    console.log(selectionData);
  }, [selectionData]);

  return (
    <Selectable accepts="selectable-1">
      <div className="w-screen h-screen bg-gray-700">
        <div className="grid w-full h-full grid-flow-row grid-cols-3 gap-10 p-10">
          <ExampleSelectable exampleData={{ test: 1 }} key="1" />
          <ExampleSelectable exampleData={{ test: 1 }} key="1" />
        </div>
      </div>
    </Selectable>
  );
};

export default App;
```

#### `Selectable`
Selectable is a component that allows elements to be selectable it contains all the logic for creating the selection square and more

##### `Selectable` Props
* `accepts`: String
  The types of selectable elements this component should handle
* `children`: React Node or Nodes
  Children of the component
* `selectionStyle`: CSS Style
  Style of the selection square
* `selectionClassName`: String
  CSS classes of the selection square
