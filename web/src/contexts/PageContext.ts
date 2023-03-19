import { createContext } from 'react';

import PageDataInterface from '../lib/types/pageTypes';

interface PageContextProps {
  pageData?: PageDataInterface['message'],
  setPageData: React.Dispatch<React.SetStateAction<PageDataInterface['message']>>,
}

const PageContext = createContext<PageContextProps>({
  setPageData: (_) => {},
});

export default PageContext;
