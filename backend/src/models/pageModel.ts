import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const PageSchema = new Schema({
  user: String,
  data: [
    {
      blockType: String,
      blockID: {
        type: String,
        default: () => crypto.randomBytes(20).toString('hex'),
      },
      properties: {},
      style: {},
      children: {},
    },
  ],
});

const PageModel = mongoose.models.page || mongoose.model('page', PageSchema, 'Page');

export default PageModel;
