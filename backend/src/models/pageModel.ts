import mongoose, { Schema } from 'mongoose';

const PageSchema = new Schema({
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

const PageModel = mongoose.models.page || mongoose.model('page', PageSchema, 'Page');

export default PageModel;
