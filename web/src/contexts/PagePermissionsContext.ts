import { createContext } from 'react';

import type { UserPermissions, Permissions } from '../lib/types/pageTypes';

interface PagePermissionsContextProps {
  permissionsOnPage?: UserPermissions,
  isMenuOpen: boolean,
  setIsMenuOpen: (isMenuOpen: boolean) => void,
  isPagePublic: boolean,
  setIsPagePublic: (isPagePublic: boolean) => void,
  currentPermissions: Permissions,
  setCurrentPermissions: (currentPermissions: Permissions) => void,
}

const PagePermissionContext = createContext<PagePermissionsContextProps>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
  isPagePublic: false,
  setIsPagePublic: () => {},
  currentPermissions: {},
  setCurrentPermissions: () => {},
});

export default PagePermissionContext;
