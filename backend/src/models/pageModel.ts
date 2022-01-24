import mongoose, { Schema } from 'mongoose';

const PageSchema = new Schema({
  user: Schema.Types.String,
  data: [
    {
      type: 'info',
      properties: [
        {
          type: 'icon',
          value: '📝',
        },
      ],
      style: [
        {
          colour: 'FFFBEB',
        },
      ],
    },
    {
      type: String,
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
