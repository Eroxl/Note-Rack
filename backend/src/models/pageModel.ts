import mongoose, { Schema } from 'mongoose';

const PageSchema = new Schema({
  user: String,
  data: [
    {
      blockType: String,
      properties: [
        Schema.Types.Mixed,
      ],
      style: [
        Schema.Types.Mixed,
      ],
    },
  ],
});

const PageModel = mongoose.models.page || mongoose.model('page', PageSchema, 'Page');

export default PageModel;
