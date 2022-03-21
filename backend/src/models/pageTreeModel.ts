import mongoose, { Schema } from 'mongoose';

const PageTreeSchema = new Schema({});

PageTreeSchema.add({
  _id: Schema.Types.String,
  expanded: Schema.Types.Boolean,
  subPages: [PageTreeSchema],
});

const PageTreeModel = mongoose.models.pageTree || mongoose.model('pageTree', PageTreeSchema, 'PageTree');

export default PageTreeModel;
