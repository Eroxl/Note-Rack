import BlockTypes from "../constants/BlockTypes"

interface Block {
  _id: string,
  blockType: keyof typeof BlockTypes,
  properties: Record<string, unknown>,
  children: Block[]
}

export interface UserPermissions {
  read: boolean,
  write: boolean,
  admin: boolean,
}

export interface Permissions {
  [key: string]: {
    read: boolean,
    write: boolean,
    admin: boolean,
    email: string,
  }
}

interface PageDataInterface {
  status: string,
  message?: {
    style: {
      colour: {
        r: number,
        g: number,
        b: number,
      }
      name: string,
      icon: string,
    },
    data: Block[],
    userPermissions: UserPermissions,
    permissions?: Permissions,
  },
}

export default PageDataInterface;
