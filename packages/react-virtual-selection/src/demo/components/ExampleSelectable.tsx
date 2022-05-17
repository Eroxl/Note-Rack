import React from 'react';

import useSelectable from '../../hooks/useSelectable';

interface ExampleSelectableProps {
  exampleData: unknown,
}

const ExampleSelectable: React.FC<ExampleSelectableProps> = (props) => {
  const { exampleData } = props;

  const [isSelected, selectableElement] = useSelectable(
    'selectable-1',
    () => ({ exampleData }),
  );

  return (
    <div
      draggable={false}
      className={`w-full h-full bg-gray-600 ${isSelected && 'outline outline-green-300'}`}
      ref={selectableElement as React.LegacyRef<HTMLDivElement>}
    />
  );
};

export default ExampleSelectable;
