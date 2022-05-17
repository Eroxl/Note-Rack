import { useState } from 'react';

import SelectionManager from '../classes/SelectionManager';

const useSelectionCollector = (type: string) => {
  const [selectionData, setSelectionData] = useState<unknown[]>([]);

  SelectionManager.Instance.registerSelectableWatcher(type, setSelectionData);

  return selectionData;
};

export default useSelectionCollector;
