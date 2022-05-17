import { useState, useRef, useEffect } from 'react';

import SelectionManger from '../classes/SelectionManager';

const useSelectable = (type: string, item: () => unknown) => {
  const [selected, setSelected] = useState(false);
  const selectableRef = useRef<unknown>(null);

  useEffect(() => {
    SelectionManger.Instance.addToSelectable(selectableRef, type, item, setSelected);
    return () => SelectionManger.Instance.removeFromSelectable(selectableRef, type);
  });

  return [selected, selectableRef];
};

export default useSelectable;
