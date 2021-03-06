import mongoose, { Schema } from 'mongoose';

const PageSchema = new Schema({
  user: String,
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
