import mongoose, { Schema } from 'mongoose';

export interface IPage {
  user: string;
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
    username: string;
  }[];
  style: {};
  data: {
    blockType: string;
    properties: {};
    children: [];
  }[];
}

const PageSchema = new Schema<IPage>({
  user: String,
  permissions: [
    {
      read: Boolean,
      write: Boolean,
      admin: Boolean,
      username: String
    }
  ],
  style: {},
  data: [
    {
      blockType: String,
      properties: {},
      children: [],
    },
  ],
});

const PageModel = mongoose.models.page as mongoose.Model<IPage> || mongoose.model<IPage>('page', PageSchema);

export default PageModel;
