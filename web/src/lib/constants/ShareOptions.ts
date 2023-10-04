const dropdownInfo: {
    title: string,
    description: string,
    permissions: {
      admin: boolean,
      write: boolean,
      read: boolean,
    }
}[] = [
  {
    title: 'Full access',
    description: 'Can edit, delete, and share',
    permissions: {
      admin: true,
      write: true,
      read: true,
    },
  },
  {
    title: 'Edit only',
    description: 'Can edit, but not delete or share',
    permissions: {
      admin: false,
      write: true,
      read: true,
    },
  },
  {
    title: 'View only',
    description: 'Cannot edit, delete, or share',
    permissions: {
      admin: false,
      write: false,
      read: true,
    },
  },
];

export { dropdownInfo };
