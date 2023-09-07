import { useState, useRef, useEffect } from 'react';

import SelectionManger from '../classes/SelectionManager';

const useSelectable = (type: string, item: () => unknown, deps: unknown[] = []): [boolean, React.MutableRefObject<unknown>] => {
  const [selected, setSelected] = useState(false);
  const selectableRef = useRef<unknown>(null);

  useEffect(() => {
    const items = item();

    SelectionManger.Instance.addToSelectable(selectableRef, type, () => items, setSelected);
    return () => SelectionManger.Instance.removeFromSelectable(selectableRef, type);
  }, deps);

  return [selected, selectableRef];
};

export default useSelectable;
