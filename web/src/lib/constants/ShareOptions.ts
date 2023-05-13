enum DropdownOptions {
  FullAccess,
  EditOnly,
  ViewOnly,
}

const dropdownInfo: {
  [key: number]: {
    title: string,
    description: string,
    permissions: {
      admin: boolean,
      write: boolean,
      read: boolean,
    }
  }
} = {
  [DropdownOptions.FullAccess]: {
    title: 'Full access',
    description: 'Can edit, delete, and share',
    permissions: {
      admin: true,
      write: true,
      read: true,
    },
  },
  [DropdownOptions.EditOnly]: {
    title: 'Edit only',
    description: 'Can edit, but not delete or share',
    permissions: {
      admin: false,
      write: true,
      read: true,
    },
  },
  [DropdownOptions.ViewOnly]: {
    title: 'View only',
    description: 'Cannot edit, delete, or share',
    permissions: {
      admin: false,
      write: false,
      read: true,
    },
  },
};

export { DropdownOptions, dropdownInfo };
