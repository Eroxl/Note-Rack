import mongoose, { Schema } from 'mongoose';

const PageTreeSchema = new Schema({});

PageTreeSchema.add({
  _id: Schema.Types.String,
  subPages: [PageTreeSchema],
});

const PageTreeModel = mongoose.models.pageTree || mongoose.model('pageTree', PageTreeSchema, 'PageTree');

export default PageTreeModel;
