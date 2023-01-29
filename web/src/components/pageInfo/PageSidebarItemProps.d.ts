/* eslint-disable import/prefer-default-export */
interface PageSidebarItemProps {
  _id: string,
  style: Record<string, unknown>,
  expanded: boolean,
  parentExpanded: boolean,
  subPages: PageSidebarItemProps[]
}

export type { PageSidebarItemProps };
